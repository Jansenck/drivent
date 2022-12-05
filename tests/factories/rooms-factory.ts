import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createRooms(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    }
  });
}

export async function createOccupiedRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: 1,
      hotelId: hotelId,
    }
  });
}
