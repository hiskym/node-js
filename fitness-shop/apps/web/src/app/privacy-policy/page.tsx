import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-950">
        ← Zpět do obchodu
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">
          Fitness Shop
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Zásady ochrany osobních údajů
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
          Tento e-shop zpracovává osobní údaje pouze v rozsahu nutném pro
          vytvoření a vyřízení objednávky. Projekt nepoužívá analytické ani
          marketingové nástroje.
        </p>

        <div className="mt-8 grid gap-5">
          <section className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">Jaké údaje zpracováváme</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-700">
              <li>jméno a příjmení,</li>
              <li>e-mailovou adresu,</li>
              <li>telefonní číslo,</li>
              <li>obsah objednávky,</li>
              <li>volitelnou poznámku k objednávce.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">Účel zpracování</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              Údaje používáme pro evidenci objednávky, komunikaci se zákazníkem,
              zaslání potvrzení objednávky a přípravu osobního odběru.
            </p>
          </section>

          <section className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">Doprava a platba</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              E-shop v aktuální verzi podporuje osobní odběr a platbu při
              převzetí. Nepoužívá platební bránu ani externí dopravní API.
            </p>
          </section>

          <section className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">Ukládání dat v prohlížeči</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              Košík je uložen v localStorage prohlížeče, aby zůstal zachovaný
              při procházení e-shopu. Nejde o marketingové ani analytické
              sledování.
            </p>
          </section>

          <section className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">Doba uchování</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              Údaje jsou uchovávány po dobu nezbytnou pro vyřízení objednávky a
              evidenci v rámci školního projektu.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}