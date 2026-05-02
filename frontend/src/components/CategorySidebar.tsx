import { useState } from "react";
import { Link } from "react-router-dom";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-semibold text-slate-800"
      >
        <span>{title}</span>
        <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

function SubFilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[0.85rem] font-bold text-slate-900">{title}</span>
        <span className="text-slate-400">
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckboxList({ options, selectedOptions, onChange }: { options: string[], selectedOptions: string[], onChange: (option: string, checked: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const isChecked = selectedOptions.includes(option);
        return (
          <label key={option} className="flex cursor-pointer items-center gap-3 text-[0.95rem] text-slate-600 hover:text-slate-900">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onChange(option, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

type CategorySidebarProps = {
  currentSlug?: string;
  subcategories?: { name: string; slug: string }[];
};

export function CategorySidebar({ currentSlug, subcategories = [] }: CategorySidebarProps) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: string, max: string} | null>(null);
  const [rating, setRating] = useState<{val: number, label: string} | null>(null);
  const [storeRating, setStoreRating] = useState<{val: number, label: string} | null>(null);

  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedCheckboxes(prev => [...prev, option]);
    } else {
      setSelectedCheckboxes(prev => prev.filter(o => o !== option));
    }
  };

  const applyPriceFilter = () => {
    if (tempMinPrice || tempMaxPrice) {
      setPriceRange({ min: tempMinPrice, max: tempMaxPrice });
    }
  };

  const removeFilter = (type: "checkbox" | "price" | "rating" | "storeRating", value?: string) => {
    if (type === "checkbox" && value) {
      setSelectedCheckboxes(prev => prev.filter(o => o !== value));
    } else if (type === "price") {
      setPriceRange(null);
      setTempMinPrice("");
      setTempMaxPrice("");
    } else if (type === "rating") {
      setRating(null);
    } else if (type === "storeRating") {
      setStoreRating(null);
    }
  };

  const clearAllFilters = () => {
    setSelectedCheckboxes([]);
    setPriceRange(null);
    setRating(null);
    setStoreRating(null);
    setTempMinPrice("");
    setTempMaxPrice("");
  };

  const hasActiveFilters = selectedCheckboxes.length > 0 || priceRange !== null || rating !== null || storeRating !== null;
  const isPriceError = tempMinPrice !== "" && tempMaxPrice !== "" && Number(tempMaxPrice) < Number(tempMinPrice);

  return (
    <aside className="flex flex-col gap-4">

      {hasActiveFilters && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-[0_8px_24px_rgba(255,68,239,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-bold text-brand-900">Seçili Filtreler</span>
            <button onClick={clearAllFilters} className="text-xs font-semibold text-brand-700 transition hover:text-brand-900 hover:underline">
              Temizle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCheckboxes.map(opt => (
              <span key={opt} className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white pl-3 pr-2 py-1.5 text-[0.8rem] font-medium text-brand-700 shadow-sm">
                <span>{opt}</span>
                <button onClick={() => removeFilter("checkbox", opt)} className="flex items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-900 p-0.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {priceRange && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white pl-3 pr-2 py-1.5 text-[0.8rem] font-medium text-brand-700 shadow-sm">
                <span>{priceRange.min ? `${priceRange.min} TL` : '0 TL'} - {priceRange.max ? `${priceRange.max} TL` : 'Üstü'}</span>
                <button onClick={() => removeFilter("price")} className="flex items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-900 p-0.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white pl-3 pr-2 py-1.5 text-[0.8rem] font-medium text-brand-700 shadow-sm">
                <span>{rating.label}</span>
                <button onClick={() => removeFilter("rating")} className="flex items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-900 p-0.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {storeRating && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white pl-3 pr-2 py-1.5 text-[0.8rem] font-medium text-brand-700 shadow-sm">
                <span>{storeRating.label} (Mağaza)</span>
                <button onClick={() => removeFilter("storeRating")} className="flex items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-900 p-0.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {subcategories.length > 0 && currentSlug !== undefined && (
        <FilterSection title="Kategori">
          <div className="flex flex-col gap-3">
            {subcategories.map(sub => (
              <Link 
                key={sub.slug}
                to={currentSlug ? `/${currentSlug}/${sub.slug}` : `/${sub.slug}`}
                className="text-[0.95rem] text-slate-600 hover:text-brand-700 transition"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Ürün Özellikleri">
        <div className="flex flex-col">
          <SubFilterSection title="Cinsiyet">
            <CheckboxList 
              options={["Kadın", "Erkek", "Unisex", "Kız Çocuk", "Erkek Çocuk"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
          
          <SubFilterSection title="Marka">
            <CheckboxList 
              options={["Nike", "Adidas", "Puma", "Vans", "Skechers", "Zara", "Mango"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
          
          <SubFilterSection title="Numara">
            <CheckboxList 
              options={["36", "37", "38", "39", "40", "41", "42", "43", "44"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
          
          <SubFilterSection title="Renk">
            <CheckboxList 
              options={["Siyah", "Beyaz", "Kırmızı", "Mavi", "Yeşil", "Bej"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
          
          <SubFilterSection title="Materyal">
            <CheckboxList 
              options={["Deri", "Süet", "Kumaş", "Suni Deri", "Keten"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
        </div>
      </FilterSection>

      <FilterSection title="Fiyat Aralığı">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="En Az"
            value={tempMinPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 0) setTempMinPrice(val);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            min="0"
            placeholder="En Çok"
            value={tempMaxPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Number(val) >= 0) setTempMaxPrice(val);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        {isPriceError && (
          <p className="mt-2 text-[0.75rem] font-medium text-red-500">
            Maksimum fiyat minimum fiyattan küçük girilmemelidir.
          </p>
        )}
        <button 
          disabled={isPriceError}
          onClick={applyPriceFilter}
          className={`mt-3 w-full rounded-lg py-2.5 text-sm font-bold transition ${
            isPriceError ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Uygula
        </button>
      </FilterSection>

      <FilterSection title="Mağaza">
        <div className="flex flex-col">
          <SubFilterSection title="Mağaza Puanı">
            <div className="flex flex-col gap-3">
              {[
                { label: "10 Yıldız", val: 10 },
                { label: "9+ Yıldız", val: 9 },
                { label: "8+ Yıldız", val: 8 },
                { label: "7+ Yıldız", val: 7 },
                { label: "6+ Yıldız", val: 6 },
              ].map((item) => (
                <label key={item.val} className="flex cursor-pointer items-center gap-3 text-[0.95rem] text-slate-600 hover:text-slate-900">
                  <input
                    type="radio"
                    name="storeRating"
                    value={item.val}
                    checked={storeRating?.val === item.val}
                    onChange={() => setStoreRating(item)}
                    className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </SubFilterSection>
          <SubFilterSection title="Mağaza Seçimi">
            <CheckboxList 
              options={["Bambi", "Sporjinal", "UygunDunya"]} 
              selectedOptions={selectedCheckboxes} 
              onChange={handleCheckboxChange} 
            />
          </SubFilterSection>
        </div>
      </FilterSection>

      <FilterSection title="Ürün Puanı">
        <div className="flex flex-col gap-3">
          {[
            { label: "5 Yıldız", val: 5 },
            { label: "4+ Yıldız", val: 4 },
            { label: "3+ Yıldız", val: 3 },
            { label: "2+ Yıldız", val: 2 },
            { label: "1+ Yıldız", val: 1 },
          ].map((item) => (
            <label key={item.val} className="flex cursor-pointer items-center gap-3 text-[0.95rem] text-slate-600 hover:text-slate-900">
              <input
                type="radio"
                name="productRating"
                value={item.val}
                checked={rating?.val === item.val}
                onChange={() => setRating(item)}
                className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-600"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
