'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignup = async () => {
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      alert('❌ 회원가입 실패: ' + signupError.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert('❌ 사용자 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        email: user.email,
        name: username,
      },
    ]);
    if (insertError) {
      alert('⚠️ 사용자 정보 저장 실패: ' + insertError.message);
      return;
    }

    alert('✅ 회원가입 완료!');
    window.location.href = '/login';
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col items-center pt-5 pb-0">
        <a href="/" className="text-white text-5xl self-start font-bold ml-12 mb-10 pt-4 hover:text-purple-400 transition-colors duration-300">
        Cognito
      </a>
      <section className="animate-slide-up absolute bottom-0 w-full flex justify-center">
        <div className="w-full max-w-4xl bg-[#191919] rounded-tl-lg rounded-tr-lg pt-10 px-10 pb-0 flex flex-col items-center space-y-12 mt-auto h-[800px]">
            <p className="text-white text-4xl md:text-5xl font-bold text-center w-full">
            SIGN UP
            </p>
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="w-full max-w-xl bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-xl sm:text-2xl md:text-3xl outline-none"
              />
            </div>
            <div className="w-full max-w-xl bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-xl sm:text-2xl md:text-3xl outline-none"
              />
            </div>
            <div className="w-full max-w-xl bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-xl sm:text-2xl md:text-3xl outline-none"
              />
            </div>
            <button
              onClick={handleSignup}
              className="w-full max-w-xl bg-[#6d00d2] rounded-lg py-4 text-white text-xl sm:text-3xl font-semibold"
            >
              confirm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;