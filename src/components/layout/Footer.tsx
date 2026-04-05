"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StarFilled, Lightning } from "@/components/doodles";

const FOOTER_LINKS = [
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/lookbook", label: "LOOKBOOK" },
  { href: "/contact", label: "CONTACT" },
];

const FOOTER_LEGAL = [
  { href: "/shipping", label: "SHIPPING" },
  { href: "/returns", label: "RETURNS" },
  { href: "/size-guide", label: "SIZE GUIDE" },
  { href: "/privacy", label: "PRIVACY POLICY" },
  { href: "/terms", label: "TERMS" },
];

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.278h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

export function Footer() {
  const [social, setSocial] = useState({ instagram: "", tiktok: "", youtube: "", facebook: "" });

  useEffect(() => {
    fetch("/api/admin/content?pageKey=social")
      .then((r) => r.json())
      .then((blocks: { blockKey: string; content: string }[]) => {
        if (!Array.isArray(blocks)) return;
        const map: Record<string, string> = {};
        blocks.forEach((b) => { map[b.blockKey] = b.content; });
        setSocial({
          instagram: map.instagram || "",
          tiktok: map.tiktok || "",
          youtube: map.youtube || "",
          facebook: map.facebook || "",
        });
      })
      .catch(() => {});
  }, []);

  const socials = [
    { href: social.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: social.tiktok, icon: <TikTokIcon />, label: "TikTok" },
    { href: social.youtube, icon: <YouTubeIcon />, label: "YouTube" },
    { href: social.facebook, icon: <FacebookIcon />, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-infld-black border-t border-infld-grey-mid pt-12 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <p
              className="text-display text-infld-white mb-1"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
            >
              INFLD
            </p>
            <p className="text-label text-infld-grey-light">UNINFLUENCED</p>
          </div>

          <div className="flex flex-col items-end gap-4">
            {socials.length > 0 && (
              <div className="flex items-center gap-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-infld-grey-light hover:text-infld-yellow transition-colors duration-150"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 text-infld-yellow">
              <StarFilled size={18} />
              <Lightning size={18} />
              <StarFilled size={18} />
            </div>
          </div>
        </div>

        {/* Main links */}
        <div className="flex flex-wrap gap-6 mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label text-infld-grey-light hover:text-infld-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Legal / info links */}
        <div className="flex flex-wrap gap-4 mb-10">
          {FOOTER_LEGAL.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.1em] text-infld-grey-mid hover:text-infld-grey-light transition-colors"
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-infld-grey-mid pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-infld-grey-light font-body" style={{ fontFamily: "var(--font-body)" }}>
              &copy; INFLD 2025. NOT YOUR BRAND.
            </p>
            <p
              className="text-xs text-infld-grey-mid mt-1"
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              Made for the ones who think for themselves.
            </p>
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PayPal */}
            <div className="flex items-center gap-1 border border-infld-grey-mid/50 px-2.5 py-1" style={{ borderRadius: 3 }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: "11px", color: "#009cde", letterSpacing: "-0.3px" }}>Pay</span>
              <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: "11px", color: "#003087", letterSpacing: "-0.3px" }}>Pal</span>
            </div>
            {/* Visa */}
            <div className="flex items-center justify-center border border-infld-grey-mid/50 px-2.5 py-1" style={{ borderRadius: 3, minWidth: 40 }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: "11px", color: "#A8A8A8", letterSpacing: "1px", fontStyle: "italic" }}>VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex items-center justify-center border border-infld-grey-mid/50 px-2 py-1" style={{ borderRadius: 3 }}>
              <span style={{ fontSize: 10, letterSpacing: -1, lineHeight: 1 }}>
                <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: "#EB001B", opacity: 0.7, verticalAlign: "middle" }} />
                <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: "#F79E1B", opacity: 0.7, verticalAlign: "middle", marginLeft: -5 }} />
              </span>
            </div>
            {/* Amex */}
            <div className="flex items-center justify-center border border-infld-grey-mid/50 px-2.5 py-1" style={{ borderRadius: 3, minWidth: 44 }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "10px", color: "#A8A8A8", letterSpacing: "0.5px" }}>AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
