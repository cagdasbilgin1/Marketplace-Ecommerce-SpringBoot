import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
              <span className="ml-3 text-xl font-black tracking-tight text-slate-900">MARKETPLACE</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Turkiye'nin en hizli buyuyen modern pazar yeri platformu. Guvenli alisverisin ve kaliteli urunlerin adresi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Kurumsal</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-brand-600 transition">Hakkimizda</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">Kariyer</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">Iletisim</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">KVKK Politikasi</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Musteri Hizmetleri</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-brand-600 transition">Yardim Merkezi</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">Iptal & Iade</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">Kullanim Kosullari</Link></li>
              <li><Link to="/" className="hover:text-brand-600 transition">Islem Rehberi</Link></li>
            </ul>
          </div>

          {/* Stores Section (Requested) */}
          <div className="rounded-3xl bg-slate-50 p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900">Mağazalar</h3>
            <p className="mt-2 text-sm text-slate-500">
              Siz de satis yapmaya baslamak ve milyonlara ulasmak icin magazanizi acin.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link 
                to="/so" 
                className="flex h-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 active:scale-95"
              >
                Mağaza Girişi
              </Link>
              <Link 
                to="/so/register"
                className="flex h-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-transparent text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white active:scale-95"
              >
                Ücretsiz Mağaza Aç
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 font-medium">
            © 2026 Marketplace. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <span className="h-8 w-12 bg-slate-100 rounded-md animate-pulse"></span>
            <span className="h-8 w-12 bg-slate-100 rounded-md animate-pulse"></span>
            <span className="h-8 w-12 bg-slate-100 rounded-md animate-pulse"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
