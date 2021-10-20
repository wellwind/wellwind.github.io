---
title: "[前端軍火庫]WOW.js - 動畫很炫，也要看得到才行啊！"
date: 2016-12-05 11:11:11
category: "前端軍火庫"
tags:
    - WOW.js
---
[上一篇文章](http://wellwind.idv.tw/blog/2016/12/04/front-end-animate-css/)中我們介紹了Animate.css這個強大的動畫CSS library，不過Animate.css主要是專注在處理動畫的部分，該在什麼時機點讓動畫呈現就不是重點了，因此若是直接在HTML上加上呈現動畫的class，會出現一個問題就是：「儘管要呈現動畫的標籤不在畫面上，而是在整個HTML頁面很下方的地方，但當網頁loading完成後，依然會立刻執行動畫效果，也因此在畫面下方的動畫就會因為早就跑完而看不見了。」

這其實是一件蠻可惜的事情，精心設計的呈現效果卻因為提早出現而變成沒有效果；這時候就需要JavaScript的輔助來讓動畫在捲動到標籤出現時才呈現了，而[WOW.js](http://mynameismatthieu.com/WOW/index.html)就是一個簡單的好幫手。

<!-- more -->

# 關於WOW.js

WOW.js有幾個很棒的特色

1.  使用簡單：大部分的狀態下，只需要加入一行JavaScrip程式就可以了
2.  載入速度快：只有3kb左右，載入速度當然快啦
3.  不相依於其他JavaScript套件：因此就算你不使用jQuery，WOW.js依然可以順利使用

# 開始使用WOW.js

要使用WOW.js非常簡單，載入相關的程式碼後，加上一行程式碼就完成了！

```javascript
new WOW().init();
```

WOW.js預設是使用Animate.css，若你要使用其他的library也沒有問題，只要調整一下程式就可以了，稍後會介紹如何設定，先在先來說明如何在HTML標籤上加入WOW效果

```html
<p class="wow bounce">
  我只有在出現時才會呈現特效喔！
</p>
```

如上程式碼，我們只需要先把原來Animate.css的`animated`class拿掉，然後改成`wow`，後面的`bounce`可以換成任何一種動畫特效的class，這樣就完成啦！我們可以把它方在網頁的非常下方，然後捲動網頁到下面，就可以看到特效出現囉。

簡單的DEMO: [https://jsfiddle.net/wellwind/51go16jq/](https://jsfiddle.net/wellwind/51go16jq/)

# 其他相關設定

預設要使用WOW.js就是這麼簡單，同時它也有很高的彈性，以下是一些WOW.js可以設定的參數

```javascript
var wow = new WOW(
  {
    boxClass:     'wow',      // 要套用WOW.js縮需要的動畫class(預設是wow)
    animateClass: 'animated', // 要"動起來"的動畫(預設是animated, 因此如果你有其他動畫library要使用也可以在這裡調整)
    offset:       0,          // 距離顯示多遠開始顯示動畫 (預設是0, 因此捲動到顯示時才出現動畫)
    mobile:       true,       // 手機上是否要套用動畫 (預設是true)
    live:         true,       // 非同步產生的內容是否也要套用 (預設是true, 非常適合搭配SPA)
    callback:     function(box) {
      // 當每個要開始時, 呼叫這裡面的內容, 參數是要開始進行動畫特效的element DOM
    },
    scrollContainer: null // 可以設定成只套用在某個container中捲動才呈現, 不設定就是整個視窗
  }
);
wow.init();
```

使用WOW.js，就不用害怕辛辛苦苦設計出來的動畫特效浪費掉囉！