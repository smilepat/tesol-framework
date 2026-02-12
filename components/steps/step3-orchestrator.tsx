"use client";

import { useState } from "react";
import { SAMPLE_VOCAB_DATA } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoContainer } from "@/components/shared/demo-container";
import { ArrowDown, Combine, Database, FormInput, Sparkles } from "lucide-react";

const DEFAULT_TEMPLATE = `당신은 영어 교육 전문가입니다.

다음 단어 목록을 사용하여 {{QUESTION_TYPE}} 유형의
영어 어휘 문제를 {{WORD_COUNT}}개 만들어주세요.

학생의 수준: CEFR {{CEFR_LEVEL}}

단어 목록:
{{WORD_LIST}}

JSON 형식으로 반환해주세요.`;

export function Step3Orchestrator() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="flow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flow">데이터 흐름</TabsTrigger>
          <TabsTrigger value="builder">프롬프트 빌더</TabsTrigger>
          <TabsTrigger value="result">결합 결과</TabsTrigger>
        </TabsList>

        <TabsContent value="flow">
          <FlowDiagram />
        </TabsContent>
        <TabsContent value="builder">
          <PromptBuilder />
        </TabsContent>
        <TabsContent value="result">
          <CombinedResult />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlowDiagram() {
  return (
    <DemoContainer
      title="오케스트레이터 데이터 흐름"
      description="3가지 데이터 소스가 하나의 프롬프트로 결합되는 과정입니다."
      color={{
        bgLight: "bg-purple-50",
        border: "border-purple-300",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      }}
    >
      <div className="space-y-4">
        {/* Three Input Sources */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3 text-center">
              <Database className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-700">DB 데이터</p>
              <p className="text-[10px] text-blue-500 mt-1">
                단어, 뜻, 예문
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3 text-center">
              <FormInput className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-green-700">사용자 입력</p>
              <p className="text-[10px] text-green-500 mt-1">
                레벨, 문제수, 유형
              </p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3 text-center">
              <Sparkles className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-orange-700">프롬프트 템플릿</p>
              <p className="text-[10px] text-orange-500 mt-1">
                AI 지시문
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <ArrowDown className="h-6 w-6 text-purple-400" />
            <Badge className="bg-purple-100 text-purple-700 mt-1">
              <Combine className="h-3 w-3 mr-1" />
              결합 (Orchestrate)
            </Badge>
            <ArrowDown className="h-6 w-6 text-purple-400 mt-1" />
          </div>
        </div>

        {/* Output */}
        <Card className="border-purple-300 bg-purple-50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-purple-700 mb-2">
              결합된 최종 프롬프트
            </p>
            <pre className="text-[11px] text-purple-900 bg-white p-3 rounded border border-purple-200 whitespace-pre-wrap font-mono">
{`당신은 영어 교육 전문가입니다.

다음 단어 목록을 사용하여 객관식 유형의
영어 어휘 문제를 5개 만들어주세요.

학생의 수준: CEFR B1

단어 목록:
- environment: 환경 (예: We must protect...)
- significant: 중요한 (예: There has been...)
- consequence: 결과 (예: Climate change...)

JSON 형식으로 반환해주세요.`}
            </pre>
          </CardContent>
        </Card>

        {/* Arrow to AI */}
        <div className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-orange-400" />
        </div>
        <div className="text-center">
          <Badge className="bg-orange-100 text-orange-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Gemini API로 전송 (Step 4)
          </Badge>
        </div>
      </div>
    </DemoContainer>
  );
}

function PromptBuilder() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [cefrLevel, setCefrLevel] = useState("B1");
  const [wordCount, setWordCount] = useState("5");
  const [questionType, setQuestionType] = useState("객관식");

  const wordList = SAMPLE_VOCAB_DATA.slice(0, Number(wordCount) || 5)
    .map((w) => `- ${w.word}: ${w.meaningKo} (예: ${w.example.substring(0, 30)}...)`)
    .join("\n");

  const finalPrompt = template
    .replace("{{CEFR_LEVEL}}", cefrLevel)
    .replace("{{WORD_COUNT}}", wordCount)
    .replace("{{QUESTION_TYPE}}", questionType)
    .replace("{{WORD_LIST}}", wordList);

  return (
    <DemoContainer
      title="프롬프트 템플릿 빌더"
      description="템플릿의 변수({{...}})에 실제 데이터가 삽입되는 과정을 확인하세요."
      color={{
        bgLight: "bg-purple-50",
        border: "border-purple-300",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      }}
    >
      <div className="space-y-4">
        {/* Variables */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              {"{{CEFR_LEVEL}}"}
            </label>
            <select
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={cefrLevel}
              onChange={(e) => setCefrLevel(e.target.value)}
            >
              <option>A1</option>
              <option>A2</option>
              <option>B1</option>
              <option>B2</option>
              <option>C1</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              {"{{WORD_COUNT}}"}
            </label>
            <select
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
            >
              <option>3</option>
              <option>5</option>
              <option>7</option>
              <option>10</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              {"{{QUESTION_TYPE}}"}
            </label>
            <select
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option>객관식</option>
              <option>빈칸 채우기</option>
              <option>매칭</option>
              <option>번역</option>
            </select>
          </div>
        </div>

        {/* Template Editor */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            프롬프트 템플릿 (수정 가능)
          </label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="font-mono text-xs h-40"
          />
        </div>

        <div className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-purple-400" />
        </div>

        {/* Result */}
        <div>
          <label className="text-xs font-medium text-purple-700 mb-1 block">
            결합된 최종 프롬프트
          </label>
          <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-60 overflow-auto">
            {finalPrompt}
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

function CombinedResult() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRun = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(JSON.stringify(
        {
          prompt: "당신은 영어 교육 전문가입니다. ...",
          userInput: { cefrLevel: "B1", wordCount: 5, questionType: "객관식" },
          sheetData: SAMPLE_VOCAB_DATA.slice(0, 5).map((w) => ({
            word: w.word,
            meaning: w.meaningKo,
          })),
          metadata: {
            totalTokens: 342,
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      ));
      setRunning(false);
    }, 1500);
  };

  return (
    <DemoContainer
      title="데이터 결합 테스트"
      description="오케스트레이터가 실제로 어떤 데이터를 조합하는지 확인합니다."
      color={{
        bgLight: "bg-purple-50",
        border: "border-purple-300",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      }}
    >
      <div className="space-y-4">
        <Button
          onClick={handleRun}
          disabled={running}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {running ? "결합 중..." : "데이터 결합 실행"}
        </Button>

        {result && (
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">
              결합 결과 (JSON)
            </Badge>
            <pre className="bg-gray-950 text-green-400 p-4 rounded-lg text-xs font-mono overflow-auto max-h-80 whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </DemoContainer>
  );
}
