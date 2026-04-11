"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Trash2 } from "lucide-react"; // Bot icon dihapus karena diganti logo

const STORAGE_KEY = "aaa-gang-chat-log";
const initialMessages = [
  { role: "ai", text: "Aku Sigma yang jaga klan ini, kamu siapa?" }
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (error) {
        console.warn("Gagal baca chat dari localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const clearChat = () => {
    setMessages(initialMessages);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Ganjel nyet!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/60 rounded-[2rem] flex flex-col h-[min(88vh,740px)] max-h-[calc(100vh-3rem)] overflow-hidden backdrop-blur-xl shadow-[0_40px_90px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950/95">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black">AAA GANG Chat</p>
          <h2 className="text-base md:text-lg font-bold text-zinc-100">Sigma (Admin)</h2>
        </div>
        <button
          onClick={clearChat}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/80 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-amber-400 hover:text-amber-300 transition-all disabled:opacity-40"
        >
          <Trash2 size={16} /> Hapus
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-amber-500/20 bg-amber-500/5 shadow-[0_0_18px_rgba(245,158,11,0.18)]">
                <img
                  src="/favicon.ico"
                  alt="AAA GANG"
                  className="w-7 h-7 object-contain drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                />
              </div>
            )}

            <div className="relative max-w-full sm:max-w-[78%]">
              <div
                className={`rounded-[1.75rem] px-5 py-4 text-sm leading-7 break-words ${
                  msg.role === "ai"
                    ? "bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-amber-500/10 text-zinc-200 shadow-[0_18px_55px_-40px_rgba(245,158,11,0.8)]"
                    : "bg-gradient-to-br from-amber-500 to-amber-400 text-zinc-950 font-semibold shadow-[0_20px_60px_-30px_rgba(245,158,11,0.55)]"
                }`}
              >
                {msg.text}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-300 shadow-[0_0_15px_rgba(0,0,0,0.25)]">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0"></div>
            <div className="h-12 w-32 bg-zinc-900 rounded-[1.5rem]"></div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6 bg-zinc-950/90 border-t border-zinc-800/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-zinc-500">Kami tidak menyimpan Log Chat anda.</span>
          <div className="flex w-full gap-3 sm:w-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tulis pesan untuk Sigma..."
              className="min-w-0 flex-1 rounded-2xl border border-zinc-800/90 bg-zinc-900/75 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-amber-500 px-5 text-black font-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}