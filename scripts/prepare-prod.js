// dev 코드를 prod 로 옮긴 뒤 워커 주소를 운영용으로 바꾼다.
//
// ⚠️ 모듈 분리(2026-08) 이후 워커 주소는 index.html 이 아니라 js/01-core.js 에 있다.
//    예전 이 스크립트는 index.html 만 고쳐서, 통과하고도 prod 프론트가 dev 백엔드를
//    호출하는 상태가 만들어질 수 있었다. 이제 세 파일을 모두 검사한다.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const devWorkerUrl = 'https://engr-hub-proxy-dev.engr-jira.workers.dev';
const prodWorkerUrl = 'https://engr-hub-proxy.engr-jira.workers.dev';

// 필수 = 없으면 실패, 선택 = 있으면 치환
const targets = [
  { rel: 'js/01-core.js', required: true },   // const WORKERS
  { rel: 'sw.js', required: true },           // const WORKER (푸시)
  { rel: 'index.html', required: true },      // 구버전 잔재 대비
];

let touched = 0;
for (const t of targets) {
  const p = path.join(root, t.rel);
  if (!fs.existsSync(p)) {
    if (t.required) { console.error(`[FAIL] ${t.rel} 없음 — dev 에서 복사했는지 확인하세요.`); process.exit(1); }
    continue;
  }
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replaceAll(devWorkerUrl, prodWorkerUrl);
  if (after !== before) { fs.writeFileSync(p, after, 'utf8'); touched++; }
}

// 리포 전체에 dev 주소가 남아 있으면 실패시킨다(빠뜨린 파일 탐지).
const skipDirs = new Set(['.git', 'node_modules', 'vendor', 'shots']);
const leftovers = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!/\.(js|html|json|jsonc|md|webmanifest)$/.test(name)) continue;
    if (name === 'prepare-prod.js') continue;            // 이 파일의 상수는 정상
    if (/^(CLAUDE|README)\.md$/i.test(name)) continue;    // 문서의 dev 주소 언급은 정상
    if (fs.readFileSync(p, 'utf8').includes('engr-hub-proxy-dev')) {
      leftovers.push(path.relative(root, p));
    }
  }
})(root);

if (leftovers.length) {
  console.error('[FAIL] dev 워커 주소가 남아 있습니다:\n  ' + leftovers.join('\n  '));
  process.exit(1);
}

console.log(`운영 워커 주소 적용 완료 (${touched}개 파일 치환) · 잔여 dev 주소 0건`);
