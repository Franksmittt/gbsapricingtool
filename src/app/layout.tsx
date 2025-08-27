import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourBrand - Digital Solutions That Drive Results",
  description: "We create stunning websites and applications that drive business growth. Transform your ideas into powerful digital solutions.",
  keywords: ["web development", "digital solutions", "web design", "mobile apps"],
  authors: [{ name: "YourBrand Team" }],
  openGraph: {
    title: "YourBrand - Digital Solutions That Drive Results",
    description: "We create stunning websites and applications that drive business growth.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourBrand - Digital Solutions That Drive Results",
    description: "We create stunning websites and applications that drive business growth.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
