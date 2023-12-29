import fs from 'fs';

// ファイルパスを設定する。
const devServerPath = "server.develop.ts"
const prodServerPath = "server.product.ts"
const targetServerPath = "server.ts"
const devEntryPath = "app/entry.server.develop.tsx"
const prodEntryPath = "app/entry.server.product.tsx"
const targetEntryPath = "app/entry.server.tsx"

// 環境に応じてファイルを選択する。
const serverSourcePath = process.env.NODE_ENV === 'development' ? devServerPath : prodServerPath;
const entrySourcePath = process.env.NODE_ENV === 'development' ? devEntryPath : prodEntryPath;

// 選択したファイルをコピーする。
fs.copyFile(serverSourcePath, targetServerPath, (err) => {
  if (err) {
    console.error('ファイルのコピーに失敗しました:', err);
    process.exit(1);
  }
  console.log(`${serverSourcePath} が ${targetServerPath} としてコピーされました。`);
});
fs.copyFile(entrySourcePath, targetEntryPath, (err) => {
  if (err) {
    console.error('ファイルのコピーに失敗しました:', err);
    process.exit(1);
  }
  console.log(`${entrySourcePath} が ${targetEntryPath} としてコピーされました。`);
});