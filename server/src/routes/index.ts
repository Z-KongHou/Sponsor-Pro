import { FastifyInstance } from 'fastify';

// 定义主路由函数，接收fastify实例
const Routes = async (fastify: FastifyInstance) => {
  // 注册API路由组，添加/api前缀
  await fastify.register(import('./api'), { prefix: '/api' });

  // 注册认证路由组，添加/auth前缀
  // await fastify.register(import('./auth'));
};

export default Routes;
