---
title: "移除 ModuleConcatenationPlugin 以加快 Angular 建置速度"
date: 2022-07-29 08:33:49
category:
  - "Angular 大師之路"
tags:
  - Angular
  - Angular CLI
  - Webpack
  - ModuleConcatenationPlugin
ogImage: 00.jpg
---

最近接手一個專案，需要將舊 Angular 9 專案加入之前客戶沒有實作的 lazy loading 功能，專案包含了將近 600 個頁面，之後還會增加。

重構的過程是很順利的，不過在 lazy loading 架構完成後，卻出現了 production build 時間大幅增加的問題，花費了不少時間研究，總算是以較低的代價換回了 build 速度。

這篇文章就來分享一下整個過程和結論。

<!-- more -->

# 效能影響說明

以我目前工作的電腦，直接 production build 客戶的程式，速度非常的快，只需要 *4四分鐘** 所有就可以建置完成，不過因為沒有 lazy loading，所以產生出來的 `main.js` 檔案高達 `35.5MB`！

這也是客戶的主要痛點，所有使用者一開始的載入速度都非常的慢，因此改成了 lazy loading，之後產出的 `main.js` 就直接減少到了 `2.5MB`，當然這還可以繼續優化，但不是今天的重點，重點是整個 production build 的速度從原來的 4分鐘 硬生生提高到了 **32分鐘**！

這樣的落差當然是難以接受的，需要進行調整。

# 優化方法

## 正規的優化方式

會造成 build 速度增加有很多的可能，除了 lazy loading 可能會因為拆成更多檔案最佳化影響時間外，如果專案架構過於複雜，NgModule 之間過度複雜的互相依賴等等，也都會影響 Angular 使用 webpack 的速度，畢竟越複雜的專案，就需要花費越多的時間進行分析；另外 Angular 和 Webpack 推出新的版本時也可能會持續優化速度。

因此像是目前遇到 Angular 9 的專案，比較一般且應該優先的處理方式會是：

1. 想辦法升級到最新版的 Angular，讓整個框架幫我們優化速度
2. 整理目前的專案程式，重新釐清 NgModule 間的相依，避免每個 NgModule 過度依賴其他的 NgModule

不過對於一個數量龐大且複雜、長時間沒有升級，過去程式碼之前耦合性已經不好切割的系統而言，這樣的成本可能會非常高，儘管正規的步驟可以在根源上得到改善，但豐滿的理想往往與現實的殘酷有落差，如果有更多的時間與金錢，當然這是最理想的解答，不過也就沒什麼好說的了。

接下來再說些沒那麼~~政治正確~~正規的解決方式。

## 稍微偏門的優化方式

Angular 使用 Webpack 進行建置程式的動作，但將它包裝起來了，對於框架使用者來說最大的好處是不用學習那些複雜的 Webpack 設定檔，犧牲了一些彈性，但開箱即用可以說是非常方便；不過我們依然可以在 `angular.json` 中針對 production build 要做的行為進行一些調整，一般來說我們在 production 的設定內可以看到以下資訊

```json
{
  ...
  "production": {
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false,
    "extractCss": true,
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true,
    ...
  }
}
```

