"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "fitness-shop-cookie-info-accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY);

    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl">
      <div>
        <strong>Používáme pouze nezbytné ukládání dat</strong>
        <p>
          Košík ukládáme do localStorage, aby e-shop správně fungoval.
          Nepoužíváme analytické ani marketingové cookies.
        </p>
        <Link href="/privacy-policy">Více informací</Link>
      </div>

      <button className="rounded-xl bg-zinc-900 px-4 py-2 text-white" onClick={accept}>
        Rozumím
      </button>
    </div>
  );
}