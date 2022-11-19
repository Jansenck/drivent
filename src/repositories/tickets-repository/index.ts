import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

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
