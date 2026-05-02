export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  productId: string;
  sellerId: string;
  category: Category;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  metadata: Record<string, string | number | boolean | null>;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
