import { FastifyInstance } from 'fastify';
import { wxlogin } from '@/service/auth/login';

const AuthApiRoutes = async (fastify: FastifyInstance) => {
  // 登录接口 - 仅保留路由框架
  fastify.post('/wxlogin', wxlogin);
  // 注册接口 - 仅保留路由框架
};

export default AuthApiRoutes;