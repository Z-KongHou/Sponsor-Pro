import { FastifyInstance } from 'fastify';

const ApiRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(import('./api/auth'), { prefix: '/auth' });
  await fastify.register(import('./api/protect'), { prefix: '/protect' });
  await fastify.register(import('./api/offline'), { prefix: '/offline' });
};

export default ApiRoutes;
