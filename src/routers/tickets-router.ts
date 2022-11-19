import { Router } from "express";
import { getTicketsByUserId } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketsByUserId);

export { ticketsRouter };
