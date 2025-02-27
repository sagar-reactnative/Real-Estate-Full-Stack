import express, { Express, Request, Response } from 'express';
import { PORT } from './config/env';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