這些設定都可以對應到 Webpack 的某些步驟，將其打開或關閉也都會影響到建置時間，我自己是沒有一個一個參數調整過，不過網路上也有人做過實驗，具體可以參考「[How to speed up your Angular builds](https://www.bitovi.com/blog/how-to-speed-up-your-angular-builds)」這篇文章。

儘管看起來把 `buildOptimizer` 等關閉可以加快速度，但在不確定背後到底對 Webpack 做了什麼影響的情況下，心裡總是毛毛的，畢竟對於 Angular 說關閉 `buildOptimizer` 可能同時就關掉了好幾個 Webpack 優化的選項，但除了去看 Angular CLI 的原始碼之外我們也無法知道到底發生了什麼事情。

不過在不斷嘗試過程中，還是有所發現，也就是接下來的 `ModuleConcatenationPlugin`

## 移除 ModuleConcatenationPlugin 優化

在不斷建置的過程中，我發現了 Webpack 優化程式碼時有一個步驟特別慢，也就是使用 `ModuleConcatenationPlugin`，因此會在這裡卡住非常久的時間

{% asset_img 01.png %}

這是個我之前沒看過的 plugin，於是查了一下 [ModuleConcatenationPlugin 的文件說明](https://webpack.js.org/plugins/module-concatenation-plugin/)，理解到了 Webpack 建置程式時，會將我們的每個 JavaScript 模組（注意當然不是 Angular 的 NgModule）都轉換成一個閉包（Closure），這雖然是很合理的一件事情，但其實是有優化空間的，`ModuleConcatenationPlugin` 就是嘗試將這些模組產生的閉包，合併到一個閉包內，如此一來就有機會產生更小，且執行速度更快的程式碼！這個功能在 production mode 是預設開啟的。

這樣的優化聽起來很棒，但是在使用 lazy loading 後每個檔案也已經盡可能縮小了，再次想辦法縮小划算嗎？

平常在開發階段用瀏覽器跑都程式效能都順順的，是否還有需要最佳化到跑起來更快呢？

當然檔案越小，執行速度越快這是 production build 的終極追求，但用將近 30 分鐘的建置時間成本來換真的划算嗎？

我想 CP 值可能真的沒這麼高吧？所以現階段目標就很明確了，只要想辦法讓 Webpack 優化程式時不要使用 `ModuleConcatenationPlugin` 就可以了！

好加在 Angular 雖然將 Webpack 封裝起來不讓我們看也不讓我們直接修改，但設計上還是有辦法開放我們去做一些調整的

我們可以安裝 `@angular-builders/custom-webpack` 套件

```sh
npm i @angular-builders/custom-webpack
```

需要這個套件會跟著 Angular 版本升級而有所異動，因為不同 Angular 版本開放 Webpack 的方式可能會有點不同，以目前使用的專案是 Angular 9.1 的情況下，找到的對應的套件版本

```sh
npm i @angular-builders/custom-webpack@9.1.0
```

接著調整在建置程式時使用的 builder

```json
"architect": {
  "build": {
    
    "builder": "@angular-builders/custom-webpack:browser",
    // ^^^^^^ 改成使用自訂的 builder
    "options": {
      "customWebpackConfig": {
        "path": "./extra-webpack.config.js"
        // ^^^^ 使用自訂的 webpack 設定檔
      },
```

之後建立 `extra-webpack.config.js` 去微調 Webpack 的設定

```js
module.exports = { 
  optimization: { 
    concatenateModules: false, 
  }, 
}; 
```

只要指定 `optimization.concatenateModules = false` 即可關閉使用 `ModuleConcatenationPlugin` 啦！

經過實際測試，production build 時間從悲慘的 32分鐘 優化到 4分多鐘，跑了起次大概比原來都沒有 lazy loading 慢個數十秒而已！

至於檔案大小呢？大致上 review 了一下幾乎沒有太大的變化，多數檔案大小都沒有改變，少數變大的檔案最多也就幾 kb 而已，這樣的代價真的是可以忽略。

# ModuleConcatenationPlugin Demo

最後我們來實際實驗一下 `ModuleConcatenationPlugin` 到底做了什麼事情。

我已經先將寫好的程式推到 GitHub 上，可以直接下載來參考

- https://github.com/wellwind/ModuleConcatenationPluginDemo

## 程式架構說明

整個程式大概長這樣：

有一個自定義的 `module-a.js`

```js
export function methodA() {
  return 'A';
}
```

另外還有一個 `module-b.js`

```js
export function methodB() {
    return 'B';
}
```

最後是主程式 `index.js`，引用了 `module-a.js` 和 `module-b.js` 的程式

```js
import { methodA } from './module-a';
import { methodB } from './module-b';

console.log(methodA());
console.log(methodB());
```

webpack 設定 `mode: 'production'`，然後比較加上 `optimization.concatenateModules = false` 前後的差異

不是 production mode 產出的程式太長了，可以直接參考 [GitHub 上的檔案](https://github.com/wellwind/ModuleConcatenationPluginDemo/blob/master/dist/index.js)

production mode 但取消 `ModuleConcatenationPlugin` 時，產生檔案如下（重新排版過）：

{% asset_img 02.png %}

可以看到 Webpack 替 `module-a.js` 和 `module-b.js` 各自產生一段閉包。

如果經過 `ModuleConcatenationPlugin` 優化呢？產生檔案如下（重新排版過）：

{% asset_img 03.png %}

經過 `ModuleConcatenationPlugin` 優化後，由於 `module-a.js` 和 `module-b.js` 內的程式很單純的被 `index.js` 直接引用，因此根本也不需要去引用模組產生的閉包程式，而是直接把裡面的程式 inline 合併進來，省去模組的呼叫，也節省了檔案的大小！這種優化還是很酷的！

# 本日小結

在前端的世界要打包原本模組化拆分的各種檔案，Webpack 是最長使用的工具，且 Webpack 也內建了許多優化的選項，讓我們產生更小、更快的程式碼！當然，這些都是可調整的。

Angular 也依賴了 Webpack 作為打包工具，雖然我們看不到內部的實際內容（除非去看 Angular CLI 原始碼），但在觀察過程中還是可以發現不少被使用的 Plugin，同時 Angular 也提供了些許的彈性，讓我們介入 Webpack 的設定，又不用看到複雜的原始設定，在遇到如今天這樣的 build 時間大幅增長的情境下，多關掉一些 plugin，就可以用少許的代價換來大幅度的加速！！

# 相關資源

- [How to speed up your Angular builds](https://www.bitovi.com/blog/how-to-speed-up-your-angular-builds)
- [ModuleConcatenationPlugin | Webpack](https://webpack.js.org/plugins/module-concatenation-plugin/)
- [Speed up Angular CLI build time excluding some optimization plugins](https://medium.com/@geor.oikonomopoulos/speed-up-angular-cli-build-time-excluding-some-optimization-plugins-a68b6ae8cdd9)
- [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack)
