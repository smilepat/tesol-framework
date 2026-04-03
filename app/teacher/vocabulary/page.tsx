"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CsvService } from "@/lib/services/csv.service";
import { VocabularyStoreService } from "@/lib/services/vocabulary-store.service";
import { CsvRow } from "@/lib/types/quiz.types";
import {
  Upload,
  Plus,
  Search,
  Trash2,
  Edit3,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function VocabularyPage() {
  const { user } = useAuth();
  const [words, setWords] = useState<CsvRow[]>([]);
  const [search, setSearch] = useState("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.uid || 'anonymous';

  // Load vocabulary on mount
  useEffect(() => {
    (async () => {
      const saved = await VocabularyStoreService.load(userId);
      setWords(saved.length > 0 ? saved : CsvService.getSampleData());
      setLoading(false);
    })();
  }, [userId]);

  const handleFile = useCallback(async (file: File) => {
    try {
      setCsvError(null);
      CsvService.validateFile(file);
      const text = await CsvService.readFile(file);
      const rows = CsvService.parse(text);
      const combined = await VocabularyStoreService.addWords(userId, rows);
      setWords(combined);
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : "파일 처리 오류");
    }
  }, [userId]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const deleteWord = async (index: number) => {
    const updated = await VocabularyStoreService.deleteWord(userId, words, index);
    setWords(updated);
  };

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.meaningKo.toLowerCase().includes(search.toLowerCase()) ||
    w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const cefrCounts = words.reduce((acc, w) => {
    const level = w.cefrLevel || "N/A";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login"><Button className="mt-4">로그인</Button></Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teacher">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">어휘 관리</h1>
          <p className="text-sm text-gray-500">단어장 CSV 업로드, 편집, 관리</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{words.length}</div>
            <p className="text-xs text-gray-500">전체 단어</p>
          </CardContent>
        </Card>
        {Object.entries(cefrCounts).sort().slice(0, 3).map(([level, count]) => (
          <Card key={level}>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-gray-500">CEFR {level}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="cursor-pointer">
          <Button variant="outline" asChild>
            <span><Upload className="h-4 w-4 mr-2" />CSV 업로드</span>
          </Button>
          <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" />
        </label>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="단어 검색..."
            className="pl-9"
          />
        </div>
      </div>

      {csvError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          {csvError}
        </div>
      )}

      {/* Word Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            단어 목록 ({filtered.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Word</th>
                  <th className="px-3 py-2 text-left font-medium">뜻 (한국어)</th>
                  <th className="px-3 py-2 text-left font-medium">예문</th>
                  <th className="px-3 py-2 text-left font-medium">CEFR</th>
                  <th className="px-3 py-2 text-left font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{row.word}</td>
                    <td className="px-3 py-2 text-gray-600">{row.meaningKo || row.meaning}</td>
                    <td className="px-3 py-2 text-gray-500 text-xs max-w-[200px] truncate">{row.example}</td>
                    <td className="px-3 py-2"><Badge variant="secondary" className="text-xs">{row.cefrLevel || "-"}</Badge></td>
                    <td className="px-3 py-2">
                      <button onClick={() => deleteWord(words.indexOf(row))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
