CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_keycloak_user_id UUID,
    channel VARCHAR(32) NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    subject VARCHAR(200),
    body TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient_keycloak_user_id ON notifications (recipient_keycloak_user_id);
CREATE INDEX idx_notifications_status ON notifications (status);
