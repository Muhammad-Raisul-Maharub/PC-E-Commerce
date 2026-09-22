const fs = require('fs');
const path = require('path');
const https = require('https');

const API_TOKEN = '36402aa1da8d4f7b96c49468a74ca351';
const TARGET_DIR = path.join(__dirname, '..', 'public', 'models');

const MODELS_TO_DOWNLOAD = [
  { filename: 'ram-corsair.glb', uid: 'ee5c6e6b2e524d63a7043365e73a2420', label: 'Corsair Vengeance DDR4 RGB' },
  { filename: 'cpu-threadripper.glb', uid: 'a84edceec9884dd3bf763a5d6a904b9b', label: 'AMD Ryzen Threadripper' },
  { filename: 'switch-cherry-mx.glb', uid: '71e8e1687abc4a8fbef195ab09581287', label: 'Cherry MX Switches' },
  { filename: 'motherboard-atx.glb', uid: '3bc94057328243d4b341a55f59160f8a', label: 'ATX Motherboard + Components' },
  { filename: 'chassis-gaming.glb', uid: 'd1d8282c9916438091f11aeb28787b66', label: 'Gaming Desktop PC Case' },
  { filename: 'gpu-rtx4090.glb', uid: 'd417c0b4c3bd475eb9669afcd14a2601', label: 'GeForce RTX 4090 Founders Edition' }
];

function getDownloadUrl(uid) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.sketchfab.com',
      path: `/v3/models/${uid}/download`,
      headers: { 'Authorization': `Token ${API_TOKEN}` }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.glb && json.glb.url) {
            resolve(json.glb.url);
          } else {
            reject(new Error(`No .glb format for UID ${uid}`));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function start() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log(`Starting automated download of ${MODELS_TO_DOWNLOAD.length} models using user Sketchfab token...`);

  for (const item of MODELS_TO_DOWNLOAD) {
    const dest = path.join(TARGET_DIR, item.filename);
    console.log(`\nFetching download URL for: ${item.label} (${item.filename})...`);
    try {
      const url = await getDownloadUrl(item.uid);
      console.log(`Downloading ${item.filename} to ${dest}...`);
      await downloadFile(url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ Downloaded ${item.filename} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.filename}:`, err.message);
    }
  }

  console.log('\nAll model downloads processed!');
}

start();
