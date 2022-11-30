import { cleanDb } from "../helpers";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import app, { init } from "@/app";
import { prisma } from "@/config";
import supertest from "supertest";
import { createUnzip } from "zlib";
import { createSession, createUser } from "../factories";
beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED); 
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
