# Cloudflare Pages デプロイ設定

このプロジェクトは純粋な静的サイトです（HTML/CSS/JavaScript）。

## ビルド設定

Cloudflare Pagesのダッシュボードで以下のように設定してください：

**Framework preset**: なし（None）

**Build command**: 
```
npm run build
```

**Build output directory**: 
```
/
```
（ルートディレクトリ）

または、ビルドコマンドを空にして、出力ディレクトリを `/` に設定することもできます。

## ローカル開発

ブラウザで直接 `index.html` を開いてください：
```
file:///c:/Users/mizob/PORTAL/index.html
```

## デプロイ

1. GitHubにプッシュ
2. Cloudflare Pagesが自動的にデプロイ

ビルドプロセスは不要です。
