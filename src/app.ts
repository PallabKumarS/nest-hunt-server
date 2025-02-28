/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parsers
app.use(
  cors({
    origin: [
      (config.local_client as string) ||
        'https://pks-bike-store-client.vercel.app',
      (config.client as string) || 'http://localhost:5173',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());


const test = (req: Request, res: Response) => {
  res.send('Server is running');
};

app.get('/', test);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
