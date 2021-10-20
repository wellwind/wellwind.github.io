---
title: "[Angular 大師之路] Angular 應用程式啟動過程"
date: 2018-10-18 11:26:20
tags:
  - Angular
---

任何程式要能夠運作，都應該有它的進入點，以及整個程式啟動的流程，今天我們就來看看，到底一個 Angular 應用程式是如何開始啟動的吧！

<!-- more -->

**類型**：觀念

**難度**：3 顆星

**實用度**：3 顆星

以下程式以 Angular CLI 建立出來的程式作為範例

# main.ts

`main.ts` 是所有程式的進入口，快速地看一下 `main.ts` 裡面的內容：

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

```

扣除前面 import 相關程式的動作，最開頭的兩行是用來判斷是不是要在 production mode (在 `environment.prod.ts` 中可以設定)下，如果是的話，會呼叫 `enableProdMode()` 方法，來確保整個 Angular 的運作是在 production mode 下，在此模式下將會無法使用斷言(assertions)相關的API，同時也會減少不必要的變更偵測，以增進運作效能。

而接下來的 `platformBrowserDynamic()` 這段程式來自於 `@angular/platform-browser-dynamic`，我們可以簡單的想像成是「建立要準備執行 Angular 應用程式的平台」，而這個平台，代表的則是瀏覽器(browser)；這個方法呼叫後會取得一個 [PlatformRef](https://angular.io/api/core/PlatformRef) 物件，接著便能呼叫其中的 `bootstrapModule()` 來指定要啟動的第一個模組，這個模組通常也被稱為「根模組(Root Module)」。在這個例子中，就是 `AppModule`。

# app.module.ts

在 `app.module.ts` 中宣告了一個 `AppModule` 類別，並替這個類別掛上 `@NgModule`，我們關注的是裡面的 `bootstrap: []` 設定，代表要實際啟動的元件，我們可以看到在裡面有一個 `AppComponent`，這個元件則被稱為「根元件(Root Component)」，在一個 Angular 應用程式中，所有的畫面都是從 `AppComponent` 開始的，也就是這個原因。

# app.component.ts

在 `app.component.ts` 中，可以看到一個 `AppComponent` 類別，就是我們實際上整個程式的進入口，而在 `@Component` 標籤的 `selector` ，代表的就是在 `index.html` 中，找到對應的標籤(例如 `<app-root></app-root>`)，並將元件的對應 HTML 樣板取代過去！

透過這三個關鍵的檔案，我們的 Angular 應用程式就算是完整執行起來啦！

# 同時啟動多個根模組

在 `main.ts` 中，我們在程式中使用 `platformBrowserDynamic().bootstrapModule(AppModule)` 載入了第一個跟模組，這代表著我們也能夠載入另外一個根模組，假設有另一個 App2Module 如下：

```typescript
@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [App2Component],
  bootstrap: [App2Component]
})
export class App2Module { }
```

這時候在 `main.ts` 中就可以多使用一次 `platformBrowserDynamic().bootstrapModule()` 來啟動另外一個模組：

```typescript
platformBrowserDynamic().bootstrapModule(AppModule)

// 啟動第二個根模組
platformBrowserDynamic().bootstrapModule(App2Module);
```

之後只要在 `index.html` 中有放入 `App2Component` 指定的 selector，就能夠正確顯示出來囉。

# 同時啟動多個根元件

除了建立多個根模組以外，由於 `@NgModule` 中的 `bootstrap: []` 設定是陣列的關係，因此要同時以多個元件作為根元件也完全不是問題，如下：

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AnotherComponent } from './another/another.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent, AnotherComponent],
  // 設定多個根元件
  bootstrap: [AppComponent, AnotherComponent]
})
export class AppModule { }

```

一樣只需要在 `index.html` 中加入 `AnotherComponent` 指定的 selector 就能夠正確顯示啦！

# 多個根模組或根元件的使用情境

雖然這樣設計感覺很有趣，但通常我們也很少使用這種設計方式，那麼多個根模組或根元件同時使用到底有什麼好處呢？比較明顯的優點是當 `index.html` 中本來就有預期放入一個固定的 layout ，且畫面上會有兩個互不相關的程式時，就可以使用多個根模組或根元件來處理，而不是將整個 layout 放到單一個模組內，能夠更快地顯示出基本的畫面架構，再慢慢等待 JavaScript 檔載入就好，能讓使用者更快感覺到畫面有所呈現。

當然壞處明顯的就是模組跟模組之間、元件跟元件之間是較難互相溝通的，所以在設計的時候就要仔細考量囉！

# 本日小結

今天我們理解到一個 Angular 應用程式真正啟動的順序，雖然不難，但很少人特別著墨這個部分，因此特別提出來討論一下，在一些特定的情境，理解正確的啟動順序及環節還是很實用的！

今天的程式碼在這裡可以參考：

https://stackblitz.com/edit/ironman-2019-application-startup

# 相關資源

- [Angular - Bootstraping](https://angular.io/guide/bootstrapping)
