"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// app/form/page.tsx
export default function ApplicationFormPage() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <div className="w-full max-w-[1273px] h-[90%] absolute left-1/2 top-[97px] transform -translate-x-1/2 rounded-tl-[30px] rounded-tr-[30px] bg-[#e2e3d5]" />
      <Image
        src="/image/ShowMeTheMoneyLogo.png"
        alt="Show Me The Money Logo"
        width={887}
        height={454}
        className="absolute top-[85px] left-1/2 transform -translate-x-1/2 object-contain w-full max-w-[887px]"
      />

      <div className="w-full flex justify-center absolute top-[522px]">
        <Image
          src="/icon/application_form.svg"
          alt="Application Form Icon"
          width={550}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="w-full flex justify-center items-center gap-6 absolute bottom-[160px]">
        <Image
          src="/icon/rap_name.svg"
          alt="RapName Icon"
          width={300}
          height={100}
          className="object-contain w-full max-w-[300px]"
        />
        <div className="relative translate-y-[10px] w-full max-w-[300px]">
          <input
            type="text"
            placeholder="Enter your rap name"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-transparent text-3xl text-black placeholder:text-gray-500 outline-none w-full pb-2"
          />
          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#d48f31]" />
        </div>
      </div>
          {/* Confirm icon at the bottom center */}
    <div className="w-full flex justify-center absolute bottom-[40px]">
      <button
        className="hover:opacity-80 transition-opacity"
        onClick={() => {
          localStorage.setItem('nickname', nickname);
          router.push('/');
        }}
      >
        <Image
          src="/icon/confirm.svg"
          alt="Confirm Button"
          width={200}
          height={80}
          className="object-contain cursor-pointer w-full max-w-[200px] h-auto"
        />
      </button>
    </div>
  </div>  // ✅ 닫히지 않은 루트 <div> 닫아줌
  );
}