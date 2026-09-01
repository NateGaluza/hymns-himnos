// Scans the /hymns folder, builds manifest.json (sorted alphabetically by
// title), and writes it to the site root. Runs automatically on every
// Netlify deploy (see netlify.toml) — you never need to run this by hand.

const fs = require('fs');
const path = require('path');

const HYMNS_DIR = path.join(__dirname, 'hymns');
const OUTPUT_FILE = path.join(__dirname, 'manifest.json');
const AUDIO_EXTENSIONS = new Set(['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac']);

function titleFromFilename(filename) {
  const base = filename.replace(path.extname(filename), '');
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function build() {
  if (!fs.existsSync(HYMNS_DIR)) {
    fs.mkdirSync(HYMNS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(HYMNS_DIR).filter((f) => {
    return AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()) && !f.startsWith('.');
  });

  const tracks = files
    .map((file) => ({ file, title: titleFromFilename(file) }))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tracks, null, 2));
  console.log(`Wrote manifest.json with ${tracks.length} hymn(s):`);
  tracks.forEach((t, i) => console.log(`  ${i + 1}. ${t.title}`));
}

build();
