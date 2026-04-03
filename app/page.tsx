"use client";

import Link from "next/link";
import { STEPS } from "@/lib/constants";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { StepProgressBar } from "@/components/layout/step-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
  ArrowRight,
  Rocket,
  BookOpen,
  Code2,
  GraduationCap,
  Info,
  CheckSquare,
  MousePointerClick,
  Eye,
  ClipboardCheck,
  Lightbulb,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
};

export default function HomePage() {
  const { overallCompletion, isStepCompleted, stepCompletion, isLoaded } =
    useProgress();

  const completion = isLoaded ? overallCompletion : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="max-w-2xl">
          <Badge className="bg-white/20 text-white border-0 mb-4">
            Plan A: Standard Framework
          </Badge>
          <h1 className="text-3xl font-bold mb-3">
            영어교사를 위한 앱 개발 5단계 가이드
          </h1>
          <p className="text-lg text-white/80 mb-6 leading-relaxed">
            작동하는 앱을 만드는 핵심 뼈대를 5단계로 배웁니다.
            <br />
            교육적 의도를 코드로 구현하는 여정을 시작하세요.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/step/step-1-database">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-white/90"
              >
                <Rocket className="h-5 w-5 mr-2" />
                학습 시작하기
              </Button>
            </Link>
            <Link href="/complete-example">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 bg-transparent"
              >
                완성 예제 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">학습 진행률</h2>
          <span className="text-2xl font-bold text-indigo-600">
            {completion}%
          </span>
        </div>
        <Progress value={completion} className="h-3 mb-4" />
        <StepProgressBar />
      </div>

      {/* 5 Steps Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">5단계 Framework</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = ICON_MAP[step.icon] || Database;
            const completed = isLoaded && isStepCompleted(step.id);
            const completion_step = isLoaded ? stepCompletion(step.id) : 0;

            return (
              <Link key={step.id} href={`/step/${step.id}`}>
                <Card
                  className={cn(
                    "h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-2",
                    completed
                      ? "border-green-300 bg-green-50/50"
                      : step.color.border
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-xl text-white",
                          completed ? "bg-green-500" : step.color.bg
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          completed
                            ? "bg-green-100 text-green-700"
                            : step.color.badge
                        )}
                      >
                        {completed ? "완료" : `Step ${step.number}`}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">
                      {step.titleKo}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {step.descriptionKo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Progress
                        value={completion_step}
                        className="flex-1 h-1.5 mr-3"
                      />
                      <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">이 가이드에서 배우는 것</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">교육 데이터 설계</h3>
              <p className="text-xs text-gray-500 mt-1">
                구글 시트를 활용한 교육 데이터 구조화 방법
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Code2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">인터랙티브 UI</h3>
              <p className="text-xs text-gray-500 mt-1">
                학생/교사 맞춤 입력 인터페이스 구현
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI 연동</h3>
              <p className="text-xs text-gray-500 mt-1">
                Gemini API를 활용한 문제 생성 및 피드백
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About & User Guide */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* App Purpose */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Info className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold">이 앱의 목적</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-800">App Dev Framework</strong>는
              영어교사가 코딩 경험 없이도{" "}
              <strong className="text-indigo-600">교육용 앱을 직접 만들 수 있도록</strong>{" "}
              안내하는 인터랙티브 학습 가이드입니다.
            </p>
            <p>
              복잡한 앱 개발 과정을{" "}
              <strong className="text-gray-800">5단계 Standard Framework</strong>로
              단순화하여, 각 단계를 이해하고 직접 체험하면서 자연스럽게
              앱 개발의 핵심 원리를 익힐 수 있습니다.
            </p>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <p className="text-xs font-medium text-indigo-700 mb-2">
                이런 분을 위해 만들었습니다:
              </p>
              <ul className="text-xs text-indigo-600 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="h-3 w-3 shrink-0" />
                  AI 기반 어휘 학습 앱을 만들고 싶은 영어교사
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="h-3 w-3 shrink-0" />
                  구글 시트 데이터를 활용한 교육 도구를 기획 중인 분
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="h-3 w-3 shrink-0" />
                  Gemini API 연동 방법을 배우고 싶은 교육 분야 입문자
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Guide */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-50">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold">사용 가이드</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  순서대로 Step 1 ~ 5를 진행하세요
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  왼쪽 사이드바 또는 위 카드를 클릭하여 각 단계로 이동합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-green-100 text-green-700 text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  설명을 읽고, 데모를 체험하세요
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  각 단계마다 한국어 설명, 인터랙티브 데모, 코드 예제가 있습니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  코드를 복사하고 직접 활용하세요
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  모든 코드 블록에 복사 버튼이 있어 바로 프로젝트에 적용할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 text-orange-700 text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  체크리스트로 학습을 기록하세요
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  각 단계 하단의 체크리스트를 완료하면 진행률이 자동 저장됩니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-pink-100 text-pink-700 text-xs font-bold shrink-0 mt-0.5">
                5
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  통합 예제로 전체 흐름을 확인하세요
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  &quot;완성 예제 보기&quot;에서 5단계가 결합된 미니 앱을 직접 체험합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Features */}
      <div>
        <h2 className="text-xl font-bold mb-4">더 알아보기</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/builder", title: "퀴즈 빌더", desc: "CSV 단어장으로 AI 퀴즈 자동 생성", color: "bg-indigo-600", emoji: "🛠️" },
            { href: "/demo", title: "빠른 데모", desc: "6단계 워크플로우를 바로 체험", color: "bg-orange-500", emoji: "⚡" },
            { href: "/learn", title: "바이브 코딩", desc: "AI로 앱 만드는 방법 배우기", color: "bg-violet-600", emoji: "🎓" },
            { href: "/guide", title: "앱 가이드", desc: "플랫폼 목적과 사용 안내", color: "bg-teal-600", emoji: "📖" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <div className={cn("inline-flex items-center justify-center h-10 w-10 rounded-xl text-white text-lg mb-3", item.color)}>
                  {item.emoji}
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Framework Flow Diagram */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">전체 흐름도</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {STEPS.map((step, index) => {
            const Icon = ICON_MAP[step.icon] || Database;
            return (
              <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                <div className="text-center">
                  <div
                    className={cn(
                      "flex items-center justify-center h-14 w-14 rounded-xl text-white mx-auto",
                      step.color.bg
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-medium mt-2 text-gray-700">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-400">{step.titleKo}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
