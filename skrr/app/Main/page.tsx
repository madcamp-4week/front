'use client';

import React, { useState, useEffect, useId } from 'react';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import { SendHorizonal } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { useSessionContext } from '@supabase/auth-helpers-react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'system'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');

  const { session } = useSessionContext();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!session || !userId) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('histories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (data) {
        const historyItems = data.map((entry) => ({
          id: entry.id,
          input: entry.input,
          title: entry.title,
          url: entry.url,
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
    const topic = input.trim();
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { type: 'user', content: topic }]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();

      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (res.ok && data.title) {
        await supabase.from('histories').insert([
          {
            user_id: userId,
            input: topic,
            title: data.title,
            url: data.url,
          }
        ]);

        setMessages((prev) => [
          ...prev,
          { type: 'system', content: `블로그가 생성되었습니다: ${data.title}` },
          { type: 'system', content: `<a href="${data.url}" target="_blank" class="underline text-blue-400">노션 페이지로 이동</a>` },
        ]);
      } else {
        setMessages((prev) => [...prev, { type: 'system', content: `오류: ${data.error || '알 수 없는 오류'}` }]);
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
          <h2 className="text-lg font-semibold text-purple-300">검색 기록</h2>
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
            onClick={() =>
              setMessages([
                { type: 'user', content: item.input },
                { type: 'system', content: `블로그가 생성되었습니다: ${item.title}` },
                { type: 'system', content: `<a href="${item.url}" target="_blank" class="underline text-blue-400">노션 페이지로 이동</a>` },
              ])
            }
            className="text-center w-full text-white mb-2 hover:text-purple-400 hover:bg-purple-900/30 rounded-md transition"
          >
            {item.input}
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
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">무엇이든 질문해보세요</p>
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