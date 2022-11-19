import { prisma } from "@/config";

async function findManyTickets(userId: number) {
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
  findManyTickets,
};

export default ticketsRepository;
