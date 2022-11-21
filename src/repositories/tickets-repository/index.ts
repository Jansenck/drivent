import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

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

async function insertTicket(userId: number, enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: TicketStatus.RESERVED
    }
  });
}

const ticketsRepository = {
  findManyTickets,
  insertTicket
};

export default ticketsRepository;
