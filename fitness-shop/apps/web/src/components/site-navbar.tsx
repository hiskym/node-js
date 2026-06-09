"use client";

import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { useCart } from "@/components/cart/cart-provider";

export function SiteNavbar() {
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="whitespace-nowrap text-lg font-bold">
          Fitness shop
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchForm />
        </div>

        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link href="/cart" className="hover:text-zinc-600">
            Košík{totalQuantity > 0 ? ` (${totalQuantity})` : ""}
          </Link>

          <Link href="/admin" className="hover:text-zinc-600">
            Uživatel
          </Link>
        </nav>
      </div>

      <div className="border-t border-zinc-100 px-6 py-3 md:hidden">
        <SearchForm />
      </div>
    </header>
  );
}