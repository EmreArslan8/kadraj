// Reusable placeholder for real media (video/image) dropped in later.
// Renders a dark, per-hue gradient with a centered uppercase micro-label.

interface MediaSlotProps {
  label: string;
  /** CSS aspect-ratio string, e.g. "4/5", "16/9". Omit to fill parent. */
  ratio?: string;
  /** Base hue (0–360) used to tint the charcoal gradient. */
  hue?: number;
  className?: string;
  /** Ref target for the inner layer (used for parallax/scale animation). */
  innerClassName?: string;
}

export default function MediaSlot({
  label,
  ratio,
  hue = 20,
  className = "",
  innerClassName = "",
}: MediaSlotProps) {
  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div
        className={`absolute inset-0 ${innerClassName}`}
        style={{
          background: `linear-gradient(150deg,
            hsl(${hue} 18% 9%) 0%,
            hsl(${hue} 22% 13%) 45%,
            hsl(${(hue + 20) % 360} 16% 7%) 100%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="micro-label text-center px-4">{label}</span>
      </div>
      {/* thin inner frame to echo the hairline motif */}
      <div className="pointer-events-none absolute inset-0 border border-hairline" />
    </div>
  );
}
