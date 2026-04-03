'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FirebaseUser } from '../lib/types/user.types';
import { AuthService } from '../lib/services/auth.service';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: 'student' | 'teacher') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const newUser = await AuthService.signInWithGoogle();
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await AuthService.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user session
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const refreshedUser = await AuthService.refreshSession();
      setUser(refreshedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refresh failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check user role
  const hasRole = useCallback((role: 'student' | 'teacher') => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signIn,
      signOut,
      refreshUser,
      isAuthenticated: user !== null,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback = null
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this content
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don&apos;t have permission to access this content.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
