import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";
import { 
  createUser, 
  createEnrollmentWithAddress, 
  createTicket,
  createTicketType,
  createTicketTypeWithOrWithoutHotel,
  createPayment,
  createHotel,
  createRooms,
  createBooking
} from "../factories";

beforeAll( async () => {
  await init();
});

beforeEach( async () => {
  await cleanDb();
});

afterAll( async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = await faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession }, process.env.JWT_SECRET);
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken();
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when given ticket doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 401 when user doesnt own given ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      const otherUser = await createUser();
      const otherUserEnrollment = await createEnrollmentWithAddress(otherUser);
      const ticket = await createTicket(otherUserEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server
        .get("/hotels")
        .set("Authorization", `Bearer ${token}`)
        .send({ ticketId: ticket.id });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("it should respond with status 400  when given ticket type doesnt include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOrWithoutHotel(true, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const hotelId = faker.datatype.number();

      const response = await server
        .get(`/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ticketId: ticket.id });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if payment doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/payments?ticketId=1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOrWithoutHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const hotels = await createHotel();

      const response = await server
        .get("/hotels")
        .set("Authorization", `Bearer ${token}`)
        .send({ ticketId: ticket.id });

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body[0]).toEqual({
        id: hotels.id,
        name: hotels.name,
        image: hotels.image,
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString(),
      });
    });
  });
});

describe("GET /hotels/hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ useId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if query param hotelId is missing", async () => {
      const token = await generateValidToken();

      const response = await server.get(`/hotels/${null}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("it should respond with status 404 when given hotel doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOrWithoutHotel(true, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const hotelId = faker.datatype.number();

      const response = await server
        .get(`/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ticketId: ticket.id });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 200 and rooms data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOrWithoutHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const hotels = await createHotel();
      const rooms = await createRooms(hotels.id);

      const response = await server
        .get(`/hotels/${hotels.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ticketId: ticket.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotels.id,
        name: hotels.name,
        image: hotels.image,
        Rooms: [{
          id: rooms.id,
          name: rooms.name,
          capacity: rooms.capacity,
          hotelId: hotels.id,
          createdAt: rooms.createdAt.toISOString(),
          updatedAt: rooms.updatedAt.toISOString()
        }],
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString()
      });
    });
  });
});
