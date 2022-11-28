import { notFoundError, requestError, unauthorizedError } from "@/errors";
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
  
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if(!payment) throw notFoundError();
  
  const hotels = await hotelsRepository.findManyHotels();
  return hotels;
}

async function getHotelWithRooms(userId: number, hotelId: number) {
  if(!userId || !hotelId) throw requestError(400, "BAD_REQUEST");
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw unauthorizedError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket.TicketType.includesHotel) throw notFoundError();

  const hotel = await hotelsRepository.findHotelById(hotelId);
  if(!hotel) throw notFoundError();

  const hotelWithRooms = await hotelsRepository.findHotelWithRooms(hotelId);
  return hotelWithRooms;
}

const hotelsService = {
  getManyHotels,
  getHotelWithRooms
};

export default hotelsService;
