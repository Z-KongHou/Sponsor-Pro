// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import prisma from './prisma'
import Routes from './routes'

const PORT = parseInt(process.env.PORT || '3000', 10)

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyCors, {
  origin: true
})

fastify.decorate('prisma', prisma)

// Declare a route
fastify.get('/', async function (request, reply) {
  const res = await prisma.user.findMany()
  console.log(res)
  reply.send({ hello: res })
})

fastify.register(Routes)
// Run the server!

fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
