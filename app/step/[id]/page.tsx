"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStepById, STEPS } from "@/lib/constants";
import { ExplanationCard } from "@/components/shared/explanation-card";
import { CodeBlock } from "@/components/shared/code-block";
import { CompletionChecklist } from "@/components/shared/completion-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

import { Step1Database } from "@/components/steps/step1-database";
import { Step2UserInput } from "@/components/steps/step2-user-input";
import { Step3Orchestrator } from "@/components/steps/step3-orchestrator";
import { Step4AiReasoning } from "@/components/steps/step4-ai-reasoning";
import { Step5Feedback } from "@/components/steps/step5-feedback";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  "step-1-database": Step1Database,
  "step-2-user-input": Step2UserInput,
  "step-3-orchestrator": Step3Orchestrator,
  "step-4-ai-reasoning": Step4AiReasoning,
  "step-5-feedback": Step5Feedback,
};

export default function StepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const step = getStepById(id);

  if (!step) {
    notFound();
  }

  const StepComponent = STEP_COMPONENTS[step.id];
  const prevStep = STEPS.find((s) => s.number === step.number - 1);
  const nextStep = STEPS.find((s) => s.number === step.number + 1);

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-xl text-white text-lg font-bold ${step.color.bg}`}
            >
              {step.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{step.titleKo}</h1>
                <Badge className={step.color.badge}>Step {step.number}</Badge>
              </div>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Home className="h-4 w-4" />
              홈화면
            </Button>
          </Link>
        </div>
      </div>

      {/* Explanation Card */}
      <ExplanationCard
        title={`${step.number}단계: ${step.titleKo}`}
        description={step.descriptionKo}
        keyPoints={step.learningObjectives}
        color={step.color}
      />

      {/* Interactive Demo */}
      {StepComponent && <StepComponent />}

      {/* Code Examples */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">코드 예제</h2>
        {step.codeExamples.map((example, i) => (
          <CodeBlock
            key={i}
            title={example.title}
            language={example.language}
            code={example.code}
            description={example.description}
          />
        ))}
      </div>

      <Separator />

      {/* Completion Checklist */}
      <CompletionChecklist
        stepId={step.id}
        tasks={step.tasks}
        color={step.color}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {prevStep ? (
          <Link href={`/step/${prevStep.id}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {prevStep.number}. {prevStep.titleKo}
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              홈으로
            </Button>
          </Link>
        )}
        {nextStep ? (
          <Link href={`/step/${nextStep.id}`}>
            <Button className={`gap-2 ${nextStep.color.bg} hover:opacity-90`}>
              {nextStep.number}. {nextStep.titleKo}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/complete-example">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              통합 예제 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
