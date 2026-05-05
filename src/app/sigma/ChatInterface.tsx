"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const STORAGE_KEY = "aaa-gang-chat-log";
const initialMessages = [
  { role: "ai", text: "Aku Sigma yang jaga klan ini, kamu siapa?" }
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const placeholderOptions = [
    "Ask Sigma",
    "Ada slot kosong ga di clan saat ini?",
    "Lavaloon puppetku level 12 ke max butuh berapa ore?",
    "Apa rules clan ini?",
    "Apa benar Agung-R1-Distill-Llama-70B model yang bagus?",
    "Siapa leader clan ini?"
  ];

  useEffect(() => {
    if (input.trim() || isLoading) {
      setShowPlaceholder(false);
      return;
    }

    setShowPlaceholder(true);
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      timeout = setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
        setShowPlaceholder(true);
      }, 220);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [input, isLoading]);

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
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const formattedHistory = newMessages.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal nembak API");
      }

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
    <div className="ring-1 ring-white/10 flex flex-col h-[min(88vh,740px)] max-h-[calc(100vh-3rem)] overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.35)]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 bg-zinc-950/95">
        <div>
          <p className="text-[5px] uppercase tracking-[0.36em] text-zinc-600">We do not store your chat logs.</p>
          <h2 className="text-lg font-semibold text-zinc-200">Sigma <span className="text-[9px] text-amber-500">Basic</span></h2>
        </div>
        <button
          onClick={clearChat}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold text-zinc-400 transition hover:text-white"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* CHAT BODY */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-4 hide-scrollbar"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="h-10 w-10 rounded-full border border-amber-400/15 bg-amber-500/10 flex items-center justify-center text-amber-300">
                Σ
              </div>
            )}

            <div className={`max-w-[82%] rounded-[1.75rem] px-5 py-4 text-sm leading-7 break-words ${
              msg.role === "ai"
                ? "bg-zinc-900/95 border border-white/10 text-zinc-100"
                : "bg-amber-500/15 border border-amber-500/20 text-amber-100"
            }`}>
              {msg.role === "ai" ? (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-amber-300 prose-strong:font-semibold">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside my-3 ml-6 space-y-1">
                          {children}
                        </ol>
                      ),
                      table: ({ children }: any) => (
                        <div className="overflow-x-auto my-4">
                          <table className="w-full border-collapse border border-white/10">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }: any) => (
                        <th className="border border-white/10 px-3 py-2 bg-white/5 font-semibold">
                          {children}
                        </th>
                      ),
                      td: ({ children }: any) => (
                        <td className="border border-white/10 px-3 py-2">
                          {children}
                        </td>
                      )
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>

            {msg.role === "user" && (
              <div className="h-10 w-10 rounded-full border border-zinc-700/70 bg-zinc-900 text-zinc-300 flex items-center justify-center">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INPUT FIELD */}
      <div className="px-4 pb-4 pt-3 sm:px-6 bg-zinc-950/90">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder=""
              className="w-full rounded-lg border-1 border-zinc-800/70 bg-zinc-900/90 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-600 transition"
            />
            <div
              className={`pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-zinc-500 transition-opacity duration-300 ease-out ${
                showPlaceholder ? "opacity-100" : "opacity-0"
              }`}
            >
              {placeholderOptions[placeholderIndex]}
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-600 text-zinc-950 shadow-sm hover:bg-amber-500 disabled:opacity-40"
          >
            <Send size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}