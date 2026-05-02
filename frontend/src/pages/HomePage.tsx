import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AuthStatusCard } from "../components/AuthStatusCard";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, LoadingState } from "../components/QueryState";
import { TopCategoryStrip } from "../components/TopCategoryStrip";
import { getProducts } from "../shared/api/catalog";

const heroSlides = [
  {
    title: "Bahar Firsatlari",
    to: "/moda",
    imageSrc: "/hero/bahar_firsat_1180_440.png",
  },
  {
    title: "Bebek Arabasi Kampanyasi",
    to: "/anne-bebek",
    imageSrc: "/hero/bebek_araba_1180_440.png",
  },
  {
    title: "Gamerlara Flas Teklif",
    to: "/elektronik",
    imageSrc: "/hero/gamer_flas_1180_440.png",
  },
  {
    title: "Hediye Carki",
    to: "/",
    imageSrc: "/hero/hediye_cark_1180_440.png",
  },
  {
    title: "Parfum ve Deodorant",
    to: "/kozmetik",
    imageSrc: "/hero/parfum_deodorant_1180_440.png",
  },
  {
    title: "Kupon Yagmuru",
    to: "/",
    imageSrc: "/hero/kupon_yagmur_1180_440.png",
  },
];

const serviceHighlights = [
  { title: "Ayni Gun Teslimat", description: "Secili urunlerde ayni gun kapinda!", icon: "➜" },
  { title: "Kuponlar", description: "Size ozel kuponlar ve indirimler.", icon: "%" },
  { title: "Firsat Urunleri", description: "Kacirilmayacak teklifler burada.", icon: "✦" },
  { title: "Cok Satanlar", description: "En cok tercih edilen urunler.", icon: "♨" },
];

const footerColumns = [
  {
    title: "Alisverisim",
    items: ["Hakkimizda", "Kariyer", "Basin Odasi", "Yatirimci Iliskileri", "Iletisim"],
  },
  {
    title: "Musteri Hizmetleri",
    items: ["Yardim & Destek", "Sikca Sorulan Sorular", "Kargo & Teslimat", "Iade & Degisim", "Odeme Secenekleri"],
  },
  {
    title: "Populer Kategoriler",
    items: ["Elektronik", "Moda", "Anne & Bebek", "Kozmetik", "Supermarket"],
  },
  {
    title: "One Cikanlar",
    items: ["Kampanyalar", "Kuponlar", "Firsat Urunleri", "Cok Satanlar", "Yeni Urunler"],
  },
];

export function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        size: 8,
      }),
  });

  const featuredProducts = productsQuery.data?.content ?? [];

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <div>
      <TopCategoryStrip />

      <section className="bg-[#f6f7fb]">
        <div className="mx-auto max-w-7xl px-4 pb-0 pt-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {heroSlides.map((slide) => (
              <Link
                key={slide.title}
                to={slide.to}
                className="block min-h-[20rem] min-w-full bg-white lg:min-h-[23rem]"
              >
                <img
                  src={slide.imageSrc}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Onceki slide"
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 transition hover:border-brand-300 hover:text-brand-700"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Sonraki slide"
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 transition hover:border-brand-300 hover:text-brand-700"
          >
            ›
          </button>

          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`${index + 1}. slide`}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index ? "w-10 bg-brand-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)]">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {serviceHighlights.map((item) => (
            <div key={item.title} className="flex items-center gap-4 px-5 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5ff] text-2xl text-brand-700">
                {item.icon}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[1.75rem] font-bold tracking-tight text-slate-900">Cok Satan Urunler</h2>
            <p className="mt-1 text-sm text-slate-500">Gateway uzerinden akan katalog verisi ile olusan urun vitrini.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-bold text-brand-700">
              Tumunu Gor →
            </a>
          </div>
        </div>

        <div className="px-5 py-5">
          {productsQuery.isLoading && <LoadingState label="Urunler getiriliyor..." />}
          {productsQuery.isError && (
            <ErrorState label="Katalog servisi veya gateway ayakta degilse urun rayi bos kalir." />
          )}
          {productsQuery.data && featuredProducts.length === 0 && (
            <EmptyState
              title="Henuz vitrine cikmis urun yok"
              description="README icindeki seller token ve urun olusturma adimlari ile kataloga veri eklediginde bu alan dolacak."
            />
          )}
          {featuredProducts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-5">
        <AuthStatusCard />
      </div>

      <footer className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)]">
        <div className="grid gap-8 px-5 py-8 md:grid-cols-2 xl:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-bold text-slate-900">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {column.items.map((item) => (
                  <li key={item}>
                    <a href="/" className="transition hover:text-brand-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-base font-bold text-slate-900">Bizi Takip Edin</h3>
            <div className="mt-4 flex items-center gap-3 text-lg">
              {["◎", "f", "X", "▶"].map((icon) => (
                <a
                  key={icon}
                  href="/"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-slate-900">Mobil Uygulamayi Indirin</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">App Store</span>
                <span className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Google Play</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-400">
          © 2026 Alisverisim. Tum haklari saklidir. Gizlilik Politikasi · Kullanim Kosullari · KVKK · Cerez Politikasi
        </div>
      </footer>
      </div>
    </div>
  );
}
