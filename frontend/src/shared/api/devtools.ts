export type ServiceCheck = {
  name: string;
  kind: "spring" | "keycloak";
  url: string;
};

export type ServiceStatus = {
  name: string;
  ok: boolean;
  summary: string;
  responseTimeMs: number;
  details: Record<string, unknown> | null;
};

export const serviceChecks: ServiceCheck[] = [
  { name: "API Gateway", kind: "spring", url: "/_dev/gateway/actuator/health" },
  { name: "User Profile Service", kind: "spring", url: "/_dev/user-profile/actuator/health" },
  { name: "Catalog Service", kind: "spring", url: "/_dev/catalog/actuator/health" },
  { name: "Inventory Service", kind: "spring", url: "/_dev/inventory/actuator/health" },
  { name: "Cart Service", kind: "spring", url: "/_dev/cart/actuator/health" },
  { name: "Order Service", kind: "spring", url: "/_dev/order/actuator/health" },
  { name: "Payment Service", kind: "spring", url: "/_dev/payment/actuator/health" },
  { name: "Notification Service", kind: "spring", url: "/_dev/notification/actuator/health" },
  {
    name: "Keycloak",
    kind: "keycloak",
    url: "/_dev/keycloak/realms/marketplace/.well-known/openid-configuration",
  },
];

export async function getServiceStatus(check: ServiceCheck): Promise<ServiceStatus> {
  const startedAt = performance.now();

  try {
    const response = await fetch(check.url, {
      headers: {
        Accept: "application/json",
      },
    });
    const responseTimeMs = Math.round(performance.now() - startedAt);
    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      return {
        name: check.name,
        ok: false,
        summary: `HTTP ${response.status}`,
        responseTimeMs,
        details: data,
      };
    }

    if (check.kind === "spring") {
      const summary = typeof data.status === "string" ? data.status : "UNKNOWN";
      return {
        name: check.name,
        ok: summary === "UP",
        summary,
        responseTimeMs,
        details: data,
      };
    }

    const summary = typeof data.issuer === "string" ? "OIDC READY" : "UNKNOWN";
    return {
      name: check.name,
      ok: summary === "OIDC READY",
      summary,
      responseTimeMs,
      details: data,
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startedAt);
    const message =
      error instanceof Error ? error.message : "Service endpoint could not be reached.";

    return {
      name: check.name,
      ok: false,
      summary: message,
      responseTimeMs,
      details: null,
    };
  }
}
