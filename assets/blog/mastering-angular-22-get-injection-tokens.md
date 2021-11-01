---
title: "[Angular 大師之路] 各種在程式中取的注入 token 實體的方法"
date: 2018-11-06 21:29:56
category: "Angular 大師之路"
tags:
  - Angular
  - DI
  - Inject
---

前兩天我們學到了多種替換注入 token 內容的方法，今天我們來看看如何取得不同注入內容的方式：

<!-- more -->

**類型**：觀念

**難度**：4 顆星

**實用度**：3 顆星

# 建構式注入

建構式注入是我們最常使用的注入方式，也就是直接在建構式中宣告要注入的 token 實體，Angular 在看到這個 token 時，會根據我們的設定決定要對這個類別注入什麼樣的實體：

```typescript
constructor(private dataService: DataService) { }
```

在建構式中宣告 `private` 是 TypeScript 提供的一種語法糖，以上的寫法相當於：

```typescript
private dataService: DataService;

constructor(dataService: DataService) {
    this.dataService = dataService;
}
```

透過這種方式，可以少寫一些程式碼，會比較簡單。

# 使用 Injector

Angular 提供了一個 Injector ，透過其中的 `get()` 方法，可以幫助我們動態取得某個 token 的實體：

```typescript
import { Injector } from '@angular/core';

constructor(private injector: Injector) {
  const service = this.injector.get(DataService);
  console.log(service.getData());
}
```

在元件越來越複雜，建構式要注入的內容越來越多時，使用 `Injector` ，透過 `Injector` 可以讓建構是看起來清爽一點！

{% note info %}

當然，最理想的情況應該是把原件再拆開成更小的元件，所以這只是提供另外一種思考方向囉。

{% endnote %}

`Injector` 還提供了一個 `create()` 的靜態方法，透過這個方法，我們可以在程式中隨時動態產生一個新的 `Injector` 物件：

```typescript
const injector = Injector.create({
  providers: [
    {
      provide: DataService,
      useClass: AdminService,
      deps: []
    }
  ]
});
const service = injector.get(DataService);
console.log(service.getData());
```

上面程式中，我們使用 `Injector.create()` 方法，來產生一個 `Injector` 物件，建立的參數跟在 `@NgModule` 中設定基本上一樣，但沒有簡易版的寫法，這點需要注意一下。接著我們就能夠這個物件的 `get()` 方法來取得 token 實體囉。

# 在 Component 或 Directive 產生獨立實體

在 `@Component` 和 `@Directive` 中，都有提供 `providers: []` 的設定，在這裡面設定的 token 會被另外產生，而不會吃所屬模組的設定：

```typescript

@Component({
  ...
  providers: [
    {
      provide: DataService,
      useClass: AdminService
    }
  ]
})
export class AppComponent  {
  constructor(private dataService: DataService) {
    console.log(dataService.getData());
  }
}
```

透過這種方式，我們可以確保每次產生元件時都會建立新的實體，而不跟外部產生的實體共享資源！畢竟不是每個元件都需要 singleton 的！

# 相關資源

- [Injector](https://angular.io/api/core/inject)
