"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/constants";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
  Check,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
};

export function StepSidebar() {
  const pathname = usePathname();
  const {
    isStepCompleted,
    stepCompletion,
    overallCompletion,
    isLoaded,
  } = useProgress();

  const completion = isLoaded ? overallCompletion : 0;

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Overall Progress */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-sm text-gray-700">전체 진행률</h3>
          </div>
          <Progress value={completion} className="h-3 mb-2" />
          <p className="text-xs text-gray-500 text-right">{completion}% 완료</p>
        </div>

        {/* Step List */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <h3 className="px-4 py-3 font-semibold text-sm text-gray-700 bg-gray-50 border-b">
            학습 단계
          </h3>
          <nav className="p-2 space-y-1">
            {STEPS.map((step) => {
              const Icon = ICON_MAP[step.icon] || Database;
              const isActive = pathname === `/step/${step.id}`;
              const completed = isLoaded && isStepCompleted(step.id);
              const completion_step = isLoaded
                ? stepCompletion(step.id)
                : 0;

              return (
                <Link
                  key={step.id}
                  href={`/step/${step.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? `${step.color.bgLight} ${step.color.text} font-medium`
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full text-white text-xs font-bold shrink-0",
                      completed ? "bg-green-500" : step.color.bg
                    )}
                  >
                    {completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{step.titleKo}</p>
                    {completion_step > 0 && !completed && (
                      <Progress value={completion_step} className="h-1 mt-1" />
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Complete Example Link */}
        <Link
          href="/complete-example"
          className={cn(
            "block rounded-xl border p-4 shadow-sm transition-colors",
            pathname === "/complete-example"
              ? "bg-indigo-50 border-indigo-200"
              : "bg-white hover:bg-gray-50"
          )}
        >
          <p className="font-semibold text-sm text-indigo-700">
            🎯 통합 예제 보기
          </p>
          <p className="text-xs text-gray-500 mt-1">
            5단계를 모두 결합한 미니 앱
          </p>
        </Link>
      </div>
    </aside>
  );
}
