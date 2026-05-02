import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, LoadingState } from "../components/QueryState";
import { TopCategoryStrip } from "../components/TopCategoryStrip";
import { getCategories, getProducts } from "../shared/api/catalog";
import { findSubcategoryBySlug } from "../shared/catalogNavigation";

type SortOption = "smart" | "price-asc" | "price-desc" | "newest" | "name-asc";

type ListingFilterConfig = {
  subcategoryChips: string[];
};

const listingConfigs: Record<string, ListingFilterConfig> = {
  "ayakkabi-ve-canta": {
    subcategoryChips: [
      "Erkek Ayakkabi",
      "Kadin Ayakkabi",
      "Kadin Canta",
      "Cocuk Ayakkabi",
      "Erkek Canta",
      "Bavul & Valiz",
      "Ayakkabi Bakim",
    ],
  },
};

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M7 4V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 6.5L7 4L9.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 17.5L17 20L19.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryPage() {
  const { slug } = useParams();
  const [sortOption, setSortOption] = useState<SortOption>("smart");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  const subcategoryMatch = slug ? findSubcategoryBySlug(slug) : null;
  const resolvedCategorySlug = subcategoryMatch ? subcategoryMatch.category.to.replace(/^\//, "") : slug;

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["category-products", resolvedCategorySlug, subcategoryMatch ? slug : undefined],
    queryFn: () =>
      getProducts({
        categorySlug: resolvedCategorySlug,
        size: 36,
      }),
    enabled: Boolean(resolvedCategorySlug),
  });

  const category = categoriesQuery.data?.find((item) => item.slug === resolvedCategorySlug);
  const products = productsQuery.data?.content ?? [];
  const pageTitle = subcategoryMatch?.child.label ?? category?.name ?? "Kategori vitrini";
  const pageDescription = subcategoryMatch
    ? `${subcategoryMatch.child.label} icin sonuclari listeledik.`
    : "Bu kategoriye ait urunler katalog servisinden canli olarak listelenir.";
  const activeCategoryName = subcategoryMatch ? subcategoryMatch.category.labelLines.join(" ") : category?.name ?? null;
  const listingConfig = listingConfigs[(subcategoryMatch ? slug : undefined) ?? ""] ?? { subcategoryChips: [] };

  const filteredProducts = useMemo(() => {
    let nextProducts = [...products];
    switch (sortOption) {
      case "price-asc":
        nextProducts = [...nextProducts].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        nextProducts = [...nextProducts].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        nextProducts = [...nextProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name-asc":
        nextProducts = [...nextProducts].sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      default:
        nextProducts = [...nextProducts].sort((a, b) => a.name.length - b.name.length);
        break;
    }

    return nextProducts;
  }, [products, sortOption]);

  if (!resolvedCategorySlug) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState title="Kategori bulunamadi" description="Gecerli bir kategori linki ile tekrar dene." />
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf6] pb-10">
      <TopCategoryStrip activeCategoryName={activeCategoryName} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-[1.02rem] text-slate-500">
          <Link to="/" className="transition hover:text-slate-900">
            Ana Sayfa
          </Link>
          <span>›</span>
          <Link to={subcategoryMatch?.category.to ?? `/${resolvedCategorySlug}`} className="transition hover:text-slate-900">
            {subcategoryMatch ? subcategoryMatch.category.labelLines.join(" ") : category?.name}
          </Link>
          {subcategoryMatch && (
            <>
              <span>›</span>
              <span className="font-medium text-slate-900">{subcategoryMatch.child.label}</span>
            </>
          )}
        </nav>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Kolon */}
          <div className="bg-blue-500 rounded-2xl p-4 min-h-[500px]">
            {/* Buraya sonradan filtreleme (sidebar) alanlari eklenebilir */}
          </div>

          {/* Sag Kolon */}
          <div className="bg-red-500 rounded-2xl p-4 lg:col-span-3">
            <section className="min-w-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <p className="text-[2.05rem] font-medium tracking-tight text-white">
                    <span className="font-extrabold">{pageTitle}</span> icin sonuclari listeledik.
                  </p>

                  <div className="w-full lg:max-w-[18rem]">
                    <label className="flex h-14 items-center gap-3 border border-slate-200 bg-white px-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] rounded-xl">
                      <span className="text-slate-500">
                        <SortIcon />
                      </span>
                      <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value as SortOption)}
                        className="w-full bg-transparent text-[1.02rem] font-bold text-slate-900 outline-none"
                      >
                        <option value="smart">Akilli Siralama</option>
                        <option value="newest">En Yeniler</option>
                        <option value="price-asc">Fiyat Artan</option>
                        <option value="price-desc">Fiyat Azalan</option>
                        <option value="name-asc">Ada Gore</option>
                      </select>
                    </label>
                  </div>
                </div>

                {listingConfig.subcategoryChips.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {listingConfig.subcategoryChips.map((chip) => {
                      const isActive = selectedChip === chip;

                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSelectedChip(isActive ? null : chip)}
                          className={`rounded-full border px-7 py-3 text-[1.02rem] font-medium transition ${
                            isActive ? "border-brand-500 bg-brand-50 text-brand-700" : "border-transparent bg-white text-slate-700 hover:border-brand-300"
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                )}

                {categoriesQuery.isLoading && <LoadingState label="Kategori bilgisi getiriliyor..." />}
                {categoriesQuery.isError && <ErrorState label="Kategori bilgisi su anda getirilemedi." />}
                {productsQuery.isLoading && <LoadingState label="Kategori urunleri yukleniyor..." />}
                {productsQuery.isError && <ErrorState label="Bu kategoriye ait urunler su anda getirilemedi." />}
                {productsQuery.data && filteredProducts.length === 0 && (
                  <EmptyState
                    title="Bu secime uygun urun bulunamadi"
                    description="Filtreleri temizleyerek ya da farkli bir alt kirilim secerek tekrar deneyebilirsin."
                  />
                )}

                {filteredProducts.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
