"use client";

import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { updateStoreAction } from "@/actions/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SafeImage } from "@/components/ui/SafeImage";

const initialState: { error?: string; success?: string } = {};

export function StorefrontForm({
  store,
}: {
  store: {
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    isPublic: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateStoreAction, initialState);
  const [logoUrl, setLogoUrl] = useState(store.logoUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("bucket", "store-logos");
    body.append("file", file);

    setUploading(true);
    setUploadError("");
    setUploadProgress(5);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/uploads");
    request.upload.onprogress = (progressEvent) => {
      if (!progressEvent.lengthComputable) return;
      setUploadProgress(Math.max(8, Math.round((progressEvent.loaded / progressEvent.total) * 90)));
    };
    request.onload = () => {
      try {
        const data = JSON.parse(request.responseText || "{}") as { url?: string; error?: string };
        if (request.status >= 200 && request.status < 300 && data.url) {
          setLogoUrl(data.url);
          setUploadProgress(100);
          return;
        }
        setUploadError(data.error || "Logo upload failed");
      } catch {
        setUploadError("Logo upload failed");
      } finally {
        setUploading(false);
        event.target.value = "";
        setTimeout(() => setUploadProgress(0), 1200);
      }
    };
    request.onerror = () => {
      setUploadError("Network error while uploading logo");
      setUploading(false);
      event.target.value = "";
      setTimeout(() => setUploadProgress(0), 1200);
    };
    request.send(body);
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      {state.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>}
      {uploadError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{uploadError}</div>}
      <Input label="Store name" name="name" defaultValue={store.name} required />
      <Input label="Store slug" name="slug" defaultValue={store.slug} required />
      <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-[#0f6b3a] text-xl font-semibold text-white">
          <SafeImage
            src={logoUrl}
            alt={store.name}
            className="h-full w-full object-cover"
            fallback={store.name.slice(0, 2).toUpperCase()}
          />
        </div>
        <div className="space-y-3">
          <Input label="Logo URL" name="logoUrl" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} />
          <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-[#0f6b3a]">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Upload className="h-4 w-4" />
              Upload logo
            </span>
            <input className="mt-3 block w-full text-sm" type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
          </label>
          {(uploading || uploadProgress > 0) && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-[#0f6b3a]">
                <span>{uploading ? "Uploading logo" : "Logo ready"}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white">
                <div className="h-full rounded-full bg-[#0f6b3a] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-800">Description</span>
        <textarea name="description" defaultValue={store.description || ""} rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
      </label>
      <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-sm font-medium">
        <input name="isPublic" type="checkbox" defaultChecked={store.isPublic} className="h-4 w-4 accent-[#0f6b3a]" />
        Make storefront public
      </label>
      <Button disabled={pending || uploading} className="bg-[#0f6b3a] hover:bg-[#0b542d]">
        {(pending || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
        Save storefront
      </Button>
    </form>
  );
}
