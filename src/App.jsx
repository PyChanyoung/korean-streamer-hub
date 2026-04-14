import { useState } from 'react';
import { streamers } from './data/streamers';
import StreamerCard from './components/StreamerCard';
import Modal from './components/Modal';
import { useChzzkLive } from './hooks/useChzzkLive';
import { SITE, FILTERS } from './config';

// 이름 내림차순 정렬 (한국어)
const sorted = [...streamers].sort((a, b) => b.name.localeCompare(a.name, 'ko'));

export default function App() {
  const [filter, setFilter] = useState('all');
  const [modal, setModal]   = useState({ videoId: null, title: '' });

  const chzzkIds = streamers.map(s => s.chzzkId);
  const { statuses, loading: liveLoading } = useChzzkLive(chzzkIds);

  const filtered = sorted.filter(
    s => filter === 'all' || s.network === filter
  );

  return (
    <>
      <header className="text-center px-8 pt-10 pb-6 border-b border-[#2e3248]">
        <h1 className="text-3xl font-bold tracking-tight text-[#e8eaf6]">
          {SITE.title} <span className="text-[#6c63ff]">{SITE.titleAccent}</span>
        </h1>
        <p className="mt-2 text-[#8b90b0] text-sm">{SITE.subtitle}</p>
        {liveLoading && (
          <p className="mt-1 text-[#4b5280] text-xs">라이브 상태 확인 중...</p>
        )}
      </header>

      <div className="flex justify-center gap-3 px-8 py-7 flex-wrap">
        {FILTERS.map(({ key, label, activeClass }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2 rounded-full text-sm border transition-all
              ${filter === key
                ? activeClass
                : 'bg-[#1a1d27] border-[#2e3248] text-[#8b90b0] hover:border-[#6c63ff] hover:text-[#e8eaf6]'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 px-8 pb-16 max-w-6xl mx-auto w-full">
        {filtered.map(streamer => (
          <StreamerCard
            key={streamer.chzzkId}
            streamer={streamer}
            liveStatus={statuses[streamer.chzzkId]}
            onPlay={(videoId, title) => setModal({ videoId, title })}
          />
        ))}
      </main>

      <footer className="text-center py-8 text-[#8b90b0] text-xs border-t border-[#2e3248]">
        {SITE.footerNote}
      </footer>

      <Modal
        videoId={modal.videoId}
        title={modal.title}
        onClose={() => setModal({ videoId: null, title: '' })}
      />
    </>
  );
}
