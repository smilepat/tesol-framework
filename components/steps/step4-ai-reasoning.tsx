"use client";

import { useState } from "react";
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
import { Loader2, Send, Sparkles, Gauge, Clock, Zap } from "lucide-react";

export function Step4AiReasoning() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="playground" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="playground">API 플레이그라운드</TabsTrigger>
          <TabsTrigger value="params">파라미터 가이드</TabsTrigger>
          <TabsTrigger value="parsing">응답 파싱</TabsTrigger>
        </TabsList>

        <TabsContent value="playground">
          <ApiPlayground />
        </TabsContent>
        <TabsContent value="params">
          <ParameterGuide />
        </TabsContent>
        <TabsContent value="parsing">
          <ResponseParsing />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApiPlayground() {
  const [prompt, setPrompt] = useState(
    "environment 단어에 대한 객관식 문제를 1개 만들어주세요."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    model: string;
    tokensUsed: number;
    latencyMs: number;
  } | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setMetadata(null);

    try {
      const res = await fetch("/api/demo-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, temperature }),
      });
      const data = await res.json();
      setResponse(data.response);
      setMetadata(data.metadata);
    } catch {
      setResponse("API 호출 중 오류가 발생했습니다. (Mock API가 로드되지 않았을 수 있습니다)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DemoContainer
      title="Gemini API 플레이그라운드"
      description="프롬프트를 입력하고 AI 응답을 확인합니다. (시뮬레이션 모드)"
      color={{
        bgLight: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      }}
    >
      <div className="space-y-4">
        {/* Mode Badge */}
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Zap className="h-3 w-3 mr-1" />
          데모 모드 (Mock API 사용)
        </Badge>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            프롬프트 입력
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24"
            placeholder="AI에게 보낼 프롬프트를 입력하세요..."
          />
        </div>

        {/* Temperature Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Temperature: {temperature}
            </label>
            <span className="text-xs text-gray-500">
              {temperature < 0.3
                ? "정확한 답변"
                : temperature < 0.7
                  ? "균형잡힌"
                  : "창의적 답변"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0 (정확)</span>
            <span>1 (창의적)</span>
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              AI 응답 생성 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              프롬프트 전송
            </>
          )}
        </Button>

        {/* Response */}
        {response && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">AI 응답</span>
            </div>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-60 overflow-auto">
              {response}
            </div>

            {/* Metadata */}
            {metadata && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {metadata.model}
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="h-3 w-3" />
                  {metadata.tokensUsed} tokens
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {metadata.latencyMs}ms
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Prompts */}
        <div>
          <p className="text-xs text-gray-500 mb-2">빠른 테스트 프롬프트:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "어휘 문제를 만들어주세요",
              "빈칸 채우기 문제 생성",
              "학습 피드백을 제공해주세요",
            ].map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setPrompt(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

function ParameterGuide() {
  return (
    <DemoContainer
      title="API 파라미터 가이드"
      description="Gemini API의 주요 파라미터를 이해합니다."
      color={{
        bgLight: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      }}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              temperature
              <Badge variant="secondary" className="text-[10px]">0 ~ 1</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>AI 응답의 <strong>창의성/무작위성</strong>을 조절합니다.</p>
            <ul className="space-y-1">
              <li><strong>0~0.3:</strong> 정확하고 일관된 답변 (평가 문제 생성에 적합)</li>
              <li><strong>0.4~0.7:</strong> 균형잡힌 답변 (일반적인 사용)</li>
              <li><strong>0.8~1.0:</strong> 창의적이고 다양한 답변 (브레인스토밍)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              maxTokens
              <Badge variant="secondary" className="text-[10px]">숫자</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>AI 응답의 <strong>최대 길이</strong>를 제한합니다.</p>
            <ul className="space-y-1">
              <li><strong>256:</strong> 짧은 답변 (단일 문제)</li>
              <li><strong>1024:</strong> 중간 답변 (문제 + 해설)</li>
              <li><strong>4096:</strong> 긴 답변 (전체 시험지)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              model
              <Badge variant="secondary" className="text-[10px]">문자열</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>사용할 <strong>AI 모델</strong>을 선택합니다.</p>
            <ul className="space-y-1">
              <li><strong>gemini-1.5-flash:</strong> 빠르고 경제적 (일반 용도)</li>
              <li><strong>gemini-1.5-pro:</strong> 더 정확하고 강력 (복잡한 문제)</li>
              <li><strong>gemini-2.0-flash:</strong> 최신 모델 (추천)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DemoContainer>
  );
}

function ResponseParsing() {
  const sampleResponse = `{
  "question": "다음 중 'environment'의 의미로 가장 적절한 것은?",
  "options": [
    "A) 장비, 도구",
    "B) 주변 환경, 여건",
    "C) 오락, 유흥",
    "D) 건축물, 구조물"
  ],
  "answer": "B",
  "explanation": "'environment'는 주변 환경이나 여건을 의미합니다."
}`;

  return (
    <DemoContainer
      title="응답 파싱 방법"
      description="AI가 반환한 JSON 텍스트를 JavaScript 객체로 변환합니다."
      color={{
        bgLight: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      }}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">1. AI 원본 응답 (문자열)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono whitespace-pre-wrap">
              {sampleResponse}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">2. JSON.parse()로 변환</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-950 text-orange-300 p-3 rounded text-xs font-mono whitespace-pre-wrap">
{`// AI 응답을 JavaScript 객체로 변환
const result = JSON.parse(aiResponse);

// 이제 각 필드에 접근 가능
console.log(result.question);  // "다음 중..."
console.log(result.answer);    // "B"
console.log(result.options);   // ["A) ...", "B) ...", ...]`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">3. 에러 처리 패턴</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-950 text-yellow-300 p-3 rounded text-xs font-mono whitespace-pre-wrap">
{`try {
  const result = JSON.parse(aiResponse);
  // 성공: 결과 사용
  displayQuestion(result);
} catch (error) {
  // 실패: AI가 올바른 JSON을 반환하지 않은 경우
  console.error('JSON 파싱 실패:', error);
  // 사용자에게 에러 메시지 표시
  showError('문제 생성에 실패했습니다. 다시 시도해주세요.');
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </DemoContainer>
  );
}
