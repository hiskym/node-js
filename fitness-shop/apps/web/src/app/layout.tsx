import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { AppQueryProvider } from "@/components/query-provider";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";
import { SiteNavbar } from "@/components/site-navbar";

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
  openGraph: {
    title: "Fitness Shop",
    description:
      "Jednoduchý e-shop s fitness pomůckami.",
    type: "website",
},
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
            <SiteNavbar />

            {children}
            <CookieBanner />
          </CartProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}