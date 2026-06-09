import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  backHref = "/admin",
  backLabel,
  actions,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-block text-sm text-zinc-500 hover:text-zinc-900"
          >
            {backLabel ?? "← Zpět"}
          </Link>
        )}

        <p className="text-sm font-medium text-zinc-500">
          Administrace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-zinc-600">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}