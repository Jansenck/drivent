import { Router } from "express"; 
import { authenticateToken } from "@/middlewares";
import { postPayment, getPaymentByTicketId } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .post("/process", postPayment)
  .get("/:ticketId?", getPaymentByTicketId);

export { paymentsRouter };

