# Marketplace E-Commerce

Java 21, Spring Boot, Maven, RabbitMQ, Keycloak, PostgreSQL ve Redis tabanlı n11 benzeri marketplace mikroservis temeli.

## Kararlar

- Her MVP servisi `services/*` altında ayrı Spring Boot uygulamasıdır.
- Root `pom.xml` sadece Maven aggregator ve ortak dependency yönetimi içindir.
- API Gateway frontend istekleri için tek giriş noktasıdır ve veritabanına bağlanmaz.
- Keycloak login/register/token/role yönetir; servisler sadece OAuth2 resource server olarak token doğrular.
- Her servis kendi PostgreSQL veritabanına ve kullanıcı hesabına sahiptir.
- RabbitMQ iş akışları için ana iletişim kanalıdır; Order Service Saga akışının başlangıç noktasıdır.
- Catalog Service stok tutmaz; stok ve rezervasyon Inventory Service sınırında kalır.

## Servisler

| Servis | Port | Sorumluluk |
| --- | ---: | --- |
| api-gateway | 8080 | Frontend tek giriş noktası, routing, token doğrulama |
| user-profile-service | 8081 | Profil, adres, telefon, Keycloak user id bağlantısı |
| catalog-service | 8082 | Ürün, kategori, görsel, açıklama, metadata |
| inventory-service | 8083 | Stok, rezervasyon, release, ödeme sonrası düşüm |
| cart-service | 8084 | Sepet işlemleri, hızlı sepet için Redis hazırlığı |
| order-service | 8085 | Sipariş, durum, Saga orkestrasyonu |
| payment-service | 8086 | MVP mock ödeme ve ileride refund compensation |
| notification-service | 8087 | Asenkron email/SMS/in-app bildirimleri |

## Yerel Altyapı

```bash
docker compose up -d postgres rabbitmq redis keycloak
```

- Keycloak: http://localhost:9090 (`admin` / `admin`)
- Keycloak realm: `marketplace`
- RabbitMQ Management: http://localhost:15672 (`marketplace` / `marketplace`)
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Maven

Maven Wrapper eklendi. Tüm modülleri derlemek ve doğrulamak için:

```bash
./mvnw clean verify
```

Tek servis çalıştırma örneği:

```bash
./mvnw -pl services/catalog-service spring-boot:run
```

Önce altyapıyı kaldır, sonra servisleri ayrı terminallerde çalıştır. Gateway üzerinden örnek route:

```txt
http://localhost:8080/api/catalog/internal/service-info
```

Bu endpoint token ister; sadece `/actuator/health` ve `/actuator/info` public bırakıldı.

## Frontend

Frontend `frontend/` altında React + TypeScript + Vite ile başlatıldı. Routing için React Router, HTTP için merkezi Axios client ve server state için TanStack Query kullanılır.

Örnek kurulum:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Vite dev server: http://localhost:5173
- API base URL varsayılan olarak `/api` ve Vite proxy ile `http://localhost:8080` gateway'ine yönlenir.
- Tema ana rengi: `rgb(255, 68, 239)`

### Authentication

- Keycloak realm: `marketplace`
- Frontend login/signup akisi uygulama icindeki ozel auth arayuzu ile calisir.
- Gateway altinda `/api/auth/*` endpointleri Keycloak token ve kullanici olusturma islerini arka planda yonetir.
- Access token isteklerde `Authorization: Bearer` olarak gonderilir.
- Refresh token frontend tarafinda otomatik yenilenir.

Ornek local hesaplar:

- `seller` / `seller`
- `customer` / `customer`

## Dokümanlar

- [Architecture](docs/architecture.md)
- [Event Contracts](docs/event-contracts.md)

## Catalog API Hızlı Test

Okuma endpointleri public:

```bash
curl http://localhost:8080/api/catalog/categories
curl http://localhost:8080/api/catalog/products
```

Kategori/ürün yazma işlemleri Keycloak token ister. Realm yeni import edildiyse örnek seller token:

```bash
TOKEN=$(curl -s -X POST http://localhost:9090/realms/marketplace/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=marketplace-cli' \
  -d 'grant_type=password' \
  -d 'username=seller' \
  -d 'password=seller' | jq -r '.access_token')
```

Kategori oluştur:

```bash
curl -X POST http://localhost:8080/api/catalog/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Elektronik"}'
```

Ürün oluştururken `categoryId` değerini kategori cevabından al:

```bash
curl -X POST http://localhost:8080/api/catalog/products \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "sellerId":"11111111-1111-1111-1111-111111111111",
    "categoryId":"CATEGORY_ID",
    "name":"Kablosuz Sarj Cihazi",
    "description":"Hizli sarj destekli demo urun.",
    "price":499.90,
    "currency":"TRY",
    "status":"ACTIVE",
    "metadata":{"brand":"Demo"},
    "images":[{"url":"https://cdn.example.com/product.jpg","altText":"Urun gorseli","sortOrder":0}]
  }'
```

## Hazir Seed Import

Farkli kategorilerden ornek urunleri tek komutla eklemek icin:

```bash
AUTH_USERNAME=seller AUTH_PASSWORD=seller bash scripts/import-catalog-seed.sh
```

Alternatif olarak elinde yetkili token varsa:

```bash
AUTH_TOKEN=... bash scripts/import-catalog-seed.sh
```

Hazir dataset dosyasi:

- [`seed/catalog-seed.json`](/Users/cagdasbilgin/Projects/marketplace-ecommerce/seed/catalog-seed.json)

Import scripti:

- [`scripts/import-catalog-seed.sh`](/Users/cagdasbilgin/Projects/marketplace-ecommerce/scripts/import-catalog-seed.sh)
