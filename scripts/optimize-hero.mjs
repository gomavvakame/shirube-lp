// hero 画像のレスポンシブ派生ファイルを生成する。
// 元画像 public/hero.png は読み取り専用として扱い、削除・上書きしない。
//   使い方: npm run optimize:hero
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = 'public/hero.png';
const OUT_DIR = 'public';
const WIDTHS = [768, 1280, 1920, 2560];
const AVIF_QUALITY = 55;
const WEBP_QUALITY = 80;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const sizeOf = async (file) => (await stat(file)).size;

async function generate(image, width, format) {
  const file = path.join(OUT_DIR, `hero-${width}.${format}`);
  const pipeline = image.clone().resize({ width, withoutEnlargement: true });
  await (format === 'avif'
    ? pipeline.avif({ quality: AVIF_QUALITY })
    : pipeline.webp({ quality: WEBP_QUALITY })
  ).toFile(file);
  return { file, bytes: await sizeOf(file) };
}

const sourceBytes = await sizeOf(SOURCE);
const image = sharp(SOURCE);
const { width: srcWidth, height: srcHeight } = await image.metadata();

await mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const format of ['avif', 'webp']) {
  for (const width of WIDTHS) {
    results.push(await generate(image, width, format));
  }
}

console.log(`source: ${SOURCE} (${srcWidth}x${srcHeight}, ${kb(sourceBytes)})`);
for (const { file, bytes } of results) {
  const ratio = ((1 - bytes / sourceBytes) * 100).toFixed(1);
  console.log(`  ${file.padEnd(24)} ${kb(bytes).padStart(10)}  (-${ratio}% vs source)`);
}
