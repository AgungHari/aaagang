'use client';

import ReactMarkdown from 'react-markdown';

interface LayoutDescriptionProps {
  content: string;
}

export default function LayoutDescription({ content }: LayoutDescriptionProps) {
  if (!content) return null;

  return (
    <div>
      <div className="text-zinc-200/70 leading-relaxed prose prose-sm prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-3">{children}</p>,
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mb-2">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 pl-6 space-y-1">{children}</ul>
            ),
            li: ({ children }) => <li className="list-disc">{children}</li>,
            code: ({ children }) => (
              <code className="bg-zinc-800 px-2 py-1 rounded text-blue-300">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-amber-500 pl-4 py-2 italic text-gray-400">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
