'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import type { User } from 'next-auth';

interface UserNavProps {
  user: User;
}

export default function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 hidden sm:block">
        {user.name || user.email}
      </span>
      <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline">
        로그아웃
      </Button>
    </div>
  );
}
