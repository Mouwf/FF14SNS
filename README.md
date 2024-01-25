# FF14SNS
FF14SNSはネタバレを恐れずにFF14の感想を投稿できるSNSです。

## 環境構築
### 環境変数
.envファイルをルート直下に作成し、以下の環境変数を設定してください。
* FIREBASE_API_KEY
  * FirebaseプロジェクトのAPIキーを設定してください。
* RUN_INFRA_TESTS
  * インフラに依存したテストを実行する場合、trueを設定してください。

## ローカル開発環境
### サーバー証明書
`openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365`を実行し、サーバー証明書を作成してください。

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
