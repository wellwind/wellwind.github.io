---
title: "[Angular 大師之路] 使用 APP_INITIALIZER 在程式運行早期處理資料"
date: 2018-11-03 22:10:27
category: "Angular 大師之路"
tags:
  - Angular
  - APP_INITIALIZER
---

在開發一個應用程式時，我們常常需要在程式正常運作前，進行一些初始化的動作，在 Angular 中則是提供了一個 `APP_INITIALIZER` 設定，讓我們可以在 Angular 進行初始化動作時預先進行處理，今天我們就來看看這個功能開如何使用吧！

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：3 顆星

# 基本用法

假設有個情境，我們想要在程式執行前先去打 API 取得一些後端的設定、或是允許的權限等等，廢話不說，我們先來看看簡單的半成品：

```typescript
export function initData(httpClient: HttpClient) {
  // 假設有個 API 包含了基本的設定
  return () => httpClient.get('https://jsonplaceholder.typicode.com/todos/').toPromise();
}

@NgModule({
  ...,
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initData,
      deps: [HttpClient],
      multi: true
    }
  ]
})
export class AppModule {}
```

我們先來看看 `@NgModule` 中的 `providers: []` 設定，在這邊我們替 `APP_INITIALIZER` 提供了一個相關設定，怎麼樣的設定呢？這個設定必須是一個會回傳 Promise 的方法，因此我們寫了一個方法，並回傳 Promise，也就是上面程式的前四行

```typescript
export function initData(httpClient: HttpClient) {
  // 假設有個 API 包含了基本的設定
  return () => httpClient.get('https://jsonplaceholder.typicode.com/todos/').toPromise();
}
```

使用 `useFactory` 是因為我們要回傳的是一個實際上要被呼叫的方法，而不是某個 class，因此使用 `useFactory` 來自訂處理方式。

`deps: []` 代表要輸入的相依套件，在這裡我們的程式會去呼叫某個 API，所以相依了 `HttpClient`。

最後的 `multi: true` 代表是可以有多組 `APP_INITIALIZER` 設定的。

{% note info %}

在這幾天我們用到了不少相依注入的觀念，這些設定細節會在後面的文章說明。

{% endnote %}

需要注意的是， `APP_INITIALIZER` 必須使用 Promise，而不是我們在 Angular 中常用的 Observable，因此我們使用了 `toPromise()` 來將一個 Observerable 轉換成 Promise。

以上步驟就算是一個基本的雛形啦！這時候我們在進入根元件(一般來說是 `AppComponent` 之前)，就會先去呼叫我們建立個 `initData` 方法，不過這樣還不夠，因為我們通常是要取得一些設定並在程式中取用的，因此我們可以把讀取資料的程式封裝到一個類別中，並在取得資料時暫存起來，這時候可以搭配 service 使用。

# 搭配 service 儲存資料

接著我們可以建立一個 `ConfigService` ，並在這裡面進行讀取資料的動作：

```typescript
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: any;

  constructor(private httpClient: HttpClient) {}

  initData() {
    return this.httpClient
      .get('https://jsonplaceholder.typicode.com/todos/')
      .pipe(tap(config => (this.config = config)))
      .toPromise();
  }
}
```

基本概念是一樣的，在 service 裡面的 `initData()` 依然是回傳一個 Promise，且在這段程式中把取得的資料存在類別內，接著在原來 ｀providers: []｀ 中的設定會改成：

```typescript
@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => configService.initData(),
      deps: [ConfigService],
      multi: true
    }
  ]
})
export class AppModule {}
```

在這裡的 `useFactory` 我們改成使用注入 `ConfigService` 的方法，並從 `configService.init()` 中取得要抓取 API 資料的 Promise，因此 `deps: []` 就改成設定 `ConfigService` 了！

最後我們可以直接在根元件  `AppComponent` 中直接呼叫 `ConfigService` 的 `config` 屬性，就能拿到設定資料啦！

```typescript
export class AppComponent {

  constructor(private configService: ConfigService) {
    console.log(this.configService.config);
  }
}
```

# 本日小結

今天我們學到的設定 `APP_INITIALIZER` ，透過這種方式我們可以在非常早的時期取得初始化的設定，整體程式會更加簡潔，而且更具有彈性，只需要抽換不同的初始化程式就好，真的是非常的方便啊！

# 相關資源

- [APP_INITIALIZER](https://angular.io/api/core/APP_INITIALIZER)
