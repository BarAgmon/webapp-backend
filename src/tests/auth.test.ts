import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import jwt from 'jsonwebtoken';

let app: Express;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
  imgUrl: "/blalba/bla"
}
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;


describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register Invalid password length", async () => {
    const response = await request(app).post("/auth/register").send({
      email : "bla@bla.com",
      imgUrl: "/blba",
      password: "12"});
    expect(response.statusCode).toBe(400);
  });

  test("Test Register An error occurred during registration", async () => {
    jest.spyOn(User, "create").mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await request(app).post("/auth/register").send({
      email : "bla576@bla.com", 
      imgUrl: "/blba",
      password: "123456789123"});
    expect(response.statusCode).toBe(500);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    expect(accessToken).toBeDefined();
  });
  test("Test Login missing email or password", async () => {
    const response = await request(app).post("/auth/login").send({email: "hi"});
    expect(response.statusCode).toBe(400);
  });
  test("Test Login email or password incorrect when email incorrect", async () => {
    const response = await request(app).post("/auth/login").send({email: "hi", password: "hi"});
    expect(response.statusCode).toBe(401);
  });
  test("Test Login email or password incorrect when password incorrect", async () => {
    const response = await request(app).post("/auth/login").send({email: "testUser@test.com", password: "hi"});
    expect(response.statusCode).toBe(401);
  });
  test("An error occurred during registration", async () => {
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await request(app).post("/auth/login").send({email: "testUser@test.com", password: "hi"});
    expect(response.statusCode).toBe(500);
  });
  test("Logout without refresh token should return 401", async () => {
    const response = await request(app)
      .post("/auth/logout") 
      .send();
    expect(response.statusCode).toBe(401);
  });
  test("Logout with invalid refresh token should return 401", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set('Authorization', 'Bearer invalidToken');
    expect(response.statusCode).toBe(401);
  });
  // test("Simulate server error during logout", async () => {
  //   jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error('Unexpected error'));
  //   const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCK9.eyJfaWQiOiI2NWMxZmRkNWIzZDc0MGUxN2FkMGU0ZGUiLCJpYXQiOjE3MDcyMTIyNDV9.4c2IwnntCwHl2p_BkK0T6vj6bhpOkhpqu5OmMAsAZeQ"
  //   const response = await request(app).post("/auth/logout")
  //   .set('Authorization', `Bearer ${refreshToken}`);
  //   expect(response.statusCode).toBe(500);
  // });
 });