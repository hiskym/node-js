import Link from "next/link";

type Props = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export function AdminPageHeader({
  title,
  backHref = "/admin",
  backLabel = "← Zpět do administrace",
}: Props) {
  return (
    <div className="page-header">
      <div>
        <Link href={backHref} className="muted">
          {backLabel}
        </Link>
        <h1>{title}</h1>
      </div>
    </div>
  );
}