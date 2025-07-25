

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-bold tracking-wide">
        SHOWME
      </Link>
      <div className="hidden md:flex space-x-6">
        <Link href="/about" className="hover:text-yellow-400 transition">About</Link>
        <Link href="/battle" className="hover:text-yellow-400 transition">Battle</Link>
        <Link href="/ranking" className="hover:text-yellow-400 transition">Ranking</Link>
      </div>
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center space-y-4 py-4 border-t border-white/10 md:hidden z-50">
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/battle" onClick={() => setIsOpen(false)}>Battle</Link>
          <Link href="/ranking" onClick={() => setIsOpen(false)}>Ranking</Link>
        </div>
      )}
    </nav>
  );
}