'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Sparkles,
  Calendar,
  FileText,
  Shield,
  PlusCircle,
  MessageSquareHeart,
  Menu,
  X,
} from 'lucide-react';
import ProfileSwitcher from './ProfileSwitcher';
import CheckInModal from './CheckInModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: Sparkles },
    { label: 'AI Companion', href: '/companion', icon: MessageSquareHeart },
    { label: 'Health Timeline', href: '/timeline', icon: Calendar },
    { label: 'Doctor-Visit Prep', href: '/doctor-prep', icon: FileText },
    { label: 'Privacy & Security', href: '/privacy', icon: Shield },
  ];

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-lg tracking-tight">
                      HerHealth
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      MVP 30%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 hidden sm:block">
                    Universal Well-Being Companion
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-rose-50 text-rose-800 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right CTAs: Profile Switcher & Check-In */}
            <div className="hidden lg:flex items-center gap-3">
              <ProfileSwitcher />
              <button
                onClick={() => setIsCheckInOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-200 hover:shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Daily Check-In</span>
              </button>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex md:hidden items-center gap-2">
              <ProfileSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-rose-50 text-rose-800 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-stone-400" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCheckInOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold"
              >
                <PlusCircle className="w-4 h-4" />
                Quick Daily Check-In
              </button>
            </div>
          </div>
        )}
      </nav>

      <CheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
    </>
  );
}
