import { PrismaClient } from '@prisma/client'
import { FastifyRequest } from 'fastify'

// 扩展 FastifyRequest 接口，添加 prisma 属性
declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient
  }
}
