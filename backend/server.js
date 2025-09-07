// backend/server.js (ESM)
import Fastify from 'fastify';
import pkg from 'pg';
const { Pool } = pkg;

const fastify = Fastify({ logger: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

fastify.get('/health', async () => ({ status: 'ok' }));

fastify.get('/dbcheck', async () => {
  const { rows } = await pool.query('SELECT 1 as ok');
  return { db: rows[0].ok === 1 ? 'ok' : 'fail' };
});

fastify.addHook('onClose', async () => {
  await pool.end();
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Server running on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
