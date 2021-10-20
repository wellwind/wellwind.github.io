---
title: "[前端軍火庫]jsPDF - 前端直接產生PDF也沒問題！"
date: 2016-12-29 11:11:11
category: "前端軍火庫"
tags:
---
昨天我們介紹了PDF.js這套用來讓前端可以直接瀏覽PDF檔的library，今天我們來介紹一款可以在前端直接產生PDF檔的神奇程式－[jsPDF](https://github.com/MrRio/jsPDF)。

<!-- more -->

# 開始使用jsPDF

要使用jsPDF非常容易，載入js程式後，我們先簡單加入以下程式碼

```javascript
  var doc = new jsPDF();

  doc.text('Hello world!', 10, 10);
  doc.save('helloworld.pdf');
```

就能夠立刻產生一個PDF檔啦！打開看看，就能夠看到我們剛剛使用`doc.text()`產生的**Hello world**的文字，這個PDF檔是透過`doc.save()`產生的。是不是超簡單的阿！

如果需要產生不同的內容如矩形方塊、圓形或設定顏色等等，可以參考官方的文件：[http://rawgit.com/MrRio/jsPDF/master/docs/index.html](http://rawgit.com/MrRio/jsPDF/master/docs/index.html)

# 將HTML轉成PDF

jsPDF也可以html2pdf外掛，輕易的將畫面上的HTML轉成PDF([範例](https://github.com/MrRio/jsPDF/tree/master/examples/html2pdf))，不過目前jsPDF並沒有支援Unicode，也就是說如果是中文的話可能會無法使用，目前能做到的只有透過[html2canvas](https://github.com/MrRio/jsPDF/tree/master/libs/html2canvas)將HTML轉成canvas後，再將canvas轉為圖片，最後在加到jsPDF中。

```javascript
  var doc = new jsPDF();
  html2canvas(document.body, {
    onrendered: function(canvas) {
      var image = canvas.toDataURL("image/png");
      doc.addImage(image, 'JPEG', 0, 0, canvas.width, canvas.height);
      doc.save('test.pdf');
    }
  });
```

程式碼DEMO：[https://jsfiddle.net/wellwind/wpxnhpfs/](https://jsfiddle.net/wellwind/wpxnhpfs/)

雖然目前jsPDF還不支援Unicode，但先學起來，說不定哪天就可以用到囉！