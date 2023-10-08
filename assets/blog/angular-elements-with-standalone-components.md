---
title: "Standalone Components 下如何使用 Angular Elements"
date: 2023-08-12 13:52:17
category:
  - "Angular 大師之路"
tags:
  - Angular
  - Angular 15
  - Angular Elements
  - Standalone Components
---

Angular 15 之後推出了全新的 Standalone Components 開發方式，擺脫傳統 NgModule 的束縛，讓我們能打造出更輕更快的 Angular 元件以及應用程式。未來極有可能會變成 Angular 開發的主流，而 Angular Elements 則可以幫我們把 Angular 的應用程式打包成符合 W3C 標準的 Web Components，可惜的是目前 Angular 文件還沒有特別針對 Standalone Components 如何使用 Angular Elements 特別做說明，這篇文章就來介紹一下如何將 Angular 的 Standalone 轉換成 Web Components。

<!-- more -->

## 回顧使用 NgModule

首先當然是把套件安裝起來：

```bash
npm i @angular/elements
```

接著就是如何把原件包裝起來了，過去我們都是在 `NgModule.ngDoBootstrap` 裡面宣告，如下：

```typescript
import { createCustomElement } from '@angular/elements';

@NgModule({
  bootstrap: [],
  entryComponents: [CounterComponent]
})
export class AppModule {
  constructor(private injector: Injector) {

  }
  ngDoBootstrap() {
    const counterElement = createCustomElement(CounterComponent, { injector: this.injector });
    customElements.define('my-counter', counterElement);
  }
}
```

`createCustomElement` 是 `@angular/elements` 所提供，把原件包裝起來的方法，我們可以在這裡建立一個支援 Web Components 的物件，只要指定要使用的元件，以及要注入的 Injector 即可。(Injector 非必要，但有 service 等需求時就需要 Injector 支援)。

之後再用原生的 `customElements.define` 把元件註冊成 Web Components，這樣就完成了。

不過要轉換成 Standalone Components 開發時，可以看到兩個問題：

1. 沒有 `NgModule.ngDoBootstrap` 是 NgModule 時代下啟動模組的方式，但在 Standalone Components 時代下，我們不需要再使用 NgModule 了，那麼該在什麼時候呼叫 `createCustomElement` 來包裝元件呢？
2. 宣告的 `injector` 是在 NgModule 的建構式中注入的，但在 Standalone Components 時代下，我們沒有 NgModule 了，那麼該如何注入 `injector` 呢？

## 使用 Standalone Components

接著我們就來看看如何解決上述的兩個問題，首先先看看 `main.ts` 如何啟動 Standalone Components 的應用程式：

```typescript
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

可以看到我們目前是透過 `bootstrapApplication` 來將一個元件當作應用程式啟動，但我們要的其實不是啟動應用程式，而是單純把原件包裝起來，因此這裡似乎可以先很簡單的改成

```typescript
// 問題是，injector 怎麼辦？
const counterElement = createCustomElement(CounterComponent, { injector: ?? });
customElements.define('my-counter', counterElement);
```

不過事情並沒有那麼簡單，對 Angular 應用程式來說，一個可以被使用的 Injector 是至關重要的，那麼我們要如何得到一個可以使用的 Injector 呢？在 Standalone Components 下，除了 `bootstrapApplication` 以外，其實也提供了 `createApplication` 來幫助我們「建立」應用程式，這時候建立的應用程式，還不會直接啟動，但此時應用程式裡面就會包含我們的 Injector 了。

```typescript
import { createApplication } from '@angular/core';

(async() => {
  const app = await createApplication(appConfig);
  console.log(app.injector);
})();
```

其中的 `appConfig` 是 Angular 直接建立一個 Standalone 專案時提供的設定，我們可以根據自己的需求提供更多可被注入的 token。

由於 `createApplication` 回傳是一個 Promise，但我們還需要後續產生的 `injector`，在 `main.ts` 這個入口程式中，使用了 IIFE 的技巧包裝起來。

接下來就簡單多啦！我們可以把 `createCustomElement` 的 `injector` 改成剛剛建立的 `app.injector` 即可。

```typescript
(async () => {
  const app = await createApplication();
  const counterElement = createCustomElement(CounterComponent, {
    injector: app.injector,
  });
  customElements.define('counter-element', counterElement);
})();
```

就這樣，我們就可以把 Standalone Components 轉換成 Web Components 了！Web Components 由於是原生的機制，可以跨任合框架使用，真的是非常方便！

## 注意 & 進階應用

這邊提一些可能要注意的狀況及進階應用：

### 在 Angular 專案中使用 Web Components 造成 NG8001 錯誤

由於 Web Components 會有自己定義的標籤，在 Angular 專案中會導致找不到這個標籤而出現類似以下的錯誤：

{% note danger %}

src/app/app.component.ts:9:5 - error NG8001: 'counter-element' is not a known element:
1. If 'counter-element' is an Angular component, then verify that it is included in the '@Component.imports' of this component.
2. If 'counter-element' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@Component.schemas' of this component to suppress this message.

9 &nbsp;&nbsp;&nbsp;&nbsp;&lt;counter-element&gt;&lt;/counter-element&gt;

{% endnote %}

這時候只要提供 `CUSTOM_ELEMENTS_SCHEMA` 就可以了：

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <counter-element></counter-element>
  `,
  styles: [],
  // 重點在這裡
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'standalone-web-components';
}
```

不過千萬要記住的是，此時出現任何 Angular 無法判斷的標籤都不會報錯，這也會造成之後除錯上的不方便，因此強烈建議在需要的時候才開啟這個功能！以 Standalone Components 角度來說，我會建議「只有在該元件裡面用到 Web Components 時，才在這個元件中才開啟，其他元件依然保持不開啟」。

### Angular Elements 產生的 Web Components 的屬性繫結

在設計 Angular 元件的 `@Input()` 時，習慣的命名方式是 camelCase，但為了依照 Angular Elements 建議的方式，我們會把屬性名稱改成 kebab-case。因此用在 Angular 以外的應用程式時，指派屬性的方式要特別注意

```html
<!-- @Input() counterNumber -->
<counter-element counter-number="10"></counter-element>
```

如果是字串，在 Angular 中使用，又不想用繫結方式，也要直接用 kebab-case 的方式指派：

```html
<!-- @Input() headerText -->
<counter-element header-text="Hello"></counter-element>
```

如果在 Angular 應用程式中要使用屬性繫結，可以使用 kebab-case 的方式，但要加上 `attr.`，或是單純用回原來的屬性名稱也可以：

```html
<!-- @Input() headerText -->
<counter-element [attr.header-text]="headerText"></counter-element>
<counter-element [headerText]="headerText"></counter-element>
```

### Shadow DOM

自行建立的 Web Component，很怕樣式會被外面的 CSS 破壞，此時可以指定元件使用 Shadom DOM 的方式產生，這樣一來樣式就不會被外面的 CSS 給破壞。

```typescript
@Component({
  ...,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CounterComponent { ... }
```

如果要保持彈性讓外部可以客製化，可以使用 CSS Variable

```typescript
@Component({
  ...,
  template: `<div class="counter-header-style">{{ headerText }}</div>...`,
  styles: [
    `
      .counter-header-style {
        font-size: var(--counter-header-size, 2em)
      }
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CounterComponent { ... }
```
