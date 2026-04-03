import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, firestore, isFirebaseConfigured } from '../firebase';
import { FirebaseUser, UserProfile } from '../types/user.types';
import { safeStorage } from '../utils/safe-storage';

export class AuthService {
  private static readonly USER_KEY = 'app-dev-framework-current-user';

  /**
   * Sign in with Google via Firebase Auth
   * Falls back to mock if Firebase is not configured
   */
  static async signInWithGoogle(): Promise<FirebaseUser> {
    if (isFirebaseConfigured() && auth && googleProvider) {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const appUser = this.mapFirebaseUser(firebaseUser);

      // Save user profile to Firestore
      await this.saveUserToFirestore(appUser);

      // Cache locally
      safeStorage.setItem(this.USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    // Fallback: mock sign in
    return this.mockSignIn();
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    if (isFirebaseConfigured() && auth) {
      await firebaseSignOut(auth);
    }
    safeStorage.removeItem(this.USER_KEY);
  }

  /**
   * Listen to Firebase auth state changes
   */
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    if (isFirebaseConfigured() && auth) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const appUser = this.mapFirebaseUser(firebaseUser);
          safeStorage.setItem(this.USER_KEY, JSON.stringify(appUser));
          callback(appUser);
        } else {
          safeStorage.removeItem(this.USER_KEY);
          callback(null);
        }
      });
    }

    // Fallback: check localStorage
    const currentUser = this.getCurrentUser();
    callback(currentUser);
    return () => {}; // no-op unsubscribe
  }

  /**
   * Map Firebase User to app FirebaseUser type
   */
  private static mapFirebaseUser(user: User): FirebaseUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'student', // Default role, can be updated from Firestore
      createdAt: new Date(),
      lastActive: new Date(),
    };
  }

  /**
   * Save or update user profile in Firestore
   */
  private static async saveUserToFirestore(user: FirebaseUser): Promise<void> {
    if (!isFirebaseConfigured() || !firestore) return;

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update lastActive
        await setDoc(userRef, {
          lastActive: serverTimestamp(),
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true });

        // Restore role from Firestore
        const data = userDoc.data();
        if (data?.role) {
          user.role = data.role;
        }
      } else {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'student',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
    }
  }

  /**
   * Get current authenticated user from cache
   */
  static getCurrentUser(): FirebaseUser | null {
    try {
      const saved = safeStorage.getItem(this.USER_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        user.createdAt = new Date(user.createdAt);
        user.lastActive = new Date(user.lastActive);
        return user;
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get user profile
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    const user = this.getCurrentUser();
    if (!user) return null;

    // Try to get from Firestore for latest data
    if (isFirebaseConfigured() && firestore) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          return {
            uid: user.uid,
            email: data.email || user.email,
            displayName: data.displayName || user.displayName,
            photoURL: data.photoURL || user.photoURL,
            role: data.role || user.role,
            createdAt: data.createdAt?.toDate() || user.createdAt,
            lastActive: data.lastActive?.toDate() || user.lastActive,
          };
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
    };
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = {
      ...currentUser,
      ...updates,
      lastActive: new Date(),
    };

    // Update Firestore
    if (isFirebaseConfigured() && firestore) {
      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        await setDoc(userRef, {
          ...updates,
          lastActive: serverTimestamp(),
        }, { merge: true });
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }

    safeStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(role: 'student' | 'teacher'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Get user role
   */
  static getUserRole(): 'student' | 'teacher' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  static isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  static isStudent(): boolean {
    return this.hasRole('student');
  }

  /**
   * Set user role (admin function, updates Firestore)
   */
  static async setUserRole(role: 'student' | 'teacher'): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    user.role = role;
    safeStorage.setItem(this.USER_KEY, JSON.stringify(user));

    if (isFirebaseConfigured() && firestore) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, { role }, { merge: true });
      } catch (error) {
        console.error('Error setting user role:', error);
      }
    }

    return true;
  }

  /**
   * Refresh user session
   */
  static async refreshSession(): Promise<FirebaseUser | null> {
    const user = this.getCurrentUser();
    if (user) {
      user.lastActive = new Date();
      safeStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    return user;
  }

  /**
   * Clear all authentication data
   */
  static clearAllAuthData(): void {
    safeStorage.removeItem(this.USER_KEY);
  }

  /**
   * Mock sign in fallback (when Firebase is not configured)
   */
  private static async mockSignIn(): Promise<FirebaseUser> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser: FirebaseUser = {
      uid: 'mock-user-' + Date.now(),
      email: 'teacher@example.com',
      displayName: 'Demo Teacher',
      photoURL: '',
      role: 'teacher',
      createdAt: new Date(),
      lastActive: new Date(),
    };

    safeStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
}
