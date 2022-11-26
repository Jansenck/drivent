import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelsByUserId } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotelsByUserId);

export { hotelsRouter };
