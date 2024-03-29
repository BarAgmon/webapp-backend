import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user: { _id: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err);
        console.log(err?.name == "TokenExpiredError")
        if (err?.name == "TokenExpiredError"){
            return res.sendStatus(401);
        }
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user as { _id: string };
        
        // Pass control to the next middleware in the stack if the token is successfully verified
        next();
    });
}

export default authMiddleware;