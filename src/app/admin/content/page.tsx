"use client";

import { useEffect, useState } from "react";

interface ContentBlock {
  id: string;
  pageKey: string;
  blockKey: string;
  content: string;
}

const PAGE_LABELS: Record<string, string> = {
  home: "HOMEPAGE",
  about: "ABOUT / MANIFESTO",
  lookbook: "LOOKBOOK",
  "coming-soon": "COMING SOON",
};

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data: ContentBlock[]) => {
        setBlocks(data);
        const initial: Record<string, string> = {};
        data.forEach((b) => {
          initial[`${b.pageKey}:${b.blockKey}`] = b.content;
        });
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

  const grouped: Record<string, ContentBlock[]> = {};
  blocks.forEach((b) => {
    if (!grouped[b.pageKey]) grouped[b.pageKey] = [];
    grouped[b.pageKey].push(b);
  });

  if (loading) return <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl tracking-wider text-infld-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}>
        CONTENT
      </h1>
      <p className="text-infld-grey-mid text-xs mb-8" style={{ fontFamily: "var(--font-typewriter)" }}>
        Edit text content across all pages. Changes take effect on the next page load.
      </p>

      {Object.entries(grouped).map(([pageKey, pageBlocks]) => (
        <div key={pageKey} className="mb-10">
          <h2 className="text-lg tracking-wider text-infld-yellow mb-4 pb-2 border-b-2 border-infld-grey-mid"
              style={{ fontFamily: "var(--font-display)" }}>
            {PAGE_LABELS[pageKey] || pageKey.toUpperCase()}
          </h2>
          <div className="space-y-4">
            {pageBlocks.map((block) => {
              const key = `${block.pageKey}:${block.blockKey}`;
              const isMultiline = (edits[key] || "").includes("\n") || (edits[key] || "").length > 100;
              return (
                <div key={block.id} className="border-2 border-infld-grey-mid p-4">
                  <label className="block text-[10px] tracking-[0.3em] text-infld-grey-light mb-2"
                         style={{ fontFamily: "var(--font-typewriter)" }}>
                    {block.blockKey.replace(/_/g, " ").toUpperCase()}
                  </label>
                  {isMultiline ? (
                    <textarea
                      value={edits[key] || ""}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm h-32 focus:border-infld-yellow focus:outline-none transition-colors"
                      style={{ fontFamily: "var(--font-typewriter)" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={edits[key] || ""}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors"
                      style={{ fontFamily: "var(--font-typewriter)" }}
                    />
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleSave(block.pageKey, block.blockKey)}
                      disabled={saving === key}
                      className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-1.5 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {saving === key ? "SAVING..." : "SAVE"}
                    </button>
                    {saved === key && (
                      <span className="text-green-400 text-[10px] tracking-wider"
                            style={{ fontFamily: "var(--font-typewriter)" }}>
                        SAVED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
