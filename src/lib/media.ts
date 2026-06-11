const SUPABASE_IMAGE_BUCKETS = new Set(["product-images", "store-logos", "avatars"]);

export function toMediaUrl(src?: string | null) {
  if (!src) return "";

  try {
    const url = new URL(src);
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
    if (!match) return src;

    const [, bucket, rawPath] = match;
    if (!SUPABASE_IMAGE_BUCKETS.has(bucket)) return src;

    return `/api/media/${bucket}/${rawPath}`;
  } catch {
    return src;
  }
}
