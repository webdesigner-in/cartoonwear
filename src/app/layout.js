import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Kroshet Nani - Handmade Crochet Store",
  description: "Beautiful handmade crochet items crafted with love. From cozy blankets to adorable amigurumi, discover unique pieces for your home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
