const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const workerPath = path.join(root, 'worker.js');

const devWorkerUrl = 'https://engr-hub-proxy-dev.mj-park.workers.dev';
const prodWorkerUrl = 'https://engr-hub-proxy.mj-park.workers.dev';

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replaceAll(devWorkerUrl, prodWorkerUrl);

if (html.includes('engr-hub-proxy-dev')) {
  console.error('A dev Worker URL is still present in index.html.');
  process.exit(1);
}

fs.writeFileSync(indexPath, html, 'utf8');

if (!fs.existsSync(workerPath)) {
  console.warn('worker.js not found. Copy it from engr-hub-dev before Worker deploy.');
}

console.log('Production Worker URL is set in index.html.');
