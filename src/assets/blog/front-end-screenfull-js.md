---
title: "[前端軍火庫]screenfull.js - 全螢幕顯示就是這麼簡單"
date: 2016-12-20 11:11:11
category: "前端軍火庫"
tags:
---
全螢幕API(Fullscreen API)是JavaScript用來讓瀏覽器支援全螢幕的一種方式，透過Fullscreen API我們可以讓畫面可以一次呈現更多的資料，或是專注在某個影片或圖片上面等等，然後目前樓覽器的支援程度不一，因此要單純使用JavaScript的Fullscreen API，會變得複雜許多，而今天要介紹的[screenfull.js](https://github.com/sindresorhus/screenfull.js)，就是用來減少Fullscreen API在不同瀏覽器之間實作差異的library。

<!-- more -->

關於瀏覽器對screenfull.js的支援，可以參考[Can I use...](http://caniuse.com/#feat=fullscreen)

{% asset_img 0.png %}

# 開始使用screenfull.js

先來看看如果不使用screenfull.js，要讓畫面全螢幕的話，程式碼大概會像這樣子

```javascript
document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
}

if (document.fullscreenEnabled) {
    requestFullscreen(document.documentElement);
}
```

我們必須檢查目前瀏覽器是否支援Fullscreen API，並針對不同瀏覽器呼叫不同的方法，而當載入screenfull.js，程式碼就簡單多了：

```javascript
if (screenfull.enabled) {
    screenfull.request();
}
```

只需要使用`screenfull.enabled`檢查是否支援Fullscreen API，然後再使用`screenfull.request()`呼叫即可，超簡單的啦！

# 對某個element使用全螢幕

如果只需要針對畫面上的某個element進行全螢幕顯示的話，也很簡單，在`screenfull.request()`參數中加入要全螢幕顯示的目標就可以了

```javascript
if (screenfull.enabled) {
  screenfull.request(document.getElementById('image'));
}
```

# 取消全螢幕顯示

基本上瀏覽器都支援直接按`esc`來取消全螢幕，如果希望在程式中取消，只要呼叫`screenfull.exit()`即可

```javascript
if (screenfull.enabled) {
  screenfull.exit();
}
```

程式碼DEMO：[https://jsfiddle.net/wellwind/w2x3gtcy/](https://jsfiddle.net/wellwind/w2x3gtcy/)

screenfull.js還有一些其他功能如toogle和事件管理等等，也很容易使用，就自行看文件吧！

有了screenfull.js，要實現瀏覽器的全螢幕變得超簡單的呢！