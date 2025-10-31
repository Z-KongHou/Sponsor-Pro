// Require the framework and instantiate it
// ESM
import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyWebSocket from '@fastify/websocket'
import prisma from './prisma'
import AccessToken from './utils/acess_token'
import ApiRoutes from './routes/index'
import wsRoutes from "./routes/ws"
import websocket from '@fastify/websocket';

const PORT = parseInt(process.env.PORT || '3000', 10)

require('dotenv').config()

const fastify = Fastify({
  logger: true
})

// 注册WebSocket插件
fastify.register(fastifyWebSocket)

// 注册CORS插件
fastify.register(fastifyCors, {
  origin: true
})

fastify.register(websocket)

// Run the server!
fastify.decorate('prisma', prisma)
fastify.decorate('token', AccessToken)

// Declare a route

fastify.register(ApiRoutes, { prefix: '/api' })
fastify.register(wsRoutes, { prefix: '/chat' })

fastify.listen({ port: PORT, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
