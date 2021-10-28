---
title: "[前端軍火庫]placehold.it - 規劃中網站用來暫時放圖片的線上服務"
date: 2016-12-16 11:11:11
category: "前端軍火庫"
tags:
---
[placehold.it](http://placehold.it/)跟過去介紹的library都不太一樣，它是一個線上服務，功用是在網站規劃中還只是雛型階段時，暫時用來表示**這裡有一張圖片**的工具。也就是說，網站還未完成時，我們可能就需要進行一些DEMO，這時候某些預計要放圖片地方還沒有任何圖片可用；或是我們知道網站的某個地方一定會放置圖片，但沒有立即可用的圖片時，需要張占用的圖片放著，好確認版面不會亂掉等等，placehold.it就可以幫助你達到這些目標。

<!-- more -->

以下是使用placehold.it所產生的一些圖片範例

{% asset_img 0.png %}

# 開始使用placehold.it

要使用placehold.it很簡單，只要在它的網址後面加上你想要產生的圖片大小即可，例如需要一張300x300的圖片時，HTML如下

```html
<img src="http://placehold.it/300x300" title="我只是暫時放在這裡的">
```

就可以輕鬆放置一張300x300的圖片啦！

# 進階參數

placehold.it還有一些參數可以設定，都只需要調整網址就可以了

## 指定檔案格式

如果需要指定檔案格式，只需要直接在網址後面加上附檔名即可，支援的格式有`gif`、`jpeg`、`jpg`和`png`

```html
<img src="http://placehold.it/300x300.gif" title="我只是gif檔">
```

## 自訂圖片文字

預設的圖片文字內容是圖片大小，我們也可以直接指定圖片要顯示的文字，只要網址最後加上`?text=xxxx`即可。

```html
<img src="http://placehold.it/300x300/?text=I+am+placehold" title="自訂文字也OK">
```

## 自訂顏色

我們也可以在網址後面加上兩個顏色代碼，第一個是文字顏色，第二個是背景顏色，來自訂圖片顏色，來搭配網站風格

```html
<img src="http://placehold.it/300x300/ffffff/000000" title="我是白底黑字的圖片">

```

DEMO: [https://jsfiddle.net/wellwind/8cvvthbk/](https://jsfiddle.net/wellwind/8cvvthbk/)

# 類似資源

*   [temp.im](http://temp.im/)：跟placehold.it使用方式基本上完全一樣，只是網址不同而已。
*   [lorempixum](http://lorempixel.com/)：除了圖片大小外，也以選擇不同分類的圖片、彩色\灰階；同時還有一個產生器可以直接使用。
*   [Dummy Image](https://dummyimage.com/)：一樣有個產生器可以使用，網站下方有很多樣板可以參考。
*   [placekitten](http://placekitten.com/)：所有圖片都是可愛的貓，愛貓一族可以考慮用這個，在雛型階段就有好心情XDD。
*   [Unsplash It](http://unsplash.it/)：除了有大量的圖庫可以使用，也內建不少濾鏡可以直接套用。