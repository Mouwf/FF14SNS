import fs from 'fs';

// ファイルパスを設定する。
const devEntryPath = "app/entry.server.develop.tsx"
const prodEntryPath = "app/entry.server.product.tsx"
const targetPath = "app/entry.server.tsx"

// 環境に応じてファイルを選択する。
const sourcePath = process.env.NODE_ENV === 'development' ? devEntryPath : prodEntryPath;

// 選択したファイルをentry.server.tsxとしてコピーする。
fs.copyFile(sourcePath, targetPath, (err) => {
  if (err) {
    console.error('ファイルのコピーに失敗しました:', err);
    process.exit(1);
  }
  console.log(`${sourcePath} が ${targetPath} としてコピーされました。`);
});