---
title: "[Angular Material完全攻略]打造基本後台(3) - List"
date: 2017-12-25 17:01:42
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatList
---

昨天我們把整個後台系統的架構基本上完成了，今天我們要來學習使用Angular Material的List元件，來填滿SideNav。List元件功能非常強大，而且也是個在任何地方都很有可能會用到的功能，善用List可以產生各種不同的變化來滿足各種需求，Let's GO！

<!-- more -->

## 關於Material Design中的List

在[Material Design的List設計指南](https://material.io/guidelines/components/buttons.html#)中，List是在一欄中呈現多個資料列，每一列就是一組資料，在資料列中我們能夠清楚的呈現相關的資訊，如果有需要，也能夠對這些資訊進行一些額外的操作。

一個資料列基本上會包含3種資料，非必要但可以參考：

1.  **Avatar**：可以是一個頭像或是Icon，用來做為這筆資料的基本代表；在畫面上我們應該能從這裡立即得了解資訊的大致含義。
2.  **內容**：主要的文字內容，通常是單行文字，必要的時候多行文字也沒有問題，只要畫面能清楚呈現即可。
3.  **行動 or 資訊**：代表資料的補充訊息，可能是個警告的icon，或是一個按下去會有其他行為的按鈕等等。

{% asset_img 00-list-intro.png %}

圖片來源：https://material.io/guidelines/components/lists.html#lists-specs

## 開始使用Angular Material的List元件

### 使用mat-list及mat-list-item

使用List元件前，我們必須加入`MatListModule`，之後可以使用`<mat-list>`及`<mat-list-item>`的組合來完成一個基本的List：

```html
<mat-list>
  <mat-list-item>問卷調查</mat-list-item>
  <mat-list-item>部落格</mat-list-item>
  <mat-list-item>收件夾</mat-list-item>
</mat-list>
```

結果如下：

{% asset_img 01-basic-list.png %}

這是一個很單純的清單資料，不過我們在SideNav中，希望是能夠點選的Link，好在`<mat-list-item>`不僅僅是component，也能夠以directive的方式呈現，因此我們稍微做點調整：

```html
<mat-list>
  <a [routerLink]="['/', 'dashboard', 'survey']" mat-list-item>問卷調查</a>
  <a [routerLink]="['/', 'dashboard', 'blog']" mat-list-item>部落格</a>
  <a [routerLink]="['/', 'dashboard', 'inbox']" mat-list-item>收件夾</a>
</mat-list>
```

結果如下：

{% asset_img 02-nav-item-in-link.gif %}

一個可以點選的List就出現啦！這裡可以注意到一件非常有趣的事情，當我們展開選單時，預設會focus在第一個項目，同時我們可以使用`tab`來切換，更棒的是使用tab切換時，不會切換到List之外的內容，只會在List之內循環，許多清單類型的Angular Material都具有這樣的特性，讓使用鍵盤操作時的情境可以更加靈活。

{% note info %}
我們也能夠在自己的component中做到這個特性，這在未來的**Angular CDK篇**時會再作介紹。
{% endnote %}

### 使用mat-nav-list

剛剛的例子我們已經在SideNav導覽列中加入了選單，但是在導覽列的選單連結中有底線有違我們一般的習慣，我們可以用CSS把它調整調，但Angular Material提供了更優質的做法，也就是另一個元件`mat-nav-list`，這個元件可以使用在導覽用的list中，我們只要把原來的`mat-list`換掉即可

```html
<mat-nav-list>
  <a [routerLink]="['/', 'dashboard', 'survey']" mat-list-item>問卷調查</a>
  <a [routerLink]="['/', 'dashboard', 'blog']" mat-list-item>部落格</a>
  <a [routerLink]="['/', 'dashboard', 'inbox']" mat-list-item>收件夾</a>
</mat-nav-list>
```

結果如下：

{% asset_img 03-mat-nav-list.gif %}

可以看到不僅底線不見了，連focus的樣式也變成灰底而不是系統預設的藍色外框，我們一樣能用tab在這些清單項目中切換，同時點下去還有漣漪的特效，操作爽度百分百！

### 使用matSubheader及mat-divider

當清單料很多時，我們可能會需要將資料分類顯示，這時候我們可以使用`matSubheader`這個directive，替每組資料標上一個分類名稱。

除此之外，我們也可以使用`mat-divider`這個component來分隔不同群組的資料。

```html
<mat-nav-list>
  <h3 matSubheader>示範用頁面</h3>
  <a [routerLink]="['/', 'dashboard', 'survey']" mat-list-item>問卷調查</a>
  <a [routerLink]="['/', 'dashboard', 'blog']" mat-list-item>部落格</a>
  <a [routerLink]="['/', 'dashboard', 'inbox']" mat-list-item>收件夾</a>
  <mat-divider></mat-divider> 
  <!-- 另外一組選單 -->
  <h3 matSubheader>其他頁面</h3>
  <a [routerLink]="['/']" mat-list-item>首頁</a>
  <a [routerLink]="['/']" mat-list-item>Google</a>
  <a [routerLink]="['/']" mat-list-item>Facebook</a>
</mat-nav-list>
```

結果如下：

{% asset_img 04-subheader.png %}

可以看到matSubheader的內容會變成灰色的文字說明，而且也不會被tab選中。同時被`<mat-divider>`分隔的兩組選單之間也多了一條灰色的線，讓分隔更加明確。

### 使用matLine讓清單資料以多行方式顯示

`<mat-list-item>`預設是一行文字，但當有需要的時候，我們也可以使用`matLine`來建立多行文字。

```html
<mat-nav-list>
  <h3 matSubheader>多行文字示範</h3>
  <mat-list-item>
    <p matLine>床前明月光</p>
    <p matLine>疑是地上霜</p>
  </mat-list-item>
  <mat-list-item>
    <p matLine>參加ＩＴ鐵人賽</p>
    <p matLine>功力增加一甲子</p>
  </mat-list-item>
</mat-nav-list>
```

結果如下：

{% asset_img 05-multiline.png %}

可以發現我們沒有做任何設定，但第一行的文字就是會比較大點，因為第一行文字通常代表的是主要訊息，之後的文字則是以補充為主，因此會小一點點。

### 使用matListAvatar顯示產生頭像

在清單中使用頭像是很常見的一種應用，像是許多通訊軟體都會採用這種設計方式，要在清單中使用頭像可以在頭像加上`matListAvatar`：

```html
<h3 matSubheader>好友訊息</h3>
<mat-list-item>
  <img matListAvatar src="..." />
  <p matLine>志玲</p>
  <p matLine>hi，好久不見，最近好嗎？</p>
</mat-list-item>
<mat-list-item>
  <img matListAvatar src="..." />
  <p matLine>依晨</p>
  <p matLine>找時間吃個飯吧？</p>
</mat-list-item>
```

結果如下：

{% asset_img 06-avatar.png %}

### 在清單右方加上動作icon

在Material Design中的清單，所有的執行動作按鈕預設都會放在最後方，因此在Angular Material中，只要加入按鈕，都會直接被推到最後面：

```html
<mat-list-item>
  <img matListAvatar src="..." />
  <p matLine>志玲</p>
  <p matLine>hi，好久不見，最近好嗎？</p>
  <!-- button會自動被推到最後面 -->
  <button mat-icon-button><mat-icon>chat</mat-icon></button>
</mat-list-item>
<mat-list-item>
  <!-- 即使icon button放在前面，還是會被往後推 -->
  <button mat-icon-button><mat-icon>chat</mat-icon></button>
  <img matListAvatar src="..." />
  <p matLine>依晨</p>
  <p matLine>找時間吃個飯吧？</p>
</mat-list-item>
```

結果如下：

{% asset_img 07-action-button.gif %}

### 可複選的mat-selection-list

在List中，還有一個比較複雜的component－`mat-selection-list`及`mat-list-option`，可以讓清單變成可複選的列表，並自動在清單列後方加上一個checkbox，在一些功能設定的頁面非常好用。

```html
<mat-nav-list>
  <h3 matSubheader>
    <mat-icon>chat_bubble</mat-icon>
    新訊息
  </h3>
  <mat-list-item *ngIf="optNew.selected">這是新消息</mat-list-item>
  <mat-list-item *ngIf="optAds.selected">這是廣告消息</mat-list-item>

  <mat-divider></mat-divider>
  <h3 matSubheader>
    <mat-icon>settings</mat-icon>
    訊息設定
  </h3>
  <mat-selection-list>
    <mat-list-option [value]="1" selected="true" #optNew>有新訊息時通知我</mat-list-option>
    <mat-list-option [value]="2" #optAds>顯示廣告訊息</mat-list-option>
  </mat-selection-list>
</mat-nav-list>
```

成果如下：

{% asset_img 08-mat-selectoin-list.gif %}

更多`mat-selection-list`和`mat-list-option`的API可以參考[官方文件](https://material.angular.io/components/list/api#MatListOption)。

## 本日小結

今天我們把Angular Material的List功能整個玩過了一遍，並且為原來的SideNav填入了各式各樣的List，List可是說是泛用性非常高的一個元件，因此把List學好，對於前端畫面的設計絕對是有很大的加分效果。

明天我們在學習另一個元件－Ｍenu，來把上方的Toolbar也變得更加豐富吧！

本日的程式碼GitHub：

## 相關資源

-   [Material Design - Lists](https://material.io/guidelines/components/buttons.html#)
-   [Angular Material - List](https://material.angular.io/components/list/overview)
