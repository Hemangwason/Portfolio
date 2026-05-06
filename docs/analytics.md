# Analytics

This portfolio uses **PostHog** for visitor analytics: pageviews, click tracking
(autocapture), scroll depth, and drop-off funnels. The provider is wired in
[`app/components/Analytics.tsx`](../app/components/Analytics.tsx) and mounted
once in [`app/layout.tsx`](../app/layout.tsx).

## How tracking works

- **Pageviews** — captured automatically on every route change via
  `capture_pageview: 'history_change'`. Each event carries `$pathname`,
  `$referrer`, `$device_type`, `$browser`, `$current_url`.
- **Clicks** — `autocapture: true` records every click and form submit. Each
  event carries `$elements_chain`, `$el_text`, `$event_type`, plus the path
  the click happened on.
- **Scroll depth & drop-off** — `capture_pageleave: true` fires a `$pageleave`
  event when the user navigates away. The event includes
  `$prev_pageview_max_scroll_percentage` (0–1) and
  `$prev_pageview_max_content_percentage`. **This is the source of truth for
  "where do people stop reading."**
- **Session recording is OFF** by default (privacy + free-tier cost).

## Required environment

Set these in `.env.local` (template in [`.env.example`](../.env.example)):

| Var | Scope | Purpose |
|-----|-------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | browser | Project API key, starts with `phc_` |
| `NEXT_PUBLIC_POSTHOG_HOST` | browser | `https://us.i.posthog.com` or `https://eu.i.posthog.com` |
| `POSTHOG_PERSONAL_API_KEY` | server-only | Bearer token for read API, starts with `phx_` |
| `POSTHOG_PROJECT_ID` | server-only | Numeric project ID from the project URL |

Without `NEXT_PUBLIC_POSTHOG_KEY`, [`Analytics.tsx`](../app/components/Analytics.tsx)
silently no-ops — safe to ship before keys exist.

## How Claude queries the data

PostHog exposes a **HogQL** REST endpoint that runs SQL-like queries against
the event store. Claude reads the env vars from `.env.local` and calls:

```bash
curl -s -X POST \
  "$NEXT_PUBLIC_POSTHOG_HOST/api/projects/$POSTHOG_PROJECT_ID/query/" \
  -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": {"kind": "HogQLQuery", "query": "<SQL>"}}'
```

Response shape: `{ "results": [[col1, col2, ...], ...], "columns": [...] }`.

### Canonical queries

Each query is a single HogQL `<SQL>` string.

#### 1. Top pages by views (last 30 days)

```sql
SELECT properties.$pathname AS path, count() AS views
FROM events
WHERE event = '$pageview' AND timestamp > now() - INTERVAL 30 DAY
GROUP BY path
ORDER BY views DESC
LIMIT 25
```

#### 2. Where people drop off — scroll depth per page

```sql
SELECT
  properties.$prev_pageview_pathname AS path,
  count() AS sessions,
  round(avg(properties.$prev_pageview_max_scroll_percentage) * 100, 1) AS avg_scroll_pct,
  round(quantile(0.5)(properties.$prev_pageview_max_scroll_percentage) * 100, 1) AS p50_scroll_pct,
  round(quantile(0.9)(properties.$prev_pageview_max_scroll_percentage) * 100, 1) AS p90_scroll_pct,
  countIf(properties.$prev_pageview_max_scroll_percentage < 0.25) AS bounced_top_quarter,
  countIf(properties.$prev_pageview_max_scroll_percentage >= 0.9) AS reached_bottom
FROM events
WHERE event = '$pageleave'
  AND timestamp > now() - INTERVAL 30 DAY
  AND properties.$prev_pageview_pathname IS NOT NULL
GROUP BY path
ORDER BY sessions DESC
```

Read this as: for each page, what % of the page do people see? `p50` of 30%
means half of visitors leave before the first third. `bounced_top_quarter`
counts users who scrolled less than 25% — your hard drop-off cohort.

#### 3. Most-clicked elements (autocapture)

```sql
SELECT
  properties.$pathname AS path,
  properties.$el_text AS label,
  properties.$event_type AS action,
  count() AS clicks
FROM events
WHERE event = '$autocapture' AND timestamp > now() - INTERVAL 30 DAY
GROUP BY path, label, action
ORDER BY clicks DESC
LIMIT 50
```

#### 4. Click heatmap for a single page

```sql
SELECT
  properties.$el_text AS label,
  properties.$elements_chain AS chain,
  count() AS clicks
FROM events
WHERE event = '$autocapture'
  AND properties.$pathname = '/play'
  AND timestamp > now() - INTERVAL 30 DAY
GROUP BY label, chain
ORDER BY clicks DESC
LIMIT 30
```

Swap the path for `/`, `/ground`, etc.

#### 5. Funnel drop-off — landing → /play → project click

```sql
SELECT
  countIf(event = '$pageview' AND properties.$pathname = '/') AS step1_landing,
  countIf(event = '$pageview' AND properties.$pathname = '/play') AS step2_play,
  countIf(event = '$autocapture'
    AND properties.$pathname = '/play'
    AND properties.$el_text != '') AS step3_click_anything
FROM events
WHERE timestamp > now() - INTERVAL 30 DAY
```

This is a coarse drop-off; for ordered per-session funnels prefer PostHog's
Funnel UI or the `/api/projects/<id>/insights/funnel/` endpoint.

#### 6. Device & viewport breakdown

```sql
SELECT
  properties.$device_type AS device,
  properties.$viewport_width AS width,
  count() AS pageviews
FROM events
WHERE event = '$pageview' AND timestamp > now() - INTERVAL 30 DAY
GROUP BY device, width
ORDER BY pageviews DESC
LIMIT 20
```

## When the user asks "what's happening on the site?"

Run **#1 (top pages)**, **#2 (scroll/drop-off)**, and **#3 (top clicks)** in
parallel. Synthesize the answer into 4–6 lines max. Lead with the biggest
drop-off, then the most-clicked surface, then anything anomalous (e.g. p90
scroll < 30% on a page that's supposed to convert). Don't dump tables unless
asked — give numbers in prose.

If env vars aren't set, say so and stop — don't fabricate data.

## Privacy notes

- Autocapture masks `<input>`, `<textarea>`, and `[data-ph-no-capture]`
  elements by default.
- IP geolocation is enabled but raw IPs aren't stored on events.
- Add `data-ph-no-capture` to any element you don't want recorded.
