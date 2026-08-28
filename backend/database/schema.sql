CREATE TABLE games (
    id SERIAL PRIMARY KEY,

    -- Game API information
    api_id INTEGER UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    cover_url TEXT,

    -- Personal tracking
    status VARCHAR(20) NOT NULL DEFAULT 'bucket_list',
    rating DECIMAL(3,1),
    progress INTEGER NOT NULL DEFAULT 0,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Validation
    CHECK (status IN ('bucket_list', 'playing', 'completed', 'dropped')),
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 10)),
    CHECK (progress >= 0 AND progress <= 100)
);