---
title: "[前端軍火庫]jQuery Knob - 酷炫的旋鈕式數字選擇器"
date: 2016-12-27 11:11:11
category: "前端軍火庫"
tags:
---
[jQuery Knob](https://github.com/aterrien/jQuery-Knob)是一款讓我們能夠用**旋鈕**這種與眾不同的方式輸入數字的jQuery外掛，除了可以確保user輸入的一定是數字以外，也可以簡化user選擇/輸入數字的過程。

<!-- more -->

# 開始使用jQuery Knob

載入jQuery與jQuery Knob之後，首先我們先加入一個input

```html
<input type="text" value="75" class="dial">
```

接著加入一個簡單的JavaScript

```javascript
$('.dial').knob();
```

就可以看到我們加入的input變成旋鈕式的選擇器啦！要改變數值，我們可以按下數字直接編輯、用滑鼠拖曳外層的旋鈕、或是直接使用滑鼠滾輪調整，是不是很方便啊！

# 設定參數

jQuery Knob也有很多參數可以設定，這些參數也都有對應的data-* api，例如以下兩種方式結果是一樣的

使用data-* api

```html
<input type="text" class="dial" data-min="-50" data-max="50">
```

使用JavaScript

```javascript
$('.dial').knob({
    'min':-50,
    'max':50
});
```

# 動態設定數值

如果需要透過程式調整數值，光是改變text的value是不夠的，還需要去觸發trigger，讓旋鈕的部分也更新：

```javascript
  $('.dial').val(27).trigger('change');
```

# 事件處理

jQuery Knob也有幾個事件可以使用，例如使用`release`可以在滑鼠**選擇完**數值後決定要做的事情，也可以透過`change`只要數值一變動就觸發

```javascript
  $('.dial').knob({
    'release' : function (v) { /*make something*/ }
  });
```

有了基本的概念後，就讓我們做幾個簡單的DEMO吧

# DEMO1: 時鐘

{% asset_img 0.gif %}

HTML

```html
<div class="row">
  <div class="col-xs-4 text-center">
    時
  </div>
  <div class="col-xs-4 text-center">
    分
  </div>
  <div class="col-xs-4 text-center">
    秒
  </div>
  <div class="col-xs-4 text-center">
    <input type="text" id="hour" class="dial" data-min="0" data-max="11" data-width="100%" data-readOnly="true">
  </div>
  <div class="col-xs-4 text-center">
    <input type="text" id="min" class="dial" data-min="1" data-max="59" data-width="100%" data-readOnly="true">
  </div>
  <div class="col-xs-4 text-center">
    <input type="text" id="sec" class="dial" data-min="1" data-max="59" data-width="100%" data-readOnly="true">
  </div>
</div>
```

JavaScript

```javascript
$('.dial').knob();

function setTime() {
  $('#hour').val(moment().get('hour') - 12).trigger('change');;
  $('#min').val(moment().get('minute')).trigger('change');;
  $('#sec').val(moment().get('second')).trigger('change');;
}

setInterval(function() {
  setTime();
}, 1000);

setTime();
```

# DEMO2: 調整畫面明亮度

{% asset_img 1.gif %}

HTML

```html
<div class="row">
  <div class="col-xs-12">
    調整明亮度
  </div>
  <div class="col-xs-12">
    <input type="text" id="setBrightness" data-min="0" data-max="100" value="100">
  </div>
</div>
```

JavaScript

```javascript
function setBrightness(value) {
    var brightness = parseInt(255 * value / 100);
    var textBrightness = Math.abs(255 - brightness);
    $('body').css('background-color', `rgb(${brightness}, ${brightness}, ${brightness})`);
    $('body').css('color', `rgb(${textBrightness}, ${textBrightness}, ${textBrightness})`);
}

$('#setBrightness').knob({
  'change': function(value) {
		setBrightness(value);
  },
  'release': function(value) {
  	setBrightness(value);
  }
});
```

是不是很有趣啊！只要發揮點創意，jQuery Knob可以用在各種有趣的地方上！！