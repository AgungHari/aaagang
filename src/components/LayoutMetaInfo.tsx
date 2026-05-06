'use client';

interface LayoutMetaInfoProps {
  thLevel: number;
  baseTag: string;
  uploadDate: string;
}

export default function LayoutMetaInfo({
  thLevel,
  baseTag,
  uploadDate,
}: LayoutMetaInfoProps) {
  const formattedDate = new Date(uploadDate).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/10">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
          Town Hall Level
        </p>
        <p className="text-3xl font-bold">TH {thLevel}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
          Base Tag
        </p>
        <p className="text-2xl font-bold text-white">{baseTag}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
          Uploaded
        </p>
        <p className="text-lg font-semibold text-zinc-400">{formattedDate}</p>
      </div>
    </div>
  );
}
