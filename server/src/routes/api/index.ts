import { FastifyInstance } from 'fastify'
import sponsorRoutes from './sponsor'

const ApiRoutes = async (fastify: FastifyInstance) => {
  // 注册赞助路由组，添加/sponsor前缀
  await fastify.register(sponsorRoutes, { prefix: '/sponsor' })
  // // 注册API路由组，添加/api前缀
  // await fastify.register(import('./protected'), { prefix: '/protected' });
  // // 注册用户路由组，添加/user前缀
  // await fastify.register(import('./user'), { prefix: '/user' });
  // // 注册文件路由组，添加/file前缀
  // await fastify.register(import('./file'), { prefix: '/file' });
}

export default ApiRoutes
