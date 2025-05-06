-- SQL for initial database setup
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT DEFAULT 'analyst'
);

CREATE TABLE IF NOT EXISTS datasets (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name TEXT,
    content TEXT
);

CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);