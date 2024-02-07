CREATE TABLE release_information (
    id SERIAL PRIMARY KEY,
    release_version VARCHAR(50) NOT NULL,
    release_name VARCHAR(255) NOT NULL
);