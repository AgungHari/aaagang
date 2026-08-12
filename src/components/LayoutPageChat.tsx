"use client";

import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";

interface Message {
  role: "ai" | "user";
  text: string;
  thinking?: string;
}

interface LayoutPageChatProps {
  clanName: string;
  initialMessage?: string;
}

const STORAGE_KEY = "aaa-gang-layout-chat-log";

const defaultLayoutPrompt = "Selamat datang di base layout, ketik untuk mencari base!";

const initialMessages: Message[] = [
  { role: "ai", text: defaultLayoutPrompt }
];

const placeholderOptions = [
  "Ask Sigma",
  "Base TH 17 buat legends league?",
  "Ada slot kosong ga di clan saat ini?",
  "Berapa Ore untuk max Equipment?",
  "Apa rules clan ini?",
  "Apakah 3agang.pro aman?",
  "Base TH 18 siap CWL",
  "Siapa leader clan ini?"
];

export default function LayoutPageChat({ clanName, initialMessage }: LayoutPageChatProps) {
  const pageStorageKey = initialMessage
    ? "aaa-gang-home-chat-log"
    : "aaa-gang-layout-chat-log";

  const defaultMessages: Message[] = initialMessage
    ? [{ role: "ai", text: initialMessage }]
    : initialMessages;

  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(pageStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
      setMessages(defaultMessages);
    } catch (e) {
      console.warn(e);
      setMessages(defaultMessages);
    }
  }, [pageStorageKey, initialMessage]);

  useEffect(() => {
    localStorage.setItem(pageStorageKey, JSON.stringify(messages));
  }, [messages, pageStorageKey]);

  const clearChat = () => {
    if (confirm("Hapus semua memori Sigma?")) {
      setMessages(defaultMessages);
      localStorage.removeItem(pageStorageKey);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsExpanded(true);

    const userMsg: Message = { role: "user", text: input };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "ai", text: "" } as Message]);

    try {
      const formattedHistory = newMessages.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
          modelType: "plus"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal nembak API");
      }

      if (!response.body) throw new Error("Gak ada body stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let accumulatedText = "";
      let accumulatedThinking = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "" || line.includes("[DONE]")) continue;

          if (line.startsWith("data: ")) {
            try {
              const jsonString = line.replace(/^data: /, "");
              const parsed = JSON.parse(jsonString);
              
              const delta = parsed.choices?.[0]?.delta || {};

              if (delta.content) {
                if (Array.isArray(delta.content)) {
                  for (const item of delta.content) {
                    if (item.type === "thinking" && Array.isArray(item.thinking)) {
                      for (const thinkItem of item.thinking) {
                        if (thinkItem.type === "text" && thinkItem.text) {
                          accumulatedThinking += thinkItem.text;
                        }
                      }
                    }
                  }
                } else if (typeof delta.content === "string") {
                  accumulatedText += delta.content;
                }
              }

              const thinkingPart = delta.reasoning || delta.reasoning_content;
              if (thinkingPart) {
                accumulatedThinking += thinkingPart;
              }

            } catch (e) {
              console.warn("Skip chunk error:", line);
            }
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: accumulatedText,
            thinking: accumulatedThinking
          };
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`transition-all duration-300 ease-out ${
        isExpanded 
          ? "fixed inset-0 z-[9999] p-4 bg-black/40 backdrop-blur-lg" 
          : "relative mb-12"
      }`}
    >
      <div 
        ref={chatContainerRef}
        className={`ring-1 ring-white/10 flex flex-col ${
          isExpanded 
            ? "h-[90vh] rounded-lg shadow-2xl" 
            : "h-[min(88vh,300px)] rounded-lg max-h-[calc(100vh-3rem)]"
        } overflow-visible shadow-[0_35px_80px_rgba(0,0,0,0.35)]`}
      >
        {/* Header dengan expand/collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900/80 rounded-t-lg">
          <div className="flex-1">
            <h3 className="text-[5px] uppercase tracking-[0.36em] text-zinc-600">We do not store your chat logs.</h3>
            <p className="text-lg font-semibold text-zinc-200">Sigma</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="px-3 py-1 text-xs rounded hover:bg-white/10 transition-colors text-gray-400"
            >
              Clear
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded transition-colors text-white animate-pulse"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 size={18} />
              ) : (
                <Maximize2 size={18} />
              )}
            </button>
          </div>
        </div>

        <ChatMessages messages={messages} />

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholderOptions={placeholderOptions}
        />
      </div>

      {/* Close button for expanded mode */}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors text-white z-10"
        >
          
        </button>
      )}
    </div>
  );
}
