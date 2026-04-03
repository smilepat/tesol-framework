// Re-export Firebase exports
export { auth, googleProvider, firestore, app, isFirebaseConfigured, getFirebaseConfig } from './config';

// Export types
export type { FirebaseApp } from 'firebase/app';
export type { Auth, GoogleAuthProvider, User, UserCredential, AuthError } from 'firebase/auth';
export type { Firestore, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
