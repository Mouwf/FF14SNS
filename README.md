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
`openssl req -nodes -new -x509 -keyout server.key -out server.cert`を実行し、サーバー証明書を作成してください。

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- [Netlify Edge Functions Overview](https://docs.netlify.com/edge-functions/overview/)

## Netlify Setup

1. Install the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

## Development

Ensure all packages are installed by running:

```sh
npm install
```

Run

```sh
npm run dev
```

Open up [http://localhost:8888](http://localhost:8888), and you're ready to go!

### Serve your site locally

To serve your site locally in a production-like environment, run

```sh
npm run start
```

Your site will be available at [http://localhost:8888](http://localhost:8888). Note that it will not auto-reload when you make changes.

## Excluding routes

You can exclude routes for non-Remix code such as custom Netlify Functions or Edge Functions. To do this, add an additional entry in the array like in the example below:

```diff
export const config = {
  cache: "manual",
  path: "/*",
  // Let the CDN handle requests for static assets, i.e. /_assets/*
  //
  // Add other exclusions here, e.g. "/api/*" for custom Netlify functions or
  // custom Netlify Edge Functions
-  excluded_patterns: ["/_assets/*"],
+  excluded_patterns: ["/_assets/*", "/api/*"],
};
```

## Deployment

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
# preview deployment
netlify deploy --build

# production deployment
netlify deploy --build --prod
```
