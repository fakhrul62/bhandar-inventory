import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedBuckets = new Set(["product-images", "store-logos", "avatars"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bucket: string; path: string[] }> },
) {
  const { bucket, path } = await params;

  if (!allowedBuckets.has(bucket) || !path.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const objectPath = path.map((part) => decodeURIComponent(part)).join("/");
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(bucket).download(objectPath);

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Type": data.type || "application/octet-stream",
    },
  });
}
