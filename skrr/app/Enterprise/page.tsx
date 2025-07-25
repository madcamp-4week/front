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
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Built for <span className="text-purple-500">Enterprise</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
          Deploy Agentic AI at scale. Secure, compliant, and fully customizable for your business needs.
        </p>
        <button className="group inline-flex items-center bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full transition-all">
          Contact Sales
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Scalable Architecture',
              desc: 'Deploy thousands of agents concurrently with high availability and horizontal scaling.',
            },
            {
              title: 'Enterprise Security',
              desc: 'SOC2-compliant infrastructure, encrypted memory, and access controls.',
            },
            {
              title: 'Custom Integrations',
              desc: 'Connect with your internal APIs, data lakes, and workflows with ease.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 transition">
              <h3 className="text-2xl font-semibold text-purple-400 mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Section */}
      <section className="py-20 bg-black text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Trusted by forward-thinking teams</h2>
        <p className="text-gray-400 mb-8">
          From fintech to logistics, teams are building secure agent infrastructure with DOML.
        </p>
        <div className="flex justify-center flex-wrap gap-10 text-gray-500 text-lg">
          <span className="hover:text-white transition-colors">Samsung</span>
          <span className="hover:text-white transition-colors">LG CNS</span>
          <span className="hover:text-white transition-colors">Naver Cloud</span>
          <span className="hover:text-white transition-colors">Kakao Enterprise</span>
          <span className="hover:text-white transition-colors">SKT</span>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-purple-600 text-center px-6">
        <h2 className="text-4xl font-bold mb-4 text-white">Ready to build with Agentic AI?</h2>
        <p className="text-purple-100 mb-8">
          Book a demo and let our team tailor a solution for your enterprise use case.
        </p>
        <button className="bg-white text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-full font-semibold transition">
          Schedule a Demo
        </button>
      </section>

      <footer className="text-center py-10 border-t border-white/10 text-gray-500 text-sm">
        © 2025 DOML Enterprise Suite — All rights reserved.
      </footer>
    </div>
  );
}
