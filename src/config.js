// ================================================================
//  사이트 설정
// ================================================================

export const SITE = {
  title: 'Streamer',
  titleAccent: 'Hub',
  subtitle: '치지직 스트리머 & 버츄얼 유튜버 모음',
  footerNote: 'src/data/streamers.js 파일에 스트리머를 추가하면 됩니다.',
};

export const FILTERS = [
  { key: 'all',        label: '전체',       activeClass: 'bg-[#6c63ff] border-[#6c63ff] text-white' },
  { key: '픽셀 네트워크', label: '픽셀 네트워크', activeClass: 'bg-[#f97316] border-[#f97316] text-white' },
  { key: '스텔라이브',   label: '스텔라이브',  activeClass: 'bg-[#a855f7] border-[#a855f7] text-white' },
];

export const NETWORK_STYLES = {
  '픽셀 네트워크': { badge: 'bg-[#3d1f0a] text-[#f97316]', accentBorder: 'hover:border-[#f97316]' },
  '스텔라이브':   { badge: 'bg-[#2a0a3d] text-[#a855f7]', accentBorder: 'hover:border-[#a855f7]' },
};

