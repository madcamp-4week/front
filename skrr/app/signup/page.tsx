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
        <a href="/" className="text-white text-3xl self-start font-bold ml-8 mb-10 pt-0 hover:text-purple-400 transition-colors duration-300">
        Cognito
      </a>
      <section className="animate-slide-up mt-10 w-full h-full flex justify-center items-end">
        <div className="w-full max-w-2xl bg-[#191919] rounded-lg pt-10 px-10 pb-10 mb-0 flex flex-col items-center space-y-12 h-auto self-end">
            <p className="text-white text-2xl md:text-3xl font-bold text-center w-full">
            SIGN UP
            </p>
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="w-full max-w-md bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-base sm:text-lg md:text-xl outline-none"
              />
            </div>
            <div className="w-full max-w-md bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-base sm:text-lg md:text-xl outline-none"
              />
            </div>
            <div className="w-full max-w-md bg-[#191919] border border-[#e3e3e3] rounded-lg p-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[#e3e3e3] placeholder-[#696969] text-base sm:text-lg md:text-xl outline-none"
              />
            </div>
            <button
              onClick={handleSignup}
              className="w-full max-w-md bg-[#6d00d2] rounded-lg py-3 text-white text-base sm:text-xl font-semibold"
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