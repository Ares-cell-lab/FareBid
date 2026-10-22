// Single shared Firebase entrypoint - every file in the app should import
// from HERE instead of calling initializeApp() again elsewhere.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgkBS5QZhr3TuIIBhLi_PJNRK4rsWcuQk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fare-bid-b240f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fare-bid-b240f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fare-bid-b240f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "609200505761",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:609200505761:web:75fa75e6ce14af23b7c1e0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PSQ7SX63VB",
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => key !== "measurementId" && !value)
  .map(([key]) => key);

if (missingKeys.length) {
  console.warn(
    `Missing Firebase config values: ${missingKeys.join(", ")}. ` +
    `Ensure environment variables or fallback values are configured.`
  );
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
