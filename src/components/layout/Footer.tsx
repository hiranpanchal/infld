import Link from "next/link";
import { StarFilled, Lightning } from "@/components/doodles";
import { getPageContent } from "@/lib/data";

const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/lookbook", label: "Lookbook" },
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

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

export async function Footer() {
  const social = await getPageContent("social");

  const instagram = social.instagram || "";
  const tiktok = social.tiktok || "";
  const youtube = social.youtube || "";

  const socials = [
    { href: instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: tiktok, icon: <TikTokIcon />, label: "TikTok" },
    { href: youtube, icon: <YouTubeIcon />, label: "YouTube" },
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
            {/* Social icons */}
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

        {/* Links */}
        <div className="flex flex-wrap gap-6 mb-10">
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

        {/* Bottom */}
        <div className="border-t border-infld-grey-mid pt-6">
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
      </div>
    </footer>
  );
}
