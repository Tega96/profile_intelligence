-- Create UUID extention if not exists
CREATE EXTENTION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    gender VARCHAR(10),
    gender_probability DECIMAL(5, 4),
    sample_size INTEGER,
    age INTEGER,
    age_group VARCHAR(20),
    country_id VARCHAR(3),
    country_probability DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_country_id ON profiles(country_id);
CREATE INDEX IF NOT EXISTS idx_profiles_age_group ON profiles(age_group);

