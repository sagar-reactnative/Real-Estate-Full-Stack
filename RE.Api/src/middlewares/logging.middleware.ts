import { NextFunction, Request, Response } from 'express';
import { ConsoleHelpers } from '../helpers/console-helpers';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', function () {
        ConsoleHelpers.logMessage('Logger', `${req.method} ${req.baseUrl}${req.url} ${res.statusCode} ${res.statusMessage}`);
    });

    next();
};

export default loggingMiddleware;
