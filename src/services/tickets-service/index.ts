import { notFoundError, requestError, unauthorizedError } from "@/errors"; 
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";

async function postTicket(userId: number, ticketTypeId: number) {
  if(!ticketTypeId) throw requestError(400, "BAD_REQUEST");

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  return ticket;
}

async function getTickets(userId: number) {
  const isValidEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!isValidEnrollment.Address[0].enrollmentId) throw unauthorizedError();

  const tickets = await ticketsRepository.findTickets(userId);
  if(!tickets.enrollmentId) throw notFoundError();

  return tickets;
}

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketsTypes();
  return ticketTypes;
}

const ticketsService = {
  postTicket,
  getTickets,
  getTicketTypes
};

export default ticketsService; 

