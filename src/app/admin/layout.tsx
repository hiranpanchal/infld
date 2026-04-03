"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const ADMIN_NAV = [
  { href: "/admin", label: "DASHBOARD", icon: "◆" },
  { href: "/admin/products", label: "PRODUCTS", icon: "▦" },
  { href: "/admin/orders", label: "ORDERS", icon: "⧉" },
  { href: "/admin/content", label: "CONTENT", icon: "✎" },
  { href: "/admin/media", label: "MEDIA", icon: "⊞" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-infld-black text-infld-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#111] border-r-2 border-infld-grey-mid flex flex-col shrink-0 min-h-screen">
        <div className="p-5 border-b-2 border-infld-grey-mid">
          <Link
            href="/admin"
            className="block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-infld-yellow text-3xl tracking-wider">INFLD</span>
          </Link>
          <p className="text-infld-grey-light text-[10px] tracking-[0.3em] mt-1"
             style={{ fontFamily: "var(--font-typewriter)" }}>
            BACK OFFICE
          </p>
        </div>
        <nav className="flex-1 py-4">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 text-xs tracking-[0.15em] transition-all duration-100 border-l-3 ${
                  isActive
                    ? "text-infld-yellow bg-infld-yellow/5 border-l-infld-yellow"
                    : "text-infld-grey-light hover:text-infld-white hover:bg-white/5 border-l-transparent"
                }`}
                style={{ fontFamily: "var(--font-typewriter)" }}
              >
                <span className="text-base opacity-60">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-5 border-t-2 border-infld-grey-mid space-y-4">
          <ThemeToggle />
          <Link
            href="/"
            className="block text-[10px] tracking-[0.2em] text-infld-grey-mid hover:text-infld-yellow transition-colors"
            style={{ fontFamily: "var(--font-typewriter)" }}
          >
            &larr; VIEW STORE
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
