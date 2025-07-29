/*
 * web/page.tsx
 *
 * This page provides a UI to generate a new Next.js project based on a user
 * specification using the `web_builder_agent.py` script on the backend. It
 * closely mirrors the existing HomePage used for blog generation, but
 * targets the `/api/web` endpoint instead of `/api/generate`. The results
 * include the generated project directory, which can be stored and later
 * retrieved via Supabase just like blog histories.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import { SendHorizonal } from 'lucide-react';
// Supabase imports removed for now since persistence is disabled

interface Message {
  type: 'user' | 'system';
  content: string;
}

interface HistoryItem {
  id: number;
  input: string;
  project_name: string;
  project_dir: string;
}

export default function WebBuilderPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // Maintain history locally within the component; persistence is disabled.
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // User name is static when Supabase is disabled
  const [userName] = useState('사용자');

  // Persistence and authentication via Supabase have been removed. History will
  // only persist for the lifetime of this component instance.

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const description = input.trim();
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { type: 'user', content: description }]);

    try {
      const res = await fetch('/api/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      });
      const data = await res.json();
      const { project_name, project_dir, zip_path } = data;

      if (res.ok && zip_path) {
        // Update local history with the new project
        setHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            input: description,
            project_name: project_name || description,
            project_dir: zip_path,
          },
        ]);

        setMessages((prev) => [
          ...prev,
          { type: 'system', content: `프로젝트가 생성되었습니다: ${project_name || description}` },
          { type: 'system', content: `<span>파일 경로: ${zip_path}</span>` },
          { type: 'system', content: `<a href="${zip_path}" download class="text-blue-400 underline">ZIP 파일 다운로드</a>` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'system', content: `오류: ${data.error || '알 수 없는 오류'}` },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { type: 'system', content: 'API 호출 중 오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen relative">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="z-60 px-3 py-1 rounded fixed left-4 top-4"
      >
        <Image src="/icon/menu_icon.svg" alt="Toggle Sidebar" width={18} height={18} />
      </button>
      <aside
        className={`fixed top-[64px] left-0 h-[calc(100%-64px)] w-64 bg-gray-900 border-r border-white/10 p-4 flex flex-col items-center transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative w-full mb-4 text-center">
          <h2 className="text-lg font-semibold text-purple-300">생성 기록</h2>
          <button onClick={() => setMessages([])} className="absolute right-1 top-0.5">
            <Image src="/icon/newpage_icon.svg" alt="초기화" width={18} height={18} />
          </button>
        </div>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setMessages([
                { type: 'user', content: item.input },
                { type: 'system', content: `프로젝트가 생성되었습니다: ${item.project_name}` },
                { type: 'system', content: `<span>파일 경로: ${item.project_dir}</span>` },
                { type: 'system', content: `<a href="${item.project_dir}" download class="text-blue-400 underline">ZIP 파일 다운로드</a>` },
              ])
            }
            className="text-center w-full text-white mb-2 hover:text-purple-400 hover:bg-purple-900/30 rounded-md transition"
          >
            {item.input}
          </button>
        ))}
      </aside>
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
        <div className="w-full">
          <NavBar />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
          <h1 className="text-2xl text-purple-400 font-semibold mb-6">
            {userName}님, 안녕하세요
          </h1>
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">생성할 프로젝트를 입력해보세요</p>
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
                    <span dangerouslySetInnerHTML={{ __html: msg.content }} />
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
          <div className="w-full max-w-2xl mt-6 flex items-center border border-white/10 bg-white/5 rounded-full px-4 py-2">
            <button onClick={handleSubmit} disabled={loading}>
              <SendHorizonal className="w-20 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              className="w-full"
            />
          </div>
        </main>
        <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/10">
          © 2025 Agent Platform
        </footer>
      </div>
    </div>
  );
}