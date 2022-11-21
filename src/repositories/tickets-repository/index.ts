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

async function findTicketsById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId
    }, 
    include: {
      TicketType: true,
    }
  });
}

async function findTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function createOrUpdateTicket(ticketId: number, enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.upsert({
    where: {
      id: ticketId || 0,
    },
    create: {
      ticketTypeId,
      enrollmentId,
      status: TicketStatus.RESERVED
    },
    update: {
      status: TicketStatus.PAID
    },
  });
}

const ticketsRepository = {
  findManyTickets,
  findTicketsById,
  findTicketsTypes,
  createOrUpdateTicket,
};

export default ticketsRepository;
