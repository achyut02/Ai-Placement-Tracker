import {
  createUserWithEmailAndPassword as fbCreateUser,
  signInWithEmailAndPassword as fbSignIn,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Helper: return a rejected promise when Firebase isn't initialized
 */
function notInitializedPromise() {
  return Promise.reject(new Error("Firebase not initialized. Auth is disabled."));
}

/**
 * register(email, password) -> Promise<UserCredential>
 */
export function register(email, password) {
  if (!auth) return notInitializedPromise();
  return fbCreateUser(auth, email, password);
}

/**
 * login(email, password) -> Promise<UserCredential>
 */
export function login(email, password) {
  if (!auth) return notInitializedPromise();
  return fbSignIn(auth, email, password);
}

/**
 * logout() -> Promise<void>
 */
export function logout() {
  if (!auth) return Promise.resolve(); // already signed out / no-op
  return fbSignOut(auth);
}

/**
 * subscribeToAuthChanges(callback) -> unsubscribe function
 * callback receives (user) where user is Firebase User or null
 */
export function subscribeToAuthChanges(callback) {
  if (!auth) {
    // call back with null immediately and return noop unsubscribe
    try { callback(null); } catch (e) {}
    return () => {};
  }
  return fbOnAuthStateChanged(auth, callback);
}