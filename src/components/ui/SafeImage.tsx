"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { toMediaUrl } from "@/lib/media";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: ReactNode;
};

export function SafeImage({ src, alt, className, fallback }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = toMediaUrl(src);

  if (!resolvedSrc || failed) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    // User-provided and Supabase-hosted images need to render without Next image host allowlists.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
