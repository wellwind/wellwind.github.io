---
title: "[前端軍火庫]Switchery - 打造iOS風格的checkbox"
date: 2016-12-24 11:11:11
category: "前端軍火庫"
tags:
---
[Switchery](http://abpetkov.github.io/switchery/)是一款具有iOS風格的開關library，透過Switchery我們可以快速的把一般的checkbox包裝成具有iOS開關的風格，在一些需要用開/關來表示狀態的情境能比使用checkbox更加直覺。

<!-- more -->

# 開始使用Switchery

載入相關的css/js後，在我們直接加入一個checkbox

```html
<input type="checkbox" id="switcher" />
```

接著加入以下JavaScript

```javascript
new Switchery(document.getElementById('switcher'));
```

就可以把我們指定的checkbox轉換成iOS的開關樣式啦！

# Switchery進階參數

若需要設定Switchery的樣式，則可以加上一些其他參數，以下是這些參數的名稱及預設值

```javascript
var switcheryOptions = { 
  color: '#64bd63', // 當checked時的背景顏色
  secondaryColor: '#dfdfdf', // unchecked時的背景顏色
  jackColor: '#fff', // checked時的按鈕顏色
  jackSecondaryColor: null, // uncheck時的按鈕顏色
  className: 'switchery', // class名稱
  disabled: false, // 是否設為disabled
  disabledOpacity: 0.5, // 當設為disabled時的透明度
  speed: '0.1s', // 開關切換的速度
  size: 'default' // 開關大小(small, default, large)
};

new Switchery(document.getElementById('switcher'), switcheryOptions);
```

例如我們可以透過以下程式碼建立一個黑白的開關

```javascript
var switcheryOptions2 = { 
  color: '#fff',
  secondaryColor: '#000',
  jackColor: '#000',
  jackSecondaryColor: '#fff'
};

new Switchery(document.getElementById('switcher2'), switcheryOptions2);
```

{% asset_img 0.png %}

# 取得switchery狀態

Switchery會把原來的checkbox隱藏起來，並加上開關的按鈕在畫面上，當開關狀態變更時，會同步更新回原來的checkbox，因此要取得開關狀態，只需要取得原來的checkbox狀態即可，例如以下程式碼即可即時取得所有開關(也就是checkbox)的狀態：

```javascript
$('input[type=checkbox]').change(function(){
	console.log(this.checked);
});
```

程式碼DEMO: [https://jsfiddle.net/wellwind/qujh9h43/](https://jsfiddle.net/wellwind/qujh9h43/)