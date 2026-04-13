"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const STORAGE_KEY = "aaa-gang-chat-log";
const initialMessages = [
  { role: "ai", text: "Aku Sigma yang jaga klan ini, kamu siapa?" }
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah tiap ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      } catch (e) { console.warn(e); }
    }
  }, []);

  // Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    if (confirm("Hapus semua memori Sigma?")) {
      setMessages(initialMessages);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Tambahkan placeholder pesan AI kosong untuk diisi stream
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) throw new Error("Gak ada body stream");

      const reader = response.body.getReader();
      const decoder = new TextEncoder();
      let accumulatedText = "";

      // Loop untuk membaca stream per chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;

        // Update pesan terakhir (pesan AI) secara real-time
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = accumulatedText;
          return updated;
        });
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Otak gue lagi korslet, ntar balik lagi!";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/60 rounded-[2rem] flex flex-col h-[min(88vh,740px)] max-h-[calc(100vh-3rem)] overflow-hidden backdrop-blur-xl shadow-[0_40px_90px_rgba(0,0,0,0.4)]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950/95">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black">AAA GANG Chat</p>
          <h2 className="text-base md:text-lg font-bold text-zinc-100">Sigma (Current Model : Ministral-14B)</h2>
        </div>
        <button
          onClick={clearChat}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/80 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-amber-400 hover:text-amber-300 transition-all"
        >
          <Trash2 size={16} /> Hapus
        </button>
      </div>

      {/* CHAT BODY */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-4 scrollbar-hide"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-amber-500/20 bg-amber-500/5 shadow-[0_0_18px_rgba(245,158,11,0.18)]">
                <img src="/favicon.ico" alt="AAA GANG" className="w-7 h-7 object-contain" />
              </div>
            )}
            <div className={`rounded-[1.75rem] px-5 py-4 text-sm leading-7 break-words ${
              msg.role === "ai"
                ? "bg-zinc-900 border border-amber-500/10 text-zinc-200"
                : "bg-amber-500 text-zinc-950 font-semibold"
            }`}>
              {msg.role === "ai" ? (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-amber-400 prose-strong:font-black">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-300">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INPUT FIELD */}
      <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6 bg-zinc-950/90 border-t border-zinc-800/60">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Tulis pesanmu ke Sigma..."
            className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}