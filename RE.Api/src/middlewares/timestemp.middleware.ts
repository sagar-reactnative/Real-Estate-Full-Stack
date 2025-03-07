import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        timestamp?: number;
    }
}

const timestempMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.timestamp = Date.now();
    next();
};

export default timestempMiddleware;
