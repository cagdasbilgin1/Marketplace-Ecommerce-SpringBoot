import { Link } from "react-router-dom";

import { heroCategoryNav } from "../shared/catalogNavigation";

const rightAlignedMegaMenus = new Set([
  "Mucevher & Saat",
  "Spor & Outdoor",
  "Kitap, Muzik, Film, Oyun",
  "Otomotiv & Motosiklet",
]);

type TopCategoryStripProps = {
  activeCategoryName?: string | null;
};

export function TopCategoryStrip({ activeCategoryName }: TopCategoryStripProps) {
  return (
    <section className="border-b border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch justify-between gap-0.5 overflow-visible">
          {heroCategoryNav.map((category) => {
            const categoryName = category.labelLines.join(" ");
            const megaMenuAlignmentClass = rightAlignedMegaMenus.has(categoryName) ? "right-0" : "left-0";
            const megaMenuColumns = Math.min(category.children.length, 4);
            const megaMenuWidthRem = megaMenuColumns * 5.8 + (megaMenuColumns - 1) * 0.5 + 3;
            const isActive = activeCategoryName === categoryName;

            return (
              <div
                key={categoryName}
                className="group relative inline-flex h-[60px] min-w-0 flex-none items-center gap-2 rounded-xl pl-1 pr-2 text-slate-800"
              >
                <Link to={category.to} className="absolute inset-0 z-10" aria-label={categoryName} />
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                  <img src={category.imageSrc} alt={categoryName} className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 text-[12px] font-semibold leading-4">
                  {category.labelLines.map((line) => (
                    <span key={line} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-600 transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`absolute top-full z-20 hidden max-w-[76vw] pt-0 group-hover:block ${megaMenuAlignmentClass}`}
                  style={{ width: `${megaMenuWidthRem}rem` }}
                >
                  <div className="h-2 w-full" />
                  <div className="pointer-events-auto rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_24px_48px_rgba(15,23,42,0.14)]">
                    <p className="text-[1.15rem] font-bold tracking-tight text-slate-900">{categoryName}</p>
                    <div
                      className="mt-5 grid justify-start gap-x-2 gap-y-2"
                      style={{ gridTemplateColumns: `repeat(${megaMenuColumns}, 5.8rem)` }}
                    >
                      {category.children.map((child) => (
                        <Link
                          key={child.label}
                          to={`/${child.slug}`}
                          className="pointer-events-auto flex w-[5.8rem] flex-col items-center rounded-2xl bg-white px-0.5 py-1.5 text-center transition hover:bg-brand-50"
                        >
                          <span className="mx-auto flex aspect-square w-full max-w-[3.5rem] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[0.38rem] font-bold uppercase tracking-[0.1em] text-slate-400">
                            <img src={child.imageSrc} alt={child.label} className="h-full w-full object-contain" />
                          </span>
                          <span className="mt-1.5 block max-w-[5.2rem] break-words whitespace-normal text-center text-[0.58rem] font-semibold leading-[0.78rem] text-slate-600">
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
