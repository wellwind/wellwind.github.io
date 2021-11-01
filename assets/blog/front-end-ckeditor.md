---
title: "[前端軍火庫]CKEditor - 最好用的Web版文字編輯器"
date: 2016-12-07 11:11:11
category: "前端軍火庫"
tags:
    - CKEditor
---
在開發前端的系統時，CMS(內容管理系統)可以說是非常常見的需求，像是系統公告、商品內容管理或是部落格等等；而一個好用的文字編輯器可以說是其中非常重要的核心功能！除非你能說服你的user都自己手刻HTML然後貼到一般的文字區塊裡面，否則編輯器是一定需要的。而CKEditor可以說是目前功能最完善的文字編輯器了，今天就來簡單介紹一下CKEditor吧！

<!-- more -->

# 關於CKEditor

[CKEditor](http://ckeditor.com/)是一款歷史悠久、功能完整、擴充性強卻簡單易用的文字編輯器，在GitHub上也有超過3000+個stars，可以說是只要有文字編輯器的需求，CKEditor絕對會是優先選擇。個人覺得它具有以下幾個很重要的特色：

*   容易使用：在沒有特別需求的情況下，CKEditor的使用可以說是超簡單的，稍後會簡單介紹。
*   支援多語系：CKEditor支援超過60國的語系，基本上不用擔心語系的問題。
*   產出的HTML非常乾淨：許多文字編輯器都有著共通的問題，就是產出的HTML容易變得很雜亂，而CKEditor產出的HTML可讀性一般都很高，甚至可以自訂產出的規則。
*   可客製化：我們可以非常容易的調整CKEditor的skin、toolbar等，讓它更加符合需要。
*   外掛豐富：由於是老牌文字編輯器，相關的外掛自然超豐富的，透過這些外掛，要應付更奇耙的需求也不一定是件麻煩事了。
*   其他：歡迎直接到網頁上去看看 [http://ckeditor.com/features](http://ckeditor.com/features) 。

# 開始使用CKEditor

雖然說CKEditor功能完善且非常具有彈性，但在一般需求使用上卻是簡單到一個不行，載入CKEditor的js檔後，我們需要一個帶有name的teaxtarea

```html
<textarea name="editorDemo"></textarea>
```

然後JavaScript也簡單加入一行：

```javascript
CKEDITOR.replace('editorDemo');
```

搞定！是不是有夠簡單XD

{% asset_img 0.png %}

# 稍微進階的使用CKEditor

沒有特別需求時要使用CKEditor真的非常簡單，但也有些稍微進階需要注意的

# CKEditor預設內容

要在編輯器裡面放入預設內容，只需要把HTML放進textarea裡面就可以了

```html
<textarea name="editorDemo">
  <h2>CKEditor Demo</h2>
  <hr />
  <p>使用CKEditor，人生變得好簡單啊！</p>
</textarea>
```

# 取得編輯器內容

如果是表單送出要在後端取得內容，只需要抓post過來的editorDemo就可以，CKEditor會在表單送出時先幫你把內容更新回textarea裡面。但在表單送出前想取得編輯器內容，光是使用JavaScript取得textare內容是不行的，例如使用以下程式

```javascript
$('textarea[name=editorDemo]').val();
```

會發現抓不到更新後的編輯器內容，因此我們必須使用CKEditor提供的API來抓取

```javascript
console.log(CKEDITOR.instances.editorDemo.getData()); // editorDemo是textarea的name
```

# 將編輯器內容更新回textarea

剛剛我們提到CKEditor在表單送出前，會主動幫你把編輯器的內容更新回textarea裡面，但是我們也可以透過CKEditor提供的API來主動將內容更新回去，例如

```javascript
 	CKEDITOR.instances.editorDemo.updateElement();
 	// 因為先把編輯器更新回textarea了，這裡就可以抓到目前最新的內容
	console.log($('textarea[name=editorDemo]').val());
```

以上程式碼DEMO: [https://jsfiddle.net/wellwind/o8j7budv/](https://jsfiddle.net/wellwind/o8j7budv/)

# 搭配plugins與build功能使用

CKEditor本身已經功能強大，厲害的是還有豐富的plugins可以搭配使用，可以到 [http://ckeditor.com/addons/plugins/all](http://ckeditor.com/addons/plugins/all) 瀏覽或搜尋需要的外掛，甚至可以透過builder的功能在開發初期就把需要的plugins通通先打包好一次下載；而build功能除了讓你預先選好plugins以外，也能選擇預設的toolbar、skin和預設要一起打包的語系檔，超級方便的啦！

# 類似資源

*   [TinyMCE](https://www.tinymce.com/): TinyMCE也是一款老牌的文字編輯器，功能一樣強大，也非常容易上手。
*   [Summernote](http://summernote.org/): Summernote是以Bootstrap風格為基礎開發的編輯器，功能比較陽春，但該有的功能也都有了，如果使用Bootstrap為主要風格，希望連編輯器也維持一致風格的話，可以考慮使用看看。
*   [Draft.js](https://facebook.github.io/draft-js/): Draft.js是一款以React開發的編輯器，預設功能很陽春，但也有不錯的擴充能力，喜歡使用React的朋友可以試試看這款Component。