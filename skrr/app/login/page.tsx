'use client';
import React, { useState } from 'react';
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

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col items-center pt-5 pb-0">
        <a href="/" className="text-white text-5xl self-start font-bold ml-12 mb-10 pt-4 hover:text-purple-400 transition-colors duration-300">
        Cognito
      </a>
      <section className="animate-slide-up absolute bottom-0 w-full flex justify-center">
        <div className="w-full max-w-4xl bg-[#191919] rounded-tl-lg rounded-tr-lg pt-10 px-10 pb-0 flex flex-col items-center space-y-12 mt-auto h-[800px]">
          <p className="text-white text-4xl md:text-5xl font-bold text-center w-full">
            LOGIN
          </p>
          <div className="w-full flex flex-col items-center space-y-8">
            {/* ID input */}
            <div className="w-full max-w-xl bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="text"
                placeholder="Enter your ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-xl sm:text-2xl md:text-3xl outline-none"
              />
            </div>
            {/* Password input */}
            <div className="w-full max-w-xl bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-xl sm:text-2xl md:text-3xl outline-none"
              />
            </div>
            {/* Sign in button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full max-w-xl bg-[#6d00d2] rounded-lg py-4 text-white text-xl sm:text-3xl font-semibold"
            >
              sign in
            </button>
            <Link href="/signup" className="w-full max-w-xl">
              <button className="text-[#696969] text-2xl md:text-3xl text-center w-full">
                sign up
              </button>
            </Link>
          </div>
          {/* Continue with Google button */}
          <button className="mb-4 w-full max-w-xl flex items-center justify-center space-x-6 bg-[#191919] border border-[#e3e3e3] rounded-full py-4 text-white text-xl sm:text-3xl font-semibold">
            <img
              src="icon/google_icon.svg"
              alt="Google logo"
              className="w-8 h-8"
            />
            <span>Continue with Google</span>
          </button>
          {/* Continue with Kakao button */}
          <button className="w-full max-w-xl flex items-center justify-center space-x-6 bg-[#191919] border border-[#e3e3e3] rounded-full py-4 text-white text-xl sm:text-3xl font-semibold">
            <img
              src="icon/kakao_icon.svg"
              className="w-8 h-8"
              alt="Kakao logo"
            />
            <span>Continue with Kakao</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default CognitoLogin;