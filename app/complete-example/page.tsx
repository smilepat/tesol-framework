"use client";

import { useState } from "react";
import { SAMPLE_VOCAB_DATA } from "@/lib/mock-data";
import { simulateGeminiCall } from "@/lib/mock-gemini";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

type AppPhase =
  | "setup"
  | "input"
  | "orchestrate"
  | "ai-processing"
  | "result";

interface QuizQuestion {
  word: string;
  meaningKo: string;
  options: string[];
  correctIndex: number;
}

export default function CompleteExamplePage() {
  const [phase, setPhase] = useState<AppPhase>("setup");
  const [settings, setSettings] = useState({
    cefrLevel: "B1",
    wordCount: 5,
    questionType: "객관식",
  });
  const [selectedWords, setSelectedWords] = useState<typeof SAMPLE_VOCAB_DATA>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Database - Select words from sheet data
  const handleSetup = () => {
    const words = SAMPLE_VOCAB_DATA.slice(0, settings.wordCount);
    setSelectedWords(words);
    setPhase("input");
  };

  // Step 2 → 3: User Input → Orchestrator
  const handleGenerate = async () => {
    setPhase("orchestrate");
    setLoading(true);

    // Simulate orchestrator combining data
    await new Promise((r) => setTimeout(r, 800));
    setPhase("ai-processing");

    // Simulate AI generating questions
    await simulateGeminiCall("generate quiz", { temperature: 0.7 });

    // Generate mock quiz questions from selected words
    const generated: QuizQuestion[] = selectedWords.map((w) => {
      const wrongOptions = SAMPLE_VOCAB_DATA
        .filter((v) => v.word !== w.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.meaningKo);

      const options = [...wrongOptions, w.meaningKo].sort(
        () => Math.random() - 0.5
      );
      const correctIndex = options.indexOf(w.meaningKo);

      return {
        word: w.word,
        meaningKo: w.meaningKo,
        options,
        correctIndex,
      };
    });

    setQuestions(generated);
    setLoading(false);
    setPhase("result");
  };

  const handleAnswer = (qIndex: number, aIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setPhase("setup");
    setSelectedWords([]);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
  };

  const score = showResults
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <Badge className="bg-white/20 text-white border-0 mb-2">
          Complete Example
        </Badge>
        <h1 className="text-2xl font-bold mb-2">
          5단계 통합 미니 어휘 학습 앱
        </h1>
        <p className="text-white/80 text-sm">
          5단계 Framework이 실제로 작동하는 완전한 예제입니다.
          각 단계가 어떻게 연결되는지 직접 체험해보세요.
        </p>
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-center gap-1">
        {[
          { id: "setup", label: "DB", icon: Database, color: "bg-blue-600" },
          { id: "input", label: "Input", icon: FormInput, color: "bg-green-600" },
          { id: "orchestrate", label: "Orch", icon: Workflow, color: "bg-purple-600" },
          { id: "ai-processing", label: "AI", icon: Sparkles, color: "bg-orange-600" },
          { id: "result", label: "Result", icon: MessageSquareText, color: "bg-pink-600" },
        ].map((p, i, arr) => {
          const phases: AppPhase[] = ["setup", "input", "orchestrate", "ai-processing", "result"];
          const currentIdx = phases.indexOf(phase);
          const thisIdx = phases.indexOf(p.id as AppPhase);
          const isActive = p.id === phase;
          const isPast = thisIdx < currentIdx;
          const Icon = p.icon;

          return (
            <div key={p.id} className="flex items-center gap-1">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? `${p.color} text-white scale-110`
                    : isPast
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isPast ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              {i < arr.length - 1 && (
                <div className={`h-0.5 w-6 ${isPast ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Content */}
      {phase === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Step 1-2: 데이터 선택 & 학습 설정
            </CardTitle>
            <CardDescription>
              구글 시트의 단어 데이터를 확인하고 학습 설정을 선택하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Data Preview */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                단어 데이터 (DB)
              </h4>
              <div className="overflow-x-auto rounded border text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left px-3 py-2">Word</th>
                      <th className="text-left px-3 py-2">한국어뜻</th>
                      <th className="text-left px-3 py-2">CEFR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_VOCAB_DATA.map((w, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-1.5 font-medium">{w.word}</td>
                        <td className="px-3 py-1.5">{w.meaningKo}</td>
                        <td className="px-3 py-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            {w.cefrLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Settings */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-1 block">CEFR 레벨</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={settings.cefrLevel}
                  onChange={(e) => setSettings({ ...settings, cefrLevel: e.target.value })}
                >
                  <option>A2</option>
                  <option>B1</option>
                  <option>B2</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">단어 수</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={settings.wordCount}
                  onChange={(e) =>
                    setSettings({ ...settings, wordCount: Number(e.target.value) })
                  }
                >
                  <option value={3}>3개</option>
                  <option value={5}>5개</option>
                  <option value={7}>7개</option>
                  <option value={10}>10개</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">문제 유형</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={settings.questionType}
                  onChange={(e) =>
                    setSettings({ ...settings, questionType: e.target.value })
                  }
                >
                  <option>객관식</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSetup} className="w-full bg-blue-600 hover:bg-blue-700">
              학습 시작
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "input" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FormInput className="h-5 w-5 text-green-600" />
              Step 2: 선택된 단어 확인
            </CardTitle>
            <CardDescription>
              데이터베이스에서 {selectedWords.length}개의 단어가 선택되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((w) => (
                <Badge key={w.word} className="bg-green-100 text-green-700 text-sm">
                  {w.word}
                </Badge>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <p className="font-medium text-gray-600 mb-1">전달될 설정:</p>
              <pre className="font-mono text-gray-500">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
            <Button onClick={handleGenerate} className="w-full bg-green-600 hover:bg-green-700">
              문제 생성 (AI 호출)
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {(phase === "orchestrate" || phase === "ai-processing") && loading && (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-600" />
            <div>
              <p className="font-semibold text-lg">
                {phase === "orchestrate"
                  ? "데이터 결합 중..."
                  : "AI가 문제를 생성하고 있습니다..."}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {phase === "orchestrate"
                  ? "사용자 입력 + 시트 데이터 + 프롬프트 결합"
                  : "Gemini API에 프롬프트를 전송하고 응답을 기다리는 중"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "result" && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Step 4-5: AI가 생성한 문제
            </CardTitle>
            <CardDescription>
              각 문제의 정답을 선택하고 제출하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm font-semibold">
                  Q{qi + 1}. &quot;{q.word}&quot;의 뜻으로 가장 적절한 것은?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <Button
                      key={oi}
                      variant={answers[qi] === oi ? "default" : "outline"}
                      className={`justify-start text-sm h-auto py-2 ${
                        answers[qi] === oi ? "bg-indigo-600" : ""
                      }`}
                      onClick={() => handleAnswer(qi, oi)}
                    >
                      {String.fromCharCode(65 + oi)}) {opt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {Object.keys(answers).length} / {questions.length} 문제 답변 완료
              </p>
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="bg-pink-600 hover:bg-pink-700"
              >
                제출하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "result" && showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-pink-600" />
              Step 5: 결과 & 피드백
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
              <p className="text-5xl font-bold text-indigo-600">
                {score} / {questions.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                정답률 {Math.round((score / questions.length) * 100)}%
              </p>
              <Progress
                value={(score / questions.length) * 100}
                className="mt-3 h-3"
              />
            </div>

            {/* Results */}
            <div className="space-y-2">
              {questions.map((q, qi) => {
                const isCorrect = answers[qi] === q.correctIndex;
                return (
                  <div
                    key={qi}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium">{q.word}</span>
                    </div>
                    {!isCorrect && (
                      <span className="text-xs text-red-600">
                        정답: {q.meaningKo}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              다시 시작하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
