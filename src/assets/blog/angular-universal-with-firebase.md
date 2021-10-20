---
title: "在 Firebase 上部署 Angular Universal"
date: 2018-12-15 12:09:59
tags:
  - Angular
  - Angular Universal
  - Server Side Rendering
  - Firebase
  - Firebase Functions
  - Firebase Hosting
---

Angular Universal 可以幫助我們以 server side 的方式把 Angular 畫面先產生好回傳給用戶端，而 Firebase 本身提供了 Firebase Hosting 服務，能讓我們輕易的部署靜態網站，若要部署 Angular Universal 的 express server的話，還可以搭配 Firebase Functions 功能。

透過這樣的整合，我們可以把前端 SPA 架構的 Angular 網站都部署到 Firebase 上面，同時享有 Angular Universal 的 server side rendering (SSR、伺服器渲染) 功能，讓 SEO 排名更好，在做社群分享(如 facebook) 時，也能更正確的抓到資訊！

今天就來分享一下將 Angular 程式部署到 Firebase，並同時支援 Angular Universal 的方法。

<!-- more -->

程式碼下載位置：

https://github.com/wellwind/angular-universal-firebase-demo

# 啟用 Angular Universal

要替 Angular 加入 Universal 功能步驟很多，在官方文件有列出詳細的步驟，包含需要安裝什麼相依套件，以及建立相關檔案等等，建議瀏覽一下知道 Angular Universal 功能的一些相關重點。

## 使用 ng add 安裝

Angular 官方也提供了 `@universal/express-engine` 套件，並支援 `ng add` 指令，因此我們只需要使用以下指令，便可以快速把所有 Angular Universal 相關的程式碼，腳本等通通安裝完成！

```shell
ng new angular-universal-firebase --routing
ng add @nguniversal/express-engine --clientProject  angular-universal-firebase
```

接下來我們可以嘗試在專案中加入一些程式、頁面等等，來測試 Angular Universal 是否能正確渲染畫面！

## 執行設定好的 express server

在使用 `ng add @nguniversal/express-engine` 之後，會幫我們在 package.son 加入以下幾個指令：

```json
{
  "scripts": {
    "compile:server": "webpack --config webpack.server.config.js --progress --colors",
    "serve:ssr": "node dist/server",
    "build:ssr": "npm run build:client-and-server-bundles && npm run compile:server",
    "build:client-and-server-bundles": "ng build --prod && ng run angular-universal-firebase:server:production"
  }
}
```

我們可以使用 `npm run build:ssr` 來打包所有 Angular 程式及 express server 資料，之後再使用 `npm run serve:ssr` 來執行編譯好並包含 Angular Universal 功能的 express server。

之後使用瀏覽器打開 `http://localhost:4000` ，並檢視原始碼，就能夠看到已經由伺服器端先把內容渲染完成後的結果！

{% asset_img 01.jpg %}

就這麼簡單！有了 schematics 後，很多複雜的設定幾乎都變成了一行指令而已！！

# 啟用 Firebase Hosting 及 Functions

接下來我們想要把網站部署到 Firebase Hosting 上，以及搭配 Firebase Functions 功能來運作 SSR！

## 前置準備

