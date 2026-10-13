import { Request, Response } from 'express';

import { users } from '../db-data';
import { logger } from '../logger';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { signAuthToken } from '../services/jwt.service';
import { hashPassword } from '../services/password.service';
import { delay } from '../utils/delay';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Artificial UX delay: the mock auth flow otherwise resolves too fast for the frontend's
// loading indicator to be visible.
const RESPONSE_DELAY_MS = 800;

export async function signUpRoute(request: Request, response: Response) {
  await delay(RESPONSE_DELAY_MS);

  const email = request.body?.email;
  const password = request.body?.password;

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    logger.warn({ body: request.body }, 'Rejected sign-up request with invalid body.');
    response.status(400).json({ message: 'Both "email" and "password" are required.' });
    return;
  }

  if (!EMAIL_PATTERN.test(email)) {
    logger.warn({ email }, 'Rejected sign-up request with an invalid email format.');
    response.status(400).json({ message: 'Enter a valid email address.' });
    return;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    logger.warn({ email }, 'Rejected sign-up request with a too-short password.');
    response
      .status(400)
      .json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    return;
  }

  const existingUser = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    logger.warn({ email }, 'Rejected sign-up request for an email that is already registered.');
    response.status(409).json({ message: 'Email is already registered.' });
    return;
  }

  const passwordHash = await hashPassword(password);

  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
  };

  users.push(user);

  const token = signAuthToken({ sub: user.id, email: user.email });

  logger.info({ userId: user.id }, 'User account created.');

  const payload: AuthResponse = {
    token,
    user: { id: user.id, email: user.email },
  };

  response.status(201).json(payload);
}
