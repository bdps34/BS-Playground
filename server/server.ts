import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { logger } from './logger';
import { requireAuth } from './middleware/require-auth.middleware';
import { continueConversationRoute } from './routes/continue-conversation.route';
import { getChatConversationRoute } from './routes/get-chat-conversation.route';
import { getChatHistoryRoute } from './routes/get-chat-history.route';
import { rootRoute } from './routes/root.route';
import { signInRoute } from './routes/sign-in.route';
import { signUpRoute } from './routes/sign-up.route';
import { startConversationRoute } from './routes/start-conversation.route';

const app = express();
const port = Number(process.env['PORT']) || 9000;
const corsOrigin = process.env['CORS_ORIGIN'];

app.use(helmet());

if (corsOrigin) {
  app.use(cors({ origin: corsOrigin }));
  logger.info({ corsOrigin }, 'CORS enabled');
}

app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '10kb' }));

app.get('/', rootRoute);
app.get('/api/get-chat-history', requireAuth, getChatHistoryRoute);
app.get('/api/get-chat-conversation/:id', requireAuth, getChatConversationRoute);
app.post('/api/start-conversation', requireAuth, startConversationRoute);
app.post('/api/continue-conversation', requireAuth, continueConversationRoute);
app.post('/api/sign-in', signInRoute);
app.post('/api/sign-up', signUpRoute);

app.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
