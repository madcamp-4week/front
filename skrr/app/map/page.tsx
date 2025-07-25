'use client';

import { useRouter } from 'next/navigation';

export default function ShowMeSimulator() {
  const stages = ['1차 예선', '2차 예선', '1:1 배틀', '세미파이널', '결승'];
  const router = useRouter();

  return (
    <main className="relative w-full h-[90vh] bg-gradient-to-b from-gray-200 to-white overflow-hidden">
      <nav className="absolute top-0 left-0 w-full h-12 bg-black text-white flex items-center px-6 z-50">
        <h2 className="text-lg font-bold">Show Me The AI</h2>
      </nav>
      <svg className="absolute w-full h-full z-0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path
          d="M100,900 C300,700 500,1000 700,800 C850,650 900,400 800,200"
          stroke="#333"
          strokeWidth="8"
          fill="none"
          strokeDasharray="20 12"
        />
      </svg>
      <h1 className="text-4xl font-bold text-center text-black pt-8">쇼미더머니 로드맵</h1>

      {stages.map((stage, idx) => {
        const isUnlocked = idx === 0;
        const positions = [
          { x: '10%', y: '80%' },
          { x: '30%', y: '60%' },
          { x: '50%', y: '75%' },
          { x: '70%', y: '50%' },
          { x: '85%', y: '30%' },
        ];

        return (
          <div
            key={stage}
            className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: positions[idx].x, top: positions[idx].y }}
          >
            <div className={`w-14 h-14 rounded-full text-white font-bold flex items-center justify-center
              ${isUnlocked ? 'bg-yellow-500' : 'bg-gray-400'}`}>
              {isUnlocked ? idx + 1 : '🔒'}
            </div>
            <span className="mt-1 text-sm text-black">{stage}</span>
            {isUnlocked && (
              <button
                onClick={() => router.push(`/map/stage/${idx + 1}`)}
                className="mt-1 px-3 py-1 text-xs bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                도전하기
              </button>
            )}
          </div>
        );
      })}
    </main>
  );
}