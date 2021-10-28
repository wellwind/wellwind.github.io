---
title: "[前端軍火庫]X-editable - 瀏覽、新增、修改三個願望一次滿足"
date: 2016-12-25 11:11:11
category: "前端軍火庫"
tags:
---
在設計CMS之類的系統時，常常會需要一個表單和一個瀏覽資料的頁面，以新型新增、修改和查詢的工作，不過畫面排版通常會非常類似，只差在表單有額外的表單控制項，而瀏覽頁面就是單純的文字而已，但當需要更新排版時，就需要兩個頁面都同時修改，非常不方便；這時候透過[X-editable](https://vitalets.github.io/x-editable/index.html)，就能夠在瀏覽的頁面同時編輯資料囉

<!-- more -->

# 開始使用X-editable

[X-editable](https://vitalets.github.io/x-editable/index.html)有bootstrap和jQueryUI的版本，以及不使用任何UI Framework，我們可以挑選喜歡的版本來使用，記得也要載入相依的js/css。

接下來我們加入一個包含了X-editable需要的data-* api的link

```html
<a href="#" id="username" data-type="text" data-pk="1" data-title="請輸入文字"
  data-url="https://jsonplaceholder.typicode.com/posts"></a>
```

接著加入一段JavaScript

```javascript
$('#username').editable();
```

就完成啦！這裡我們的link內是沒有文字的，因此會出現紅色的  _`Empty`_  文字，滑鼠點下去就會發現出現一個輸入文字的textbox，輸入文字後再按下旁邊的藍色按鈕，就會幫我們把資料送到後端去囉。

至於後端在哪裡，又是怎麼送的呢？就在link裡面的data-* api啦！接下來我們就介紹一下需要設定的部分：

*  `data-type`：可以選擇X-ditable內建的表單元件，例如我們範例中的`data-type="text"`就是使用一般的textbox，更多可用的元件請參考 [https://vitalets.github.io/x-editable/docs.html#inputs](https://vitalets.github.io/x-editable/docs.html#inputs) 。
*  `data-pk`：拜表資料來源的key值，這個資料會送到後端，我們可以在後端檢查pk的值來決定要更新哪一筆資料。
*  `data-url`：要post的後端網址，範例中的網址是一個假的API服務，讓我們可以有一個虛擬的後端來接資料，但實際上不會有任何作用；因此記得改成自己的後端網址。
*  `data-title`：跳出編輯資料畫面時的標題文字。
*  `data-value`：實際上的內容，也可以直接寫在 tag裡面。
*  `id`或`name`：代表資料的欄位名稱，也會跟著被送到後端去。

以我們一開始的範例來說，就會將以下資料送到後端去

```
name=username&value=aa&pk=1
```

如果我們不指定`data-pk`，那麼在編輯完成後就不會主動送到後端，我們可以透過這個小技巧，來同時達到新增的目的！

# 不使用data-* api

如果不喜歡使用data-* api，我們也可以用JavaScript的方式來指定相關參數，實際上X-editable裡面大多數的元件也還是需要使用JavaScript設定參數的方式來處理，例如一個select(dropdown)，我們可以先給一個單純的HTML

```html
<a href="#" id="sex"></a>
```

接著透過JavaScript設定類型及選項

```javascript
$('#sex').editable({
  type: 'select',
  value: 'M',
  source: [
    {value: 'M', text: 'Male'},
    {value: 'F', text: 'Female'}
  ]
});
```

# 全域參數設定

我們可以透過`$.fn.editable.defaults.xxx = ooo`的方式，來設定一些全域的參數，例如預設編輯是會跳出一個小視窗的模式(popup)，我們希望改為inline的模式，可以加入以下程式：

```javascript
$.fn.editable.defaults.mode = 'inline';
```

或者是沒有資料時預設顯示為`Empty`我們也可以修改成別的文字

```javascript
$.fn.editable.defaults.emptytext = '點我加入資料';
```

更多參數設定可以參考： [https://vitalets.github.io/x-editable/docs.html#editable](https://vitalets.github.io/x-editable/docs.html#editable)

# 自訂新的輸入元件

X-editable已經內件數種常見的編輯元件，如果想要自訂更複雜的元件，可以參考[GitHub上的abstract.js](https://github.com/vitalets/x-editable/blob/master/src/inputs/abstract.js)內容，X-editable的元件皆衍生自這個檔案，檔案內也有詳細的註解；如果需要sample code，則可以參考[address.js](https://github.com/vitalets/x-editable/blob/master/src/inputs-ext/address/address.js)。

不過官方的文件也有解釋X-editable主要是用來處理單一的欄位修改，如果需要到客製化程度高的元件，直接藏一個`<div>`表單，在文字按下去時顯示反而直覺易懂，不一定需要X-editable，至於到底該用什麼方式，就自行依情境而定囉！

今天的DEMO: [https://jsfiddle.net/wellwind/kkk526mk/](https://jsfiddle.net/wellwind/kkk526mk/)