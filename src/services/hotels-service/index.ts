import { notFoundError, unauthorizedError, requestError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import paymentRepository from "@/repositories/payment-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getManyHotels(userId: number, ticketId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketsById(ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.enrollmentId !== enrollment.id) throw unauthorizedError();
  /* TODO: analisar se é válido retornar o status do ticket pelo ticket.status */
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if(!payment) throw notFoundError();
  
  const hotels = await hotelsRepository.findManyHotels();
  return hotels;
}

const hotelsService = {
  getManyHotels
};

export default hotelsService;
