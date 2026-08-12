import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { loadOpenApiSpec } from './config/swagger';
import type { AppContainer } from './container';
import { correlationIdMiddleware } from './middleware/correlationId.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFoundHandler.middleware';
import { requestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { createApiRouter } from './routes';

export function createApp(container: AppContainer): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, preflightContinue: true }));
  app.use(express.json());
  app.use(correlationIdMiddleware);
  app.use(requestLoggerMiddleware);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const openApiSpec = loadOpenApiSpec();
  const docsCsp = helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
      },
    },
  });
  app.get('/api-docs.json', (_req, res) => {
    res.status(200).json(openApiSpec);
  });
  app.use('/api-docs', docsCsp, swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use('/api/v1', createApiRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandlerMiddleware);

  return app;
}
