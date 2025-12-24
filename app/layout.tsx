import type { Metadata } from "next";
import {Schibsted_Grotesk, Martian_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const schibestedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developer's Event",
  description: "Hub for every Event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibestedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
