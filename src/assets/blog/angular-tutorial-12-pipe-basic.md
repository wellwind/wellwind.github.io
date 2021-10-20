---
title: "[Angular速成班]使用Pipe輕鬆改變view上的顯示內容(1)-Angular內建Pipe"
date: 2017-02-06 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - Pipe
    - DatePipe
    - JsonPipe
---
今天我們要介紹的是Angular的Pipe，透過Pipe我們可以不用在Component端寫程式改變資料的顯示模式，而是透過外部（也就是Pipe）的模式來調整要顯示的資料內容，如此一來我們就不用在Component中花太多心思去關注內容該如何呈現，再次達到關注點分離的效果。

<!-- more -->

# 為何要使用Pipe

很多時候，我們用程式產生或從後端API撈取的資料未必就是我們希望呈現在畫面上的內容，這時候我們就必須自行撰寫程式來將資料**轉換成要呈現的內容**，然而這樣的程式碼不管在Component（負責前後端的串接）還是在Service（負責後端串接、商業邏輯）中，都會顯得有點格格不入，因此Angular提供了Pipe的功能，讓我們能將**轉換資料呈現方式的程式碼寫在Pipe中**，接著就可以在View中直接使用，這麼做個人認為有幾個主要好處：

1. **關注點分離**：已經被提到太多次的重要概念，各個類別各司其職，需要的時候再組合起來，達成高內聚，低耦合的效果，維護程式也更加容易。
2. **易於測試**：由於Pipe的目標很簡單，就是一個類別，把input的資料轉為想要output的內容，與其他外部組件的相依性極低，因此非常適合撰寫isolated unit test來獨立測試，測試案例也不會跟Component或Service裡面的其他程式混在一起。
3. **可重複使用**：Pipe在設計完成後就可以直接在View中使用，因此只要Pipe完成後，我們可以在任何地方直接套用這個Pipe，不限任何Component，重複使用性高。

# 如何使用Pipe

Pipe寫好後需要在View中直接使用，程式看起來大致會如下

```
{{ data | mypipe }}
```

以上的意思是，把data透過mypipe這個Pipe進行轉換

# 為Pipe加上參數

有些Pipe可以在後面加上一些參數，來調整要轉換的方式，如果需要加入參數，可以在Pipe後面加上`:參數`，多個參數也可以使用`:參數1:參數2`的方式；如下：

```
{{ data | mypipe:para1:para2 }}
```

# 使用Angular內建的Pipe

今天我們先來介紹兩個Angular已經內建好的Pipe，DatePipe和JsonPipe；關於完整Angular中內建可用的Pipe，可以參考官方文件

[https://angular.io/docs/ts/latest/api/#!?query=pipe](https://angular.io/docs/ts/latest/api/#!?query=pipe)

## DatePipe

DatePipe用於進行對日期資料的轉換，例如我們直接產生JavaScript的Date物件，如下：

```typescript
export class AppComponent {
  today = new Date();
}
```

此時若將today直接呈現在畫面上時，看起來會是這樣：

{% asset_img 0.png %}

直接顯是一大串日期文字的狀況並不常見，這時候我們可以加上DatePipe，程式碼如下：

```html
{{ today | date }}
```

### 執行結果

{% asset_img 1.png %}

DatePipe也可以接受一個時間格式的字串如(`y-MM-dd`)，並內建了幾種常見的顯示模式，如`shortDate`和`shortTime`等等

{% asset_img 2.png %}

## JsonPipe

JsonPipe對於我們在前端想要debug物件的資料時很有幫助，雖然大多時間我們都會選擇使用console.log()來顯示資料，但在View上我們可以透過JsonPipe把資料物件直接顯示出來

例如我們有個bio物件

```typescript
export class AppComponent {
  bio = {
    name: 'wellwind',
    age: 30,
    sex: 'M'
  };
}
```

要在View上直接顯示這個物件完整資訊，只需要透過JsonPipe

```
{{ bio | json }}
```

### 執行結果

{% asset_img 3.png %}

JsonPipe其實就是使用JSON.stringify對資料轉換，非常簡單，很適合拿來進行除錯。

# 單元回顧

今天我們介紹了Angular的Pipe功能，並簡單說明了使用Pipe的好處，讓我們能寫出更好維護的程式，同時簡單介紹了兩個Angular內建的Pipe；下次我們將會介紹如何撰寫自己的Pipe，讓資料呈現無死角！

今天的程式碼：

[https://github.com/wellwind/AngularDotblogsDemo/tree/AngularPipe](https://github.com/wellwind/AngularDotblogsDemo/tree/AngularPipe)