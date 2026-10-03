-- ============================================================================
-- RAKSHAK CORE - SQL AUDIT & DATABASE HONEYPOT CANARY SCHEMA
-- Dialect: ANSI SQL / PostgreSQL / MySQL Compatible
-- ============================================================================

-- 1. Threat Audit Telemetry Table
CREATE TABLE IF NOT EXISTS rakshak_threat_audit_log (
    event_id VARCHAR(64) PRIMARY KEY,
    client_ip VARCHAR(45) NOT NULL,
    asn_number VARCHAR(16),
    user_agent TEXT,
    threat_type VARCHAR(64) NOT NULL,
    confidence_score INT NOT NULL,
    action_taken VARCHAR(32) NOT NULL,
    shannon_entropy NUMERIC(6, 4),
    target_endpoint VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rakshak_audit_ip ON rakshak_threat_audit_log(client_ip);
CREATE INDEX IF NOT EXISTS idx_rakshak_threat_type ON rakshak_threat_audit_log(threat_type);

-- 2. Database Honeypot Canary Table
-- If any query, ORM dump, or automated SQL injection tool queries this table,
-- an intrusion alert is immediately fired.
CREATE TABLE IF NOT EXISTS rakshak_canary_credentials (
    id SERIAL PRIMARY KEY,
    decoy_username VARCHAR(100) NOT NULL UNIQUE,
    decoy_password_hash VARCHAR(255) NOT NULL,
    decoy_api_key VARCHAR(128) NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE
);

INSERT INTO rakshak_canary_credentials (decoy_username, decoy_password_hash, decoy_api_key)
VALUES ('admin_backup_root', '$2a$12$e8Fj7u1gH...decoy_hash_vector', 'rk_live_canary_9921_decoy_token')
ON CONFLICT DO NOTHING;

-- 3. Trigger Alert Function (PostgreSQL Example)
-- Fires alert record into audit table whenever honeypot table is touched
CREATE OR REPLACE FUNCTION fn_rakshak_alert_canary_breach()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO rakshak_threat_audit_log (
        event_id, client_ip, threat_type, confidence_score, action_taken, target_endpoint
    ) VALUES (
        md5(random()::text || clock_timestamp()::text),
        'DATABASE_INTERNAL',
        'HONEYPOT_CREDENTIAL_TABLE_BREACH',
        100,
        'ALERT_TRIGGERED',
        'table:rakshak_canary_credentials'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rakshak_canary_breach ON rakshak_canary_credentials;
CREATE TRIGGER trg_rakshak_canary_breach
AFTER SELECT OR UPDATE OR DELETE ON rakshak_canary_credentials
FOR EACH STATEMENT EXECUTE FUNCTION fn_rakshak_alert_canary_breach();
