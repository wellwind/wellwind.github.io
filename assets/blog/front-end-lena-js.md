---
title: "[前端軍火庫]Lena.js - 為相片加上多種濾鏡"
date: 2018-03-20 11:55:31
category: 前端軍火庫
tags:
  - Lena.js
  - FrontEnd
  - image filter
---

[Lena.js](https://github.com/davidsonfellipe/lena.js)是一個簡單易用的影像處理類別庫，內建了一些常見的濾鏡，可以用來補齊CSS濾鏡的不足，又不用擔心使用上太過困難，只要簡單幾行程式碼就可以套用濾鏡了。今天就來簡單玩玩Lena.js吧！

<!-- more -->

# 開始使用 Lena.js

Lena支援以下多種濾鏡：

-   gaussian
-   grayscale
-   highpass
-   invert
-   laplacian
-   prewitt
-   rgb
-   roberts
-   saturation
-   sepia
-   sharpen
-   sobel
-   thresholding
-   lowpass 3x3
-   lowpass 5x5

Lenajs是一個簡單的JS檔，我們可以透過npm安裝，也可以透過[rawgit](https://rawgit.com/)把GitHub上的原始檔轉為CDN，在網頁中引入後，我們會需要兩個元素，一個是圖片的來源，一個是要套用濾鏡的canvas元素

```html
<!-- 原始圖片的來源 -->
<img id="original-image" src="..." />
<!-- 之後會透過lenajs將圖片轉換到這裡 -->
<canvas id="filtered-image"></canvas>
```

接下來就是套用濾鏡啦！

簡單套個`invert`看看

```javascript
const originalImage = document.getElementById("original-image");
const filteredImageCanvas = document.getElementById("filtered-image");

LenaJS.filterImage(filteredImageCanvas, LenaJS.invert, originalImage);
```

上面程式中，我們使用`LenaJS.filterImage()`來進行濾鏡的套用，至於要套用什麼濾鏡呢，就是`LenaJS.invert`，完成後，就來看看結果吧！

原來的圖：

{% asset_img 01.jpg %}

套用濾鏡後

{% asset_img 02.png %}

是不是非常簡單啊！只有三行程式碼，而且真正套用的邏輯只有一行，就完成濾鏡套用囉。

# 套用多個濾鏡

Lena.js也能一次套用多個濾鏡，來達到更多不同的風格，例如我們想要達成手繪風格，可以組合`highpass`、`grayscale`和`invert`，來達到手繪風格的濾鏡效果：

```javascript
const originalImage = document.getElementById("original-image");
const filteredImageCanvas = document.getElementById("filtered-image");

LenaJS.filterImage(filteredImageCanvas, LenaJS.highpass, originalImage);
  
LenaJS.redrawCanvas(filteredImageCanvas, LenaJS.grayscale);

LenaJS.redrawCanvas(filteredImageCanvas, LenaJS.invert);
```

再使用`LenaJS.filterImage()`把圖片濾鏡效果轉換到canvas上後，我們就可以使用`LenaJS.redrawCanvas()`直接替canvas套用濾鏡效果。

最終結果如下：

{% asset_img 03.png %}

# 類似資源

-   [OpenCV.js](https://docs.opencv.org/3.3.1/d5/d10/tutorial_js_root.html) - OpenCV是大名鼎鼎的開源電腦視覺(Computer Vision)類別庫，而OpenCV.js就是它的JavaScript實作版本，雖然使用上複雜得多，但也相對可以針對影像處理更多複雜的問題。
