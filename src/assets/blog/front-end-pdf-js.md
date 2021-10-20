---
title: "[前端軍火庫]PDF.js - 前端也能輕鬆顯示PDF"
date: 2016-12-28 11:11:11
category: "前端軍火庫"
tags:
---
如果要說有一個放諸四海皆準的通用文件格式，那麼想當然一定就是PDF了，雖然PDF是一個標準的文件規格，但要瀏覽PDF檔還是需要透過安裝軟體來顯示的，而今天要介紹的[PDF.js](https://mozilla.github.io/pdf.js/)就是一款可讓我們直接在web上顯示PDF檔的JavaScrtipt library！

<!-- more -->

# 開始使用PDF.js

首先載入js檔後，先加入一個pdf container，之後我們會把PDF.js產生canvas都放在這裡面

```html
<div id="pdf-container"></div>
```

接著加入以下JavaScript

```javascript
PDFJS.getDocument('https://cdn.rawgit.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf').then(function(pdf) {
  for (var pageNum = 1; pageNum < pdf.numPages; ++pageNum) {
    pdf.getPage(pageNum).then(function(page) {
      // you can now use *page* here

      var scale = 1.5;
      var viewport = page.getViewport(1);

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);

      document.getElementById('pdf-container').appendChild(canvas);
    });
  }
})
```

程式步驟解說：

1.  使用`PDFJS.getDocument('xxx.p df')`來取得要顯示PDF的檔案
2.  透過`pdf.numPages`來取得總頁數
3.  透過`pdf.getPage(pageNum)`來取得每一個PDF頁面
4.  利用`page.render()`將PDF內容產生到canvas上
5.  最後再把canvas加入`pdf-container`中

就完成把所有PDF頁面顯示出來的動作啦！

{% note important %}  
由於PDF.js使用非同步Promise處理PDF資料，因此上述程式碼可能不會照正確的頁碼排序，但這裡只做DEMO使用，為了簡化問題，因此將這部分暫時忽略。實務上則需要額外處理這部分的問題。  
{% endnote %}  

程式碼DEMO：[https://jsfiddle.net/wellwind/zrq68aLz/](https://jsfiddle.net/wellwind/zrq68aLz/)

# 更完整的PDF顯示器

PDF.js還有一個更完整的顯示器畫面，甚至可以把PDF內容轉換成HTML顯示在頁面上，還可以放大縮小列印等等，非常的完整，有興趣的話可以到[PDF.js的web目錄](https://github.com/mozilla/pdf.js/tree/master/web)看看，也可以直接拿到自己的程式裡面使用，只需要修改viewer.js裡的`DEFAULT_URL`就可以產生不同的PDF檔啦！