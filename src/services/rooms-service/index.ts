import roomsRepository from "@/repositories/rooms-repository";

async function getRoomWithBookings(roomId: number) {
  const roomWithBookings = await roomsRepository.findRoomWithBookings(roomId);
  return roomWithBookings;
}

const roomsService = {
  getRoomWithBookings
};

export default roomsService;
