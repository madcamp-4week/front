'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/components/nav'; // 파일 경로는 실제 위치에 맞게 수정

export default function HomePage() {
  const iconPositions = [
    { top: '5%', left: '10%' },
    { top: '15%', left: '5%' },
    { top: '35%', left: '12%' },
    { bottom: '25%', left: '8%' },
    { bottom: '15%', left: '18%' },
    { top: '10%', right: '12%' },
    { top: '40%', right: '4%' },
    { bottom: '20%', right: '16%' },
    { bottom: '10%', right: '6%' },
  ];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* 스포트라이트 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.15),rgba(0,0,0,0.95))]" />
      
      {/* 배경 스트라이프 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               background: `repeating-linear-gradient(
                 45deg,
                 transparent,
                 transparent 20px,
                 rgba(255, 255, 255, 0.05) 20px,
                 rgba(255, 255, 255, 0.05) 40px
               )`
             }}
        />
      </div>

      {/* 메인 로고 섹션 */}
      <div className="z-10 text-center">
        {/* 로고 위 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6"
        >
          <div className="text-yellow-400 text-lg font-bold tracking-[0.3em] mb-2">
            ◆ WELCOME TO THE STAGE ◆
          </div>
        </motion.div>

        {/* 로고 */}
        <motion.div
          initial={{ y: -300, opacity: 0, rotateX: 90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          className="relative mb-8"
        >
          {/* 로고 백그라운드 글로우 */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-yellow-500/30 to-yellow-600/30 blur-3xl rounded-lg transform scale-110" />
          
          <div className="relative">
            <Image
              src="/show-me-logo.png"
              alt="Show Me The Money"
              width={640}
              height={384}
              priority
              className="drop-shadow-[0_10px_30px_rgba(255,215,0,0.6)] filter brightness-110 contrast-125 scale-105 rotate-1"
            />
          </div>
        </motion.div>

        {/* 서브타이틀 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-yellow-100 text-sm font-light tracking-widest border border-yellow-400/20 px-6 py-2 rounded-full backdrop-blur-sm">
            RAP BATTLE • BEATS • MONEY
          </div>
        </motion.div>
      </div>

      {/* START 버튼 */}
      {loaded && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 1, type: 'spring', stiffness: 100 }}
          className="absolute bottom-24"
        >
          <button className="group relative px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xl tracking-widest rounded-full shadow-xl border-4 border-yellow-500 transition-all duration-300 hover:scale-110">
            <span className="relative z-10 drop-shadow-sm">START</span>
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          </button>
        </motion.div>
      )}

      {/* 하단 장식 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        <div className="flex space-x-2">
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              className="w-3 h-3 border border-yellow-400 rounded-full"
              animate={{ 
                backgroundColor: ['rgba(250, 204, 21, 0)', 'rgba(250, 204, 21, 1)', 'rgba(250, 204, 21, 0)']
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.6, 
                ease: 'easeInOut',
                delay: idx * 0.4 
              }}
            />
          ))}
        </div>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      </div>
      </main>
    </>
  );
}