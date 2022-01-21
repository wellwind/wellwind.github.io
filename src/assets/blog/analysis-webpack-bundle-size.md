---
title: "[Webpack] 分析產生後的 bundle 內容"
date: 2022-01-21 18:15:42
category: "前端軍火庫"
tags:
  - Webpack
  - Angular
---

Webpack 是強大的前端打包工具，可以幫助我們快速的將前端 JavaScript 程式及其用到的相關程式都打包成一個或數個 js 檔。同時也可以將不需要的程式透過 tree shaking 機制過濾掉。

不過在前端的世界對於檔案大小是錙銖必較的，因此知道 webpack 到底打包了哪些程式，哪些程式是過濾不掉的，就非常重要了！

好在 Webpack 提供了一個功能，讓我們能快速分析出打包的結果，到底包進哪些程式，程式大小等等清清楚楚，今天就來看看如何分析Webpack 打包後的結果。

<!-- more -->

# 產出分析檔案

webpack 的分析檔案會以 `json` 格式儲存，只要搭配特定指令，就可以直接產出這個檔案。

## 透過 Webpack 指令產出分析檔

可以直接使用 `webpack` 指令，搭配適當的參數，直接產出一個分析檔。

```shell
npx webpack --profile --json=stats.json
```

## Angular CLI 產出分析檔

如果是 Angular 專案，因為 Angular CLI 專案已經將 webpack 包裝起來了，因此在執行 `ng build` 時，可以加上 `stats-json` 參數直接要求產生這個分析檔。

```shell
npm run build -- --stats-json 
```

此時在產出打包結果的目錄內會有一個 `stats.json`，就是分析結果。

# 分析打包後的程式

我們當然不會直接去閱讀這個 json 檔，那太辛苦了，我們可以透過 `webpack-bundle-analyzer` 這個工具，幫我們產生一個漂亮的介面，來去分析 bundle 檔案內的各種內容。

```shell
npx webpack-bundle-analyzer .\dist\blog\browser\stats.json
```

接著便會開啟瀏覽器，預設是 `http://127.0.0.1:8888`，並看到這樣的畫面：

{% asset_img 01.png %}

這麼一來就可以用上帝的視角來看看整個專案打包了哪些東西啦！

我們可以隨將滑鼠移動到某個區塊上（其實就是打包進來的程式），就可以看到這個區塊的實際大小：

{% asset_img 02.png %}

透過分析我們可以決定是否要將某些檔案拆分到其他模組內；某些套件或自己寫的程式也許對於被 tree shaking 的能力較差，可以考慮換一套或是改寫；或是有些套件本身太大了，可以考慮拆出來動態載入，也可以考慮換一套較輕量的。

目前我們一口氣列出的整個專案打包後的所有模組，在專案越來越複雜的時候，檔案 & 模組都會越來越多，這時可以考慮按左上角的按鈕，選擇特定的檔案模組出來看。

{% asset_img 03.png %}

{% asset_img 04.png %}

# 本日小結

Webpack 在前端被運用的範圍非常廣泛，因此能分析它產生出來的內容也很重要，而 Webpack 也能幫助我們產出分析結果，並搭配適當的工具，讓我們能更容易的理解整個檔案到底涵蓋了哪些其他的模組/套件/程式等等，可以說是優化非常不可缺少的工具！

# 相關資源

- [Stats Data - Webpack](https://webpack.js.org/api/stats/)
- [ng build - options](https://angular.io/cli/build#options)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
