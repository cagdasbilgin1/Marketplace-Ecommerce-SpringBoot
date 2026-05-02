import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { CategorySidebar } from "../components/CategorySidebar";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, LoadingState } from "../components/QueryState";
import { TopCategoryStrip } from "../components/TopCategoryStrip";
import { getCategories, getProducts } from "../shared/api/catalog";
import { findSubcategoryBySlug, heroCategoryNav } from "../shared/catalogNavigation";

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
      "Ayakkabi Bakim Urunleri",
      "Cocuk Canta"
    ],
  },
  "kadin-canta": {
    subcategoryChips: [
      "Kadin Omuz Cantasi",
      "Kadin Cuzdan & Kartlik",
      "Kadin Sirt Cantasi",
      "Kadin El Cantasi",
      "Kadin Postaci Cantasi",
      "Bez & Alisveris Cantasi",
      "Kadin Bel Cantasi",
      "Kadin Canta Aksesuarlari",
      "Kadin Portfoy & Clutch Canta",
      "Kadin Abiye Canta",
      "Kadin Plaj Cantasi",
      "Kadin Evrak Cantasi",
    ],
  },
  "erkek-ayakkabi": {
    subcategoryChips: [
      "Erkek Gunluk Ayakkabi",
      "Erkek Terlik & Sandalet",
      "Erkek Bot & Cizme",
      "Erkek Ev Terligi & Panduf"
    ]
  },
  "kadin-ayakkabi": {
    subcategoryChips: [
      "Kadin Gunluk Ayakkabi",
      "Topuklu Ayakkabi",
      "Terlik & Sandalet",
      "Kadin Bot & Cizme",
      "Ev Terligi & Panduf"
    ]
  },
  "cocuk-ayakkabi": {
    subcategoryChips: [
      "Erkek Cocuk Ayakkabi",
      "Kiz Cocuk Ayakakabi"
    ]
  },
  "erkek-canta": {
    subcategoryChips: [
      "Erkek Cuzdan & Kartlik",
      "Erkek Sirt Cantasi",
      "Erkek El Cantasi & Portfoy",
      "Erkek Postaci Cantasi",
      "Erkek Bel Cantasi",
      "Erkek Evrak Cantasi",
      "Erkek Canta Aksesuarlari"
    ]
  },
  "bavul-valiz": {
    subcategoryChips: [
      "Valiz Seti",
      "Kabin Boy Valiz",
      "Seyahat Cantalari",
      "Orta Boy Valiz",
      "Valiz Kilifi & Aksesuar",
      "Buyuk Boy Valiz",
      "Cocuk Valizleri",
      "Seyahat Kozmetik Cantalari"
    ]
  },
  "ayakkabi-bakim-urunleri": {
    subcategoryChips: [
      "Ayakkabi Boyasi & Spreyi",
      "Ayakkabi & Terlik Aksesuar",
      "Ayakkabi Tamir Malzemeleri",
      "Ayakkabi Bagcigi",
      "Ayakkabi Kalibi",
      "Ayakkabi Cekecegi"
    ]
  },
  "cocuk-canta": {
    subcategoryChips: [
      "Kiz Cocuk Cantasi",
      "Erkek Cocuk Cantasi"
    ]
  },
  "kadin-giyim-ve-aksesuar": {
    subcategoryChips: [
      "Elbise",
      "Bluz",
      "Kadin Tisort",
      "Kadin Gomlek",
      "Kadin Pantolon",
      "Kadin Kazak",
      "Ic Giyim",
      "Kadin Alt-Ust Takim",
      "Abiye Elbise",
      "Kadin Jean",
      "Kadin Sort",
      "Kadin Hirka",
      "Tesettur Giyim",
      "Dis Giyim",
      "Kadin Aksesuar",
      "Kadin Body",
      "Crop Top",
      "Tayt",
      "Kadin Esofman & Sweatshirt",
      "Buyuk Beden",
      "Etek",
      "Kadin Plaj Giyim",
      "Kadin Tulum",
      "Kadin Suveter",
      "Gelinlik"
    ]
  },
  "erkek-giyim-ve-aksesuar": {
    subcategoryChips: [
      "Erkek Tisort & Polo Yaka Tisort",
      "Gomlek",
      "Dis Giyim",
      "Ic Giyim",
      "Erkek Aksesuar",
      "Pantolon & Sort",
      "Esofman & Sweatshirt",
      "Takim Elbise",
      "Kazak & Hirka",
      "Erkek Mayo & Deniz Sortu",
      "Erkek Buyuk Beden",
      "Smokin & Damatlik"
    ]
  },
  "cocuk-giyim-ve-aksesuar": {
    subcategoryChips: [
      "Kiz Cocuk",
      "Erkek Cocuk",
      "Aksesuar"
    ]
  }
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
  const { slug, subSlug, subSubSlug } = useParams();
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
  const currentLevelSlug = subSubSlug || subSlug || slug;
  const listingConfig = listingConfigs[currentLevelSlug ?? ""] ?? { subcategoryChips: [] };

  const subSlugMatch = subSlug 
    ? (listingConfigs[slug ?? ""]?.subcategoryChips ?? []).find(chip => chip.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === subSlug) 
    : null;

  const subSubSlugMatch = subSubSlug
    ? (listingConfigs[subSlug ?? ""]?.subcategoryChips ?? []).find(chip => chip.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === subSubSlug)
    : null;

  const topCategoryMatch = heroCategoryNav.find(c => c.to.replace(/^\//, "") === resolvedCategorySlug);

  const sidebarSubcategories = (!subcategoryMatch && !subSlug && topCategoryMatch)
    ? topCategoryMatch.children.map(child => ({
        name: child.label,
        slug: child.slug
      }))
    : listingConfig.subcategoryChips.map(chip => ({
        name: chip,
        slug: chip.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
      }));

  const sidebarBaseUrl = (!subcategoryMatch && !subSlug && topCategoryMatch)
    ? ""
    : (subSubSlug ? `${slug}/${subSlug}/${subSubSlug}` : (subSlug ? `${slug}/${subSlug}` : slug));

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                {subSlugMatch ? (
                  <Link to={`/${slug}`} className="transition hover:text-slate-900">
                    {subcategoryMatch.child.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">{subcategoryMatch.child.label}</span>
                )}
              </>
            )}
            {subSlugMatch && (
              <>
                <span>›</span>
                {subSubSlugMatch ? (
                  <Link to={`/${slug}/${subSlug}`} className="transition hover:text-slate-900">
                    {subSlugMatch}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">{subSlugMatch}</span>
                )}
              </>
            )}
            {subSubSlugMatch && (
              <>
                <span>›</span>
                <span className="font-medium text-slate-900">{subSubSlugMatch}</span>
              </>
            )}
          </nav>

          <div className="w-full lg:w-[16rem]">
            <label className="flex h-11 items-center gap-2.5 border border-slate-200 bg-white px-4 shadow-[0_4px_12px_rgba(15,23,42,0.03)] rounded-xl transition hover:border-brand-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 cursor-pointer">
              <span className="text-slate-400">
                <SortIcon />
              </span>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="w-full bg-transparent text-[0.95rem] font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="smart">Akıllı Sıralama</option>
                <option value="newest">En Yeniler</option>
                <option value="price-asc">Fiyat Artan</option>
                <option value="price-desc">Fiyat Azalan</option>
                <option value="name-asc">Ada Göre</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Kolon: Filtreler (Sidebar) */}
          <div className="lg:col-span-1">
            <CategorySidebar currentSlug={sidebarBaseUrl} subcategories={sidebarSubcategories} />
          </div>

          {/* Sag Kolon: Urunler */}
          <div className="lg:col-span-3">
            <section className="min-w-0">
              <div className="flex flex-col gap-4">


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
