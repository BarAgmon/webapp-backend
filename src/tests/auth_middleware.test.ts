import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyCallback, Secret } from 'jsonwebtoken';
import authMiddleware, {AuthRequest}  from '../common/auth_middleware';
import { now } from 'mongoose';
import { error } from 'console';

describe('authMiddleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  // Mock JWT verification function
  jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    verify: jest.fn(),
  }));

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    req = {
      headers: {},
      body: {},
      user: { _id: "someUserId" },
    };
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(), // Add this line
    };
    
    next = jest.fn();
  });

  test('token is null -> returned 403',  () => {
    authMiddleware(req as AuthRequest, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('TokenExpiredError -> return 401',  () => {

    const token = jwt.sign( { hello: "world" }, process.env.JWT_SECRET, { expiresIn: '0ms'});
    req.headers['authorization'] = 'Bearer ' + token;
    
    authMiddleware(req as AuthRequest, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);

  });

  test('err occurred -> return 403', () => {
    req.headers['authorization'] = 'Bearer badToken';  
    authMiddleware(req as AuthRequest, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('success case', () => {
    const token = jwt.sign( { hello: "world" }, process.env.JWT_SECRET, { expiresIn: '360d'})
    req.headers['authorization'] = 'Bearer ' + token;
    authMiddleware(req as AuthRequest, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
