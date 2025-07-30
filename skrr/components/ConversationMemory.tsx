'use client';

import React, { useState, useEffect } from 'react';
import { Brain, MessageSquare, Clock, Trash2, Save, Edit3 } from 'lucide-react';

interface MemoryItem {
  id: string;
  timestamp: Date;
  userInput: string;
  agentResponse: string;
  agentType: string;
  context: string;
}

interface ConversationMemoryProps {
  currentSession: MemoryItem[];
  onMemoryUpdate: (memories: MemoryItem[]) => void;
  onMemorySelect: (memory: MemoryItem) => void;
}

const ConversationMemory: React.FC<ConversationMemoryProps> = ({
  currentSession,
  onMemoryUpdate,
  onMemorySelect
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [editContext, setEditContext] = useState('');

  // 로컬 스토리지에서 메모리 로드
  useEffect(() => {
    const savedMemories = localStorage.getItem('ai_agent_memories');
    if (savedMemories) {
      try {
        const parsed = JSON.parse(savedMemories);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMemories(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load memories:', error);
      }
    }
  }, []);

  // 메모리 저장
  const saveMemories = (newMemories: MemoryItem[]) => {
    setMemories(newMemories);
    localStorage.setItem('ai_agent_memories', JSON.stringify(newMemories));
    onMemoryUpdate(newMemories);
  };

  // 현재 세션을 메모리에 저장
  const saveCurrentSession = () => {
    if (currentSession.length === 0) return;

    const newMemory: MemoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userInput: currentSession[0].userInput,
      agentResponse: currentSession[currentSession.length - 1].agentResponse,
      agentType: currentSession[0].agentType,
      context: `대화 세션: ${currentSession.length}개의 메시지`
    };

    const updatedMemories = [newMemory, ...memories];
    saveMemories(updatedMemories);
  };

  // 메모리 삭제
  const deleteMemory = (id: string) => {
    const updatedMemories = memories.filter(m => m.id !== id);
    saveMemories(updatedMemories);
  };

  // 메모리 편집 시작
  const startEditing = (memory: MemoryItem) => {
    setEditingMemory(memory.id);
    setEditContext(memory.context);
  };

  // 메모리 편집 저장
  const saveEdit = () => {
    if (!editingMemory) return;

    const updatedMemories = memories.map(m => 
      m.id === editingMemory 
        ? { ...m, context: editContext }
        : m
    );
    saveMemories(updatedMemories);
    setEditingMemory(null);
    setEditContext('');
  };

  // 메모리 편집 취소
  const cancelEdit = () => {
    setEditingMemory(null);
    setEditContext('');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'blog':
        return '📝';
      case 'web':
        return '🌐';
      case 'data':
        return '📊';
      default:
        return '🤖';
    }
  };

  return (
    <div className="relative">
      {/* 메모리 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
      >
        <Brain className="w-4 h-4" />
        메모리 ({memories.length})
      </button>

      {/* 메모리 패널 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">대화 메모리</h3>
              <button
                onClick={saveCurrentSession}
                disabled={currentSession.length === 0}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs transition-colors"
              >
                <Save className="w-3 h-3" />
                저장
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              중요한 대화를 메모리에 저장하여 나중에 참조할 수 있습니다.
            </p>
          </div>

          <div className="overflow-y-auto max-h-64">
            {memories.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">저장된 메모리가 없습니다.</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => onMemorySelect(memory)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getAgentIcon(memory.agentType)}</span>
                          <span className="text-sm font-medium text-white truncate">
                            {memory.userInput}
                          </span>
                        </div>
                        
                        {editingMemory === memory.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContext}
                              onChange={(e) => setEditContext(e.target.value)}
                              className="w-full p-2 text-xs bg-gray-700 border border-gray-600 rounded text-white resize-none"
                              rows={2}
                              placeholder="메모리 컨텍스트를 입력하세요..."
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={saveEdit}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
                              >
                                저장
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 mb-2">
                            {memory.context}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(memory.timestamp)}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(memory);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMemory(memory.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationMemory; 