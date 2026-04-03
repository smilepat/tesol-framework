'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { hasRole } = useAuth();

  // Redirect if not a teacher
  if (!hasRole('teacher')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to access this dashboard.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Badge variant="default">Teacher Role</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Vocabulary Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Vocabulary Management</CardTitle>
            <CardDescription>
              Manage your vocabulary database and sync with Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/teacher/vocabulary">
              <Button className="w-full">Manage Vocabulary</Button>
            </Link>
            <Link href="/builder">
              <Button variant="outline" className="w-full">
                Quiz Builder
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Student Progress */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>
              View and track student learning progress and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/teacher/students">
              <Button className="w-full">View All Students</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quiz Results */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              Review student quiz results and learning analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/teacher/quiz-results">
              <Button className="w-full">View Quiz Results</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Create and manage learning content and exercises
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Manage Content</Button>
            <Button variant="outline" className="w-full">
              Create New Exercise
            </Button>
          </CardContent>
        </Card>

        {/* Class Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              Manage classes, assignments, and due dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Manage Classes</Button>
            <Button variant="outline" className="w-full">
              Create Assignment
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Account Settings</Button>
            <Button variant="outline" className="w-full">
              Integration Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-gray-500">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">All running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vocabulary Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-500">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Quiz Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-gray-500">+3% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">New vocabulary words added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Google Sheets synced successfully</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">New student registered</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
