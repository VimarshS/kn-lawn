import * as argon2 from 'argon2';

/** Turns a password into a one-way hash that is safe to store. */
export async function hashPassword(plainPassword: string): Promise<string> {
  return argon2.hash(plainPassword, { type: argon2.argon2id });
}

/** True only if the password matches the stored hash. */
export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    // A damaged or unknown hash must never crash a login. Treat it as "no match".
    return false;
  }
}