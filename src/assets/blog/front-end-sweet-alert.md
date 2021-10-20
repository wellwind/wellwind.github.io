---
title: "[前端軍火庫]SweetAlert - 變化萬千的Dialog library"
date: 2016-12-13 11:11:11
category: "前端軍火庫"
tags:
---
在上一篇文章我們介紹了toastr.js這類用來取代 ` alert ` 並達到更好UX目的標notify library，接下來要介紹的是比起notify更具有互動效果的dialog library，也就是透過dialog的方式，來讓跟user的互動有加分的效果；今天我們主要要介紹的是[SweetAlert](http://t4t5.github.io/sweetalert/)這款功能強大、美觀又容易使用的dialog library。

<!-- more -->

# 使用SweetAlert

載入[SweetAlert](http://t4t5.github.io/sweetalert/)相關的css/js後，要使用SweetAlert非常簡單，呼叫`sweetAlert()`這個function在帶一個訊息進去當作參數就好了。

```javascript
sweetAlert('Hello World!');
```

就會看到一個帶有自訂訊息的dialog啦！結果如下圖:

{% asset_img 0.png %}

另外也可以使用比較短的名稱`swal()`

```javascript
swal('Hello World!');
```

# 加入dialog標題

其實SweetAlert的第一個參數就是標題，因此要加入dialog標題，則是第一個參數是標題、第二個參數才是內容

```javascript
swal('Title...', 'Hello World!');
```

# 設定dialog類型

SweetAlert預設有四種dialog類型，分別是`warning`，`error`，`success`和`info`，可以放在第三個參數，例如一個success類型的dialog

```javascript
swal('Title...', 'Hello World!', 'success');
```

可以看到如下圖，dialog多出成功的圖示了！

{% asset_img 1.png %}

另外還有一種類型是`input`，可以讓我們在dialog中輸入文字。

# 更多參數設定

SweetAlert有很多參數可以設定，比起放入3個字串當作參數，我們可以直接加入一個物件當作參數，讓設定更具有彈性，例如以下兩段JavaScript的結果完全一樣

```javascript
// 以下兩段JavaScript結果完全一樣

swal('Title...', 'Hello World!', 'success');

swal({
  title: 'Title...',
  text: 'Hello World!',
  type: 'success'
});
```

若第一個參數為物件，則第二個參數代表的則是要結束dialog時的callback function。

```javascript
swal({
  title: 'Title...',
  text: 'Hello World!',
  type: 'success'
}, function() {
  console.log('bye');
});
```

更多的參數可以到SweetAlert頁面下方觀看，有非常多彈性的選項，這邊在以上一段提到的`input`做一個簡單的例子。

```javascript
swal({
  title: '算術題',
  text: '請問1+1等於多少?',
  type: 'input',
  inputPlaceholder: '請輸入答案',
  showCancelButton: true,
  confirmButtonText: '作答',
  cencelButton: '取消',
  closeOnConfirm: false,
  closeOnCancel: false,
}, function(answer) {
  if (!answer) {
    swal({
      title: '取消',
      text: '這麼簡單的題目，你也不回答嗎？！',
      type: 'warning'
    });
  } else {
    if (+answer === 2) {
      swal({
        title: '答對啦！',
        text: '你真是天才！',
        type: 'success'
      });
    } else {
      swal({
        title: '答錯囉！',
        text: '再想想看，很簡單的！',
        type: 'error'
      });
    }
  }
});
```

{% asset_img 2.gif %}

程式碼DEMO: [https://jsfiddle.net/wellwind/fxh1vam6/](https://jsfiddle.net/wellwind/fxh1vam6/)

上面的程式碼中，我們設定了dialog的類型為`input`並設定預設值，還有顯示取消按鈕以及按鈕的文字內容，並且設定按鈕按下時不要立刻關閉dialog，接著在第二個callback參數中檢查輸入內容，依照是否取消及答案是否正確來決定回復的結果。可以看到SweetAlert可以設定的參數真的是不少啊！

# 使用themes

SweetAlert也內建提供了facebook、google及twitter的[themes](https://github.com/t4t5/sweetalert/tree/master/themes)，只要載入相關的css檔，即可看到與社群網站類似的style。

# 類似資源

*   [Bootbox.js](http://bootboxjs.com/)：BootBox.js是一款以bootstrap的modal(也就是dialog)為基礎設計出來的library，可以讓你省去使用bootstrap modal前要加入一堆HTML程式碼的麻煩
*   [Vex](https://github.com/hubspot/vex)：Vex是一款很炫麗的dialog library，可以一次開多個dialog，彈性也很高，且檔案只有約5.5kb。
*   [SweetAlert for Bootstrap](https://lipis.github.io/bootstrap-sweetalert/)：SweetAlert for Bootstrap把原來的SweetAlert加上了更符合bootstrap配色的樣式，若本來就有在使用bootstrap的話，非常適合搭配使用。
*   [ngSweetAlert](https://github.com/oitozero/ngSweetAlert)：SweetAlert的AngularJs版本。