import { useState, useCallback } from 'react';
import { YT_API_KEY } from '../config';

const cache = {};

async function resolveChannelId({ channelId, handle, username }) {
  if (channelId) return channelId;
  if (handle) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${YT_API_KEY}`;
    const res = await window.fetch(url);
    if (!res.ok) throw new Error('handle 조회 실패');
    const data = await res.json();
    return data.items?.[0]?.id ?? null;
  }
  if (username) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(username)}&key=${YT_API_KEY}`;
    const res = await window.fetch(url);
    if (!res.ok) throw new Error('username 조회 실패');
    const data = await res.json();
    return data.items?.[0]?.id ?? null;
  }
  return null;
}

async function fetchVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=8&key=${YT_API_KEY}`;
  const res = await window.fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.items?.length) return null;
  return data.items.map(item => ({
    videoId:   item.snippet.resourceId.videoId,
    title:     item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url
            ?? item.snippet.thumbnails?.default?.url
            ?? '',
  }));
}

export function useLatestVideos({ channelId, handle, username }) {
  const cacheKey = channelId ?? `h:${handle}` ?? `u:${username}`;
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [loaded, setLoaded]   = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    if (cache[cacheKey]) { setVideos(cache[cacheKey]); setLoaded(true); return; }
    setLoading(true);
    setError(null);
    try {
      const id = await resolveChannelId({ channelId, handle, username });
      if (!id) throw new Error('채널 ID를 찾을 수 없습니다');

      const hash = id.slice(2); // 'UC...' → 'UC' 제거
      // UULF: 동영상 탭 전용 플레이리스트 (Shorts/라이브 제외), 비공식이지만 현재 동작함
      // 실패 시 UU(전체 업로드)로 폴백
      const items =
        (await fetchVideos('UULF' + hash)) ??
        (await fetchVideos('UU'   + hash));

      if (!items) throw new Error('영상을 불러오지 못했습니다.');

      cache[cacheKey] = items;
      setVideos(items);
      setLoaded(true);
    } catch {
      setError('영상을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, channelId, handle, username, loaded]);

  return { videos, loading, error, load };
}
