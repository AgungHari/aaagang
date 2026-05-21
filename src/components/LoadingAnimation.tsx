import React from 'react';

export function LoadingAnimation() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        .dot-bounce {
          animation: bounce 1.2s infinite;
          display: inline-block;
        }
        
        .dot-1 {
          animation-delay: 0s;
        }
        
        .dot-2 {
          animation-delay: 0.2s;
        }
        
        .dot-3 {
          animation-delay: 0.4s;
        }
      `}</style>
      
      <span className="dot-bounce dot-1 inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500"></span>
      <span className="dot-bounce dot-2 inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500"></span>
      <span className="dot-bounce dot-3 inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500"></span>
      
      <span className="ml-2 text-xs text-zinc-400 font-medium">
        Sigma is calculating your answer...
      </span>
    </div>
  );
}