首先要先安裝 [firebase-tools](https://firebase.google.com/docs/cli/)，這是由 Firebase 提供的 CLI 工具

```shell
npm install -g firebase-tools
```

之後只需要登入就可以了！

```shell
firebase login
```

## 初始化專案

安裝完 firebase-tools 之後，我們就可以使用這個工具來將調整專案內容和部署到 Firebase 上的環境，進入專案目錄後先使用以下指令，來連結 Firebase Functions

```shell
firebase init functions
```

接下來會看到以下畫面，詢問要連結的 Firebase 專案，如果沒有專案的話，也可以在此時建立一個新的

{% asset_img 02.jpg %}

接著會詢問一些設定，如是否要使用 TypeScript 等等，可依照自己的需求調整！

完成後會建立 `firebase.json` 來存放相關設定，以及 `functions` 目錄，之後就可以改成把 SSR 的 express 程式寫到這裡來了，不過在這之前我們先繼續加入 Firebase Hosting

```shell
firebase init hosting
```

由於 Hosting 本身是提供 Angular 編譯出來的相關檔案，而 Functions 也需要有這些檔案才可以渲染相關程式，所以我們調整一下 firebase hosting 要使用的目錄位置到 `functions/public/browser`(之後會在 `angular.json` 調整專案輸出)，另外當 firebase-tools 詢問是否要將網站視為 Single Page Application 時，選擇 `N`

{% asset_img 03.jpg %}

基本的專案初始化架構就算大功告成啦！此時可以看到 `firebase.json` 檔案內容大致如下：

```json
{
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ],
    "source": "functions"
  },
  "hosting": {
    "public": "functions/public/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

{% note warning %}

如果是 Windows 使用者，請將 `$RESOURCE_DIR` 改為 `%RESOURCE_DIR%`，當需要部署時才不會出錯！

{% endnote %}

接下來我們就要把 Angular Universal 相關的功能搬進 Functions 裡面囉。

# 使用 Firebase Functions 支援 Angular Universal

## 修改 angular.json

由於我們的 Firebase Hosting 設定的 public 目錄改了，因此需要修改 `angular.json` 中專案的 `outputPath` 設定，記得 `build` 和 `server` 設定都需要調整：

```json
{
  ...,
  "architect": {
    ...,
    "build": {
      "options": {
        "outputPath": "functios/public/browser", // 調整輸出目錄
        ...,
      }
    },
    "server": {
      "options": {
        "outputPath": "functions/public/server", // 調整輸出目錄
        ...,
      },
    }
  }
}
```

之後的 `ng build` 指令都會改成輸出到 `functions/public` 下！

## 在 functions 目錄中運行 Angular Universal

有幾個重要注意事項

1. 我們不再需要使用 webpack 打包 server.ts 程式，因此在 functions 目錄中必須把其他 Angular 相關的套件都安裝回去，在伺服器渲染時才能找到對應的程式來產生 HTML
2. 在 Angular 7 相依了 TypeScript 3.1.1 以上的版本，但目前使用 firebase-tools 建立出來的還在 2.x.x，因此需要調整成對應的 TypeScript 版本
3. 由於 Firebase Functions 並不是直接運行 express server，而是將 express 的設定丟給 functions 使用，因此原來的 server.ts 程式碼需要做一些調整。

我們先找出原來 `package.json` 中與 Angular 相關的套件，加入 `functions/package.json` 中，以及加入新版本的 TypeScript，整個檔案修改後看起來大致如下：

```typescript
{
  ...,
  "dependencies": {
    "@angular/animations": "~7.0.0",
    "@angular/common": "~7.0.0",
    "@angular/compiler": "~7.0.0",
    "@angular/core": "~7.0.0",
    "@angular/forms": "~7.0.0",
    "@angular/http": "~7.0.0",
    "@angular/platform-browser": "~7.0.0",
    "@angular/platform-browser-dynamic": "~7.0.0",
    "@angular/platform-server": "~7.0.0",
    "@angular/router": "~7.0.0",
    "@nguniversal/express-engine": "^7.0.2",
    "@nguniversal/module-map-ngfactory-loader": "v7.0.2",
    "express": "^4.15.2",
    "rxjs": "~6.3.3",
    "zone.js": "~0.8.26",
    "firebase-admin": "~6.0.0",
    "firebase-functions": "^2.1.0"
  },
  "devDependencies": {
    "tslint": "~5.8.0",
    "typescript": "~3.1.1"
  }
}
```

{% note info %}

之後若再原來開發的 Angular 程式中有安裝其他套件，記得也要加入 `functions/package.json` 之中

{% endnote %}

接著我們可以把原來 `server.ts` 的程式邏輯都搬移到 `functions/src/index.ts` 中，針對 Firebase Functions 功能做一些調整：

```typescript
import * as functions from 'firebase-functions';

/* 原來所有 server.ts 的程式碼(省略) */

/* 以下兩行需要對應到正確的路徑 */
const DIST_FOLDER = join(process.cwd(), 'public/browser');
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('../public/server/main');

/* 原來所有 server.ts 的其他程式碼(省略) */

/* 原來 server.ts 中是直接啟動 express server，現在不再這麼做了 */
// Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });

/* 改成以下程式 */
export const ssr = functions.https.onRequest(app);
```

由於伺服器端渲染的關係，會使用到很多 DOM 相關程式，因此在 `functions/tsconfig.json` 中，需要加上 DOM 編譯的設定

```json
{
  "compilerOptions": {
    "lib": ["es6", "dom"], // dom 是額外加入的
    "module": "commonjs",
    "noImplicitReturns": true,
    "outDir": "lib",
    "sourceMap": true,
    "target": "es6"
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}

```

接下來 `firebase.json` 中，調整 rewrite 設定，讓所有路由都觸發 functions 中的程式

```json
{
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ],
    "source": "functions"
  },
  "hosting": {
    "public": "functions/public/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    // 加上 rewrites 設定
    "rewrites": [{
      "source": "**",
      "function": "ssr"
    }]
  }
}
```

基本上所有步驟就算大功告成啦！接下來我們就可以打包 Angular 的程式(包含 browser 和 server)到 functions 目錄中，並在 functions 目錄中運行地端測試的 Hosting 和 Functions 功能看看結果囉。

在 Angular 專案目錄下執行指令：

```shell
npm run build:client-and-server-bundles
```

之後進入 `functions` 目錄執行以下指令

```shell
npx tsc
firebase serve --only hosting,functions
```

接著就可以使用瀏覽器進入 `localhost:5000` 並看看 SSR 的結果啦！

這邊要提醒的一點是，Firebase Hosting 的首頁並不會觸發 SSR，而是直接回傳 index.html 的內容，但若直接進入其他頁面(不透過點擊頁面的連結)，是可以看到 SSR 效果的！

如果測試一切沒問題，就可以發佈到 firebase 上看看結果囉：

```shell
firebase deploy --only hosting,functions
```

# 只針對爬蟲進行 SSR

使用 Server Side Rendering 功能雖然可以增加爬蟲抓取 SPA 網站效率，進而得到更好的排名，但針對一般使用者瀏覽來說，未必會有更好的表現，畢竟同一份程式碼會再 server 端和 client 端重複執行，在 server 效能不高的情境下反而等待時間可能會更長，因此我們可以稍微調整一下 express 的程式，來判斷來源是否為爬蟲，若是才使用 Angular Universal 提供的渲染引擎在後端產生 HTML，否則就把 index.html 直接傳給使用者就好。

具體該怎麼做呢？我們可以觀察一下原來的程式碼內有一段：

```typescript
// 使用 Angular Universal 提供的渲染引擎顯示畫面
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

