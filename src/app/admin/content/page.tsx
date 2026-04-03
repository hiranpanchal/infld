"use client";

import { useEffect, useState } from "react";

interface ContentBlock {
  id: string;
  pageKey: string;
  blockKey: string;
  content: string;
}

const TABS = [
  { key: "home", label: "HOMEPAGE" },
  { key: "about", label: "ABOUT" },
  { key: "lookbook", label: "LOOKBOOK" },
  { key: "coming-soon", label: "COMING SOON" },
  { key: "social", label: "SOCIAL MEDIA" },
];

const BLOCK_LABELS: Record<string, string> = {
  hero_title: "Hero Title",
  hero_subtitle: "Hero Subtitle",
  hero_overlay_opacity: "Hero Overlay Opacity (0–100)",
  manifesto_stripe: "Scrolling Stripe Text",
  zine_annotation: "Zine Annotation",
  zine_heading: "Zine Heading",
  email_heading: "Email Section Heading",
  email_subtitle: "Email Section Subtitle",
  hero_annotation: "Hero Annotation",
  manifesto: "Manifesto Text",
  philosophy_heading: "Philosophy Heading",
  philosophy_body: "Philosophy Body",
  philosophy_signoff: "Philosophy Sign-off",
  stat1_label: "Stat 1 Label",
  stat1_value: "Stat 1 Value",
  stat2_label: "Stat 2 Label",
  stat2_value: "Stat 2 Value",
  stat3_label: "Stat 3 Label",
  stat3_value: "Stat 3 Value",
  stat4_label: "Stat 4 Label",
  stat4_value: "Stat 4 Value",
  heading: "Page Heading",
  annotation: "Annotation",
  bottom_line1: "Bottom Line 1",
  bottom_line2: "Bottom Line 2",
  subtitle: "Subtitle",
  bottom_text: "Bottom Text",
  instagram: "Instagram URL",
  tiktok: "TikTok URL",
  youtube: "YouTube URL",
};

const inputClass = "w-full bg-[#0a0a0a] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors";
const labelStyle = { fontFamily: "var(--font-typewriter)" };

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data: ContentBlock[]) => {
        setBlocks(data);
        const initial: Record<string, string> = {};
        data.forEach((b) => { initial[`${b.pageKey}:${b.blockKey}`] = b.content; });
        setEdits(initial);
        setLoading(false);
      });
  }, []);

  const handleSave = async (pageKey: string, blockKey: string) => {
    const key = `${pageKey}:${blockKey}`;
    setSaving(key);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey, blockKey, content: edits[key] }),
    });
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const tabBlocks = blocks.filter((b) => b.pageKey === activeTab);

  if (loading) return (
    <p className="text-infld-grey-mid text-sm" style={labelStyle}>Loading...</p>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl tracking-wider text-infld-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}>
        CONTENT
      </h1>
      <p className="text-infld-grey-mid text-xs mb-6" style={labelStyle}>
        Edit text content across all pages. Changes take effect on the next page load.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-[10px] tracking-[0.2em] border-2 transition-all duration-100 ${
              activeTab === tab.key
                ? "bg-infld-yellow text-infld-black border-infld-yellow"
                : "bg-[#111] text-infld-grey-light border-infld-grey-mid hover:text-infld-white"
            }`}
            style={labelStyle}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Social tab: always show fields even if DB records missing */}
      {activeTab === "social" && tabBlocks.length === 0 && (
        <div className="space-y-4">
          {(["instagram", "tiktok", "youtube"] as const).map((platform) => {
            const key = `social:${platform}`;
            return (
              <div key={platform} className="border-2 border-infld-grey-mid p-4 bg-[#0d0d0d]">
                <label className="block text-[10px] tracking-[0.25em] text-infld-grey-light mb-3 uppercase" style={labelStyle}>
                  {BLOCK_LABELS[platform]}
                </label>
                <input
                  type="url"
                  value={edits[key] || ""}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={inputClass}
                  placeholder={`https://www.${platform}.com/infld`}
                  style={labelStyle}
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleSave("social", platform)}
                    disabled={saving === key}
                    className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-1.5 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {saving === key ? "SAVING..." : "SAVE"}
                  </button>
                  {saved === key && (
                    <span className="text-green-400 text-[10px] tracking-wider" style={labelStyle}>✓ SAVED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All other tabs */}
      {(activeTab !== "social" || tabBlocks.length > 0) && tabBlocks.length === 0 && (
        <p className="text-infld-grey-mid text-sm" style={labelStyle}>
          No content blocks for this page yet.
        </p>
      )}
      {tabBlocks.length > 0 && (
        <div className="space-y-4">
          {tabBlocks.map((block) => {
            const key = `${block.pageKey}:${block.blockKey}`;
            const value = edits[key] || "";
            const isMultiline = value.includes("\n") || value.length > 100 || block.blockKey === "manifesto";
            const label = BLOCK_LABELS[block.blockKey] || block.blockKey.replace(/_/g, " ");

            return (
              <div key={block.id} className="border-2 border-infld-grey-mid p-4 bg-[#0d0d0d]">
                <label className="block text-[10px] tracking-[0.25em] text-infld-grey-light mb-3 uppercase"
                       style={labelStyle}>
                  {label}
                </label>
                {isMultiline ? (
                  <textarea
                    value={value}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                    className={`${inputClass} min-h-[100px]`}
                    style={labelStyle}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                    className={inputClass}
                    style={labelStyle}
                  />
                )}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleSave(block.pageKey, block.blockKey)}
                    disabled={saving === key}
                    className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-1.5 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {saving === key ? "SAVING..." : "SAVE"}
                  </button>
                  {saved === key && (
                    <span className="text-green-400 text-[10px] tracking-wider" style={labelStyle}>
                      ✓ SAVED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
