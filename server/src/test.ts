import { PrismaClient, SponsorshipType, SponsorshipStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 先创建两个 User，用作 initiator 和 receiver
  const initiator = await prisma.user.findFirst();

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
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
      },
      {
        title: 'Science Project Grant',
        description: 'Funding for science project',
        amount: 300.0,
        type: SponsorshipType.COMPANY_INITIATED,
        status: SponsorshipStatus.APPROVED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-07-31').toISOString().slice(0, 10).replace('T', ' '),
      },
        {
        title: 'Art Club Sponsorship',
        description: 'Support for art club',
        amount: 200,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.PENDING,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-08-31').toISOString().slice(0, 10).replace('T', ' '),
        },
        {
        title: 'Music Workshop Funding',
        description: 'Funding for music workshop',
        amount: 400,
        type: SponsorshipType.COMPANY_INITIATED,
        status: SponsorshipStatus.APPROVED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-09-30').toISOString().slice(0, 10).replace('T', ' '),
        },
        {
        title: 'Robotics Competition Grant',
        description: 'Support for robotics competition',
        amount: 600,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.COMPLETED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-12-31').toISOString().slice(0, 10).replace('T', ' '),
        },
        {
        title: 'Robotics Competition Grant',
        description: 'Support for robotics competition',
        amount: 600,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.COMPLETED,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-11-30').toISOString().slice(0, 10).replace('T', ' '),
        },
        {
        title: 'Math Club Funding',
        description: 'Support for math club activities',
        amount: 500.0,
        type: SponsorshipType.SCHOOL_INITIATED,
        status: SponsorshipStatus.PENDING,
        initiatorId: initiator.id,
        updatedAt: new Date(),
        time_from: new Date('2024-06-30').toISOString().slice(0, 10).replace('T', ' '),
        time_end: new Date('2024-10-31').toISOString().slice(0, 10).replace('T', ' '),
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
