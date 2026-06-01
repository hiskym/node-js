import Link from "next/link";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <main>
      <section className="card" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <h1>Objednávka byla úspěšně přijata</h1>

        {order && (
          <p>
            Číslo objednávky:
            <br />
            <strong style={{ fontSize: 24 }}>{order}</strong>
          </p>
        )}

        <p className="muted">
          Objednávku připravíme k osobnímu odběru. Jakmile bude připravena,
          administrátor může změnit její stav v administraci.
        </p>

        <p>
          Platba proběhne při převzetí objednávky.
        </p>

        <Link href="/" className="button">
          Zpět do obchodu
        </Link>
      </section>
    </main>
  );
}