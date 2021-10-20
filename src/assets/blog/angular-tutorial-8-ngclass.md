---
title: "[Angular速成班]使用NgClass動態為HTML element加入class"
date: 2016-12-31 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - NgClass
---
在[上一篇](https://dotblogs.com.tw/wellwind/2016/11/27/Angular-css-process)文章中我們學到了如何自訂CSS class，今天我們來學習透過ngClass來為畫面動態的加入或移除class。

<!-- more -->

# 使用NgClass

[NgClass](https://angular.io/docs/ts/latest/api/common/index/NgClass-directive.html)可以幫助我們依照需要的條件加入不同的class，我們可以使用`[ngClass]=...`的方式來決定HTML element要加入哪些class。ngClass後面可以接三種類型的參數，前兩種比較簡單：

## 字串
 
例如`[ngClass]="'classA, classB'"`

## 陣列

例如`[ngClass]="['classA', 'classB']"`

前兩種方式都能夠將後面的class加入HTML  element中，但其實跟我們直接使用`class="classA classB"`沒什麼不一樣，但可以透過後與對應的Component程式連動，讓class能夠動態改變；例如我們上一篇文章HTML有一段

```html

<div>
  <span class="blue">TodoItemsComponent中測試blue class</span>
</div>

```

我們可以改成

```html

<div>
  <span [ngclass]="getBlueClass()">TodoItemsComponent中測試blue class</span>
</div>

```

接著在對應Component中加入getBlueClass()方法

```typescript
    getBlueClass() {
        // 這裡可以用程式動態決定要回傳字串、陣列或物件
        return 'blue';
    }
```

結果就會完全一樣。

而第三種使用物件的方式，則可以讓我們依照條件決定是否要加入某個class

## 物件

例如`[ngClass]="{'classA': true, 'classB': false}"`

在這邊我們加入的JSON物件，**物件中的屬性名稱是我們要加入的class，屬性的值則是一個boolean，如果為true，則這個class會加入element中；若為false，則不會加入**。

例如我們之前的TodoItemsComponent裡面我們希望勾選完成的項目後可以加上刪除線，我們可以先在**src/app/todo-items/todo-items.component.css**加入一個class

```css
.done {
    text-decoration: line-through;
}
```

然後把**src/app/todo-items/todo-items.compontnt.html**的checkbox部分改成

```html
      <input id="chk_{{item.id}}" type="checkbox" [checked]="item.done" (click)="itemClick(item)"> 
      <span [ngclass]="{'done' : item.done}">{{ item.value }}</span>
```

因此當項目被鉤選時（也就是item.done為true時），就會加入`done`這個class

程式執行結果如下：

{% asset_img 0.png %}

# 單元回顧

今天我們介紹了NgClass的使用方法，NgClass後面可以加上字串、陣列和物件三種內容，字串與陣列的方式適合搭配Component的程式碼來決定要給予什麼class，而物件的方式則比較適合在HTML中直接決定樣式（當然也是可以由Component產生）；至於實際上什麼情境適合用哪種，就沒有絕對的答案，只要自己舒服，團隊也都能接受就好囉！

今天的程式碼：[https://github.com/wellwind/AngularDotblogsDemo/tree/NgClass](https://github.com/wellwind/AngularDotblogsDemo/tree/NgClass)