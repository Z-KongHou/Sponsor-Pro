import { PrismaClient } from "@prisma/client";


async function getApprovedSponsors(prisma: PrismaClient) {

        return await prisma.sponsorship.findMany({
            where: {
                status: "APPROVED"
            }
        });
    }


async function deleteSponsorById(prisma: PrismaClient, sponsorId: number ) {
        return await prisma.sponsorship.delete({
            where: { id: sponsorId } ,
        });
    }

async function updateSponsorStatusByOperation(prisma: PrismaClient, sponsorId: number, operation: SponsorStatus) {
    const status = operation ? 'COMPLETED' : 'APPROVED';
    return await prisma.sponsorship.update({
        where: { id: sponsorId } ,
        data: { status },
    })
}

type SponsorStatus = 'APPROVED' | 'COMPLETED';

export { getApprovedSponsors, deleteSponsorById, updateSponsorStatusByOperation, SponsorStatus };