import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ExceptionLog } from '../database/models/exception-log.model';

const globalErrorMiddleware: ErrorRequestHandler = async (err, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    await ExceptionLog.create({
        message: err.message,
        method: req.method,
        url: req.baseUrl + req.url,
        timestamp: req.timestamp,
        stack: err.stack
    });

    res.status(500).json({
        success: false,
        message: 'Internal server error occurred, please contact support.'
    });
};

export default globalErrorMiddleware;
