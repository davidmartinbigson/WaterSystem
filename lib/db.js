import pg from 'pg';

const { Pool } = pg;
const globalForPg = globalThis;

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured. Add a PostgreSQL connection string in your environment.');
  if (!globalForPg.aquaFlowPgPool) {
    globalForPg.aquaFlowPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PG_POOL_MAX || 2),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      application_name: 'aquaflow-next',
    });
  }
  return globalForPg.aquaFlowPgPool;
}

export async function query(text, values = []) {
  return getPool().query(text, values);
}

export async function withTransaction(callback) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const value = await callback(client);
    await client.query('COMMIT');
    return value;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
