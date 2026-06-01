"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");

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
    <main style={{ padding: 32, maxWidth: 420 }}>
      <h1>Admin přihlášení</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            E-mail
            <br />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ width: "100%", padding: 8 }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Heslo
            <br />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ width: "100%", padding: 8 }}
              required
            />
          </label>
        </div>

        {mutation.isError && (
          <p style={{ color: "red" }}>Přihlášení se nepodařilo.</p>
        )}

        <button disabled={mutation.isPending}>
          {mutation.isPending ? "Přihlašuji..." : "Přihlásit se"}
        </button>
      </form>
    </main>
  );
}