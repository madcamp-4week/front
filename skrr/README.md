# AI 에이전트 플랫폼

통합 AI 에이전트 플랫폼으로, 노션 블로그 생성과 웹사이트 개발 기능을 하나의 인터페이스에서 제공합니다.

## 주요 기능

### 🤖 통합 AI 에이전트
- **노션 블로그 생성**: AI가 주제를 연구하고 노션에 블로그 포스트를 자동으로 생성
- **웹사이트 개발**: AI가 Next.js 프로젝트를 생성하고 ZIP 파일로 다운로드 제공
- **데이터 분석**: AI가 데이터를 분석하고 비즈니스 인사이트와 차트를 생성
- **AI 선택 기능**: 대화창에서 원하는 AI 에이전트를 선택하여 사용 가능

### 🔗 AI 에이전트 조합 (Combine)
- **다중 에이전트 워크플로우**: 여러 AI 에이전트를 조합하여 복잡한 작업 수행
- **사전 정의된 에이전트**: 데이터 분석가, 개발자, 디자이너, 콘텐츠 작가 등 15개 전문 에이전트
- **커스텀 에이전트 생성**: 원하는 특성의 AI 에이전트를 직접 생성 가능
- **워크플로우 저장/관리**: 자주 사용하는 에이전트 조합을 저장하고 재사용

### 📱 사용자 인터페이스
- 모던하고 직관적인 UI/UX
- 실시간 채팅 인터페이스
- 파일 첨부 기능 (CSV, Excel, JSON, 이미지, 코드 파일 등)
- 대화 메모리 기능 (로컬 스토리지 기반)
- 생성 기록 관리 및 재사용
- 반응형 디자인 (모바일/데스크톱 지원)

### 🔐 인증 및 데이터 관리
- Supabase 기반 사용자 인증
- 생성 기록 자동 저장
- 사용자별 개인화된 경험

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python (CrewAI, OpenAI API)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 시작하기

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd skrr

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# Notion (블로그 생성용)
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_notion_database_id

# Serper (선택사항)
SERPER_API_KEY=your_serper_api_key
```

### 3. 데이터베이스 설정

Supabase에서 다음 SQL을 실행하여 필요한 테이블을 생성하세요:

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 히스토리 테이블
CREATE TABLE histories (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  input TEXT NOT NULL,
  agent_type TEXT DEFAULT 'blog' CHECK (agent_type IN ('blog', 'web', 'data')),
  title TEXT,
  url TEXT,
  project_name TEXT,
  project_dir TEXT,
  analysis_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 설정 테이블
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
  notion_token TEXT,
  notion_database_id TEXT,
  openai_api_key TEXT,
  gemini_api_key TEXT,
  serper_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_histories_user_agent_type ON histories(user_id, agent_type);
CREATE INDEX idx_histories_created_at ON histories(created_at DESC);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 사용 방법

### 1. 회원가입/로그인
- 이메일/비밀번호 또는 소셜 로그인(Google, GitHub) 지원

### 2. AI 에이전트 선택
- **노션 블로그 생성**: 블로그 주제나 키워드 입력
- **웹사이트 개발**: 웹사이트 설명 입력
- **데이터 분석**: 데이터 분석 요청 입력 (예: Q1 매출 분석, 고객 행동 패턴 분석)

### 3. 파일 첨부 및 메모리
- **파일 첨부**: 📎 버튼을 클릭하여 관련 파일 업로드 (CSV, Excel, 이미지, 코드 등)
- **대화 메모리**: 🧠 버튼을 클릭하여 중요한 대화를 저장하고 재사용
- **사용자 설정**: ⚙️ 버튼을 클릭하여 개인 API 키와 노션 설정 관리

### 4. 결과 확인
- **블로그**: 생성된 노션 페이지 링크 제공
- **웹사이트**: ZIP 파일 다운로드 링크 제공
- **데이터 분석**: 분석 요약, 주요 권장사항, 차트 추천 제공

### 5. 기록 관리
- 사이드바에서 이전 생성 기록 확인
- 기록 클릭으로 결과 재확인 가능
- 대화 메모리에서 중요한 대화 저장 및 재사용

## 프로젝트 구조

```
skrr/
├── app/
│   ├── main/           # 통합 AI 에이전트 페이지
│   ├── api/
│   │   ├── generate/   # 블로그 생성 API
│   │   └── web/        # 웹사이트 생성 API
│   └── ...
├── components/         # 재사용 가능한 컴포넌트
├── lib/               # 유틸리티 및 설정
├── python/            # Python 백엔드 스크립트
│   ├── blog_agent.py  # 블로그 생성 에이전트
│   ├── web_builder_agent.py # 웹사이트 생성 에이전트
│   └── data_analysis_agent.py # 데이터 분석 에이전트
└── ...
```

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 수동 배포

```bash
npm run build
npm start
```

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.
