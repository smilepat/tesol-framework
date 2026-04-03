"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CsvService } from "@/lib/services/csv.service";
import { QuizService } from "@/lib/services/quiz.service";
import {
  CsvRow,
  QuizSettings,
  GeneratedQuiz,
  PURPOSE_LABELS,
  GRADE_LEVELS,
  QUESTION_TYPE_LABELS,
} from "@/lib/types/quiz.types";
import {
  Target,
  Database,
  Settings,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Rocket,
  Check,
} from "lucide-react";

const STEP_CONFIG = [
  { number: 1, title: "목표 설정", icon: Target },
  { number: 2, title: "데이터 확인", icon: Database },
  { number: 3, title: "설정 선택", icon: Settings },
  { number: 4, title: "지시문 확인", icon: FileText },
  { number: 5, title: "AI 생성", icon: Sparkles },
  { number: 6, title: "결과 확인", icon: CheckCircle2 },
];

// Pre-configured demo settings
const DEMO_SETTINGS: QuizSettings = {
  purpose: "review",
  gradeLevel: "middle-2",
  topic: "Unit 3 - Academic Vocabulary",
  cefrLevel: "B2",
  questionTypes: ["multiple-choice", "fill-in-blank"],
  questionCount: 5,
};

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [generating, setGenerating] = useState(false);
  const sampleData = CsvService.getSampleData();

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await QuizService.generateQuiz(sampleData, DEMO_SETTINGS);
    setQuiz(result);
    setGenerating(false);
    setStep(6);
  };

  const nextStep = () => {
    if (step === 5) {
      handleGenerate();
    } else {
      setStep(s => Math.min(s + 1, 6));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 text-white">
        <Badge className="bg-white/20 text-white border-0 mb-4">Quick Demo</Badge>
        <h1 className="text-3xl font-bold mb-2">빠른 데모</h1>
        <p className="text-white/80">6단계 워크플로우를 샘플 데이터로 체험합니다.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1 rounded-xl border bg-white p-3 shadow-sm">
        {STEP_CONFIG.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.number;
          const isDone = step > s.number;
          return (
            <div key={s.number} className={cn(
              "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
              isActive ? "bg-orange-50 text-orange-700 font-medium" : isDone ? "text-green-600" : "text-gray-400"
            )}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-white",
                isActive ? "bg-orange-500" : isDone ? "bg-green-500" : "bg-gray-200"
              )}>
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className="hidden sm:block">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base">
            Step {step}. {STEP_CONFIG[step - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">데모에서 사용할 퀴즈 설정입니다.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">목적</p>
                  <p className="text-sm font-medium">{PURPOSE_LABELS[DEMO_SETTINGS.purpose]}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">학년</p>
                  <p className="text-sm font-medium">{GRADE_LEVELS.find(g => g.value === DEMO_SETTINGS.gradeLevel)?.label}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">주제</p>
                  <p className="text-sm font-medium">{DEMO_SETTINGS.topic}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">CEFR</p>
                  <p className="text-sm font-medium">{DEMO_SETTINGS.cefrLevel}</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">샘플 단어 데이터 ({sampleData.length}개)</p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Word</th>
                      <th className="px-3 py-2 text-left font-medium">뜻</th>
                      <th className="px-3 py-2 text-left font-medium">CEFR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 font-medium">{row.word}</td>
                        <td className="px-3 py-2 text-gray-600">{row.meaningKo}</td>
                        <td className="px-3 py-2"><Badge variant="secondary" className="text-xs">{row.cefrLevel}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">퀴즈 생성 설정</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">문제 유형</p>
                  <p className="text-sm font-medium">{DEMO_SETTINGS.questionTypes.map(t => QUESTION_TYPE_LABELS[t]).join(", ")}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">문제 수</p>
                  <p className="text-sm font-medium">{DEMO_SETTINGS.questionCount}개</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-gray-500">CEFR 레벨</p>
                  <p className="text-sm font-medium">{DEMO_SETTINGS.cefrLevel}</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">AI에 전달되는 지시문 미리보기</p>
              <div className="rounded-lg bg-gray-900 text-gray-100 p-4 text-xs font-mono whitespace-pre-wrap">
{`목적: ${PURPOSE_LABELS[DEMO_SETTINGS.purpose]}
학년: ${GRADE_LEVELS.find(g => g.value === DEMO_SETTINGS.gradeLevel)?.label}
CEFR: ${DEMO_SETTINGS.cefrLevel}
문제 유형: ${DEMO_SETTINGS.questionTypes.map(t => QUESTION_TYPE_LABELS[t]).join(", ")}
문제 수: ${DEMO_SETTINGS.questionCount}개
단어: ${sampleData.slice(0, 3).map(w => w.word).join(", ")} 외 ${sampleData.length - 3}개`}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              {generating ? (
                <>
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-600">퀴즈 생성 중...</p>
                </>
              ) : (
                <>
                  <Sparkles className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">다음 버튼을 눌러 퀴즈를 생성하세요.</p>
                </>
              )}
            </div>
          )}

          {step === 6 && quiz && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{quiz.items.length}개 문제가 생성되었습니다.</p>
              {quiz.items.map((item, i) => (
                <div key={item.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Q{i + 1}</Badge>
                    <Badge variant="outline" className="text-xs">{QUESTION_TYPE_LABELS[item.type]}</Badge>
                  </div>
                  <p className="text-sm font-medium whitespace-pre-wrap">{item.question}</p>
                  {item.options && (
                    <div className="space-y-1">
                      {item.options.map((opt, j) => (
                        <div key={j} className={cn(
                          "px-3 py-1.5 rounded text-sm",
                          opt === item.correctAnswer ? "bg-green-50 text-green-800 font-medium" : ""
                        )}>
                          {String.fromCharCode(65 + j)}. {opt} {opt === item.correctAnswer && "✓"}
                        </div>
                      ))}
                    </div>
                  )}
                  {!item.options && (
                    <div className="px-3 py-1.5 rounded bg-green-50 text-sm text-green-800">정답: {item.correctAnswer}</div>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t">
                <Link href="/builder">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Rocket className="h-4 w-4 mr-2" />
                    직접 만들어보기
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { setStep(1); setQuiz(null); }}>
                  데모 다시 시작
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {step < 6 && (
        <div className="flex justify-end">
          <Button onClick={nextStep} disabled={generating}>
            {step === 5 ? "퀴즈 생성" : "다음"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
