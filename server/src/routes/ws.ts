import { FastifyInstance } from 'fastify';
import { verify } from '@/service/auth/login';
import { chatWithWs } from '@/service/chat/chat';
const wsRoutes = async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', verify);
    fastify.get('/', { websocket: true }, chatWithWs)
}

export default wsRoutes
