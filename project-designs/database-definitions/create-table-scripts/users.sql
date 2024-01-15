CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL UNIQUE,
    auth_provider_id VARCHAR(255) NOT NULL UNIQUE,
    user_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ON users (profile_id);
CREATE INDEX ON users (auth_provider_id);