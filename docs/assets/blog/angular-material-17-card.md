---
title: "[Angular Material完全攻略]設計一個部落格(2) - Card"
date: 2018-01-04 13:06:38
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
---

在昨天介紹完Grid List之後，今天我們要介紹一個Material Design中被使用頻率非常高，且個人認為是Material Design中很經典的元件－Card。我們將利用Card來當作部落格列表的呈現方式。

<!-- more -->

## 關於Material Design中的Card

在[Material Design的Cards設計指南](https://material.io/guidelines/components/cards.html#)中，Card是用來針對某一個**主題**放置圖片、文字或連結的地方，它能夠把這些圖片、文字或連結都整合到一個卡片之中，而這個卡片就代表了我們的目標主題。

由於Card是Material Design中最主要的資料顯示方式，因此裡面的資料呈現也有很多不同豐富的變化，建議可以直接進去說明文裡面看，會對於Card的呈現方式更加的有感覺。

## 開始使用Angular Material的Card

### 先調整一下Grid List

在開始使用Card之前，我們要先將原來的Grid List排版做點調整，我們預期的最終結果如下：

{% asset_img 01-scaffold.png %}

在主要的文章清單中，最上方位有兩個置頂文章，而下面會顯示6篇文章，每篇寬度佔1格cell；高度在規劃後，置頂文章需要佔掉2格cell，清單文章需要佔掉6格cell，6篇共3列，就會用掉18格cell的高度，加上置頂文章的2格，共20格cell的高度；另外加上上下橫幅各1格，加起來**總共會用掉22格cell的高度**，因此原來放置右邊選單的Tile 2高度我們會重新設定為`rowspan="22"`。

另外，昨天我們把Tile 3當作整個放文章的容器，但目前`<mat-grid-list>`是沒辦法直接巢狀使用的，也就是在`<mat-grid-tile>`中，我們是無法加上`<mat-grid-list>`的，雖然不會出錯，但也不會顯示內容(實際上是跑掉了)，比較簡單的方式就是重新規劃好`cols`及`rowHeight`，每個Tile裡面就直接放置內容就好。

另外我們也把`gutterSize`拿掉，以免影響內容顯示，調整後的程式碼大致如下：

```html
<mat-grid-list cols="3" rowHeight="100px">
  <mat-grid-tile style="background: red" colspan="2">
    Tile 1(橫幅廣告)
  </mat-grid-tile>
  <mat-grid-tile style="background: green" rowspan="22">
    Tile 2(右邊清單資訊)
  </mat-grid-tile>

  <mat-grid-tile rowspan="2" style="background: blue">
    置頂文章1
  </mat-grid-tile>
  <mat-grid-tile rowspan="2"  style="background: blue">
    置頂文章2
  </mat-grid-tile>

  <mat-grid-tile *ngFor="let post of posts$ | async" rowspan="6"  style="background: blue">
    {{ post.title }}
  </mat-grid-tile>

  <mat-grid-tile style="background: yellow" colspan="2">
    Tile 4(下方橫幅廣告)
  </mat-grid-tile>
</mat-grid-list>

```

看起來如下：

{% asset_img 02-reset-grid-list.png %}

{% note info %}

資料來源：https://jsonplaceholder.typicode.com/

{% endnote %}

接下來在加入`MatCardModule`之後，我們就正式開始用Card元件來填滿我們的tile吧！

### 使用mat-card建立卡片

我們可以使用`<mat-card>`立刻建立一個簡單的卡片，如下：

```html
<mat-grid-tile *ngFor="let post of posts$ | async" rowspan="6">
  <mat-card>
    {{ post.title }}
  </mat-card>
</mat-grid-tile>
```

一個簡單的卡片就完成啦！

{% asset_img 03-mat-card-basic.png %}

不過目前可以看到排版有點奇怪，由於`<mat-grid-tile>`會把資料都置中，因此卡片的位置也會放在正中間，並且隨著內容變寬變高，這個問題不難，用CSS調整一下就好：

```css
.post-tile {
  align-self: flex-start;
  width: 100%;
  margin: 5px;
}
```

接著只要為卡片加上這個class

```html
<mat-card class="post-tile"></mat-card>
```

就可以看到如下結果，卡片就乖乖地放到比較適合的位置囉。

{% asset_img 05-mat-card-align.png %}

### 其他mat-card內可用的功能

在`<mat-card>`內，有一些內建的directive，如下：

| directive              | 內容                      |
| ---------------------- | ----------------------- |
| `<mat-card-title>`     | 卡片標題                    |
| `<mat-card-subtitle>`  | 卡片子標題                   |
| `<mat-card-content>`   | 主要的卡片內容，會在四周留下一些空白來放置文字 |
| `<img mat-card-image>` | 卡片的圖片，會隨著卡片大小自動延展       |
| `<mat-card-actions>`   | 卡片底部用來放置一些執行動作按鈕的區塊     |
| `<mat-card-footer>`    | 卡片的最底部                  |

這些directives可以為卡片內的內容加上一些內建的顯示樣式，我們直接試著把這些directives加到卡片中吧：

```html
<mat-grid-tile *ngFor="let post of posts$ | async" rowspan="6"> 
  <mat-card class="post-tile"> 
    <mat-card-title>{{ post.title.substring(0, 15) }}...</mat-card-title> 
    <mat-card-subtitle>User Id: {{ post.userId }}</mat-card-subtitle> 
    <img mat-card-avatar src="https://picsum.photos/300/300/?random" /> 
    <img mat-card-image src="https://picsum.photos/300/300/?random" /> 
    <mat-card-content>{{ post.body.substring(0, 100) }}...</mat-card-content> 
    <mat-card-actions> 
      <button mat-button color="paimray">繼續閱讀</button> 
      <button mat-button color="accent">編輯</button> 
    </mat-card-actions> 
    <mat-card-footer>IT鐵人賽系列好文</mat-card-footer> 
  </mat-card> 
</mat-grid-tile> 
```

{% note info %}

我們使用的圖片服務：https://picsum.photos

由於圖片每次是隨機的，所以接下來的截圖中顯示圖片的部份每次都會不一樣。

{% endnote %}

結果如下：

{% asset_img 07-mat-card-with-directives.png %}

一張內容豐富的卡片就完成囉！

另外針對`<mat-card-actions>`，我們也可以設定`align`為`start`(預設值)或`end`，來決定按鈕的對齊方向

```html
<mat-card-actions align="end">
  <button mat-button color="paimray">繼續閱讀</button>
  <button mat-button color="accent">編輯</button>
</mat-card-actions>
```

結果如下：

{% asset_img 07-mat-card-actions-align.png %}

### 使用mat-card-header

在上面的卡片有一個看起來奇怪的地方，就是`<mat-card-title>`、`<mat-card-subtitle>`和`<img mat-card-avatar>`是一列一列顯示的，如下：

{% asset_img 08-mat-card-header-before.png %}

這有點不符合我們的期待，也太佔空間了，這時候我們可以使用`<mat-card-header>`這個元件把上述的directives包起來：

```html
<mat-card-header>
  <mat-card-title>{{ post.title.substring(0, 15) }}...</mat-card-title>
  <mat-card-subtitle>User Id: {{ post.userId }}</mat-card-subtitle>
  <img mat-card-avatar src="https://picsum.photos/300/300/?random" />
</mat-card-header>
```

成果如下：

{% asset_img 09-mat-card-header-after.png %}

### 調整mat-card-image顯示方式

關於`mat-card-image`，由於圖片預設會**以正方形呈現**，且隨著卡片大小自動延伸，但我們的`<mat-grid-tile>`高度是固定的，這時候可能反而會因為圖片太大而造成卡片下方的資料無法完整顯示，如下

{% asset_img 10-mat-card-image-problem.gif %}

如果以顯示完整資料為主，不介意圖片形狀被改變的話，這時候我們可以透過設定CSS來固定圖片的高度，例如：

```css
.post-tile .mat-card-image {
  max-height: 300px;
}
```

`.mat-card-image`這個CSS class是哪裡來的呢？

在所有`<mat-card>`的directive再加入後都會自動加入一個與名稱相同的class(**實際上所有的Angular Material元件都會這做，方便我們自訂樣式**)，因此我們的`<img mat-card-image>`在顯示時實際上會是`<img mat-card-image class="mat-card-image">`，這麼一來就可以輕鬆透過CSS來做一些樣式的調整，在這裡我們可以使用這種技巧，直接去調整`mat-card-image`這個class。

成果如下：

{% asset_img 11-mat-card-image-custom-style.gif %}

### 使用mat-card-title-group

我們剛剛使用過了`<mat-card-header>`來組合`<mat-card-title>`、`<mat-card-subtitle>`和`<img mat-card-avatar>`，而`<img mat-card-avatar>`主要是用來放置使用者的頭像，在Material Design中對於卡片還有另外一種顯示方式，是把縮圖放在標題的右邊，如下圖：

{% asset_img 12-card-title-sample.png %}

這個功能我們可以使用`<mat-card-title-group>`來達成，`<mat-card-title-group>`可以組合以下directive：

-   `<mat-card-title>`
-   `<mat-card-subtitle>`
-   以下其中一個
    -   `<img mat-card-sm-image>`：80 x 80
    -   `<img mat-card-md-image>`：112 x 112
    -   `<img mat-card-lg-image>`：152 x 152

我們可以試試看把預期放置頂文章的部分，用這種方式顯示資料：

```html
<mat-grid-tile rowspan="2">
  <mat-card class="post-tile">
    <mat-card-title-group>
      <mat-card-title>置頂文章1</mat-card-title>
      <mat-card-subtitle>2917/01/04</mat-card-subtitle>
      <img mat-card-sm-image src="https://picsum.photos/300/300/?random" />
    </mat-card-title-group>
    <mat-card-content>文章內容1...</mat-card-content>
    <mat-card-actions>
      <button mat-button color="paimray">繼續閱讀</button>
    </mat-card-actions>
  </mat-card>
</mat-grid-tile>
```

成果如下：

{% asset_img 13-mat-card-title.png %}

是不是有另外一種感覺啊！

### 設定tabindex讓卡片可以focus

`<mat-card>`是可以被focus的，我們只需要設定好它的`tabindex`即可，透過這種設定我們可以讓卡片跟清單一樣，擁有**被選擇**的功能：

```html
<mat-grid-tile *ngFor="let post of posts$ | async; let index = index" rowspan="6">
  <mat-card class="post-tile" [tabindex]="index">
    ...
  </mat-card>
</mat-grid-tile>
```

我們為卡片加上`:focus`的樣式，來看看確認它是可以被選中的：

```css
mat-card:focus {
  background: lightblue;
}
```

成果如下：

{% asset_img 14-mat-card-focus.png %}

可以看到被focus的`<mat-card>`不僅擁有瀏覽器內建被選擇的提示框，我們也可以直接使用`:focus`的css selector來設定它的樣式，非常方便吧！

## 本日小結

今天我們介紹Angular Material中的卡片元件(card)，這個元件的應用範圍非常廣，也是目前很主流的一種顯示模式，幾乎各種資料的顯示都可以使用卡片來呈現，只是變換不同的樣式而已，因此好好的把卡片學會，對於使用Angular Material咖發應用程式會有很大的幫助喔！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-17-card

分支：day-17-card

## 相關資源

-   [Material Design - Cards](https://material.io/guidelines/components/cards.html#)
-   [Angular Material - Card](https://material.angular.io/components/card/overview)
