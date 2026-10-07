import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getDatabase, Database } from "firebase/database";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Web app's Firebase configuration matching project ebl-pharmaceutical
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCr0ciKUI-CR9phUCYf0cPWqnzC0T4m_D0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ebl-pharmaceutical.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://ebl-pharmaceutical-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ebl-pharmaceutical",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ebl-pharmaceutical.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "281503980836",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:281503980836:web:701a2d92bcf1a616d827b1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-7W49PY9GCN",
};

// Initialize Firebase
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const database: Database = getDatabase(app);

// Safe Client-Side Analytics initialization
let analyticsInstance: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  });
}

export const analytics = analyticsInstance;
export default app;
