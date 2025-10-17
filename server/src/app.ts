// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import prisma from './prisma'
import AccessToken from './utils/acess_token'
import ApiRoutes from './routes'

const PORT = parseInt(process.env.PORT || '3000', 10)

require('dotenv').config()

const fastify = Fastify({
  logger: true
})

// 注册CORS插件
fastify.register(fastifyCors, {
  origin: true
})

fastify.decorate('prisma', prisma)

// Declare a route

// Run the server!
fastify.decorate('prisma', prisma)
fastify.decorate('token', AccessToken)

fastify.register(ApiRoutes, { prefix: '/api' })

fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
