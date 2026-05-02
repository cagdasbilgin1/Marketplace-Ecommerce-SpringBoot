import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "../components/EmptyState";
import { ErrorState, LoadingState } from "../components/QueryState";
import { getProductByProductId, getProductBySlug } from "../shared/api/catalog";
import { formatPrice } from "../shared/utils/format";
import { buildProductPath, extractProductId } from "../shared/utils/productUrl";

export function ProductDetailPage() {
  const { slug, productKey, subSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const actualProductKey = productKey || subSlug;
  const productId = extractProductId(actualProductKey);

  const productQuery = useQuery({
    queryKey: ["product", productId ?? slug],
    queryFn: () => (productId ? getProductByProductId(productId) : getProductBySlug(slug!)),
    enabled: Boolean(productId || slug),
  });

  useEffect(() => {
    if (!productQuery.data) {
      return;
    }

    const canonicalPath = buildProductPath(productQuery.data);
    if (location.pathname !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [location.pathname, navigate, productQuery.data]);

  if (!slug && !productId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState title="Urun bulunamadi" description="Gecerli bir urun linki ile tekrar dene." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex text-sm font-semibold text-brand-700 transition hover:text-brand-500">
        Ana sayfaya don
      </Link>

      <div className="mt-6">
        {productQuery.isLoading && <LoadingState label="Urun detaylari yukleniyor..." />}
        {productQuery.isError && (
          <ErrorState label="Bu slug ile urun bulunamadi ya da katalog servisi su anda cevap vermiyor." />
        )}
        {productQuery.data && (
          <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_16px_50px_rgba(22,17,39,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-[22rem] bg-gradient-to-br from-brand-100 via-white to-[#fff4c7]">
                {productQuery.data.images[0] ? (
                  <img
                    src={productQuery.data.images[0].url}
                    alt={productQuery.data.images[0].altText || productQuery.data.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-10 text-center">
                    <div>
                      <p className="font-display text-4xl font-bold text-brand-700">{productQuery.data.category.name}</p>
                      <p className="mt-3 text-sm text-slate-500">Bu urun icin henuz gorsel eklenmemis.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.32em] text-brand-700">
                  {productQuery.data.category.name}
                </p>
                <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
                  {productQuery.data.name}
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-600">{productQuery.data.description}</p>

                <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Fiyat</p>
                  <p className="mt-2 text-4xl font-bold text-ink">
                    {formatPrice(productQuery.data.price, productQuery.data.currency)}
                  </p>
                  <p className="mt-4 text-sm text-slate-500">
                    Satici: <span className="font-mono">{productQuery.data.sellerId}</span>
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {Object.entries(productQuery.data.metadata ?? {}).map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700"
                    >
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
