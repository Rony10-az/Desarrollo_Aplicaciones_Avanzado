import bcrypt from 'bcryptjs';

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  failedAttempts: number;
  lockedUntil: number | null;
};

export const MAX_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000;

// Kept on `globalThis` so the data survives Next.js dev-mode hot reloads
// (each file edit would otherwise re-evaluate this module and wipe the Map).
// This is an in-memory store for the lab: it resets on every server restart
// and is never shared across server instances — swap for a real database
// for anything beyond local demo use.
declare global {
  var __userStore: Map<string, StoredUser> | undefined;
}

const store = globalThis.__userStore ?? new Map<string, StoredUser>();
globalThis.__userStore = store;

export function findUserByEmail(email: string) {
  return store.get(email.trim().toLowerCase());
}

export async function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (store.has(normalizedEmail)) {
    throw new Error('Ya existe una cuenta con este correo.');
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    failedAttempts: 0,
    lockedUntil: null,
  };

  store.set(normalizedEmail, user);
  return user;
}

export function isLocked(user: StoredUser) {
  return user.lockedUntil !== null && user.lockedUntil > Date.now();
}

export function lockRemainingMinutes(user: StoredUser) {
  if (!user.lockedUntil) return 0;
  return Math.max(1, Math.ceil((user.lockedUntil - Date.now()) / 60000));
}

export function verifyPassword(user: StoredUser, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}

export function registerFailedAttempt(user: StoredUser) {
  user.failedAttempts += 1;
  if (user.failedAttempts >= MAX_ATTEMPTS) {
    user.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }
}

export function resetAttempts(user: StoredUser) {
  user.failedAttempts = 0;
  user.lockedUntil = null;
}
