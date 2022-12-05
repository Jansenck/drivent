import { notFoundError, requestError, unauthorizedError } from "@/errors";
import bookingsRepository from "@/repositories/bookings-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomsService from "../rooms-service";
import paymentRepository from "@/repositories/payment-repository";
import roomsRepository from "@/repositories/rooms-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function listBookingByUserId(userId: number, roomId: number) {
  if(!roomId) throw requestError(403, "FORBIDDEN");
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();
  
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();
  
  if(ticket.status !== "PAID") throw requestError(402, "PAYMENT_REQUIRED");
  
  if( ticket.TicketType.isRemote || !ticket.TicketType.includesHotel ) {
    throw requestError(400, "BAD_REQUEST");
  }
  
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if(!payment) throw notFoundError();

  const room = await roomsRepository.findRoomById(roomId);
  if(!room) throw notFoundError();

  const booking = await bookingsRepository.findBookingByRoomId(roomId);

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  if(!roomId) throw requestError(403, "FORBIDDEN");
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();
  
  if( ticket.TicketType.isRemote || !ticket.TicketType.includesHotel ) {
    throw requestError(400, "BAD_REQUEST");
  }
  if(ticket.status !== "PAID") throw requestError(402, "PAYMENT_REQUIRED");
  
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if(!payment) throw notFoundError();
  
  const room = await roomsService.getRoomWithBookings(roomId);
  if(room.length === 0) throw notFoundError();

  const thereIsVacancies = room[0].capacity > room[0]._count.Booking;
  if(!thereIsVacancies) throw requestError(403, "FORBIDDEN");

  const booking = await bookingsRepository.createBooking(userId, roomId);
  return booking;
}

async function updateBooking(userId: number, roomId: number,  bookingId: number) {
  if(!bookingId ) throw requestError(403, "FORBIDDEN");

  const room = await roomsService.getRoomWithBookings(roomId);
  if(room.length === 0) throw notFoundError();

  const booking = await bookingsRepository.findBookingById(bookingId);
  if(!booking) throw notFoundError();

  const newRoom = await roomsService.getRoomWithBookings(booking.roomId);
  if(newRoom.length === 0) throw notFoundError();

  const thereIsVacancies = newRoom[0].capacity > newRoom[0]._count.Booking;
  if(!thereIsVacancies) throw requestError(403, "FORBIDDEN");

  const newBooking = await bookingsRepository.createBooking(userId, newRoom[0].id);
  return newBooking;
}

const bookingsService = {
  listBookingByUserId,
  postBooking,
  updateBooking
};

export default bookingsService;
