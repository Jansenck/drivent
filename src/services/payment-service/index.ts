import { notFoundError, requestError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentsService from "../enrollments-service";

async function createPayment(userId: number, ticketId: number, cardData: createOrUpdatePayment) {
  if(!ticketId || !cardData) throw requestError(400, "BAD_REQUEST");
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();
  
  const ticket = await ticketsRepository.findTicketsById(ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const paymentData = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentRepository.createPayment(ticketId, paymentData);

  await ticketsRepository.ticketProcessPayment(ticketId);
  return payment;
}

async function getPayment(ticketId: number) {
  const ticket = await ticketsRepository.findTicketsById(ticketId);
  if(!ticket) throw notFoundError();
  
  const payment = await paymentRepository.findPaymentByTicketId(ticketId);
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

