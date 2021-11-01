---
title: "[前端軍火庫]jquery.qrcode.js - 只靠前端也能產生QRCode"
date: 2016-12-10 11:11:11
category: "前端軍火庫"
tags:
---
現在QRCode已經越來越流行了，從最簡單的掃描QRCode來取得網址，到利用QRCode完成報到程序等等；現在生活周遭已經到處都有機會看得到QRCode了，因此身為前端工程師，勢必會有越來越多機會在前端打上QRCode的圖片，今天就來介紹一款簡單易用的QRCode library吧！

<!-- more -->

# 關於jquery.qrcode.js

從名稱就很容易可以猜出，[jquery.qrcode.js](https://github.com/jeromeetienne/jquery-qrcode)是一款用來產生QRCode的jquery plugin，因此要使用前記得先加入jquery才行。

# 使用jquery.qrcode.js

首先先方上一個`<div>`標籤

```html
<div id="qrcode"></div>
```

接著加入JavaScript

```javascript
$('#qrcode').qrcode('http://www.google.com');
```

完成！簡單到我都覺得這篇文章有灌水嫌疑了XD

# 進階使用jquery.qrcode.js

預設jquery.qrcode.js是使用HTML5的canvas來完成，但舊版IE不支援canvas，因此若有需要支援舊版瀏覽器需求的話，可以加上`render: table`參數

```javascript
$('#qrcode-table').qrcode({
	render: 'table',
  text: 'http://www.google.com'
});
```

如果需要指定大小(預設是256x256)也可以加入`width`及`height`參數，不過常跟寬記得設成一樣，因為QRCode都是正方形的，說長寬設為長方形則會出破圖現象

```javascript
$('#qrcode-size').qrcode({
	width: 120,
  height: 120,
  text: 'http://www.google.com'
});
```

DEMO程式: [https://jsfiddle.net/wellwind/osLpo995/](https://jsfiddle.net/wellwind/osLpo995/)

# 類似資源

*   [Browser Console QRCode](https://github.com/comdan66/browser_console_qrcode)：Browser Console QRCode非常有趣，它不是用來呈現在HTML上的，而是放在瀏覽器的開發人員工具(F12)中的，也就是按下F12進入開發人員工具才看得到的QRCode，拿來當作公司秘密徵才(或小道消息?)的管道應該是個不錯的選擇XD