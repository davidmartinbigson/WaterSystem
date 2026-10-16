import { loadEnvConfig } from '@next/env';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

loadEnvConfig(process.cwd());
const email = String(process.env.MASTER_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.MASTER_ADMIN_PASSWORD || '';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Set a valid MASTER_ADMIN_EMAIL.');
if (password.length < 12) throw new Error('Set a MASTER_ADMIN_PASSWORD with at least 12 characters.');

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10_000 });
try {
  const passwordHash = await bcrypt.hash(password, 12);
  const name = process.env.MASTER_ADMIN_NAME || 'AquaFlow Platform';
  const existing = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
  if (existing.rowCount && existing.rows[0].role !== 'MASTER') throw new Error('That email is already used by a supplier account. Choose another master email.');
  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, business_name, role)
     VALUES ($1, $2, $3, $4, 'AquaFlow Platform', 'MASTER')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, updated_at = NOW()`,
    [randomUUID(), email, passwordHash, name],
  );
  console.log(`Master administrator provisioned for ${email}.`);
} finally {
  await pool.end();
}
