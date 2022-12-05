import { prisma } from "@/config";

async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
    }
  });
}  

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    }
  });
}  

async function createBooking(userId: number, roomId:  number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

async function updateBooking(userId: number, roomId:  number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      userId,
      roomId,
    }
  });
}

const bookingsRepository = {
  findBookingById,
  findBookingByRoomId,
  createBooking,
  updateBooking
};

export default bookingsRepository;
