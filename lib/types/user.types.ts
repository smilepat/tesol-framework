export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'student' | 'teacher';
  createdAt: Date;
  lastActive: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'teacher';
  createdAt: Date;
  lastActive: Date;
}

// Re-export from progress.types to avoid breaking imports
export type { UserProgress } from './progress.types';

export interface UserSession {
  user: FirebaseUser;
  isAuthenticated: boolean;
  loading: boolean;
}
