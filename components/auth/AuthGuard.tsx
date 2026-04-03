'use client';

import { ProtectedRoute as AuthProtectedRoute } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher';
  fallback?: React.ReactNode;
}

/**
 * Wrapper component for route protection
 * Uses the ProtectedRoute component from AuthContext
 */
export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  return (
    <AuthProtectedRoute requiredRole={requiredRole} fallback={fallback}>
      {children}
    </AuthProtectedRoute>
  );
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    requiredRole?: 'student' | 'teacher';
    fallback?: React.ReactNode;
  }
) {
  return function AuthProtectedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };
}
