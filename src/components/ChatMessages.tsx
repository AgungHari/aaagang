import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";

interface Message {
  role: "ai" | "user";
  text: string;
  thinking?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-4 hide-scrollbar"
    >
      {messages.map((msg, index) => (
        <MessageItem key={index} role={msg.role} text={msg.text} thinking={msg.thinking} />
      ))}
    </div>
  );
}
