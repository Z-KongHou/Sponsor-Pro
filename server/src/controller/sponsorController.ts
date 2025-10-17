import { FastifyRequest, FastifyReply } from 'fastify'
import '../types/global' // 导入类型定义

interface CreateSponsorshipBody {
  title: string
  description?: string
  amount?: number
  type: 'SCHOOL_INITIATED' | 'COMPANY_INITIATED'
  initiatorId?: number
  receiverId?: number
}
/**
 * 根据用户ID获取赞助信息
 */
export const getSponsorInfoByUserID = async (
  req: FastifyRequest<{ Querystring: { userID: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userID } = req.query
    const userId = parseInt(userID, 10)
    // 使用扩展后的 FastifyRequest 类型，查询Sponsorship表
    const userSponsorInfo = await req.prisma.sponsorship.findMany({
      where: {
        OR: [{ initiatorId: userId }, { receiverId: userId }]
      },
      orderBy: [{ createdAt: 'desc' }]
      // 包含关联的用户信息
    })

    // 构建统一的响应格式
    const response = {
      success: true,
      data: {
        sponsorships: userSponsorInfo
      },
      message: '赞助信息获取成功'
    }

    reply.status(200).send(response)
  } catch (error) {
    console.error('获取赞助信息失败:', error)
    reply.status(500).send({
      success: false,
      error: '获取赞助信息失败',
      message:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : '服务器内部错误'
    })
  }
}

// Define request body type based on Sponsorship model

export const createSponsor = async (
  req: FastifyRequest<{ Body: CreateSponsorshipBody }>,
  reply: FastifyReply
) => {
  try {
    const { body } = req

    // Create sponsorship with current date for updatedAt
    const sponsorship = await req.prisma.sponsorship.create({
      data: {
        title: body.title,
        description: body.description,
        amount: body.amount,
        type: body.type,
        initiatorId: body.initiatorId,
        receiverId: body.receiverId,
        status: 'PENDING', // 明确设置状态，即使数据库有默认值
        updatedAt: new Date()
      },
      include: {
        User_Sponsorship_initiatorIdToUser: {
          select: { id: true, name: true, email: true }
        },
        User_Sponsorship_receiverIdToUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    reply.status(201).send({
      success: true,
      data: sponsorship,
      message: '赞助创建成功'
    })
  } catch (error) {
    console.error('创建赞助失败:', error)
    reply.status(500).send({
      success: false,
      error: '创建赞助失败',
      message:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : '服务器内部错误'
    })
  }
}
