import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SellerOfficePage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/so/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Logo" className="h-14 w-14" />
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">Seller Office</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mağaza Yönetim Paneli</h1>
          <p className="mt-3 text-slate-500 font-medium">Satışlarınızı yönetmek için giriş yapın</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">E-posta veya Kullanıcı Adı</label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="E-posta veya kullanıcı adı"
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[1.05rem] font-medium outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-slate-700">Şifre</label>
                <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition">Şifremi Unuttum</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[1.05rem] font-medium outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[1.05rem] shadow-xl shadow-slate-900/10 transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Henüz bir mağazanız yok mu?{" "}
              <Link to="/so/register" className="text-brand-600 font-bold hover:underline">Ücretsiz Mağaza Aç</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-slate-600 transition">Yardım</Link>
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <Link to="/" className="hover:text-slate-600 transition">Kullanım Koşulları</Link>
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <Link to="/" className="hover:text-slate-600 transition">Marketplace</Link>
        </div>
      </div>
    </div>
  );
}
