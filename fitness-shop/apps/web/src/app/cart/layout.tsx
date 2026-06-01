import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Košík",
  description: "Přehled vybraných produktů v košíku.",
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
        {children}
        </>
    )
}