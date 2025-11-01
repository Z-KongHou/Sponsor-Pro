import type { FastifyRequest } from 'fastify'
import type { FastifyReply } from 'fastify'
// 定义请求体类型
interface CreateSessionBody {
  UserA: number
  UserB: number
  sessionId: string
}

/**
 * 创建或更新会话
 * 根据用户提供的Session模型(session_id, participants, createdAt)
 */
export const createSession = async (request: FastifyRequest, reply: FastifyReply) => {
  const { prisma } = request.server;
  const { UserA, UserB, sessionId } = request.body as CreateSessionBody;
  
  try {
    await prisma.session.create({
        data: {
            session_id: sessionId,
            participants: {
                connect: [{ id: UserA }, { id: UserB }]
            }
        }
    });
    
    reply.send("创建会话成功");
  } catch (error) {
    console.error('创建会话失败:', error);
    reply.status(500).send({ error: '创建会话失败', details: error.message });
  }
}