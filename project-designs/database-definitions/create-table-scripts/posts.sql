CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_user_id ON posts (user_id);