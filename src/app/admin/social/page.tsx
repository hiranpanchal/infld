"use client";

import { useEffect, useState } from "react";

const inputClass = "w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors";
const labelClass = "block text-[10px] tracking-[0.3em] text-infld-grey-light mb-2";
const labelStyle = { fontFamily: "var(--font-typewriter)" } as const;

const PLATFORMS = [
  {
    key: "instagram",
    label: "INSTAGRAM",
    placeholder: "https://www.instagram.com/infld",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TIKTOK",
    placeholder: "https://www.tiktok.com/@infld",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YOUTUBE",
    placeholder: "https://www.youtube.com/@infld",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "FACEBOOK",
    placeholder: "https://www.facebook.com/infld",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.278h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
];

export default function AdminSocialPage() {
  const [values, setValues] = useState<Record<string, string>>({
    instagram: "", tiktok: "", youtube: "", facebook: "",
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((blocks: { pageKey: string; blockKey: string; content: string }[]) => {
        if (!Array.isArray(blocks)) return;
        const social = blocks.filter((b) => b.pageKey === "social");
        const map: Record<string, string> = {};
        social.forEach((b) => { map[b.blockKey] = b.content; });
        setValues((prev) => ({ ...prev, ...map }));
        setLoading(false);
      });
  }, []);

  const handleSave = async (blockKey: string) => {
    setSaving(blockKey);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey: "social", blockKey, content: values[blockKey] || "" }),
    });
    setSaving(null);
    setSaved(blockKey);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl tracking-wider text-infld-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}>
        SOCIAL MEDIA
      </h1>
      <p className="text-infld-grey-mid text-xs mb-8" style={labelStyle}>
        Add your social media URLs. Icons appear in the footer when a URL is saved.
      </p>

      {loading ? (
        <p className="text-infld-grey-mid text-sm" style={labelStyle}>Loading...</p>
      ) : (
        <div className="space-y-5">
          {PLATFORMS.map((p) => (
            <div key={p.key} className="border-2 border-infld-grey-mid p-5 bg-[#0d0d0d]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-infld-yellow">{p.icon}</span>
                <label className={labelClass} style={labelStyle}>{p.label}</label>
              </div>
              <input
                type="url"
                value={values[p.key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [p.key]: e.target.value }))}
                className={inputClass}
                placeholder={p.placeholder}
                style={labelStyle}
              />
              {values[p.key] && (
                <a
                  href={values[p.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-infld-grey-mid hover:text-infld-yellow transition-colors mt-2 inline-block"
                  style={labelStyle}
                >
                  ↗ preview link
                </a>
              )}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleSave(p.key)}
                  disabled={saving === p.key}
                  className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-1.5 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {saving === p.key ? "SAVING..." : "SAVE"}
                </button>
                {saved === p.key && (
                  <span className="text-green-400 text-[10px] tracking-wider" style={labelStyle}>
                    ✓ SAVED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
