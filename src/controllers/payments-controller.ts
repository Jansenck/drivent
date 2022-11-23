import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import paymentService from "@/services/payment-service";
import { requestError } from "@/errors";
import { Payment } from "@prisma/client";

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  try {
    const payment = await paymentService.createPayment(userId, ticketId, cardData);
  
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "TypeError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  if(!ticketId) throw requestError(400, "BAD_REQUEST");

  try {
    const payment = await paymentService.getPayment(Number(ticketId));
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "TypeError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export type createOrUpdatePayment = Omit<Payment, "id" | "createdAt" | "updatedAt">;
