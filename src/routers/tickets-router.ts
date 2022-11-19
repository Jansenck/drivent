import { Router } from "express";
import { getTickets } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTickets);

export { ticketsRouter };
