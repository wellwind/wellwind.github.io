---
title: "[Angular 大師之路] 自己的樣板語法自己做 (Structural Directives)"
date: 2018-10-31 21:56:46
category: "Angular 大師之路"
tags:
  - Angular
  - Structural Directives
  - Attribute Directives
  - EmbeddedViewRef
  - directive
---

前幾天我們花了不少時間在介紹 `*ngComponentOutlet` 以及 `*ngTemplateOutlet` ，這種會**改變 DOM 結構的語法**，像是 `*ngIf` 或 `*ngFor` 等等，在 Angular 裡都稱為 **Structural Directive**，這種用法看起來跟我們自己設計 directive (像是 `ngClass` 或 `ngStyle` 等，又稱為 Attribute Directive) 很像，但多了個星號開頭，不過它其實只是個語法糖，原理是差不多的。如果我們想要設計這種符合語法糖的程式，該怎麼做呢？

<!-- more -->

**類型**：技巧/觀念

**難度**：5 顆星

**實用度**：4 顆星

# 單純使用 Attribute Directive

我們來試著建立一個類似 `*ngTemplateOutlet` 的程式，首先先建立一個 `TemplateOutletDirective` ，程式如下：

```typescript
import { Directive, ViewContainerRef, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplateOutlet]'
})
export class TemplateOutletDirective {
  @Input() set appTemplateOutlet(template: TemplateRef<string>) {
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(template);
  };

  constructor(private viewContainerRef: ViewContainerRef) { }
}
```

有過之前 `ViewContainerRef` 的經驗後，這段程式不難看出我們的目標是在 `appTemplateOutlet` 變更時，將目前所在的宿主元素內容換掉，因此在樣板上使用就如同一般使用 Attribute Directive 一樣簡單：

```html
<ng-container [appTemplateOutlet]="myTemplate"></ng-container>

<ng-template #myTemplate>
  Hello World!
</ng-template>
```

如果今天把狀況變複雜一點，我們允許傳入一些參數時呢？原來的 directive 變成：

```typescript
import { Directive, EmbeddedViewRef, ViewContainerRef, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplateOutlet]'
})
export class TemplateOutletDirective {
  private _viewRef: EmbeddedViewRef<any>;
  @Input() appTemplateOutletData;

  @Input() set appTemplateOutlet(template: TemplateRef<any>) {
    this.viewContainerRef.clear();
    this._viewRef = this.viewContainerRef.createEmbeddedView(template);
    this._viewRef.context['data'] = this.appTemplateOutletData;
  };

  constructor(private viewContainerRef: ViewContainerRef) { }
}
```

上述程式額外建立了一個 `appTemplateOutletData` 屬性，在 `appTemplateOutlet` 屬性變更時，將這個資料塞入產生出來的畫面參考，也就是 `_viewRef` 變數中的 `context`。這個 `context` 就能夠在樣板中使用 `let-{name}="{context_prop}"` 的方式，來取得某個資料，所以在使用時變成如下：

```html
<ng-container [appTemplateOutlet]="myTemplate" [appTemplateOutletData]="{value: 123}"></ng-container>

<ng-template #myTemplate let-input="data">
  Hello World! {{ input | json}}
</ng-template>
```

看起來是不是就像 `*ngTemplateOutlet` 的功能啦！但是目前還是單純的 Attribute Directive，且當屬性越來越多時，我們就必須逐一去設定這些屬性資料，會顯得稍微麻煩(或是變得很麻煩)；但只要符合特定條件，我們就能使用**語法糖**來呈現！

# 使用 * 語法糖

在剛剛建立的 directive 程式中，其實已經符合使用語法糖的條件了，簡單來說，當我們產生一個 selector 為 `appTemplateOutlet` ，且包含一個同名的 `@Input()` 時，就可以使用 `*appTemplateOutlet` 這樣的語法啦！

所以在沒有加入 `appTemplateOutletData` 的前提，我們可以這樣使用

```html
<ng-container *appTemplateOutlet="myTemplate"></ng-container>
```

很簡單吧！不過這樣看起來只是從中括弧(`[]`)改成星號(`*`)，少打一個字而已，沒什麼好驕傲的；接下來厲害的地方是：當我們有個 `@Input` 是以 selector 開頭，後面再給個名稱時，(如 `appTemplateOuteletData` 是 `appTemplateOutlet` 這個 selector 後面加上 `Data`)，可以直接在與法中使用，如下：

```html
<ng-container *appTemplateOutlet="myTemplate; data: {value: 123}"></ng-container>

<!-- 原來的用法 -->
<ng-container [appTemplateOutlet]="myTemplate" [appTemplateOutletData]="{value: 123}"></ng-container>
```

這裡在 `myTemplate` 後面的 `data: {...}` 就是代表設定 `appTemplateOutletData`，是不是一口氣就少打很多字啦！

# 本日小結

今天我們自己設計了一個 Structural Directive，而且學會了使用語法糖(`*`)的方式來表示複雜的 directive，在開發 Angular 應用程式時，我們常常會建立 Attribute Directive 來控制宿主元素上的一些行為，隨著功能越來越多，也不可避免會需要在 directive 上擴充更多輸入參數，這時候若加上一點符合語法糖的設計，就能夠幫助我們節省很多寫參數的時間，閱讀上也會更加容易啦！

本日程式碼參考：

https://stackblitz.com/edit/itironman2019-custom-structural-directive?file=src/app/app.component.html

# 相關資源

- [Microsyntax](https://angular.io/guide/structural-directives#microsyntax)
- [Template input variable](https://angular.io/guide/structural-directives#template-input-variable)
- [Write a structural directive](https://angular.io/guide/structural-directives)
- [EmbeddedViewRef](https://angular.io/api/core/EmbeddedViewRef)
