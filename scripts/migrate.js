import { loadEnvConfig } from '@next/env';
import pg from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL first.');
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10_000 });
const root = path.dirname(fileURLToPath(import.meta.url));
const migrationDirectory = path.join(root, '..', 'db', 'migrations');
const client = await pool.connect();

try {
  await client.query('SELECT pg_advisory_lock($1)', [775301]);
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  const migrations = (await readdir(migrationDirectory)).filter((name) => name.endsWith('.sql')).sort();
  for (const name of migrations) {
    const applied = await client.query('SELECT name FROM schema_migrations WHERE name = $1', [name]);
    if (applied.rowCount) continue;
    const sql = await readFile(path.join(migrationDirectory, name), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      await client.query('COMMIT');
      console.log(`Applied database migration: ${name}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
  console.log('Database schema is up to date.');
} finally {
  await client.query('SELECT pg_advisory_unlock($1)', [775301]).catch(() => {});
  client.release();
  await pool.end();
}
