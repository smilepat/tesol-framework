export interface LearnStep {
  number: number;
  title: string;
  titleKo: string;
  description: string;
  prompt: string;
  tips: string[];
  color: string;
}

export const LEARN_STEPS: LearnStep[] = [
  {
    number: 1,
    title: "Project Init",
    titleKo: "프로젝트 초기화",
    description: "Next.js 프로젝트를 생성하고, 기술 스택과 아키텍처를 명세합니다.",
    prompt: `다음 조건으로 Next.js 프로젝트를 만들어줘:

- Next.js 16 + TypeScript + Tailwind CSS 4
- shadcn/ui 컴포넌트 라이브러리 사용
- App Router 구조
- 영어 어휘 퀴즈 생성 앱
- 한국어 UI
- 프로젝트 이름: tesol-quiz-app

먼저 프로젝트 구조를 설계하고,
필요한 패키지를 설치해줘.`,
    tips: [
      "기술 스택을 명확히 지정하면 AI가 일관된 코드를 생성합니다",
      "한국어 UI임을 미리 알려주면 i18n 관련 설정을 자동으로 해줍니다",
      "프로젝트 구조를 먼저 요청하면 전체 그림을 파악할 수 있습니다",
    ],
    color: "bg-blue-600",
  },
  {
    number: 2,
    title: "CSV Upload",
    titleKo: "CSV 업로드 기능",
    description: "드래그앤드롭으로 CSV 단어장을 업로드하고 데이터를 미리보는 기능을 만듭니다.",
    prompt: `CSV 파일 업로드 기능을 만들어줘:

1. 드래그앤드롭 업로드 영역
2. 파일 선택 버튼
3. CSV 파싱 후 테이블로 미리보기
4. 컬럼: word, meaning, meaningKo, example, cefrLevel, domain
5. 업로드된 데이터를 상태로 관리
6. 에러 처리 (잘못된 형식, 빈 파일 등)

shadcn/ui Card, Table 컴포넌트를 활용해줘.`,
    tips: [
      "구체적인 컬럼명을 지정하면 정확한 타입 정의가 생성됩니다",
      "에러 처리를 요청하면 더 안정적인 코드가 만들어집니다",
      "사용할 UI 컴포넌트를 명시하면 일관된 디자인이 유지됩니다",
    ],
    color: "bg-green-600",
  },
  {
    number: 3,
    title: "Settings UI",
    titleKo: "설정 UI 구현",
    description: "CEFR 레벨, 문제 유형, 문제 수 등 퀴즈 생성 옵션을 선택하는 UI를 만듭니다.",
    prompt: `퀴즈 설정 UI를 만들어줘:

1. CEFR 레벨 선택 (A1~C2 드롭다운)
2. 문제 유형 선택 (객관식, 빈칸 채우기, 단답형 - 복수 선택 가능)
3. 문제 수 입력 (5, 10, 15, 20개 중 선택)
4. 퀴즈 목적 선택 (수업 복습, 중간/기말, 숙제)
5. 학년 선택 (중1~3, 고1~3)
6. 설정값을 상태로 관리
7. "퀴즈 생성" 버튼

shadcn/ui의 Select, Checkbox, Button을 사용해줘.`,
    tips: [
      "선택지를 구체적으로 나열하면 AI가 정확한 enum/옵션을 만듭니다",
      "상태 관리 방식을 요청하면 React state 패턴을 적용해줍니다",
      "각 필드의 용도를 설명하면 적절한 validation이 추가됩니다",
    ],
    color: "bg-orange-600",
  },
  {
    number: 4,
    title: "AI Integration",
    titleKo: "AI 연동",
    description: "설정값과 단어 데이터를 조합하여 Gemini API로 퀴즈를 생성합니다.",
    prompt: `Gemini API 연동으로 퀴즈를 생성해줘:

1. /api/generate-quiz API 라우트 생성
2. 요청: CSV 단어 데이터 + 사용자 설정 (CEFR, 문제유형, 개수)
3. 프롬프트 템플릿: 단어, 뜻, 예문을 기반으로 퀴즈 생성
4. 응답: JSON 형태의 퀴즈 배열
   - question, options (객관식), correctAnswer, explanation
5. Mock 모드: API 키 없으면 샘플 데이터 반환
6. 로딩 상태 표시
7. 에러 핸들링

환경변수: GEMINI_API_KEY를 사용해줘.`,
    tips: [
      "Mock 모드를 요청하면 API 키 없이도 개발할 수 있습니다",
      "응답 JSON 구조를 명시하면 타입 안전한 코드가 생성됩니다",
      "프롬프트 템플릿을 별도 파일로 분리하면 나중에 수정이 쉽습니다",
    ],
    color: "bg-purple-600",
  },
  {
    number: 5,
    title: "Result Display",
    titleKo: "결과 카드 표시",
    description: "생성된 퀴즈를 카드 형태로 표시하고, 정답 하이라이트와 교사 노트를 추가합니다.",
    prompt: `퀴즈 결과를 카드 형태로 표시해줘:

1. 각 문제를 카드로 표시
2. 문제 번호, 유형 배지 표시
3. 객관식: 선택지 목록, 정답 하이라이트 (초록색)
4. 빈칸 채우기: 문장에서 빈칸 표시
5. 정답 해설 토글 (접기/펼치기)
6. 교사 노트 입력란 (각 문제별)
7. 전체 퀴즈 다운로드 버튼 (JSON)
8. 문제 순서 셔플 기능

shadcn/ui Card, Accordion, Badge를 활용해줘.`,
    tips: [
      "카드 레이아웃의 세부사항을 요청하면 완성도 높은 UI가 나옵니다",
      "인터랙티브 요소(토글, 셔플)를 미리 요청하세요",
      "다운로드 기능은 실용적이므로 꼭 포함하세요",
    ],
    color: "bg-pink-600",
  },
  {
    number: 6,
    title: "Deploy",
    titleKo: "Vercel 배포",
    description: "완성된 앱을 Vercel에 배포하고 공유합니다.",
    prompt: `이 앱을 Vercel에 배포할 수 있도록 준비해줘:

1. .env.example 파일 생성 (키 이름만)
2. next.config.ts에 필요한 설정 추가
3. package.json에 setup 스크립트 추가:
   "setup": "vercel link && vercel env pull .env.local && npm install"
4. README.md에 배포 가이드 작성
5. .gitignore에 .env.local 포함 확인

Vercel CLI 사용 기준으로 안내해줘.`,
    tips: [
      "환경변수 관리를 명확히 해야 배포 후 문제가 없습니다",
      "setup 스크립트를 만들면 다른 PC에서도 쉽게 시작할 수 있습니다",
      "README에 배포 가이드를 작성하면 나중에 참고하기 좋습니다",
    ],
    color: "bg-gray-700",
  },
];
