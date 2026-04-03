'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProgressAnalytics } from '@/hooks/useProgressAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { overallCompletion, stepCompletions, totalTasks, completedTasks } = useProgressAnalytics();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback className="text-lg">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.displayName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                  {user.role === 'teacher' ? 'Teacher' : 'Student'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Joined {user.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Your overall learning progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">{overallCompletion}%</span>
            </div>
            <Progress value={overallCompletion} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Step Progress</h3>
            {Object.entries(stepCompletions).map(([stepId, completion]) => (
              <div key={stepId} className="flex items-center justify-between text-sm">
                <span className="capitalize">
                  {stepId.replace('step-', '').replace(/-/g, ' ')}
                </span>
                <span className="text-gray-600">{completion}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full justify-start">
              Back to Home
            </Button>
          </Link>
          {user.role === 'teacher' && (
            <Link href="/teacher">
              <Button variant="outline" className="w-full justify-start">
                Teacher Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.refresh()}
          >
            Refresh Data
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Started learning journey</p>
                <p className="text-xs text-gray-500">{user.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Last active</p>
                <p className="text-xs text-gray-500">{user.lastActive.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
