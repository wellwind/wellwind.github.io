---
title: "[Angular 大師之路] Angular 8 之後動態載入模組的方法 (非延遲載入路由)"
date: 2019-06-04 20:10:38
category: "Angular 大師之路"
tags:
  - Angular
  - Angular8
  - Dynamic Import
  - Lazy Loading
---

Angular 8 之後，將原來延遲載入路由模組的方式做了變動，改使用 [dynamic import](https://developers.google.com/web/updates/2017/11/dynamic-import) 的方法。這樣的方法替我們在開發時帶來非常大的優勢！隨著編輯器的資源，不管是模組路徑的設定還是選擇模組的方式，都擁有的自動完成的功能！

不僅如此，如果不想透過路由設定就想達到在程式中動態載入模組也變得比過去簡單許多。今天就讓我們來看看該如何自行在程式中動態載入模組吧。

<!-- more -->

今天的程式碼 DEMO：https://github.com/wellwind/ng8-dynamic-load-module

# 前置準備

1. 首先我們可以先使用 `ng new` 建立新的專案，由於沒有使用到路由功能，因此可以不要開啟路由相關功能
2. 接著我們建立一個 `lazy-page` 模組 (指令： `ng g m lazy-page`，稍後我們會在程式中動態載入它)
3. 並在裡面建立一個 `lazy-compone` 元件 (指令：`ng g c lazy-page/lazy-component`，載入模組後，會將此元件放置在畫面上)

整體目錄架構如下圖：

{% asset_img 01.jpg %}

# 使用 dynamic import 載入程式

接下來我們要開始使用 dynamic import 載入外部程式，方法很簡單，就跟在路由設定時一樣，透過 `import()` 方法取得外部的 ES6 Module。

```typescript
import('./lazy-page/lazy-page.module').then(loadedModule => {
  const lazyPageModule = loadedModule.LazyPageModule;
});
```

透過編輯器的支援，在使用 `import()` 時，可以透過自動完成帶入路徑：

{% asset_img 02.jpg %}

`import()` 會回傳一個 promise ，並可得到相關的程式，此時可以得到一個 ES6 的 module，包含了我們在程式內撰寫的 `LazyPageModule`。

一樣的，這個過程也有自動完成的功能！

{% asset_img 03.jpg %}

接著存檔，使用 `ng serve` 看看跑出來的結果。

{% asset_img 04.jpg %}

注意到了嗎？我們沒有使用任何 Angular 的延遲載入路由功能，只是使用 `import()` 設定要載入的程式，Angular CLI 就自動幫我這組程式切出來了！！透過 dynamic import 功能與 Angular CLI，就算不使用延遲載入路由的功能，我們也能自由自在的將程式切成更多小檔案，並且只在需要時自行載入，實在太方便啦。

# 建立動態載入的模組實體

由於使用 `import()` 載入的是 ES6 的模組，而非 Angular 的模組 (`NgModule`)，因此我們還必須將程式轉換成 Angular 的模組，在過去使用 SystemJS 的時代，我們會使用 Angular 幫我們設計好的 [SystemJsNgModuleLoader](https://angular.io/api/core/SystemJsNgModuleLoader) 來載入並建立該模組，如今載入的動作已經交給了 dynamic import，SystemJsNgModuleLoader 也隨之在 Angular 8 的文件被標示為棄用了。

{% asset_img 05.jpg %}

那麼我們該怎麼主動建立 Angular 模組呢？從 Angular Router 相關的程式碼可以看到，Angular 現在是使用 [Compiler](https://angular.io/api/core/Compiler) 來建立的！所以我們也能輕鬆的依樣畫葫蘆，建立起自行載入的程式模組。如下：

```typescript
export class AppComponent implements OnInit {
  constructor(private compiler: Compiler, private injector: Injector) {}

  ngOnInit() {
    import('./lazy-page/lazy-page.module').then(loadedModule => {
      const lazyPageModule = loadedModule.LazyPageModule;
      this.compiler.compileModuleAsync(lazyPageModule).then(moduleFactory => {
        const moduleRef = moduleFactory.create(this.injector);
        console.log(moduleRef);
      });
    });
  }
}
```

# 顯示動態載入模組中的元件

除了動態建立載入的模組外，更常見的是建立模組內的元件並顯示在畫面上，在這部分在之前的文章「[動態載入元件(簡易版)](https://wellwind.idv.tw/blog/2018/10/28/mastering-angular-14-dynamic-component-loader/)」我們介紹過使用[ngComponentOutlet](https://angular.io/api/common/NgComponentOutlet)，能幫助我們節省非常多時間。 `ngComponentOutlet` 有四個可用屬性如下圖：

{% asset_img 06.jpg %}

{% note info %}

關於 *ngComponentOutlet 是怎麼建立元件的，可以參考其[原始碼](https://github.com/angular/angular/blob/8.0.0/packages/common/src/directives/ng_component_outlet.ts#L107-L109)。

{% endnote %}

其中 `ngComponentOutletNgModuleFactory` 就是用來指定我們要動態建立的元件來自哪個模組，也就是我們上一節使用 Complier 產生的 `moduleFactory`。

接著只要確定 `ngComponentOutlet` 屬性要放模組內的哪個元件就行啦！因此我們調整一下原來的 `LazyPageModule`：

```typescript
@NgModule({
  declarations: [LazyComponentComponent],
  imports: [CommonModule],
  entryComponents: [LazyComponentComponent]
})
export class LazyPageModule {
  static EntryComponent = LazyComponentComponent;
}
```

記得，只要是在程式中動態載入的元件，都需要放在所屬 NgModule 中的 `entryComponents` 內，另外我們宣告了一個靜態屬性 `EntryComponent`，方便我們取得要被載入的元件。

接著就可以在建立模組後輕易取得這些資料啦！

```typescript
export class AppComponent implements OnInit {
  lazyModuleFactory: any;
  lazyComponent: any;

  constructor(private compiler: Compiler) {}

  ngOnInit() {
    import('./lazy-page/lazy-page.module').then(loadedModule => {
      const lazyPageModule = loadedModule.LazyPageModule;
      this.compiler.compileModuleAsync(lazyPageModule).then(moduleFactory => {
        this.lazyModuleFactory = moduleFactory;
        this.lazyComponent = lazyPageModule.EntryComponent;
      });
    });
  }
}
```

最後只要把這些資訊放進 ngComponentOutlet 就大功告成囉！

# 實際結果

成果如下：

{% asset_img 07.gif %}

當程式一開始載入時，並不會載入其他模組，只有當按鈕按下時，會在程式中載入模組，並顯示出其中的元件！

# 本日小結

- Angular 8 之後使用 dynamic import 來進行延遲載入路由，此功能不僅能運用在路由上，也可以透過 dynamic import 來進行各種程式的切分，不用再被限定在路由內。
- 使用 dynamic import 載入的是 ES6 的模組，若要轉換成 Angular 模組，可搭配 Compiler 來建立。
- 能夠建立相關的模組工廠 (Module Factory) 後，即可進一步建立其中的元件，本篇文章使用 ngComponentOutlet 來節省建立的程式碼撰寫。
- 範例程式有許多部分可以自行調整，如選擇元件來顯示的邏輯，或是把一堆 promise 包裝成 observable 等等。

# 參考資源

- [Dynamic import()](https://developers.google.com/web/updates/2017/11/dynamic-import)
- [[Angular 大師之路] 動態載入元件 (簡易版)](https://wellwind.idv.tw/blog/2018/10/28/mastering-angular-14-dynamic-component-loader/)
- [NgComponentOutlet 文件](https://angular.io/api/common/NgComponentOutlet)
- [使用 Complier 產生 module factory (原始碼)](https://github.com/angular/angular/blob/72ecc453639eae017f75653c9004adc406ed2ee6/packages/router/src/router_config_loader.ts#L54)
- [NgComponentOutlet 產生元件的方法(原始碼)](https://github.com/angular/angular/blob/8.0.0/packages/common/src/directives/ng_component_outlet.ts#L107-L109)
- [[Angular] 手動創造出 Lazy Loading 的效果](https://blog.kevinyang.net/2017/11/08/manual-lazy-loading/)

