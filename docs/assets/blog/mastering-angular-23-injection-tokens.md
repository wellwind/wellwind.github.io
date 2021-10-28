---
title: "[Angular 大師之路] 認識 InjectionToken"
date: 2018-11-07 22:24:16
category: "Angular 大師之路"
tags:
  - Angular
  - InjectionToken
---

在 Angular 中不是只有 service 可以當 token 被注入，我們也可以單純的注入某個物件，這個物件通常是一個全域的系統設定，或是單純的一個函數(function)，這時候就會遇到一些問題，我們今天就來看看問題是什麼，以及如何解決！

<!-- more -->

**類型**：觀念

**難度**：4 顆星

**實用度**：5 顆星

# 一般情境

可以用我們之前學過的 `useValue`，類似以下程式：

```typescript
export class Config {
  LogLevel: string
}

@NgModule({
  providers: [
    {
      provide: Config,
      useValue: { LogLevel: 'Error' }
    }
  ]
})
export class AppModule { }
```

這完全不是問題，但如果不想宣告成 `class` (畢竟會產生實際程式碼) 或是設定的不是物件，而是數值或字串呢？就會出問題了：

```typescript
export interface Config {
  LogLevel: string
}

@NgModule({
  providers: [
    {
      // 錯誤，因為 interface 不會產生實體
      provide: Config,
      useValue: { LogLevel: 'Error' }
    }
  ]
})
export class AppModule { }
```

這時候可以使用 Angular 提供的 `InjectionToken` 來強制幫我們產生一個 token

# 使用 InjectionToken

```typescript
import { InjectionToken } from '@angular/core';

export interface Config {
  LogLevel: string
}

// 替 interface 產生一個 token
// 參數的字串只是一個描述
export const CONFIG_TOKEN = new InjectionToken<Config>('config token');
// 基礎型別也不是問題
export const NAME_TOKEN = new InjectionToken<string>('name token');

@NgModule({
  providers: [
    {
      provide: CONFIG_TOKEN,
      useValue: { LogLevel: 'Error' }
    },
    {
      provide: NAME_TOKEN,
      useValue: 'Mike'
    }
  ]
})
export class AppModule { }
```

至於要如何取得 token 實體呢？可以使用 `@Inject()` 裝飾器，來告知要使用哪個 token 注入：

```typescript
constructor(@Inject(CONFIG_TOKEN) private config: Config) {
  console.log(config);
}
```

# Tree-shakable InjectionToken

`InjectionToken` 是非常特別的存在，通常都是提供給使用某個套件的人一些從外部設定的資訊，因此很多時候我們並不一定會去設定這個 token，但偏偏 `InjectionToken` 會真的產生實體，導致在進行 tree shaking 時無法過濾掉，跟傳統建立 service 的問題很類似，因此在 Angular 6 之後，也透過 `providedIn: 'root'` 的方法，來進行過濾：

```typescript
const CONFIG_TOKEN = new InjectionToken<Config>('config token',
  {
    providedIn: 'root',
    factory: () => ({
      LogLevel: 'Error'
    })
  }
);
```

透過這種方式，當程式中有使用到 `CONFIG_TOKEN` 時，就會使用 `factory: () => {}` 產生的內容；若需要調整 token 的實體，在 `@NgModule` 的 `providers: []` 設定即可；而當完全沒有使用 `CONFIG_TOKEN` 時，這個被產生的內容也可以被過濾掉啦！

# 相關資源

- [InjectinToken](https://angular.io/api/core/InjectionToken)
- [Inject](https://angular.io/api/core/inject)
