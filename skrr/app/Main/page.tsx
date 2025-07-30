'use client';

/*
 * 통합 AI 에이전트 페이지
 * 노션 블로그 생성과 웹사이트 개발 기능을 하나의 페이지로 통합
 * 사용자가 AI 에이전트를 선택할 수 있는 기능 추가
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import { SendHorizonal, BookOpen, Globe, Sparkles, Bot, BarChart3, Paperclip, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';
import FileUpload from '@/components/FileUpload';
import ConversationMemory from '@/components/ConversationMemory';
import UserSettings from '@/components/UserSettings';

interface Message {
  type: 'user' | 'system';
  content: string;
  files?: string[];
  timestamp?: Date;
}

interface HistoryItem {
  id: number;
  input: string;
  title?: string;
  url?: string;
  project_name?: string;
  project_dir?: string;
  analysis_summary?: string;
  agent_type: 'blog' | 'web' | 'data';
}

interface MemoryItem {
  id: string;
  timestamp: Date;
  userInput: string;
  agentResponse: string;
  agentType: string;
  context: string;
}

// AI 에이전트 타입 정의
type AgentType = 'blog' | 'web' | 'data';

const agents = [
  {
    id: 'blog',
    name: '노션 블로그 생성',
    description: 'AI가 주제를 연구하고 노션에 블로그 포스트를 자동으로 생성합니다',
    icon: BookOpen,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'web',
    name: '웹사이트 개발',
    description: 'AI가 Next.js 프로젝트를 생성하고 ZIP 파일로 다운로드할 수 있습니다',
    icon: Globe,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'data',
    name: '데이터 분석',
    description: 'AI가 데이터를 분석하고 비즈니스 인사이트와 차트를 생성합니다',
    icon: BarChart3,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500'
  }
];

export default function IntegratedAgentPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('blog');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showUserSettings, setShowUserSettings] = useState(false);

  const { session } = useSessionContext();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!session || !userId) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('histories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data) {
        const historyItems = data.map((entry) => ({
          id: entry.id,
          input: entry.input,
          title: entry.title,
          url: entry.url,
          project_name: entry.project_name,
          project_dir: entry.project_dir,
          agent_type: entry.agent_type || 'blog'
        }));
        setHistory(historyItems);
      }
    };

    fetchHistory();

    const fetchUserName = async () => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      if (userData?.name) {
        setUserName(userData.name);
      }
    };

    fetchUserName();
  }, [session, userId]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const userInput = input.trim();
    setInput('');
    setLoading(true);
    
    // 파일 업로드 처리
    let uploadedFilePaths: string[] = [];
    if (uploadedFiles.length > 0) {
      try {
        const formData = new FormData();
        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          uploadedFilePaths = uploadData.files.map((f: any) => f.filePath);
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }

    // 사용자 메시지 추가 (파일 정보 포함)
    const userMessage: Message = {
      type: 'user',
      content: userInput,
      files: uploadedFilePaths,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let endpoint: string = '';
      let body: any = {};
      
      if (selectedAgent === 'blog') {
        endpoint = '/api/generate';
        body = { topic: userInput, userId };
      } else if (selectedAgent === 'web') {
        endpoint = '/api/web';
        body = { prompt: userInput };
      } else if (selectedAgent === 'data') {
        endpoint = '/api/analyze';
        body = { request: userInput, userId };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (res.ok) {
        // Supabase에 기록 저장
        const historyData = {
          user_id: userId,
          input: userInput,
          agent_type: selectedAgent,
          ...(selectedAgent === 'blog' 
            ? { title: data.title, url: data.url }
            : selectedAgent === 'web'
            ? { project_name: data.project_name, project_dir: data.zip_path }
            : { analysis_summary: data.summary }
          )
        };

        await supabase.from('histories').insert([historyData]);

        // 결과 메시지 생성
        const resultMessages: Message[] = [];
        
        if (selectedAgent === 'blog') {
          resultMessages.push(
            { type: 'system', content: `블로그가 생성되었습니다: ${data.title}` },
            { type: 'system', content: `<a href="${data.url}" target="_blank" class="underline text-blue-400">노션 페이지로 이동</a>` }
          );
        } else if (selectedAgent === 'web') {
          resultMessages.push(
            { type: 'system', content: `프로젝트가 생성되었습니다: ${data.project_name || userInput}` },
            { type: 'system', content: `<span>파일 경로: ${data.zip_path}</span>` },
            { type: 'system', content: `<a href="${data.zip_path}" download class="text-blue-400 underline">ZIP 파일 다운로드</a>` }
          );
        } else if (selectedAgent === 'data') {
          resultMessages.push(
            { type: 'system', content: `데이터 분석이 완료되었습니다!` },
            { type: 'system', content: `<div class="bg-gray-800 p-4 rounded-lg mt-2"><strong>분석 요약:</strong><br/>${data.summary}</div>` }
          );
          
          if (data.recommendations && data.recommendations.length > 0) {
            resultMessages.push(
              { type: 'system', content: `<div class="bg-gray-800 p-4 rounded-lg mt-2"><strong>주요 권장사항:</strong><br/>${data.recommendations.join('<br/>')}</div>` }
            );
          }
        }

        setMessages((prev) => [...prev, ...resultMessages]);
        
        // 파일 업로드 초기화
        setUploadedFiles([]);
        setShowFileUpload(false);
      } else {
        setMessages((prev) => [...prev, { type: 'system', content: `오류: ${data.error || '알 수 없는 오류'}` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { type: 'system', content: 'API 호출 중 오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    const messages: Message[] = [
      { type: 'user', content: item.input }
    ];

    if (item.agent_type === 'blog') {
      messages.push(
        { type: 'system', content: `블로그가 생성되었습니다: ${item.title}` },
        { type: 'system', content: `<a href="${item.url}" target="_blank" class="underline text-blue-400">노션 페이지로 이동</a>` }
      );
    } else if (item.agent_type === 'web') {
      messages.push(
        { type: 'system', content: `프로젝트가 생성되었습니다: ${item.project_name}` },
        { type: 'system', content: `<span>파일 경로: ${item.project_dir}</span>` },
        { type: 'system', content: `<a href="${item.project_dir}" download class="text-blue-400 underline">ZIP 파일 다운로드</a>` }
      );
    } else if (item.agent_type === 'data') {
      messages.push(
        { type: 'system', content: `데이터 분석이 완료되었습니다!` },
        { type: 'system', content: `<div class="bg-gray-800 p-4 rounded-lg mt-2"><strong>분석 요약:</strong><br/>${item.analysis_summary}</div>` }
      );
    }

    setMessages(messages);
    setSelectedAgent(item.agent_type);
  };

  const getAgentInfo = (agentType: AgentType) => {
    return agents.find(agent => agent.id === agentType) || agents[0];
  };

  const handleMemorySelect = (memory: MemoryItem) => {
    setInput(memory.userInput);
    setSelectedAgent(memory.agentType as AgentType);
  };

  const handleMemoryUpdate = (newMemories: MemoryItem[]) => {
    setMemories(newMemories);
  };

  return (
    <div className="bg-black text-white min-h-screen relative">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="z-60 px-3 py-1 rounded fixed left-4 top-4"
      >
        <Image src="/icon/menu_icon.svg" alt="Toggle Sidebar" width={18} height={18} />
      </button>
      
      {/* 사이드바 */}
      <aside
        className={`fixed top-[64px] left-0 h-[calc(100%-64px)] w-64 bg-gray-900 border-r border-white/10 p-4 flex flex-col items-center transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative w-full mb-4 text-center">
          <h2 className="text-lg font-semibold text-purple-300">생성 기록</h2>
          <button
            onClick={() => setMessages([])}
            className="absolute right-1 top-0.5"
          >
            <Image src="/icon/newpage_icon.svg" alt="초기화" width={18} height={18} />
          </button>
        </div>
        
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => handleHistoryClick(item)}
            className="text-left w-full text-white mb-2 hover:text-purple-400 hover:bg-purple-900/30 rounded-md transition p-2"
          >
            <div className="flex items-center gap-2 mb-1">
              {item.agent_type === 'blog' ? (
                <BookOpen className="w-4 h-4 text-purple-400" />
              ) : item.agent_type === 'web' ? (
                <Globe className="w-4 h-4 text-blue-400" />
              ) : (
                <BarChart3 className="w-4 h-4 text-green-400" />
              )}
              <span className="text-xs text-gray-400">
                {item.agent_type === 'blog' ? '블로그' : item.agent_type === 'web' ? '웹사이트' : '데이터분석'}
              </span>
            </div>
            <div className="text-sm truncate">{item.input}</div>
          </button>
        ))}
      </aside>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : ''
        }`}
      >
        <div className="w-full">
          <NavBar />
        </div>
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
          <h1 className="text-2xl text-purple-400 font-semibold mb-6">
            {userName || session?.user.email}님, 안녕하세요
          </h1>

          {/* AI 에이전트 선택기 */}
          <div className="w-full max-w-4xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">AI 에이전트 선택</h2>
              <div className="flex items-center gap-2">
                <ConversationMemory
                  currentSession={messages.map(msg => ({
                    id: Date.now().toString(),
                    timestamp: msg.timestamp || new Date(),
                    userInput: msg.type === 'user' ? msg.content : '',
                    agentResponse: msg.type === 'system' ? msg.content : '',
                    agentType: selectedAgent,
                    context: `대화 세션: ${messages.length}개의 메시지`
                  }))}
                  onMemoryUpdate={handleMemoryUpdate}
                  onMemorySelect={handleMemorySelect}
                />
                <button
                  onClick={() => setShowUserSettings(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  설정
                </button>
                <button
                  onClick={() => setShowAgentSelector(!showAgentSelector)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  에이전트 변경
                </button>
              </div>
            </div>

            {showAgentSelector ? (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {agents.map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgent(agent.id as AgentType);
                        setShowAgentSelector(false);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        selectedAgent === agent.id
                          ? `border-purple-500 bg-gradient-to-r ${agent.gradient} bg-opacity-20`
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${agent.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                      </div>
                      <p className="text-gray-300 text-sm">{agent.description}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className={`p-2 rounded-lg ${getAgentInfo(selectedAgent).color}`}>
                  {React.createElement(getAgentInfo(selectedAgent).icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <h3 className="font-semibold">{getAgentInfo(selectedAgent).name}</h3>
                  <p className="text-sm text-gray-400">{getAgentInfo(selectedAgent).description}</p>
                </div>
              </div>
            )}
          </div>

          {/* 파일 업로드 영역 */}
          {showFileUpload && (
            <div className="w-full max-w-2xl mb-4">
              <FileUpload
                onFileUpload={setUploadedFiles}
                acceptedTypes={['.csv', '.xlsx', '.json', '.txt', '.png', '.jpg', '.jpeg', '.js', '.ts', '.jsx', '.tsx', '.html', '.css']}
                maxFiles={5}
                maxSize={10}
              />
            </div>
          )}

          {/* 채팅 영역 */}
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <p>선택한 AI 에이전트에게 무엇이든 질문해보세요</p>
                <p className="text-sm mt-2">
                  {selectedAgent === 'blog' 
                    ? '블로그 주제나 키워드를 입력하면 AI가 연구하고 노션에 포스트를 생성합니다'
                    : selectedAgent === 'web'
                    ? '웹사이트 설명을 입력하면 AI가 Next.js 프로젝트를 생성합니다'
                    : '데이터 분석 요청을 입력하면 AI가 인사이트와 차트를 생성합니다'
                  }
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-white p-3 rounded-lg w-fit max-w-[80%] break-words ${
                      msg.type === 'user'
                        ? 'bg-purple-400/20 self-end items-end ml-auto'
                        : 'bg-purple-500/10 self-start items-start mr-auto'
                    }`}
                  >
                    <div>
                      <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">첨부된 파일:</p>
                          {msg.files.map((file, fileIdx) => (
                            <a
                              key={fileIdx}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                              {file.split('/').pop()}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex space-x-1 items-end self-start mr-auto mt-2 h-8">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="w-full max-w-2xl mt-6 flex items-center border border-white/10 bg-white/5 rounded-full px-4 py-2">
            <button 
              onClick={() => setShowFileUpload(!showFileUpload)} 
              className={`p-1 rounded transition-colors ${
                showFileUpload ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button onClick={handleSubmit} disabled={loading} className="text-purple-400 hover:text-purple-300 ml-2">
              <SendHorizonal className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              placeholder={
                selectedAgent === 'blog' 
                  ? '블로그 주제나 키워드를 입력하세요...'
                  : selectedAgent === 'web'
                  ? '웹사이트 설명을 입력하세요...'
                  : '데이터 분석 요청을 입력하세요 (예: Q1 매출 분석, 고객 행동 패턴 분석)...'
              }
              className="w-full bg-transparent text-white placeholder-gray-400 ml-3 outline-none"
            />
          </div>
          
          {/* 업로드된 파일 표시 */}
          {uploadedFiles.length > 0 && (
            <div className="w-full max-w-2xl mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>📎 첨부된 파일 ({uploadedFiles.length}개):</span>
                <button
                  onClick={() => setUploadedFiles([])}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  모두 제거
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs"
                  >
                    <span className="text-gray-300">{file.name}</span>
                    <button
                      onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/10">
          © 2025 Agent Platform
        </footer>
      </div>

      {/* 사용자 설정 모달 */}
      {userId && (
        <UserSettings
          userId={userId}
          isOpen={showUserSettings}
          onClose={() => setShowUserSettings(false)}
        />
      )}
    </div>
  );
}