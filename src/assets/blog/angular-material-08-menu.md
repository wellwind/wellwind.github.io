---
title: "[Angular Material完全攻略]打造基本後台(4) - Menu"
date: 2017-12-26 17:01:42
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatMenu
---

今天我們要來講Angular Material的Menu元件，Menu可以說是非常具有歷史性的功能，使用機會也不低，只要有一系列的選擇要濃縮在一個範圍內時，就是使用Menu的好時機，接下來就讓我們看看Angular Material強大的Menu元件吧！

<!-- more -->

## 關於Material Design中的Menu

在[Material Design的Menu設計指南](https://material.io/guidelines/components/menus.html#)中，Menu可以用來顯示一系列的選項，每一列就是一個選項，通常由一個按鈕，或一個簡單的文字label開始，在畫面上進行立體的呈現，而不會影響到其他元素的排版。

在桌面應用上Menu可以是多層串接的，在行動裝置或平板上則建議一層簡單的Menu就好，另外Menu的選項也應該是可以被disable的。

{% asset_img 01-menus.png %}

圖片來源：https://material.io/guidelines/components/menus.html#

## 使用Angular Material的Menu元件

要使用Menu元件，首先要先加入`MatMenuModule`。

### 使用mat-menu

我們使用`<mat-menu>`來為原來toolbar的message icon加上Menu選單，首先我們可以再任意地方加入`<mat-menu>`與`<mat-menu-item>`組合的選單。

```html
<mat-menu #messageMenu="matMenu">
  <button mat-menu-item>最新訊息</button>
  <button mat-menu-item>訊息設定</button>
</mat-menu>
```

這時候畫面上還不會有任何資料，還需需要一個可以觸發顯示選單的來源，我們加在toolbar上的message icon上

```html
<button mat-icon-button [matMenuTriggerFor]="messageMenu" #menuTrigger="matMenuTrigger">
  <mat-icon>message</mat-icon>
</button>
```

上面程式我們透過`matMenuTriggerFor`來設定這個按鈕會觸發哪一個menu元件，這時候我們可以執行看看結果：

{% asset_img 02-basic-menus.gif %}

點擊看看原來的message icon按鈕，可以發現menu選單就跳出來啦！這時候我們可以使用上下鍵來切換focus的選項，也可以按下Enter鍵來觸發按鈕的click事件，操作上超級方便的！

### 在程式中開啟選單

要在程式中開啟選單很容易，只要找到`matMenuTriggerFor`，再觸發他的`openMenu()`方法就可以打開menu，透過`closeMenu()`則能夠動態的關閉menu，另外我們也可以透過`toggleMenu()`來開關menu的顯示狀態

```html
<button mat-raised-button (click)="menuTrigger.toggleMenu()">開啟訊息設定</button>
```

效果如下：

{% asset_img 03-toggle-menu.gif %}

### 使用xPosition和yPosition調整選單出現位置

`<mat-menu>`預設會在出現時把整個menuTrigger覆蓋掉，同時也會根據目前所在的位置來決定選單生長的方向，例如按鈕在畫面的右邊的話，選單預設會往左邊長，在畫面上方的話，選單預設會往下長，總之就是會盡量讓整個menu在畫面中可以被看到就對了，我們可以能夠透過`xPosition`和`yPosition`，來控制生長的方向
​
-   **xPosition**：選項為`after`(預設值、從start往end的方向長，通常是從左到右)或`before`(從end往start的方向長，通常是從右到左)。
-   **yPosition**：選項為`below`(預設值、從上往下長)或`above`(從下往上長)
  ​
  舉例來說，一個沒有設定`xPosition`和`yPosition`，且生長方向沒有阻礙時的程式碼和畫面如下：

```html
<div style="text-align:center">
  <button mat-raised-button [matMenuTriggerFor]="positionMenu">開啟訊息設定，這是一條比較長的按鈕，好確認Menu的生長方向</button>
  <mat-menu #positionMenu="matMenu">
    <button mat-menu-item>訊息1</button>
    <button mat-menu-item>訊息2</button>
  </mat-menu>
</div>
```

{% asset_img 04-menu-position-sample-1.png %}

當我們調整xPosition和yPosition如下時：

```html
<mat-menu #positionMenu="matMenu" xPosition="before" yPosition="above">
  <button mat-menu-item>訊息1</button>
  <button mat-menu-item>訊息2</button>
</mat-menu>
```

可以看到生長的方向就變了，有趣的是當我們往下捲動螢幕時，由於menu即將碰到頂端，會立刻改爲往下生長，盡可能讓選單可以被看到，**只能說Angular Material既貼心又聰明啊！**

{% asset_img 05-menu-position-sample-2.gif %}

同樣的當生長方向收到阻礙時，Angular Material會自動幫我們計算要成長的方向

```html
<!-- 按鈕在畫面的很上方，即使設定往上長，當上方空間不足時，會自動往下生長 -->
<mat-menu #positionMenu="matMenu" xPosition="before" yPosition="above">
  <button mat-menu-item>訊息1</button>
  <button mat-menu-item>訊息2</button>
  ...
  <button mat-menu-item>訊息5</button>
</mat-menu>
```

{% asset_img 06-menu-position-sample-3.png %}

另外，我們也可以設定`[overlapTrigger]="false"`，如此一來，選單就永遠不會遮住我們的trigger：

```html
<mat-menu #messageMenu="matMenu" [overlapTrigger]="false">
  <button mat-menu-item>最新訊息</button>
  <button mat-menu-item>訊息設定</button>
</mat-menu>
<button mat-icon-button [matMenuTriggerFor]="messageMenu" #menuTrigger="matMenuTrigger">
  <mat-icon>message</mat-icon>
</button>
```

### 巢狀menu

menu選單可以是巢狀的，要使用巢狀的選單沒有什麼新技巧，一樣把子選單使用`<mat-menu>`設計好，然後在原來的選單選項中加入`matMenuTriggerFor`即可：

```html
<button mat-raised-button [matMenuTriggerFor]="positionMenu">巢狀選單demo</button>
<mat-menu #positionMenu="matMenu">
  <button mat-menu-item [matMenuTriggerFor]="subMenu1">訊息1</button>
  <button mat-menu-item [matMenuTriggerFor]="subMenu2">訊息2</button>
  <button mat-menu-item>訊息3</button>
</mat-menu>

<mat-menu #subMenu1="matMenu">
  <button mat-menu-item>
    <mat-icon>person</mat-icon>
    訊息 1-1
  </button>
  <button mat-menu-item>
    <mat-icon>favorite</mat-icon>
    訊息 1-2
  </button>
  <button mat-menu-item>
    <mat-icon>thumb_up</mat-icon>
    訊息 1-3
  </button>
</mat-menu>

<mat-menu #subMenu2="matMenu">
  <button mat-menu-item>
    <mat-icon>delete</mat-icon>
    訊息 2-1
  </button>
  <button mat-menu-item disabled>
    <mat-icon>settings</mat-icon>
    訊息 2-2
  </button>
</mat-menu>
```

我們在這邊順便搭配了`<mat-icon>`以及嘗試為button加入`disabled`屬性，可以看到搭配上完全都沒有問題，排版依然很順暢，同時我們也能使用左右鍵切換子選單：

{% asset_img 07-nested-menu.gif %}

### 小技巧：搭配使用mat-divider

當要呈現的選單多的時候，除了選擇用巢狀的選單以外，用一個divider分隔也是個不錯的選擇，可以減少子項目難以分類的煩惱，在行動裝置的呈現上也會比較清楚。

還記得我們在昨天介紹List時有提到一個`<mat-divider>`嗎？雖然官方的Menu文件沒有提到，但`<mat-divider>`其實一樣可以在`<mat-menu>`中使用：

```html
<mat-menu #positionMenu="matMenu">
  <button mat-menu-item [matMenuTriggerFor]="subMenu1">訊息1</button>
  <button mat-menu-item [matMenuTriggerFor]="subMenu2">訊息2</button>
  <mat-divider></mat-divider>
  <button mat-menu-item>訊息3</button>
</mat-menu>
```

成果如下，一條分隔線就出現啦：

{% asset_img 08-mat-divider.png %}

{% note info %}

當然，你還是必須要載入`MatListModule`才可以。

{% endnote %}

## 本日小結

關於Menu的使用基本上不會很困難，但實用性卻很高，要調整顯示風格也不會是太困難的事情。

Angular Material在Menu的設計上非常用心，儘管是web application，但在操作上我們依然可以輕鬆地使用方向鍵來切換不同的選項，同時也可以使用Enter來確認執行選項，可以說是非常貼心方便的設計！

介紹到這邊，整個基本的後台畫面就已經大致上成形了！明天開始我們將花幾天的時間透過一個問卷調查的頁面，來介紹Angular Material中各種不同的表單元件的使用，這些表單元件都有很豐富的動態效果，但使用上非常顯示明確，不會被這些效果給混淆，敬請期待吧！！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-08-menu

分支：day-08-menu

## 相關資源

-   [Material Design - Menus](https://material.io/guidelines/components/menus.html#)
-   [Angular Material - Menu](https://material.angular.io/components/menu/overview)
