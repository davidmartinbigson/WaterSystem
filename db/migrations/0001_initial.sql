CREATE TABLE IF NOT EXISTS license_keys (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  code_hint TEXT NOT NULL,
  plan TEXT NOT NULL,
  days INTEGER NOT NULL CHECK (days BETWEEN 1 AND 3650),
  status TEXT NOT NULL CHECK (status IN ('Available', 'Active', 'Expired', 'Revoked')) DEFAULT 'Available',
  business TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  issued_by_user_id TEXT,
  used_by_user_id TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS license_keys_status_created_idx ON license_keys (status, created_at DESC);
CREATE INDEX IF NOT EXISTS license_keys_email_idx ON license_keys (email);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('MASTER', 'OWNER')) DEFAULT 'OWNER',
  license_id TEXT UNIQUE REFERENCES license_keys(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

CREATE TABLE IF NOT EXISTS workspace_data (
  owner_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
