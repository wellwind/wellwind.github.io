---
title: "[RxJS] 開始前的環境準備"
date: 2020-09-17 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - CDN
  - Parcel
  - StackBlitz
---

要開始練習 RxJS，當然要先準備好一個可以開始使用 RxJS 的環境，本篇文章會以完全沒接觸過 RxJS 為假設，介紹幾種起始的環境準備方式，當然對於已經有撰寫 RxJS 經驗的朋友來說，可以依照自己原來的使用習慣，這篇文章參考參考就好，不一定要跟我用一樣的環境囉。

<!-- more -->

# 方法 1：從 CDN 載入或下載 library 後載入

這種方法是最傳統的網頁設計方式，也就是直接將 RxJS 的相關 JavaScript 檔案全部載入到網頁中，在直接開始撰寫，雖然以現代化的前端設計概念來說相對不會這麼建議這樣使用，但依然不失為一種簡單好理解的方式。

## 從 CDN 下載或直接載入 RxJS

以下是 RxJS 的最新版 CDN 位置，使用 [unpkg](https://unpkg.com/) 服務，這邊使用 RxJS 6.0.0 作為範例：

```
https://unpkg.com/@reactivex/rxjs@6.0.0/dist/global/rxjs.umd.js
```

在 HTML 中進行套件載入後我們可以就使用 `rxjs` 這個物件，來進行各種操作，以下範例會偵測畫面的滑鼠點擊事件，並且只有在奇數次點擊的時候，印出滑鼠點擊在畫面上的座標，以下是整個範例程式：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>RxJS Practice</title>
  </head>
  <body>
    <script src="https://unpkg.com/@reactivex/rxjs@6.0.0/dist/global/rxjs.umd.js"></script>
    <script>
      rxjs
        .fromEvent(document, 'click')
        .pipe(
          rxjs.operators.filter((_, index) => index % 2 === 0),
          rxjs.operators.map((event) => ({ x: event.x, y: event.y }))
        )
        .subscribe((position) => {
          console.log(`x: ${position.x}, y: ${position.y}`);
        });
    </script>
  </body>
</html>
```

上面程式中的 `fromEvent` 是 `rxjs` 物件的一個方法，另外下面還有 `operators.filter` 和 `operators.map` 等，我們會把它們都稱為是操作符 (operators)，之後用 `subscribe` 來得到每次事件搭配 operators 處理後的結果。

上面程式目前看不懂也沒有關係，之後我們會再介紹 RxJS 的組成要素及各種 operators 的使用方式。

完成後使用瀏覽器打開這個網頁，在開啟 F12 切到 console 頁籤，點擊看看滑鼠有沒有如下圖的反應：

{% asset_img 01.gif %}

在奇數次的滑鼠點擊時，若有顯示出滑鼠的座標，就算完成囉！

# 方法 2：使用 Parcel

直接使用 CDN 載入的方式雖然非常簡單，但也有不少缺點，像是一次要載入所有 RxJS 的程式碼所以載入速度比較慢，每次使用都要加上 `rxjs.` 開頭有點麻煩；純 JavaScript 也不太方便，如果可以用 TypeScript 寫起來會更輕鬆。

比較現代化的做法會使用 ES 6 的 import / export 語法，只載入需要的部分，語法上會更精簡，之後再搭配 webpack 或 babel 等工具，把不需要的程式碼都移除(我們稱為 tree shaking)，加快載入速度，有使用 TypeScript 的話，也能自動幫我們轉換成 JavaScript。

若沒有很複雜的需求，推薦可以使用 [Parcel](https://parceljs.org/) 這個工具，可以幾乎不用做任何設置就完成上述的需求！以下是使用 Parcel 建立 RxJS 練習環境的步驟：

## 安裝 node.js 與 npm

直接到 [node.js 官網下載](https://nodejs.org/en/)，這部分對大多的前端工程師應該已經是基本功了，網路上也有很多文章可以參考，就不多說明了。

## 初始化專案並安裝 Parcel 與 RxJS

第一步先安裝 Parcel 的 CLI 工具：

```shell
npm install -g parcel-bundler
```

接著先開啟指令視窗後切換到要練習的目錄，輸入以下指令，初始化專案及安裝所需套件 (也就是 RxJS)：

```shell
npm init
npm install --save rxjs
```

## 建立 TypeScript 檔案並撰寫程式

接著我們建立一個 `index.ts` 檔案，並加入以下程式碼：

```typescript
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(
    filter((_, index) => index % 2 === 0),
    map((event: MouseEvent) => ({ x: event.x, y: event.y }))
  )
  .subscribe((position) => {
    console.log(`x: ${position.x}, y: ${position.y}`);
  });
```

這邊的程式碼用 CDN 載入的程式碼邏輯完全一樣，但使用了 import 語法來載入 `rxjs` 套件下的相關程式，整個語法看起來是不是簡潔許多啊！

## 載入寫好的程式

接著我們建立 `index.html` 檔案並加入以下程式碼：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>RxJS Practice</title>
  </head>
  <body>
    <script src="./index.ts"></script>
  </body>
</html>
```

這邊唯一特別的是載入的是 TypeScript 的程式碼，但在使用 Parcel 轉譯後，會自動把 TypeScript 的程式碼專換成  JavaScript 並進行載入。

## 轉譯 index.html 並查看結果

使用 Parcel CLI，可以輕鬆地將一個 HTML 與他相依的 TypeScript / JavaScript 進行轉換，並提供一個測試的伺服器，方便我們查看結果：

```shell
parcel index.html
```

之後打開 parcel 建立的網頁伺服器，預設是 `http://localhost:1234`，就可以看到一樣的結果啦！

{% note info %}

使用 Parcel 基本上算是蠻無腦設置的了，更多的資訊可以上 [Parcel 文件](https://parceljs.org/getting_started.html)看看。

{% endnote %}

# 使用線上編輯器 - StackBlitz

[StackBlitz](https://stackblitz.com/) 是一款線上的程式碼編輯器，內建多種框架專案，可以快速的透過網頁進行程式開發並看到結果，省去許多設定的麻煩，雖然不是用於生產環境，但程式寫好後，也能快速把線上編輯的程式碼專案下載下來，非常的方便！

進入 [StackBlitz](https://stackblitz.com/) 網站後，可以看到下方列出目前內建的專案架構，我們可以直接點選 RxJS，建立一個 RxJS 專案。

或是直接使用以下連結，也可以直接建立一個新的 RxJS 專案：

```
https://stackblitz.com/fork/rxjs?devtoolsheight=60
```

{% note info %}

也建議使用 GitHub 帳號來登入 StackBlitz，之後所有登入後建立的專案都會與帳號連動，比較可以找得到之前練習的成果！

{% endnote %}

建立完成後，打開左邊的 `index.ts` (預設應該也是直接打開的)，填入之前就寫過的 TypeScript 程式碼，就可以直接到右邊預覽視窗看結果囉！

{% asset_img 02.jpg %}

使用 StackBlitz 最方便的地方就是可以隨時將程式碼分享出去，而且可以立刻在線上看到結果，不用做任何特別的設定，之後我們的練習如果有比較複雜的程式，也會透過 StackBlitz 來做分享！

今天練習的程式碼：https://stackblitz.com/edit/mastering-rxjs-practice-day02-getting-started

# 本日小結

這篇文章主要目的是做一些練習前的環境準備，當然各位已經有在使用 RxJS 的朋友們也可以依照自己的習慣來建立，程式碼是一樣的。今天算是站在 RxJS 大門口了，明天我們會正式進入 RxJS 的大門，介紹一下 RxJS 的基本組成架構！
