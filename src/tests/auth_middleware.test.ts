// import * as jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import  authMiddleware, {AuthRequest}  from '../common/auth_middleware';
// import httpMocks from 'node-mocks-http';

// describe('authMiddleware', () => {
//   const mockRequest = (authorization?: string): AuthRequest => {
//     return httpMocks.createRequest({
//       headers: {
//         authorization,
//       },
//     }) as AuthRequest;
//   };
//   const mockResponse = (): Response => {
//     const res = httpMocks.createResponse() as Response & { sendStatus: jest.Mock };
//     res.sendStatus = jest.fn().mockReturnValue(res); // Make it chainable
//     return res;
//   };
//   const nextFunction: NextFunction = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mocks between tests
//     process.env.JWT_SECRET = 'testsecret'; // Set a test secret
//   });

//   test('should send 403 if no authorization header is provided', () => {
//     const req = mockRequest();
//     const res = mockResponse();

//     authMiddleware(req, res, nextFunction);

//     expect(res.sendStatus).toHaveBeenCalledWith(403);
//   });

//   test('should send 403 if authorization header is malformed', () => {
//     const req = mockRequest('Malformed token');
//     const res = mockResponse();

//     authMiddleware(req, res, nextFunction);

//     expect(res.sendStatus).toHaveBeenCalledWith(403);
//   });

//   test('should send 401 if the token is expired', () => {
//     jest.spyOn(jwt, 'verify').mockImplementationOnce((token: string, secret: string, callback: jwt.VerifyCallback) => {
//       callback({ name: "TokenExpiredError" } as jwt.JsonWebTokenError, undefined);
//     });
//     const req = mockRequest('Bearer expiredtoken');
//     const res = mockResponse();

//     authMiddleware(req, res, nextFunction);

//     expect(res.sendStatus).toHaveBeenCalledWith(401);
//   });

//   test('should send 403 for a generic error in token verification', () => {
//     jest.spyOn(jwt, 'verify').mockImplementationOnce((token: string, secret: string, callback: jwt.VerifyCallback) => {
//       callback(new Error('Generic error'), undefined);
//     });
//     const req = mockRequest('Bearer badtoken');
//     const res = mockResponse();

//     authMiddleware(req, res, nextFunction);

//     expect(res.sendStatus).toHaveBeenCalledWith(403);
//   });

//   test('should call next() if the token is successfully verified', () => {
//     jest.spyOn(jwt, 'verify').mockImplementationOnce((token: string, secret: string, callback: jwt.VerifyCallback) => {
//       callback(null, { _id: 'user123' }); // Simulate successful verification
//     });
//     const req = mockRequest('Bearer goodtoken');
//     const res = mockResponse();

//     authMiddleware(req, res, nextFunction);

//     expect(nextFunction).toHaveBeenCalled();
//     expect(req.user).toEqual({ _id: 'user123' }); // Ensure the user is attached to the request
//   });
// });
