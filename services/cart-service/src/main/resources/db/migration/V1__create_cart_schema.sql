CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (keycloak_user_id, product_id)
);

CREATE TABLE cart_checkout_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_user_id UUID NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cart_items_user_id ON cart_items (keycloak_user_id);
CREATE INDEX idx_cart_checkout_snapshots_user_id ON cart_checkout_snapshots (keycloak_user_id);
