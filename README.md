# Streamer Hub

치지직 스트리머 & 버츄얼 유튜버 모음 사이트입니다.
라이브 상태 확인, 최신 유튜브 영상 보기, 채널 링크 제공.

🔗 **배포 주소**: https://pychanyoung.github.io/korean-streamer-hub

---

## 파일 구조

```
src/
├── config.js            사이트 제목, 그룹 탭, 색상 설정
├── data/streamers.js    ← ✏️ 스트리머 데이터 (여기만 수정)
├── App.jsx              레이아웃, 정렬, 탭 필터
├── components/
│   ├── StreamerCard.jsx   스트리머 카드 (라이브 뱃지 + 링크 + 영상)
│   ├── VideoDropdown.jsx  최신 영상 드롭다운
│   └── Modal.jsx          인라인 영상 플레이어
└── hooks/
    ├── useChzzkLive.js    치지직 라이브 상태 조회
    └── useLatestVideos.js YouTube 최신 영상 조회 (Shorts 제외)
```

---

## 스트리머 추가 / 수정

`src/data/streamers.js` 파일만 편집하면 됩니다.

```js
{
  name: '스트리머명',
  network: '픽셀 네트워크',  // 또는 '스텔라이브'
  generation: null,          // 스텔라이브만 사용 (예: '1st Everys')
  chzzkId: 'xxxxxxxx...',    // 치지직 채널 URL 마지막 부분
  channelId: 'UCxxxxxxxx',   // YouTube 채널 ID (아래 참고)
  handle: null,              // @handle 형식일 때 (channelId 없을 때 사용)
  username: null,            // /user/xxx 구형 형식일 때
  links: [
    { label: '치지직', url: 'https://chzzk.naver.com/...' },
    { label: '유튜브', url: 'https://www.youtube.com/@...' },
    { label: '다시보기', url: 'https://www.youtube.com/@...' },
  ],
},
```

### channelId / handle / username 우선순위
영상 드롭다운은 아래 순서로 채널을 찾습니다:
1. `channelId` 있으면 바로 사용 (가장 빠름)
2. `handle` 있으면 YouTube API로 조회
3. `username` 있으면 YouTube API로 조회
4. 셋 다 없으면 드롭다운 미표시

### YouTube 채널 ID 찾는 법
- URL이 `youtube.com/channel/UCxxxxxxxx` → `UCxxxxxxxx`가 채널 ID
- URL이 `youtube.com/@handle` → `handle` 필드에 `@` 없이 입력
- [playboard.co](https://playboard.co) 에서 채널명 검색 → URL에서 확인

### 치지직 채널 ID 찾는 법
- 치지직 채널 URL: `chzzk.naver.com/xxxxxxxx...`
- 마지막 경로 부분이 chzzkId

---

## 정렬 기준

- **픽셀 네트워크**: 이름 내림차순 (가나다 역순)
- **스텔라이브**: `streamers.js`에 작성된 순서 그대로 (기수별 순서 유지)

스텔라이브에 새 기수가 추가되면 데이터 파일에서 해당 기수 위치에 맞게 추가하세요.

---

## 그룹 추가

새 소속사/그룹을 추가하려면 두 파일을 수정합니다.

**`src/config.js`**
```js
export const FILTERS = [
  ...
  { key: '새그룹명', label: '새그룹명', activeClass: 'bg-[#색상] border-[#색상] text-white' },
];

export const NETWORK_STYLES = {
  ...
  '새그룹명': { badge: 'bg-[#배경색] text-[#텍스트색]', accentBorder: 'hover:border-[#색상]' },
};
```

**`src/data/streamers.js`**
```js
{ name: '...', network: '새그룹명', ... }
```

---

## 개발 & 배포

```bash
# 로컬 개발 서버
npm run dev

# GitHub Pages 배포
npm run deploy
```

---

## 현재 스트리머 목록

### 픽셀 네트워크 (18명)
강지, 금사향, 김뚜띠, 김뿡, 김똘복, 나나양, 너불, 뇨롱이, 모라라, 설백, 아구이뽀, 연비니, 이초홍, 임나은, 지누, 채현찌, 탬탬버린, 핑맨

### 스텔라이브 (10명)
| 기수 | 멤버 |
|------|------|
| 1st Everys | 아야츠노 유니, 사키하네 후야 |
| 2nd Universe | 시라유키 히나, 네네코 마시로, 아카네 리제, 아라하시 타비 |
| 3rd Cliché | 텐코 시부키, 아오쿠모 린, 하나코 나나, 유즈하 리코 |
