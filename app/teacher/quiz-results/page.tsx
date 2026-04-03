"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, Target, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

// Mock quiz result data
const MOCK_RESULTS = [
  { id: 1, title: "Unit 3 복습 퀴즈", date: "2026-04-01", students: 28, avgScore: 82, highScore: 100, lowScore: 45, cefrLevel: "B2", questionCount: 10 },
  { id: 2, title: "중간고사 대비", date: "2026-03-28", students: 32, avgScore: 75, highScore: 95, lowScore: 40, cefrLevel: "B1", questionCount: 20 },
  { id: 3, title: "어휘 진단 테스트", date: "2026-03-25", students: 30, avgScore: 68, highScore: 90, lowScore: 30, cefrLevel: "B2", questionCount: 15 },
  { id: 4, title: "Unit 2 숙제", date: "2026-03-20", students: 25, avgScore: 88, highScore: 100, lowScore: 60, cefrLevel: "A2", questionCount: 10 },
];

const CEFR_ACCURACY = [
  { level: "A1", accuracy: 95, total: 20 },
  { level: "A2", accuracy: 88, total: 35 },
  { level: "B1", accuracy: 76, total: 50 },
  { level: "B2", accuracy: 62, total: 45 },
  { level: "C1", accuracy: 48, total: 15 },
];

const DIFFICULT_WORDS = [
  { word: "hypothesis", attempts: 45, accuracy: 38 },
  { word: "consequence", attempts: 42, accuracy: 45 },
  { word: "sustainable", attempts: 38, accuracy: 52 },
  { word: "interpret", attempts: 35, accuracy: 55 },
  { word: "perspective", attempts: 40, accuracy: 58 },
];

export default function QuizResultsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login"><Button className="mt-4">로그인</Button></Link>
      </div>
    );
  }

  const totalQuizzes = MOCK_RESULTS.length;
  const avgOverall = Math.round(MOCK_RESULTS.reduce((sum, r) => sum + r.avgScore, 0) / totalQuizzes);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teacher">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">퀴즈 결과 분석</h1>
          <p className="text-sm text-gray-500">정답률, 난이도별 분석, CEFR 레벨별 통계</p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <BarChart3 className="h-5 w-5 text-blue-600 mb-1" />
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-gray-500">총 퀴즈 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Target className="h-5 w-5 text-green-600 mb-1" />
            <div className="text-2xl font-bold">{avgOverall}점</div>
            <p className="text-xs text-gray-500">전체 평균</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <TrendingUp className="h-5 w-5 text-purple-600 mb-1" />
            <div className="text-2xl font-bold">+5%</div>
            <p className="text-xs text-gray-500">지난 달 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Clock className="h-5 w-5 text-orange-600 mb-1" />
            <div className="text-2xl font-bold">{MOCK_RESULTS[0].date}</div>
            <p className="text-xs text-gray-500">최근 퀴즈</p>
          </CardContent>
        </Card>
      </div>

      {/* CEFR Level Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CEFR 레벨별 정답률</CardTitle>
          <CardDescription>레벨이 높을수록 정답률이 낮아지는 패턴을 보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CEFR_ACCURACY.map((item) => (
            <div key={item.level} className="flex items-center gap-3">
              <Badge variant="secondary" className="w-10 justify-center text-xs">{item.level}</Badge>
              <div className="flex-1">
                <Progress value={item.accuracy} className="h-3" />
              </div>
              <span className="text-sm font-medium w-12 text-right">{item.accuracy}%</span>
              <span className="text-xs text-gray-400 w-16 text-right">{item.total}문항</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficult Words */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">어려운 단어 Top 5</CardTitle>
          <CardDescription>정답률이 낮은 단어입니다. 추가 학습이 필요합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DIFFICULT_WORDS.map((word, i) => (
              <div key={word.word} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm font-bold text-gray-400 w-6">{i + 1}</span>
                <span className="text-sm font-medium flex-1">{word.word}</span>
                <span className="text-xs text-gray-500">{word.attempts}회 출제</span>
                <Badge variant={word.accuracy < 50 ? "destructive" : "secondary"} className="text-xs">
                  {word.accuracy}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">최근 퀴즈</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_RESULTS.map((result) => (
            <div key={result.id} className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{result.title}</p>
                <p className="text-xs text-gray-500">{result.date} · {result.students}명 응시 · {result.questionCount}문항</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">{result.avgScore}점</p>
                <p className="text-xs text-gray-400">{result.lowScore}~{result.highScore}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">{result.cefrLevel}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
