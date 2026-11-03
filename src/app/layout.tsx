import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import VisitorTracker from "@/components/visitor-tracker";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
  weight: "300 700",
});

const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});

const SITE_TITLE = "Omkar Panchal — IoT, Data & ML Engineer";
const SITE_DESCRIPTION =
  "Final-year B.Tech Computer Science (IoT) student at YCCE Nagpur. Building real-time IoT systems, cloud data pipelines and explainable ML. Open to 2027 placements.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s · Omkar Panchal",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Omkar Panchal",
    "IoT engineer",
    "Data Analyst",
    "data engineering",
    "machine learning",
    "ESP32",
    "Python",
    "SQL",
    "Power BI",
    "AWS",
    "portfolio",
  ],
  authors: [{ name: "Omkar Panchal", url: "https://github.com/OmkarPanchal06" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Omkar Panchal",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: "#05070a",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Reveal elements start at opacity 0. Without JS they'd stay invisible,
            so un-gate the content for non-JS clients and crawlers. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        <VisitorTracker />
      </body>
    </html>
  );
}
