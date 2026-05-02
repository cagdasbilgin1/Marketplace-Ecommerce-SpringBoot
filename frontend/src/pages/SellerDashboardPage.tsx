import { Link } from "react-router-dom";

export function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-xl font-black text-slate-900 tracking-tight">SELLER</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium text-sm">
            <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <i className="ri-user-line"></i>
            </span>
            Hesabım
          </button>
          <button className="relative p-2 text-slate-500 hover:text-slate-900 transition">
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="bg-brand-50 text-brand-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-brand-100 transition uppercase tracking-wider">
            Mağaza Destek Merkezi
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="max-w-screen-2xl mx-auto flex">
          <NavItem icon="ri-flashlight-line" label="Hızlı Menü" active />
          <NavItem icon="ri-box-3-line" label="Ürün Yönetimi" />
          <NavItem icon="ri-shopping-cart-2-line" label="Sipariş Yönetimi" />
          <NavItem icon="ri-bank-card-line" label="Ödeme ve Fatura Yönetimi" />
          <NavItem icon="ri-advertisement-line" label="Reklam Yönetimi" />
          <NavItem icon="ri-megaphone-line" label="Pazarlama Yönetimi" badge="YENİ" />
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-screen-2xl mx-auto p-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400 font-medium">
          <span className="hover:text-slate-600 cursor-pointer transition">Anasayfa</span>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-slate-900 font-bold">Panel</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sipariş Özeti Card */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Sipariş Özeti</h2>
              <button className="text-brand-600 text-sm font-bold hover:underline transition">Tüm Siparişler</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
              <StatItem label="Yeni Sipariş" value="0" />
              <StatItem label="İade Talebi" value="1" highlight />
              <StatItem label="İptal Talebi" value="0" />
              <StatItem label="Değişim Talebi" value="0" />
              <StatItem label="Kargoya Hazır" value="16" subValue />
              <StatItem label="Geciken Kargo" value="0" />
              <StatItem label="Kargolanan" value="30" />
              <StatItem label="Teslim Edilen" value="1" />
            </div>
          </div>

          {/* Mağaza Karnesi Card */}
          <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-lg font-black text-slate-900">Mağaza Karnesi</h2>
              <button className="text-brand-600 text-sm font-bold hover:underline transition">Detaylı İncele</button>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl font-black">
                  %92
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Mağaza Puanı</p>
                  <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[92%]"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <i className="ri-truck-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Ortalama Gönderim Süresi</p>
                  <p className="text-xl font-black text-slate-900">0.88 <span className="text-sm font-medium text-slate-500">GÜN</span></p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <button className="w-full py-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-2">
                  <i className="ri-award-line text-brand-600"></i>
                  Puanınızı nasıl yükseltirsiniz?
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: string, label: string, active?: boolean, badge?: string }) {
  return (
    <button className={`h-16 px-8 flex items-center gap-3 transition-all relative border-r border-slate-100 group ${active ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50"}`}>
      <i className={`${icon} text-lg ${active ? "text-brand-600" : "group-hover:text-slate-900"}`}></i>
      <span className="text-[0.85rem] font-bold">{label}</span>
      {badge && <span className="ml-2 px-1.5 py-0.5 bg-brand-600 text-white text-[0.6rem] font-black rounded uppercase">{badge}</span>}
      {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-600"></div>}
    </button>
  );
}

function StatItem({ label, value, highlight = false, subValue = false }: { label: string, value: string, highlight?: boolean, subValue?: boolean }) {
  return (
    <div className={`p-8 text-center transition-colors hover:bg-slate-50/50 ${subValue ? "bg-slate-50/30" : ""}`}>
      <p className="text-3xl font-black text-slate-900 mb-2">{value}</p>
      <p className={`text-[0.7rem] font-bold uppercase tracking-wider ${highlight ? "text-brand-600" : "text-slate-400"}`}>{label}</p>
    </div>
  );
}
