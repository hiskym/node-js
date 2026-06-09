"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/admin");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    mutation.mutate({
      email,
      password,
    });
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Administrace</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Přihlášení
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          Přihlas se administrátorským účtem pro správu produktů, kategorií a
          objednávek.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Heslo
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {mutation.isError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Přihlášení se nepodařilo."}
            </p>
          )}

          <Button disabled={mutation.isPending}>
            {mutation.isPending ? "Přihlašuji..." : "Přihlásit se"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-zinc-500">
          Testovací přihlašovací údaje jsou uvedené v README projektu.
        </p>
      </section>
    </main>
  );
}