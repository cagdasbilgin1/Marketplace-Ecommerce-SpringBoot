import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

const CITIES_DATA: { [key: string]: string[] } = {
  "Istanbul": ["Kadikoy", "Besiktas", "Sisli", "Uskudar", "Bakirkoy", "Maltepe", "Atasehir"],
  "Ankara": ["Cankaya", "Kecioren", "Yenimahalle", "Etimesgut", "Mamak"],
  "Izmir": ["Konak", "Karsiyaka", "Bornova", "Buca", "Cigli"],
  "Bursa": ["Nilufer", "Osmangazi", "Yildirim"],
  "Antalya": ["Muratpasa", "Kepez", "Konyaalti"],
  "Adana": ["Cukurova", "Seyhan"],
  "Gaziantep": ["Sahinbey", "Sehitkamil"]
};

export function SellerRegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // Step 1: Account
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
    storeName: "",
    storeUrl: "",
    membershipType: "Sahis", // Sahis, Sirket

    // Step 2: Business
    businessName: "",
    registeredBrand: "",
    mersisNo: "",
    chamberOfCommerce: "",
    tradeRegistryNo: "",
    kepAddress: "",
    taxExemption: "", // Var, Yok
    activityGroup: "",

    // Step 3: Company & Contact
    taxNo: "",
    taxOffice: "",
    companyTitle: "",
    companyType: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
    mobilePhone: "",
    workPhone: "",
    authFirstName: "",
    authLastName: "",
    authTitle: "",

    // Step 4: Bank & Agreements
    bankName: "",
    iban: "",
    agreedPartnership: false,
    agreedCooperation: false,
    readClarification: false
  });

  const slugify = (text: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ı': 'i', 'ö': 'o',
      'Ç': 'c', 'Ğ': 'g', 'Ş': 's', 'Ü': 'u', 'İ': 'i', 'Ö': 'o'
    };
    let slug = text.toLowerCase();
    for (const key in trMap) {
      slug = slug.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return slug.replace(/[^a-z0-9]/g, '');
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.includes(field)) {
      setErrors(prev => prev.filter(e => e !== field));
    }
  };

  const updateStoreName = (v: string) => {
    const val = v.replace(/\s/g, '');
    updateField("storeName", val);
    updateField("storeUrl", `cagdasbilgin.com/magaza/${slugify(val)}`);
  };

  const validateStep = () => {
    const newErrors: string[] = [];

    if (step === 1) {
      if (!formData.username) newErrors.push("username");
      if (!formData.email) newErrors.push("email");
      if (!formData.confirmEmail) newErrors.push("confirmEmail");
      if (!formData.password) newErrors.push("password");
      if (!formData.confirmPassword) newErrors.push("confirmPassword");
      if (!formData.storeName) newErrors.push("storeName");
      
      if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
        newErrors.push("confirmEmail");
      }
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.push("confirmPassword");
      }
    }

    if (step === 2) {
      if (!formData.businessName) newErrors.push("businessName");
      if (!formData.mersisNo) newErrors.push("mersisNo");
      if (!formData.kepAddress) newErrors.push("kepAddress");
      if (!formData.chamberOfCommerce) newErrors.push("chamberOfCommerce");
      if (!formData.tradeRegistryNo) newErrors.push("tradeRegistryNo");
      if (!formData.taxExemption) newErrors.push("taxExemption");
      if (!formData.activityGroup) newErrors.push("activityGroup");
    }

    if (step === 3) {
      if (!formData.taxNo) newErrors.push("taxNo");
      if (!formData.taxOffice) newErrors.push("taxOffice");
      if (!formData.companyTitle) newErrors.push("companyTitle");
      if (!formData.companyType) newErrors.push("companyType");
      if (!formData.city) newErrors.push("city");
      if (!formData.district) newErrors.push("district");
      if (!formData.address) newErrors.push("address");
      if (!formData.postalCode) newErrors.push("postalCode");
      if (!formData.mobilePhone) newErrors.push("mobilePhone");
      if (!formData.authFirstName) newErrors.push("authFirstName");
      if (!formData.authLastName) newErrors.push("authLastName");
      if (!formData.authTitle) newErrors.push("authTitle");
    }

    if (step === 4) {
      if (!formData.bankName) newErrors.push("bankName");
      if (!formData.iban) newErrors.push("iban");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      const firstErrorField = document.getElementById(newErrors[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => (s < 4 ? (s + 1) as Step : s));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((s) => (s > 1 ? (s - 1) as Step : s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!formData.agreedPartnership || !formData.agreedCooperation || !formData.readClarification) {
      setErrors(prev => [...prev, "agreements"]);
      return;
    }
    alert("Mağaza başvurunuz başarıyla oluşturuldu!");
    navigate("/so");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4" ref={formRef}>
      <div className="w-full max-w-[800px] mb-8 text-left">
        <Link to="/" className="inline-flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Seller Office</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Mağaza Kayıt Başvurusu</h1>
        
        <div className="mt-8 relative flex items-center justify-between px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 transition-all duration-500 -z-10 rounded-full" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-300 text-sm ${
                step >= s ? "bg-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white text-slate-400 border-2 border-slate-200"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[800px] bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100">
        <form onSubmit={handleRegister}>
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">1</span>
                Hesap Bilgileri
              </h2>
              <div className="max-w-[440px] space-y-4">
                <InputField id="username" label="Kullanıcı Adı*" value={formData.username} onChange={(v) => updateField("username", v)} error={errors.includes("username")} />
                <InputField id="email" label="E-Posta*" type="email" value={formData.email} onChange={(v) => updateField("email", v)} error={errors.includes("email")} />
                <InputField id="confirmEmail" label="E-Posta Tekrar*" type="email" value={formData.confirmEmail} onChange={(v) => updateField("confirmEmail", v)} error={errors.includes("confirmEmail")} />
                <InputField id="password" label="Şifre*" type="password" value={formData.password} onChange={(v) => updateField("password", v)} error={errors.includes("password")} />
                <InputField id="confirmPassword" label="Şifre Tekrar*" type="password" value={formData.confirmPassword} onChange={(v) => updateField("confirmPassword", v)} error={errors.includes("confirmPassword")} />
              </div>
                
              <div className="space-y-4 mt-8">
                <div className={`p-5 rounded-2xl border transition-all max-w-[500px] ${errors.includes("storeName") ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"}`}>
                  <InputField 
                    id="storeName"
                    label="Mağaza Adı*" 
                    value={formData.storeName} 
                    onChange={updateStoreName} 
                    placeholder="Mağaza adınızı girin"
                    error={errors.includes("storeName")}
                  />
                  <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-wider text-red-600">
                    ⚠ Mağazanız bu isimle görünür, boşluk içeremez ve sonradan değiştirilemez.
                  </p>
                </div>
                
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 max-w-[500px]">
                  <label className="block text-[0.7rem] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Mağaza URL</label>
                  <div className="text-[0.9rem] font-bold text-slate-800 break-all bg-white px-4 py-3 rounded-xl border border-slate-200">
                    {formData.storeUrl || "cagdasbilgin.com/magaza/..."}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[0.75rem] font-bold text-slate-700 mb-3 ml-1">Üyelik Türü*</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => updateField("membershipType", "Sahis")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      formData.membershipType === "Sahis" ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <p className="font-bold text-xs">Şahıs</p>
                    <p className="text-[0.6rem] mt-0.5 opacity-70">Adi Ortaklık ve Gerçek Kişi</p>
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateField("membershipType", "Sirket")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      formData.membershipType === "Sirket" ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <p className="font-bold text-xs">Şirket</p>
                    <p className="text-[0.6rem] mt-0.5 opacity-70">A.Ş, Ltd, Komandit...</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">2</span>
                İşletme ve Faaliyet Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField id="businessName" label="İşletme Adı*" value={formData.businessName} onChange={(v) => updateField("businessName", v)} error={errors.includes("businessName")} />
                <InputField label="Tescilli Marka" value={formData.registeredBrand} onChange={(v) => updateField("registeredBrand", v)} />
                <InputField id="mersisNo" label="MERSİS No*" value={formData.mersisNo} onChange={(v) => updateField("mersisNo", v)} error={errors.includes("mersisNo")} />
                <InputField id="kepAddress" label="KEP Adresi*" value={formData.kepAddress} onChange={(v) => updateField("kepAddress", v)} error={errors.includes("kepAddress")} />
                <InputField id="chamberOfCommerce" label="Kayıtlı Olduğu Ticaret Odası*" value={formData.chamberOfCommerce} onChange={(v) => updateField("chamberOfCommerce", v)} error={errors.includes("chamberOfCommerce")} />
                <InputField id="tradeRegistryNo" label="Ticaret Sicil Numarası*" value={formData.tradeRegistryNo} onChange={(v) => updateField("tradeRegistryNo", v)} error={errors.includes("tradeRegistryNo")} />
                
                <SelectField 
                  id="taxExemption"
                  label="Vergi Muafiyeti*" 
                  options={["Var", "Yok"]} 
                  value={formData.taxExemption} 
                  onChange={(v) => updateField("taxExemption", v)} 
                  error={errors.includes("taxExemption")}
                />
                <SelectField 
                  id="activityGroup"
                  label="Faaliyet Grubu*" 
                  options={[
                    "Moda", "Elektronik", "Ev & Yasam", "Anne & Bebek", 
                    "Kozmetik & Kisisel Bakim", "Mucevher & Saat", 
                    "Spor & Outdoor", "Kitap, Muzik, Film, Oyun", "Otomotiv & Motosiklet"
                  ]} 
                  value={formData.activityGroup} 
                  onChange={(v) => updateField("activityGroup", v)} 
                  error={errors.includes("activityGroup")}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">3</span>
                Şirket ve Yetkili Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField id="taxNo" label="Vergi No*" value={formData.taxNo} onChange={(v) => updateField("taxNo", v)} error={errors.includes("taxNo")} />
                <InputField id="taxOffice" label="Vergi Dairesi*" value={formData.taxOffice} onChange={(v) => updateField("taxOffice", v)} error={errors.includes("taxOffice")} />
                <InputField id="companyTitle" label="Şirket Ünvanı*" value={formData.companyTitle} onChange={(v) => updateField("companyTitle", v)} error={errors.includes("companyTitle")} />
                <InputField id="companyType" label="Şirket Türü*" value={formData.companyType} onChange={(v) => updateField("companyType", v)} error={errors.includes("companyType")} />
                
                <SelectField 
                  id="city"
                  label="İl*" 
                  options={Object.keys(CITIES_DATA)} 
                  value={formData.city} 
                  onChange={(v) => {
                    updateField("city", v);
                    updateField("district", ""); 
                  }} 
                  error={errors.includes("city")}
                />
                <SelectField 
                  id="district"
                  label="İlçe*" 
                  options={formData.city ? CITIES_DATA[formData.city] : []} 
                  value={formData.district} 
                  onChange={(v) => updateField("district", v)} 
                  error={errors.includes("district")}
                />

                <div className="md:col-span-2">
                  <InputField id="address" label="Adres*" value={formData.address} onChange={(v) => updateField("address", v)} error={errors.includes("address")} />
                </div>
                <InputField id="postalCode" label="Posta Kodu*" value={formData.postalCode} onChange={(v) => updateField("postalCode", v)} error={errors.includes("postalCode")} />
                <InputField id="mobilePhone" label="Cep Telefonu*" value={formData.mobilePhone} onChange={(v) => updateField("mobilePhone", v)} error={errors.includes("mobilePhone")} />
                
                <div className="md:col-span-2 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 mt-2">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 ml-1">İmza Yetkilisi Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField id="authFirstName" label="Adı*" value={formData.authFirstName} onChange={(v) => updateField("authFirstName", v)} error={errors.includes("authFirstName")} />
                    <InputField id="authLastName" label="Soyadı*" value={formData.authLastName} onChange={(v) => updateField("authLastName", v)} error={errors.includes("authLastName")} />
                    <div className="col-span-2">
                      <InputField id="authTitle" label="İmza Yetkilisi Ünvanı*" value={formData.authTitle} onChange={(v) => updateField("authTitle", v)} error={errors.includes("authTitle")} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">4</span>
                Banka ve Sözleşmeler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField id="bankName" label="Banka*" value={formData.bankName} onChange={(v) => updateField("bankName", v)} error={errors.includes("bankName")} />
                <InputField id="iban" label="IBAN No*" value={formData.iban} onChange={(v) => updateField("iban", v)} placeholder="TR..." error={errors.includes("iban")} />
              </div>

              <div className="mt-6">
                <label className="block text-[0.7rem] font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Satıcı İş Ortaklığı ve Aracılık Hizmetleri Sözleşmesi</label>
                <div className="h-40 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-[0.75rem] text-slate-600 leading-relaxed scrollbar-thin scrollbar-thumb-slate-300">
                  <p className="font-bold mb-2">1. TARAFLAR VE KONU</p>
                  <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <p className="font-bold mb-2">2. HAK VE YÜKÜMLÜLÜKLER</p>
                  <p className="mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                  <p className="mb-4">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
                  <p className="font-bold mb-2">3. SÜRE VE FESİH</p>
                  <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                </div>
              </div>
              
              <div className={`mt-8 space-y-4 p-5 rounded-[1.5rem] border transition-all ${errors.includes("agreements") ? "bg-red-50 border-red-200" : "bg-brand-50/50 border-brand-100"}`}>
                <CheckboxItem 
                  label="Satıcı İş Ortaklığı ve Aracılık Hizmetleri Sözleşmesini okudum ve kabul ediyorum." 
                  checked={formData.agreedPartnership} 
                  onChange={(v) => updateField("agreedPartnership", v)}
                />
                <CheckboxItem 
                  label="İş birliği ve İlan Sözleşmesi koşullarını okudum ve kabul ediyorum." 
                  checked={formData.agreedCooperation} 
                  onChange={(v) => updateField("agreedCooperation", v)}
                />
                <CheckboxItem 
                  label="Aydınlatma metnini okudum ve anladım." 
                  checked={formData.readClarification} 
                  onChange={(v) => updateField("readClarification", v)}
                />
                {errors.includes("agreements") && <p className="text-[0.65rem] font-bold text-red-600 uppercase ml-7">⚠ Lütfen tüm sözleşmeleri onaylayın.</p>}
              </div>
            </div>
          )}

          <div className="mt-12 flex gap-4">
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="flex-1 h-14 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
              >
                Geri Dön
              </button>
            )}
            {step < 4 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex-[2] h-14 bg-slate-900 text-white rounded-xl font-black text-[1.05rem] shadow-xl shadow-slate-900/10 transition hover:bg-slate-800 active:scale-95"
              >
                Sonraki Adım
              </button>
            ) : (
              <button 
                type="submit"
                className="flex-[2] h-14 bg-brand-600 text-white rounded-xl font-black text-[1.05rem] shadow-xl shadow-brand-200 transition hover:bg-brand-700 active:scale-95"
              >
                Üye Ol ve Başvuruyu Tamamla
              </button>
            )}
          </div>
        </form>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Zaten hesabınız var mı? <Link to="/so" className="text-brand-600 font-bold hover:underline">Giriş Yap</Link>
      </p>
    </div>
  );
}

