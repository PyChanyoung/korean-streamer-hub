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

// ISO 8601 duration → 초 변환 (예: "PT1M30S" → 90)
function parseDuration(iso) {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? 0) * 3600) + (parseInt(m[2] ?? 0) * 60) + parseInt(m[3] ?? 0);
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

      // 쇼츠 포함 가능성 감안해 넉넉히 20개 가져오기
      const uploadsId = 'UU' + id.slice(2);
      const listUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=20&key=${YT_API_KEY}`;
      const listRes = await window.fetch(listUrl);
      if (!listRes.ok) throw new Error('API 오류');
      const listData = await listRes.json();

      const rawItems = (listData.items ?? []).map(item => ({
        videoId:   item.snippet.resourceId.videoId,
        title:     item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url
                ?? item.snippet.thumbnails?.default?.url
                ?? '',
      }));

      // 영상 길이 조회 (쇼츠 필터링용)
      const ids = rawItems.map(v => v.videoId).join(',');
      const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${YT_API_KEY}`;
      const detailRes = await window.fetch(detailUrl);
      if (!detailRes.ok) throw new Error('API 오류');
      const detailData = await detailRes.json();

      const durationMap = Object.fromEntries(
        (detailData.items ?? []).map(v => [v.id, parseDuration(v.contentDetails.duration)])
      );

      // 60초 초과 영상만 남기고 최대 8개
      const items = rawItems
        .filter(v => (durationMap[v.videoId] ?? 0) > 60)
        .slice(0, 8);

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
