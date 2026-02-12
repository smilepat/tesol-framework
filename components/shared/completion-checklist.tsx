"use client";

import { useProgress } from "@/lib/use-progress";
import { StepId, TaskItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, PartyPopper } from "lucide-react";

interface CompletionChecklistProps {
  stepId: StepId;
  tasks: TaskItem[];
  color?: {
    text: string;
    bgLight: string;
    border: string;
  };
}

export function CompletionChecklist({
  stepId,
  tasks,
  color,
}: CompletionChecklistProps) {
  const { toggleTask, isTaskCompleted, getStepCompletion, isStepCompleted, isLoaded } =
    useProgress();

  const completion = isLoaded ? getStepCompletion(stepId) : 0;
  const completed = isLoaded && isStepCompleted(stepId);

  return (
    <Card
      className={cn(
        "border-2",
        completed
          ? "border-green-300 bg-green-50"
          : color
            ? `${color.border} ${color.bgLight}`
            : ""
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {completed ? (
              <PartyPopper className="h-5 w-5 text-green-600" />
            ) : (
              <ClipboardCheck
                className={cn("h-5 w-5", color?.text || "text-gray-600")}
              />
            )}
            <CardTitle className="text-base">
              {completed ? "모든 과제를 완료했습니다!" : "완료 체크리스트"}
            </CardTitle>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {completion}%
          </span>
        </div>
        <Progress
          value={completion}
          className={cn("h-2 mt-2", completed && "[&>div]:bg-green-500")}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const checked = isLoaded && isTaskCompleted(stepId, task.id);
            return (
              <label
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                  checked
                    ? "bg-green-50"
                    : "hover:bg-gray-50"
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleTask(stepId, task.id)}
                />
                <span
                  className={cn(
                    "text-sm",
                    checked
                      ? "text-green-700 line-through"
                      : "text-gray-700"
                  )}
                >
                  {task.label}
                </span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
