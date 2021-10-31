---
title: "[Angular Universal] 使用 TransferState 解決畫面閃爍問題"
date: 2021-10-31 15:00:00
category:
  - "Angular進階議題"
tags:
  - Angular
  - Angular Universal
  - Server Side Rendering
  - TransferState
  - ServerTransferStateModule
  - BrowserTransferStateModule
  - TransferHttpCacheModule
---

透過 Angular Universal 可以輕易達成 SSR 伺服器端渲染的效果，不過對於伺服器端產生的內容，到了 client 依然會重新進行產生，對於比較複雜的非同步處理如 HTTP 呼叫，就會發生重複呼叫，甚至照成畫面閃爍的問題。

針對這個問題，Angular 提出了 Transfer State (狀態轉移) 的做法，將 server 抓取資料的狀態移轉到 client，讓 client 可以直接使用這些狀態資料，而不是重新產生，以避免畫面閃爍等問題。

今天就來看看 Transfer State 的使用方式吧！

<!-- more -->

* 範例程式：https://github.com/wellwind/ngx-universal-prerender-demo
* Live Demo：https://fullstackladder.dev/ngx-universal-prerender-demo/
    * 可以檢視任一個頁面的原始碼，所有內容都是預先產生好的！
    * 可以確認是否有抓取不必要的 API 資料

# 問題描述

以下是一個已經套用 SSR 的範例，在元件中我們設定呼叫 API 抓取遠端資料：

```typescript
export class HomeComponent implements OnInit {

  todos$ = this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/todos');

  constructor(private httpClient: HttpClient) {
  }
}
```

並且在畫面上顯示資料：

```html
<ul>
  <li *ngFor="let item of todos$ | async">{{ item.title }}</li>
</ul>
```

就是個簡單的範例，執行結果如下圖：

{% asset_img 01.gif %}

可以看到畫面有從伺服器端產生，然後又閃爍了一下，才正確顯示出內容。

從 Performance 工具中可以明顯看到，剛開始是有畫面的 (從伺服器端產生)，但要實際從 API 下載時，會消失一陣子，等到 API 下載完成，畫面上才有資料。

{% asset_img 02.png %}

為什麼會有這個狀況發生呢？其實問題非常明顯，就是在伺服器端渲染時，抓取了一次 API 資料，因此 client 可以立即產生畫面，而到了 client 端後依然是 Angular 接手執行，於是同樣的程式碼在瀏覽器端又跑了一次，畫面為了重新渲染，於是產生了閃爍的狀況。

如果開啟 Network 工具，可以看到前端也呼叫了一次 API

{% asset_img 05.png %}

一方面是 API 重複呼叫浪費了，另一方面則是 UX 上體驗不好。

{% asset_img 03.png %}

# 解決方法：Transfer State

Angular 提出了 Transfer State 的概念來解決這個問題，也就是在伺服器渲染時，先將這個「狀態」快取儲存起來，並同時把這些狀態資料發送給瀏覽器，而瀏覽器端 Angular 程式執行時，則可以判斷這個「狀態」是否存在，如果存在則直接從快取拿資料，以解決重複抓取資料和畫面閃爍的問題！

{% asset_img 04.png %}

## ServerTransferModule

首先，我們要讓負責進行伺服器端渲染的 module 支援傳遞狀態，這個步驟很簡單，只要在 `app.server.module.ts` (預設是用這個 module 處理伺服器端渲染) 加入 `ServerTransferModule` 即可。

```typescript
import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerTransferStateModule, // <- 讓 server 可以傳遞狀態
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

接下來，我們在產生或從 API 抓資料時，就需要判斷這個資料是否需要當成一個快取狀態傳遞給瀏覽器。

## 簡易版：TransferHttpCacheModule

Angular Universal 提供了一個快速簡易的做法 - `TransferHttpCacheModule`，可以符合多數的情境，在這個 module 內提供了一個 http interceptor；當 server 端進行 HTTP GET 呼叫時，將網址資料以 key-value 的格式 cache 起來，並傳遞狀態給 client 端；而在 client ， 一樣攔截 HTTP GET 呼叫，並根據網址判斷是否有 cache 的資料，如果有，就直接使用，而不再去抓 API。

使用方式非常簡單，直接在 `app.module.ts` 內加入 `TransferHttpCacheModule` 即可：

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

@NgModule({
  declarations: [...],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule, // <-- 加入 TransferHttpCacheModule
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

再次使用 `npm run dev:ssr` 測試結果，可以發現畫面閃爍問題就消失了，並且也不會再前端重複抓取 API 資料。

## 自定版：透過 TransferState 自定狀態

`TransferHttpCacheModule` 是 `@angular/universal` 下的一個工具，其底層實際上是透過 `@angular/platform-browser` 的 `BrowserTransferStateModule` 所提供的 `TransferState` 服務，因此我們也能使用 `TransferState` 來自定要快取的狀態。

由於 `TransferHttpCacheModule` 只會儲存使用 `HttpClient` 的 `GET` 請求資料 (其實也會儲存 `HEAD`)，因此如果不是使用 `HttpClient` 或是以 `POST` 等方式請求 API 資料，或者其他非 HTTP 請求的狀態需要儲存狀態時，就需要透過 `TransferState` 自行設定。

或是以之前文章提到的 [Prerender 情境](https://fullstackladder.dev/blog/2021/10/16/static-site-generator-using-angular-universal-prerender)，需要存取到專案下的 json 檔時，需要在 local 開一個伺服器來提供檔案，此時伺服器渲染時快取的網址是 local 的網址，上線後當然會找不到這個網址而導致重抓一次內容，就需要自定快取狀態的 key。

要使用 `TransferState` 需要先 import `BrowserTransferStateModule`

```typescript
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

