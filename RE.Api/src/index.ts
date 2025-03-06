import express, { Express, Request, Response } from 'express';
import { PORT } from './config/env';
import { ConsoleHelpers } from './helpers/console-helpers';
import { connectDatabase, seedDatabase } from './database/database';
import propertyRoutes from './routes/property.routes';
import LoggingMiddleware from './middlewares/logging.middleware';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(LoggingMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Real Estate Full Stack API');
});

app.get('/seed-database', async (req: Request, res: Response) => {
    await seedDatabase();
    res.json({
        infoMessage: 'Database Seed Completed.'
    });
});

app.use('/api/v1/properties', propertyRoutes);

app.listen(PORT, async (): Promise<void> => {
    await connectDatabase();
    ConsoleHelpers.logMessage('Index', `Server running at http://localhost:${PORT}`);
});
