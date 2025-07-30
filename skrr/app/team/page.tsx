'use client';

import React from 'react';
import NavBar from '@/components/NavBar';

const teamMembers = [
  {
    name: '장서우',
    role: 'AI Developer & Product Strategist',
    bio: '에이전틱 AI 구조 설계와 기능 기획을 맡고 있습니다. 사용자 중심의 실험적 인터페이스와 다양한 프롬프트 체계를 주도합니다.',
    image: '/images/jangseowoo.png', // 실제 프로필 사진 경로로 대체
  },
  {
    name: '황광호',
    role: 'Full-Stack Developer & Visionary',
    bio: '블록체인과 에이전트 아키텍처를 기반으로 서비스의 전체 기술 구조를 설계하고 개발합니다. 아이디어를 빠르게 MVP로 구현하는 것을 즐깁니다.',
    image: '/images/hwangkwangho.png',
  },
];

export default function TeamPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />

      <section className="pt-32 pb-20 text-center px-6">
        <h1 className="text-5xl font-bold mb-4">
          Meet the <span className="text-purple-500">Team</span>
        </h1>
        <p className="text-gray-400 mb-12">
          두 명의 크리에이터, 하나의 비전. Agentic AI 시대를 함께 엽니다.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-3xl bg-white/5 p-6 shadow-lg hover:shadow-purple-500/20 transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-purple-500/40"
              />
              <h3 className="text-2xl font-semibold text-purple-400 mb-2">{member.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{member.role}</p>
              <p className="text-gray-300 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 border-t border-white/10 text-gray-500 text-sm">
        © 2025 Team SKRR — All rights reserved.
      </footer>
    </div>
  );
}
