import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <SessionProviderWrapper>
          <CartProvider>
            <Toaster 
              position="bottom-right" 
              toastOptions={{ 
                duration: 3000,
                style: {
                  borderRadius: '8px',
                  background: '#363636',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500'
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff'
                  }
                }
              }} 
            />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
