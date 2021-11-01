---
title: "[前端軍火庫]Animate.css - 1秒鐘為你的網站加上動畫特效"
date: 2016-12-04 11:11:11
category: "前端軍火庫"
tags:
---
過去我們要為網站加上動畫特效可能需要寫一大串的JavaScript，隨著web技術越來越發達，在CSS3中也加入了一系列的動畫屬性，以減少程式撰寫的成本；不過還是需要進行不少設定，而[Animate.css](https://daneden.github.io/animate.css/)就是一個幫你把一堆常見的特效打包好的CSS library。

<!-- more -->

# 使用Animate.css

一樣的，你可以使用CDN或NPM來取得Animate.css

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
```

大多數的library都是一樣的步驟，官方的說明文件也很清楚，所以之後就不再介紹前置的設定，以免有灌水嫌疑XD

Animate.css內建了超過70種的動畫效果，要套用特效前必須先在要套用的特效加上````animated````這個class，然後再加上你想要的特效class，例如想要像果凍一樣彈跳的特效，程式碼看起來就會像這樣

```html
<div id="target" class="animated jello">
  <h1>
    Hello World!!
  </h1>
</div>
```

只要用瀏覽器打開你的頁面，立刻就可以看到彈跳的效果囉！

如果希望自行觸發特效，例如按下按鈕之類的話，也可以動態的在事件發生時替你要產生特效的目標加上class

```javascript
  $('#button').click(function(){
    $('#target').addClass('animated jello')
  });
```

不過這樣動畫只會發生一次，如果希望每次事件發生都觸發動畫的話，也可以在特效結束時把這兩個class移除掉：

```javascript
  $('#target').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
  	$('#target').removeClass('animated jello');
  });
```

這麼一來每次按下按鈕就都會觸發特效囉！

以下是今天的程式demo: [https://jsfiddle.net/wellwind/zt72Lbps/](https://jsfiddle.net/wellwind/zt72Lbps/)

關於每種特效想要瀏覽，可以直接上官網看看: [https://daneden.github.io/animate.css/](https://daneden.github.io/animate.css/)

# 類似資源

[Hover.css](http://ianlunn.github.io/Hover/): 著重在滑鼠移到元素上時才會產生的特效。