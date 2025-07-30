-- AI 에이전트 조합 워크플로우 테이블 생성
-- 여러 AI 에이전트를 조합하여 복잡한 작업을 수행하는 워크플로우를 저장

-- 조합 워크플로우 테이블
CREATE TABLE combined_workflows (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  agents JSONB NOT NULL, -- 선택된 에이전트들의 정보
  prompt TEXT NOT NULL, -- 작업 요청
  result TEXT, -- 실행 결과
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_combined_workflows_user_id ON combined_workflows(user_id);
CREATE INDEX idx_combined_workflows_status ON combined_workflows(status);
CREATE INDEX idx_combined_workflows_created_at ON combined_workflows(created_at);

-- 업데이트 트리거 함수 (이미 존재한다면 생략)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_combined_workflows_updated_at 
    BEFORE UPDATE ON combined_workflows 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE combined_workflows ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
CREATE POLICY "Users can view their own workflows" ON combined_workflows
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflows" ON combined_workflows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" ON combined_workflows
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" ON combined_workflows
    FOR DELETE USING (auth.uid() = user_id); 