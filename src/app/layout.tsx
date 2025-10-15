import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import ThoughtFlowTransition from '@/components/ThoughtFlowTransition';
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
  title: "Thought Podcast - Capacity, Connection, Condition, Commission",
  description: "A conversation at the intersection of Capacity, Connection, Condition, and Commission.",
  openGraph: {
    images: [
      {
        url: "/pod_art.png",
        width: 1200,
        height: 630,
        alt: "Thought Podcast - Capacity, Connection, Condition, Commission",
      },
    ],
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
  <ThoughtFlowTransition show={true} />
  {children}
      </body>
    </html>
  );
}
