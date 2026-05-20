const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'public');
const targetDir = path.join(__dirname, '..');

function copyEntry(entry, fromDir, toDir) {
  const fromPath = path.join(fromDir, entry.name);
  const toPath = path.join(toDir, entry.name);

  if (entry.isDirectory()) {
    fs.mkdirSync(toPath, { recursive: true });
    for (const child of fs.readdirSync(fromPath, { withFileTypes: true })) {
      copyEntry(child, fromPath, toPath);
    }
    return;
  }

  fs.copyFileSync(fromPath, toPath);
}

if (!fs.existsSync(sourceDir)) {
  console.warn('[vercel] public/ não encontrado; pulando cópia do frontend');
  process.exit(0);
}

for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  copyEntry(entry, sourceDir, targetDir);
}

console.log('[vercel] Frontend copiado de public/ para a raiz do deploy');
