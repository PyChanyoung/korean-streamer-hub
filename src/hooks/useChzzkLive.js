import { useState, useEffect } from 'react';

// 60초마다 라이브 상태를 재조회 (비공식 API 과부하 방지)
const POLL_INTERVAL_MS = 60_000;

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

async function fetchAll(chzzkIds) {
  const results = await Promise.all(
    chzzkIds.map(id => fetchStatus(id).then(s => [id, s]))
  );
  return Object.fromEntries(results);
}

// 여러 채널의 라이브 상태를 한 번에 조회하고 60초마다 갱신
export function useChzzkLive(chzzkIds) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!chzzkIds.length) { setLoading(false); return; }

    // 최초 조회
    fetchAll(chzzkIds).then(result => {
      setStatuses(result);
      setLoading(false);
    });

    // 60초마다 재조회
    const interval = setInterval(() => {
      fetchAll(chzzkIds).then(setStatuses);
    }, POLL_INTERVAL_MS);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return { statuses, loading };
}
