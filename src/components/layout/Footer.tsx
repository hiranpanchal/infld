import Link from "next/link";
import { StarFilled, Lightning } from "@/components/doodles";

const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/lookbook", label: "Lookbook" },
];

export function Footer() {
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
          <div className="flex items-center gap-3 text-infld-yellow">
            <StarFilled size={18} />
            <Lightning size={18} />
            <StarFilled size={18} />
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
