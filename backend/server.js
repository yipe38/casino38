import Fastify from 'fastify';

const PORT = process.env.PORT || 3000;
const fastify = Fastify({ logger: true });

// Healthcheck
fastify.get('/health', async () => ({ status: 'ok' }));

// Optional: Root
fastify.get('/', async () => ({ app: 'casino38-backend', version: '0.1.0' }));

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
