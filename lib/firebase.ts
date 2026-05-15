import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Solo inicializar en el browser — durante SSR/build las env vars no existen
// y las páginas admin son "use client" + force-dynamic, así que este código
// nunca se ejecuta en el servidor.
const app =
  typeof window !== "undefined"
    ? getApps().length
      ? getApp()
      : initializeApp(firebaseConfig)
    : null;

export const db = app ? getFirestore(app) : (null as never);
export const auth = app ? getAuth(app) : (null as never);
