// Require the framework and instantiate it

// ESM
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import prisma from './prisma';
import AccessToken from "./utils/acess_token"
import ApiRoutes from './routes';

require('dotenv').config();

const fastify = Fastify({
  logger: true,
});

// 注册CORS插件
fastify.register(fastifyCors, {
  origin: true,
});

fastify.decorate('prisma', prisma);
fastify.decorate('token', AccessToken);

fastify.register(ApiRoutes, { prefix: '/api' });

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