function InputField({ id, label, type = "text", value, onChange, placeholder = "", error = false }: { id?: string, label: string, type?: string, value: string, onChange: (v: string) => void, placeholder?: string, error?: boolean }) {
  return (
    <div className="w-full" id={id}>
      <label className={`block text-[0.7rem] font-bold mb-1.5 ml-1 transition-colors ${error ? "text-red-600" : "text-slate-700"}`}>
        {label}
        {error && <span className="ml-2 text-[0.6rem] uppercase tracking-tighter">(Gerekli)</span>}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 rounded-xl border px-4 text-[0.85rem] font-medium outline-none transition ${
          error 
          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/5" 
          : "border-slate-200 bg-slate-50/50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5"
        } placeholder:text-slate-400`}
      />
    </div>
  );
}

function SelectField({ id, label, options, value, onChange, error = false }: { id?: string, label: string, options: string[], value: string, onChange: (v: string) => void, error?: boolean }) {
  return (
    <div className="w-full" id={id}>
      <label className={`block text-[0.7rem] font-bold mb-1.5 ml-1 transition-colors ${error ? "text-red-600" : "text-slate-700"}`}>
        {label}
        {error && <span className="ml-2 text-[0.6rem] uppercase tracking-tighter">(Gerekli)</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-11 rounded-xl border px-4 text-[0.85rem] font-medium outline-none transition ${
          error 
          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/5" 
          : "border-slate-200 bg-slate-50/50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5"
        }`}
      >
        <option value="">Seçiniz</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="mt-0.5">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-2 border-slate-300 text-brand-600 focus:ring-brand-500 transition cursor-pointer"
        />
      </div>
      <span className="text-[0.75rem] font-medium text-slate-600 group-hover:text-slate-900 transition leading-relaxed">
        {label}
      </span>
    </label>
  );
}
