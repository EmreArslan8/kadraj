"use client";

import { forwardRef } from "react";

// Reusable media slot. When `src` (a basename like "work-01") is given it
// renders a <video> (webm → mp4) with a poster, filling the slot object-cover,
// on top of the gradient+label fallback (the poster covers the gradient until
// the video paints). Without `src` it stays a labelled gradient placeholder.
//
// Playback is started imperatively by the owning section (respecting
// prefers-reduced-motion / lazy load), so no `autoPlay` attribute is set here.

interface MediaSlotProps {
  /** Micro-label shown only for the gradient placeholder (no real media). */
  label: string;
  /** CSS aspect-ratio string, e.g. "4/5", "16/9". Omit to fill parent. */
  ratio?: string;
  /** Base hue (0–360) used to tint the charcoal gradient fallback. */
  hue?: number;
  className?: string;
  /** Applied to the inner media layer (used for parallax/scale animation). */
  innerClassName?: string;
  /** Basename of a file in /public/media (renders a <video>). */
  src?: string;
  /** `metadata` for the eagerly-loaded hero, `none` for lazy work cards. */
  preload?: "none" | "metadata" | "auto";
}

// forwardRef exposes the <video> element so sections can lazily .play() it.
const MediaSlot = forwardRef<HTMLVideoElement, MediaSlotProps>(function MediaSlot(
  {
    label,
    ratio,
    hue = 20,
    className = "",
    innerClassName = "",
    src,
    preload = "metadata",
  },
  ref
) {
  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* Gradient fallback sits behind the poster/video. */}
      <div
        className={`absolute inset-0 ${src ? "" : innerClassName}`}
        style={{
          background: `linear-gradient(150deg,
            hsl(${hue} 18% 9%) 0%,
            hsl(${hue} 22% 13%) 45%,
            hsl(${(hue + 20) % 360} 16% 7%) 100%)`,
        }}
      />

      {src ? (
        <video
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover ${innerClassName}`}
          suppressHydrationWarning
          muted
          loop
          playsInline
          preload={preload}
          poster={`/media/${src}.jpg`}
        >
          <source
            src={`/media/${src}.mp4`}
            type="video/mp4"
            suppressHydrationWarning
          />
          <source
            src={`/media/${src}.webm`}
            type="video/webm"
            suppressHydrationWarning
          />
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="micro-label text-center px-4">{label}</span>
        </div>
      )}

      {/* thin inner frame to echo the hairline motif */}
      <div className="pointer-events-none absolute inset-0 border border-hairline" />
    </div>
  );
});

export default MediaSlot;
