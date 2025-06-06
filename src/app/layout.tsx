import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import MobileNavbar from "@/components/MobileNavbar";
import Header from "@/components/Header";
import DesktopSidebar from "@/components/DesktopSidebar";
import { Providers } from "@/store/provider";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prestige Finance",
  description: "Prestige Finance - Modern Banking Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Providers>
          <Header />
          <DesktopSidebar />
          <main className="pt-16 pb-16 md:pl-64">{children}</main>
          <MobileNavbar />
        </Providers>
      </body>
    </html>
  );
}
