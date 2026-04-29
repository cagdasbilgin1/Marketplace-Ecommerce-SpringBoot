# Event Contracts

Ana exchange:

```txt
marketplace.events
```

İlk routing key seti:

| Routing key | Producer | Consumer |
| --- | --- | --- |
| `order.created` | order-service | inventory-service |
| `order.cancelled` | order-service | inventory-service, notification-service |
| `order.payment.requested` | order-service | payment-service |
| `inventory.reserved` | inventory-service | order-service |
| `inventory.reservation.failed` | inventory-service | order-service |
| `inventory.released` | inventory-service | order-service |
| `payment.completed` | payment-service | order-service, notification-service |
| `payment.failed` | payment-service | order-service |
| `order.confirmed` | order-service | notification-service |

Önerilen event envelope:

```json
{
  "eventId": "uuid",
  "eventType": "order.created",
  "occurredAt": "2026-04-29T12:00:00Z",
  "correlationId": "uuid",
  "producer": "order-service",
  "payload": {}
}
```

Kurallar:

- Event payload başka servisin internal entity modelini taşımamalı.
- Tüm eventlerde `eventId`, `eventType`, `occurredAt`, `correlationId`, `producer` alanları bulunmalı.
- Order Saga eventlerinde `correlationId` olarak order id kullanılmalı.
- Compensation eventleri ayrı routing key ile açıkça adlandırılmalı.
