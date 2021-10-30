---
title: "[Angular進階議題] Angular Elements 簡介"
date: 2018-05-08 20:30:33
category: "Angular進階議題"
tags:
  - Angular
  - Angular 6
  - Angular Elements
  - Custom Elements
---

Angular 6正式推出了Angular Elements的功能，讓我們可以將Angular元件轉換成標準的[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)功能，在任何其他的HTML頁面中使用，這代表著Angular的應用範圍可以延伸到各種web應用去了！就算團隊中習慣用的是jQuery，我們也能夠把複雜的功能專換成Custom Elements，並且直接用在使用jQuery或其他靜態網站中，非常的方便！！

今天我們就來簡單看看如何使用Angular Elements，以及實際把它運用到一般的HTML頁面，來學習理解Angular Elements的強大吧。

<!-- more -->

今天的程式碼範例：https://github.com/wellwind/angular-elements-demo

# 關於Angular Elements

Angular Elements是Angular 6推出的一個重大功能，雖然還不盡完善，但也夠用在很多情境下了，透過Angular Elements，我們可以把Angular的元件直接應用到非Angular的專案中，讓開發更佳的靈活。

如果對於這個技術有興趣，也可以參考一下ng-conf 2018的影片：

<iframe width="560" height="315" src="https://www.youtube.com/embed/Z1gLFPLVJjY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Angular Elements的運作原理

