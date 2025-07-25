"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// app/form/page.tsx
export default function ApplicationFormPage() {
  const [nickname, setNickname] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setShowForm(true), 400);
    setTimeout(() => setShowInput(true), 800);
    setTimeout(() => setShowConfirm(true), 1200);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <section
        className={`w-full max-w-[1273px] h-[90%] absolute left-1/2 top-[97px] transform -translate-x-1/2 rounded-tl-[30px] rounded-tr-[30px] bg-[#e2e3d5] transition-all duration-700 ease-out flex flex-col items-center ${
          isVisible ? 'translate-y-0' : 'translate-y-200'
        }`}
      >
        <Image
          src="/image/ShowMeTheMoneyLogo.png"
          alt="Show Me The Money Logo"
          width={887}
          height={454}
          className="mt-[-12px] object-contain w-full max-w-[887px]"
        />

        <div className={`w-full flex justify-center mt-4 transition-all duration-500 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Image
            src="/icon/application_form.svg"
            alt="Application Form Icon"
            width={550}
            height={200}
            className="object-contain"
          />
        </div>

        <div className={`w-full flex justify-center items-center gap-6 mt-10 transition-all duration-500 ${showInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
        <div className={`w-full flex justify-center mt-auto mb-[40px] transition-all duration-500 ${showConfirm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
      </section>
    </div>
  );
}