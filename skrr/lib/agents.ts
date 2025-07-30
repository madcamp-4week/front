export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  category: string;
  icon: string;
  isCustom?: boolean;
}

export const defaultAgents: Agent[] = [
  // 데이터 분석 관련
  {
    id: 'data-analyst',
    name: '데이터 분석가',
    role: '데이터 분석 및 통계 처리',
    description: '데이터를 분석하고 통계적 인사이트를 제공합니다',
    category: 'data',
    icon: '📊'
  },
  {
    id: 'data-visualizer',
    name: '데이터 시각화 전문가',
    role: '차트 및 그래프 생성',
    description: '데이터를 시각적으로 표현하는 차트와 그래프를 만듭니다',
    category: 'data',
    icon: '📈'
  },
  {
    id: 'business-analyst',
    name: '비즈니스 분석가',
    role: '비즈니스 인사이트 도출',
    description: '데이터를 바탕으로 비즈니스 전략과 인사이트를 제공합니다',
    category: 'business',
    icon: '💼'
  },

  // 웹 개발 관련
  {
    id: 'frontend-developer',
    name: '프론트엔드 개발자',
    role: '사용자 인터페이스 개발',
    description: 'React, Vue, Angular 등을 사용한 프론트엔드 개발',
    category: 'development',
    icon: '🎨'
  },
  {
    id: 'backend-developer',
    name: '백엔드 개발자',
    role: '서버 및 API 개발',
    description: 'Node.js, Python, Java 등을 사용한 백엔드 개발',
    category: 'development',
    icon: '⚙️'
  },
  {
    id: 'fullstack-developer',
    name: '풀스택 개발자',
    role: '전체 스택 개발',
    description: '프론트엔드와 백엔드를 모두 개발합니다',
    category: 'development',
    icon: '🔄'
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX 디자이너',
    role: '사용자 경험 설계',
    description: '사용자 친화적인 인터페이스와 경험을 설계합니다',
    category: 'design',
    icon: '🎯'
  },

  // 콘텐츠 관련
  {
    id: 'content-writer',
    name: '콘텐츠 작가',
    role: '글쓰기 및 편집',
    description: '블로그, 기사, 마케팅 콘텐츠 작성',
    category: 'content',
    icon: '✍️'
  },
  {
    id: 'technical-writer',
    name: '기술 문서 작성자',
    role: '기술 문서 작성',
    description: 'API 문서, 사용자 가이드, 기술 매뉴얼 작성',
    category: 'content',
    icon: '📝'
  },
  {
    id: 'researcher',
    name: '리서처',
    role: '정보 수집 및 분석',
    description: '주제에 대한 깊이 있는 조사와 정보 수집',
    category: 'research',
    icon: '🔍'
  },
  {
    id: 'domain-expert',
    name: '도메인 전문가',
    role: '특정 분야 전문 지식',
    description: '특정 분야의 전문 지식과 경험을 제공',
    category: 'expert',
    icon: '🎓'
  },

  // 마케팅 관련
  {
    id: 'marketing-specialist',
    name: '마케팅 전문가',
    role: '마케팅 전략 수립',
    description: '브랜딩, 광고, 홍보 전략 수립',
    category: 'marketing',
    icon: '📢'
  },
  {
    id: 'seo-specialist',
    name: 'SEO 전문가',
    role: '검색 엔진 최적화',
    description: '웹사이트 검색 엔진 최적화 및 키워드 전략',
    category: 'marketing',
    icon: '🔎'
  },

  // 창작 관련
  {
    id: 'creative-director',
    name: '크리에이티브 디렉터',
    role: '창의적 방향 설정',
    description: '전체적인 창작 방향과 컨셉을 설정합니다',
    category: 'creative',
    icon: '🎭'
  },
  {
    id: 'graphic-designer',
    name: '그래픽 디자이너',
    role: '시각 디자인',
    description: '로고, 배너, 인포그래픽 등 시각적 요소 디자인',
    category: 'design',
    icon: '🎨'
  }
];

export const categoryColors = {
  data: 'bg-blue-500/20 border-blue-500/30',
  business: 'bg-green-500/20 border-green-500/30',
  development: 'bg-purple-500/20 border-purple-500/30',
  design: 'bg-pink-500/20 border-pink-500/30',
  content: 'bg-yellow-500/20 border-yellow-500/30',
  research: 'bg-orange-500/20 border-orange-500/30',
  expert: 'bg-indigo-500/20 border-indigo-500/30',
  marketing: 'bg-red-500/20 border-red-500/30',
  creative: 'bg-teal-500/20 border-teal-500/30'
};

export const getCategoryAgents = (category: string) => {
  return defaultAgents.filter(agent => agent.category === category);
};

export const getCategories = () => {
  return [...new Set(defaultAgents.map(agent => agent.category))];
};

export const simulateAgentWork = async (agent: Agent, prompt: string): Promise<string> => {
  // 실제 구현에서는 각 에이전트의 특성에 맞는 API 호출
  await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션용 지연
  
  const responses = {
    'data-analyst': '데이터 분석이 완료되었습니다. 주요 트렌드와 패턴을 발견했습니다.',
    'data-visualizer': '데이터 시각화가 완료되었습니다. 차트와 그래프가 생성되었습니다.',
    'business-analyst': '비즈니스 분석이 완료되었습니다. 전략적 인사이트를 도출했습니다.',
    'frontend-developer': '프론트엔드 코드가 생성되었습니다. React 컴포넌트와 스타일링이 포함되어 있습니다.',
    'backend-developer': '백엔드 API가 설계되었습니다. 데이터베이스 스키마와 엔드포인트가 준비되었습니다.',
    'fullstack-developer': '풀스택 개발이 완료되었습니다. 프론트엔드와 백엔드가 모두 구현되었습니다.',
    'ui-ux-designer': 'UI/UX 디자인이 완료되었습니다. 사용자 경험을 최적화했습니다.',
    'content-writer': '콘텐츠가 작성되었습니다. SEO 최적화된 구조로 구성되어 있습니다.',
    'technical-writer': '기술 문서가 작성되었습니다. 명확하고 체계적인 문서를 생성했습니다.',
    'researcher': '관련 정보를 수집하고 분석했습니다. 최신 트렌드와 데이터를 포함합니다.',
    'domain-expert': '도메인 전문 지식을 바탕으로 분석을 완료했습니다.',
    'marketing-specialist': '마케팅 전략이 수립되었습니다. 효과적인 홍보 방안을 제시했습니다.',
    'seo-specialist': 'SEO 최적화가 완료되었습니다. 검색 엔진 순위를 개선했습니다.',
    'creative-director': '창의적 방향이 설정되었습니다. 전체적인 컨셉을 정립했습니다.',
    'graphic-designer': '그래픽 디자인이 완료되었습니다. 시각적 요소들을 제작했습니다.'
  };

  return responses[agent.id as keyof typeof responses] || 
         `${agent.name}의 작업이 완료되었습니다. ${agent.role}에 따라 결과를 생성했습니다.`;
}; 