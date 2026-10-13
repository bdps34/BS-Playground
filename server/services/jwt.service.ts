import jwt from 'jsonwebtoken';

import { AuthTokenPayload } from '../models/auth-token-payload.model';

const JWT_EXPIRES_IN = '1h';

export function signAuthToken(payload: AuthTokenPayload) {
  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string) {
  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  return jwt.verify(token, secret) as AuthTokenPayload;
}
