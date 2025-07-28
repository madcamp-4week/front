'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import UserNav from '@/components/auth/UserNav';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          StockTracker
        </Link>
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          ) : session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
