---
title: "[Angular 大師之路] 動態載入元件 (複雜版)"
date: 2018-10-29 22:01:09
category: "Angular 大師之路"
tags:
  - Angular
  - ViewContainerRef
  - ComponentFactoryResolver
  - ComponentFactory
---

昨天我們介紹了使用 `*ngComponentOutlet` 的方法來動態產生元件，其實它是一個使用 `ViewContainerRef` 來顯示不同內容的行為，因此我們也可以不透過樣板語法的方式，改成自行在程式中產生元件實體後方到畫面上；今天我們就稍微深入的來看看比較複雜的方式來動態載入元件吧！

<!-- more -->

**類型**：技巧

**難度**：5 顆星

**實用度**：4 顆星

# 動態載入元件的步驟

要動態載入一個元件，有以下幾個步驟

## 建立用來裝載元件的 directive

首先，我們先建立一個 directive，如下：

```typescript
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicComponentHost]'
})
export class DynamicComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
```

在上面的程式中，我們注入了 `ViewContainerRef`，代表的是宿主元素的樣板實體，當我們能拿到樣板實體時，就能夠在這個實體上，放置不同的元件。

## 在樣板中使用 directive

接著我們會在樣板中使用這個 directive，來決定哪個宿主元素是用來載入不同元件的，所以原本一堆 `*ngIf` 的 HTML 變成了一行！

```html
<ng-container appDynamicComponentHost></ng-container>
```

## 在程式中取得 directive

接著，我們要在程式中取得這個 directive，同時也代表能夠取得對應的 `ViewContainerRef`，我們才能夠改變宿主元素的內容，要取得 directive 的方式很簡單，用 `@ViewChild` 就好了。

```typescript
@ViewChild(DynamicComponentHostDirective) dynamicComponentLoader: DynamicComponentHostDirective;
```

## 使用 ComponentFactoryResolver 產生元件

接著，我們要使用 Angular 提供的 `ComponentFactoryResolver` 服務來產生一個元件，整個程式碼大致如下：

```typescript
export class AppComponent implements OnInit {
  @ViewChild(DynamicComponentHostDirective) dynamicComponentLoader: DynamicComponentHostDirective;

  private _chooseForm = 'A';

  get chooseForm() {
    return this._chooseForm;
  }

  set chooseForm(value) {
    this._chooseForm = value;
    this.setDynamicComponent();
  }

  mapping = new Map<string, any>(
    [
      ['A', ComponentAComponent],
      ['B', ComponentBComponent],
      ['C', ComponentCComponent],
    ]
  );

  constructor(private componenFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.setDynamicComponent();
  }
  
  setDynamicComponent() {
    const targetComponent = this.mapping.get(this.chooseForm);
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(targetComponent);
    const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
    viewContainerRef.clear();
      
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
```

看起來很長一串，但主要都是一些對應和注入的程式碼，重點其實在 `setDynamicComponent()` 裡面，讓我們來看一下裡面的程式碼內容：

```typescript
const componentFactory = this.componenFactoryResolver.resolveComponentFactory(targetComponent);
```

使用注入的 `ComponentFactoryResolver` 來取得要產生目標元件的工廠類別實體。

```typescript
const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
viewContainerRef.clear();
```

取得要動態載入元件的 directive 的 `ViewContainerRef`。

```typescript
const componentRef = viewContainerRef.createComponent(componentFactory);
```

使用取得的 `ViewContainerRef` 的 `createComponent` 方法，來建立元件，建立的依據是剛剛產生的工廠類別實體；建立後會取得一個 `ComponentRef` 的類別實體，代表的是實際上建立的元件實體參考，因此我們可以透過 `componentRef.instance` 的方式取得元件實體本身，因此若有需要傳資料給元件，可以使用轉型的方式，例如：

```typescript
(componentRef.instance as SomeComponent).data = {};
```

## 加入 entryComponents 中

最後當然不要忘記，有動態產生需求的元件，一定要放入對應模組中的 `entryComponents: []` 設定中，就算大功告成啦！

# 動態載入 template

`ViewContainerRef` 提供了許多有趣的方法，除了我們剛才用到的 `createComponent()` 以外，另外還有一個方法 `createEmbeddedView()` 可以用來產生樣板上 `<ng-template>` 的內容，所以要動態載入樣板中的一個 template 也是完全沒問題的一件事情！

```typescript
@ViewChild('customTemplate') customTemplate: TemplateRef;
setDynamicComponent() {
  const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
  viewContainerRef.createEmbeddedView(this.customTemplate);
}
```

這麼一來，不管是 `*ngComponentOutlet` 還是 `*ngTemplateOutlet` ，我們都能夠透過自己的方式去顯示啦！

本日的程式碼：

https://stackblitz.com/edit/ironman2019-dynamic-component-loader

# 相關資源

- [Dynamic Component Loader](https://angular.io/guide/dynamic-component-loader)
- [ViewContainerRef](https://angular.io/api/core/ViewContainerRef)
- [ComponentFactoryResolver](https://angular.io/api/core/ComponentFactoryResolver)
- [ComponentFactory](https://angular.io/api/core/ComponentFactory)
