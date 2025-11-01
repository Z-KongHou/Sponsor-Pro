import { FastifyRequest, FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'
import { SponsorshipType } from '@prisma/client'
import {
  deleteSponsorById,
  getApprovedSponsors,
  updateSponsorStatusByOperation,
  SponsorStatus,
  getInfo
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
  try {
    const { page, type, search } = req.query as {
      page?: string
      search?: string
      type: SponsorshipType
    }
    const pageNum = page ? parseInt(page) : 1
    const finalSearch = search || ''

    const sponsors = await getApprovedSponsors(
      req.server.prisma,
      type,
      pageNum,
      finalSearch
    )
    return reply.send(sponsors)
  } catch (error) {
    return reply.status(500).send({
      message: '获取赞助列表失败，请稍后重试',
      error: error.message || String(error)
    })
  }
}

export const getSponsorsInfo = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as {
    id: string
  }
  const sponsorid = parseInt(id)

  const data = await getInfo(req.server.prisma, sponsorid)
  return reply.send(data)
}

export const deleteSponsor = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  if (Number.isNaN(Number((req.params as { id: string }).id))) {
    reply.code(400)
    return reply.send({ message: 'Invalid sponsor ID' })
  }
  const sponsorId = Number((req.params as { id: string }).id)

  try {
    const deletedRecord = await deleteSponsorById(req.server.prisma, sponsorId)
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

export const updateSponsorStatus = async (req, reply) => {
  const { operation } = req.body

  if (typeof operation !== 'boolean') {
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
      req.server.prisma,
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
export const getSponsorInfoByUserID = async (req, reply) => {
  try {
    const { userID } = req.query
    const userId = parseInt(userID, 10)
    // 使用扩展后的 FastifyRequest 类型，查询Sponsorship表
    const userSponsorInfo = await req.server.prisma.sponsorship.findMany({
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

export const createSponsor = async (req, reply) => {
  try {
    const { body } = req

    // Create sponsorship with current date for updatedAt
    const sponsorship = await req.server.prisma.sponsorship.create({
      data: {
        title: body.title,
        description: body.description,
        amount: body.amount,
        type: body.type,
        initiatorId: body.initiatorId,
        // receiverId: body.receiverId,
        status: 'PENDING', // 明确设置状态，即使数据库有默认值
        updatedAt: new Date(),
        time_from: body.time_from,
        time_end: body.time_end
      },
      include: {
        ItiatorId: {
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

export const checkSponsorInfo = async (req, reply) => {
  try {
    const { sponsorId } = req.params as {
      sponsorId: number
    }
    await req.server.prisma.sponsorship.update({
      where: { id: sponsorId },
      data: {
        status: 'APPROVED'
      }
    })
    reply.status(201).send({
      success: true,
      message: '赞助信息检查成功'
    })
  } catch (error) {
    console.error('检查赞助信息失败:', error)
    reply.status(500).send({
      success: false,
      error: '检查赞助信息失败',
      message:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : '服务器内部错误'
    })
  }
}
