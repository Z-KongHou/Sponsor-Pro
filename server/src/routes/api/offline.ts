import { FastifyInstance } from 'fastify';
import { sponsorRoutes } from "./sponsor"

const OfflineApiRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(sponsorRoutes, { prefix: '/sponsor' })
};

export default OfflineApiRoutes;