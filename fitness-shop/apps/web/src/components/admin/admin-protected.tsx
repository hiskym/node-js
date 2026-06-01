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
    return <main style={{ padding: 32 }}>Ověřuji přihlášení...</main>;
  }

  if (meQuery.isError || meQuery.data?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}