"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const CONTENT_ITEMS = [
  { href: "/admin/content/homepage", label: "HOMEPAGE" },
  { href: "/admin/content/about", label: "ABOUT" },
  { href: "/admin/content/lookbook", label: "LOOKBOOK" },
  { href: "/admin/content/coming-soon", label: "COMING SOON" },
  { href: "/admin/content/shipping", label: "SHIPPING INFO" },
  { href: "/admin/content/returns", label: "RETURNS" },
  { href: "/admin/content/size-guide", label: "SIZE GUIDE" },
  { href: "/admin/content/privacy", label: "PRIVACY POLICY" },
  { href: "/admin/content/terms", label: "TERMS OF SERVICE" },
  { href: "/admin/content/contact", label: "CONTACT PAGE" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isContentSection = pathname.startsWith("/admin/content");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const topNav = [
    { href: "/admin", label: "DASHBOARD", icon: "◆" },
    { href: "/admin/products", label: "PRODUCTS", icon: "▦" },
    { href: "/admin/orders", label: "ORDERS", icon: "⧉" },
    { href: "/admin/media", label: "MEDIA", icon: "⊞" },
    { href: "/admin/social", label: "SOCIAL MEDIA", icon: "◈" },
  ];

  return (
    <div className="min-h-screen bg-infld-black text-infld-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#111] border-r-2 border-infld-grey-mid flex flex-col shrink-0 min-h-screen">
        <div className="p-5 border-b-2 border-infld-grey-mid">
          <Link href="/admin" className="block" style={{ fontFamily: "var(--font-display)" }}>
            <span className="admin-wordmark text-infld-yellow text-3xl tracking-wider">INFLD</span>
          </Link>
          <p className="text-infld-grey-light text-[10px] tracking-[0.3em] mt-1"
             style={{ fontFamily: "var(--font-typewriter)" }}>
            BACK OFFICE
          </p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Dashboard, Products, Orders */}
          {topNav.slice(0, 3).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
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

          {/* CONTENT — always expanded with sub-items */}
          <div>
            <div className={`flex items-center gap-3 px-5 py-3 text-xs tracking-[0.15em] border-l-3 ${
              isContentSection
                ? "text-infld-yellow bg-infld-yellow/5 border-l-infld-yellow"
                : "text-infld-grey-light border-l-transparent"
            }`} style={{ fontFamily: "var(--font-typewriter)" }}>
              <span className="text-base opacity-60">✎</span>
              CONTENT
            </div>
            <div className="ml-3 border-l border-infld-grey-mid/40">
              {CONTENT_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center pl-4 pr-3 py-2 text-[10px] tracking-[0.12em] transition-all duration-100 border-l-2 ${
                      isActive
                        ? "text-infld-yellow bg-infld-yellow/5 border-l-infld-yellow"
                        : "text-infld-grey-light hover:text-infld-white hover:bg-white/5 border-l-transparent"
                    }`}
                    style={{ fontFamily: "var(--font-typewriter)" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Media, Social */}
          {topNav.slice(3).map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
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
          <Link href="/"
            className="block text-[10px] tracking-[0.2em] text-infld-grey-mid hover:text-infld-yellow transition-colors"
            style={{ fontFamily: "var(--font-typewriter)" }}>
            &larr; VIEW STORE
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