@NgModule({
  declarations: [...],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule, // <-- 加入 BrowserTransferStateModule
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

{% note info %}

如果以經加入過 `TransferHttpCacheModule`，則不需要加入 `BrowserTransferStateModule`

{% endnote %}

接著注入 `TransferState` 即可開始使用

```typescript
constructor(private transferState: TransferState) { }
```

`TransferState` 提供了 `set` 和 `get` 兩個方法，來分別「設定」和「取得」傳遞的狀態，由於資料是 key-value 格式的，因此需要另外設定 key，這個 key 必須是 `StateKey` 型別，也要確保不會重複；要建立 `StateKey`，可以使用 `makeStateKey` 方法。

```typescript
import { makeStateKey, TransferState } from '@angular/platform-browser';

const key = makeStateKey('todos_cache_key');
```

設定狀態的範例：

```typescript
const cacheResult = this.state.get<any[]>(key, []);
```

取得狀態的範例：

```typescript
const apiResult = ...;
this.state.set<any[]>(key, apiResult);
```

以下是一個比較完整的範例，發送請求前，先檢查是否有快取狀態，如果有就直接使用，如果沒有就發送請求等待資料回復，回覆後檢查是否目前是在 server 端產生，如果是則把狀態儲存下來傳遞給 client 端：

```typescript
// 建立 cache server 狀態的 key
const key = makeStateKey('assets/blog/posts.json');

const cacheResult = this.state.get<PostMeta[]>(key, []);
if (cacheResult.length > 0) {
  // 如果有 cache 資料，則直接回傳 cache 到的資料
  return of(cacheResult);
} else {
  // 如果沒有 cache 資料，就從 API 抓取
  return this.httpClient.get<PostMeta[]>(`${environment.assetsUrl}assets/blog/posts.json`)
    .pipe(
      catchError(() => of([])),
      tap(result => {
        // 如果是在 server 端產生，則設定資料可以傳遞給 client 端 cache
        if (isPlatformServer(this.platformId)) {
          this.state.set<any[]>(key, result)
        }
      })
    );
}
```

## 補充：狀態如何傳遞？

在 server 端設定完狀態，要傳給 client 端時，實際上是在頁面的最下方加入一塊 `<script id="serverApp-state" type="application/json">` 標籤，並把快取內容放在裡面，因此加上渲染出來的畫面結果，某種程度上這份資料還是被傳遞了兩次，只是 API 當然不會呼叫兩次，不過文件內容就會變得比較大一點。但至少解決了畫面閃爍的 UX 問題，加上 HTTP 伺服器通常傳送前會壓縮內容，這種重複性的文字壓縮效率通常還不錯，所以也不用太擔心內容變太大的問題。

# 本日小結

畫面閃爍是 Angular Universal 常見的一個問題，而 Angular 提供了狀態傳遞 (Transfer State) 的方式解決了這個問題，讓我們能快速顯示可以用的畫面，也不用擔心 UX 體驗問題。在使用 Angular 且需要 server side rendering 的情境下，已經沒有什麼理由不去使用 Angular Universal 了！！

# 相關資源

- [TransferHttpCacheModule](https://github.com/angular/universal/blob/master/docs/transfer-http.md)
- [Optimizing Observables in Angular Universal (+flickering fix) by Caching with BrowserTransferStateModule](https://azizwrites.xyz/post/optimizing-observables-in-angular-universal-fixing-content-flickering-by-caching-with-browsertransferstatemodule-5796)

