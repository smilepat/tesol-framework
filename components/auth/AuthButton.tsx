'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AuthButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function AuthButton({ variant = 'default', size = 'default', className = '' }: AuthButtonProps) {
  const { user, isAuthenticated, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        <span className="sr-only">Loading...</span>
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={signIn}
        className={className}
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.photoURL} alt={user?.displayName} />
        <AvatarFallback>
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:block text-sm">
        <div className="font-medium">{user?.displayName}</div>
        <div className="text-xs text-gray-500">{user?.email}</div>
      </div>
      <Button
        variant={variant}
        size={size}
        onClick={signOut}
        className={className}
      >
        Sign Out
      </Button>
    </div>
  );
}
