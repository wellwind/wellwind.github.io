---
title: "[前端軍火庫]Awesomplete - AutoComplete就這麼做"
date: 2016-12-23 11:11:11
category: "前端軍火庫"
tags:
---
今天要介紹一個autocomplete的library - [Awesomplete](https://leaverou.github.io/awesomplete/)，這是由一款功能強大但檔案小又容易使用使用的library，透過Awesomplete我們可以輕鬆地完成autocomplete功能，讓user在輸入文字時自動給予提示。

<!-- more -->

# 開始使用Awesomplete

首先載入相關的js/css，如果清單內容固定的話，只需要加入`awesomplete`這個class及在`data-list`這個attribute中加入預設的清單即可，甚至一行額外的JavaScript都不必寫，例如以下程式碼：

```html
<input type="text" id="programming-language" placeholder="請輸入你最喜歡的程式語言" class="awesomplete" data-list="JavaScript, HTML, CSS, C#, JAVA, PHP, Ruby, Python">
```

如果覺得在data-list中加入一堆字串很麻煩，也可以建立一組`<datalist>`，然後再textbox的data-list中設定這個`<datalist>`的id即可

```html
<input type="text" id="programming-language2" placeholder="請輸入你最喜歡的程式語言" class="awesomplete" data-list="#languages-list" />

<datalist id="languages-list">
  <option>JavaScript</option>
  <option>HTML</option>
  <option>CSS</option>
  <option>C#</option>
  <option>Java</option>
  <option>PHP</option>
  <option>Ruby</option>
  <option>Python</option>
</datalist>
```

當然，要彈性一點用JavaScript也是可以的

HTML:

```html
<input id="programming-language3" />
```

JavaScript:

```javascript
new Awesomplete(document.getElementById('programming-language3'), {
	list: ['JavaScript', 'HTML', 'CSS', 'C#', 'Java', 'PHP', 'Ruby', 'Python']
});
```

也很簡單吧！

# 搭配ajax查詢

Awesomplete還有許多設定方式可以使用，可以自行上官方文件去查詢，但官方文件對於使用ajax查詢並沒有說明得非常清楚，因此以下簡單介紹一下使用ajax查詢該怎麼做。

事實上是，Awesomplete並沒有直接對應於ajax查詢的參數，這算是Awesomplete的缺點，不過我們可以透過監聽textbox的keyup事件，然後進行ajax查詢，再把原來的清單替換掉；利用這種方式來完成搭配ajax的autocomplete查詢，以下我們搭配國家名單的API-[REST Countries](http://restcountries.eu/)作為範例：  
首先HTML的部分很簡單：

```html
<input type="text" id="countries" placeholder="請輸入國家名稱(英文)" />
```

JavaScript的部分稍微複雜一些

```javascript
var demo4 = new Awesomplete(document.getElementById('countries'));

$('#countries').on('keyup', function() {
  $.ajax({
      url: 'https://restcountries.eu/rest/v1/name/' + this.value,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(data) {
      var list = [];
      $.each(data, function(key, value) {
        list.push(value.name);
      });
      demo4.list = list;
    });
});
```

程式碼DEMO: [https://jsfiddle.net/wellwind/tg65v396/](https://jsfiddle.net/wellwind/tg65v396/)

# 類似資源

*   [typeahead.js](https://twitter.github.io/typeahead.js/)：由Twitter開發的autocomplete library，雖然沒有像Awesomplete可以連JavaScript都不用寫，但使用上也很容易，且直接支援ajax查詢(當然後端要對應配合)。