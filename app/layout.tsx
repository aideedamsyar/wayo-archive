import type { Metadata } from "next";
import { Didact_Gothic, Jost, PT_Serif } from "next/font/google";
import Script from "next/script";
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VKFHZRL676"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VKFHZRL676');
          `}
        </Script>
      </body>
    </html>
  );
}
