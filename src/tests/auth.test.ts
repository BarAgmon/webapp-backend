import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express, Response } from "express";
import User, { IUser } from "../models/user_model";
import jwt from 'jsonwebtoken';
import { OAuth2Client} from "google-auth-library";
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


  test('Successfully sign in an existing user', async () => {
    const client = new OAuth2Client();
    const user: IUser = { password: "0", email: 'test@example.com', _id: 'test-id', imgUrl: 'test-picture-url' }
    jest.spyOn(client, 'verifyIdToken').mockImplementation(() =>
      ({getPayload: ()=> (user)}));
    
    const req = { body: { credential: 'test-credential' } };

    jest.spyOn(User, "findOne").mockResolvedValueOnce(user);
    const mockedCreateFunc = User.create as jest.Mock;
    const response = await request(app)
    .post("/google")
    .send({req})
    expect(mockedCreateFunc).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  
  // test('Successfully sign in non existing user', async () => {
  //   const client = new OAuth2Client();
  //   const user: IUser = { password: "0", email: 'test@example.com', _id: 'test-id', imgUrl: 'test-picture-url' }
  //   jest.spyOn(client, 'verifyIdToken').mockImplementation(() =>
  //     ({getPayload: ()=> (user)}));
    
  //   const req = { body: { credential: 'test-credential' } };

  //   jest.spyOn(User, "findOne").mockResolvedValueOnce({});
  //   const mockedCreateFunc = User.create as jest.Mock;
  //   const response = await request(app)
  //   .post("/google")
  //   .send({req})
  //   expect(mockedCreateFunc).toHaveBeenCalledTimes(2);
  //   expect(response.status).toHaveBeenCalledWith(200);
  // });
 });