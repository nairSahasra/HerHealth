import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'HerHealth — Universal Well-Being Companion',
  description:
    'AI-powered personal well-being companion for women of all ages and backgrounds. Cycle-aware, mood, sleep, energy, and body understanding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF8F5] text-stone-900 min-h-screen flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-stone-200/80 bg-white/60 py-6 text-center text-xs text-stone-500 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              HerHealth Universal Companion — 30% MVP Demo
            </p>
            <p className="text-stone-400 text-[11px]">
              Evidence-based health literacy & pattern awareness. Never replaces professional clinical advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
