import { http } from "./http";
import type { Category, PaginatedResponse, Product } from "../types/catalog";

export async function getCategories() {
  const response = await http.get<Category[]>("/catalog/categories");
  return response.data;
}

export async function getProducts(params?: {
  categorySlug?: string;
  page?: number;
  size?: number;
}) {
  const response = await http.get<PaginatedResponse<Product>>("/catalog/products", {
    params,
  });
  return response.data;
}

export async function getProductBySlug(slug: string) {
  const response = await http.get<Product>(`/catalog/products/by-slug/${slug}`);
  return response.data;
}

export async function getProductById(id: string) {
  const response = await http.get<Product>(`/catalog/products/${id}`);
  return response.data;
}

export async function getProductByProductId(productId: string) {
  const response = await http.get<Product>(`/catalog/products/by-product-id/${productId}`);
  return response.data;
}
