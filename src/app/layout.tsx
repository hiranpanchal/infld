import type { Metadata } from "next";
import { Bebas_Neue, Anton, Space_Mono, Permanent_Marker, Special_Elite } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { PayPalProvider } from "@/components/ui/PayPalProvider";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "INFLD — Uninfluenced Streetwear for Kids",
  description:
    "Streetwear for 7–15 year olds who think for themselves. INFLD drops limited hoodies and tees for the uninfluenced generation. Shop now.",
  openGraph: {
    title: "INFLD — Uninfluenced Streetwear for Kids",
    description:
      "Streetwear for 7–15 year olds who think for themselves. INFLD drops limited hoodies and tees for the uninfluenced generation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${anton.variable} ${spaceMono.variable} ${permanentMarker.variable} ${specialElite.variable}`}
    >
      <body>
        <ThemeProvider>
          <PayPalProvider>
          {/* SVG Roughen Filter */}
          <svg style={{ display: "none" }} aria-hidden="true">
            <defs>
              <filter id="roughen">
                <feTurbulence
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="3"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
          {children}
          </PayPalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
