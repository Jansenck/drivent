import { Router } from "express";
import { getTicketsByUserId, postNewTicket } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketsByUserId)
  .post("/", postNewTicket);

export { ticketsRouter };
