import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXulfJ2H3jgxq0Pb1BEKWtjgP9lomIuAA",
  authDomain: "ai-interview-agent-fe7ad.firebaseapp.com",
  projectId: "ai-interview-agent-fe7ad",
  storageBucket: "ai-interview-agent-fe7ad.appspot.com",
  messagingSenderId: "879935577606",
  appId: "1:879935577606:web:b71cbd372fcca9ced02d87",
  measurementId: "G-Z6615K03RQ"
};

let auth = null;
let analytics = null;
let firebaseInitError = null;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may fail in non-browser or restricted environments
    analytics = null;
  }
  console.log("[firebase] initialized");
} catch (err) {
  // prevent uncaught FirebaseError from breaking the app
  console.error("[firebase] initialization failed:", err);
  firebaseInitError = err;
  auth = null;
  analytics = null;
}

export { auth, analytics, firebaseInitError };