Angular Elements的功能放在[@angular/elements](https://www.npmjs.com/package/@angular/elements)套件中，這個套件提供了一個`createCustomElement()` API，來把Angular的元件轉換成Custom Elements，轉換的過程是使用瀏覽器所提供的`customElements.define()`方法，把我們的元件類別註冊成為HTML tag；同時將`@Input()`轉換成成HTML tag的屬性，而`@Output()`則轉換為對應的事件；整個流程大致如下圖：

{% asset_img 00.png %}

## Angular Elements的支援度

由於Angular Elements使用了瀏覽器的Custom Elements功能，因此需要瀏覽器本身有提供相關的實作，以目前來說，Edge和IE都沒有對應的支援，Edge在未來將為支援，而IE只需要安裝相關的polyfills，即可支援到IE9。

## Angular Elements的應用範圍

Angular Elements有兩個主要的方向可以應用：

1.  **動態產生元件**：之前我們介紹過，在Angular中要動態產生元件必須透過[Dynamic Component Loader的技巧](https://fullstackladder.dev/blog/2017/06/21/angular-advanced-dynamic-component-with-component-factory-resolver/)來達成，但在單純的web應用上時，我們可以改成使用Angular Elements的方式，直接操作DOM，來降低原來動態元件的開發複雜度
2.  **混合靜態網頁**：有時候，我們只是想要在靜態網頁掛上一些類似widget的小工具，這可能就是最適合使用Angular Elements的時機了！
3.  **套件共用**：想想未來或許整個Angular Material都變成Custom Elements...(流口水)

# 開始使用Angular Elements

接下來我們就實際來建立一個Angular Elements看看吧！

## 安裝@angular/elements

在Angular 6之後，搭配Angular CLI 6，安裝這些Angular相關生態圈的套件都變得非常簡單，一行指令即可搞定：

```shell
ng add @angular/elements
```

{% asset_img 01.png %}

以上指令會幫我們做幾件事情：

1.  安裝`@angular/element`及`document-register-element`套件
2.  在`angular.json`檔案中，替Angular專案的`scripts`區塊加入`node_modules/document-register-element/build/document-register-element.js`

由於Angualr CLI 6後的專案允許同時管理多個Angular專案，因此若要在指定的專案中安裝，可以額外加上`--name`參數：

```shell
ng add @angular/elements --name=[project]
```

## 設計Angular元件

這個步驟其實沒什麼特別的，就是設計一個我們想要包裝成Custom Elements的元件，在這部分，我們簡單做了一個包含了`相依注入service`、`@Input()`和`@Output()`功能的元件，來看看Angular Elements是否都可以幫我們處理到好！

Angular元件的內容大致如下：

```typescript
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'app-counter',
  template: '{{ counterService.counter }}<button (click)="add()">+</button>',
  styles: []
})
export class CounterComponent implements OnInit {
  @Input() counter: number;
  @Output() counterChange = new EventEmitter<number>();

  constructor(public counterService: CounterService) { }

  ngOnInit() {
    this.counterService.setCounter(this.counter);
  }

  add() {
    this.counterService.addCounter();
    this.counterChange.emit(this.counterService.counter)
  }
}
```

使用上也很簡單，跟一般的Angular一樣，畢竟到目前為止都只是Angular的範圍而已：

```html
<app-counter [counter]="10" (counterChange)="onCounterChange($event)"></app-counter>
```

{% asset_img 02.png %}

## 將元件轉為 Custom Elements

接下來就是重頭戲啦，我們要把設計好的元件轉換成Custom Elements，雖然說是重頭戲，但實際上也不困難，只要調整一下`app.module.ts`就好了，以下只列出重點的程式碼：

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

上面程式中，我們做了幾件事情：

1.  在entryComponents中加入自訂的元件，避免在目前Angular程式中若沒有使用到，在build時會被tree shaking掉
2.  因為AppComponent用不到了，在bootstrap中把原本的AppComponent拿掉，改為手動在`ngDoBootstrap()`中處理
3.  在`ngDoBootstrap()`中，使用`createCustomElement()`將我們的自訂元件轉換成可以被Custom Elements接受的程式，同時將injector加入，讓我們可以注入service
4.  使用`customElements.define()`，將原來的元件註冊成HTML tag

以上就是一個基本的Angular Elements的設計啦！

## 實際測試

設計玩基本的Angular Elements之後，我們就來實際測試看看，由於使用Angular CLI建立的專案，在使用`ng serve`指令時，會以`src/index.html`的內容為基準，自動幫我們載入對應的scripts，因此我們可以直接在這裡修改後，使用`ng serve`指令，看看結果：

```html
  <my-counter counter="50"></my-counter>
  <script>
    const counterElement = document.querySelector('my-counter');
    counterElement.addEventListener('counterChange', (event) => {
      console.log(`Custom Element的事件值：${event.detail}`);
    });
  </script>
```

上面程式中，我們將原來的`<app-root>`拿掉，改為直接使用`my-counter`這個剛剛註冊的HTML tag

以上就是整個Angular Elements的設計流程，我們可以使用同樣的方法，設計出不同的元件，然後在`ngDoBootstrap()`將他們一個一個轉換成Custom Elements，在將build的程式分享出去，讓非Angular的專案也能夠使用由Angular開發出來的元件，是不是非常酷啊！

接下來我們再來講一些稍微進階一點的技巧，讓開發出來的Angular Elements使用上更加的方便！

## 打包程式

到目前為止我們已經可以把Angular專案的元件轉換成Custom Elements了，但還有一些小細節可以加強，例如產生的js檔後面會加上雜湊值，這部分我們可以透過Angular CLI的`--output-hashing`處理掉

```shell
ng build --prod --output-hashing=none
```

另外，不管願不願意，我們一口氣都會產生至少4個js檔(runtime,polyfills,scripts,main)，若要提供給使用者用，要載入4個檔案也未免太麻煩，因此我們可以透過指令把這4個檔案打包成一個，如下

```shell
cat dist/elements-demo/{runtime,polyfills,scripts,main}.js > my-counter.js
```

我們可以把這些指令都加到package.json中

```s
"build": "ng build --prod --output-hashing=none",
"package": "cat dist/elements-demo/{runtime,polyfills,scripts,main}.js > my-counter.js"
```

之後只需要先用`npm run build`編譯所需的程式碼，在透過`npm run package`，就能得到一個可以分享出去給別人用的js檔啦！！

# 本日小結

今天我們簡單介紹了Angular Elements的原理，以及如何使用Angular Elements設計出自己的Custom Elements，最後我們也學到了打包程式分享出去的方法！

以目前Angular的進度而言，我們無法避免打包一些不必要的Angular核心程式，因此產生出來的檔案可能會稍微略大，以範例的程式碼來說，最終打包的js檔高達231kb，就算壓縮後，也有68kb！儘管在現在網路速度夠快的環境下這些幾乎可以忽略，但還是略嫌龐大...但在未來IvyRender出來後，我們將可以過濾掉所有無關的程式碼，大幅降低程式碼的大小，相信到時候會有更多透過Angular Elements技術所產生的程式(例如大幅壓縮後可以給任何前端專案使用的Angular Material...)出現，Angular Elements的未來也是非常直得期待的。

說了這麼多，快去寫自己的Angular Elements，然後分享給別人用吧！

# 參考資源

-   https://angular.io/guide/elements
-   https://www.youtube.com/watch?v=Z1gLFPLVJjY
-   https://medium.com/@tomsu/building-web-components-with-angular-elements-746cd2a38d5b

