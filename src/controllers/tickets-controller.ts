import { Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import { notFoundError, unauthorizedError } from "@/errors";

export async function getTicketsByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsService.getTickets(userId);
    return res.send(tickets).status(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const newTicket = await ticketsService.postTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(newTicket);
  } catch (error) {
    if(error.name === "TypeError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } 
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
