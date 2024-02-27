CREATE TABLE replies (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    original_post_id BIGINT NOT NULL REFERENCES posts(id),
    original_reply_id BIGINT NULL REFERENCES replies(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_id_on_replies ON replies (user_id);
CREATE INDEX idx_original_post_id ON replies (original_post_id);
CREATE INDEX idx_original_reply_id ON replies (original_reply_id);