"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoContainer } from "@/components/shared/demo-container";

export function Step2UserInput() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms">폼 입력 패턴</TabsTrigger>
          <TabsTrigger value="modal">모달/대화상자</TabsTrigger>
          <TabsTrigger value="preview">실시간 미리보기</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <FormShowcase />
        </TabsContent>
        <TabsContent value="modal">
          <ModalDemo />
        </TabsContent>
        <TabsContent value="preview">
          <LivePreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormShowcase() {
  const [formData, setFormData] = useState({
    cefrLevel: "B1",
    wordCount: "10",
    questionType: "multiple-choice",
    domain: "academic",
  });

  return (
    <DemoContainer
      title="학습 설정 폼 예제"
      description="학생이 학습 조건을 선택하는 폼입니다. 값을 변경해보세요!"
      color={{
        bgLight: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              CEFR 레벨
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.cefrLevel}
              onChange={(e) => setFormData({ ...formData, cefrLevel: e.target.value })}
            >
              <option value="A1">A1 - 입문</option>
              <option value="A2">A2 - 초급</option>
              <option value="B1">B1 - 중급</option>
              <option value="B2">B2 - 중상급</option>
              <option value="C1">C1 - 고급</option>
              <option value="C2">C2 - 최상급</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              단어 수
            </label>
            <Input
              type="number"
              min={5}
              max={30}
              value={formData.wordCount}
              onChange={(e) => setFormData({ ...formData, wordCount: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              문제 유형
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
            >
              <option value="multiple-choice">객관식</option>
              <option value="fill-blank">빈칸 채우기</option>
              <option value="matching">매칭</option>
              <option value="translation">번역</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              도메인
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            >
              <option value="academic">학술 (Academic)</option>
              <option value="business">비즈니스 (Business)</option>
              <option value="daily">일상 (Daily)</option>
              <option value="technical">기술 (Technical)</option>
            </select>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            학습 시작
          </Button>
        </div>

        {/* Live State Preview */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            현재 상태 (State)
          </h4>
          <pre className="bg-gray-950 text-green-400 text-xs p-4 rounded-lg overflow-auto font-mono">
{`const [formData, setFormData] = useState({
  cefrLevel: "${formData.cefrLevel}",
  wordCount: ${formData.wordCount},
  questionType: "${formData.questionType}",
  domain: "${formData.domain}",
});`}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            폼 값을 변경하면 위 코드의 상태가 실시간으로 바뀝니다.
          </p>
        </div>
      </div>
    </DemoContainer>
  );
}

function ModalDemo() {
  return (
    <DemoContainer
      title="모달/대화상자 패턴"
      description="추가 입력이 필요할 때 모달(Dialog)을 사용합니다."
      color={{
        bgLight: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      }}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">사용 시나리오</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-1">
            <p>- 새 단어 추가하기</p>
            <p>- 학습 결과 상세 보기</p>
            <p>- 설정 변경 확인</p>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              새 단어 추가하기 (모달 열기)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 단어 추가</DialogTitle>
              <DialogDescription>
                학습할 새로운 단어를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">영어 단어</label>
                <Input placeholder="예: environment" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">한국어 뜻</label>
                <Input placeholder="예: 환경" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">예문</label>
                <Textarea placeholder="예: We must protect the environment." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">CEFR 레벨</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>A1</option>
                  <option>A2</option>
                  <option>B1</option>
                  <option>B2</option>
                  <option>C1</option>
                  <option>C2</option>
                </select>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                추가하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DemoContainer>
  );
}

function LivePreview() {
  const [inputText, setInputText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");

  return (
    <DemoContainer
      title="실시간 미리보기"
      description="입력값이 변경되면 결과가 즉시 업데이트됩니다."
      color={{
        bgLight: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Side */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">입력</h4>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">학습할 주제</label>
            <Input
              placeholder="예: 환경 보호, 기후 변화"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">난이도</label>
            <div className="flex gap-2">
              {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={selectedLevel === level ? "bg-green-600" : ""}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">미리보기</h4>
          <Card className="bg-green-50/50">
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">주제:</span>
                  <span className="font-medium">
                    {inputText || "(입력해주세요)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">난이도:</span>
                  <Badge variant="outline">{selectedLevel}</Badge>
                </div>
                <div className="pt-2 border-t mt-2">
                  <p className="text-xs text-gray-500">
                    AI 프롬프트에 전달될 내용:
                  </p>
                  <p className="text-xs font-mono mt-1 bg-white p-2 rounded border">
                    &quot;{inputText || "___"}&quot; 주제에 대해 CEFR {selectedLevel} 수준의 어휘 문제를 생성해주세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DemoContainer>
  );
}
