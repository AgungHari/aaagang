import { User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageItemProps {
  role: "user" | "ai";
  text: string;
  thinking?: string;
}
const markdownComponents = {
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside my-3 ml-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside my-3 ml-6 space-y-1">{children}</ol>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-white/10">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-white/10 px-3 py-2 bg-white/5 font-semibold">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border border-white/10 px-3 py-2">{children}</td>
  ),
};

export function MessageItem({ role, text, thinking }: MessageItemProps) {
  return (
    <div
      className={`flex items-end gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      {role === "ai" && (
        <div className="h-10 w-10 rounded-full border border-amber-400/15 bg-amber-500/10 flex items-center justify-center text-amber-300">
          Σ
        </div>
      )}

      <div className={`max-w-[82%] rounded-2xl px-5 py-4 text-sm leading-7 break-words ${
        role === "ai"
          ? "bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-100"
          : "bg-amber-700/10 border border-amber-500/20 text-amber-100"
      }`}>
        {role === "ai" ? (
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-amber-300 prose-strong:font-semibold">
            
            {thinking && (
              <div className="mb-5 mt-1 rounded-xl bg-black/40 border border-white/5 p-4 font-sans text-zinc-400 shadow-inner">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span className="animate-pulse">Sigma is thinking</span> 
                </div>
                
                {/* Di sini keajaibannya! Kita pakai ReactMarkdown juga untuk 'thinking' */}
                <div className="text-sm italic opacity-80 border-l-2 border-zinc-700 pl-3 prose-strong:text-zinc-300">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={markdownComponents}
                  >
                    {thinking}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {text}
            </ReactMarkdown>
            
          </div>
        ) : (
          text
        )}
      </div>

      {role === "user" && (
        <div className="h-10 w-10 flex-shrink-0 rounded-full border border-zinc-700/70 bg-zinc-900 text-zinc-300 flex items-center justify-center">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
