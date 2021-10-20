---
title: "[前端軍火庫]FontAwesome - 最受歡迎的Icon Font - 超豐富圖示字型"
date: 2016-12-11 11:11:11
category: "前端軍火庫"
tags:
---
[FontAwesome](http://fontawesome.io/)可以說是目前最受歡迎的Icon Font(也就是把icon圖示放到字體使用) css library，具有豐富的圖示(675+)可用，也有許多實用的API，因此在前端界可以說是無人不知無人不曉(什麼？你不知道？那你現在可以跟上潮流了XD)。在最近的FontAwesome5的募資甚至突破了100萬美金！由此可見其巨大的影響力。今天就來簡單介紹一下FontAwesome吧。

<!-- more -->

# Why Icon Font

首先，先談談為何要使用FontAwesome這類的Icon Font，個人覺得有兩個主要的好處：

1.  避免管理一堆圖片檔
2.  使用字體的設計方式，可以自由/無限的放大也不會失真
3.  同上，由於使用字體的方式，也可以很輕鬆的改變icon的顏色

當然，也不是沒有缺點，最主要的一個缺點就是我們可能用不到這麼多的icons，卻必須載入整個字體檔才可以使用，無形中造成頻寬的浪費。

不過以現代的頻寬來說這不算是個大問題，字體檔+CSS檔通常也不會太大，加上可以搭配CDN使用，因此大部分的icon需求以Icon Font來解決還是非常好的！

# 使用FontAwesome

要使用FontAwesome也非常簡單，只要載入相關的CSS檔後，加入`<i class="fa fa-*"></i>`就可以了，至於`fa-*`的部分可以參考[FontAwesome的icon清單](http://fontawesome.io/icons/)，圖示的名稱也非常語意化，例如我需要一個藍芽的圖示，可以使用以下HTML

```
<i class="fa fa-bluetooth"></i>
```

就可以在頁面上加入藍芽的圖示了，超簡單的啦！

# 進階功能

除了基本的使用icon以外，FontAwesome也提供了不少helper class，讓你的icon使用上更得心應手，以下介紹幾個常用的helper class

# 放大圖示

我們可以使用`fa-lg`、`fa-2x`、`fa-3x`、`fa-4x`、`fa-5x`來直接讓icon放到33%到500%

```html
<div><i class="fa fa-camera-retro"></i> 原始大小</div>
<div><i class="fa fa-camera-retro fa-lg"></i> 33%</div>
<div><i class="fa fa-camera-retro fa-2x"></i> fa-2x</div>
<div><i class="fa fa-camera-retro fa-3x"></i> fa-3x</div>
<div><i class="fa fa-camera-retro fa-4x"></i> fa-4x</div>
<div><i class="fa fa-camera-retro fa-5x"></i> fa-5x</div>
```

{% asset_img 0.png %}

# 固定寬度

FontAwesome裡的每個icon預設寬度都不一樣，因此若使用以下HTML

```html
<div><i class="fa fa-tree"></i> Tree</div>
<div><i class="fa fa-tags"></i> Tags</div>
<div><i class="fa fa-spoon"></i> Spoon</div>
<div><i class="fa fa-wifi"></i> WiFi</div>
```

會發現到因為每個icon寬度不一樣的關係，導致希望以清單的方式顯示時很不美觀，這時候可以加上`fa-fw`這個class，就可以讓icon的寬度都一致囉

```html
<div><i class="fa fa-fw fa-tree"></i> Tree</div>
<div><i class="fa fa-fw fa-tags"></i> Tags</div>
<div><i class="fa fa-fw fa-spoon"></i> Spoon</div>
<div><i class="fa fa-fw fa-wifi"></i> WiFi</div>
```

{% asset_img 1.png %}

# 旋轉動畫效果

旋轉動畫效果很適合當作loading的圖示使用，我們可以加上`fa-spin`來讓icon旋轉，注意旋轉效果只有`fa-spinner`、`fa-circle-o-notch`、`fa-refres`和`fa-cog`有效。

```html
  <div><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
  <div><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div>
  <div><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>
  <div><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
```

另外也可以使用`fa-pulse`，讓icon分成八個影格旋轉。

{% asset_img 2.gif %}

# 堆疊效果

我們可以透過`fa-stack`來發揮無限創意將icons堆疊起來變成另外一種樣式的icon，例如把相機跟危險符號堆疊起來，再加上點顏色調整，看起來就像禁止拍照的icon了！

```html
<span class="fa-stack fa-lg">
  <i class="fa fa-camera fa-stack-1x"></i>
  <i class="fa fa-ban fa-stack-2x text-danger"></i>
</span>
```

# 其他...

其他hlper class以及更多詳細的範例都可以在[官方的examples](http://fontawesome.io/examples/)中看到。

今天的程式碼: [https://jsfiddle.net/wellwind/2qc8zyjq/](https://jsfiddle.net/wellwind/2qc8zyjq/)

透過FontAwesome，在需要icons的時候就不用到處請人畫啦！(除非找不到滿意的icon)

# 類似資源

*   [WeatherIcons](https://erikflowers.github.io/weather-icons/)：一款專門以天氣相關的icon為訴求所產生的library，包含了222+種icon，除了天氣icons以外，還有時鐘、方位等等icons可以使用。
*   [IonIcons](http://ionicons.com/)：從知名的App框架Ionic擷取出來的icons，也有數百種的icons可以選擇，由於本來就是為了打造mobile ui而製作的icon，因此非常適合拿來製作web ui。
*   [Themify Icons](https://themify.me/themify-icons)：具有320+種icon可以使用，icon的線條都比較細，喜歡這種風格icon的可以參考看看。
*   [Material Icons](https://material.io/icons/): Google官方遵循Material Design所設計出來的icons，喜歡Material Design風格的朋友可以使用款icon font；也有提供svg和png格式下載。若只需要特定幾個icons，還可以節省點空間。