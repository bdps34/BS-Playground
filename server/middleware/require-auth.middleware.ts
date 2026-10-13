import { NextFunction, Request, Response } from 'express';

import { logger } from '../logger';
import { verifyAuthToken } from '../services/jwt.service';

const BEARER_PREFIX = 'Bearer ';

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    logger.warn('Rejected request with missing or malformed Authorization header.');
    response.status(401).json({ message: 'Authentication is required.' });
    return;
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length);

  try {
    const payload = verifyAuthToken(token);
    request.userId = payload.sub;
    next();
  } catch (error) {
    logger.warn({ err: error }, 'Rejected request with an invalid or expired token.');
    response.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}
