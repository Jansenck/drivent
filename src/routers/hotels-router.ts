import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelsByUserId, getHotelWithRooms } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotelsByUserId)
  .get("/:hotelId", getHotelWithRooms);

export { hotelsRouter };
