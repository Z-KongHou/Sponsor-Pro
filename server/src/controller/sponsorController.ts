import { FastifyRequest, FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'
import '../types/global' // 导入类型定义
import {
  deleteSponsorById,
  getApprovedSponsors,
  updateSponsorStatusByOperation,
  SponsorStatus
} from '../service/sponsorService'

interface CreateSponsorshipBody {
  title: string
  description?: string
  amount?: number
  type: 'SCHOOL_INITIATED' | 'COMPANY_INITIATED'
  initiatorId?: number
  receiverId?: number
}

interface UpdateSponsorStatusBody {
  operation: boolean
}

// 需要一个更为明确的操作判断
const statusFromOperation = (operation: boolean): SponsorStatus =>
  operation ? 'COMPLETED' : 'APPROVED'

export const listApprovedSponsors = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const sponsors = await getApprovedSponsors(req.prisma)
  return reply.send(sponsors)
}

export const deleteSponsor = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const sponsorId = Number(req.params.id)

  try {
    const deletedRecord = await deleteSponsorById(req.prisma, sponsorId)
    return reply.send(deletedRecord)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      reply.code(404)
      return reply.send({ message: 'Sponsor record not found' })
    }

    throw error
  }
}

export const updateSponsorStatus = async (
  req: FastifyRequest<{
    Params: { id: string }
    Body: UpdateSponsorStatusBody
  }>,
  reply: FastifyReply
) => {
  const { operation } = req.body

  if (typeof operation !== 'boolean'  ) {
    reply.code(400)
    return reply.send({ message: 'operation must be a boolean value ' })
  }
  if (Number.isNaN(req.params.id)) {
    reply.code(400)
    return reply.send({ message: 'Invalid sponsor ID' })
  }

  const sponsorId = Number(req.params.id)
  const status = statusFromOperation(operation)

  try {
    const updatedRecord = await updateSponsorStatusByOperation(
      req.prisma,
      sponsorId,
      status
    )

    return reply.send(updatedRecord)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      reply.code(404)
      return reply.send({ message: 'Sponsor record not found' })
    }

    throw error
  }
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
