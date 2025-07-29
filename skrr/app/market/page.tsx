'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

const AgentMarketplace = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const agents = [
    {
      name: 'SEO Optimizer',
      desc: 'Boost your website SEO with automated keyword research and content suggestions.',
      category: 'Marketing',
      badge: '🔥 Popular',
      color: 'bg-purple-500'
    },
    {
      name: 'Blog Generator',
      desc: 'Create high-quality blogs with trending topics, keywords, and formatting.',
      category: 'Content',
      badge: '✨ New',
      color: 'bg-pink-500'
    },
    {
      name: 'Email Campaigner',
      desc: 'Generate and A/B test marketing emails tailored to your audience.',
      category: 'Email',
      badge: '💼 Pro',
      color: 'bg-blue-500'
    },
    {
      name: 'AI Ads Agent',
      desc: 'Design and optimize ad copy & visuals for Google and Meta ads.',
      category: 'Ads',
      badge: '📈 Trending',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-purple-400">Agent Marketplace</h1>
        <p className="text-gray-300 mb-12">Browse and deploy AI agents specialized in marketing automation</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <div key={i} className="border border-white/10 p-6 rounded-xl bg-white/5 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">{agent.name}</h2>
                <span className={`text-sm px-3 py-1 rounded-full ${agent.color} text-white font-medium`}>{agent.badge}</span>
              </div>
              <p className="text-gray-300 mb-4">{agent.desc}</p>
              <p className="text-sm text-gray-400 mb-6">Category: <span className="text-white font-semibold">{agent.category}</span></p>
              {user ? (
                <Link href={`/agents/${agent.name.toLowerCase().replace(/ /g, '-')}`}>
                  <button className="inline-flex items-center text-purple-400 hover:underline">
                    Launch Agent <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center text-gray-400 hover:text-purple-300 hover:underline"
                >
                  Sign in to use <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AgentMarketplace;
