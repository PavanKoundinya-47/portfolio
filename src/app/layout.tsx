import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pavankoundinya-47.github.io/portfolio";
  
export const metadata: Metadata = {
  title: "Pavan Lanka | Software Development Engineer",
  description:
    "Portfolio of Pavan Lanka — Software Development Engineer building scalable systems and contributing to space technology.",
  openGraph: {
    title: "Pavan Lanka | Software Development Engineer",
    description:
      "Portfolio of Pavan Lanka — Software Development Engineer building scalable systems and contributing to space technology.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Pavan Lanka Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Lanka | Software Development Engineer",
    description:
      "Portfolio of Pavan Lanka — Software Development Engineer building scalable systems and contributing to space technology.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pavan Lanka",
    jobTitle: "Software Development Engineer",
    url: siteUrl,
    sameAs: [
      "https://github.com/PavanKoundinya-47",
      "https://www.linkedin.com/in/pavanlanka-profile",
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} bg-[#020617] text-[#E2E8F0] antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans overflow-x-hidden">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
