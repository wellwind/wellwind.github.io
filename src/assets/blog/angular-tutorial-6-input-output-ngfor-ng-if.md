---
title: "[Angular速成班]來寫個TodoApp(3)-學習@Input, @output, ngFor和ngIf"
date: 2016-11-20 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - TypeScript
    - ngFor
    - ngIf
    - \@Input
    - \@Output
---
在前一篇文章「認識Angular的4種data binding機制」我們學到了4種Angular的data binding機制後，今天我們一口氣要學習**@Input, @output, ngFor和ngIf**。這4樣東西學會後，基本上就算是把Angular最常用的功能都學起來了。我們也會在本篇文章中把基本的TodoApp給完成。

<!-- more -->

# 建立TodoItem interface

首先我們先使用下面指令在shared目錄下建立一個TodoItem的interface

```shell
ng g interface shared\TodoItem
```

interface屬於TypeScript的語法，目的是用來賦予沒有強型別的JavsScript物件一個型別，如此一來在將TypeScript編譯成JavaScript時，就可以用來檢查我們傳入的物件是否有正確的屬性名稱；同時IDE如果支援的話，還可以藉此享受到autocomplete和即時檢查型別是否正確等等的方便功能。

產生TodoItem這個interface之後，我們打開**src/app/shared/todo-item.ts**，並將裡面的內容改成

```typescript
export interface TodoItem {
    id: number;
    value: string;
    done: boolean;
}

```

如此一來一個TodoItem的型別就完成囉！

# 加入基本資料

接下來我們要讓畫面上呈現我們在程式裡加入的TodoItem，首先打開**src/app/app.component.ts**，在最上面加上

```typescript
import { TodoItem } from './shared/todo-item';
```

將TodoItem這個interface匯入AppComponent中來使用，接著AppComponent這個class裡面我們先加入幾個TodoItems

```typescript
  todoItems: TodoItem[] =[{
    id: 1,
    value: 'Todo Item No.1',
    done: false
  },{
    id: 2,
    value: 'Todo Item No.2',
    done: true
  },{
    id: 3,
    value: 'Todo Item No.3',
    done: false
  }];
```

這裡我們使用`todoItems: TodoItem[]`宣告了一個todoItems變數，並且型別設定成TodoItem陣列，然後給了3個基本的TodoItem資料。

# 使用@Input接收傳入Component的資料

根據我們之前的規劃，顯示TodoItem資料應該是在TodoItemsComponent，但為了管理方便我們目前的資料都放在AppComponent中，那麼該如何將AppComponent的資料傳給TodoItemsComponent呢？首先我們先打開app/app.component.html，將裡面的

```html
<app-todo-items></app-todo-items>
```

改成

```html
<app-todo-items [items]="todoItems"></app-todo-items>
```

還記得`[items]="todoItems"`這種用法嗎？這是上一篇文章介紹過的「屬性binding」，我們**將items視為一個屬性，並且把todoItems傳進去**。至於TodoItemsComponent要怎麼收到傳入的這個items屬性呢？就需要@Input這個decorator的幫助了。接下來我們打開**src/app/todo-items/todo-items.component.ts**把裡面的內容改成：

```typescript
import { TodoItem } from './../shared/todo-item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-todo-items',
  templateUrl: './todo-items.component.html',
  styleUrls: ['./todo-items.component.css']
})
export class TodoItemsComponent implements OnInit {

  @Input() items: TodoItem[];

  constructor() { }

  ngOnInit() {
  }

}

```

在最上面我們匯入了**TodoItem的interface**，以及來自**@angular/core的Input**，然後class裡面我們宣告了`items: TodoItem[]`並在前面加上`@Input`，代表後面的items變數是從外面**輸入(input)**進來的。@Input()預設會把後面變數的名稱當作component要接受資料的屬性名稱，但我們也可以藉由`@Input('xxx')`的方式來進行調整，例如上面的宣告可以改成

```
@Input('items') theTodoItems: TodoItem[];
```

代表我們要接收的屬性依然是items，但是會傳給theTodoItems這個變數。

# 使用ngFor來列舉資料

接下來我們要讓TodoItemsComponent能正確顯示傳進來的資料，打開**src/app/todo-items/todo-items.component.html**，把原本的html改為

