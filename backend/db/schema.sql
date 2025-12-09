CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(120) NOT NULL,
    brand VARCHAR(120) NOT NULL,
    tank_capacity NUMERIC(10,2) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    document_id VARCHAR(80) UNIQUE NOT NULL,
    phone VARCHAR(50),
    assigned_vehicle_id UUID REFERENCES vehicles(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fuel_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200),
    code VARCHAR(50) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fuel_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
    station_id UUID REFERENCES fuel_stations(id) NOT NULL,
    driver_id UUID REFERENCES drivers(id) NOT NULL,
    datetime TIMESTAMPTZ NOT NULL,
    liters NUMERIC(10,2) NOT NULL,
    price_per_liter NUMERIC(10,2) NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    subsidized BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name) VALUES ('ADMIN'), ('FLEET_MANAGER'), ('STATION_OPERATOR'), ('DRIVER') ON CONFLICT DO NOTHING;
