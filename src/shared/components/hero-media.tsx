import Image from "next/image";

import { cn } from "@/shared/lib/utils";

export interface HeroMediaConfig {
  src: string;
  alt: string;
  poster?: string;
}

// Full-bleed background layer: a muted, looping video under a navy brand scrim
// that keeps overlaid text AA-legible. An optional poster shows on first paint
// and as the prefers-reduced-motion fallback (the video is hidden). Meant to
// sit as the first child of a `relative` container, behind `z-10` content.
export function HeroMedia({
  media,
  className,
}: {
  media: HeroMediaConfig;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {media.poster && (
        <Image
          src={media.poster}
          alt={media.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <video
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.poster}
        aria-label={media.alt}
      >
        <source src={media.src} type="video/mp4" />
      </video>

      {/* Navy brand scrim — keeps the video visible while holding light text
          above AA. Extra depth toward the bottom, where content sits. */}
      <div className="absolute inset-0 bg-primary/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/35 to-primary/80" />
    </div>
  );
}
