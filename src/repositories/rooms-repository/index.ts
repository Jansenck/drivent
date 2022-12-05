import { prisma } from "@/config";

async function findRoomById(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId, 
    }
  });
}

async function findRoomWithBookings(roomId: number) {
  return prisma.room.findMany({
    where: {
      id: roomId,
    },
    include: {
      _count: {
        select: { Booking: true }
      }
    }
  });
} 

const roomsRepository = {
  findRoomById,
  findRoomWithBookings
};

export default roomsRepository;
