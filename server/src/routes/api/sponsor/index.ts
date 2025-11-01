import { FastifyInstance } from 'fastify'
import {
  getSponsorInfoByUserID,
  createSponsor,
  listApprovedSponsors,
  deleteSponsor,
  updateSponsorStatus,
  getSponsorsInfo
} from '../../../controller/sponsorController'

/**
 * 赞助相关路由
 */
export const sponsorRoutes = async (fastify: FastifyInstance) => {
  // 获取用户的赞助信息
  // GET /api/sponsor/user/sponsor?id=xxx
  fastify.get('/user/sponsor/:id', getSponsorInfoByUserID)
  fastify.get('/detail/:id', getSponsorsInfo)
  fastify.get('/list', listApprovedSponsors)
  // 创建新的赞助记录
  // POST /api/sponsor/create
  fastify.post('/create', createSponsor)
  fastify.delete('/delete/:id', deleteSponsor)
  fastify.put('/update-status/:id', updateSponsorStatus)
}

export default sponsorRoutes
