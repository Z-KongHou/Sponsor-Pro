import { FastifyInstance } from 'fastify'
import {
  getSponsorInfoByUserID,
  createSponsor
} from '../../../controller/sponsorController'

/**
 * 赞助相关路由
 */
export const sponsorRoutes = async (fastify: FastifyInstance) => {
  // 获取用户的赞助信息
  // GET /api/sponsor/user?userID=xxx
  fastify.get('/user', getSponsorInfoByUserID)

  // 创建新的赞助记录
  // POST /api/sponsor/create
  fastify.post('/create', createSponsor)
}

export default sponsorRoutes
