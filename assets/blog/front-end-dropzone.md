---
title: "[前端軍火庫]Dropzone.js - 上傳檔案的好幫手"
date: 2016-12-17 11:11:11
category: "前端軍火庫"
tags:
---
上傳檔案是各種系統遇到機率都很高的一個功能，傳統要讓使用者上傳檔案，最簡單的方法就是加個 ` <input type="file"> ` ，但呈現的結果並不是很好看，雖然可以透過CSS來調整外觀，但整體還是有受限的感覺，使用上也稍微不太方便；而今天要介紹的[Dropzone.js](http://www.dropzonejs.com/)可以幫助我們使用更加直覺簡單的方式，來完成上傳檔案的功能。

<!-- more -->

# 關於Dropzone.js

[Dropzone.js](http://www.dropzonejs.com/)是一款美觀強大的檔案上傳library，可以讓我們系統在處理**上傳檔案**這個功能的操作上更加簡單明瞭，它具有幾個特色

*   支援多檔案上傳
*   可使用drag & drop的方式上傳檔案，範圍大也不容易拉到錯的地方
*   如果上傳的是圖片，可顯示圖片預覽
*   功能強大但檔案很小，大約75k左右而已
*   純JavaScript，不相依於jquery等其他library
*   容易客製化

# 開始使用Dropzone.js

要開始使用Dropzone.js非常簡單，載入basic.css / dropzone.css / dropzone.js之後，在頁面上加一個表單，並給一個`dropzone`的class就好

```html
<form action="/file-upload" id="form1" class="dropzone"></form>
```

就可以看到一個標準的拖拉區塊可以上傳檔案囉

{% asset_img 0.png %}

至於server端該如何處理上傳的檔案，則依後端的程式語言和業務邏輯有不同的實作，但只需要把上面的程式碼當程式已下程式碼的ajax + 美化版本就好了

```html
<form action="/file-upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

官方網站也提出一些後端操作的指引文件可以參考

[http://www.dropzonejs.com/#server-side-implementation](http://www.dropzonejs.com/#server-side-implementation)

# 進階使用Dropzone.js

根據Dropzone.js的[Configuration文件](http://www.dropzonejs.com/#configuration)，例如預設Dropzone會加入`<input type="file" name="file" />`，若希望更改`name="file"`這塊(假設已經有完成的後端?)，則可以在JavaScript中設定`paraName`：

```javascript
Dropzone.options.form1 = {
  paramName: "upload"
};
```

預設的Dropzone會出現"Drop files here to upload"，如果希望更改這裡的文字，則可以設定`dictDefaultMessage`

```javascript
Dropzone.options.form1 = {
  dictDefaultMessage: "把檔案拉到這裡就可以上傳"
};
```

{% asset_img 1.png %}

除此之外Dropzone.js也有[許多事件](http://www.dropzonejs.com/#events)可以使用，例如我們可以透過`addedfile`，來判斷當user把檔案拉到我們的上傳檔案區塊時要做些什麼事情

```javascript
Dropzone.options.form1 = {
  init: function() {
    this.on("addedfile", function(file) { console.log(file); });
  }
};
```

# 類似資源:

*   [FineUploader](http://fineuploader.com/)：功能比Dropzone.js更加強大，甚至能直接支援上傳到Amazon S3或Azure Blob Storage，當然相對的設定也稍微比較複雜。
*   [jQueryFileUpload](https://blueimp.github.io/jQuery-File-Upload/)：屬於jQuery的外掛，使用上也不算太複雜。
*   [Bootstrap File Input](http://plugins.krajee.com/file-input)：相依於Bootstrap及jQuery，功能不少，提供的DEMO也相當多元，對於已經使用bootstrap的開發人員來說可以達到一致的UI效果。
*   [Bootstrap Filestyle](http://markusslima.github.io/bootstrap-filestyle/)：基本上不算是上傳用的library，主要是用來美化原本的上傳按鈕，對於只需要基本的上傳按鈕，卻又覺得上傳按鈕不好看(或不同作業系統UI不一致)時，做為美化使用。