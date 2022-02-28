---
title: "[Angular 進階議題] 減少 moment.js 造成 bundle 檔案過大的問題"
date: 2022-02-26 18:34:27
category: "Angular 進階議題"
tags:
  - "Angular"
  - "Webpack"
  - "momentjs"
---

[momentjs](https://momentjs.com/)，可以說是最多人使用的老牌 JavaScript 時間處理類別庫；當然，隨著技術的進步，momentjs 也有不少議題被提出，其中最大的問題就是檔案太過龐大了，且隨著現在前端技術的發展，我們經常使用 webpack 等工具將前端程式進行打包，同時過濾 (tree shaking) 要不要的程式，以減少整體檔案大小。

而 momentjs 由於原始設計的關係，在做 tree shaking 的時候會無法移除掉用不到的 API，同時還有龐大的語系檔，嚴重影響最終 bundle 檔案大小。

抱怨歸抱怨，momentjs 還是非常多人在用，因此只能盡量的做到減少大小，至少不要把龐大的語系檔一起 bundle 進來。

Angular 過去是將 webpack 整個封裝起來的，而隨著版本推移，現在也能自訂 webpack 了，今天就來看一下如何在 Angular 中自訂 webpack，同時移除 momentjs 中過大的語系檔。

<!-- more -->

# 原始 Angular + Momentjs 大小

先來看一下一般加入 momentjs 的話，會輸出多大的檔案

首先是一個新建立好的 Angular 13 專案，使用 production build 後的結果：

{% asset_img 01.png %}

加上 momentjs 後，只補上一行程式碼 (為了確保使用到 moment)，結果為：

{% asset_img 02.png %}

整體大小從原來的 157.98kb 激增到 530.39kb!

使用 webpack-bundle-analyzer 分析一下：

{% asset_img 03.png %}

可以看到整個 moment 物件 import 不說，最佔空間的其實是那堆肥大的語系檔，但很多時候語系檔我們是用不到的，如果能在 bundle 程式時，直接過濾掉那些語系檔，就可以順利減去不少檔案大小！

# 自訂 Angular Webpack 設定檔

## 安裝與設定套件

透過 Angular 的 CLI Builders 功能，我們可以很容易的將自訂的 webpack 設定也納入 bundle 時的執行範圍，最簡單的方式是安裝 [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack) 套件

```shell
npm i @angular-builders/custom-webpack
```

接著需要告訴 Angular 我們要使用這個 Builder，我們是要在 build 階段加入自訂的 webpack 設定檔，因此打開 `angular.json`，置換掉 `projects.[projectName].architect.build.builder` 的設定

* 把 `builder` 從原來的 `@angular-devkit/build-angular:browser` 換成 `@angular-builders/custom-webpack:browser`
* 在 `options` 下加入 `customWebpackConfig` 設定，指定要使用的 webpack 設定

簡單的範例：

```
{
"projects": {
  "[project]": {
    "architect": {
      "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
          "customWebpackConfig": {
            "path": "./webpack-reduce-moment.config.js"
          }
  ...
```

## 建立自訂 Webpack 設定

接下來就簡單了，我們只要自訂好 Webpack 設定檔，在 build 階段打包程式時就會同時將我們的設定檔一起納入處理，以減少 momentjs 的語系檔來說，可以使用如下設定：

```javascript
'use strict';

const webpack = require('webpack');

module.exports = {
  plugins: [
    // Filter out the moment locales to reduce bundle size
    // Locales that should be included MUST be added to the project, otherwise they won't be available for use)
    // References:
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
  ],
};
```

原來很簡單，就是使用 webpack 的 [IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/)，並設定 moment 套件下的 locale 相關內容都不要 bundle 進來。

# 結果展示

設定完成後，再執行一次 production build，產出的檔案大小為：

{% asset_img 04.png %}

從原來的 530.39kb 一下減少到 216.40kb，可以說是明顯的瘦身，雖然還是比原本的 157.98kb 胖了不少，但也沒辦法，momentjs 本身設計就是這樣，無法修剪掉不必要的程式碼！

再使用 webpack-bundle-analyzer 分析一次，可以看到原來很大的一包語系檔就通通消失囉。

{% asset_img 05.png %}

# 本日小結

雖然現在要處理時間已經慢慢開始不建議使用 momentjs 了，有更多更好、更快也更小的選項可以使用，但有時也可能無法避免其他第三方套件使用到，還是必須加入 momentjs，那麼就只能在 bundle 程式時盡量減少大小。

而在 Angular 中可以透過自訂 webpack 設定的方式，來達到一定程度的彈性，讓我們可以在不用理解太多 Angular bundle 設定的情況下，又保有自己擴充的彈性，真的是非常方便啦！
