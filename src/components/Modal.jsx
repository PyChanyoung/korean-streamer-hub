import { useEffect } from 'react';

export default function Modal({ videoId, title, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#1a1d27] border border-[#2e3248] rounded-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2e3248]">
          <span className="text-sm font-semibold text-[#e8eaf6] truncate pr-4">{title}</span>
          <button
            onClick={onClose}
            className="text-[#8b90b0] hover:text-[#e8eaf6] text-xl leading-none transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
