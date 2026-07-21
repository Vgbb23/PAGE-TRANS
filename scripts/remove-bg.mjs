import Jimp from 'jimp';
import { existsSync } from 'node:fs';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Uso: node remove-bg.mjs <entrada> <saida>');
  process.exit(1);
}
if (!existsSync(inPath)) {
  console.error('Arquivo de entrada nao encontrado:', inPath);
  process.exit(1);
}

const THRESHOLD = 60; // luminancia maxima considerada "fundo preto"

const image = await Jimp.read(inPath);
const { width, height, data } = image.bitmap;

const isDark = (idx) => {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  return Math.max(r, g, b) <= THRESHOLD;
};

const visited = new Uint8Array(width * height);
const stack = [];

const pushIfDark = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  if (isDark(p * 4)) {
    visited[p] = 1;
    stack.push(p);
  }
};

// Semear a partir de todas as bordas
for (let x = 0; x < width; x++) {
  pushIfDark(x, 0);
  pushIfDark(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushIfDark(0, y);
  pushIfDark(width - 1, y);
}

while (stack.length) {
  const p = stack.pop();
  data[p * 4 + 3] = 0; // alpha = 0
  const x = p % width;
  const y = (p / width) | 0;
  pushIfDark(x + 1, y);
  pushIfDark(x - 1, y);
  pushIfDark(x, y + 1);
  pushIfDark(x, y - 1);
}

await image.write(outPath);
console.log('OK ->', outPath);
