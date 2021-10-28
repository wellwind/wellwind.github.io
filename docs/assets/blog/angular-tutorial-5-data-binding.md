---
title: "[Angular速成班]來寫個TodoApp(2)-認識Angular的4種data binding機制"
date: 2016-11-12 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - TypeScript
    - Data Binding
---

接下來我們來了解一下Angular中4種主要的data binding機制，如果沒有data binding機制的話，我們必須做很多事情才能讓一個JavaScript中的資料顯示在HTML上，反過來要抓取HTML DOM上的資料也是一件不容易的事情，因此許多前端框架都在努力讓事情變得簡單。透過Angular的data binding機制我可以更容易讓component與view進行互動，接下來就來看看這4種data binding機制如何使用吧。

<!-- more -->

{% asset_img 0.png %}

# 內崁binding (Interpolation)

上圖來自[Angular的官方文件](https://angular.io/docs/ts/latest/guide/architecture.html#!#data-binding)，說明的四種data binding機制的使用，接下來我們就從例子中學習如何使用吧！

內崁binding顧名思義，就是將資料直接崁入html中，要使用內崁binding，需要在component設定好要崁入的資料，然後在view中直接使用**兩個大括號** `\{\{ ... \}\}`的方式將資料變數包起來就可以了。

例如我們可以將上一篇文章產生的HeaderComponent加入一個title變數

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = '歡迎來到Todo App';

  constructor() { }

  ngOnInit() {
  }

}

```

接著將HTML內容改成

```html

<h1>{{title}}</h1>

```

再回到瀏覽器，就可以發現我們將HeaderComponent中的title變數崁入HTML中囉！

內崁binding除了可以崁入變數外，也可以加入一些運算式或component的函數回傳值，例如我們在HeaderComponent中加入一個**getDate()**，只是簡單的回傳現在時間

```typescript
  getDate() {
    return (new Date());
  }
```

接著view的部分修改成

````html

<h1>{{title}}</h1>

<h2>{{ '現在時間 : ' + getDate() }}</h2>
````

再重新回到瀏覽器看看，就可以看到崁入簡單的運算式結果囉。

​{% asset_img 1.png %}

# 屬性binding (property binding)

屬性binding是用來綁定view上DOM元素的屬性，要使用屬性binding可以將要binding的屬性用**一個中誇號包住**`[ ... ]`，接著後面接component的資料。

例如我們目前的AddFormComponent的view部分有一個

```html
<input type="text" placeholder="請輸入代辦事項"> <button>增加</button>
```

我們希望placeholder的內容由component提供，改如何做呢？首先我們把view內容改成

```html
<input type="text" [placeholder]="placeholderText"> <button>增加</button>
```

接著在AddFormComponent中加入placeholderText屬性

```typescript
export class AddFormComponent implements OnInit {

  placeholderText = '請輸入代辦事項';

  constructor() { }

  ngOnInit() {
  }

}
```

就大功告成啦！

{% note info %}  
當然我們也可以很容易的使用內崁binding的方式來完成，像是：`placeholder="{{placeholderText}}"`。也一樣可以完成，而屬性binding是由內崁binding衍生出來的一種簡易樣板，關於樣板的部分，以後有機會再來介紹。  
{% endnote %}  

# 事件binding (event binding)

事件是讓HTML能夠活起來的重要關鍵之一，再HTML中我們可以使用**OnXXXX**，來決定不同事件發生時的處理方式，而在Angular中我們也可以使用這些事件，使需要**把On去掉後再用小誇號包起來**`( ... )`，後面接要執行component中哪個事件方法即可。

例如AddFormComponent的view裡面有個button，我們想要在按鈕按下時做些事情，可以改成

```html
<input type="text" [placeholder]="placeholderText"> <button (click)="addTodo()">增加</button>
```

接著AddFormComponent加入addTodo()

```typescript
  addTodo() {
    console.log('按鈕被按下了');
  }
```

回到瀏覽器打開開發人員工具(F12)後按下按鈕看看，就能看到「按鈕被按下了」的紀錄了。

{% asset_img 2.png %}

除此之外，我們也可以把事件參數一起傳入，例如原來的按鈕事件中，我們傳入**$event**

```
<button (click)="addTodo($event)">增加</button>
```

接著在addTodo中也接收這個參數

```typescript
  addTodo($event) {
    console.log('按鈕被按下了', $event);
  }
```

回到瀏覽器按下按鈕，就可以看到我們接收到事件參數的結果囉。

{% asset_img 3.png %}

我們同時也注意到了傳入的是一個MouseEvent的型別，由於我們是使用TypeScript進行開發，因此我們可以把$event宣告成MouseEvent

```typescript
  addTodo($event: MouseEvent) {
    console.log('按鈕被按下了', $event);
  }
```

這是TypeScipt的語法，在開發期間賦予變數強型別的內容，如果程式編輯器支援的話，我們可以更容易取得變數裡面的內容，例如使用Visual Studio Code中宣告MouseEvent型別後我們可以列出$event可用的屬性或方法，同時還有auto complete的功能，避免打錯字還要debug半天的困擾！

{% asset_img 4.png %}

# 雙向binding (two way binding)

前面介紹的3種data binding機制都是單向的binding(one way binding)，崁入和屬性binding是將component的資料傳向DOM，事件binding是將DOM資料傳向component；如果今天我們有一個文字方塊<inpu type="text" />要能夠接收component的資料，並且在資料變更時也能同步讓component知道，該怎麼辦呢？我們可能會寫成這樣

view部分:

```html
<input type="text" [value]="todoText" (input)="changeTodoText($event)" [placeholder]="placeholderText">
<button (click)="addTodo($event)">增加</button>
```

component部分:

```typescript
export class AddFormComponent implements OnInit {

  placeholderText = '請輸入代辦事項';
  todoText = '';

  constructor() { }

  ngOnInit() {
  }

  addTodo($event: MouseEvent) {
    console.log('輸入的文字為 : ' + this.todoText);
  }

  changeTodoText($event: KeyboardEvent) {
    this.todoText = ($event.target as HTMLInputElement).value;
  }
}

```

用兩個不同方向的one way binding來完成，但這樣寫起來滿不方便的，還好Angular也已經內建two way binding機制囉，我們可以使用`[(ngModel)]="xxxx"`的方式，直接binding到component上的某個變數，就不用額外寫一個事件函數接收資料了！

我們可以將view改為

```html
<input type="text" [(ngmodel)]="todoText" [placeholder]="placeholderText">
<button (click)="addTodo($event)">增加</button>
```

component的部分，就可以把changeTodoText($event)這部分拿掉囉！執行結果如下圖

{% asset_img 5.png %}

{% note info %}  
我們可以看到[(ngModel)]其實就是event binding(小誇號)與property binding(中誇號)的合併，看起來就像是把兩個one way binding組合起來一樣，實際上也是默默做了這些事情，很方便吧！  
{% endnote %}  

# 單元回顧

今天我們介紹了4種Angular的data binding機制，崁入和屬性binding是將component的資料傳向DOM，而事件binding是將DOM資料傳向component，至於雙向binding則是組合了兩個單向binding，用來節省我們的時間。data binding是呈現資料與後端程式密切互動的重要環節，有了data binding的基本觀念後，下篇文章我們就可以真正寫程式來變更todo list資料囉！

本篇文章的程式碼: [https://github.com/wellwind/AngularDotblogsDemo/tree/DataBinding](https://github.com/wellwind/AngularDotblogsDemo/tree/DataBinding)