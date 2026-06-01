import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { AppQueryProvider } from "@/components/query-provider";
import { SearchForm } from "@/components/search-form";
import { CookieBanner } from "@/components/cookie-banner";
import Link from "next/link";
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
  title: {
    default: "Fitness Shop",
    template: "%s | Fitness Shop",
  },
  description:
    "Jednoduchý e-shop s fitness pomůckami pro domácí i silový trénink.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <AppQueryProvider>
          <CartProvider>
            <header className="site-header">
              <div className="site-header-inner">
                <Link href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
                  Fitness shop
                </Link>

                <SearchForm />

                <nav className="site-nav">
                  <Link href="/cart">Košík</Link>
                  <Link href="/admin">Admin</Link>
                </nav>
              </div>
            </header>

            {children}
            <CookieBanner />
          </CartProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}