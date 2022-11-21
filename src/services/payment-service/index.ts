import { notFoundError, requestError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentsService from "../enrollments-service";

async function createPayment(userId: number, ticketId: number, cardData: createOrUpdatePayment) {
  if(!ticketId || !cardData) throw requestError(400, "BAD_REQUEST");
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  
  const ticket = await ticketsRepository.findTicketsById(ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.enrollmentId !== enrollment.id || !enrollment) throw unauthorizedError();
  
  const newPayment = await paymentRepository.createPayment(ticketId, { ...cardData, value: ticket.TicketType.price });
  await ticketsRepository.createOrUpdateTicket(ticketId, enrollment.id, ticket.ticketTypeId);
  return newPayment;
}

async function getPayment(ticketId: number) {
  const ticket = await ticketsRepository.findTicketsById(ticketId);
  if(!ticket) throw notFoundError();
  
  const payment = await paymentRepository.getPayment(ticketId);
  const { id, value, cardIssuer, cardLastDigits, createdAt, updatedAt } = payment; 
  return { id, ticketId, value, cardIssuer, cardLastDigits, createdAt, updatedAt };
}

export type createOrUpdatePayment = {
  ticketId: number,
  value: number
  issuer: string, 
  number: string
};

const paymentService = {
  getPayment,
  createPayment,
};

export default paymentService;

