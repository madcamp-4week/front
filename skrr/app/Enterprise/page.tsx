'use client';

import React from 'react';
import NavBar from '@/components/NavBar';
import { ChevronRight } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Enterprise-grade <span className="text-purple-500">Agentic AI</span>
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg mb-8">
          Agentic AI is a new paradigm — self-directed, memory-capable, and contextually intelligent agents that collaborate like real teammates. Deploy them securely, scalably, and seamlessly across your enterprise.
        </p>
        <button className="group inline-flex items-center bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full transition-all">
          Contact Sales
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real-world Enterprise Applications</h2>
          <p className="text-gray-400">Powering intelligent automation across industries</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Financial Services',
              desc: 'Automated compliance agents, risk analysis assistants, and multi-modal reporting bots.',
            },
            {
              title: 'Healthcare',
              desc: 'Context-aware patient intake agents, medication adherence tracking, and secure data triage.',
            },
            {
              title: 'Customer Support',
              desc: '24/7 multilingual assistants with memory of past conversations and adaptive persona tuning.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow hover:shadow-purple-500/20 transition">
              <h3 className="text-2xl font-semibold text-purple-400 mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agentic AI Stack */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Agentic AI Stack for Enterprise</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Everything you need to deploy safe, explainable, and goal-oriented agents at scale.
        </p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          {[
            {
              title: '🧠 Memory Engine',
              desc: 'Each agent retains contextual memory — enabling continuity, recall, and personalization.',
            },
            {
              title: '🛡️ Security & Compliance',
              desc: 'SOC2, HIPAA-ready infrastructure with encrypted agent states and full audit logs.',
            },
            {
              title: '🔌 API & Integration Layer',
              desc: 'Plug into your internal systems, CRMs, data warehouses, and third-party APIs.',
            },
            {
              title: '📊 Real-time Agent Monitoring',
              desc: 'Dashboard with live agent state, reasoning trace, memory tokens, and action logs.',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow">
              <h4 className="text-xl font-semibold text-purple-400 mb-2">{feature.title}</h4>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted */}
      <section className="py-20 bg-black text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Trusted by innovators across sectors</h2>
        <p className="text-gray-400 mb-8">
          Leading enterprises build with confidence on our Agentic AI platform.
        </p>
        <div className="flex justify-center flex-wrap gap-10 text-gray-500 text-lg">
          <span className="hover:text-white transition-colors">LG CNS</span>
          <span className="hover:text-white transition-colors">Naver Cloud</span>
          <span className="hover:text-white transition-colors">Samsung SDS</span>
          <span className="hover:text-white transition-colors">Kakao Enterprise</span>
          <span className="hover:text-white transition-colors">SK Telecom</span>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-purple-600 text-center px-6">
        <h2 className="text-4xl font-bold mb-4 text-white">Let’s build your Agent Ecosystem</h2>
        <p className="text-purple-100 mb-8">Schedule a custom demo or architecture session with our enterprise team.</p>
        <button className="bg-white text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-full font-semibold transition">
          Book a Demo
        </button>
      </section>

      <footer className="text-center py-10 border-t border-white/10 text-gray-500 text-sm">
        © 2025 Agent Platform — Enterprise Edition
      </footer>
    </div>
  );
}
