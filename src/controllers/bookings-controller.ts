import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const booking = await bookingsService.listBookingByUserId(userId, Number(roomId));
    return res.status(200).send(booking);
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.status === 403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.status === 402) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const booking = await bookingsService.postBooking(userId, roomId);
    return res.status(200).send({ bookingId: booking.id });
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.status === 403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.status === 402) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const booking = await bookingsService.updateBooking(userId, roomId,  Number(bookingId));
    return res.status(200).send({ bookingId: booking.id });
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.status === 403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
