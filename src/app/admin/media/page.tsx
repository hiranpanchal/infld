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
const LOCATION_LABELS: Record<string, string> = {
  all: "ALL",
  hero: "HERO",
  banner: "BANNER",
  lookbook: "LOOKBOOK",
  pages: "ABOUT BANNER",
};

export default function AdminMediaPage() {
  const [images, setImages] = useState<SiteImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("hero");
  const [copied, setCopied] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);

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

  const handleAddExternalUrl = async () => {
    if (!externalUrl.trim()) return;
    setAddingUrl(true);
    await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: uploadType,
        url: externalUrl.trim(),
        alt: externalUrl.split("/").pop() || "image",
        label: externalUrl.split("/").pop() || "image",
      }),
    });
    setExternalUrl("");
    setAddingUrl(false);
    fetchImages();
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
        {/* Type selector */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {["hero", "banner", "lookbook", "pages"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setUploadType(t)}
              className={`px-3 py-1 text-[10px] tracking-[0.15em] border-2 transition-all duration-100 ${
                uploadType === t
                  ? "bg-infld-yellow text-infld-black border-infld-yellow"
                  : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:border-infld-white hover:text-infld-white"
              }`}
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              {LOCATION_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <label className={`text-[10px] tracking-[0.15em] px-4 py-2 border-2 border-infld-black cursor-pointer transition-all duration-75 ${uploading ? "bg-infld-grey-mid text-infld-black" : "bg-infld-yellow text-infld-black hover:shadow-[2px_2px_0_#FFE600]"}`}
                 style={{ fontFamily: "var(--font-display)" }}>
            {uploading ? "UPLOADING..." : "UPLOAD FILE"}
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
        {/* External URL */}
        <div className="flex gap-2 items-center mt-1">
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="Or paste an external image URL..."
            className="flex-1 bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-1.5 text-xs focus:border-infld-yellow focus:outline-none transition-colors"
            style={{ fontFamily: "var(--font-typewriter)" }}
            onKeyDown={(e) => e.key === "Enter" && handleAddExternalUrl()}
          />
          <button
            type="button"
            onClick={handleAddExternalUrl}
            disabled={addingUrl || !externalUrl.trim()}
            className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-2 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-40"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {addingUrl ? "ADDING..." : "ADD URL"}
          </button>
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
            {LOCATION_LABELS[loc]}
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
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center flex-col gap-1">
                  <span className="text-infld-grey-mid text-2xl">✕</span>
                  <span className="text-infld-grey-mid text-[10px] tracking-wider" style={{ fontFamily: "var(--font-typewriter)" }}>MISSING</span>
                </div>
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
                  {LOCATION_LABELS[img.location] || img.location.toUpperCase()}
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
