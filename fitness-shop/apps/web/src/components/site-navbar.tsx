"use client";

import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { useCart } from "@/components/cart/cart-provider";

export function SiteNavbar() {
  const { totalQuantity } = useCart();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          Fitness shop
        </Link>

        <SearchForm />

        <nav className="site-nav">
          <Link href="/cart">
            Košík{totalQuantity > 0 ? ` (${totalQuantity})` : ""}
          </Link>

          <Link href="/admin">Uživatel</Link>
        </nav>
      </div>
    </header>
  );
}