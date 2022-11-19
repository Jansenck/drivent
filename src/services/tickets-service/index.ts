import { notFoundError } from "@/errors"; 
import ticketsRepository from "@/repositories/tickets-repository";

async function getTickets(userId: number) {
  const [tickets] = await ticketsRepository.findMany(userId);
  if(!tickets) throw notFoundError();

  return tickets;
}

const ticketsService = {
  getTickets
};

export default ticketsService;

