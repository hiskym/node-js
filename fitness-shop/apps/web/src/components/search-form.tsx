"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        className="input"
        placeholder="Hledat produkty..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button className="button" type="submit">
        Hledat
      </button>
    </form>
  );
}