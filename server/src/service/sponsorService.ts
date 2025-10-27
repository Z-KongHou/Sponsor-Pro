import { PrismaClient } from '@prisma/client'
import { SponsorshipType } from '@prisma/client'

async function getApprovedSponsors(
  prisma: PrismaClient,
  type: SponsorshipType,
  page?: number,
  search?: string
) {
  const pageSize = 6
  const skip = page ? (page - 1) * pageSize : 0
  const where: any = {
    status: 'APPROVED',
    type: type
  }
  if (search) {
    console.log(search)
    where.OR = [{ title: { contains: search, mode: 'insensitive' } }]
  }

  const [data, totalCount] = await Promise.all([
    prisma.sponsorship.findMany({
      where,
      skip,
      take: pageSize
    }),
    prisma.sponsorship.count({
      where
    })
  ])

  return {
    data,
    totalCount
  }
}

async function getInfo(prisma: PrismaClient, id: number) {
  console.log(id)
  const sponsorship = await prisma.sponsorship.findUnique({
    where: { id },
    include: {
      User_Sponsorship_initiatorIdToUser: true,
      User_Sponsorship_receiverIdToUser: true
    }
  })

  if (!sponsorship) {
    throw new Error(`Sponsorship with ID ${id} not found`)
  }

  return {
    datainfo: sponsorship
  }
}

async function deleteSponsorById(prisma: PrismaClient, sponsorId: number) {
  return await prisma.sponsorship.delete({
    where: { id: sponsorId }
  })
}

async function updateSponsorStatusByOperation(
  prisma: PrismaClient,
  sponsorId: number,
  operation: SponsorStatus
) {
  const status = operation ? 'COMPLETED' : 'APPROVED'
  return await prisma.sponsorship.update({
    where: { id: sponsorId },
    data: { status }
  })
}

type SponsorStatus = 'APPROVED' | 'COMPLETED'

export {
  getApprovedSponsors,
  deleteSponsorById,
  updateSponsorStatusByOperation,
  SponsorStatus,
  getInfo
}
