const { PrismaClient } from 'prisma/client'

const prisma = new PrismaClient()

interface OperationType {
  //To do
}
export function publishedSponsor() {
  return prisma.sponsorlist.findMany({
  where: {
    status: 'PUBLISHED'
  }
})}

export funciton deleteSponsorRecordById (id: string){
  return prisma.sponsorlist.delete(id,{
  where: {
    id: {id}
  }
})

export function updateSponsorRecondByBehavior(opeartion: string) {
  const status = ''
  if (opeartion === "") {
    status = ''
  } else {
    status = ''
  }
  return prisma.sponsorlist.update(
  {
    where: {
        someopeartion: opeartion
      },
    data: {
        status: status
      }
  }
)
}
