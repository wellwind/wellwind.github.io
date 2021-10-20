---
title: "[Angular速成班]使用NgFor的5個特別變數，讓資料更有變化"
date: 2017-01-02 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - NgFor
---
在[之前的文章中](https://dotblogs.com.tw/wellwind/2016/11/20/Angular-input-output-ngfor-ng-if)我們學到使用NgFor來方式將陣列資料列舉到畫面上，今天我們更深入來使用NgFor內建定義的五個變數，讓畫面能夠有更豐富的變化。

<!-- more -->

# NgFor的五個變數

使用NgFor時，我們可以同時搭配使用五個不同的變數，分別是：

*   index：整數值；代表目前資料在陣列中的**index**
*   first：布林值；代表目前資料是否為**第一筆**
*   last：布林值；代表目前資料是否為**最後一筆**
*   even：布林值；代表目前資料的index是否為**第偶數筆**
*   odd：布林值；代表目前資料的index是否為**第奇數筆**

要使用這五種變數，我們必須在*ngFor="let item of items"中在加上`let ooo = xxx`的指派，把NgFor的變數指派給前面let設定的變數，例如

```
*ngFor="let item of items;let recordIndex = index;let firstRecord = first;let lastRecotd = last; let evenRecord = even; let oddRecord = odd
```

之後我們就可以在NgFor裡面做更細部的變化啦！例如之前的TodoItemsComponent，我們希望列舉出來的資料作以下變化：

1.  項目前面加上index
2.  第一筆加上text-danger class
3.  最後一筆加上text-warning class
4.  index為偶數時資料加上bg-info class
5.  index為奇數時資料加上bg-success class

那麼src/app/todo-items/todo-items.component.html可以改寫成如下

```html
<ul>
  <li *ngFor="let item of items;let recordIndex = index;let firstRecord = first;let lastRecotd = last; let evenRecord = even; let oddRecord = odd">
    <label htmlFor="chk_{{item.id}}">
      <input id="chk_{{item.id}}" type="checkbox" [checked]="item.done" (click)="itemClick(item)"> 
      <span [ngClass]="{'done' : item.done, 'text-danger': firstRecord, 'text-warning': lastRecotd, 'bg-info': evenRecord, 'bg-success': oddRecord}">
        {{ recordIndex }} . {{ item.value }}
      </span>
    </label>
    |
    <a href="#" (click)="delete(item)">刪除</a>
    <span *ngIf="item.done">(已完成)</span>
    </li>
</ul>
```

# 執行結果

{% asset_img 0.png %}

很簡單吧！透過NgFor內建的這五個變數，畫面呈現的細微調整就家容易了！

今天的程式碼：[https://github.com/wellwind/AngularDotblogsDemo/tree/NgForVar](https://github.com/wellwind/AngularDotblogsDemo/tree/NgForVar)