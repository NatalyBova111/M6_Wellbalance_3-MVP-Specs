'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { FormEvent, useState, ChangeEvent } from 'react';

type Tone = 'neutral' | 'casual' | 'formal' | 'pirate';

export default function ChatPage() {
  const [tone, setTone] = useState<Tone>('neutral');
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { tone }, // сюда прилетит на сервер
    }),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTone(e.target.value as Tone);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col max-w-2xl mx-auto my-6 border rounded-2xl shadow-sm bg-white/80">
      {/* панель настроек */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <h1 className="text-sm font-semibold text-slate-800">
          AI Chat Assistant
        </h1>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Tone:</span>
          <select
            value={tone}
            onChange={handleToneChange}
            className="rounded-full border px-2 py-1 text-xs text-slate-700 bg-white"
          >
            <option value="neutral">Neutral</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="pirate">Pirate 🏴‍☠️</option>
          </select>
        </div>
      </div>

      {/* сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`inline-block rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === 'text' ? <span key={i}>{part.text}</span> : null,
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-sm text-slate-500">
            Choose a tone above and ask me anything ✨
          </div>
        )}
      </div>

      {/* форма ввода */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3 bg-white/70">
        <input
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
          placeholder="What would you like to know?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
        <button
          type="submit"
          disabled={status !== 'ready' || !input.trim()}
          className="rounded-xl px-4 py-2 text-sm font-medium border bg-slate-900 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
