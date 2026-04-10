import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://smirk.cash";

export const metadata: Metadata = {
  title: {
    default: "Smirk Wallet",
    template: "%s | Smirk Wallet",
  },
  description:
    "Multi-coin crypto wallet browser extension. Send, receive, and tip BTC, LTC, XMR, WOW, and GRIN.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Smirk Wallet",
    description:
      "Multi-coin crypto wallet browser extension. Send, receive, and tip BTC, LTC, XMR, WOW, and GRIN.",
    url: siteUrl,
    siteName: "Smirk Wallet",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smirk Wallet",
    description:
      "Multi-coin crypto wallet browser extension. Send, receive, and tip BTC, LTC, XMR, WOW, and GRIN.",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-mono antialiased min-h-screen flex flex-col`}>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="py-4 text-center text-xs text-zinc-500 flex items-center justify-center gap-3 flex-wrap">
          <a href="/stats" className="hover:text-[#fbeb0a] transition-colors">
            Stats
          </a>
          <span className="text-zinc-700">•</span>
          <a href="/privacy" className="hover:text-[#fbeb0a] transition-colors">
            Privacy Policy
          </a>
          <span className="text-zinc-700">•</span>
          <a href="/terms" className="hover:text-[#fbeb0a] transition-colors">
            Terms of Service
          </a>
          <span className="text-zinc-700">•</span>
          <span>
            Made &amp; Hosted by{" "}
            <a
              href="https://such.software"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#fbeb0a] transition-colors"
            >
              such.software
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
