"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { ModelOption } from "@/types/model-option";

interface Message {
  role: "ai" | "user";
  text: string;
  thinking?: string; // Optional untuk teks "mikir"
}

const STORAGE_KEY = "aaa-gang-chat-log";
const MODEL_OPTIONS = [
  { value: "plateau", label: "Plateau", description: "Flagship - 100T Kleng!", disabled: true },
  { value: "co-leader-separator", label: "Co Leader Only", isSeparator: true },
  { value: "absolute", label: "Absolute", description: "Insane - 'The All Knowing'", disabled: true },
  { value: "ultra", label: "Ultra", description: "Complex - OCR & Search", disabled: true },
  { value: "clan-member-separator", label: "Clan Member Only", isSeparator: true },
  { value: "pro", label: "Pro", description: "Reasoning - Smart", disabled: false },
  { value: "plus", label: "Plus", description: "More - Base Search", disabled: false },
  { value: "basic", label: "Basic", description: "Default - Fast", disabled: false },
  { value: "lite", label: "Lite", description: "Legacy - Selfhosted", disabled: false },
  { value: "old", label: "Old", description: "Legacy - Slow & Yapping", disabled: false },
];

const initialMessages: Message[] = [
  { role: "ai", text: "Aku sigma yang jaga klan ini, silahkan tanyakan apapun!" }
];

const placeholderOptions = [
  "Ask Sigma",
  "Base TH 17 buat legends league?",
  "Ada slot kosong ga di clan saat ini?",
  "Lavaloon puppetku level 12",
  "ke max butuh berapa ore?",
  "Apa rules clan ini?",
  "Apa benar Agung-R1-Distill",
  "Llama-70B model yang bagus?",
  "Base TH 18 siap CWL",
  "Siapa leader clan ini?"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("basic");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Load chat dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
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

  const handleModelChange = (newModelValue: string) => {
    if (selectedModel !== newModelValue) {
      if (confirm("Merubah varian akan menghapus memori sigma")) {
        setMessages(initialMessages);
        localStorage.removeItem(STORAGE_KEY);
        setSelectedModel(newModelValue);
        setShowModelDropdown(false);
      }
    } else {
      setShowModelDropdown(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

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
          modelType: selectedModel
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

      // Loop untuk membaca stream per chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          // Lewati baris kosong atau sinyal [DONE]
          if (line.trim() === "" || line.includes("[DONE]")) continue;

          if (line.startsWith("data: ")) {
            try {
              const jsonString = line.replace(/^data: /, "");
              const parsed = JSON.parse(jsonString);
              
              const delta = parsed.choices?.[0]?.delta || {};

              if (delta.content) {
                if (Array.isArray(delta.content)) {
                  // Kalau bentuknya Array, berarti dia lagi "Mikir" (Format Magistral)
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
                  // Kalau bentuknya String, berarti dia lagi "Bicara" jawaban akhir
                  accumulatedText += delta.content;
                }
              }

              // 2. Ambil teks "mikir" (Support format Mistral & model lain)
              // Mistral pakai delta.reasoning
              // DeepSeek/lainnya pakai delta.reasoning_content
              const thinkingPart = delta.reasoning || delta.reasoning_content;
              if (thinkingPart) {
                accumulatedThinking += thinkingPart;
              }

            } catch (e) {
              console.warn("Skip chunk error (bukan JSON):", line);
            }
          }
        }

        // Langsung tembak ke UI biar animasinya mulus
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
    <div className="ring-1 ring-white/10 flex flex-col h-[min(88vh,740px)] max-h-[calc(100vh-3rem)] overflow-visible shadow-[0_35px_80px_rgba(0,0,0,0.35)]">
      <ChatHeader
        selectedModel={selectedModel}
        showModelDropdown={showModelDropdown}
        onToggleModelDropdown={() => setShowModelDropdown(!showModelDropdown)}
        onModelChange={handleModelChange}
        onClearChat={clearChat}
        modelOptions={MODEL_OPTIONS}
      />

      <ChatMessages messages={messages} />

      <ChatInput
        input={input}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholderOptions={placeholderOptions}
      />
    </div>
  );
}