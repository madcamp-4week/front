'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import NavBar from '@/components/NavBar'; 
import Link from 'next/link';

const AiMarketingLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // 성능 최적화를 위한 throttle
    let ticking = false;
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('mousemove', throttledHandleMouseMove);
    return () => window.removeEventListener('mousemove', throttledHandleMouseMove);
  }, []);

  const companies = [
    { name: 'Airtel', color: 'text-red-500' },
    { name: 'UBA', color: 'text-red-600' },
    { name: 'paga', color: 'text-orange-400' },
    { name: 'MTN', color: 'text-yellow-400' },
    { name: 'DANGOTE', color: 'text-white' },
    { name: 'FirstBank', color: 'text-blue-400' },
    { name: 'Google', color: 'text-blue-400' },
    { name: 'ebay', color: 'text-blue-500' },
    { name: 'Norton', color: 'text-yellow-400' },
    { name: 'Spotify', color: 'text-green-500' },
    { name: 'Airbnb', color: 'text-red-500' },
    { name: 'facebook', color: 'text-blue-600' },
    { name: 'Coca-Cola', color: 'text-red-600' },
    { name: 'zoom', color: 'text-blue-500' },
    { name: 'Pinterest', color: 'text-red-500' },
    { name: 'NETFLIX', color: 'text-red-600' },
    { name: 'Discord', color: 'text-indigo-500' },
    { name: 'Figma', color: 'text-purple-500' },
    { name: 'PayPal', color: 'text-blue-600' },
    { name: 'Adobe', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              left: '20%',
              top: '20%'
            }}
          ></div>
          <div
            className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"
            style={{
              transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
              right: '20%',
              top: '30%'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-purple-400">AI Marketing.</span>
                <br />
                <span className="text-white">Optimized Reach.</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Our vision is to revolutionize the way brands and advertisers target, reach
              </p>
              
              <button className="group inline-flex items-center bg-transparent border border-white/30 hover:border-purple-500 px-8 py-4 rounded-full text-white hover:text-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                <Link href ="/Main"> Get Started</Link>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="relative w-96 h-96 mx-auto">
                {/* 3D Sphere */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-full opacity-80 animate-spin-slow"></div>
                <div className="absolute inset-4 bg-gradient-to-tl from-blue-600 via-purple-600 to-pink-500 rounded-full opacity-60"></div>
                <div className="absolute inset-8 bg-black/40 rounded-full backdrop-blur-sm"></div>
                
                {/* Network Lines */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60"
                      style={{
                        height: '100%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${i * 45}deg)`,
                        animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-bounce"
                      style={{
                        left: `${20 + (i * 60) % 60}%`,
                        top: `${30 + (i * 40) % 40}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${2 + (i % 3)}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 mb-12">Trusted by the world's most ambitious teams.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-4 hover:scale-110 transition-transform duration-300"
              >
                <span className={`text-2xl font-bold ${company.color} opacity-60 hover:opacity-100 transition-opacity`}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* 두 번째 섹션 */}
<section className="py-20 relative">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-5xl font-bold mb-6">
          <span className="text-purple-400">AI Marketing</span>
          <br />
          <span className="text-white">Optimized Reach</span>
        </h2>
        
        <p className="text-gray-300 mb-6">
          DOML is a digital media agency powered by AI technology providing real time,{' '}
          <span className="text-blue-400 underline">data-driven insights</span> on your business and audience.
        </p>
        
        <p className="text-gray-300 mb-8">
          The mission of DOML is to create the best experiences for companies through intelligent insights, powerful analytics and{' '}
          <span className="text-blue-400 underline">strategic execution</span>.
        </p>
        
        <button className="group inline-flex items-center bg-transparent border border-white/30 hover:border-purple-500 px-8 py-4 rounded-full text-white hover:text-purple-400 transition-all duration-300">
          Learn more
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="relative flex justify-center">
        <img
          src="/1.png"
          alt="Agent Cube"
          className="w-80 h-80 object-contain transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  </div>
</section>


      {/* Third Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="w-80 h-80 mx-auto relative">
                {/* Abstract 3D Shape */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full opacity-80"></div>
                  <div className="absolute top-0 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-8 opacity-90"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-green-400 to-blue-500 rounded-full transform translate-x-4 translate-y-4 opacity-80"></div>
                </div>
                
                {/* Floating rings */}
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 border-2 border-purple-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-reverse"></div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-5xl font-bold mb-6">
                <span className="text-purple-400">AI Marketing</span>
                <br />
                <span className="text-white">Optimized Reach</span>
              </h2>
              
              <p className="text-gray-300 mb-6">
                It's all about getting your message in front of the right audience and creating those valuable{' '}
                <span className="text-blue-400 underline">relationships</span>.
              </p>
              
              <p className="text-gray-300 mb-8">
                Learn More about how DOML can help you do just that - all with a simple, easy-to-use platform.
              </p>
              
              <button className="group inline-flex items-center bg-transparent border border-white/30 hover:border-purple-500 px-8 py-4 rounded-full text-white hover:text-purple-400 transition-all duration-300">
                Learn more
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AiMarketingLanding;