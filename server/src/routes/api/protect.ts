import { FastifyInstance } from 'fastify'
import { verify } from '@/service/auth/login'
import { getUser, updateUser, getOtherUserById } from '@/service/users/users'
import { register } from '@/service/users/register'

const ProtectApiRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', verify)
  fastify.get('/user/profile', getUser)
  fastify.get('/user/:userID', getOtherUserById)
  fastify.post('/user/profile', updateUser)
  fastify.post('/register', register)
}

export default ProtectApiRoutes
