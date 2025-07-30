'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { 
  Plus, 
  X, 
  SendHorizonal, 
  Bot, 
  Users, 
  Sparkles, 
  Settings,
  Save,
  Trash2,
  Copy,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { 
  defaultAgents, 
  categoryColors, 
  getCategoryAgents, 
  getCategories, 
  simulateAgentWork,
  type Agent 
} from '@/lib/agents';



interface CombinedWorkflow {
  id: string;
  name: string;
  description: string;
  agents: Agent[];
  prompt: string;
  result?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  createdAt: Date;
}

interface Message {
  type: 'user' | 'system' | 'agent';
  content: string;
  agentName?: string;
  timestamp: Date;
}

export default function CombinePage() {
  const router = useRouter();
  const { session } = useSessionContext();
  const userId = session?.user?.id;

  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState<CombinedWorkflow[]>([]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [showCustomAgent, setShowCustomAgent] = useState(false);
  const [customAgent, setCustomAgent] = useState({
    name: '',
    role: '',
    description: '',
    category: 'custom'
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchSavedWorkflows();
  }, [session, router]);

  const fetchSavedWorkflows = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('combined_workflows')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedWorkflows(data?.map(w => ({
        ...w,
        agents: JSON.parse(w.agents || '[]'),
        createdAt: new Date(w.created_at)
      })) || []);
    } catch (error) {
      console.error('워크플로우 로드 오류:', error);
    }
  };

  const addAgent = (agent: Agent) => {
    if (!selectedAgents.find(a => a.id === agent.id)) {
      setSelectedAgents([...selectedAgents, agent]);
    }
    setShowAgentSelector(false);
  };

  const removeAgent = (agentId: string) => {
    setSelectedAgents(selectedAgents.filter(a => a.id !== agentId));
  };

  const createCustomAgent = () => {
    if (!customAgent.name || !customAgent.role || !customAgent.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: customAgent.name,
      role: customAgent.role,
      description: customAgent.description,
      category: customAgent.category,
      icon: '🤖',
      isCustom: true
    };

    setSelectedAgents([...selectedAgents, newAgent]);
    setCustomAgent({ name: '', role: '', description: '', category: 'custom' });
    setShowCustomAgent(false);
  };

  const generateWorkflowPrompt = () => {
    if (selectedAgents.length === 0) {
      alert('최소 하나의 에이전트를 선택해주세요.');
      return;
    }

    const agentDescriptions = selectedAgents.map(agent => 
      `${agent.name} (${agent.role}): ${agent.description}`
    ).join('\n');

    const workflowPrompt = `다음 AI 에이전트들을 조합하여 작업을 수행합니다:

${agentDescriptions}

작업 요청: ${prompt}

각 에이전트의 역할에 맞게 순차적으로 작업을 진행하고, 최종 결과물을 제공해주세요.`;

    return workflowPrompt;
  };

  const executeWorkflow = async () => {
    if (selectedAgents.length === 0) {
      alert('최소 하나의 에이전트를 선택해주세요.');
      return;
    }

    if (!prompt.trim()) {
      alert('작업 요청을 입력해주세요.');
      return;
    }

    setLoading(true);
    const userMessage: Message = {
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages([userMessage]);

    try {
      const workflowPrompt = generateWorkflowPrompt();
      
      // 각 에이전트별로 순차 실행
      let finalResult = '';
      
      for (const agent of selectedAgents) {
        const agentMessage: Message = {
          type: 'agent',
          content: `${agent.name}이(가) 작업을 시작합니다...`,
          agentName: agent.name,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);

        // 실제로는 각 에이전트의 특성에 맞는 API 호출
        const agentResult = await simulateAgentWork(agent, workflowPrompt);
        
        const resultMessage: Message = {
          type: 'system',
          content: `${agent.name}의 작업 결과:\n${agentResult}`,
          agentName: agent.name,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMessage]);
        
        finalResult += `\n\n${agent.name}의 결과:\n${agentResult}`;
      }

      // 최종 결과 저장
      if (userId) {
        const workflowData = {
          user_id: userId,
          name: workflowName || `워크플로우 ${Date.now()}`,
          description: workflowDescription || '조합된 AI 워크플로우',
          agents: JSON.stringify(selectedAgents),
          prompt: prompt,
          result: finalResult,
          status: 'completed'
        };

        await supabase.from('combined_workflows').insert([workflowData]);
        await fetchSavedWorkflows();
      }

    } catch (error) {
      console.error('워크플로우 실행 오류:', error);
      const errorMessage: Message = {
        type: 'system',
        content: '워크플로우 실행 중 오류가 발생했습니다.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async () => {
    if (!userId) return;

    if (!workflowName.trim()) {
      alert('워크플로우 이름을 입력해주세요.');
      return;
    }

    try {
      const workflowData = {
        user_id: userId,
        name: workflowName,
        description: workflowDescription,
        agents: JSON.stringify(selectedAgents),
        prompt: prompt,
        status: 'idle'
      };

      const { error } = await supabase.from('combined_workflows').insert([workflowData]);
      if (error) throw error;

      alert('워크플로우가 저장되었습니다!');
      await fetchSavedWorkflows();
    } catch (error) {
      console.error('워크플로우 저장 오류:', error);
      alert('워크플로우 저장 중 오류가 발생했습니다.');
    }
  };

  const loadWorkflow = (workflow: CombinedWorkflow) => {
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description);
    setSelectedAgents(workflow.agents);
    setPrompt(workflow.prompt);
    setMessages([]);
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('정말로 이 워크플로우를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('combined_workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      await fetchSavedWorkflows();
      alert('워크플로우가 삭제되었습니다.');
    } catch (error) {
      console.error('워크플로우 삭제 오류:', error);
      alert('워크플로우 삭제 중 오류가 발생했습니다.');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              AI 에이전트 조합
            </h1>
            <p className="text-gray-400 text-lg">
              여러 AI 에이전트를 조합하여 복잡한 작업을 수행하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 에이전트 선택 및 설정 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 워크플로우 정보 */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  워크플로우 설정
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      워크플로우 이름
                    </label>
                    <input
                      type="text"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="예: 데이터 분석 웹사이트"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      설명
                    </label>
                    <textarea
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="워크플로우에 대한 설명을 입력하세요"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 선택된 에이전트 */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    선택된 에이전트 ({selectedAgents.length})
                  </h3>
                  <button
                    onClick={() => setShowAgentSelector(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border ${categoryColors[agent.category as keyof typeof categoryColors] || 'bg-gray-800 border-gray-600'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{agent.icon}</span>
                          <div>
                            <h4 className="font-medium text-white">{agent.name}</h4>
                            <p className="text-sm text-gray-400">{agent.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAgent(agent.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {selectedAgents.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>에이전트를 선택해주세요</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 저장된 워크플로우 */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Save className="w-5 h-5 text-purple-400" />
                  저장된 워크플로우
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {savedWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => loadWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{workflow.name}</h4>
                          <p className="text-sm text-gray-400">{workflow.description}</p>
                          <p className="text-xs text-gray-500">
                            {workflow.agents.length}개 에이전트 • {workflow.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkflow(workflow.id);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {savedWorkflows.length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      <p className="text-sm">저장된 워크플로우가 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽: 작업 영역 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 작업 요청 */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SendHorizonal className="w-5 h-5 text-purple-400" />
                  작업 요청
                </h3>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="예: 데이터 분석 결과를 바탕으로 대시보드 웹사이트를 만들어주세요. 프론트엔드는 React로, 백엔드는 Node.js로 구현해주세요."
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={executeWorkflow}
                    disabled={loading || selectedAgents.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        실행 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        워크플로우 실행
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={saveWorkflow}
                    disabled={!workflowName.trim() || selectedAgents.length === 0}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                </div>
              </div>

              {/* 결과 */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  실행 결과
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>워크플로우를 실행하면 결과가 여기에 표시됩니다</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : msg.type === 'agent'
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'bg-gray-800 border border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {msg.type === 'user' && <span className="text-purple-400">👤 사용자</span>}
                          {msg.type === 'agent' && <span className="text-blue-400">🤖 {msg.agentName}</span>}
                          {msg.type === 'system' && <span className="text-green-400">✅ {msg.agentName || '시스템'}</span>}
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 에이전트 선택 모달 */}
      {showAgentSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5" />
                에이전트 선택
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomAgent(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  커스텀 에이전트
                </button>
                <button
                  onClick={() => setShowAgentSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCategories().map((category) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {getCategoryAgents(category).map((agent) => (
                      <div
                        key={agent.id}
                        onClick={() => addAgent(agent)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          categoryColors[category as keyof typeof categoryColors] || 'bg-gray-800 border-gray-600'
                        } hover:border-purple-500`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{agent.icon}</span>
                          <div>
                            <h4 className="font-medium text-white">{agent.name}</h4>
                            <p className="text-sm text-gray-400">{agent.role}</p>
                            <p className="text-xs text-gray-500">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 커스텀 에이전트 생성 모달 */}
      {showCustomAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                커스텀 에이전트 생성
              </h2>
              <button
                onClick={() => setShowCustomAgent(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  에이전트 이름
                </label>
                <input
                  type="text"
                  value={customAgent.name}
                  onChange={(e) => setCustomAgent({...customAgent, name: e.target.value})}
                  placeholder="예: 블록체인 전문가"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  역할
                </label>
                <input
                  type="text"
                  value={customAgent.role}
                  onChange={(e) => setCustomAgent({...customAgent, role: e.target.value})}
                  placeholder="예: 블록체인 기술 분석 및 개발"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  설명
                </label>
                <textarea
                  value={customAgent.description}
                  onChange={(e) => setCustomAgent({...customAgent, description: e.target.value})}
                  placeholder="에이전트의 능력과 전문 분야를 설명하세요"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCustomAgent(false)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={createCustomAgent}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  생성
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
