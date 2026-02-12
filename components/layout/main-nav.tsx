"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/constants";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/utils";
import {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  FormInput,
  Workflow,
  Sparkles,
  MessageSquareText,
};

export function MainNav() {
  const pathname = usePathname();
  const { getOverallCompletion, isStepCompleted, resetProgress, isLoaded } =
    useProgress();

  const completion = isLoaded ? getOverallCompletion() : 0;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">
              App Dev <span className="text-indigo-600">Framework</span>
            </span>
          </Link>

          {/* Step Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {STEPS.map((step) => {
              const Icon = ICON_MAP[step.icon] || Database;
              const isActive =
                pathname === `/step/${step.id}` ||
                pathname.startsWith(`/step/${step.id}/`);
              const completed = isLoaded && isStepCompleted(step.id);

              return (
                <Link
                  key={step.id}
                  href={`/step/${step.id}`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? `${step.color.bgLight} ${step.color.text}`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    completed && !isActive && "opacity-80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{step.number}.</span>
                  <span className="hidden lg:inline">{step.title}</span>
                  <span className="lg:hidden">{step.number}</span>
                  {completed && (
                    <Badge
                      variant="secondary"
                      className="h-4 px-1 text-[10px] bg-green-100 text-green-700"
                    >
                      ✓
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Progress + Reset */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Progress value={completion} className="w-24 h-2" />
              <span className="text-xs text-gray-500 font-medium">
                {completion}%
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProgress}
              className="text-gray-400 hover:text-gray-600"
              title="진행 상태 초기화"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
