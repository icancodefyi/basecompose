/**
 * Authentication helper utilities
 * Provides common auth operations and validations
 */

import { Session } from "next-auth";

/**
 * Check if session is valid and user is authenticated
 */
export function isSessionValid(session: Session | null): boolean {
  if (!session?.user?.email || !session?.user?.id) {
    return false;
  }
  
  // Additional validation - ensure email and id are not falsy strings
  const email = session.user.email as string;
  const id = (session.user as any).id as string;
  
  return email.length > 0 && id.length > 0;
}

/**
 * Get user ID from session safely
 */
export function getUserIdFromSession(session: Session | null): string | null {
  if (!session?.user || !("id" in session.user)) {
    return null;
  }
  const id = (session.user as any).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/**
 * Get user email from session safely
 */
export function getUserEmailFromSession(session: Session | null): string | null {
  const email = session?.user?.email;
  return typeof email === "string" && email.length > 0 ? email : null;
}

/**
 * Check if two sessions represent the same user
 * Used to detect if user has changed between page loads
 */
export function isSameUser(
  previousSession: Session | null,
  currentSession: Session | null
): boolean {
  if (!previousSession || !currentSession) {
    return false;
  }

  const prevId = getUserIdFromSession(previousSession);
  const currentId = getUserIdFromSession(currentSession);
  const prevEmail = getUserEmailFromSession(previousSession);
  const currentEmail = getUserEmailFromSession(currentSession);

  // Both ID and email must match to be considered the same user
  return prevId === currentId && prevEmail === currentEmail;
}

/**
 * Validate user data consistency
 * Prevents account linking attacks by checking email consistency
 */
export function validateUserConsistency(
  sessionUser: any,
  databaseUser: any
): boolean {
  if (!sessionUser?.email || !databaseUser?.email) {
    return false;
  }
  // Email should never change for a user
  return sessionUser.email === databaseUser.email;
}

/**
 * Check if user needs to be re-authenticated
 */
export function shouldRefreshSession(lastRefresh: number): boolean {
  const THIRTY_SECONDS = 30 * 1000;
  return Date.now() - lastRefresh > THIRTY_SECONDS;
}

/**
 * Format session data for safe client-side use
 */
export function formatSessionForClient(session: Session | null) {
  if (!session?.user) {
    return null;
  }

  return {
    id: (session.user as any).id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };
}

/**
 * Clear sensitive session data
 */
export function clearSensitiveSessionData(session: any): any {
  if (!session) return null;

  const { user, ...rest } = session;
  return {
    ...rest,
    user: {
      email: user?.email,
      name: user?.name,
      image: user?.image,
    },
  };
}

/**
 * Detect session anomalies (e.g., different user suddenly logged in)
 */
export function detectSessionAnomaly(
  oldSession: Session | null,
  newSession: Session | null
): boolean {
  if (!oldSession || !newSession) {
    return false;
  }

  const oldEmail = getUserEmailFromSession(oldSession);
  const newEmail = getUserEmailFromSession(newSession);

  // If email changed unexpectedly, it's an anomaly
  if (oldEmail && newEmail && oldEmail !== newEmail) {
    console.warn(
      `[AUTH ANOMALY] Email changed unexpectedly: ${oldEmail} -> ${newEmail}`
    );
    return true;
  }

  const oldId = getUserIdFromSession(oldSession);
  const newId = getUserIdFromSession(newSession);

  // If ID changed unexpectedly, it's an anomaly
  if (oldId && newId && oldId !== newId) {
    console.warn(
      `[AUTH ANOMALY] User ID changed unexpectedly: ${oldId} -> ${newId}`
    );
    return true;
  }

  return false;
}
