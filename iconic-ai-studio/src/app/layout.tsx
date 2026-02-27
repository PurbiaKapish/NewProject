import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IconicAI Studio - AI Fashion Model Generation",
  description:
    "Generate stunning AI fashion model images for your products with IconicAI Studio. Professional quality, instant results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} font-body bg-dark text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
