# How to brief a project

Fill out one block per project using the template at the bottom. Then drop a zip (or a Drive link) with assets named to match `id` — I'll wire it up.

There are 12 cards on the grid today (`app/data/projects.ts`). Swap or add as you like; the same template works for new ones.

---

## Files you give me per project

Put everything in a folder named after the project's `id` (e.g. `mango-bank/`). Inside:

**Required**
- `thumbnail.jpg` (or `.mp4`) — what shows on the card in the grid.
- `writeup.md` — the long-form text (3 paragraphs-ish).

**Optional but preferred**
- `masthead.mp4` (or `.jpg`) — the big banner at the top of the project modal.
- `01.jpg`, `02.jpg`, … — any extra shots you want included in the body of the modal. I'll lay them out.

---

## Specs (so your assets look sharp)

| Slot | Format | Aspect | Recommended size | Notes |
|---|---|---|---|---|
| `thumbnail` | `.jpg` / `.png` / `.mp4` | ~3:2 wide | 1600×1080 min | Cropped via `object-cover` to a 3:2-ish tile. Pick an image whose focal point sits in the center. If video: keep it short (3–8 s loop), silent, under ~3 MB, H.264 mp4. |
| `masthead` | `.mp4` / `.jpg` | 16:9 wide | 2400×1350 | Hero at the top of the modal. Video strongly preferred — short, looping, silent, under ~6 MB. |
| in-body shots | `.jpg` / `.png` | anything | 2000 px on the long edge | I'll arrange side-by-side or full-bleed based on what you send. |

**Color profile:** export sRGB. **Filenames:** lowercase, no spaces (use `-`).

---

## What each field in the template controls

| Field | Where it shows |
|---|---|
| `id` | Internal key + filename prefix. lowercase, hyphens, unique. |
| `title` | Big heading on card + modal. 1–3 words is best. |
| `tagline` | Small line under the title on the card. One sentence, under 60 chars. |
| `kind` | `"ground"` = product work (shows under `/ground`). `"play"` = visual work (shows under `/play`). Also sets the accent dot color. |
| `year` | Shown in the "GROUND · 2025" chip on the card. |
| `tags` | The pill row at the bottom of the card. 2–4 is the sweet spot. |
| `blurb` | The 1–2 sentence teaser on the card, under the title. The hook — what shipped, what changed, the number you're proud of. |
| `role` | "Lead designer", "Principal (contract)", etc. Appears in the modal sidebar. |
| `team` | "2 designers · 5 engineers" style. Optional — leave blank if solo. |
| `client` | Studio / company name. Optional. |
| `link` | External case study or live product link. Optional. Format: `{ label: "Visit X", href: "https://…" }`. |
| `writeup` | The long-form story in the modal. Array of paragraphs — write 3 paragraphs: (1) what the product is + the problem, (2) your process + the specific decisions you made, (3) what shipped + the outcome/numbers. Each paragraph 60–90 words. |

---

## Copy-paste block (fill one per project)

```
─────────────────────────────────
PROJECT BRIEF

id:        (lowercase-with-hyphens, e.g. mango-bank)
title:     (1–3 words)
tagline:   (one sentence, <60 chars — the subtitle on the card)
kind:      (ground | play)
year:      (e.g. 2025)
tags:      (comma-separated, 2–4 items, e.g. Fintech, Mobile, Onboarding)

blurb:     (1–2 sentence teaser, shown on the card itself —
            lead with what shipped or the outcome)

role:      (your role, e.g. Lead product designer)
team:      (optional, e.g. 2 designers · 5 engineers · 1 PM)
client:    (optional, e.g. Mango Financial)
link:      (optional — label + URL, e.g. Visit Mango → https://mango.com)

writeup:
  ¶1  — what the product/brand is + the problem you walked into (60–90 words)
  ¶2  — how you approached it, the specific decisions / insights (60–90 words)
  ¶3  — what shipped + outcome (numbers, adoption, reaction) (60–90 words)

assets (drop in a folder named <id>/):
  thumbnail:  (filename, e.g. thumbnail.jpg)
  masthead:   (filename, e.g. masthead.mp4)
  extras:     (optional list — 01.jpg, 02.jpg, 03.mp4, …)

notes for me: (anything extra — "use this as the first in-body shot",
              "don't use the video, just the still", etc.)
─────────────────────────────────
```

---

## Worked example (what a filled brief looks like)

```
─────────────────────────────────
PROJECT BRIEF

id:        mango-bank
title:     Mango Bank
tagline:   A friendly neobank for freelancers
kind:      ground
year:      2024
tags:      Fintech, Mobile, Onboarding

blurb:     From empty-state to first-invoice in under three minutes.
           Card issuance flow reworked end-to-end.

role:      Senior product designer
team:      3 designers · 14 engineers · 1 PM
client:    Mango Financial
link:      (none — NDA)

writeup:
  ¶1 Mango is a neobank built for freelancers and small creative studios —
     the people who find regular banks too formal and creator-first fintechs
     too aesthetic to trust with payroll. My remit covered onboarding, card
     issuance, and the first-invoice experience.

  ¶2 The big research insight: freelancers don't want a dashboard, they
     want a receipt. I redesigned the home screen around the week's
     transactions, demoting the balance and cards to a swipe-up sheet.
     Empty states were rewritten around "get to the first invoice," not
     "get to the feature list."

  ¶3 Shipped end-to-end in Q3 2024. KYC-to-first-transaction median dropped
     from 14 minutes to 2:47. Support tickets in the first 7 days fell 61%.
     The team is porting the pattern to their business-banking tier.

assets (mango-bank/):
  thumbnail: thumbnail.mp4   (5s screen-capture of the home screen)
  masthead:  masthead.mp4    (looping onboarding flow, 8s)
  extras:    01-home.jpg, 02-invoice-flow.jpg, 03-card-issuance.mp4

notes for me: please place 02-invoice-flow.jpg between ¶2 and ¶3
─────────────────────────────────
```

---

## Delivery

- Drop the whole set in a zip or a shared Drive folder.
- Keep folder names matching `id` values — that's how I wire assets to cards.
- If you don't have a masthead yet, skip it. The modal falls back cleanly to a stylized gradient.
- If a thumbnail isn't ready, same — the card shows the gradient mesh it has today.

That's it. Send me one project at a time or all 12 in a batch — either works.
