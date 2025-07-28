'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

const CognitoLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert('❌ 로그인 실패: ' + error.message);
    } else {
      // 사용자 정보 저장 로직
      const user = data.user;

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        alert('❌ 사용자 정보가 존재하지 않습니다. 회원가입이 필요합니다.');
        return;
      }
      if (existingUser.email === email) {
        // alert('✅ 로그인 성공!');
        router.push('/');
      } else {
        alert('❌ 이메일 또는 패스워드가 일치하지 않습니다.');
      }
    }
  };

  const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://icacobhgcxolgekoxbga.supabase.co/auth/v1/callback', // 로그인 후 리다이렉션될 URL (프로덕션에서는 https://yourdomain.com)
    },
  });

    if (error) {
        alert('❌ Google 로그인 실패: ' + error.message);
    }
    };
    const handleGithubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
        redirectTo: 'https://icacobhgcxolgekoxbga.supabase.co/auth/v1/callback', // 또는 프로덕션 도메인
        },
    });

    if (error) {
        alert('❌ GitHub 로그인 실패: ' + error.message);
    }
    };

    useEffect(() => {
      const syncUser = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;
        if (!user) return;

        const { data: existingUser, error } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          const { email, user_metadata } = user;
          const name = user_metadata?.name || email;

          const { error: insertError } = await supabase.from('users').insert([
            {
              id: user.id,
              email,
              name,
            },
          ]);

          if (insertError) {
            console.error('❌ 사용자 등록 실패:', insertError.message);
          }
        }
      };

      syncUser();
    }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col items-center pt-5 pb-0">
        <a href="/" className="text-white text-3xl self-start font-bold ml-8 mb-10 pt-0 hover:text-purple-400 transition-colors duration-300">
        Cognito
      </a>
      <section className="animate-slide-up mt-10 w-full h-full flex justify-center items-end">
        <div className="w-full max-w-2xl bg-[#191919] rounded-lg pt-10 px-10 pb-10 flex flex-col items-center space-y-12 h-auto mb-0">
          <p className="text-white text-3xl md:text-4xl font-bold text-center w-full">
            LOGIN
          </p>
          <div className="w-full flex flex-col items-center space-y-6">
            {/* ID input */}
            <div className="w-full max-w-md bg-[#191919] border border-[#e3e3e3] rounded-lg p-3">
              <input
                type="text"
                placeholder="Enter your ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-base sm:text-lg md:text-xl outline-none"
              />
            </div>
            {/* Password input */}
            <div className="w-full max-w-md bg-[#191919] border border-[#e3e3e3] rounded-lg p-3">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-base sm:text-lg md:text-xl outline-none"
              />
            </div>
            {/* Sign in button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full max-w-md bg-[#6d00d2] rounded-lg py-2.5 text-white text-base sm:text-xl font-semibold"
            >
              sign in
            </button>
            {/* Sign up button */}
            <Link href="/signup" className="w-full max-w-md mt-auto">
              <button className="text-[#696969] text-lg md:text-xl text-center w-full">
                sign up
              </button>
            </Link>
            {/* Continue with Google button */}
            <button 
              onClick={handleGoogleLogin}
              className="mt-2 mb-3 w-full max-w-md flex items-center justify-center space-x-4 bg-[#191919] border border-[#e3e3e3] rounded-full py-2.5 text-white text-base sm:text-xl font-semibold"
            >
              <img
                src="icon/google_icon.svg"
                alt="Google logo"
                className="w-6 h-6"
              />
              <span>Continue with Google</span>
            </button>
            {/* Continue with GitHub button */}
            <button 
              onClick={handleGithubLogin}
              className="w-full max-w-md flex items-center justify-center space-x-4 bg-[#191919] border border-[#e3e3e3] rounded-full py-2.5 text-white text-base sm:text-xl font-semibold"
            >
              <img
                src="icon/github_icon.svg"
                className="w-6 h-6"
                alt="gitbub logo"
              />
              <span>Continue with Github</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CognitoLogin;