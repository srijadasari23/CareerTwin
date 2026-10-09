import express from 'express';
import { apiRouter } from './routes';

export function expressApiPlugin() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  return {
    name: 'express-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(app);
    },
  };
}
