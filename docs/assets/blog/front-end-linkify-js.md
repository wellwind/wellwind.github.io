---
title: "[前端軍火庫]linkify.js - 自動加上超連結的小幫手"
date: 2016-12-08 11:11:11
category: "前端軍火庫"
tags:
---
在開發CMS相關系統時，有一個狀況也是常常遇到的，在張貼內容時加入一個網址，但沒有主動補上超連結，對於瀏覽內容的人來說就會稍微有點不方便，因此今天要介紹的[linkifify.js](https://github.com/SoapBox/linkifyjs/)，就是一款簡單易用、快速幫助你在內文中加入超連結的好幫手！

<!-- more -->

# 使用linkify-jquery

透過linkify-jquery，我們可以很輕易把selector查詢出來的內容中有網址的部分，主動加上超連結，例如以下HTML:

```html
<div class="border" id="original-text">linkify demo: http://www.google.com</div>
```

裡面的網只是沒有加上超連結標籤的，這時候我們可以在JavaScript中加入

```javascript
$('#original-text').linkify();
```

就完成囉，是不是超級方便啦！

透過linkify加上得連結，預設會加入`linkified`這個class，因此我們也可以透過定義這個class的方式來調整超連結的樣式。

DEMO如下: [https://jsfiddle.net/wellwind/rfwf5awz/](https://jsfiddle.net/wellwind/rfwf5awz/)

# 使用linkify-html

有時候我們會希望主動取得加上超連結後的內容在進行額外的處理，可以搭配使用linkify-html，例如程式碼如下：

```javascript
var content = linkifyHtml($('#original-text').val()
```

就可以得到需要的內容了，也是非常容易使用的。

DEMO: [https://jsfiddle.net/wellwind/ytLafkg8/](https://jsfiddle.net/wellwind/ytLafkg8/)

{% asset_img 0.png %}

# linkify預設選項設定

linkify也有許多預設的選項可以設定，例如剛剛提到會加上`linkified`的class，想要換一個的話，可以設定`linkify.options.defaults.className`

```javascript
linkify.options.defaults.className = 'anotherClassName';
```

相關選項可以參考官方的文件：[http://soapbox.github.io/linkifyjs/docs/options.html](http://soapbox.github.io/linkifyjs/docs/options.html)

# 其他linkify外掛

linkify除了一般網址加上超連結以外，也有一些外掛可以搭配例如[hashtag](http://soapbox.github.io/linkifyjs/docs/plugin-hashtag.html)可以在文字內容有#字號時，加上超連結；[mention](http://soapbox.github.io/linkifyjs/docs/plugin-mention.html)則是為@開頭的文字加上連結，透過這兩個外掛還可以達成類似twitter或facebook的效果，很方便吧！

使用linkify，要加上超連結就輕鬆多啦！

# 類似資源

*   [Autolinker.js](https://github.com/gregjacobs/Autolinker.js/): Autolinker.js是另一款功能強大的library，它直接將前面提到的hashtag和mention這類的功能都做在一起了，但也因此檔案會比較大一點。