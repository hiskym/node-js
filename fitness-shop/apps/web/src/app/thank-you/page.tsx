import Link from "next/link";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function ThankYouPage({
  searchParams,
}: Props) {
  const { order } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Objednávka byla přijata
        </h1>

        <p className="mt-3 text-zinc-600">
          Děkujeme za nákup.
        </p>

        {order && (
          <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
            <p className="text-sm text-zinc-500">
              Číslo objednávky
            </p>

            <p className="mt-1 text-xl font-semibold">
              {order}
            </p>
          </div>
        )}

        <div className="mt-8 text-left">
          <h2 className="font-semibold">
            Co bude následovat?
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 text-zinc-700">
            <li>Objednávku zkontrolujeme.</li>
            <li>Připravíme ji k osobnímu odběru.</li>
            <li>Kontaktujeme vás e-mailem.</li>
            <li>Objednávku si vyzvednete a zaplatíte.</li>
          </ol>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Zpět do obchodu
        </Link>
      </div>
    </main>
  );
}