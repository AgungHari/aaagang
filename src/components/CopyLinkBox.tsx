'use client';

interface CopyLinkBoxProps {
  copyLink: string;
}

export default function CopyLinkBox({ copyLink }: CopyLinkBoxProps) {
  if (!copyLink) return null;

  return (
    <div>
      <h2 className="text-lg text-amber-500 mb-4">
        Copy Base Link
      </h2>
      <div className="bg-zinc-800/50 border border-white/10 rounded-lg p-4">
        <code className="text-xs text-blue-400 break-all font-mono">
          {copyLink}
        </code>
      </div>
    </div>
  );
}
