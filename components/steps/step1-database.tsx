"use client";

import { useState } from "react";
import { SAMPLE_SHEET_HEADERS, SAMPLE_SHEET_ROWS, SAMPLE_VOCAB_DATA } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoContainer } from "@/components/shared/demo-container";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Table,
  Search,
  Loader2,
} from "lucide-react";

export function Step1Database() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="viewer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="viewer">시트 데이터 뷰어</TabsTrigger>
          <TabsTrigger value="connection">연결 테스트</TabsTrigger>
          <TabsTrigger value="structure">데이터 구조</TabsTrigger>
        </TabsList>

        <TabsContent value="viewer">
          <SheetViewer />
        </TabsContent>
        <TabsContent value="connection">
          <ConnectionTester />
        </TabsContent>
        <TabsContent value="structure">
          <DataStructureGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SheetViewer() {
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredRows = SAMPLE_SHEET_ROWS.filter((row) => {
    if (!filter) return true;
    return Object.values(row).some((v) =>
      v.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <DemoContainer
      title="구글 시트 데이터 뷰어"
      description="실제 앱에서는 Google Sheets API를 통해 이 데이터를 불러옵니다."
      color={{
        bgLight: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      }}
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색어 입력... (예: environment, B1)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">{loading ? "로딩..." : "새로고침"}</span>
          </Button>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">
            총 <strong>{filteredRows.length}</strong>개 단어
          </span>
          {filter && (
            <Badge variant="secondary" className="text-xs">
              필터: &quot;{filter}&quot;
            </Badge>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                {SAMPLE_SHEET_HEADERS.map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-blue-700 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {SAMPLE_SHEET_HEADERS.map((h) => (
                    <td key={h} className="px-3 py-2 text-xs text-gray-700 max-w-48 truncate">
                      {h === "CEFR" ? (
                        <Badge variant="outline" className="text-[10px]">
                          {row[h]}
                        </Badge>
                      ) : (
                        row[h]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DemoContainer>
  );
}

function ConnectionTester() {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [sheetUrl, setSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1ABC...xyz/edit");

  const handleTest = () => {
    setStatus("testing");
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <DemoContainer
      title="시트 연결 테스트"
      description="구글 시트 URL을 입력하고 연결 상태를 테스트합니다. (시뮬레이션)"
      color={{
        bgLight: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            구글 시트 URL
          </label>
          <Input
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>

        <Button onClick={handleTest} disabled={status === "testing"} className="bg-blue-600 hover:bg-blue-700">
          {status === "testing" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              연결 테스트 중...
            </>
          ) : (
            "연결 테스트"
          )}
        </Button>

        {status === "success" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">연결 성공!</span>
              </div>
              <div className="mt-3 text-sm text-green-600 space-y-1">
                <p>- 시트 이름: 단어목록</p>
                <p>- 데이터 행 수: {SAMPLE_VOCAB_DATA.length}개</p>
                <p>- 열 수: {SAMPLE_SHEET_HEADERS.length}개</p>
                <p>- 마지막 수정: 2025-03-01 09:00</p>
              </div>
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">연결 실패</span>
              </div>
              <p className="mt-2 text-sm text-red-600">
                시트에 접근할 수 없습니다. URL과 권한을 확인해주세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DemoContainer>
  );
}

function DataStructureGuide() {
  return (
    <DemoContainer
      title="데이터 구조 설계 가이드"
      description="효과적인 교육 데이터 구조의 핵심 원칙을 살펴봅니다."
      color={{
        bgLight: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      }}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">1. 헤더 행 규칙</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>첫 번째 행은 항상 <strong>헤더(열 이름)</strong>로 사용합니다.</p>
            <div className="bg-gray-50 p-2 rounded font-mono">
              | Word | Meaning | Korean | Example | CEFR | Domain |
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">2. 일관된 데이터 형식</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>같은 열에는 같은 형식의 데이터를 넣습니다.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>CEFR 레벨: A1, A2, B1, B2, C1, C2 중 하나</li>
              <li>Domain: academic, business, daily 등 정해진 값</li>
              <li>날짜: YYYY-MM-DD 형식 통일</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">3. 시트별 역할 분리</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>하나의 구글 스프레드시트에 여러 시트를 만들어 역할을 나눕니다.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>단어목록</strong>: 학습 대상 단어 데이터</li>
              <li><strong>학습기록</strong>: 학생별 학습 이력 로그</li>
              <li><strong>설정</strong>: 앱 설정값 (레벨, 도메인 목록 등)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">4. API 접근 설정</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>구글 시트를 API로 연동하려면:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Google Cloud Console에서 프로젝트 생성</li>
              <li>Google Sheets API 활성화</li>
              <li>서비스 계정 생성 및 키 발급</li>
              <li>시트에 서비스 계정 이메일 공유</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DemoContainer>
  );
}
