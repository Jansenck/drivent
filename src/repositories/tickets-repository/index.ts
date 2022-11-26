import { prisma } from "@/config";
import { Ticket } from "@prisma/client";
import { TicketStatus } from "@prisma/client";

async function findTickets(userId: number) {
  return prisma.ticket.findFirst({
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

async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...ticket,
    }
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    }
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true, //inner join
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const ticketsRepository = {
  findTickets,
  findTicketsById,
  findTicketsTypes,
  createTicket,
  ticketProcessPayment,
  findTicketByEnrollmentId
};

export default ticketsRepository;
