'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

interface UserMenuProps {
  trigger?: 'button' | 'avatar';
  className?: string;
}

export function UserMenu({ trigger = 'avatar', className = '' }: UserMenuProps) {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="sm" className={className}>
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderTrigger = () => {
    if (trigger === 'button') {
      return (
        <Button variant="ghost" size="sm" className={className}>
          <span>{user?.displayName}</span>
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      );
    }

    return (
      <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-500">
        <AvatarImage src={user?.photoURL} alt={user?.displayName} />
        <AvatarFallback>
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400">
              Role: {user?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <div className="flex items-center">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
          </Link>
        </DropdownMenuItem>
        {user?.role === 'teacher' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/teacher">
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Teacher Dashboard
                </div>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <div className="flex items-center text-red-600">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
