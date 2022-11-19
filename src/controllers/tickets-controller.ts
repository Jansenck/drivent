import { Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsService.getTickets(userId);
    return res.send(tickets).status(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

