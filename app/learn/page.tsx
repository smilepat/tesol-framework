"use client";

import { useState } from "react";
import { LEARN_STEPS } from "@/lib/constants/learn-steps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Terminal,
  Rocket,
  BookOpen,
} from "lucide-react";

function PromptBlock({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-gray-900 text-gray-100 p-4 text-sm font-mono">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
        title="프롬프트 복사"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400" />
        )}
      </button>
      <pre className="whitespace-pre-wrap leading-relaxed pr-10">{prompt}</pre>
    </div>
  );
}

function LearnStepCard({ step, index }: { step: typeof LEARN_STEPS[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <Card className="border-2 hover:shadow-md transition-shadow">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center h-10 w-10 rounded-xl text-white text-sm font-bold",
              step.color
            )}>
              {step.number}
            </div>
            <div>
              <CardTitle className="text-base">{step.titleKo}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{step.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Step {step.number}/6
            </Badge>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Description */}
          <p className="text-sm text-gray-600">{step.description}</p>

          {/* Prompt */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                Claude Code에 입력할 프롬프트
              </span>
            </div>
            <PromptBlock prompt={step.prompt} />
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">팁</span>
            </div>
            <ul className="space-y-1.5">
              {step.tips.map((tip, i) => (
                <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function LearnPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-8 text-white">
        <Badge className="bg-white/20 text-white border-0 mb-4">
          Vibe Coding Tutorial
        </Badge>
        <h1 className="text-3xl font-bold mb-3">
          바이브 코딩 배우기
        </h1>
        <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
          AI에게 자연어로 말해서 코드를 만드는 방식, &quot;바이브 코딩&quot;으로
          영어 퀴즈 생성 앱을 직접 만들어봅니다.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Sparkles className="h-5 w-5 text-white/60" />
          <span className="text-sm text-white/70">
            Claude Code + 자연어 프롬프트 = 완성된 앱
          </span>
        </div>
      </div>

      {/* What is Vibe Coding */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-violet-50">
            <BookOpen className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="text-lg font-bold">바이브 코딩이란?</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong className="text-gray-800">바이브 코딩(Vibe Coding)</strong>은
            코드를 직접 작성하는 대신, AI에게 자연어로 원하는 것을 설명하여
            코드를 만드는 새로운 개발 방식입니다.
          </p>
          <div className="bg-violet-50 border border-violet-100 rounded-lg p-4">
            <p className="text-sm text-violet-800 font-medium">
              &quot;프로그래밍 언어를 몰라도, 원하는 것을 정확히 설명할 수 있다면 앱을 만들 수 있습니다.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">사전 준비사항</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "컴퓨터", desc: "Windows, Mac, 또는 Linux" },
            { title: "Claude Code 설치", desc: "npm install -g @anthropic-ai/claude-code" },
            { title: "VS Code", desc: "코드 편집기 (무료)" },
            { title: "CSV 단어장", desc: "word, meaning, example 컬럼이 포함된 파일" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Steps */}
      <div>
        <h2 className="text-xl font-bold mb-4">6단계 실습</h2>
        <div className="space-y-4">
          {LEARN_STEPS.map((step, index) => (
            <LearnStepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border bg-gradient-to-r from-violet-50 to-purple-50 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-2">완료 후 다음 단계</h2>
        <p className="text-sm text-gray-600 mb-4">
          6단계를 모두 완료하면 배포된 퀴즈 생성 앱이 완성됩니다.
          이후 아래 기능을 추가해볼 수 있습니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Firebase 로그인", "학생 진도 추적", "퀴즈 결과 분석", "다양한 문제 유형", "PDF 내보내기"].map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-4">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Rocket className="h-4 w-4 mr-2" />
            지금 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
