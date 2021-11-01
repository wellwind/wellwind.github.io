---
title: "[Angular Material完全攻略]設計一個部落格(3) - Progress Bar、Progress Spinner"
date: 2018-01-05 18:00:12
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
---

昨天我們介紹了好用的Card，並透過Card來顯示部落格的文章，今天我們要來介紹兩個跟**顯示進度**有關係的元件，分別是Progress Bar和Progress Spinner，儘管這兩個元件相對簡單很多，但在SPA架構下，這兩個元件可以說是非常核心的功能哩。

<!-- more -->

## 關於Material Design中的Progress Bar和Progress Spinner

Progress Bar和Progress Spinner被歸納在[Material Design的Progress & activity設計指南](https://material.io/guidelines/components/progress-activity.html#)中，主要是用來提示使用者**內容正在讀取中**，依照顯示的位置不同，可以使用長條的顯示(Progress Bar)、或是圓形的顯示(Progress Spinner)，適合使用在讀取(或重新整理)新的資料時，告知使用者內容正在讀取中；依照使用情境不同，我們也能選擇讓使用者知道目前確定的進度(**Determinate indicators**)，或是顯示不確定的進度(**Indeterminate indicators**)。

{% asset_img 00-components-progress-and-activity.png %}

圖片來源：https://material.io/guidelines/components/progress-activity.html

##開始使用Angular Material的Progress Bar

讓我們先從Progress Bar開始學習起，依照古老(也就是前10多篇)的慣例，我們可以在加入`MatProgressBarModule`後，開始使用Progress Bar的相關功能。

### 使用mat-progress-bar

我們在原來的部落格邊欄部分，放一個簡單的Progress Bar看看，只需要加入`<mat-progress-bar>`就好

```html
<mat-grid-tile rowspan="22">
  ...
  <div class="blog-sidebard-content">
    <h4>
      發文進度
    </h4>
    <mat-progress-bar></mat-progress-bar>
  </div>
</mat-grid-tile>
```

另外我們加了一個小樣式，讓資料呈現比較清楚

```css
.blog-sidebard-content {
  align-self: flex-start;
  padding-top: 100px;
  width: 95%;
}
```

結果如下：

{% asset_img 01-mat-progress-bar-basic.png %}

一個超基本的Progress Bar就完成啦！接著我們把進度填進去吧。

要顯示進度，只需要設定`value`屬性即可，這裡我們沒有`min`、`max`等屬性可以設定，預設就是0~100，低於或超過都不會影響呈現的變化：

```html
<mat-progress-bar value="60"></mat-progress-bar>
```

使用`value="60"`或是`[value]="60"`都可以，字串或數字對結果不會有影響，結果如下：

{% asset_img 02-mat-progress-bar-with-value.png %}

進度就明顯的顯示上去囉，例外一個有趣的是，當數字在變化時，還能夠看到動畫的效果！

```html
<mat-progress-bar [value]="progress"></mat-progress-bar>
<button mat-raised-button (click)="progress = progress - 10">-10</button>
<button mat-raised-button (click)="progress = progress + 10">+10</button>  
```

成果如下：

{% asset_img 03-mat-progress-bar-with-animation.gif %}

很生動吧！

### 調整mat-progress-bar的模式

`<mat-progress-bar>`有一個屬性`mode`，具有4種模式，分別代表不同的顯示方式：

-   **determinate**：預設值，會依照`value`屬性決定進度

-   **buffer**：除了原來的`value`以外還可以設定`bufferValue`屬性，會在`value`和`bufferValue`之間多一塊緩衝區，而空白的部分則會變成另一種效果的顯示方式

    ```html
    <h4>Buffer Progress Bar</h4>
    <mat-progress-bar mode="buffer" value="30" bufferValue="60"></mat-progress-bar>   
    ```

    成果：

    {% asset_img 05-buffer-progress-bar.gif %}


-   **indeterminate**：代表不確定的進度，`value`和`bufferValue`屬性都不能使用，當需要使用者進行等待的時候適用。

    ```html
    <h4>indeterminate Progress Bar</h4>
    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    ```

    成果：

    {% asset_img 04-indeterminate-progress-bar.gif %}

-   **query**：跟indeterminate一樣，但進度的方向剛好相反，適合在loading之前的前置準備時使用，要進入loading時再調整成`indeterminate`

    ```html
    <h4>Query Progress Bar</h4>
    <mat-progress-bar mode="query"></mat-progress-bar>
    ```

    成果：

    {% asset_img 06-query-progress-bar.gif %}

### 調整Progress Bar的顏色

一樣還是老規則，只需要設定`color`為`primary`、`accent`和`warn`即可切換顏色。

```html
<h4>Primary</h4>
<mat-progress-bar mode="buffer" color="primary"></mat-progress-bar>

<h4>Accent</h4>
<mat-progress-bar mode="buffer" color="accent"></mat-progress-bar>

<h4>Warn</h4>
<mat-progress-bar mode="buffer" color="warn"></mat-progress-bar>
```

結果如下：

{% asset_img 07-color-progress-bar.gif %}

### 應用

由於是扁長型的顯示方式，因此放在一些獨立顯示的元件如Card下可以說是非常適合：

```html
<mat-card class="post-tile" [tabindex]="index">
  ...
  <mat-card-footer>
    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
  </mat-card-footer>
</mat-card>
```

成果如下：

{% asset_img 13-mat-progress-bar-in-card-footer.gif %}

當某個按鈕按下去，直接在卡片下方顯示loading狀態，看起來完全沒有違和感啊！

## 開始使用Angular Material的Progress Spinner

Progress Spinner基本上概念跟Progress Bar大同小異，只是從直條顯示變成圓形而已，加入`MatProgressSpinnerModule`後，直接使用`<mat-progress-spinner>`即可：

```html
<h4>Progress Spinner</h4>
<mat-progress-spinner [value]="progress"></mat-progress-spinner>
<button mat-raised-button (click)="progress = progress - 10">-10</button>
<button mat-raised-button (click)="progress = progress + 10">+10</button>
```

結果：

{% asset_img 08-mat-progress-spinner-basic.gif %}

很簡單吧！

### 設定mat-progress-spinner的模式

`<mat-progress-spinner>`的`mode`只有兩個：

-   **determinate**：預設值，會透過`value`決定進度顯示。

-   **indeterminate**：代表進度不確定，會忽略`value`的設定。

    ```html
    <h4>Indeterminate Progress Spinner</h4>
    <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    ```

    成果：

    {% asset_img 09-indeterminate-progress-spinner.gif %}

### 設定mat-progress-spinner的線條粗細

`<mat-progress-spinner>`還有一個`strokeWidth`屬性，我們可以透過這個屬性來調整它的線條寬度

```html
<h4>Spinner Stroke Width</h4>
<mat-progress-spinner value="60" [strokeWidth]="strokeWidth"></mat-progress-spinner>
<button mat-raised-button (click)="strokeWidth = strokeWidth - 1">-1</button>
{{ strokeWidth }}
<button mat-raised-button (click)="strokeWidth = strokeWidth + 1">+1</button>  
```

成果如下：

{% asset_img 10-progress-spinner-stroke-width.gif %}

### 設定mat-progress-spinner的直徑大小

除了線條寬度以外，透過`diameter`屬性，我們也能調整圓圈的直徑大小：

```html
<h4>Spinner Stroke Width</h4>
<mat-progress-spinner value="60" [diameter]="diameter"></mat-progress-spinner>
<button mat-raised-button (click)="diameter = diameter - 10">-10</button>
{{ diameter }}
<button mat-raised-button (click)="diameter = diameter + 10">+10</button>
```

成果如下：

{% asset_img 11-progress-spinner-diameter.gif %}

### 使用mat-spinner

因為`indeterminate`模式在spinner實在太常用了，因此還有了一個`<mat-spinner>`可以使用；`<mat-spinner>`可以想像成是`<mat-progress-spinner mode="indeterminate">`的縮寫，因此不能額外設定`mode`和`value`，不過`strokeWidth`和`diameter`依然也都可以設定：

```html
<h4>Very Small Spinner</h4>
<mat-spinner [strokeWidth]="1" [diameter]="30"></mat-spinner>
```

成果如下：

{% asset_img 12-mat-spinner.gif %}

### 應用

Progress Spinner由於體積較大的關係，通常會放置在預期會有內容，但目前還沒有內容的地方，等到內容產生後再將其隱藏，例如我們可以在部落格文章讀取完之前，先放上一個Progress Spinner

```html
<ng-template #loading>
  <mat-grid-tile colspan="2">
    <mat-spinner></mat-spinner>
  </mat-grid-tile>
</ng-template>

<ng-container *ngIf="posts$ | async as posts; else loading">
  <mat-grid-tile *ngFor="let post of posts; let index = index" rowspan="6">
    ...
  </mat-grid-tile>
</ng-container>
```

結果如下：

{% asset_img 14-mat-spinner-before-load-content.gif %}

看起來就變得清楚多啦！

## 本日小結

在SPA架構下，loading的功能可以說是非常的重要，透過Progress Bar和Progress Spinner，我們可以用很明確的方式讓使用者知道目前的進度狀態。

Progress Bar可以附加在別元件區塊的上下方，讓我們知道這個元件目前的狀態是在讀取中。同時它也有著多采多姿的顯示模式。

Progress Spinner顯示的模式相對單純，但對於資料顯示前的空白時間可以說是最重要的一個元件，沒有這個元件，在讀取資料到畫面上前，只會是一片的空白，光想就覺得可怕啊！

把這兩個元件學好，遇到需要顯示loading狀況時就不怕沒有武器可以應對囉。

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-18-progress-bar-progress-spinner

分支：day-18-progress-bar-progress-spinner

## 相關資源

-   [Material Design - Progress & activity](https://material.io/guidelines/components/progress-activity.html)
-   [Angular Material - Progress Bar](https://material.angular.io/components/progress-bar/overview)
-   [Angular Material - Progress Spinner](https://material.angular.io/components/progress-spinner/overview)
