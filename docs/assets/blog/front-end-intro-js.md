---
title: "[前端軍火庫]Intro.js - 把建好的UI直接變成說明文件"
date: 2016-12-15 11:11:11
category: "前端軍火庫"
tags:
---
在設計系統的時候，常常因為需求複雜或龐大，UI也會越來越複雜，變得不直覺、難以操作；這時候有個操作手冊就變得非常重要，但是前端的變化速度又非常快，往往導致操作手冊跟不上UI的變化，這時如果有個響導能帶著你走過所有步驟，又不用擔心隨著UI的改變而無法使用，那真是再好不過了！今天要介紹的[Intro.js](http://introjs.com/)，就是一款能達到上述條件的神奇library。

<!-- more -->

# 開始使用Intro.js

首先先假設我們的UI程式碼如下

```html
<div>
  <span>姓名</span>
  <input type="text">
</div>

<div>
  <span>Email</span>
  <input type="text">
</div>

<div>
  <input type="button" value="送出">
</div>
```

只是個很簡單的HTML表單，接著我們希望能告訴user操作的步驟，因此我們使用[Intro.js](http://introjs.com/)來完成這個目標，在載入相關的css/js後，我們為每個步驟的div加上兩個attribute：`data-step`和`data-intro`。`data-step`的值為步驟的編號，`data-intro`的值為每個步驟的說明。

因此上面的HTML會改為

```html
<div>
  <button id="start">
    ?說明
  </button>
</div>

<div data-step="1" data-intro="請先輸入姓名">
  <span>姓名</span>
  <input type="text">
</div>

<div data-step="2" data-intro="再輸入EMail">
  <span>Email</span>
  <input type="text">
</div>

<div data-step="3" data-intro="最後按下送出，就完成註冊囉">
  <input type="button" value="送出">
</div>
```

在這邊另外也加上了一個"說明"的按鈕，讓user按下時才會顯示每個步驟的提示。

最後我們在JavaScript為這個按鈕加上事件，並進行提示的步驟

```javascript
document.getElementById('start').addEventListener('click', function() {
  introJs().start();
});
```

就大功告成啦！當我們案下"說明"按鈕後，就會看到以下畫面，提示user操作的步驟

{% asset_img 0.png %}

程式碼DEMO: [https://jsfiddle.net/wellwind/3jq4sw74/](https://jsfiddle.net/wellwind/3jq4sw74/)

是不是很方便啊！

# 進階使用Intro.js

Intro.js也有不少細節可以設定，官方網站上也有詳細的DEMO，以下簡單介紹兩個

# 加上ProgressBar

要加上ProgressBar很簡單，只要在start()之前加上`setOption('showProgress', true)`就可以了

```javascript
introJs()
  .setOption('showProgress', true)
  .start();
```

# 加上提示點

我們可以在想要的element上加入`data-hint`屬性及說明文字

```html
  <button id="start" data-hint="點說明按鈕開始導覽">
    ?說明
  </button>

```

然後用JavaScript啟用它：

```javascript
introJs().addHints();
```

就能在目標上面加入一個明顯的提示點，當user按到這個提示點時，就能看到一個提示訊息囉

# 類似資源

*   [Focusable](http://zzarcon.github.io/focusable/)：不具有像Intro.js的step by step特性，但可以很容易隨時幫助user把焦點放在某個位置上。
*   [BootstrapTour](https://github.com/sorich87/bootstrap-tour)：加上bootstrap風格的，非常具有彈性，但使用上就比較繁瑣一點。