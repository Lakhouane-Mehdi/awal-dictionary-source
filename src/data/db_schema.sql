-- Database Schema for Tamazight App
-- Use this schema when migrating to a PostgreSQL or SQLite backend.

-- 1. Consent Tracking (GDPR Compliance Audit Log)
CREATE TABLE IF NOT EXISTS user_consent (
    id SERIAL PRIMARY KEY,
    user_id UUID DEFAULT gen_random_uuid(), -- Anonymous user ID
    ip_hash VARCHAR(64), -- Anonymized IP (hashed)
    consent_preferences JSONB NOT NULL, -- e.g. {"essential": true, "analytics": false}
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT
);

-- 2. Dictionary Entries (Structured Data)
CREATE TABLE IF NOT EXISTS dictionary_entries (
    id SERIAL PRIMARY KEY,
    word_tamazight VARCHAR(255) NOT NULL,
    word_latin VARCHAR(255),
    word_english VARCHAR(255),
    definition TEXT,
    examples JSONB, -- Array of example sentences
    tags TEXT[], -- ["noun", "verb", "common"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Analytics Events (Optional)
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
