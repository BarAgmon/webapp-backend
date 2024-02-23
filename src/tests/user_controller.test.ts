import userController from "../controllers/user_controller";
import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from 'bcrypt';
import {DeleteResult} from 'mongodb';

afterEach(() => {
    jest.restoreAllMocks(); 
  });
describe("Base controller tests", () => {
    test("Test updateById with password, password encrypted", async () => {
        let req: Partial<Request>;
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(), 
        };
        req = {
            body: { password: 'plainPassword' },
        };
        jest.spyOn(User, "findOneAndUpdate").mockResolvedValueOnce({_id: "id"});
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce(() => { return 'someSalt' });
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { return 'encryptedPassword' });
        await userController.updateById(req as Request, res as Response);

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 'someSalt');

      });
      test("Test updateById no object found, return 404", async () => {
        let req: Partial<Request> = {
            body: { password: 'plainPassword' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(), 
        };
        jest.spyOn(User, "findOneAndUpdate").mockResolvedValueOnce(null);

        await userController.updateById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);

      });
      test("Test updateById no object found, return 404", async () => {
        let req: Partial<Request> = {
            body: { password: 'plainPassword' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(), 
        };
        jest.spyOn(User, "findOneAndUpdate").mockResolvedValueOnce(null);

        await userController.updateById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);

      });
      test("Test updateById return 200", async () => {
        let req: Partial<Request> = {
            body: { password: 'plainPassword' },
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(), 
        };
        jest.spyOn(User, "findOneAndUpdate").mockResolvedValueOnce({_id: "id"});

        await userController.updateById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);

      });

      test("should respond with 200 and confirmation message on successful deletion", async () => {
        let req: Partial<Request> = {
            body: {},
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(), 
        };
        jest.spyOn(User, 'deleteOne').mockResolvedValueOnce({deletedCount: 1, acknowledged: true, } as DeleteResult);
        
        await userController.deleteById(req as Request, res as Response);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("deleted successfully ");
      });

      test("should respond with 500 and an error message on failure", async () => {
        let req: Partial<Request> = {
            body: {},
        };
        req["user"] ={ _id: "someUserId" };
        let res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        const errorMessage = "Deletion failed due to an error";
        jest.spyOn(User, 'deleteOne').mockRejectedValueOnce(new Error(errorMessage));
    
        await userController.deleteById(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
})