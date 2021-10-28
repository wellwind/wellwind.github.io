---
title: "[前端軍火庫]loader.css - 就算loading中，也要很美觀才行"
date: 2016-12-06 11:11:11
category: "前端軍火庫"
tags:
---
隨著網頁技術越來越普及，ajax越來越被廣泛使用，為了讓ajax在傳輸時不會因為畫面都沒有變而感覺無聊，加上一個loading的icon是很常見的做法，早期甚至還可以看到不少loading圖片的產生器；但CSS功能越來越強，使用圖片的必要性也就變少了，今天要介紹的loader.css就是一款利用CSS產生loading圖示的library。

<!-- more -->

# 關於loader.css

loader.css預先定義了超過30種的loading顯示方式，我們只需要套用對應的class，就能夠輕易的產生一個loading的動畫圖示。

# 使用loader.css

在文件中載入相關的css/js之後，只需要加入以下HTML

```html
<div class="loader-inner ball-pulse"></div>
```

加入的`loader-inner`這個class本身其實沒有意義，是要給稍後的JavaScript使用的`ball-pulse`則是其中的一種動畫效果，更多的效果可以在[官方DEMO](https://connoratherton.com/loaders)上看到，在demo上你可以看到每個圖示中的白色小點都是一個div標籤，因此以`ball-pulse`這個效果來說的話，在外層的div裡面還需要塞入三個div才行，如果是`ball-spin-fade-loader`就要塞入8個！其實不是很方便。

# 使用loaders.js

好在loader.css還提供了一個helper library - loaders.js，透過這個library可以幫助我們塞入所需數量的div標籤，這個library是一個jQuery plugin，因此要使用前還需要先載入jQuery才行。載入後我們可以加入以下JavaScript程式碼

```javascript
 $('.loader-inner').loaders();
```

這裡就是抓出我們之前的`loader-inner`然後啟用loaders()，然後就能根據我們加入的class來決定要塞入多少個div，因此這個`loader-inner`你要改成`loader-ironman`也完全沒問題，只要JavaScript跟著調整就可以了。

以下是簡單的DEMO

{% asset_img 0.png %}

JSFiddle: [https://jsfiddle.net/wellwind/m7h2Lme7/](https://jsfiddle.net/wellwind/m7h2Lme7/)

# 類似資源

*   [CSSPIN](https://webkul.github.io/csspin/) - CSSPIN是一個著重在"旋轉"這種效果的loading library，雖然效果數量比較少，但色彩變化比較豐富。
*   [SpinKit](http://tobiasahlin.com/spinkit/) - SpinKit也是一個把效果放在"旋轉"這件事情上的library，但能呈現的特效數量更多。
*   [Ladda](http://lab.hakim.se/ladda/) - 表單按鈕按下後，一般除了把按鈕disabled來讓他無法重複發送以外，透過ladda也能讓表單送出時鎖定的按鈕具有更豐富的變化，非常適合用在ajax表單上。
*   [CSS Loader](http://www.raphaelfabeni.com.br/css-loader/) - CSS Loader在呈現loading時會同是進行block ui的動做，防止畫面上的任何變動，同時他的呈現方式也很有創意！