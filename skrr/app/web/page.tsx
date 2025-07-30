'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // 통합된 메인 페이지로 리다이렉트
    router.push('/main');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">통합 AI 에이전트 페이지로 이동 중...</p>
      </div>
    </div>
  );
}