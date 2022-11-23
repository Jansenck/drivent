import { notFoundError, unauthorizedError } from "@/errors"; 
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Ticket } from "@prisma/client";

async function postTicket(userId: number, ticketTypeId: number) {
  if(!ticketTypeId) {
    throw unauthorizedError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment.Address[0].enrollmentId) throw notFoundError();

  const { enrollmentId } = enrollment.Address[0];
  const newTicket: Ticket = await ticketsRepository.createOrUpdateTicket(undefined, enrollmentId, ticketTypeId);
  if(!newTicket) throw notFoundError();

  const getNewTicket = await getTickets(userId);

  return getNewTicket;
}

async function getTickets(userId: number) {
  const isValidEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!isValidEnrollment.Address[0].enrollmentId) throw unauthorizedError();

  const [tickets] = await ticketsRepository.findManyTickets(userId);
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

