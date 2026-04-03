import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Helper to check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey &&
           firebaseConfig.apiKey !== 'placeholder-api-key' &&
           firebaseConfig.projectId &&
           firebaseConfig.authDomain);
};

// Lazy-initialize Firebase to avoid errors during SSR/build
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _firestore: Firestore | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

function getApp(): FirebaseApp {
  if (!_app) {
    _app = initializeApp(firebaseConfig);
  }
  return _app;
}

// Export Firebase instances as getters (lazy initialization)
export const app = typeof window !== 'undefined' && isFirebaseConfigured() ? getApp() : (null as unknown as FirebaseApp);

export const auth: Auth = typeof window !== 'undefined' && isFirebaseConfigured()
  ? (() => { if (!_auth) _auth = getAuth(getApp()); return _auth; })()
  : (null as unknown as Auth);

export const googleProvider: GoogleAuthProvider = typeof window !== 'undefined' && isFirebaseConfigured()
  ? (() => { if (!_googleProvider) _googleProvider = new GoogleAuthProvider(); return _googleProvider; })()
  : (null as unknown as GoogleAuthProvider);

export const firestore: Firestore = typeof window !== 'undefined' && isFirebaseConfigured()
  ? (() => { if (!_firestore) _firestore = getFirestore(getApp()); return _firestore; })()
  : (null as unknown as Firestore);

// Server-side compatibility
export const getFirebaseConfig = () => {
  // Only return config on client side for security
  if (typeof window !== 'undefined') {
    return firebaseConfig;
  }
  return null;
};
