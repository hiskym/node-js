const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorBody = await response.json();

      if (typeof errorBody.message === "string") {
        message = errorBody.message;
      }

      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      }
    } catch {
      // fallback message above
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}