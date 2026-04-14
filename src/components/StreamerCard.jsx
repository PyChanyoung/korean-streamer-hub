import VideoDropdown from './VideoDropdown';
import { NETWORK_STYLES } from '../config';

export default function StreamerCard({ streamer, liveStatus, onPlay }) {
  const { name, network, generation, chzzkId, channelId, handle, username, links } = streamer;
  const style  = NETWORK_STYLES[network] ?? { badge: 'bg-[#22263a] text-[#8b90b0]', accentBorder: 'hover:border-[#6c63ff]' };
  const isLive = liveStatus?.isLive ?? false;

  return (
    <div
      className={`bg-[#1a1d27] border border-[#2e3248] rounded-2xl p-5 flex flex-col gap-3
        transition-all duration-200 hover:-translate-y-1 ${style.accentBorder}`}
    >
      {/* 헤더: 이름 + 라이브 뱃지 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-base font-bold text-[#e8eaf6] truncate">{name}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
              {network}
            </span>
            {generation && (
              <span className="text-xs text-[#8b90b0]">{generation}</span>
            )}
          </div>
        </div>

        {/* 라이브 상태 인디케이터 */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0
          ${isLive
            ? 'bg-[#0d2a0d] text-[#4ade80] border border-[#4ade80]/30'
            : 'bg-[#1e2030] text-[#4b5280] border border-[#2e3248]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLive ? 'bg-[#4ade80] animate-pulse' : 'bg-[#4b5280]'}`} />
          {isLive ? 'LIVE' : 'OFF'}
        </div>
      </div>

      {/* 채널 링크들 */}
      <div className="flex gap-2 flex-wrap">
        {links.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
              bg-[#22263a] text-[#8b90b0] border border-[#2e3248]
              hover:bg-[#6c63ff] hover:text-white hover:border-[#6c63ff] transition-all"
          >
            ↗ {link.label}
          </a>
        ))}
      </div>

      {/* 최신 영상 드롭다운 */}
      <VideoDropdown
        channelId={channelId}
        handle={handle}
        username={username}
        onPlay={onPlay}
      />
    </div>
  );
}
