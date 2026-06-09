"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth";

export function AdminProtected({ children }: { children: ReactNode }) {
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isError || (meQuery.data && meQuery.data.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [meQuery.isError, meQuery.data, router]);

  if (meQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">Ověřuji přihlášení...</p>
        </div>
      </main>
    );
  }

  if (meQuery.isError || meQuery.data?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}