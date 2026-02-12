"use client";

import { STEPS } from "@/lib/constants";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepProgressBar() {
  const { isStepCompleted, isLoaded } = useProgress();

  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {STEPS.map((step, index) => {
        const completed = isLoaded && isStepCompleted(step.id);
        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold border-2 transition-all",
                completed
                  ? "bg-green-500 border-green-500 text-white"
                  : `border-current ${step.color.text} bg-white`
              )}
            >
              {completed ? <Check className="h-5 w-5" /> : step.number}
            </div>
            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 md:w-16",
                  completed ? "bg-green-400" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
