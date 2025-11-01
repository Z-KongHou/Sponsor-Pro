import { FastifyRequest, FastifyReply } from 'fastify'
export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { prisma } = request.server
    const user = await prisma.user.findUnique({
      where: {
        open_id: request.openId
      },
      include: {
        Teacher: true,
        ClubMember: true,
        CompanyMember: true
      }
    })
    return reply.send({ user })
  } catch (error) {
    console.error('Error getting user by openId:', error)
    reply.code(404)
    throw new Error('获取用户信息失败')
  }
}

export const getOtherUserById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { prisma } = request.server
    const user = await prisma.user.findUnique({
      where: {
        id: Number((request.params as { userID: string }).userID)
      },
      include: {
        Teacher: true,
        ClubMember: true,
        CompanyMember: true
      }
    })
    return reply.send({ user })
  } catch (error) {
    console.error('Error getting user by id:', error)
    reply.code(404)
    throw new Error('获取用户信息失败')
  }
}

export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { userData, extensionData } = request.body as {
      userData: any
      extensionData: any
    }
    const { prisma } = request.server
    // 验证必要参数
    if (!userData) {
      return reply.code(400).send({ error: '缺少用户数据' })
    }

    // 移除 role 字段，确保角色不可被更改
    const { role, ...safeUserData } = userData

    const currentUser = await prisma.user.findUnique({
      where: {
        open_id: request.openId
      },
      include: {
        Teacher: true,
        ClubMember: true,
        CompanyMember: true
      }
    })

    if (!currentUser) {
      return reply.code(404).send({ error: '用户不存在' })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 角色变更处理 - 不再处理角色变更
      const updatedUser = await tx.user.update({
        where: {
          open_id: request.openId
        },
        data: safeUserData // 使用不包含 role 的数据
      })

      if (extensionData) {
        await updateUserExtension(
          tx,
          request.openId,
          currentUser.role, // 使用当前用户的角色
          extensionData
        )
      }

      return {
        user: updatedUser,
        extension: extensionData
      }
    })

    return reply.send({
      message: '用户信息更新成功',
      ...result
    })
  } catch (error) {
    console.error('Error updating user with role:', error)

    if (error.code === 'P2025') {
      return reply.code(404).send({ error: '用户不存在' })
    }

    return reply.code(500).send({ error: '更新用户信息失败' })
  }
}

async function updateUserExtension(tx, openId, role, data) {
  switch (role) {
    case 'teacher':
      // 更新教师信息（假设每个用户只有一个教师记录）
      return await tx.teacher.updateMany({
        where: { userId: openId },
        data: data
      })
    case 'clubMember':
      return await tx.clubMember.updateMany({
        where: { userId: openId },
        data: data
      })
    case 'companyMember':
      return await tx.companyMember.updateMany({
        where: { userId: openId },
        data: data
      })
    default:
      throw new Error('无效的角色类型')
  }
}