```html

*   <label htmlfor="chk_{{item.id}}"><input id="chk_{{item.id}}" type="checkbox" [checked]="item.done"> {{ item.value }}</label> 
        |
        [刪除](#)

```

我們使用了`*ngFor="let item of items"`的語法，代表目前所在的element要依照items陣列的資料顯示，並且陣列中的每筆資料放到item中使用；由於原本有3筆items，因此這個<li>標籤內容就會顯示3次，而<li>標籤裡面則可以直接取用item來代表每筆TodoItem的資料。

另外要提一下的是`htmlFor`，由於for在JavaScript中屬於保留字，因此這邊我們必須使用htmlFor的方式來取代，另外我們也可以使用`attr.for`的方式，來代表使用attributes中的for。

# 使用ngIf來顯示/隱藏資料

接下來我們希望能夠在已經完成的items後面加上"已完成"的文字，這時候我們可以使用`ngIf`來決定某個標籤是否要產生！因此我們把原來的html改成

```html
<ul>
  <li *ngFor="let item of items">
    <label htmlFor="chk_{{item.id}}">
      <input id="chk_{{item.id}}" type="checkbox" [checked]="item.done"> {{ item.value }}
    </label>
    |
    <a href="#">刪除</a>
    <span *ngIf="item.done">(已完成)</span>
    </li>
</ul>
```

跟前面的內容差不多，只是加入了`<span *ngif="item.done">(已完成)</span>`，而**ngIf則會根據後面的條件來決定所在的標籤是否需要產生**。若條件為true，則標籤就會產生，條件為false的話，標籤就不會產生。

# 使用@Output傳遞事件

到目前為止我們已經可以把TdoItems的項目依照我們想要的方式呈現出來了，但光是這樣還不夠，我們依然無法增加TodoItem，，因此接下來我們就來看看如何使用@Output讓元件間的事件進行傳遞！

首先我們先在AppComponent中寫好要加入TodoItem的函數

```typescript
  addTodo(text) {
    this.todoItems.push({
      id: (new Date()).getTime(),
      value: text,
      done: false
    });
  }
```

產生id部份我們取用目前時間的time span來確保id是唯一且遞增的。

接著把app.component.html中的

```html
<app-add-form></app-add-form>
```

改為

```html
<app-add-form (addtodoitem)="addTodo($event)"></app-add-form>
```

這裡可以看到我們使用了event binding來綁定addTodoItem事件到AppComponent的addTodo中，但addTodoItem這個事件是哪裡來的呢？接下來我們就必須要在AddFormComponent中定義了，我們可以打開src\app\add-form\add-form.component.ts，在最上面匯入Output和EventEmitter，原來的import程式變成

```typescript
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

```

接著在class裡面加入

```
@Output() addTodoItem = new EventEmitter();
```

代表addTodoItem這個component的property是一個要**輸出(output)**的東西，什麼樣的東西呢？是一個**用來處理事件的EventEmitter**。接著把我們之前學習event binding在AddFormComponent中加入的addTodo函數內容改為

```typescript
  addTodo($event: MouseEvent) {
    this.addTodoItem.emit(this.todoText);
  }
```

這裡我們藉由`addTodoItem.emit(this.todoText)`來**把事件發射出去**，並且參數內容為`this.todoText`，這個參數會變成`<app-add-form (addtodoitem)="addTodo($event)"></app-add-form>`的$event部分，如此一來在AppComponent的addTodo函數就可以接收到這個參數啦！

接著回到瀏覽器就可以看到目前的成果啦！

{% asset_img 0.png %}

# 單元回顧

本篇文章我們簡單介紹了Angular中的**@Input, @output, ngFor和ngIf**語法。透過這些語法我們已經可以完成大部分的需求了，因此我們也一次把TodoApp的基本功能通通完成了。至於剩下的[勾選/取消勾選]和[刪除]功能，就當作回家作業吧XD

到目前為止的程式碼以及實作完的[勾選/取消勾選]和[刪除]的部分，程式碼都在下面

[https://github.com/wellwind/AngularDotblogsDemo/tree/AddTodoItem](https://github.com/wellwind/AngularDotblogsDemo/tree/AddTodoItem)

之後我們在來慢慢介紹Angular的各種其他好用功能吧！