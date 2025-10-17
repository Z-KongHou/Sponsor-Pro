
declare module 'fastify' {
  interface FastifyRequest {
    openId?: string;
  }
}