CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'region_manager', 'subscriber', 'meter')),
  region_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  manager_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('electricity', 'water', 'gas')),
  location VARCHAR(200),
  subscriber_id INTEGER REFERENCES users(id),
  region_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE readings (
  id SERIAL PRIMARY KEY,
  meter_id INTEGER REFERENCES meters(id),
  value NUMERIC(10,2) NOT NULL,
  unit VARCHAR(20),
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alarms (
  id SERIAL PRIMARY KEY,
  meter_id INTEGER REFERENCES meters(id),
  message VARCHAR(255),
  type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);