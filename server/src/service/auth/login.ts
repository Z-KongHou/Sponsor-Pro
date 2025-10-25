import axios from 'axios';
import { generateToken, verifyToken } from '@/utils/jwt';
import { FastifyRequest, FastifyReply } from 'fastify'

export const wxlogin = async (request, reply) => {
    const { code } = request.body as { code: string };
    try {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.APPID}&secret=${process.env.APPSECRET}&js_code=${code}&grant_type=authorization_code`;
        const res = await axios.get(url);
        const { openid } = res.data;
        const { prisma } = request.server;
        const user = await prisma.user.findUnique({
            where: { open_id: openid }
        })

        const token = generateToken(openid);

        const role = user ? user.role : "无"
        
        return reply.send({ token,role });
    } catch (error) {
        console.error('Login error:', error);
        return reply.status(401).send({
            code: 401,
            message: error instanceof Error ? error.message : 'Authentication failed',
            data: null
        });
    }
  }

export const verify = async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        reply.code(401);
        throw new Error('Authorization header is required');
      }
      const [bearer, token] = authHeader.split(' ');
      
      if (bearer !== 'Bearer' || !token) {
        reply.code(401);
        throw new Error('Invalid authorization format');
      }
      const openId = verifyToken(token);
      if (!openId) {
        reply.code(401);
        throw new Error('Invalid or expired token');
      }
      request.openId = openId.openId;
    } catch (error) {
      return reply.status(401).send({
        code: 401,
        message: error instanceof Error ? error.message : 'Authentication failed',
        data: null
      });
    }
  }