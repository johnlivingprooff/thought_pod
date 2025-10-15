import type { Metadata } from "next";
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
