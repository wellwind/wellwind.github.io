---
title: "[Angular Material 完全攻略]打造基本後台(2) - Toolbar"
date: 2017-12-24 14:23:52
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatToolbar
---

在昨天介紹SideNav時，我們有稍微提到過Toolbar，今天我們就比較認真的來看看Material Design中Toolbar的特性，及Angular Material中Toolbar可以呈現什麼樣的變化吧！

<!-- more -->

## Material Design中的Toolbar

在[Material Design的Toolbar設計指南](https://material.io/guidelines/components/toolbars.html)中，Toolbar通常會浮動在整個系統的正上方，所有的內容應該從toolbar下方通過，除非是暫時性顯示的元件如dialog等等。我們可以把Toolbar當作整個系統的header(或footer)角色，在這裡放置品牌Logo、標題、和一些簡單的執行動作等等。

## 開始使用Angular Material中的Toolbar

Toolbar的元件放置在MatToolbarModule之中，加入這個module後，我們可以使用`mat-toolbar`在畫面上呈現一個簡單的toolbar

```html
<mat-toolbar>
  <span>IT鐵人賽－Angular Material Demo</span>
</mat-toolbar>
```

效果如下：

{% asset_img 01-toolbar-basic.gif %}

可以看到我們已經加入一個簡單的toolbar了，不過這樣還有點小小問題，就是我們的toolbar沒有浮動在畫面的最上方，隨著畫面捲動，toolbar會消失在畫面之中，由於toolbar只是一個component，可以在畫面中的任何地方加入，因此直接強制顯示在畫面的最上方在元件設計上也好像怪怪的，但這只是元件設計上的問題而已，要讓這個toolbar固定在最上方其實也不困難，設定一下CSS就好了！

```css
.demo-app-header {
  position: fixed;
  top: 0;
  z-index: 2;
}

.demo-app-container,
.demo-app-sidenav {
  position: absolute;
  padding-top: 64px;
  height: calc(100vh - 64px);
}
```

目的是將toolbar固定在上方，並透過`z-index: 2`來避免捲動時被下方內容蓋過， `mat-sidenav-container`跟`mat-sidenav`喬出一個上方64px的空間給toolbar使用，避免內容被toolbar蓋過。

接著將原來的元件套上這些樣式

```html
<mat-toolbar class="demo-app-header">
  <span>IT鐵人賽－Angular Material Demo</span>
</mat-toolbar>

<mat-sidenav-container class="demo-app-container">
  <mat-sidenav class="demo-app-sidenav">
   	...
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```

{% note warning %}

需要特別注意的是，前一天我們在`mat-sidenav`設定了`fixedInViewport`，在CSS調整後這個屬性會造成sidenav顯示跑掉，因此我們要這個設定拿掉，目前[GitHub上已有Issue在討論了](https://github.com/angular/material2/issues/3717)，希望之後會調整囉。

{% endnote %}

成果如下：

{% asset_img 02-fixed-toolbar.gif %}

### 設定Toolbar的樣式

跟其他Angular Material元件一樣，我們可以透過`color`來改變toolbar的顏色：

```html
<mat-toolbar color="primary">這是primary的toolbar</mat-toolbar>
<mat-toolbar color="accent">這是accent的toolbar</mat-toolbar>
<mat-toolbar color="warn">這是warn的toolbar</mat-toolbar>
```

成果如下：

{% asset_img 03-toolbar-color.png %}

### 替Toolbar加上各種按鈕

接著我們想在toolbar加上一些東西，第一個是在左邊加上一個icon，可以透過這個icon來開關SideNav，這是一種很常見的後台做法

```html
<mat-toolbar color="primary" class="demo-app-header">
  <button mat-icon-button (click)="sideNav.toggle()">
    <mat-icon>{{ sideNav.opened ? 'close' : 'menu' }}</mat-icon>
  </button>
  <span>IT鐵人賽－Angular Material Demo</span>
</mat-toolbar>
```

效果如下：

{% asset_img 04-toolbar-toogle-sidenav.gif %}

接著我們想在toolbar的最右邊加上一個登出的按鈕，不過要怎麼把按鈕推到最右邊去呢，其實只要透過CSS就可以輕易解決，由於Toolbar內的排版是**flex**，我們可以加入一個分隔用的空間，把空間後的內容都推到另外一邊去。

```css
.toolbar-seprator {
  flex: 1 1 auto;
}
```

接著在toolbar中加入這個分隔器

```html
<mat-toolbar color="primary" class="demo-app-header">
  <button mat-icon-button (click)="sideNav.toggle()">
    <mat-icon>{{ sideNav.opened ? 'close' : 'menu' }}</mat-icon>
  </button>

  <span>IT鐵人賽－Angular Material Demo</span>

  <!-- 在這之後的都會被推到右邊去 -->
  <span class="toolbar-seprator"></span>

  <button mat-icon-button>
    <mat-icon>message</mat-icon>
  </button>
  <button mat-icon-button>
    <mat-icon>exit_to_app</mat-icon>
  </button>
</mat-toolbar>
```

效果如下：

{% asset_img 05-toolbar-right-button.png %}

一個有模有樣的toolbar就出現啦！

## 多行的Toolbar

Toolbar預設是單行的，在`mat-toolbar`中的內容預設都會在同一行顯示，若在一行toolbar中放入太多資訊則可能會因為寬度有限的關係無法顯示，這時候我們可以用多個`<mat-toolbar-row>`來設定多行的toolbar。

```html
    <mat-toolbar color="primary">
      <mat-toolbar-row>
        <span>第一行Toolbar</span>
        <span class="toolbar-seprator"></span>
        <mat-icon>favorite</mat-icon>
      </mat-toolbar-row>
      <mat-toolbar-row>
        第二行Toolbar
        <span class="toolbar-seprator"></span>
        <mat-icon>delete</mat-icon>
      </mat-toolbar-row>
    </mat-toolbar>
```

效果如下：

{% asset_img 06-toolbar-multirow.png %}

乍看之下跟用多個`<mat-toolbar>`很類似，但`<mat-toolbar-row>`本身是沒有`color`可以設定的，而是跟隨著`mat-toolbar`走，另外在語義上也有所不同，在CSS狀況比較複雜時，也可能造成畫面錯亂的問題，因此應該看情境決定使用的時機。

## 本日小結

今天我們學會了另一個前端上常用的元件－Toolbar，Toolbar算是相對簡單的元件，也因為他的簡單，給了開發人員更多的彈性空間去靈活調整，不管是在整個頁面架構上，還是系統內的功能畫面，都有很大的機會去使用到，好好熟練Toolbar的用法對於功能畫面的開發會很有幫助喔！

明後天我們再來學習使用其他元件，來豐富這兩天學到的SideNav和Toolbar的內容吧！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-06-toolbar

分支：day-06-toolbar

## 相關資源

-   [Material Design - Toolbars](https://material.io/guidelines/components/toolbars.html#)
-   [Angular Material - Toolbar](https://material.angular.io/components/toolbar/overview)
