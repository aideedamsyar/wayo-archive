import type { Metadata } from "next";
import { Didact_Gothic, Jost, PT_Serif } from "next/font/google";
import "./globals.css";

const didactGothic = Didact_Gothic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-didact-gothic",
  display: "swap",
});

const jost = Jost({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wayo Archive Project",
  description:
    "One place. One story. One photo. Discover and share meaningful places people love around the world.",
  metadataBase: new URL("https://withwayo.com"),
  openGraph: {
    title: "Wayo Archive Project",
    description:
      "One place. One story. One photo. Discover and share meaningful places people love around the world.",
    url: "https://withwayo.com",
    siteName: "Wayo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wayo Archive Project",
    description:
      "One place. One story. One photo. Discover and share meaningful places people love around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${didactGothic.variable} ${jost.variable} ${ptSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
