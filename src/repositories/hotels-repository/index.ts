import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany({});
}

const hotelsRepository = {
  findManyHotels,
};

export default hotelsRepository;
