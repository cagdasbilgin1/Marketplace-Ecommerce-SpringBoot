import { Link } from "react-router-dom";

import type { Product } from "../shared/types/catalog";
import { formatPrice } from "../shared/utils/format";
import { buildProductPath } from "../shared/utils/productUrl";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const discountRate = (product.name.length % 18) + 5;
  const reviewCount = 120 + product.name.length * 13;
  const oldPrice = product.price * 1.16;
  const productPath = buildProductPath(product);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(87,33,131,0.14)]">
      <Link to={productPath} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-50">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-brand-700">{product.category.name}</p>
                <p className="mt-2 text-sm text-slate-500">Gorsel yerine kategori odakli vitrin kullaniliyor.</p>
              </div>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-lg bg-orange-500 px-2 py-1 text-[11px] font-extrabold text-white">
            %{discountRate} INDIRIM
          </span>
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 transition hover:text-brand-700"
          >
            ♡
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-2 min-h-[3rem] text-[15px] font-semibold leading-6 text-slate-800">
              {product.name}
            </h3>
            <p className="mt-2 text-xs text-orange-500">★★★★★ <span className="text-slate-400">({reviewCount})</span></p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[1.05rem] font-extrabold text-slate-900">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className="mt-1 text-xs text-slate-400 line-through">
                {formatPrice(oldPrice, product.currency)}
              </p>
            </div>
          </div>

          <span className="inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-brand-600">
            Sepete Ekle
          </span>
        </div>
      </Link>
    </article>
  );
}
