import { createApp } from './app';
import { createContainer } from './container';
import { env } from './config/env';
import { logger } from './utils/logger';

const container = createContainer();
const app = createApp(container);

app.listen(env.port, () => {
  logger.info('server_started', { port: env.port, nodeEnv: env.nodeEnv });
});
