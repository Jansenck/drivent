import { Router } from "express";
import { getTicketsByUserId, postNewTicket, getTicketsByTypeTicketId } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketsByUserId)
  .get("/types", getTicketsByTypeTicketId)
  .post("/", postNewTicket);

export { ticketsRouter };
