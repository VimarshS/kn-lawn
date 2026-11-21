import * as argon2 from 'argon2';

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;

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

// Text patterns that appear in a huge share of guessed passwords.
const OBVIOUS_PARTS = ['password', 'qwerty', '123456', 'abcdef', 'letmein', 'knlawn'];

/** Returns a message describing what is wrong with a password, or null if it is acceptable. */
export function checkPasswordStrength(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (/^[0-9]+$/.test(password)) {
    return 'Password cannot be only digits. Use a passphrase of several unrelated words.';
  }
  if (new Set(password).size < 6) {
    return 'Password uses too few different characters.';
  }
  const lower = password.toLowerCase();
  if (OBVIOUS_PARTS.some((part) => lower.includes(part))) {
    return 'Password contains a very common pattern. Use several unrelated words instead.';
  }
  return null;
}