"use client";

import { useState } from "react";
import { SAMPLE_STUDENT_RESPONSES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoContainer } from "@/components/shared/demo-container";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Save,
  BarChart3,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";

export function Step5Feedback() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">결과 표시 패턴</TabsTrigger>
          <TabsTrigger value="logging">기록 저장</TabsTrigger>
          <TabsTrigger value="analytics">학습 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <ResultPatterns />
        </TabsContent>
        <TabsContent value="logging">
          <LoggingDemo />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResultPatterns() {
  const mockResults = [
    { word: "environment", userAnswer: "환경", correctAnswer: "환경", isCorrect: true },
    { word: "significant", userAnswer: "중요한", correctAnswer: "중요한, 의미 있는", isCorrect: true },
    { word: "hypothesis", userAnswer: "가정", correctAnswer: "가설", isCorrect: false },
    { word: "collaborate", userAnswer: "협력하다", correctAnswer: "협력하다", isCorrect: true },
    { word: "consequence", userAnswer: "결론", correctAnswer: "결과, 영향", isCorrect: false },
  ];

  const score = mockResults.filter((r) => r.isCorrect).length;
  const total = mockResults.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <DemoContainer
      title="퀴즈 결과 표시"
      description="학생에게 보여줄 결과 화면의 다양한 패턴입니다."
      color={{
        bgLight: "bg-pink-50",
        border: "border-pink-300",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      }}
    >
      <div className="space-y-4">
        {/* Score Summary */}
        <Card className={percentage >= 60 ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold mb-1">
              {score} / {total}
            </p>
            <p className="text-sm text-gray-600">정답률 {percentage}%</p>
            <Progress value={percentage} className="mt-3 h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {percentage >= 80
                ? "훌륭합니다! 대부분의 단어를 잘 알고 있습니다."
                : percentage >= 60
                  ? "잘하고 있습니다. 틀린 단어를 복습해보세요."
                  : "틀린 단어를 중심으로 다시 학습해보세요."}
            </p>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <div className="space-y-2">
          {mockResults.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                r.isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {r.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">{r.word}</p>
                  <p className="text-xs text-gray-500">
                    내 답: {r.userAnswer}
                  </p>
                </div>
              </div>
              {!r.isCorrect && (
                <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                  정답: {r.correctAnswer}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </DemoContainer>
  );
}

function LoggingDemo() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logEntries, setLogEntries] = useState(SAMPLE_STUDENT_RESPONSES.slice(0, 3));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setLogEntries([
        ...logEntries,
        {
          studentId: "student-04",
          name: "최은서",
          word: "perspective",
          answer: "관점",
          correct: true,
          score: 100,
          timestamp: new Date().toISOString(),
        },
      ]);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <DemoContainer
      title="학습 기록 저장 시뮬레이션"
      description="학습 결과를 구글 시트에 저장하는 과정을 시뮬레이션합니다."
      color={{
        bgLight: "bg-pink-50",
        border: "border-pink-300",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      }}
    >
      <div className="space-y-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              시트에 저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              학습 기록 저장하기
            </>
          )}
        </Button>

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            학습 기록이 구글 시트에 저장되었습니다!
          </div>
        )}

        {/* Log Table */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="h-4 w-4 text-pink-600" />
            <span className="text-sm font-medium text-gray-700">학습기록 시트</span>
            <Badge variant="secondary" className="text-[10px]">
              {logEntries.length}행
            </Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-pink-50">
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">학생</th>
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">단어</th>
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">답변</th>
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">결과</th>
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">점수</th>
                  <th className="text-left px-3 py-2 font-semibold text-pink-700">시간</th>
                </tr>
              </thead>
              <tbody>
                {logEntries.map((entry, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{entry.name}</td>
                    <td className="px-3 py-2 font-medium">{entry.word}</td>
                    <td className="px-3 py-2">{entry.answer}</td>
                    <td className="px-3 py-2">
                      {entry.correct ? (
                        <Badge className="bg-green-100 text-green-700 text-[10px]">O</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 text-[10px]">X</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">{entry.score}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

function AnalyticsDemo() {
  const students = [
    { name: "김민수", correct: 8, total: 10 },
    { name: "이서연", correct: 7, total: 10 },
    { name: "박지훈", correct: 5, total: 10 },
    { name: "최은서", correct: 9, total: 10 },
    { name: "정하늘", correct: 6, total: 10 },
  ];

  return (
    <DemoContainer
      title="학습 분석 대시보드"
      description="학습 기록 데이터를 시각화하여 교사에게 인사이트를 제공합니다."
      color={{
        bgLight: "bg-pink-50",
        border: "border-pink-300",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      }}
    >
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">70%</p>
              <p className="text-xs text-gray-500">평균 정답률</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-500">참여 학생수</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">50</p>
              <p className="text-xs text-gray-500">총 문제 풀이</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Bar Chart (CSS-based) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              학생별 정답률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((s) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs w-16 text-right text-gray-600">{s.name}</span>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-bold transition-all ${
                            pct >= 80
                              ? "bg-green-500"
                              : pct >= 60
                                ? "bg-blue-500"
                                : "bg-orange-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        >
                          {pct}%
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-12">
                      {s.correct}/{s.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Difficult Words */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">오답률 높은 단어 TOP 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { word: "hypothesis", errorRate: 60 },
                { word: "consequence", errorRate: 40 },
                { word: "perspective", errorRate: 20 },
              ].map((w) => (
                <div key={w.word} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{w.word}</span>
                  <Badge
                    variant="outline"
                    className={
                      w.errorRate >= 50
                        ? "text-red-600 border-red-300"
                        : w.errorRate >= 30
                          ? "text-orange-600 border-orange-300"
                          : "text-yellow-600 border-yellow-300"
                    }
                  >
                    오답률 {w.errorRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoContainer>
  );
}
