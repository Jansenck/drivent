import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany({});
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findMany({
    where: {
      id: hotelId,
    }
  });
}

async function  findHotelWithRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelsRepository = {
  findHotelById,
  findManyHotels,
  findHotelWithRooms
};

export default hotelsRepository;
