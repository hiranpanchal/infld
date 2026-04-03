"use client";

import { useEffect, useState } from "react";

interface SiteImageItem {
  id: string;
  location: string;
  label: string;
  url: string;
  alt: string;
  sortOrder: number;
}

const LOCATIONS = ["all", "hero", "banner", "lookbook", "pages"];

export default function AdminMediaPage() {
  const [images, setImages] = useState<SiteImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("hero");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchImages = () => {
    const url = filter === "all" ? "/api/admin/media" : `/api/admin/media?location=${filter}`;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then(setImages)
      .finally(() => setLoading(false));
  };

  useEffect(fetchImages, [filter]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType === "pages" ? "pages" : uploadType);

      const uploadRes = await fetch("/api/uploads", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (uploadData.url) {
        await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: uploadType,
            url: uploadData.url,
            alt: file.name,
            label: file.name,
          }),
        });
      }
    }

    setUploading(false);
    e.target.value = "";
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <h1 className="text-3xl tracking-wider text-infld-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}>
        MEDIA LIBRARY
      </h1>

      {/* Upload */}
      <div className="border-2 border-infld-grey-mid p-5 mb-6">
        <p className="text-[10px] tracking-[0.3em] text-infld-grey-light mb-3"
           style={{ fontFamily: "var(--font-typewriter)" }}>
          UPLOAD
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-1.5 text-xs tracking-wider focus:border-infld-yellow focus:outline-none"
            style={{ fontFamily: "var(--font-typewriter)" }}
          >
            <option value="hero">HERO</option>
            <option value="banner">BANNER</option>
            <option value="lookbook">LOOKBOOK</option>
            <option value="pages">PAGE</option>
          </select>
          <label className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-2 border-2 border-infld-black cursor-pointer hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75"
                 style={{ fontFamily: "var(--font-display)" }}>
            {uploading ? "UPLOADING..." : "CHOOSE FILES"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setFilter(loc)}
            className={`px-4 py-1.5 text-[10px] tracking-[0.15em] border-2 transition-all duration-100 ${
              filter === loc
                ? "bg-infld-yellow text-infld-black border-infld-yellow"
                : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:border-infld-white hover:text-infld-white"
            }`}
            style={{ fontFamily: "var(--font-typewriter)" }}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>No images yet. Upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className="border-2 border-infld-grey-mid overflow-hidden group">
              <div className="aspect-square relative bg-[#111]">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-infld-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="bg-infld-yellow text-infld-black px-2 py-1 text-[10px] tracking-wider border border-infld-black"
                    style={{ fontFamily: "var(--font-typewriter)" }}
                  >
                    {copied === img.url ? "COPIED" : "COPY URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-500 text-white px-2 py-1 text-[10px] tracking-wider border border-red-700"
                    style={{ fontFamily: "var(--font-typewriter)" }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div className="p-2 bg-[#111]">
                <p className="text-[10px] tracking-wider text-infld-yellow uppercase"
                   style={{ fontFamily: "var(--font-typewriter)" }}>
                  {img.location}
                </p>
                <p className="text-[10px] text-infld-grey-mid truncate">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
