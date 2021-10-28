---
title: "[前端軍火庫]highlight.js - 前端也能讓程式碼highlight顯示"
date: 2016-12-09 11:11:11
category: "前端軍火庫"
tags:
---
[highlight.js](https://highlightjs.org/download/)是一款負責讓程式碼highlight的JavaScript library，5 支援168種程式語言，而且有77種樣式可以選擇。雖然看起來很豐富，但老實說它的應用範圍比較小，只能用在像是IT幫幫忙、GitHub這類的技術社群上，或是使用的blog不支援highlight時想要自己掛上highlight功能等等，才會用到這個library。不過不管現在是否用得到，先學起來當收藏也是不錯的！

<!-- more -->

# 使用highlight.js

在[highlight上下載頁面](https://highlightjs.org/download/)中，我們可以勾選要讓自己的系統支援highlight的程式語言；下載後，再載入相關的js檔，以及你想要使用的樣式，樣式的CSS檔放在styles資料夾中，只要載入需要的就可以了。

接著把要輸入的程式碼包在`<pre><code>`標籤裡面，例如下面是一段簡單的JavaScript程式碼想要進行highlight

```html
<pre>
  <code>
    for(var i = 1; i <= 10; ++i){
      console.log(i);
    }
  </code> 
</pre>
```

接著加入以下javascript

```javascript
hljs.initHighlightingOnLoad();
```

就可以看到highlight效果啦！以下是程式碼的DEMO

[https://jsfiddle.net/wellwind/kp556nga/](https://jsfiddle.net/wellwind/kp556nga/)

highlight.js會自動偵測`<pre><code>`標籤內的文字是什麼程式語言，但不一定完全正確，我們也可以在`<code>`標籤中加入`lang-*`或`language-*`來指定要用哪種程式語言進行處理，例如上述`<code>`可以改為`<code class="lang-javascript">`，那麼highlight.js就一定會用JavaScript的邏輯來處理。

# 進階功能

highlight.js也提供了[多個API](http://highlightjs.readthedocs.io/en/latest/api.html)可以讓你從更細微的地方操作highlight.js，例如我們可以透過在[configure()](http://highlightjs.readthedocs.io/en/latest/api.html#configure-options)中設定tabReplace來決定針對tab要如何處理

```javascript
hljs.configure({
  tabReplace: '    ', // 使用4個空白
});
```

或是使用[listLanguages()](http://highlightjs.readthedocs.io/en/latest/api.html#listlanguages)來取得目前支援的程式語言有哪些。  
你也可以遵循[Language definition guide](http://highlightjs.readthedocs.io/en/latest/language-guide.html)的文件，針對其他為支援的程式語言設計如何highlight，並透過[registerLanguage()](http://highlightjs.readthedocs.io/en/latest/api.html#registerlanguage-name-language)來註冊新的程式語言highlight邏輯。

以上就是簡單的highlight.js介紹，把它蒐藏起來，說不定哪天就會用到囉！