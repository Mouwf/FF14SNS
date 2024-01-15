CREATE TABLE post_release_information_association (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    release_information_id INTEGER NOT NULL REFERENCES release_information(id)
);