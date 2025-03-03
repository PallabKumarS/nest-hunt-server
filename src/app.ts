/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { UserRoutes } from './app/modules/user/user.routes';
import { AuthRoutes } from './app/modules/auth/auth.routes';
import { ListingRoutes } from './app/modules/listing/listing.routes';
import { RequestRoutes } from './app/modules/request/request.routes';

const app: Application = express();

// parsers
app.use(
  cors({
    origin: [
      (config.local_client as string) ||
        'https://pks-nest-hunt-client.vercel.app',
      (config.client as string) || 'http://localhost:3000',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// all routes here
app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/listings', ListingRoutes);
app.use('/api/requests', RequestRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>🚀 Server is running successfully! 🚀</h1>
    </body>
    </html>
  `);
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
