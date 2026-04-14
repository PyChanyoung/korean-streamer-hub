import { useState, useEffect } from 'react';

async function fetchStatus(chzzkId) {
  try {
    const res = await window.fetch(
      `https://api.chzzk.naver.com/polling/v2/channels/${chzzkId}/live-status`
    );
    if (!res.ok) return { isLive: false };
    const data = await res.json();
    const status = data?.content?.status;
    return {
      isLive: status === 'OPEN',
      title: data?.content?.liveTitle ?? '',
    };
  } catch {
    return { isLive: false };
  }
}

// 여러 채널의 라이브 상태를 한 번에 조회
export function useChzzkLive(chzzkIds) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!chzzkIds.length) { setLoading(false); return; }
    Promise.all(chzzkIds.map(id => fetchStatus(id).then(s => [id, s])))
      .then(results => {
        setStatuses(Object.fromEntries(results));
        setLoading(false);
      });
  }, []); // 마운트 시 1회 실행

  return { statuses, loading };
}
