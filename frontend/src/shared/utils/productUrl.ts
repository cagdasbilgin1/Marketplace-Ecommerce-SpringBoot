import type { Product } from "../types/catalog";

function normalizeSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateSlug(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength).replace(/-+$/g, "");
}

function readSellerSegment(product: Product) {
  const sellerValueCandidates = [
    product.metadata?.sellerSlug,
    product.metadata?.sellerName,
    product.metadata?.storeSlug,
    product.metadata?.storeName,
  ];

  const sellerValue = sellerValueCandidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);
  return normalizeSegment(String(sellerValue ?? "magaza")) || "magaza";
}

function readProductSegment(product: Product) {
  return truncateSlug(normalizeSegment(product.name), 30) || "urun";
}

export function buildProductPath(product: Product) {
  return `/${readSellerSegment(product)}/${readProductSegment(product)}-p-${product.productId}`;
}

export function extractProductId(productKey?: string) {
  if (!productKey) {
    return null;
  }

  const match = productKey.match(/-p-([^/]+)$/);
  return match?.[1] ?? null;
}
