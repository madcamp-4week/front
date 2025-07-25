'use client';

import React, { useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              <Link href="/"> <span className="text-purple-500">◊</span> Cognito</Link>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/Product" className="text-gray-300 hover:text-white transition-colors">Product</a>
            <a href="/Team" className="text-gray-300 hover:text-white transition-colors">Team</a>
            <a href="/Enterprise" className="text-gray-300 hover:text-white transition-colors">Enterprise</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Explore <ChevronRight className="w-4 h-4 ml-1" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Pricing <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search DOML"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="text-gray-300 hover:text-white transition-colors">Sign in</button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
              Sign up
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <div className="px-4 py-6 space-y-4">
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Product</a>
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Team</a>
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Enterprise</a>
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Explore</a>
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
            <div className="pt-4 border-t border-gray-800">
              <button className="block w-full text-left text-gray-300 hover:text-white transition-colors mb-2">Sign in</button>
              <button className="block w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-center">
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
