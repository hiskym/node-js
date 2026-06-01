import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Link href="/" className="muted">
        ← Zpět na obchod
      </Link>

      <section className="card" style={{ marginTop: 24 }}>
        <h1>Zásady ochrany osobních údajů</h1>

        <p>
          Tento e-shop zpracovává osobní údaje pouze za účelem vytvoření a
          vyřízení objednávky.
        </p>

        <h2>Jaké údaje zpracováváme</h2>
        <p>
          Jméno, e-mail, telefon a případnou poznámku k objednávce.
        </p>

        <h2>Účel zpracování</h2>
        <p>
          Údaje používáme pro evidenci objednávky, komunikaci se zákazníkem a
          přípravu osobního odběru.
        </p>

        <h2>Doba uchování</h2>
        <p>
          Údaje jsou uchovávány po dobu nezbytnou pro splnění objednávky a
          následnou evidenci v rámci školního projektu.
        </p>

        <h2>Externí služby</h2>
        <p>
          Projekt nepoužívá platební bránu, dopravní API, analytické ani
          marketingové nástroje.
        </p>
      </section>
    </main>
  );
}