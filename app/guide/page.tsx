"use client";

import Link from "next/link";
import { STEPS } from "@/lib/constants";
import {
  Target,
  Star,
  Settings,
  Puzzle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Database,
  FormInput,
  Workflow,
  MessageSquareText,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
};

const NAV_SECTIONS = [
  { id: "purpose", label: "목적", icon: Target },
  { id: "features", label: "주요 기능", icon: Star },
  { id: "how-it-works", label: "작동 방식", icon: Settings },
  { id: "key-elements", label: "핵심 요소", icon: Puzzle },
  { id: "user-guide", label: "사용 가이드", icon: BookOpen },
];

export default function GuidePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-8 text-white">
        <Badge className="bg-white/20 text-white border-0 mb-4">
          App Dev Framework Guide
        </Badge>
        <h1 className="text-3xl font-bold mb-3">앱 가이드</h1>
        <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
          영어교사가 학습 데이터와 AI를 결합해 수업용 앱을 제작·배포·운영·개선하는
          교사 전용 AI 수업설계 플랫폼입니다.
        </p>
      </div>

      {/* Quick Nav */}
      <div className="flex flex-wrap gap-2">
        {NAV_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white border hover:bg-gray-50 transition-colors"
            >
              <Icon className="h-4 w-4 text-teal-600" />
              {section.label}
            </a>
          );
        })}
      </div>

      {/* Section 1: Purpose */}
      <section id="purpose" className="scroll-mt-20">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50">
              <Target className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold">목적</h2>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <p className="text-sm font-medium text-teal-800 leading-relaxed">
              &quot;코딩 경험 없는 영어교사가 5단계 프레임워크를 따라
              AI 기반 어휘 학습 앱을 직접 만들 수 있도록 안내하는 인터랙티브 학습 가이드&quot;
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">이런 문제를 해결합니다</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "교사가 원하는 맞춤형 학습 도구가 시중에 없음",
                "앱 개발은 비전공자에게 진입 장벽이 높음",
                "교육 데이터는 쌓이지만 개선 실행으로 이어지지 않음",
                "AI 기술을 수업에 접목하는 실용적 가이드가 부족함",
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">대상 사용자</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, title: "영어교사", desc: "AI 기반 어휘 학습 앱을 만들고 싶은 교사" },
                { icon: Database, title: "데이터 활용자", desc: "구글 시트 데이터로 교육 도구를 기획하는 분" },
                { icon: Sparkles, title: "AI 입문자", desc: "Gemini API 연동을 배우고 싶은 교육 분야 입문자" },
              ].map((user, i) => {
                const Icon = user.icon;
                return (
                  <div key={i} className="rounded-lg border p-3">
                    <Icon className="h-5 w-5 text-teal-600 mb-2" />
                    <p className="text-sm font-medium">{user.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Features */}
      <section id="features" className="scroll-mt-20">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold">주요 기능</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "5단계 인터랙티브 학습", desc: "데이터베이스 → 입력 UI → 오케스트레이터 → AI 추론 → 피드백의 체계적 학습 경로", badge: "학습" },
              { title: "실시간 코드 예제", desc: "각 단계별 TypeScript/TSX 코드를 복사하여 바로 프로젝트에 적용 가능", badge: "코드" },
              { title: "진행률 추적", desc: "단계별 체크리스트와 전체 진행률을 자동으로 저장하고 시각화", badge: "추적" },
              { title: "Google 로그인", desc: "Firebase Authentication으로 안전한 Google OAuth 로그인 지원", badge: "인증" },
              { title: "교사 대시보드", desc: "어휘 관리, 학생 진도, 퀴즈 결과를 한눈에 파악하는 관리 도구", badge: "관리" },
              { title: "통합 예제", desc: "5단계를 모두 결합한 미니 앱으로 전체 흐름을 직접 체험", badge: "체험" },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold">작동 방식</h2>
          </div>

          <p className="text-sm text-gray-600">
            5단계 Standard Framework를 순서대로 따라가며 앱 개발의 핵심 원리를 배웁니다.
          </p>

          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = ICON_MAP[step.icon] || Database;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-xl text-white shrink-0",
                    step.color.bg
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        Step {step.number}. {step.titleKo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{step.descriptionKo}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 shrink-0 mt-3 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Visual flow */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t">
            {STEPS.map((step, index) => {
              const Icon = ICON_MAP[step.icon] || Database;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="text-center">
                    <div className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-xl text-white mx-auto",
                      step.color.bg
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-medium mt-1 text-gray-600">{step.title}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Key Elements */}
      <section id="key-elements" className="scroll-mt-20">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50">
              <Puzzle className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">핵심 요소</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "교육 데이터 설계", desc: "구글 시트를 활용한 체계적 어휘 데이터 구조화", color: "bg-blue-50 text-blue-600" },
              { title: "사용자 인터페이스", desc: "학생과 교사 맞춤형 입력 인터페이스 구현", color: "bg-green-50 text-green-600" },
              { title: "데이터 오케스트레이션", desc: "여러 데이터 소스를 결합하는 조정 로직", color: "bg-orange-50 text-orange-600" },
              { title: "AI 추론 엔진", desc: "Gemini API를 활용한 문제 생성과 콘텐츠 분석", color: "bg-purple-50 text-purple-600" },
              { title: "피드백 시스템", desc: "학습 결과 분석과 맞춤형 피드백 제공", color: "bg-pink-50 text-pink-600" },
              { title: "진행률 관리", desc: "학습 상태 추적과 동기 부여를 위한 시각화", color: "bg-teal-50 text-teal-600" },
            ].map((element, i) => (
              <div key={i} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                <div className={cn("inline-flex items-center justify-center h-8 w-8 rounded-lg mb-3", element.color)}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{element.title}</h3>
                <p className="text-xs text-gray-500">{element.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: User Guide */}
      <section id="user-guide" className="scroll-mt-20">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold">사용 가이드</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Clock, title: "빠른 제작", desc: "첫 앱 초안을 2시간 이내에 완성할 수 있습니다", color: "text-blue-600 bg-blue-50" },
              { icon: CheckCircle2, title: "사전 검증", desc: "수업 전 10분 안에 생성된 콘텐츠를 검증할 수 있습니다", color: "text-green-600 bg-green-50" },
              { icon: Sparkles, title: "자동 개선", desc: "학습 기록을 기반으로 자동으로 개선점을 제안합니다", color: "text-purple-600 bg-purple-50" },
              { icon: Users, title: "템플릿 복제", desc: "만들어진 템플릿을 15분 안에 다른 수업에 적용할 수 있습니다", color: "text-orange-600 bg-orange-50" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className={cn("p-2 rounded-lg shrink-0", item.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Link href="/step/step-1-database">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Rocket className="h-4 w-4 mr-2" />
                학습 시작하기
              </Button>
            </Link>
            <Link href="/complete-example">
              <Button variant="outline">
                통합 예제 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
