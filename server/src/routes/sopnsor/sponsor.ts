import { FastifyPluginAsync } from 'fastify';
import { Prisma, PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

type SponsorStatus = 'APPROVED' | 'COMPLETED';

const normalizeSponsorId = (rawId: string): string | number => {
  const numericId = Number(rawId);
  return Number.isNaN(numericId) ? rawId : numericId;
};

const statusFromOperation = (operation: boolean): SponsorStatus =>
  operation ? 'COMPLETED' : 'APPROVED';

const sponsorRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/list', async () => {
    return fastify.prisma.sponsorship.findMany({
      where: { status: 'APPROVED' },
    });
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const sponsorId = normalizeSponsorId(request.params.id);

    try {
      const deletedRecord = await fastify.prisma.sponsorship.delete({
        where: { id: sponsorId } as any,
      });
      return deletedRecord;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        reply.code(404);
        return { message: 'Sponsor record not found' };
      }

      throw error;
    }
  });

  fastify.patch<{
    Params: { id: string };
    Body: { operation: boolean };
  }>('/:id/status', async (request, reply) => {
    const { id } = request.params;
    const { operation } = request.body;

    if (typeof operation !== 'boolean') {
      reply.code(400);
      return { message: 'operation must be a boolean value' };
    }

    const sponsorId = normalizeSponsorId(id);
    const status = statusFromOperation(operation);

    try {
      const updatedRecord = await fastify.prisma.sponsorship.update({
        where: { id: sponsorId } as any,
        data: { status },
      });

      return updatedRecord;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        reply.code(404);
        return { message: 'Sponsor record not found' };
      }

      throw error;
    }
  });
};

export default sponsorRoutes;
