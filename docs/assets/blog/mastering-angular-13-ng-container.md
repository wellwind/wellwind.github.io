---
title: "[Angular 大師之路] 認識 ng-container"
date: 2018-10-28 22:01:09
category: "Angular 大師之路"
tags:
  - Angular
  - ng-container
---

今天我們來聊聊在 Angular 上一個有趣又方便，也是個人非常喜歡使用的語法 - `<ng-container>`

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：5 顆星

# 先看問題

一般開發 Angular 應用程式時，最常使用到的莫過於 `*ngIf` 和 `*ngFor` 了：

```html
<ul>
  <li *ngFor="let item of list">{{ item }}</li>
</ul>

<div *ngIf="display">Hello</div>
```

這些都沒什麼問題，但假設我希望把 `*ngIf` 和 `*ngFor` 用在同一個元素上時呢？舉例來說，我有一個清單陣列資料，只希望顯示「奇數筆」的資料，該怎麼寫呢？在沒有想太多時，我們可能會這樣寫：

```html
<ul>
  <li *ngFor="let item of list; let odd = odd" * ngIf="odd">
    {{ item }}
  </li>
</ul>
```

雖然看起來很合理，但實際上執行時我們會得到這樣的錯誤訊息：

{% asset_img 01.jpg %}

代表的是 `*` 開頭這樣的樣板語法，在一個元素上只能使用一次，這跟 Angular 樣板語法的設計有關，之後我們再來說明，現階段我們可以想像成：「一個元素就像一組大括弧一樣」，在這個大括弧裡面，有著自己的生命週期，但在寫 JavaScript 的時候，我們其實也不會把 `if` 和 `for` 語法混在一起使用，因此 `*ngIf` 和 `*ngFor` 用在一起當然也是不太合理的。

有了這樣的概念，要調整程式就變得簡單多了，可能變成如下：

```html
<ul>
  <li *ngFor="let item of list; let odd = odd">
    <span *ngIf="odd">{{ item }}</span>
  </li>
</ul>
```

當然這樣的程式明顯還是不對的，在上述程式的 `li` 其實還是會顯示，只是內容使用 `<span *ngIf>` 包起來，不顯示內容了，但 `<li>` 標籤還是會出現的，而不是我們期望的只顯示奇數的 `<li>` 標籤內容，那麼到底有沒有什麼方法呢？我們今天的主題：`<ng-container>` 就是一個重要的解答！

# 關於 ng-container

`<ng-container>` 是 Angular 提供的宜組有趣的標籤，這個標籤最有趣的地方在於它不會產生任何 HTML 標籤，只是單純顯示裡面的內容，什麼意思呢？舉個例子來說，一段簡單的 HTML

```html
<div>
  Hello World
</div>
```

此時打開 F12 毫無懸念的會看到這個 `<div>` 標籤：

{% asset_img 02.jpg %}

但是當使用 `<ng-container>` 時，會呈現什麼樣子呢？

{% asset_img 03.jpg %}

此時我們只會看到一段 HTML 註解而已，而裡面的內容還是會顯示出來，這就是 `<ng-container>` 最重要的功能，她不多做什麼，甚至連自己這個標籤(也就是 `<ng-container>`)都不會顯示！

透過這個特性，上述的程式就可以調整成如下：

```html
<ul>
  <ng-container *ngFor="let item of list; let odd = odd">
    <li *ngIf="odd">{{ item }}</li>
  </ng-container>
</ul>
```

上面的程式中，我們改將 `*ngFor` 放入 `<ng-container>` 之中，由於 `<ng-container>` 的特性，它不會產生任何額外的 HTML 標籤，因此在裡面我們只要使用 `*ngIf` 來決定 `<li>` 標籤是否要呈現就好了！

# 用 ng-containr 來避免 CSS 定位不到

`<ng-container>` 還有一個妙用，尤其是在跟設計師合作時特別實用，假設一下剛剛的程式不再是 `<li>` 的呈現方式了：

```html
<div class="body">
  <div class="content" *ngFor="let item of list">
    {{ item }}
  </div>
</div>
```

此時要顯示奇數筆的資料時，就非常簡單：

```html
<div class="body">
  <div *ngFor="let item of list; let odd = odd">
    <div class="content" *ngIf="odd">{{ item }}</div>
  </div>
</div>
```

看起來沒什麼問題，只是可能會多了幾個不會顯示內容的 `<div>` 而已，但假如設計師給的 CSS 長得類似這樣：

```css
.body > .content {
  color: red;
}
```

這代表著 `class="body"` 後一定要立刻接著是 `class="content"` 才會套用樣式，很明顯上面的方法多墊了一層 `<div>`，如果這時候我們很暴力的去調整這條 selector，很有可能會不小心造成畫面上其他地方樣式錯誤，因此我們就可以借助 `<ng-container>` 的力量，解決這個問題：

```html
<div class="body">
  <ng-container *ngFor="let item of list; let odd = odd">
    <div class="content" *ngIf="odd">{{ item }}</div>
  </ng-container>
</div>
```

透過這樣的方式，我們既能在樣板中控制顯示，又不怕 CSS 定位出問題，真的是非常方便吧！

# 本日小節

今天我們學會透過 `<ng-container>` 去幫助我們調整設計樣板時一些不好控制的細節，在實際應用時，若是不需要產生標籤的，我們可以放心大膽的勁量去使用 `<ng-container>` ，設計出來的樣板會更加合理，跟設計師合作時也不怕定位問題囉！

本日程式碼：

https://stackblitz.com/edit/ironman2019-ng-container?file=src%2Fapp%2Fapp.component.html

# 相關資源

- [Group sibling elements with ng-container](https://angular.io/guide/structural-directives#group-sibling-elements-with-ng-container)

