# Character images used by the site

Put the supplied character PNGs in this folder. The app checks these names first, then tries WebP/JPG/JPEG versions and finally falls back to the embedded copy:

- 치이카와.png, 하치와레.png, 우사기.png, 모몽가.png
- 쿠리만쥬.png (also 쿠리만주.png), 랏코.png, 시사.png, 카니.png
- 아노코.png, 포셰트갑옷씨.png, 라멘갑옷씨.png, 노동갑옷씨.png, 데카츠요.png

The three pasted clipboard images can instead keep their original `codex-clipboard-...png` names; `project-images.js` includes those aliases. Paths are relative to `index.html`, so the project can be moved as a folder. The image/ files take priority over embedded fallback art.
# 사이트 공용 이미지

- 사이트 로고: `image/logo.png`
- 사이트 아이콘(ICO): `image/favicon.ico`

로고는 시작 화면의 제목 옆에 표시되며, 배경 투명도를 유지하고 모서리를 둥글게 자르지 않습니다. 아이콘은 브라우저 탭에 표시됩니다. 이미지가 없으면 로고 대신 텍스트 제목으로 정상 표시됩니다.
