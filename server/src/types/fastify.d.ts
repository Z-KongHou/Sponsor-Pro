import { PrismaClient } from '@prisma/client'
import AccessToken from '../utils/acess_token'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    token: typeof AccessToken
  }
  interface FastifyRequest {
    openId?: string
  }
}