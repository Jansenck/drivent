import { prisma } from "@/config";

async function findMany(userId: number) {
  return prisma.ticket.findMany({
    where: {
      Enrollment: {
        userId,
      }
    },
    include: {
      TicketType: true,
    }
  });
}

const ticketsRepository = {
  findMany,
};

export default ticketsRepository;
