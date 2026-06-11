"use client";

import { useActionState, useMemo, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { saveProductAction, type ActionState } from "@/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SafeImage } from "@/components/ui/SafeImage";

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    description: string | null;
    type: "PHYSICAL" | "DIGITAL";
    price: string | number;
    currency: "BDT" | "USD";
    stock: number | null;
    imageUrls: string[];
    fileUrl: string | null;
    isPublished: boolean;
    variants: Array<{
      label: string;
      value: string;
      additionalPrice: string | number;
      stock: number | null;
    }>;
  };
};

export function ProductForm({ product }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveProductAction, {});
  const [type, setType] = useState(product?.type || "PHYSICAL");
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls || []);
  const [fileUrl, setFileUrl] = useState(product?.fileUrl || "");
  const [variants, setVariants] = useState(
    product?.variants.length
      ? product.variants
      : [{ label: "", value: "", additionalPrice: 0, stock: null }],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const variantsJson = useMemo(() => JSON.stringify(variants.filter((item) => item.label && item.value)), [variants]);

  async function uploadFile(file: File, bucket: string) {
    return new Promise<string>((resolve, reject) => {
      const body = new FormData();
      body.append("bucket", bucket);
      body.append("file", file);

      const request = new XMLHttpRequest();
      request.open("POST", "/api/uploads");

      request.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        setUploadProgress(Math.max(8, Math.round((event.loaded / event.total) * 90)));
      };

      request.onload = () => {
        try {
          const data = JSON.parse(request.responseText || "{}") as { url?: string; error?: string };
          if (request.status >= 200 && request.status < 300 && data.url) {
            setUploadProgress(100);
            resolve(data.url);
            return;
          }
          reject(new Error(data.error || "Upload failed"));
        } catch {
          reject(new Error("Upload failed"));
        }
      };

      request.onerror = () => reject(new Error("Network error while uploading"));
      request.send(body);
    });
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress(5);
    try {
      const urls: string[] = [];
      for (const [index, file] of files.entries()) {
        setUploadMessage(`Uploading image ${index + 1} of ${files.length}`);
        urls.push(await uploadFile(file, "product-images"));
      }
      setImageUrls((current) => [...current, ...urls]);
      setUploadMessage("Image upload complete");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed");
      setUploadMessage("");
    } finally {
      setUploading(false);
      event.target.value = "";
      setTimeout(() => {
        setUploadProgress(0);
        setUploadMessage("");
      }, 1200);
    }
  }

  async function handleDigitalFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress(5);
    setUploadMessage("Uploading digital file");
    try {
      setFileUrl(await uploadFile(file, "digital-files"));
      setUploadMessage("Digital file upload complete");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Digital file upload failed");
      setUploadMessage("");
    } finally {
      setUploading(false);
      event.target.value = "";
      setTimeout(() => {
        setUploadProgress(0);
        setUploadMessage("");
      }, 1200);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {uploadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}
      <input type="hidden" name="id" value={product?.id || ""} />
      <input type="hidden" name="imageUrls" value={JSON.stringify(imageUrls)} />
      <input type="hidden" name="fileUrl" value={fileUrl} />
      <input type="hidden" name="variants" value={variantsJson} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Product name" name="name" defaultValue={product?.name} required />
        <Input label="Price" name="price" type="number" min="0" step="0.01" defaultValue={String(product?.price || "")} required className="w-full" />
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-800">Type</span>
          <select
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as "PHYSICAL" | "DIGITAL")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0f6b3a] focus:ring-2 focus:ring-[#f5a623]"
          >
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-800">Currency</span>
          <select
            name="currency"
            defaultValue={product?.currency || "BDT"}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0f6b3a] focus:ring-2 focus:ring-[#f5a623]"
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
          </select>
        </label>
        {type === "PHYSICAL" && (
          <Input label="Stock" name="stock" type="number" min="0" defaultValue={String(product?.stock ?? "")} required />
        )}
      </div>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-slate-800">Description</span>
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f6b3a] focus:ring-2 focus:ring-[#f5a623]"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-[#0f6b3a]">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Upload className="h-4 w-4" />
            Upload images
          </span>
          <input className="mt-3 block w-full text-sm" type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
          <p className="mt-2 text-xs text-slate-500">{imageUrls.length} image(s) uploaded</p>
          {imageUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {imageUrls.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
                  <SafeImage
                    src={url}
                    alt="Uploaded product image"
                    className="h-full w-full object-cover"
                    fallback={<div className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-400">Image unavailable</div>}
                  />
                </div>
              ))}
            </div>
          )}
        </label>
        {type === "DIGITAL" && (
          <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Upload className="h-4 w-4" />
              Upload digital file
            </span>
            <input className="mt-3 block w-full text-sm" type="file" onChange={handleDigitalFileUpload} disabled={uploading} />
            <p className="mt-2 truncate text-xs text-slate-500">{fileUrl || "No file uploaded"}</p>
          </label>
        )}
      </div>
      {(uploading || uploadProgress > 0 || uploadMessage) && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#0f6b3a]">
            <span>{uploadMessage || "Uploading"}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#0f6b3a] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Variants</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setVariants((current) => [...current, { label: "", value: "", additionalPrice: 0, stock: null }])}
          >
            <Plus className="h-4 w-4" />
            Add variant
          </Button>
        </div>
        {variants.map((variant, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_140px_140px_auto]">
            <Input label="Label" value={variant.label} onChange={(event) => setVariants((current) => current.map((entry, i) => i === index ? { ...entry, label: event.target.value } : entry))} />
            <Input label="Value" value={variant.value} onChange={(event) => setVariants((current) => current.map((entry, i) => i === index ? { ...entry, value: event.target.value } : entry))} />
            <Input label="Price +" type="number" min="0" value={String(variant.additionalPrice)} onChange={(event) => setVariants((current) => current.map((entry, i) => i === index ? { ...entry, additionalPrice: Number(event.target.value) } : entry))} />
            <Input label="Stock" type="number" min="0" value={String(variant.stock ?? "")} onChange={(event) => setVariants((current) => current.map((entry, i) => i === index ? { ...entry, stock: event.target.value ? Number(event.target.value) : null } : entry))} disabled={type === "DIGITAL"} />
            <Button type="button" variant="ghost" size="icon" className="self-end justify-self-start xl:justify-self-auto" onClick={() => setVariants((current) => current.filter((_, i) => i !== index))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-sm font-medium">
        <input name="isPublished" type="checkbox" defaultChecked={product?.isPublished} className="h-4 w-4 accent-[#0f6b3a]" />
        Publish this product on the public storefront
      </label>

      <Button disabled={pending || uploading} className="bg-[#0f6b3a] hover:bg-[#0b542d]">
        {(pending || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
        Save product
      </Button>
    </form>
  );
}
