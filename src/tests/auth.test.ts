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

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks(); 
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
  test("Logout with non exist token -> 401", async () => {
    const token1 = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const token2 = jwt.sign( { hello: "world2" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const returnedUser: IUser & { save: jest.Mock } = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) , refreshTokens:[token2]}
      jest.spyOn(User, "findOne").mockResolvedValueOnce(returnedUser);
    const response = await request(app)
      .post("/auth/logout")
      .set('Authorization', 'Bearer ' + token1);
    expect(response.statusCode).toBe(401);
  });
  test("Logout with valid token -> 200", async () => {
    const token = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const returnedUser: IUser & { save: jest.Mock } = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) , refreshTokens:[token]}
      jest.spyOn(User, "findOne").mockResolvedValueOnce(returnedUser);
    const response = await request(app)
      .post("/auth/logout")
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
  });
  test("Logout user doesnt exist -> 401", async () => {
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
    const response = await request(app)
      .post("/auth/logout")
      .set('Authorization', 'Bearer invalidToken');
    expect(response.statusCode).toBe(401);
  });
  test("Logout with error -> 500", async () => {
    const token = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await request(app)
      .post("/auth/logout")
      .set('Authorization', 'Bearer '+ token);
    expect(response.statusCode).toBe(500);
  });
  test('Successfully sign in an existing user', async () => {
    const user= { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', picture: "image", save: jest.fn().mockResolvedValue(true) }
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementationOnce(() => ({getPayload: () => ({...user})}))
    jest.spyOn(User, "findOne").mockResolvedValueOnce(user);
    jest.spyOn(User, "create").mockResolvedValue(user as any);
    const response = await request(app)
    .post("/auth/google")
    .send({ credential: 'test-credential' })
    console.log(response.error)
    expect(User.create).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(200);
  },30000);

  test('Successfully sign in non existing user', async () => {
    const user: IUser & { save: jest.Mock } = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) }
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementationOnce(() => ({getPayload: () => ({...user})}))
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
    jest.spyOn(User, "create").mockResolvedValue(user as any);
    const response = await request(app)
    .post("/auth/google")
    .send({ credential: 'test-credential' })
    console.log(response.error)
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  },30000);
  test('An error occured during registration -> status 400', async () => {
    const user: IUser & { save: jest.Mock } = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) }
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementationOnce(() => ({getPayload: () => ({...user})}))
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("error"));
    const mockedCreateFunc = User.create as jest.Mock;
    const response = await request(app)
    .post("/auth/google")
    .send({ credential: 'test-credential' })
    console.log(response.error)
    expect(response.status).toBe(400);
  });
  test("Refresh without refresh token should return 403", async () => {
    const response = await request(app)
      .get("/auth/refresh") 
      .send();
    expect(response.statusCode).toBe(403);
  });

  test("Refresh invelid token -> 403", async () => {
    const invalidToken = jwt.sign( { hello: "world" }, process.env.JWT_SECRET, { expiresIn: '0ms'});
    const response = await request(app)
      .get("/auth/refresh")
      .set('Authorization', 'Bearer '+ invalidToken);
    expect(response.statusCode).toBe(403);
  });

  test("Refresh token doesnt include on user refresh tokens list -> 403", async () => {
    const token1 = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const token2 = jwt.sign( { hello: "world2" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const returnedUser = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) , _doc: {refreshTokens:[token2]}}
      jest.spyOn(User, "findOne").mockResolvedValueOnce(returnedUser);
    const response = await request(app)
      .get("/auth/refresh")
      .set('Authorization', 'Bearer ' + token1);
    expect(response.statusCode).toBe(403);
  });

  test("Refresh successfully ->  200", async () => {
    const token1 = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    const returnedUser = { password: "0", email: 'test@example.com',
     _id: 'test-id', imgUrl: 'test-picture-url', save: jest.fn().mockResolvedValue(true) , _doc: {refreshTokens:[token1]}}
      jest.spyOn(User, "findOne").mockResolvedValueOnce(returnedUser);
    const response = await request(app)
      .get("/auth/refresh")
      .set('Authorization', 'Bearer ' + token1);
    expect(response.statusCode).toBe(200);
  });

  test("Refresh with error -> 403", async () => {
    const token = jwt.sign( { hello: "world1" }, process.env.JWT_SECRET, { expiresIn: '30m'});
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error('Unexpected error'));
    const response = await request(app)
      .get("/auth/refresh")
      .set('Authorization', 'Bearer '+ token);
    expect(response.statusCode).toBe(403);
  });
 });