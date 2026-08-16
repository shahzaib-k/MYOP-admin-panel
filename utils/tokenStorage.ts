import type { Admin } from "@/types";

// localStorage holds the full session for the client; a plain (non-httpOnly)
// cookie mirrors just the token so the Next.js middleware can redirect
// unauthenticated visitors before a protected page renders. This is a
// convenience redirect only — the backend's `protect`/`restrictTo("admin")`
// middleware is the real authorization boundary (see AGENTS.md).
const TOKEN_KEY = "myop_admin_token";
const USER_KEY = "myop_admin_user";
const COOKIE_NAME = "myop_admin_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // matches backend JWT_EXPIRES_IN default

const isBrowser = () => typeof window !== "undefined";

export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): Admin | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Admin;
  } catch {
    return null;
  }
};

export const setSession = (token: string, user: Admin): void => {
  if (!isBrowser()) return;

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const clearSession = (): void => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};
