import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";

interface Message {
  role: "ai" | "user";
  text: string;
  thinking?: string;
  sigmaMood?: "happy" | "thinking" | "explaining";
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px tolerance
    
    if (isNearBottom) {
      scrollRef.current.scrollTop = scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 hide-scrollbar"
    >
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          role={msg.role}
          text={msg.text}
          thinking={msg.thinking}
          sigmaMood={msg.sigmaMood}
        />
      ))}
    </div>
  );
}
