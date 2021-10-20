---
title: "[Angular PWA] 改變 Servie Worker 註冊時機"
date: 2019-07-28 11:50:01
tags:
  - Angular PWA
  - Service Worker
  - SwRegistrationOptions
  - registrationStrategy
---

Angular PWA 套件幫助我們以非常簡易的方式，將 Service Worker 註冊到我們的應用程式中，然而一些特定的下，我們會需要做一些細節的調整，尤其是 Service Worker 的註冊時機點，今天就來看看使用 Angular PWA 該如何改變 Service Worker 註冊到應用程式的時間！

<!-- more -->

# 先來加入 Angular PWA

在專案中加入 Angular PWA 一點都不困難，文件也說明得非常清楚，一行 `ng add` 搞定

```shell
ng add @angular/pwa --project *project-name*
```

接下來參考文件使用 production build，並透過 http-server 套件執行程式

`ng build --prod && http-server -p 8080 -c-1 dist/<project-name>`

可以看到 `ngsw-worker.js` 正確被載入，基本上就可以算是註冊成功啦！

{% asset_img 01.jpg %}

# 認識 SwRegistrationOptions

接著我們來看看加入 Angular PWA 套件後，是如何註冊 Service Worker 的。

在 `app.module.ts` 中，可以看到在 imports: [] 中多了一段程式碼

```typescript
ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
```

這個 `register()` 方法中，第一個參數是要註冊的 Service Worker 檔案。第二個參數是註冊 Service Worker 的相關設定，型別為 [SwRegistrationOptions](https://angular.io/api/service-worker/SwRegistrationOptions)，有以下幾個設定可用：

- `enabled`：是否要註冊 Service Worker，已預設的例子來看，就是設定 production build 時才需要註冊
- `scope`：代表 Service Worker 可以控制內容的目錄
- `registrationStrategy`：註冊 Service Worker 的策略，也是今天的重點

# 認識 registrationStragegy

`registrationStrategy` 參數宣告的型別是 `string | (() => Observable<unknown>)`，包含以下選項可以定義

- `registerWhenStable`：**預設值**，當應用程式穩定時註冊 Service Worker
- `registerImmediately`：立即註冊 Service Worker
- `registerWithDelay:<timeout>`：延遲 `<timeoute>` 時間後，註冊 Service Worker
- 一個回傳 observable 的方法：Service Worker 會在指定的 Observer 有新的事件時註冊 Service Worker

一般來說，使用 `registerWhenStable` 就足夠了，畢竟等到應用程式呈現穩定狀態後，才註冊是一個挺理想的狀況。不過，有些時候還是有例外。

## 當應用程式不會呈現穩定時

什麼時候應用程式一定不會呈現穩定呢，舉個例子來說，當我們想在畫面上顯示系統時間時，可能會設定一個一秒跑一次，且不會被終止的 observable，並在程式一開始就啟動他，由於他沒有被終止的條件，因此程式就會一直呈現不穩定的狀態。如下：

```typescript
export class AppComponent implements OnInit {
  constructor(application: ApplicationRef) {
    application.isStable.subscribe(console.log);
  }

  ngOnInit() {
    interval(1000)
      .pipe(
        map(_ => new Date()))
      .subscribe(time => {
        console.log(time);
      });
  }
}
```

在建構式中，我們使用 `applicationRef` 來判斷是否穩定，但由於在 `ngOnInit()` 中我們設定了一段不會進入穩定狀態的程式碼，因此 stable 狀態永遠都會是 `false`。也因此 Service Worker **永遠都不會被註冊**。

這種時候就很適合使用 `registerImmediately` 策略，來繞開應用程式需要穩定的問題。

## 自行決定註冊時機

除了使用 `registerImmediately` 以外，我們也可以透過**傳入一個回傳 observable 的方法**來自行決定要註冊的時機，當這個 observable 有事件發生時，就會註冊 Service Worker，以下例子會提示使用者是否要安裝 Service Worker，當使用者同意，才進行 Service Worker 註冊的動作：

```typescript
export function confirmInstall() {
  return from(navigator.serviceWorker.getRegistrations()).pipe(
    map(registrations => !!registrations.find(reg => reg.active.scriptURL.endsWith('ngsw-worker.js'))),
    filter(installed => !installed),
    switchMap(_ => of(confirm('是否要安裝本程式，享受離線使用的快感？'))),
    filter(x => !!x)
  );
}

@NgModule({
  imports: [
    ...,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: confirmInstall
    })
  ],
})
export class AppModule {}
```

# 參考資源

- [SwRegistrationOptions](https://angular.io/api/service-worker/SwRegistrationOptions)
- [ApplicationRef](https://angular.io/api/core/ApplicationRef)
