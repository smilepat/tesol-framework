"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CsvService } from "@/lib/services/csv.service";
import { QuizService } from "@/lib/services/quiz.service";
import { QuizStoreService } from "@/lib/services/quiz-store.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  CsvRow,
  QuizSettings,
  QuizItem,
  GeneratedQuiz,
  BuilderStep,
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
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Download,
  Save,
} from "lucide-react";

const STEP_CONFIG = [
  { number: 1, title: "목표 설정", icon: Target, color: "bg-blue-600" },
  { number: 2, title: "데이터 연결", icon: Database, color: "bg-green-600" },
  { number: 3, title: "설정 선택", icon: Settings, color: "bg-orange-600" },
  { number: 4, title: "지시문 조합", icon: FileText, color: "bg-purple-600" },
  { number: 5, title: "AI 생성", icon: Sparkles, color: "bg-pink-600" },
  { number: 6, title: "결과 확인", icon: CheckCircle2, color: "bg-teal-600" },
];

export default function BuilderPage() {
  const [step, setStep] = useState<BuilderStep>(1);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    purpose: "review",
    gradeLevel: "middle-1",
    topic: "",
    cefrLevel: "B1",
    questionTypes: ["multiple-choice"],
    questionCount: 5,
  });
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: "", correctAnswer: "", explanation: "" });
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid || "anonymous";

  // CSV Upload handlers
  const handleFile = useCallback(async (file: File) => {
    try {
      setCsvError(null);
      CsvService.validateFile(file);
      const text = await CsvService.readFile(file);
      const rows = CsvService.parse(text);
      setCsvData(rows);
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : "파일 처리 중 오류가 발생했습니다.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const loadSampleData = () => {
    setCsvData(CsvService.getSampleData());
    setCsvError(null);
  };

  // Quiz generation - calls /api/quiz-generate (real Gemini → mock fallback)
  const generateQuiz = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/quiz-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: csvData, settings }),
      });
      const data = await res.json();
      if (data.success && data.items) {
        setQuiz({
          id: "quiz-" + Date.now(),
          settings,
          items: data.items,
          createdAt: new Date(),
        });
        setStep(6);
      } else {
        throw new Error(data.error || "퀴즈 생성 실패");
      }
    } catch (err) {
      console.error("Quiz generation failed:", err);
      // Fallback to local mock
      const result = await QuizService.generateQuiz(csvData, settings);
      setQuiz(result);
      setStep(6);
    } finally {
      setGenerating(false);
    }
  };

  // Build prompt preview
  const buildPromptPreview = () => {
    return `다음 조건으로 영어 퀴즈를 생성해주세요:

- 목적: ${PURPOSE_LABELS[settings.purpose]}
- 학년: ${GRADE_LEVELS.find(g => g.value === settings.gradeLevel)?.label}
- CEFR 레벨: ${settings.cefrLevel}
- 문제 유형: ${settings.questionTypes.map(t => QUESTION_TYPE_LABELS[t]).join(", ")}
- 문제 수: ${settings.questionCount}개
- 단어 수: ${csvData.length}개${settings.learningObjective ? `\n- 학습 목표: ${settings.learningObjective}` : ""}

[단어 데이터]
${csvData.slice(0, 3).map(w => `${w.word} - ${w.meaningKo || w.meaning}`).join("\n")}
${csvData.length > 3 ? `... 외 ${csvData.length - 3}개` : ""}`;
  };

  const handleCopyQuiz = async (itemId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quiz editing helpers
  const deleteQuizItem = (id: string) => {
    if (!quiz) return;
    setQuiz({ ...quiz, items: quiz.items.filter(item => item.id !== id) });
  };

  const moveQuizItem = (index: number, direction: "up" | "down") => {
    if (!quiz) return;
    const items = [...quiz.items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    setQuiz({ ...quiz, items });
  };

  const startEdit = (item: QuizItem) => {
    setEditingId(item.id);
    setEditForm({ question: item.question, correctAnswer: item.correctAnswer, explanation: item.explanation });
  };

  const saveEdit = () => {
    if (!quiz || !editingId) return;
    setQuiz({
      ...quiz,
      items: quiz.items.map(item =>
        item.id === editingId
          ? { ...item, question: editForm.question, correctAnswer: editForm.correctAnswer, explanation: editForm.explanation }
          : item
      ),
    });
    setEditingId(null);
  };

  const progress = ((step - 1) / 5) * 100;

  return (
    <div className="space-y-6">
      {/* Page Nav */}
      <div className="flex items-center gap-3 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">← 홈으로</Link>
        <span className="text-gray-300">|</span>
        <Link href="/learn" className="text-violet-600 hover:text-violet-800 transition-colors">🎓 바이브 코딩 배우기</Link>
        <span className="text-gray-300">|</span>
        <Link href="/demo" className="text-orange-600 hover:text-orange-800 transition-colors">⚡ 빠른 데모</Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 p-8 text-white">
        <Badge className="bg-white/20 text-white border-0 mb-4">Quiz Builder</Badge>
        <h1 className="text-3xl font-bold mb-2">퀴즈 빌더</h1>
        <p className="text-white/80">CSV 단어장으로 AI 퀴즈를 자동 생성합니다.</p>
      </div>

      {/* Step Progress */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">진행률</span>
          <span className="text-sm font-bold text-indigo-600">{step}/6 단계</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex gap-1">
          {STEP_CONFIG.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isDone = step > s.number;
            return (
              <button
                key={s.number}
                onClick={() => {
                  if (s.number <= step || isDone) setStep(s.number as BuilderStep);
                }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
                  isActive ? "bg-indigo-50 text-indigo-700 font-medium" :
                  isDone ? "text-green-600 cursor-pointer hover:bg-green-50" :
                  "text-gray-400"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-white",
                  isActive ? s.color : isDone ? "bg-green-500" : "bg-gray-200"
                )}>
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="hidden sm:block">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => { const Icon = STEP_CONFIG[step - 1].icon; return <Icon className="h-5 w-5" />; })()}
            Step {step}. {STEP_CONFIG[step - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Step 1: Goal Setting */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">퀴즈 목적</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(PURPOSE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSettings(s => ({ ...s, purpose: key as QuizSettings["purpose"] }))}
                      className={cn(
                        "p-3 rounded-lg border text-sm text-left transition-colors",
                        settings.purpose === key ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-gray-50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">학년</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADE_LEVELS.map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => setSettings(s => ({ ...s, gradeLevel: grade.value }))}
                      className={cn(
                        "p-3 rounded-lg border text-sm transition-colors",
                        settings.gradeLevel === grade.value ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-gray-50"
                      )}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">수업 주제 (선택)</label>
                <Input
                  value={settings.topic}
                  onChange={(e) => setSettings(s => ({ ...s, topic: e.target.value }))}
                  placeholder="예: Unit 3 - Environment"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">학습 목표 (선택)</label>
                <Textarea
                  value={settings.learningObjective || ""}
                  onChange={(e) => setSettings(s => ({ ...s, learningObjective: e.target.value }))}
                  placeholder="구체적으로 적으면 AI가 더 적절한 문항을 생성합니다. 예: 환경 관련 학술 어휘의 정확한 의미와 용법을 파악한다."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Data Connection */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                  isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">CSV 파일을 여기에 드래그하거나</p>
                <label className="cursor-pointer">
                  <span className="text-sm text-indigo-600 font-medium hover:underline">파일을 선택하세요</span>
                  <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 mt-2">필수 컬럼: word, meaning</p>
              </div>

              <Button variant="outline" size="sm" onClick={loadSampleData}>
                샘플 데이터 사용하기
              </Button>

              {csvError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{csvError}</span>
                </div>
              )}

              {csvData.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{csvData.length}개 단어 로드됨</p>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Word</th>
                          <th className="px-3 py-2 text-left font-medium">Meaning</th>
                          <th className="px-3 py-2 text-left font-medium">CEFR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 8).map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2 font-medium">{row.word}</td>
                            <td className="px-3 py-2 text-gray-600">{row.meaningKo || row.meaning}</td>
                            <td className="px-3 py-2"><Badge variant="secondary" className="text-xs">{row.cefrLevel || "-"}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.length > 8 && (
                      <p className="text-xs text-gray-400 p-2 text-center">... 외 {csvData.length - 8}개</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">CEFR 레벨</label>
                <div className="flex gap-2 flex-wrap">
                  {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSettings(s => ({ ...s, cefrLevel: level }))}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        settings.cefrLevel === level ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">문제 유형</label>
                <div className="space-y-2">
                  {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={settings.questionTypes.includes(key as "multiple-choice" | "fill-in-blank" | "short-answer")}
                        onCheckedChange={(checked) => {
                          setSettings(s => ({
                            ...s,
                            questionTypes: checked
                              ? [...s.questionTypes, key as "multiple-choice" | "fill-in-blank" | "short-answer"]
                              : s.questionTypes.filter(t => t !== key),
                          }));
                        }}
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">문제 수</label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSettings(s => ({ ...s, questionCount: count }))}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        settings.questionCount === count ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
                      )}
                    >
                      {count}개
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Prompt Preview */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">설정값을 기반으로 AI에 전달할 지시문이 자동으로 조합됩니다.</p>
              <div className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap">
                {buildPromptPreview()}
              </div>
              <p className="text-xs text-gray-400">이 프롬프트가 AI에 전달되어 퀴즈가 생성됩니다.</p>
            </div>
          )}

          {/* Step 5: Generate */}
          {step === 5 && (
            <div className="text-center space-y-4 py-8">
              {generating ? (
                <>
                  <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm text-gray-600">AI가 퀴즈를 생성하고 있습니다...</p>
                  <p className="text-xs text-gray-400">잠시만 기다려주세요</p>
                </>
              ) : (
                <>
                  <Sparkles className="h-12 w-12 text-indigo-600 mx-auto" />
                  <p className="text-sm text-gray-600">준비가 완료되었습니다. 퀴즈를 생성하세요.</p>
                  <Button onClick={generateQuiz} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    퀴즈 생성하기
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step 6: Results */}
          {step === 6 && quiz && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{quiz.items.length}개 문제가 생성되었습니다.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyQuiz("all", JSON.stringify(quiz.items, null, 2))}
                >
                  {copiedId === "all" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  전체 복사
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `quiz-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-1 rotate-90" />
                  JSON 다운로드
                </Button>
                <Button
                  variant={saved ? "secondary" : "default"}
                  size="sm"
                  onClick={async () => {
                    if (!quiz) return;
                    await QuizStoreService.save(userId, quiz);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000);
                  }}
                >
                  {saved ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                  {saved ? "저장됨" : "퀴즈 저장"}
                </Button>
              </div>
              {quiz.items.map((item, i) => (
                <Card key={item.id} className="border">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Q{i + 1}</Badge>
                        <Badge variant="outline" className="text-xs">{QUESTION_TYPE_LABELS[item.type]}</Badge>
                        <Badge className="text-xs bg-gray-100 text-gray-600">{item.word}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveQuizItem(i, "up")} disabled={i === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30" title="위로">
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => moveQuizItem(i, "down")} disabled={i === quiz.items.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30" title="아래로">
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button onClick={() => startEdit(item)} className="p-1 rounded hover:bg-blue-50 text-blue-600" title="수정">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteQuizItem(item.id)} className="p-1 rounded hover:bg-red-50 text-red-500" title="삭제">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <label className="text-xs font-medium text-blue-700">문제</label>
                        <Textarea value={editForm.question} onChange={e => setEditForm(f => ({ ...f, question: e.target.value }))} rows={2} className="text-sm" />
                        <label className="text-xs font-medium text-blue-700">정답</label>
                        <Input value={editForm.correctAnswer} onChange={e => setEditForm(f => ({ ...f, correctAnswer: e.target.value }))} className="text-sm" />
                        <label className="text-xs font-medium text-blue-700">해설</label>
                        <Textarea value={editForm.explanation} onChange={e => setEditForm(f => ({ ...f, explanation: e.target.value }))} rows={2} className="text-sm" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit}><Save className="h-3 w-3 mr-1" />저장</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>취소</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium whitespace-pre-wrap">{item.question}</p>
                        {item.options && (
                          <div className="space-y-1.5">
                            {item.options.map((opt, j) => (
                              <div
                                key={j}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm border",
                                  opt === item.correctAnswer ? "bg-green-50 border-green-300 text-green-800 font-medium" : ""
                                )}
                              >
                                {String.fromCharCode(65 + j)}. {opt}
                                {opt === item.correctAnswer && " ✓"}
                              </div>
                            ))}
                          </div>
                        )}
                        {!item.options && (
                          <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-300 text-sm text-green-800">
                            정답: {item.correctAnswer}
                          </div>
                        )}
                        <details className="text-xs text-gray-500">
                          <summary className="cursor-pointer hover:text-gray-700">해설 보기</summary>
                          <p className="mt-2 whitespace-pre-wrap">{item.explanation}</p>
                        </details>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((step - 1) as BuilderStep)}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          이전
        </Button>
        {step < 5 && (
          <Button
            onClick={() => setStep((step + 1) as BuilderStep)}
            disabled={step === 2 && csvData.length === 0}
          >
            다음
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
