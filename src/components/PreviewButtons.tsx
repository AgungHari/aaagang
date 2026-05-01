'use client';

import { Eye, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PreviewButtonsProps {
  imageUrl: string;
  sourceUrl: string;
  variant?: 'desktop' | 'mobile';
}

export default function PreviewButtons({ imageUrl, sourceUrl, variant = 'desktop' }: PreviewButtonsProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  const handlePreviewSource = () => {
    window.open(sourceUrl, '_blank');
  };

  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={() => setShowImageModal(true)}
          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-semibold"
        >
          <Eye size={16} />
          <span>Image</span>
        </button>
        <button
          onClick={handlePreviewSource}
          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-semibold"
        >
          <ExternalLink size={16} />
          <span>Source</span>
        </button>

        {/* Image Modal */}
        {showImageModal && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="bg-zinc-900 border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Image Preview</h3>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
                <img
                  src={imageUrl}
                  alt="Layout preview"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowImageModal(true)}
        className="inline-flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 px-3 py-1.5 rounded-lg transition text-sm font-semibold"
      >
        <Eye size={14} />
        Image
      </button>
      <button
        onClick={handlePreviewSource}
        className="inline-flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 px-3 py-1.5 rounded-lg transition text-sm font-semibold"
      >
        <ExternalLink size={14} />
        Source
      </button>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">Image Preview</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
              <img
                src={imageUrl}
                alt="Layout preview"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
