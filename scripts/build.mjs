import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'model.js']) await copyFile(file, `dist/${file}`);
await cp('public', 'dist', { recursive: true });
console.log('Built static site → dist/');
