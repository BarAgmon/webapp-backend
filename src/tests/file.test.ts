import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks(); 
  });

describe("File Tests", () => {
    test("upload file", async () => {
        const currDir = `${__dirname}`;
        const filePath = `${currDir}/coin.png`;
        console.log(filePath);

        try {
            const response = await request(app)
                .post("/file?file=123.webp").attach('file', filePath)
            console.log(response)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            console.log(response)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})