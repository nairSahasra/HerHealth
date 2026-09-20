'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Info,
  ChevronRight,
} from 'lucide-react';
import { DEMO_PROFILES } from './ProfileSwitcher';
import RedFlagAlert from './RedFlagAlert';
import { RedFlagDetection } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isRedFlag?: boolean;
  redFlagDetails?: RedFlagDetection;
  suggestedFollowUps?: string[];
}

const SAMPLE_QUESTIONS = [
  'Why do I feel so exhausted in the afternoons?',
  'What causes brain fog and how can I clear it?',
  'Explain how stress impacts my digestive bloating',
  'What questions should I ask my doctor about my fatigue?',
  'I have crushing chest pain and shortness of breath', // For testing red flag escalation
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your **HerHealth Well-Being Companion**. 

I am here to help you understand your body's patterns, explain medical and physiological terms in plain language, and prepare for doctor visits. 

How are you feeling today? You can ask me anything about your energy, sleep, mood, or symptoms below.`,
      suggestedFollowUps: [
        'Why do I get afternoon energy crashes?',
        'Explain my recent sleep vs energy patterns',
        'How does stress cause physical bloating?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('user_maya_21');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    setUserId(savedId);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      setUserId(newId);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    return () => window.removeEventListener('herhealth_profile_changed', handleProfileChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: queryText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from companion');
      }

      const data = await res.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        isRedFlag: data.isRedFlag,
        redFlagDetails: data.redFlagDetails,
        suggestedFollowUps: data.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'I encountered a temporary connection issue. Please try again or rephrase your question.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Companion Header */}
      <div className="p-4 bg-gradient-to-r from-rose-50/80 via-white to-stone-50 border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              HerHealth AI Companion
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Grounded & Safety-Guarded
              </span>
            </h2>
            <p className="text-[11px] text-stone-500">
              Plain-language body translation • Pattern awareness • Never diagnoses
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-stone-500 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
          <span>Clinical Red-Flag Protection Active</span>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-3 max-w-2xl ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  m.role === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-brand-600 text-white'
                }`}
              >
                {m.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-white border border-stone-200/90 text-stone-800 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* If Red-Flag detected */}
                {m.isRedFlag && m.redFlagDetails && (
                  <RedFlagAlert detection={m.redFlagDetails} />
                )}
              </div>
            </div>

            {/* Suggested Follow-Ups */}
            {m.role === 'assistant' && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
              <div className="mt-2.5 ml-10 flex flex-wrap gap-1.5">
                {m.suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-rose-200 text-rose-800 hover:bg-rose-50 transition-colors flex items-center gap-1 font-medium"
                  >
                    <span>{chip}</span>
                    <ChevronRight className="w-3 h-3 text-rose-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-stone-500 ml-2 font-medium">
                  Reviewing body patterns & knowledge base...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Starters */}
      <div className="px-4 py-2 border-t border-stone-100 bg-white overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-500" /> Prompt Ideas:
          </span>
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your body, fatigue, headaches, lab tests, or sleep..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800 placeholder-stone-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 mt-2 text-center">
          HerHealth provides health education and pattern recognition. Always consult a licensed healthcare provider for medical diagnosis.
        </p>
      </div>
    </div>
  );
}
