CREATE TABLE post_release_information_association (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    release_information_id INTEGER NOT NULL REFERENCES release_information(id),
    UNIQUE (post_id, release_information_id)
);
CREATE INDEX idx_post_id ON post_release_information_association (post_id);
CREATE INDEX idx_release_information_id ON post_release_information_association (release_information_id);