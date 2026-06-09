import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500">
          Chyba 404
        </p>

        <h1 className="mt-2 text-5xl font-bold tracking-tight">
          Stránka nebyla nalezena
        </h1>

        <p className="mt-4 text-zinc-600">
          Je možné, že byla stránka přesunuta, odstraněna
          nebo adresa není správná.
        </p>

        <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">
          Domů
        </ButtonLink>

        <ButtonLink
          href="/products"
          variant="secondary"
        >
          Produkty
        </ButtonLink>
      </div>
      </div>
    </main>
  );
}