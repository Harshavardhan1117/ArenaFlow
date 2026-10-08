import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import configFile from '../firebase-applet-config.json';

// Configuration mapping with environment variable support and config file fallback
export const firebaseConfig = {
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY) || import.meta.env?.VITE_FIREBASE_API_KEY || configFile.apiKey,
  authDomain: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_AUTH_DOMAIN) || import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || configFile.authDomain,
  projectId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_PROJECT_ID) || import.meta.env?.VITE_FIREBASE_PROJECT_ID || configFile.projectId,
  appId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_APP_ID) || import.meta.env?.VITE_FIREBASE_APP_ID || configFile.appId,
  storageBucket: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_STORAGE_BUCKET) || import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || configFile.storageBucket,
  messagingSenderId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || configFile.messagingSenderId,
  firestoreDatabaseId: configFile.firestoreDatabaseId || '(default)'
};

// Validate that required Firebase configuration keys are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  console.error('Firebase configuration error: Missing required keys:', missingKeys);
}

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID (CRITICAL)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Test Connection Helper
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted. Local data fallback will be active.');
    } else {
      console.log('Firestore connection ping handled.');
    }
    return false;
  }
}
