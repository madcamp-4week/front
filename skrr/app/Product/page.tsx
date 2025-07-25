'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import NavBar from '@/components/NavBar';

const AgentProductPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Meet Your <span className="text-purple-500">Agentic AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your always-on, self-directed digital teammate. It plans, reasons, and executes — autonomously.
        </p>
        <button className="group inline-flex items-center bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full text-white transition-all">
          Try Now
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Autonomous Tasking',
              desc: 'Assign high-level goals. Your Agent decomposes and completes them on its own.',
              icon: '🤖'
            },
            {
              title: 'Multi-Agent Collaboration',
              desc: 'Orchestrate a team of AIs, each with distinct roles and memory.',
              icon: '🧠'
            },
            {
              title: 'Memory & Reasoning',
              desc: 'Agents remember context and improve decisions over time.',
              icon: '📚'
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="border border-white/10 bg-white/5 rounded-2xl p-6 shadow hover:shadow-purple-500/20 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-purple-400">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-24 text-center bg-black border-t border-white/10">
        <h2 className="text-4xl font-bold mb-4">Build with Agentic APIs</h2>
        <p className="text-gray-400 mb-8">
          Access powerful endpoints to spin up, prompt, and manage Agent AI at scale.
        </p>
        <button className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-full transition-all">
          View API Docs
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 DOML Agent Platform — All rights reserved.
      </footer>
    </div>
  );
};

export default AgentProductPage;
