export type SubcategoryItem = {
  label: string;
  imageSrc: string;
  slug: string;
};

export type HeroCategoryNavItem = {
  labelLines: string[];
  to: string;
  imageSrc: string;
  children: SubcategoryItem[];
};

function buildSubcategorySlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, " ve ")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "-");
}

function createSubcategory(label: string, imageSrc: string): SubcategoryItem {
  return {
    label,
    imageSrc,
    slug: buildSubcategorySlug(label),
  };
}

export const heroCategoryNav: HeroCategoryNavItem[] = [
  {
    labelLines: ["Moda"],
    to: "/moda",
    imageSrc: "/categories/moda.png",
    children: [
      createSubcategory("Ayakkabi & Canta", "/categories/alt/ayakkabi_canta.png"),
      createSubcategory("Kadin Giyim & Aksesuar", "/categories/alt/kadingiyim_aksesuar.png"),
      createSubcategory("Erkek Giyim & Aksesuar", "/categories/alt/erkekgiyim_aksesuar.png"),
      createSubcategory("Cocuk Giyim & Aksesuar", "/categories/alt/cocukgiyim_aksesuar.png"),
    ],
  },
  {
    labelLines: ["Elektronik"],
    to: "/elektronik",
    imageSrc: "/categories/elektronik.png",
    children: [
      createSubcategory("Telefon & Aksesuarlari", "/categories/alt/telefon_aksesuarlari.png"),
      createSubcategory("Bilgisayar", "/categories/alt/bilgisayar.png"),
      createSubcategory("Televizyon & Ses Sistemleri", "/categories/alt/televizyon_sessistemleri.png"),
      createSubcategory("Elektrikli Ev Aletleri", "/categories/alt/elektriklievaletleri.png"),
      createSubcategory("Beyaz Esya", "/categories/alt/beyazesya.png"),
      createSubcategory("Fotograf & Kamera", "/categories/alt/fotograf_kamera.png"),
      createSubcategory("Video Oyun & Konsol", "/categories/alt/videooyun_konsol.png"),
    ],
  },
  {
    labelLines: ["Ev & Yasam"],
    to: "/ev-yasam",
    imageSrc: "/categories/ev_yasam.png",
    children: [
      createSubcategory("Mobilya", "/categories/alt/mobilya.png"),
      createSubcategory("Ev Tekstili", "/categories/alt/evtekstili.png"),
      createSubcategory("Dekorasyon & Aydinlatma", "/categories/alt/dekorasyon_aydinlatma.png"),
      createSubcategory("Mutfak Gerecleri", "/categories/alt/mutfakgerecleri.png"),
      createSubcategory("Banyo & Ev Gerecleri", "/categories/alt/banyo_evgerecleri.png"),
      createSubcategory("Yapi Market & Bahce", "/categories/alt/yapimarket_bahce.png"),
      createSubcategory("Evcil Hayvan Urunleri", "/categories/alt/evcilhayvanurunleri.png"),
      createSubcategory("Kirtasiye & Ofis", "/categories/alt/kirtasiye_ofis.png"),
      createSubcategory("Supermarket", "/categories/alt/supermarket.png"),
    ],
  },
  {
    labelLines: ["Anne & Bebek"],
    to: "/anne-bebek",
    imageSrc: "/categories/anne_bebek.png",
    children: [
      createSubcategory("Bebek Bezi & Islak Mendil", "/categories/alt/bebekbezi_islakmendil.png"),
      createSubcategory("Bebek Giyim", "/categories/alt/bebekgiyim.png"),
      createSubcategory("Hamile Giyim", "/categories/alt/hamilegiyim.png"),
      createSubcategory("Bebek Arabalari", "/categories/alt/bebekarabalari.png"),
      createSubcategory("Oto Koltugu & Ana Kucagi", "/categories/alt/otokoltugu_anakucagi.png"),
      createSubcategory("Beslenme & Mama Sandalyesi", "/categories/alt/beslenme_mamasandalyesi.png"),
      createSubcategory("Biberon ve Aksesuarlari", "/categories/alt/biberonveaksesuarlari.png"),
      createSubcategory("Emzirme Urunleri", "/categories/alt/emzirmeurunleri.png"),
      createSubcategory("Yurutec & Yurume Yardimcilari", "/categories/alt/yurutec_yurumeyardimcilari.png"),
      createSubcategory("Bebek Odasi & Park Yatak", "/categories/alt/bebekodasi_parkyatak.png"),
      createSubcategory("Bebek Bakim & Saglik", "/categories/alt/bebekbakim_saglik.png"),
      createSubcategory("Bebek Guvenlik", "/categories/alt/bebekguvenlik.png"),
      createSubcategory("Bebek Oyuncaklari", "/categories/alt/bebekoyuncaklari.png"),
      createSubcategory("Banyo & Tuvalet", "/categories/alt/banyo_tuvalet.png"),
    ],
  },
  {
    labelLines: ["Kozmetik &", "Kisisel Bakim"],
    to: "/kozmetik",
    imageSrc: "/categories/kozmetik_kisiselbakim.png",
    children: [
      createSubcategory("Parfum & Deodorant", "/categories/alt/parfum_deodorant.png"),
      createSubcategory("Sac Bakim & Sekillendirme", "/categories/alt/sacbakim_sekillendirme.png"),
      createSubcategory("Cilt Bakimi", "/categories/alt/ciltbakim.png"),
      createSubcategory("Makyaj", "/categories/alt/makyaj.png"),
      createSubcategory("Saglik & Medikal Urunler", "/categories/alt/saglik_medikalurunler.png"),
      createSubcategory("Kadin Bakim Urunleri", "/categories/alt/kadinbakimurunleri.png"),
      createSubcategory("Erkek Bakim Urunleri", "/categories/alt/erkekbakimurunleri.png"),
      createSubcategory("Guzellik Salonu & Kuafor Urunleri", "/categories/alt/guzelliksalonu_kuaforurunleri.png"),
      createSubcategory("Agiz & Dis Bakimi", "/categories/alt/agiz_disbakimi.png"),
      createSubcategory("Cinsel Urunler", "/categories/alt/cinselurunler.png"),
    ],
  },
  {
    labelLines: ["Mucevher & Saat"],
    to: "/mucevher-saat",
    imageSrc: "/categories/mucevher_saat.png",
    children: [
      createSubcategory("Yatirimlik Altin & Gumus", "/categories/alt/yatirimlikaltin_gumus.png"),
      createSubcategory("Saat", "/categories/alt/saat.png"),
      createSubcategory("Gunes Gozlugu", "/categories/alt/gunesgozlugu.png"),
      createSubcategory("Altin Takilar", "/categories/alt/altintakilar.png"),
      createSubcategory("Pirlanta Takilar", "/categories/alt/pirlantatakilar.png"),
      createSubcategory("Gumus Takilar", "/categories/alt/gumustakilar.png"),
      createSubcategory("Celik Takilar", "/categories/alt/celiktakilar.png"),
      createSubcategory("Bijuteri Takilar", "/categories/alt/bijuteritakilar.png"),
      createSubcategory("Aksesuar", "/categories/alt/aksesuar.png"),
      createSubcategory("Taki Aksesuarlari", "/categories/alt/takiaksesuarlari.png"),
      createSubcategory("2.El Antika & Koleksiyon", "/categories/alt/2elantika_koleksiyon.png"),
    ],
  },
  {
    labelLines: ["Spor & Outdoor"],
    to: "/spor-outdoor",
    imageSrc: "/categories/spor_outdoor.png",
    children: [
      createSubcategory("Fitness & Kondisyon", "/categories/alt/fitness_kondisyon.png"),
      createSubcategory("Spor Giyim & Ayakkabi", "/categories/alt/sporgiyim_ayakkabi.png"),
      createSubcategory("Outdoor & Kamp", "/categories/alt/outdoor_kamp.png"),
      createSubcategory("Bireysel & Takim Sporlari", "/categories/alt/bireysel_takimsporlari.png"),
      createSubcategory("Avcilik & Balikcilik", "/categories/alt/avcilik_balikcilik.png"),
      createSubcategory("Kis Sporlari", "/categories/alt/kissporlari.png"),
      createSubcategory("Bisiklet & Scooter", "/categories/alt/bisiklet_scooter.png"),
      createSubcategory("Tekne & Yat Malzemeleri", "/categories/alt/tekne_yatmalzemeleri.png"),
      createSubcategory("Su Sporlari", "/categories/alt/susporlari.png"),
    ],
  },
  {
    labelLines: ["Kitap, Muzik,", "Film, Oyun"],
    to: "/kitap",
    imageSrc: "/categories/kitap_muzik_film_oyun.png",
    children: [
      createSubcategory("Kitap", "/categories/alt/kitap.png"),
      createSubcategory("Film", "/categories/alt/film.png"),
      createSubcategory("Muzik", "/categories/alt/muzik.png"),
      createSubcategory("Cocuk Oyuncaklari & Parti", "/categories/alt/cocukoyuncaklari_parti.png"),
      createSubcategory("Yetiskin Hobi & Oyun", "/categories/alt/yetiskinhobi_oyun.png"),
      createSubcategory("Dijital Kodlar & Urunler", "/categories/alt/dijitalkodlar_urunler.png"),
      createSubcategory("Dugun, Davet, Organizasyon", "/categories/alt/dugudavetorganizasyon.png"),
      createSubcategory("El Isi Urunleri", "/categories/alt/elisiurunleri.png"),
      createSubcategory("Yasam ve Etkinlik", "/categories/alt/yasam_etkinlik.png"),
    ],
  },
  {
    labelLines: ["Otomotiv &", "Motosiklet"],
    to: "/otomotiv-motosiklet",
    imageSrc: "/categories/otomotiv_motosiklet.png",
    children: [
      createSubcategory("Aksesuar & Tuning", "/categories/alt/aksesuar_tuning.png"),
      createSubcategory("Yedek Parca", "/categories/alt/yedekparca.png"),
      createSubcategory("Ses Sistemleri & Navigasyon", "/categories/alt/sessistemleri_navigasyon.png"),
      createSubcategory("Lastik & Jant", "/categories/alt/lastik_jant.png"),
      createSubcategory("Motosiklet", "/categories/alt/motosiklet.png"),
      createSubcategory("Traktor", "/categories/alt/traktor.png"),
    ],
  },
];

export function findSubcategoryBySlug(slug: string) {
  for (const category of heroCategoryNav) {
    const child = category.children.find((item) => item.slug === slug);

    if (child) {
      return {
        category,
        child,
      };
    }
  }

  return null;
}
