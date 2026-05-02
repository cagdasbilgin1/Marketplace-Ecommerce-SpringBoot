import type { Category } from "../shared/types/catalog";

type CategoryPillsProps = {
  categories: Category[];
  selectedSlug?: string;
  onSelect: (slug?: string) => void;
};

export function CategoryPills({ categories, selectedSlug, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          !selectedSlug
            ? "border-brand-500 bg-brand-500 text-white shadow-haze"
            : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
        }`}
      >
        Tum kategoriler
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            selectedSlug === category.slug
              ? "border-brand-500 bg-brand-500 text-white shadow-haze"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
