---
title: "[前端軍火庫]toastr.js - 美化你的通知訊息"
date: 2016-12-12 11:11:11
category: "前端軍火庫"
tags:
---
一般來說在前端要跳出通知訊息，最簡單的方式莫過於加個alert了，但使用alert其實對於UX來說並不是件好事，因為它會影響到user的操作行為，而且不同瀏覽器的顯示方式可能會有所不同，更不用說有些瀏覽器還可以在alert重複出現時，選擇把它關掉不顯示，當然這也是為了避免同樣的緒息一直出現變成畫面根本無法使用，但也讓alert變成了不穩定的未爆彈；因此像是[toastr.js](https://github.com/CodeSeven/toastr)這類的library就可以幫助你打造美觀的提示訊息，同時也不用擔心影響到user的畫面操作。

<!-- more -->

# 開始使用toastr.js

由於[toastr.js](https://github.com/CodeSeven/toastr)相依於jquery，因此使用前記得也要先加入jquery，接著加入toastr.js相關的css/js後，我們可以簡單的加入以下程式碼

```javascript
toastr.success("鐵人賽~大~~平~~台！");
```

就可以看到畫面上出現綠色的提示訊息啦！

關於`success`的部分可以選擇：`success`、`info`、`warning`和`error`，而提示訊息的部分可以使用HTML，另外也可加入第2個參數當作提示訊息的標題，如下：

```javascript
toastr.info('<h1>鐵人賽</h1><p>大~~平~~台！</p>', '我只是DEMO');
```

就可以看到如下圖的結果啦！

{% asset_img 0.png %}

程式碼DEMO：[https://jsfiddle.net/wellwind/1958vL5u/](https://jsfiddle.net/wellwind/1958vL5u/)

# toastr.js參數設定

我們可以透過toastr.options來設定toastr.js的參數，最簡單的方式是到[toastr.js demo](http://codeseven.github.io/toastr/demo.html)頁面，設定你要的參數後，按下Show Toast就可以看到相關的程式碼，以下簡單介紹幾個設定值：

*   toastr.options.positionClass: 用來指定toastr顯示的位置，有八個位置可以選，分別在畫面的左上、中上、右上、左邊、右邊、左下、中下和右下。
*   toastr.options.closeButton: 是否要為提示訊息加入一個關閉的按鈕
*   toastr.options.timeout: 訊息要顯示多久才會消失
*   toastr.options.progressBar: 搭配timeout使用，會出現一個倒數的進度條，在timeout時間到時消失

# toastr.js相關事件

toastr.js包含了4個事件可以使用

*   toastr.options.onShown: 顯示時的事件
*   toastr.options.onHidden: 隱藏時的事件
*   toastr.options.onclick: 滑鼠在提示訊息上面按下時的事件
*   toastr.options.onCloseClick: 滑鼠按下提示訊息的關閉按鈕時的事件

透過toastr，不僅可以提示訊息給user，也不用擔心破壞UX囉！

# 類似資源

*   [HubSpot Messenger](https://github.com/HubSpot/messenger)：比起toastr.js配色比較搭配bootstrap，這款屬於比較深色的樣式，喜歡深色風格的朋友可以玩玩看。