"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SizeInput { label: string; stock: number; }
interface ImageInput { url: string; alt: string; }

const inputClass = "w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors";
const labelClass = "block text-[10px] tracking-[0.3em] text-infld-grey-light mb-2";
const labelStyle = { fontFamily: "var(--font-typewriter)" } as const;

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", subtitle: "", price: "", category: "hoodies",
    badge: "", description: "", materialDetails: "", sizingDetails: "",
    returnDetails: "", published: true,
  });
  const [sizes, setSizes] = useState<SizeInput[]>([
    { label: "7-8", stock: 50 }, { label: "9-10", stock: 50 },
    { label: "11-12", stock: 50 }, { label: "13-14", stock: 50 },
    { label: "15", stock: 50 },
  ]);
  const [images, setImages] = useState<ImageInput[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSlugify = (name: string) => {
    setForm((f) => ({
      ...f, name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "products");
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImages((prev) => [...prev, { url: data.url, alt: "" }]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, price: Math.round(parseFloat(form.price) * 100),
        badge: form.badge || null, images, sizes,
      }),
    });
    if (res.ok) router.push("/admin/products");
    else { alert("Failed to create product"); setSaving(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl tracking-wider text-infld-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}>
        NEW PRODUCT
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>NAME</label>
            <input type="text" value={form.name} onChange={(e) => handleSlugify(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>SLUG</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={`${inputClass} font-mono`} required />
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>SUBTITLE</label>
          <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className={inputClass} placeholder='"UNINFLUENCED"' />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>PRICE (£)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>CATEGORY</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputClass} style={labelStyle}>
              <option value="hoodies">Hoodies</option>
              <option value="tees">Tees</option>
              <option value="rebel-edition">Rebel Edition</option>
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>BADGE</label>
            <input type="text" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className={inputClass} placeholder="NEW DROP" />
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>DESCRIPTION</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputClass} h-20`} required />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>MATERIAL DETAILS</label>
          <textarea value={form.materialDetails} onChange={(e) => setForm((f) => ({ ...f, materialDetails: e.target.value }))} className={`${inputClass} h-16`} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>SIZING DETAILS</label>
          <textarea value={form.sizingDetails} onChange={(e) => setForm((f) => ({ ...f, sizingDetails: e.target.value }))} className={`${inputClass} h-16`} />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>RETURN DETAILS</label>
          <textarea value={form.returnDetails} onChange={(e) => setForm((f) => ({ ...f, returnDetails: e.target.value }))} className={`${inputClass} h-16`} />
        </div>

        {/* Sizes */}
        <div className="border-2 border-infld-grey-mid p-4">
          <label className={labelClass} style={labelStyle}>SIZES & STOCK</label>
          <div className="space-y-2">
            {sizes.map((size, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={size.label} onChange={(e) => { const u = [...sizes]; u[i].label = e.target.value; setSizes(u); }}
                  className="bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-1.5 text-sm w-24 focus:border-infld-yellow focus:outline-none" placeholder="Size" />
                <input type="number" value={size.stock} onChange={(e) => { const u = [...sizes]; u[i].stock = parseInt(e.target.value) || 0; setSizes(u); }}
                  className="bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-1.5 text-sm w-20 focus:border-infld-yellow focus:outline-none" placeholder="Stock" />
                <button type="button" onClick={() => setSizes((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-400 text-[10px] tracking-wider hover:text-red-300 transition-colors" style={labelStyle}>REMOVE</button>
              </div>
            ))}
            <button type="button" onClick={() => setSizes((prev) => [...prev, { label: "", stock: 0 }])}
              className="text-infld-yellow text-[10px] tracking-wider hover:text-infld-white transition-colors" style={labelStyle}>+ ADD SIZE</button>
          </div>
        </div>

        {/* Images */}
        <div className="border-2 border-infld-grey-mid p-4">
          <label className={labelClass} style={labelStyle}>IMAGES</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 border-2 border-infld-grey-mid overflow-hidden group">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
              </div>
            ))}
          </div>
          <label className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-2 border-2 border-infld-black cursor-pointer hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 inline-block"
                 style={{ fontFamily: "var(--font-display)" }}>
            {uploading ? "UPLOADING..." : "UPLOAD IMAGES"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Published */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="w-4 h-4 accent-[#FFE600]" />
          <span className="text-infld-grey-light text-xs tracking-wider" style={labelStyle}>PUBLISHED</span>
        </label>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving}
            className="bg-infld-yellow text-infld-black text-sm tracking-[0.15em] px-8 py-2.5 border-2 border-infld-black shadow-[3px_3px_0_#FFE600] hover:shadow-[5px_5px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 disabled:opacity-50"
            style={{ fontFamily: "var(--font-display)" }}>
            {saving ? "SAVING..." : "CREATE PRODUCT"}
          </button>
          <button type="button" onClick={() => router.push("/admin/products")}
            className="text-infld-grey-light text-xs tracking-wider hover:text-infld-white transition-colors px-4 py-2"
            style={labelStyle}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
