import { notFoundError } from "@/errors"; 
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getTickets(userId: number) {
  const isValidEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!isValidEnrollment.Address[0].enrollmentId) throw notFoundError();

  const [tickets] = await ticketsRepository.findManyTickets(userId);
  if(!tickets.enrollmentId) throw notFoundError();

  return tickets;
}

const ticketsService = {
  getTickets
};

export default ticketsService;

