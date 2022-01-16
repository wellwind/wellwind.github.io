---
title: "[Angular 大師之路] 在動態的 HTML 中動態產生元件"
date: 2022-01-16 13:12:26
category: "Angular 大師之路"
tags:
  - Angular
  - Angular 13
  - ApplicationRef
  - ViewContainerRef
  - ComponentFactoryResolver
---

在之前的文章中我們曾經提到過「動態建立元件」的方法，透過建立一個 directive，並決定這個 directive 的樣版上要呈現成什麼元件，之後將元件產生在 directive 所屬的樣版上。

這麼做很棒，不過還是有一個缺點，就是一定需要在樣板 HTML 上掛上這個 directive，才能產生動態的元件，雖然大部分情境都足夠了，但當遇到甚至連 HTML 都是完全自定義不是寫死在程式內的，如果需要由後端 API 回傳 HTML 內容，並在回傳的 HTML 特定位置放置元件，就會有困難。

今天就來看看這種動態的 HTML 內如何插入一個元件！

<!-- more -->

# 過去動態產生元件的方法

先簡單回顧一下過去動態產生元件的程式碼大概像什麼樣子？

```typescript
@Directive({
  selector: '[advertisementComponentHost]'
})
export class AdvertisementComponentHostDirective implements OnInit {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componenFactoryResolver: ComponentFactoryResolver) { }
  
  ngOnInit() {
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(AdvertisementComponent);
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
  }  
}
```

在上面程式中，我們建立一個 directive 並注入兩個服務：

- `ViewContainerRef`：代表 directive 所在的宿主元素樣版參考。
- `ComponentFactoryResolver`：在 Angular 中，所有元件最終都會產生一個建立開元件的工廠方法，`ComponentFactoryResolver` 就是用來找出工廠方法的服務。

因此我們可以在第 10 行使用 `componentFactoryResolver.resolveComponentFactory` 來找出建立指定元件的工廠方法；接著在目前的樣版參考上來使用指定的工廠方法建立元件，並顯示在目前的樣版上，也就是第 12 行的 `viewContainerRef.createComponent(componentFactory)`。

## 補充：Angular 13 簡化版

在 Angular 13 以後，我們可以不用再注入 `ComponentFactoryResolver` 了，`ViewContainerRef` 本身的 `createComponent()` 就可以直接指定元件，並幫我們建立，省去使用 `ComponentFactoryResolver` 找出工廠方法的麻煩。

```typescript
@Directive({
  selector: '[advertisementComponentHost]'
})
export class AdvertisementComponentHostDirective implements OnInit {
  constructor(private viewContainerRef: ViewContainerRef) { }
  
  ngOnInit() {
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(AdvertisementComponent);
  }  
}
```

# 在動態的 HTML 中加入動態元件

上述例子中，要動態產生元件，一定要在某個元件的 HTML 樣版中，找地方加入 `advertisementComponentHost` 這個 directive，才能動態的產生元件並放到畫面上，因此會被限定只有在元件的樣版上指定 directive 才能動態產生，但有沒有辦法更動態的產生元件呢？例如：

```typescript
@Component({
  selector: 'app-advertisement',
  template: '<div>Hello, {{ name }}. I am advertisement!</div>',
})
export class AdvertisementComponent {
  name = '';
}

@Component({
  selector: 'my-app',
  template: '<div [innerHTML]="templateHTML"></div>'
})
export class AppComponent  {
  // <my-ad> 是自訂標籤，因此需要用 DomSanitizer.bypassSecurityTrustHtml
  // 讓 Angular 允許這些標籤顯示在畫面上
  templateHTML = this.domSanitizer.bypassSecurityTrustHtml(`
  <h1>Title</h1>
  <div>summary</div>
  <div><my-ad></my-ad></div>
  <div>content</div>`);

  constructor(private domSanitizer: DomSanitizer) { }
```

`templateHTML` 是動態的文字，也可能是從後端資料庫內存放的文字，由一個後台去維護等等，最終會放置到畫面上，我們希望在這段 HTML 文字中，遇到 `<my-ad></my-ad>` 時，就替換成 `AdvertisementComponent` ，該怎麼做呢？基本上可以分成幾個步驟：

## 使用 ComponentFactoryResolver 建立元件

此時可以在記憶體中產生元件，並設定他的屬性值，監聽事件等等。

```typescript
const conpomentFactory = this.componentFactoryResolver.resolveComponentFactory(AdvertisementComponent);
const componentRef = componentFactory.create(this.injector);
const component = componentRef.instance;
component.name = 'Mike';
```

- 第 1 行：透過 `ComponentFactoryResolver` 建立元件工廠。
- 第 2 行：使用元件工廠的 `create` 方法建立元件，需要傳入 `Injector` 以確保可以在建立過程中解析出相依的其他程式。記得在建構式注入 `Injector` (`private injector: Injector`)。
- 第 4 行：設定元件屬性。

注意，使用元件工廠方法的時候元件是被動態建立的，因此還不會進入 `ngOnInit` 等生命週期。

## 將動態產生的元件加入應用程式中

我們目前只將元件產生起來，還沒有跟畫面扯上關係，因此就是一個獨立的物件而已，這時候我們可以將元件加入整個 Angular 應用程式中，才會處理相關的生命週期。

我們可以注入 `ApplicationRef`，代表目前整個 Angular 的應用程式參考。

```typescript
import { ApplicationRef } from '@angular/core';

constructor(private applicationRef: ApplicationRef);
```

之後將元件加入

 ```typescript
 this.applicationRef.attachView(componentRef.hostView);
 ```

##將動態產生的元件畫面放到指定的 DOM 中

在元件動態產生後，也已經有它的 HTML 樣版結構了，只是此時畫面都還是存在記憶體中，因此我們要做的事情就是將這個樣版加入需要的位置上：

```typescript
// 找出元件樣版的根節點
const node = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];

// 將元件樣版放到畫面上指定位置
const adHost = document.querySelector('my-ad');
adHost?.appendChild(node);
```

此時就可以將動態產生的元件放到畫面上任一個想要的位置上啦！

{% note info %}

這裡操作到 DOM 物件了，畢竟整個 HTML 是動態決定的，因此難以避免要稍微的直接操作一下 DOM 物件，可以的話還是要盡量避免，另外，也可以考慮用注入 `DOCUMENT` 的方式來處理。

```typescript
@Inject(DOCUMENT) private _document: Document
```

{% endnote %}

## 確保元件摧毀的生命

由於元件是被動態產生並動態放到指定位置的，因此我們也有必須自行負起責任告訴 Angular 什麼時候用不到這個元件了，例如當目前元件摧毀時，可能也該把目前元件動態建立的元件也一起摧毀。

```typescript
// 從 applicationRef 中移除
this.applicationRef.detachView(componentRef.hostView);
componentRef.destroy();
```

# 參考資源

- [本日程式碼參考](https://stackblitz.com/edit/angular-dynamic-component-without-templates)
- [Angular CDK - Portal](https://material.angular.io/cdk/portal/overview)
    - Angular CDK 的 Portal 也是使用類似的方式，將畫面上的 Template 或指定的 Component 甚至某段 DOM 元素，移動到想要的位置上。
