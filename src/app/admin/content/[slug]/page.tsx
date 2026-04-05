"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

/* Pages that use WYSIWYG (single HTML body) */
const WYSIWYG_PAGES: Record<string, string> = {
  shipping: "SHIPPING INFO",
  returns: "RETURNS",
  "size-guide": "SIZE GUIDE",
  privacy: "PRIVACY POLICY",
  terms: "TERMS OF SERVICE",
};

/* Pages that use block-based text fields */
const BLOCK_PAGES: Record<string, string> = {
  homepage: "HOMEPAGE",
  about: "ABOUT",
  lookbook: "LOOKBOOK",
  "coming-soon": "COMING SOON",
};

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
};

const inputClass =
  "w-full bg-[#0a0a0a] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors";
const labelStyle = { fontFamily: "var(--font-typewriter)" };

export default function ContentSlugPage() {
  const { slug } = useParams<{ slug: string }>();

  const isWysiwyg = slug in WYSIWYG_PAGES;
  const isBlock = slug in BLOCK_PAGES;

  const pageTitle = WYSIWYG_PAGES[slug] ?? BLOCK_PAGES[slug] ?? slug.toUpperCase();

  const [html, setHtml] = useState("");
  const [blocks, setBlocks] = useState<{ id: string; pageKey: string; blockKey: string; content: string }[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Map slug to pageKey used in DB
  const pageKeyMap: Record<string, string> = {
    homepage: "home",
    about: "about",
    lookbook: "lookbook",
    "coming-soon": "coming-soon",
  };
  const pageKey = pageKeyMap[slug] ?? slug;

  useEffect(() => {
    fetch(`/api/admin/content?pageKey=${pageKey}`)
      .then((r) => r.json())
      .then((data: { id: string; pageKey: string; blockKey: string; content: string }[]) => {
        if (isWysiwyg) {
          const body = data.find((b) => b.blockKey === "body");
          setHtml(body?.content ?? "");
        } else {
          setBlocks(data);
          const initial: Record<string, string> = {};
          data.forEach((b) => { initial[`${b.pageKey}:${b.blockKey}`] = b.content; });
          setEdits(initial);
        }
        setLoading(false);
      });
  }, [slug, pageKey, isWysiwyg]);

  const saveWysiwyg = async () => {
    setSaving("body");
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey, blockKey: "body", content: html }),
    });
    setSaving(null);
    setSaved("body");
    setTimeout(() => setSaved(null), 2000);
  };

  const saveBlock = async (blockKey: string) => {
    const key = `${pageKey}:${blockKey}`;
    setSaving(key);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey, blockKey, content: edits[key] ?? "" }),
    });
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  if (!isWysiwyg && !isBlock) {
    return (
      <p className="text-infld-grey-mid text-sm" style={labelStyle}>
        Unknown page: {slug}
      </p>
    );
  }

  if (loading) return (
    <p className="text-infld-grey-mid text-sm" style={labelStyle}>Loading...</p>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl tracking-wider text-infld-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}>
        {pageTitle}
      </h1>
      <p className="text-infld-grey-mid text-xs mb-8" style={labelStyle}>
        {isWysiwyg
          ? "Write page content using the editor below. Changes appear on the public page immediately after saving."
          : "Edit text blocks for this page. Changes take effect on the next page load."}
      </p>

      {/* WYSIWYG editor */}
      {isWysiwyg && (
        <div>
          <RichTextEditor value={html} onChange={setHtml} />
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={saveWysiwyg}
              disabled={saving === "body"}
              className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-6 py-2 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {saving === "body" ? "SAVING..." : "SAVE"}
            </button>
            {saved === "body" && (
              <span className="text-green-400 text-[10px] tracking-wider" style={labelStyle}>
                ✓ SAVED
              </span>
            )}
          </div>
        </div>
      )}

      {/* Block-based fields */}
      {isBlock && (
        <div className="space-y-4">
          {blocks.length === 0 && (
            <p className="text-infld-grey-mid text-sm" style={labelStyle}>
              No content blocks for this page yet.
            </p>
          )}
          {blocks.map((block) => {
            const key = `${block.pageKey}:${block.blockKey}`;
            const value = edits[key] ?? "";
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
                    onChange={(e) => setEdits((p) => ({ ...p, [key]: e.target.value }))}
                    className={`${inputClass} min-h-[100px]`}
                    style={labelStyle}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setEdits((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputClass}
                    style={labelStyle}
                  />
                )}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => saveBlock(block.blockKey)}
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
