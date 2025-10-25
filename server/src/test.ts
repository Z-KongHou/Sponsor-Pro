import { PrismaClient, SponsorshipType, SponsorshipStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 先创建两个 User，用作 initiator 和 receiver
  const initiator = await prisma.user.findFirst();

  // 往 Sponsorship 表里插入几条测试数据
  const sponsorships = await prisma.sponsorship.createMany({
    data: [
      {
        title: 'Math Club Funding',
        description: 'Support for math club activities',
        amount: 500.0,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.PENDING,
        initiatorId: initiator.id,
        updatedAt: new Date(),
      },
      {
        title: 'Science Project Grant',
        description: 'Funding for science project',
        amount: 300.0,
        type: SponsorshipType.COMPANY_INITIATED,
        status: SponsorshipStatus.APPROVED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
      },
        {
        title: 'Art Club Sponsorship',
        description: 'Support for art club',
        amount: 200,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.PENDING,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        },
        {
        title: 'Music Workshop Funding',
        description: 'Funding for music workshop',
        amount: 400,
        type: SponsorshipType.COMPANY_INITIATED,
        status: SponsorshipStatus.APPROVED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        },
        {
        title: 'Robotics Competition Grant',
        description: 'Support for robotics competition',
        amount: 600,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.COMPLETED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        },
        {
        title: 'Robotics Competition Grant',
        description: 'Support for robotics competition',
        amount: 600,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.COMPLETED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        },
        {
        title: 'Math Club Funding',
        description: 'Support for math club activities',
        amount: 500.0,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.PENDING,
        initiatorId: initiator.id,
        updatedAt: new Date(),
      },
    ],
  });

  console.log('Seed data added:', sponsorships);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
