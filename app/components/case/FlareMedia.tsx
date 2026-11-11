"use client";

import { useEffect, useRef } from "react";

export type MediaItem =
  | { type: "video"; src: string; poster?: string }
  | { type: "image"; src: string; alt: string };

/** Fraction of the height drawn straight; the rest flares outward. */
const STRAIGHT = 0.72;
const SLICE_PX = 2;
const FLARE_CURVE = 2.6;
const FLARE_MAX_PX = 120;
const FLARE_MAX_RATIO = 0.09;

type Layout = { dw: number; dh: number; flare: number; dpr: number };

/**
 * Draws a video or image into a canvas, straight for the top 72% and
 * horizontally stretched, slice by slice, toward the bottom edge — the
 * skirt-like flare of the reference case view. Video frames redraw
 * only while the sheet is mounted.
 */
export function FlareMedia({ item, label }: { item: MediaItem; label: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    let source: HTMLVideoElement | HTMLImageElement | null = null;
    let layout: Layout | null = null;
    let raf = 0;
    let vfc = 0;
    let stopped = false;

    const size = (): { w: number; h: number } => {
      if (!source) return { w: 0, h: 0 };
      if (source instanceof HTMLVideoElement) return { w: source.videoWidth, h: source.videoHeight };
      return { w: source.naturalWidth, h: source.naturalHeight };
    };

    const measure = () => {
      const { w: sw, h: sh } = size();
      if (!sw || !sh) return;
      const rect = box.getBoundingClientRect();
      const flare = Math.min(FLARE_MAX_PX, rect.width * FLARE_MAX_RATIO);
      const fit = Math.min((rect.width - flare * 2) / sw, rect.height / sh);
      const dw = Math.max(1, sw * fit);
      const dh = Math.max(1, sh * fit);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = `${dw + flare * 2}px`;
      canvas.style.height = `${dh}px`;
      canvas.width = Math.round((dw + flare * 2) * dpr);
      canvas.height = Math.round(dh * dpr);
      layout = { dw, dh, flare, dpr };
    };

    const draw = () => {
      if (!source || !layout) return;
      const { w: sw, h: sh } = size();
      if (!sw || !sh) return;
      const { dw, dh, flare, dpr } = layout;
      const scale = sh / dh;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const straightH = dh * STRAIGHT;
      ctx.drawImage(source, 0, 0, sw, straightH * scale, flare * dpr, 0, dw * dpr, straightH * dpr);

      const flareH = dh - straightH;
      const slices = Math.ceil(flareH / SLICE_PX);
      for (let i = 0; i < slices; i++) {
        const y = straightH + i * SLICE_PX;
        const h = Math.min(SLICE_PX, dh - y);
        const t = (i + 0.5) / slices;
        const extra = flare * Math.pow(t, FLARE_CURVE);
        ctx.drawImage(
          source,
          0,
          y * scale,
          sw,
          h * scale,
          (flare - extra) * dpr,
          y * dpr,
          (dw + extra * 2) * dpr,
          h * dpr + 0.75,
        );
      }
    };

    const loopVideo = (video: HTMLVideoElement) => {
      const tick = () => {
        if (stopped) return;
        draw();
        if ("requestVideoFrameCallback" in video) {
          vfc = video.requestVideoFrameCallback(tick);
        } else {
          raf = requestAnimationFrame(tick);
        }
      };
      tick();
    };

    if (item.type === "video") {
      const video = videoRef.current;
      if (!video) return;
      source = video;
      const ready = () => {
        measure();
        loopVideo(video);
      };
      if (video.readyState >= 2) ready();
      else video.addEventListener("loadeddata", ready, { once: true });
      video.play().catch(() => {});
    } else {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        source = img;
        measure();
        draw();
      };
      img.src = item.src;
    }

    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    ro.observe(box);

    return () => {
      stopped = true;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      const video = videoRef.current;
      if (vfc && video && "cancelVideoFrameCallback" in video) video.cancelVideoFrameCallback(vfc);
    };
  }, [item]);

  return (
    <div ref={boxRef} className="relative flex h-full w-full items-center justify-center md:items-start">
      {item.type === "video" && (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
        />
      )}
      <canvas ref={canvasRef} role="img" aria-label={label} className="block" />
    </div>
  );
}
