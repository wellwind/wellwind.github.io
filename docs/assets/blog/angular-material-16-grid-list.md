---
title: "[Angular Material完全攻略]設計一個部落格(1) - Grid List"
date: 2018-01-03 17:06:38
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
---

在前幾天介紹完各式各樣的表單元件後，今天我們要先來看看在Material Design其中一種顯示清單資料的方法－Grid List，以及Angular Material中如何實現應用這樣的方法，把一個簡易的部落格版型給切出來！

<!-- more -->

## 關於Material Design中的Grid List

在[Material Design的Grid Lists設計指南](https://material.io/guidelines/components/grid-lists.html#)中，Grid List是一種用**網格**呈現重複性資料方式，可以想像成是用來放置多組類似的元件的容器，**具有水平和垂直的排列組合**，來呈現資料。由於有水平和垂直的排列組合，我們也可以想像Grid List是一種類似表格式的排版(當然不會真的用`<table>`去做排版)。

{% asset_img 01-grid-list-basic-concept.png %}

Grid List使用的是網格的概念，每一個格子我們會稱之為Cell；Tile則代表用來放置內容的容器，且一個Tile是可以橫跨多個Cells的。

{% asset_img 02-grid-list-cell-tile.png %}

以上圖片來源：https://material.io/guidelines/components/grid-lists.html

接著我們就實際來寫寫看程式，畢竟對於工程師來說，還是透過寫程式最容易理解一個概念啦！

## 開始使用Angular Material的Grid List

在Angular Material中Grid List主要由兩個元件組成，分別是：

-   `<mat-grid-list>`：用來設定Grid List的基本狀態
-   `<mat-grid-tile>`：放置在`<mat-grid-list>`中，代表一個又一個的tile，我們可以在`<mat-grid-tile>`中設定它會橫跨幾個垂直或水平的cell。

只需要加入`MatGridListModule`，就可以開始使用Grid List的功能囉。

雖然Grid List適合用來放置重複型的清單資料，但也很適合**當作一個排版系統來使用**，雖然針對排版Angular也有一套`angular/flex-layout`可以使用，但這套目前還是beta版，且進度緩慢，拿來用在production還是會覺得抖，而且若flex不是很熟，使用上也不太容易；反觀Angular Material的Grid Lsit，它的概念就相對簡單很多，而且使用上非常貼近我們都熟悉的Table；雖然功能沒那麼強大，但是對於基本的排版可以說是完全沒問題！因此接下來我們介紹時也會把它當作排版系統使用，但實際上你要用它來呈現清單資料等等是完全沒問題的！

### 使用mat-grid-list

所有的Grid List都是使用`<mat-grid-list>`作為起手式，而`<mat-grid-list>`至少需要設定一個參數：`cols`，代表這個Grid List會有幾個欄位資料。

```html
<mat-grid-list cols="3"></mat-grid-list>
```

在這裡我們設定`cols="3"`，`<mat-grid-list>`會自動佔滿可以使用的寬度，然後平均分成3等分(cell)。

接著我們可以在裡面放置`<mat-grid-tile>`，代表每一個資料呈現的區塊，`<mat-grid-list>`則會依照`cols`的設定，決定每列放置多少個`<mat-grid-tile>`

```html
<mat-grid-list cols="3">
  <mat-grid-tile style="background: red">
    Tile 1
  </mat-grid-tile>
  <mat-grid-tile style="background: green">
    Tile 2
  </mat-grid-tile>
  <mat-grid-tile style="background: blue">
    Tile 3
  </mat-grid-tile>
  <mat-grid-tile style="background: yellow">
    Tile 4
  </mat-grid-tile>
</mat-grid-list>
```

結果如下圖：

{% asset_img 03-grid-list-basic.png %}

可以看到每個`<mat-grid-tile>`所佔的寬度為三分之一，因此第四個tile就會被放置到第二列(row)上，一個基本的Grid List就完成囉。

### 在mat-grid-list中使用rowHeight設定每列高度

`<mat-grid-list>`會依照`col`的設定來**切割cell，此時每個cell的寬度會平均**，假設`<mat-grid-list>`佔滿寬度後是`300px`，此時每個cell的寬度就是`100px`，同時`<mat-grid-list>`也會將高度視為`100px`，**成為一個正方形**，這麼一來**螢幕越寬，每個cell的高度就越高**，這樣的高度未必是我們要的，因此我們可以藉由設定`rowHeight`來控制高度。

例如我們希望每列高度是`100px`，則可以如下設定：

```html
<mat-grid-list cols="3" rowHeight="100px">
  ...
</mat-grid-list>
```

結果如下：

{% asset_img 04-grid-list-row-height.png %}

每列的高度就會變成如我們所設定的，而非每個cell都是正方形了！

除此之外，我們也可以給予一個比例的字串，來決定寬跟高的比例，這時候高度就會依照目前tile寬度自動去計算

```html
<mat-grid-list cols="3" rowHeight="4:1">
  ...
</mat-grid-list>
```

### 使用rowspan和colspan設定mat-grid-tile所佔的cell

如同前面提到的，一個tile可以水平和垂直的跨越多個cell，在Angular Material中我們可以設定`<mat-grid-tile>`的`rowpspan`和`colspan` (預設都是1) 來控制每個tile跨越的列和欄。

{% note info %}

覺得很眼熟嗎？沒錯！就跟table的`rowspan`和`colspan`是一樣的概念，只是使用table排版是眾所皆知的罪惡(?)，而在`<mat-grid-list>`中所使用的排版系統是flex，但是排版起來卻像容易理解哩。

{% endnote %}

接著我們來試試看作以下調整：

首先把原來的Tile 1當作是廣告橫幅，因此要橫向跨越2個cell(也就是`colspan`)

```html
<mat-grid-tile style="background: red" colspan="2">
  Tile 1(橫幅廣告)
</mat-grid-tile>
```

結果：

{% asset_img 05-col-span.png %}

此時Tile 2就被擠到最右邊，正好可以當作是右邊的最新文章等等的清單，讓他垂直跨越5個cell(也就是`rowspan`)

```html
<mat-grid-tile style="background: green" rowspan="5">
  Tile 2(右邊清單資訊)
</mat-grid-tile>
```

結果：

{% asset_img 06-row-span.png %}

接著我們先看Tile 4，一樣希望他是一個在最下面的橫幅廣告，因此讓他跨越2個cell，程式碼如Tile 1的設定，結果如下：

{% asset_img 07-tile4-colspan.png %}

由於Tile 2垂直跨越5個cell的關係，導致第二列只剩下2個cell可以用，而原來的Tile 3已經佔用1個cell，所以佔用2個cell的Tile 2無法盎在Tile 3旁邊，就被推到下方去了。

接著我們測試看看，在第二列只剩下2個cell可以用的情看下，設定`colspan=3`會有什麼結果：

{% asset_img 08-bad-set-tile.png %}

結果就是因為放不下了，會一路找到可以放置的空間，再把它放下去。

那麼如果設定`colspan=4`讓它超過原來`cols=3`的設定呢？

{% asset_img 09-bad-set-tile-2.png %}

結果就是一片空白，然後跳出錯誤訊息啦！這種細節Angular Material才不會忘記呢！

測試到此結束，讓我們認真的設定Tile 3，我們希望Tile 3用來放置接下來部落格列表的資訊，我們可以合併使用`colspan`和`rowspan`填滿剩下的空間！

```html
<mat-grid-tile style="background: blue" colspan="2" rowspan="3">
  Tile 3(文章內容區)
</mat-grid-tile>
```

成果如下，是不是越來越有一個部落格版型的樣子啦！

{% asset_img 10-tile3-setting.png %}

### 使用gutterSize調整cell的間距

我們可以在`<mat-grid-list>`中使用`gutterSize`來調整每個cell之間的間距，可以使用`px`、`em`或`rem`為單位

```html
<mat-grid-list cols="3" rowHeight="100px" gutterSize="20px">
```

結果如下：

{% asset_img 11-gutter-size.png %}

### 為mat-grid-tile加上header與footer

在每個tile內，我們可以使用`<mat-grid-tile-header>`和`<mat-grid-tile-footer>`，為我們的`<mat-grid-tile>`加上header跟footer：

```html
<mat-grid-tile style="background: green" rowspan="5">
  <mat-grid-tile-header>
    <h3 mat-line>功能清單</h3>
    <span mat-line>選擇你要的</span>
    <mat-icon>list</mat-icon>
  </mat-grid-tile-header>

  <mat-grid-tile-footer>
    <span mat-line>生是IT人</span>
    <span mat-line>死是IT魂</span>
    <span mat-line>但我不想死</span>
    <mat-icon>thumb_up</mat-icon>
  </mat-grid-tile-footer>
  Tile 2(右邊清單資訊)
</mat-grid-tile>
```

結果如下：

{% asset_img 12-mat-grid-tile-header-footer.png %}

## 本日小結

今天我們介紹了一個很重要的元件－Grid List，透過Grid List我們可以用比較視覺化的方式來呈現重複性的資料，同時我們也能使用Grid List來當作的排版系統使用，不管是呈現資料還是依照需求切割畫面都非常好用。

藉由Grid List我們今天完成了基本部落格版型的排版，明天我們要來介紹Material Design中最常用來呈現資料的Card囉！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-16-grid

分支：day-16-grid-list

## 相關資源

-   [Material Design - Grid Lists](https://material.io/guidelines/components/grid-lists.html#)
-   [Angular Material - Grid List](https://material.angular.io/components/grid-list/overview)
