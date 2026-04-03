# TESOL Framework 개선 PRD

## 1. 개요

### 1.1 프로젝트 현황
- **프로젝트명**: TESOL Framework - 영어교사를 위한 앱 개발 가이드
- **Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Firebase
- **현재 상태**: 5단계 학습 프레임워크 + Firebase 인증 연동 완료
- **참조 앱**: [TESOL Connect Studio (tesol-bkit)](https://tesol-bkit.vercel.app/)

### 1.2 목표
tesol-bkit의 실용적 기능(퀴즈 빌더, 데모, 바이브 코딩 학습, 가이드)을
현재 tesol-framework의 5단계 학습 구조를 유지하면서 점진적으로 통합한다.

### 1.3 핵심 원칙
- **기존 구조 보존**: 5단계 학습 프레임워크(`/step/[id]`)와 기존 컴포넌트를 변경하지 않음
- **점진적 확장**: 새 페이지와 서비스를 독립적으로 추가
- **서비스 레이어 활용**: 기존 `lib/services/` 패턴을 따름
- **Mock 우선**: 모든 새 기능은 mock 데이터로 먼저 구현 후 실제 API 전환

---

## 2. 현재 아키텍처

### 2.1 라우트 구조
```
app/
├── page.tsx                    ← 홈 (5단계 개요 + 진행률)
├── step/[id]/page.tsx          ← 5단계 학습 페이지
├── complete-example/page.tsx   ← 통합 예제
├── login/page.tsx              ← 로그인
├── profile/page.tsx            ← 프로필
├── teacher/page.tsx            ← 교사 대시보드
└── api/demo-gemini/route.ts    ← Mock Gemini API
```

### 2.2 컴포넌트 구조
```
components/
├── ui/          ← shadcn/ui 기본 컴포넌트 (15개)
├── auth/        ← 인증 컴포넌트 (AuthButton, AuthGuard, UserMenu)
├── layout/      ← 레이아웃 (main-nav, step-sidebar, step-progress)
├── shared/      ← 공유 교육 컴포넌트 (code-block, checklist, demo-container, explanation-card)
└── steps/       ← 5단계별 컴포넌트 (step1~5)
```

### 2.3 서비스 레이어
```
lib/services/
├── auth.service.ts        ← Firebase Google 인증 (연동 완료)
├── progress.service.ts    ← 진행률 관리 (localStorage)
├── vocabulary.service.ts  ← 어휘 데이터 (mock)
└── learning.service.ts    ← 학습 기록/퀴즈 결과 (localStorage)
```

### 2.4 미전환 레거시
| 파일 | 상태 |
|------|------|
| `lib/use-progress.ts` | 구 훅 (4개 파일에서 사용 중) |
| `components/layout/step-sidebar.tsx` | 구 훅 import |
| `components/shared/completion-checklist.tsx` | 구 훅 import |
| `components/layout/step-progress.tsx` | 구 훅 import |
| `app/page.tsx` | 구 훅 import |

---

## 3. 개선 계획

### Phase 0: 레거시 정리 (사전 작업)

**목표**: 기존 코드의 일관성 확보

| 작업 | 설명 | 영향 범위 |
|------|------|-----------|
| 0-1 | 4개 파일의 `@/lib/use-progress` → `@/hooks/useProgress` import 전환 | step-sidebar, completion-checklist, step-progress, page.tsx |
| 0-2 | `getOverallCompletion()` → `overallCompletion`, `getStepCompletion(id)` → `stepCompletion(id)` API 맞춤 | 위 4개 파일 |
| 0-3 | 구 `lib/use-progress.ts`에 deprecation 주석 추가 (삭제는 Phase 1 이후) | use-progress.ts |

**리스크**: 낮음 (import 경로 변경 + 함수 호출 방식 변경만)

---

### Phase 1: 앱 가이드 페이지 (`/guide`)

**목표**: 플랫폼 소개 및 사용 안내 문서 페이지

**신규 파일**:
```
app/guide/page.tsx
components/guide/
├── guide-hero.tsx          ← 가이드 히어로 섹션
├── guide-purpose.tsx       ← 목적 및 대상 사용자
├── guide-features.tsx      ← 주요 기능 소개
├── guide-how-it-works.tsx  ← 작동 방식 (5단계 플로우)
└── guide-user-manual.tsx   ← 사용자 가이드
```

**구현 내용**:
- 앱의 목적, 대상 사용자 설명
- 주요 기능 카드 그리드
- 5단계 프레임워크 시각적 플로우 다이어그램
- 사용자 가이드 (시작하기, FAQ)
- 기존 `shared/explanation-card.tsx` 재활용

**의존성**: 없음 (독립 페이지)

---

### Phase 2: CSV 업로드 & 퀴즈 빌더 (`/builder`)

**목표**: CSV 단어장 업로드 → 설정 선택 → 퀴즈 자동 생성

**신규 파일**:
```
app/builder/page.tsx
components/builder/
├── csv-uploader.tsx        ← 드래그앤드롭 CSV 업로드
├── csv-preview.tsx         ← 업로드된 데이터 미리보기 테이블
├── quiz-settings.tsx       ← CEFR 레벨, 문제 유형, 개수 선택
├── quiz-generator.tsx      ← AI 생성 진행 표시
├── quiz-result-cards.tsx   ← 생성된 퀴즈 카드 표시
└── builder-stepper.tsx     ← 6단계 스텝 진행 표시
lib/services/
├── csv.service.ts          ← CSV 파싱 및 검증
└── quiz.service.ts         ← 퀴즈 생성 로직 (mock → Gemini)
lib/types/
├── csv.types.ts            ← CSV 데이터 타입
└── quiz.types.ts           ← 퀴즈 설정/결과 타입
```

**6단계 빌더 워크플로우**:
1. **목표 설정**: 퀴즈 목적 (복습/시험/숙제), 학년, 주제
2. **데이터 연결**: CSV 드래그앤드롭 업로드 + 데이터 미리보기
3. **설정 선택**: CEFR 레벨, 문제 유형 (객관식/빈칸/단답), 문제 수
4. **지시문 조합**: 프롬프트 미리보기 (자동 생성)
5. **AI 생성**: Mock → 실제 Gemini API로 퀴즈 생성
6. **결과 확인**: 퀴즈 카드 리뷰 + 수정 + 저장

**의존성**:
- 기존 `vocabulary.service.ts` 확장 (CSV 데이터 → VocabWord 변환)
- 기존 `mock-gemini.ts` 확장 (퀴즈 생성 mock 응답 추가)
- 기존 `learning.service.ts` 활용 (퀴즈 결과 저장)

---

### Phase 3: 빠른 데모 페이지 (`/demo`)

**목표**: 빌더의 6단계 워크플로우를 샘플 데이터로 인터랙티브 체험

**신규 파일**:
```
app/demo/page.tsx
components/demo/
├── demo-stepper.tsx        ← 데모 단계 진행 UI
└── demo-step-content.tsx   ← 각 단계별 데모 콘텐츠
```

**구현 내용**:
- Phase 2 빌더 컴포넌트를 재사용 (읽기 전용 모드)
- 사전 로드된 샘플 CSV 데이터 사용
- 자동 진행 또는 "다음" 버튼으로 단계 이동
- 로그인 불필요 (공개 페이지)

**의존성**: Phase 2 (빌더 컴포넌트 재사용)

---

### Phase 4: 바이브 코딩 학습 모듈 (`/learn`)

**목표**: Claude Code로 교육 앱을 만드는 실습 튜토리얼

**신규 파일**:
```
app/learn/page.tsx
components/learn/
├── learn-hero.tsx          ← 바이브 코딩 소개
├── learn-prerequisites.tsx ← 사전 준비사항
├── learn-step.tsx          ← 개별 학습 단계 컴포넌트
└── learn-prompt-block.tsx  ← AI 프롬프트 표시 블록
lib/constants/
└── learn-steps.ts          ← 6단계 학습 콘텐츠 데이터
```

**6단계 학습 콘텐츠**:
1. 프로젝트 초기화 (아키텍처 명세 프롬프트)
2. CSV 업로드 기능 구현 (드래그앤드롭)
3. 설정 UI 구현 (CEFR, 문제 유형)
4. AI 연동 (Gemini API 호출)
5. 결과 카드 표시
6. Vercel 배포

**구현 내용**:
- 각 단계별 설명 + Claude Code에 넣을 프롬프트 표시
- 기존 `shared/code-block.tsx` 재활용 (프롬프트 복사 기능)
- 기존 `shared/explanation-card.tsx` 재활용

**의존성**: 없음 (독립 콘텐츠 페이지)

---

### Phase 5: Gemini AI 실제 연동

**목표**: Mock API를 실제 Google Gemini API로 전환

**변경 파일**:
```
app/api/demo-gemini/route.ts    ← 실제 Gemini API 호출로 변경
app/api/quiz-generate/route.ts  ← 신규: 퀴즈 생성 전용 API
lib/services/
└── gemini.service.ts            ← 신규: Gemini API 래퍼 서비스
.env.local                       ← GEMINI_API_KEY 추가
.env.example                     ← GEMINI_API_KEY 키 추가
```

**구현 내용**:
- `gemini.service.ts`: API 호출, 프롬프트 템플릿, 응답 파싱
- `isGeminiConfigured()` 체크: 키 없으면 mock fallback 유지
- 기존 `mock-gemini.ts`는 fallback으로 유지 (삭제하지 않음)
- Rate limiting 및 에러 핸들링

**의존성**: Phase 2 (빌더에서 사용)
**환경변수**: `GEMINI_API_KEY` (Vercel에 등록)

---

### Phase 6: 교사 대시보드 강화

**목표**: 현재 카드 레이아웃을 실제 데이터 기반 대시보드로 강화

**변경/신규 파일**:
```
app/teacher/page.tsx                ← 기존 파일 리팩토링
app/teacher/vocabulary/page.tsx     ← 신규: 어휘 관리
app/teacher/students/page.tsx       ← 신규: 학생 진도
app/teacher/quiz-results/page.tsx   ← 신규: 퀴즈 결과 분석
components/teacher/
├── vocabulary-manager.tsx   ← CSV 업로드 + 어휘 CRUD
├── student-progress.tsx     ← 학생별 진행률 차트
└── quiz-analytics.tsx       ← 퀴즈 결과 분석 차트
```

**구현 내용**:
- 어휘 관리: CSV 업로드, 단어 추가/수정/삭제, 단원별 분류
- 학생 진도: Firestore에서 학생 진행률 조회, 약점 어휘 파악
- 퀴즈 결과: 정답률, 난이도별 분석, CEFR 레벨별 통계
- 기존 `vocabulary.service.ts`, `learning.service.ts` 확장

**의존성**: Phase 2 (CSV 서비스), Phase 5 (Firestore 데이터)

---

### Phase 7: Firestore 진행률 전환

**목표**: 진행률 저장소를 localStorage → Firestore로 전환

**변경 파일**:
```
lib/services/progress.service.ts   ← Firestore 읽기/쓰기 추가
lib/services/learning.service.ts   ← Firestore 읽기/쓰기 추가
```

**구현 내용**:
- 로그인 사용자: Firestore에 진행률 저장 (실시간 동기화)
- 비로그인 사용자: localStorage 유지 (기존 동작 보존)
- 로그인 시 localStorage → Firestore 마이그레이션 로직
- `onSnapshot` 리스너로 실시간 업데이트

**의존성**: Phase 0 (레거시 정리 후 진행)

---

## 4. 네비게이션 변경

### 4.1 메인 네비게이션 추가 항목
현재 `main-nav.tsx`의 Step 1~5 네비게이션은 유지하고,
별도의 헤더 링크 또는 홈페이지 CTA로 새 페이지를 연결한다.

```
기존 (변경 없음):
  [Logo] [Step1] [Step2] [Step3] [Step4] [Step5] [진행률] [Auth]

홈페이지에 CTA 버튼 추가:
  [빌더 시작하기 → /builder]
  [빠른 데모 → /demo]
  [바이브 코딩 배우기 → /learn]
  [앱 가이드 → /guide]
```

### 4.2 구현 방식
- `app/page.tsx` 홈페이지에 새 기능 카드 섹션 추가
- `main-nav.tsx`는 Phase 완료 후 필요시 확장 (드롭다운 또는 보조 네비)

---

## 5. Phase별 의존성 다이어그램

```
Phase 0 (레거시 정리)
  │
  ├── Phase 1 (가이드) ← 독립
  │
  ├── Phase 4 (바이브 코딩 학습) ← 독립
  │
  ├── Phase 2 (빌더)
  │     │
  │     ├── Phase 3 (데모) ← Phase 2 컴포넌트 재사용
  │     │
  │     └── Phase 5 (Gemini 연동)
  │           │
  │           └── Phase 6 (교사 대시보드 강화)
  │
  └── Phase 7 (Firestore 전환) ← Phase 0 이후 언제든
```

---

## 6. 파일 네이밍 규칙

기존 프로젝트 패턴을 따른다:

| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 | `app/{feature}/page.tsx` | `app/builder/page.tsx` |
| 컴포넌트 | `components/{feature}/{name}.tsx` (kebab-case) | `components/builder/csv-uploader.tsx` |
| 서비스 | `lib/services/{name}.service.ts` | `lib/services/csv.service.ts` |
| 타입 | `lib/types/{name}.types.ts` | `lib/types/quiz.types.ts` |
| 상수 | `lib/constants/{name}.ts` 또는 `lib/constants.ts` 확장 | `lib/constants/learn-steps.ts` |
| 훅 | `lib/hooks/use{Name}.ts` | `lib/hooks/useQuiz.ts` |

---

## 7. 예상 작업량

| Phase | 예상 신규 파일 수 | 기존 파일 변경 수 | 우선순위 |
|-------|------------------|------------------|----------|
| 0 - 레거시 정리 | 0 | 5 | 필수 (사전) |
| 1 - 가이드 | 6 | 1 (nav) | 높음 |
| 2 - 빌더 | 10+ | 2 (서비스 확장) | 높음 |
| 3 - 데모 | 3 | 0 | 중간 |
| 4 - 바이브 코딩 | 6 | 1 (nav) | 중간 |
| 5 - Gemini 연동 | 3 | 2 | 중간 |
| 6 - 교사 대시보드 | 7+ | 3 | 낮음 |
| 7 - Firestore 전환 | 0 | 2 | 낮음 |

---

## 8. 성공 기준

- [ ] Phase 0: 모든 파일이 새 useProgress 훅 사용, 빌드 성공
- [ ] Phase 1: `/guide` 페이지 접근 가능, 모든 섹션 렌더링
- [ ] Phase 2: CSV 업로드 → 퀴즈 생성 워크플로우 동작 (mock)
- [ ] Phase 3: 데모 6단계 전체 진행 가능
- [ ] Phase 4: 6단계 학습 콘텐츠 렌더링, 프롬프트 복사 가능
- [ ] Phase 5: 실제 Gemini API로 퀴즈 생성 동작
- [ ] Phase 6: 교사 대시보드에서 어휘/학생/퀴즈 관리 가능
- [ ] Phase 7: 로그인 사용자 진행률이 Firestore에 저장/복원
