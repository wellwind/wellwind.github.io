---
title: "[Angular 大師之路] *ngIf 有 else 可以用嗎？"
date: 2018-10-26 22:01:09
category: "Angular 大師之路"
tags:
  - Angular
  - "*ngIf"
  - ng-template
---

我們都知道，在 Angular 的樣板中可以使用 `*ngIf` 語法來決定某段內容是否要呈現，但許多剛入門的 Angular 開發人員很少注意到其實 `*ngIf` 是有個 `else` 可以搭配使用的，今天就來看看該怎麼用吧！

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：5 顆星

要使用 `*ngIf` 其實很簡單，如下：

```html
<div *ngIf="display">Hello</div>
```

在 `display` 為 `true`時，就會顯示 `Hello` 文字，但如果今天希望在 `display` 為 `false` 時顯示另一段文字呢？有個簡單的方法，就是在寫一段 `*ngIf`

```html
<div *ngIf="display">Hello</div>
<div *ngIf="!display">World</div>
```

這樣的寫法雖然可以達到需求，但相對麻煩了一點，如果當 `*ngIf` 內條件複雜時，要寫一個相反的條件也會相對麻煩，這時候我們就可以換個寫法！

# 先使用 ng-template

首先，我們可以使用 `<ng-template>` 來建立一個**不會顯示在畫面**上的內容區塊：

```html
<div *ngIf="display">Hello</div>
<ng-template>
  <div>World</div>
</ng-template>
```

這個區塊在 Angular 處理樣板時，會將整個區塊仔入記憶體，但不會在畫面產生任何內容，只留下一段 HTML 的註解。

{% asset_img 01.jpg %}

接著，我們可以使用樣板參考變數，給這個 `<ng-template>` 一個名稱：

```html
<ng-template #anotherWord>
  <div>World</div>
</ng-template>
```

這時候，我們可以想像這個 `anotherWord` 是一個**準備被呼叫的方法**，當這個方法被呼叫時，就會顯示 `<ng-template>` 裡面的內容。

# 在 *ngIf 中使用 else

接著我們就可以在原來的 `*ngIf` 中，使用 `else` 的方式，來決定要顯示哪個 `<ng-template>`：

```html
<div *ngIf="display; else anotherWord">Hello</div>
<ng-template #anotherWord>
  <div>World</div>
</ng-template>
<button (click)="display = !display">Toggle Display</button>
```

當 `<div>Hello</div>` 因為 `*ngIf` 的關係不顯示時，就會用 `anotherWord` 這個 `<ng-template>` 內的 `<div>World</div>` 來取代原來的內容，就可以輕易達到 `else` 的效果啦！

程式碼參考：

https://stackblitz.com/edit/ironman2019-ngifelse?file=src/app/app.component.html

# 在一個樣板中共用 ng-template

上述是一個簡單的 `else` 使用情境，在實務上，我們也可能在一個樣板內設定一個 `<ng-template>` ，並且在畫面上多個 `*ngIf` 的 `else` 都使用這裡面的內容，例如：

```html
<div>Name: <span *ngIf="name; else noData">name</span></div>
<div>Ange: <span *ngIf="age; else noData">age</span></div>
<ng-template #noData><span>--</span></ng-template>
```

上述程式中，我們只建立了一個 `<ng-template>` 並宣告一個樣板參考變數名為 `noData`，當樣板內其他地方有 `else` 需求時，都去使用 `noData` 的內容，就不用為每個 `*ngIf` 都建立一個 `<ng-template>` 囉，雖然乍看之下很合理沒有什麼，但確實是很實用的技巧吧！
