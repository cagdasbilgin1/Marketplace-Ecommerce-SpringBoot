# Architecture

Bu yapı `RULES.md` içindeki MVP hedeflerine göre kuruldu.

## Backend

- Java 21 hedeflenir; root Maven parent `java.version` değerini `21` olarak sabitler.
- Spring Boot `4.0.6` ve Spring Cloud `2025.1.1` kullanılır.
- Her servis kendi `pom.xml` dosyasına, uygulama sınıfına, `application.yml` dosyasına ve Flyway migration klasörüne sahiptir.
- Servisler arası ortak domain library eklenmedi. İlk aşamada sınırları net tutmak, yanlış bağımlılıkları erken önler.

## Security

- Keycloak `marketplace` realm ile auth merkezi olarak konumlandırıldı.
- Backend servisler `spring-boot-starter-security-oauth2-resource-server` ile JWT doğrular.
- JWT üretimi, refresh token, user registration ve rol yönetimi servislerin içinde yapılmaz.
- Public bırakılan endpointler sadece health/info endpointleridir.

## Data Ownership

Her mikroservis ayrı veritabanı kullanır:

```txt
keycloak_db
user_profile_db
catalog_db
inventory_db
cart_db
order_db
payment_db
notification_db
```

Yerel geliştirmede bu veritabanları tek PostgreSQL container içinde oluşturulur, fakat her birine ayrı kullanıcı atanır. Böylece servislerin başka bir servisin verisine yanlışlıkla erişmesi zorlaşır.

## Gateway

API Gateway `spring-cloud-starter-gateway-server-webflux` ile hazırlanmıştır. Gateway sadece route ve temel auth kontrolü yapar; business logic veya database erişimi içermez.

## Saga Direction

Order Service Saga akışını başlatacak servistir. Inventory, Payment ve Notification servisleri RabbitMQ eventlerini dinleyecek şekilde hazırlanmıştır. İlk event isimleri `docs/event-contracts.md` içinde tanımlıdır.

## Frontend

Frontend bu turda oluşturulmadı. `RULES.md` uyarınca sonraki aşamada React + TypeScript + Vite + React Router + merkezi API client + TanStack Query ile ayrı bir uygulama eklenmeli.
