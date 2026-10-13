import { Request, Response } from 'express';

import { users } from '../db-data';
import { logger } from '../logger';
import { AuthResponse } from '../models/auth-response.model';
import { signAuthToken } from '../services/jwt.service';
import { verifyPassword } from '../services/password.service';
import { delay } from '../utils/delay';

// A hash of an arbitrary password with no corresponding user, used only to give an
// unknown-email request the same Argon2 cost as a real one (see below). Independent
// of any real user record, so it stays valid even if `users` changes shape or is empty.
const MOCK_PASSWORD_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$vxAhVBQszV5c6vu1lfXxew$nsvZ1EyDdEg/FURAmfda5sk20gQU3h3xNdoMzJjHcYw';

// Artificial UX delay: the mock auth flow otherwise resolves too fast for the frontend's
// loading indicator to be visible.
const RESPONSE_DELAY_MS = 800;

export async function signInRoute(request: Request, response: Response) {
  await delay(RESPONSE_DELAY_MS);

  const email = request.body?.email;
  const password = request.body?.password;

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    logger.warn({ body: request.body }, 'Rejected sign-in request with invalid body.');
    response.status(400).json({ message: 'Both "email" and "password" are required.' });
    return;
  }

  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  // Always run a hash comparison, even for an unknown email, using a stand-in hash so
  // that the response time doesn't reveal whether the email exists (timing side-channel).
  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? MOCK_PASSWORD_HASH);

  if (!user || !passwordMatches) {
    logger.warn({ email }, 'Sign-in attempt failed.');
    response.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = signAuthToken({ sub: user.id, email: user.email });

  logger.info({ userId: user.id }, 'User signed in.');

  const payload: AuthResponse = {
    token,
    user: { id: user.id, email: user.email },
  };

  response.json(payload);
}
