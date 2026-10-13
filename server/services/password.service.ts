import argon2 from 'argon2';

const ARGON2ID_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(password: string) {
  return await argon2.hash(password, ARGON2ID_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return await argon2.verify(passwordHash, password);
}
