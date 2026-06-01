const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:3001";

export function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    return `${API_ORIGIN}${imageUrl}`;
  }

  return imageUrl;
}