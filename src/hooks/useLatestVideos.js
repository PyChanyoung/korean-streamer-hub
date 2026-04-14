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
      const uploadsId = 'UU' + id.slice(2);
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=8&key=${YT_API_KEY}`;
      const res = await window.fetch(url);
      if (!res.ok) throw new Error('API 오류');
      const data = await res.json();
      const items = (data.items ?? []).map(item => ({
        videoId:   item.snippet.resourceId.videoId,
        title:     item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url
                ?? item.snippet.thumbnails?.default?.url
                ?? '',
      }));
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
