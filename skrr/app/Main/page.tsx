'use client';

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { SendHorizonal } from 'lucide-react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
        <h1 className="text-2xl text-purple-400 font-semibold mb-6">광호님, 안녕하세요</h1>

        <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">무엇이든 질문해보세요</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="text-white bg-purple-500/10 p-3 rounded-lg">{msg}</div>
            ))
          )}
        </div>

        <div className="w-full max-w-2xl mt-6 flex items-center border border-white/10 bg-white/5 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="에이전트에게 질문해보세요"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            className="text-purple-400 hover:text-purple-300 transition"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/10">
        © 2025 Agent Platform
      </footer>
    </div>
  );
}
