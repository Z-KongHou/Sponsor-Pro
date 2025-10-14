import { FastifyInstance } from 'fastify';

const ApiRoutes = async (fastify: FastifyInstance) => {
  // // 注册API路由组，添加/api前缀
  // await fastify.register(import('./protected'), { prefix: '/protected' });
  // // 注册用户路由组，添加/user前缀
  // await fastify.register(import('./user'), { prefix: '/user' });
  // // 注册文件路由组，添加/file前缀
  // await fastify.register(import('./file'), { prefix: '/file' });
};

export default ApiRoutes;
