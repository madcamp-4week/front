import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Stock Portfolio Tracker
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
        실시간 데이터로 당신의 주식 포트폴리오를 손쉽게 관리하고 분석하세요.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <Link href="/auth/login">시작하기</Link>
        </Button>
        <Link href="/auth/signup" className="text-sm font-semibold leading-6 text-gray-900">
          회원가입 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