．．．

// 一般的路由使用渲染引擎
app.get('*', (req, res) => {
  res.render('index', { req });
});
```

從這裡面我們可以發現，一般頁面都會透過 Angular Universal 提供的渲染引擎來顯示內容，因此只需要在這裡進行調整，檔檢查來源是爬蟲時，就使用渲染引擎，否則就直接讀取 index.html 的內容給 client：

```typescript
app.get('*', (req, res) => {
  if (isBot(req)) {
    res.render('index', { req });
  } else {
    res.sendFile('index.html', { root: './public/browser' });
  }
});
```

`isBot()` 的程式是參考 Rendertron 的 [Express Middleware](https://github.com/GoogleChrome/rendertron/blob/master/middleware/src/middleware.ts) 修改的簡易版本，[修改後原始碼在這裡](https://github.com/wellwind/angular-universal-firebase-demo/blob/master/functions/src/index.ts#L12-L39)！

如此一來就可以只針對爬蟲做一些處理囉！我們可以使用如 [User-Agent Switcher](https://chrome.google.com/webstore/detail/user-agent-switcher/lkmofgnohbedopheiphabfhfjgkhfcgf) 這類的 Chrome 外掛來模擬爬蟲，來確認顯示的結果！

# 相關資源

- [Angular Universal: server-side rendering](https://angular.io/guide/universal)
- [Deploying Angular Universal v6+ with Firebase](https://hackernoon.com/deploying-angular-universal-v6-with-firebase-c86381ddd445)
- [Angular Universal and Firebase Hosting (Server-side Rendering with JavaScript Frameworks)](https://www.youtube.com/watch?v=gxCu5TEmxXE)
