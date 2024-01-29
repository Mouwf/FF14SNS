CREATE TABLE release_version_filter_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    release_information_id INTEGER NOT NULL REFERENCES release_information(id)
);