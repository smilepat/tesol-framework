"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Mock student data
const MOCK_STUDENTS = [
  { name: "김민수", progress: 85, quizzes: 12, avgScore: 88, weakWords: ["hypothesis", "consequence"] },
  { name: "이서연", progress: 72, quizzes: 10, avgScore: 76, weakWords: ["sustainable", "interpret"] },
  { name: "박지훈", progress: 95, quizzes: 15, avgScore: 92, weakWords: [] },
  { name: "최유진", progress: 45, quizzes: 5, avgScore: 65, weakWords: ["collaborate", "perspective", "hypothesis"] },
  { name: "정하은", progress: 68, quizzes: 8, avgScore: 71, weakWords: ["significant"] },
  { name: "강도윤", progress: 90, quizzes: 14, avgScore: 89, weakWords: ["consequence"] },
];

export default function StudentsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login"><Button className="mt-4">로그인</Button></Link>
      </div>
    );
  }

  const avgProgress = Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.progress, 0) / MOCK_STUDENTS.length);
  const avgScore = Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.avgScore, 0) / MOCK_STUDENTS.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teacher">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">학생 진도 관리</h1>
          <p className="text-sm text-gray-500">학생별 진행률, 퀴즈 성적, 약점 어휘 파악</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{MOCK_STUDENTS.length}</div>
                <p className="text-xs text-gray-500">전체 학생</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{avgProgress}%</div>
            <p className="text-xs text-gray-500">평균 진행률</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{avgScore}점</div>
            <p className="text-xs text-gray-500">평균 퀴즈 점수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">
              {MOCK_STUDENTS.filter(s => s.progress < 50).length}
            </div>
            <p className="text-xs text-gray-500">주의 필요 학생</p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">학생 목록</CardTitle>
          <CardDescription>데모 데이터입니다. Firebase 연동 후 실제 데이터로 전환됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_STUDENTS.map((student, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{student.name}</p>
                  {student.progress < 50 && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />주의
                    </Badge>
                  )}
                  {student.progress >= 90 && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />우수
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1">
                    <Progress value={student.progress} className="h-1.5" />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{student.progress}%</span>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-medium">{student.avgScore}점</p>
                <p className="text-xs text-gray-400">퀴즈 {student.quizzes}회</p>
              </div>
              {student.weakWords.length > 0 && (
                <div className="hidden md:flex gap-1 shrink-0">
                  {student.weakWords.slice(0, 2).map(w => (
                    <Badge key={w} variant="outline" className="text-xs text-orange-600">{w}</Badge>
                  ))}
                  {student.weakWords.length > 2 && (
                    <Badge variant="outline" className="text-xs">+{student.weakWords.length - 2}</Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
