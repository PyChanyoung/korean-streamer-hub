import { useState } from 'react';
import { useLatestVideos } from '../hooks/useLatestVideos';

export default function VideoDropdown({ channelId, handle, username, onPlay }) {
  const [open, setOpen] = useState(false);
  const { videos, loading, error, load } = useLatestVideos({ channelId, handle, username });

  const hasSource = channelId || handle || username;
  if (!hasSource) return null;

  function handleToggle() {
    setOpen(v => !v);
    load();
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-all
          ${open
            ? 'border-[#6c63ff] text-[#e8eaf6] bg-[#22263a]'
            : 'border-[#2e3248] text-[#8b90b0] bg-[#22263a] hover:border-[#6c63ff] hover:text-[#e8eaf6]'
          }`}
      >
        <span>▶ 최신 영상 보기</span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
          {loading && <p className="text-center text-sm text-[#8b90b0] py-3">불러오는 중...</p>}
          {error   && <p className="text-center text-sm text-red-400 py-3">{error}</p>}
          {!loading && !error && videos.map(v => (
            <button
              key={v.videoId}
              onClick={() => onPlay(v.videoId, v.title)}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#22263a] transition-colors text-left w-full"
            >
              <img
                src={v.thumbnail}
                alt=""
                loading="lazy"
                style={{ width: '72px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
              />
              <span className="text-xs text-[#8b90b0] leading-snug line-clamp-2">{v.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
