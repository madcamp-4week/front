'use client';

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { SendHorizonal } from 'lucide-react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const topic = input.trim();
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, `블로그 생성 요청: ${topic}`]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (res.ok) {
        // data.url에는 노션 페이지 URL이, data.title에는 제목이 들어 있습니다.
        setMessages((prev) => [
          ...prev,
          `블로그가 생성되었습니다: ${data.title}`,
          `<a href="${data.url}" target="_blank" class="underline text-blue-400">노션 페이지로 이동</a>`,
        ]);
      } else {
        setMessages((prev) => [...prev, `오류: ${data.error || '알 수 없는 오류'}`]);
      }
    } catch {
      setMessages((prev) => [...prev, 'API 호출 중 오류가 발생했습니다.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
        <h1 className="text-2xl text-purple-400 font-semibold mb-6">
          광호님, 안녕하세요
        </h1>

        <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">무엇이든 질문해보세요</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="text-white bg-purple-500/10 p-3 rounded-lg">
                <span dangerouslySetInnerHTML={{ __html: msg }} />
              </div>
            ))
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
  );
}
