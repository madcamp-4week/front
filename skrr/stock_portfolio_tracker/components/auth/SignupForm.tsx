'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    setError(null);

    try {
      // Use the new registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Provide user-friendly error messages
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // Automatically sign in after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
      } else {
        // This case might happen if sign-in fails for some reason after registration
        setError('회원가입은 완료되었으나 자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.');
        router.push('/auth/login');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">이름</label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="홍길동"
          autoComplete="name" // Add autocomplete
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">이메일</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="name@example.com"
          autoComplete="email" // Add autocomplete
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8} // Add basic password validation
          autoComplete="new-password" // Use "new-password" for signup forms
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '가입 중...' : '회원가입'}
      </Button>
    </form>
  );
}
