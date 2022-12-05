import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";

export async function getHotelsByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.body;

  try {
    const hotels = await hotelsService.getManyHotels(userId, ticketId);
    return res.status(200).send(hotels);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.status === 403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  
  try {
    const hotelWithRooms = await hotelsService.getHotelWithRooms(userId, Number(hotelId));
    return res.status(200).send(hotelWithRooms);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.status === 403) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "RequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
