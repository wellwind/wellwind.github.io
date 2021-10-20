---
title: "[Angular Material完全攻略]雜項技巧(2) - 其他CSS技巧"
date: 2018-01-20 20:46:56
category: "Angular Material完全攻略"
tags:
  - Material Design
  - Angular Material
---

今天來分享一些筆者近期撰寫Angular Material文章，以及開始在實際專案中使用Angular Material所整理出來的一些CSS小技巧，有些在文件上可以輕鬆找到，有些則是遇到後才整理出來的，希望能對各位讀者大大們在使用Angular Material時有所幫助！

<!-- more -->

## 透過Angular Material使用Material Design中的顏色

[昨天的文章在介紹自訂theme時](https://wellwind.idv.tw/blog/2018/01/19/angular-material-32-custom-theme/)，我們提到了內建顏色的`$mat-XXXX`變數，這些變數的實際原始碼看起來如下：

{% asset_img 01-mat-red-sample.png %}

要直接取得裡面的顏色，可以搭配使用SASS的`map-get()`方法，例如要取得紅色色票中亮度為500的顏色代碼，可以使用如下方式：

```scss
.custom-style {
    color: map-get($mat-red, 500);
}
```

如此一來就能取得`#f44336`的色碼啦！

另外在Angular Material中還有定義一個`mat-color()`方法，方便我們設定顏色，以及他的透明度，甚至可以不用擔心亮度，直接使用`darker`或`lighter`參數，來決定定義好的亮度，除此之外也可以直接設定透明度，被用在許多Angular Material中的背景顏色的設定，如以下樣式我們選用暗色調的紅色，以透明度50%，作為樣式的背景：

```scss
.custom-color {
  background: mat-color(mat-palette($mat-red), darker, 0.5);
}
```

關於顏色的定義，除了上[Material Design網站上觀看調色盤](https://material.io/guidelines/style/color.html#color-color-palette)外，也可以直接查[Angular Material的_palette.scss](https://github.com/angular/material2/blob/5.0.x/src/lib/core/theming/_palette.scss)，可以看到完整的顏色變數。

### 使用material-colors套件

其實這已經脫離Angular Material的範圍了，但很值得簡單介紹一下，因為Angular Material的顏色一定要搭配SASS並寫在scss檔中，有時候比較懶惰，只想要單純使用顏色時，若有人直接把相關顏色都訂成對應的class，那實在是太方便了！而[material-colors套件](https://www.npmjs.com/package/material-colors)就是一個幫我們把Material Design顏色都訂成CSS class的好東西！

加入這個style樣式後，我們可以直接使用`class="color-red-500"`，來取得紅色色票且亮度為500的顏色，另外被景色也可以使用`class="bg-red-500"`來達到預期的效果。

除此之外material-colors套件也有定義好的SASS檔，相當值得參考。

## 透過Angular Material使用Material Design中的陰影

在Material Design中，為了讓畫面具有立體感，對於陰影(shadows)的使用可以說是非常講究，這種陰影設計也被稱為elevation，作為元件與元件之間高低差的概念，也就是陰影越深，高度看起來就越高。

下圖是從Material Design設計指南中擷取的圖片，對於各種高度效果的建議：

{% asset_img 02-material-design-elevation.png %}

數值越高代表在畫面呈現上應該在越上層，例如Dialog類型的應該要在最高的位置24，選單Menu在8，而子選單會比選單在高一點，因此在高度9的位置。

當我們自己在設計元件時，為了讓元件更有立體感，可以參考這個高度表，評估一下自己設計的元件屬於哪種元件分類，進而選擇適當的高度，來達到畫面呈現的一致感！

至於具體的CSS樣式到底該如何設計呢？其實Angular Material已經都幫我們設計好啦！只要套用`mat-elevation-zX`的樣式就可以了！`X`的部分，請直接換成對應的高度，例如我們在使用overlay並顯示在整個畫面上時，通常是類似dialog的角色，這時候就可以要顯示元件上加一個`class="mat-elevation-z24"`，就能夠具有一致的顯示啦！

另外我們也能夠使用`mat-elevation()`這個mixin，只需要以適當的高度當作參數帶入，就會產生對應高度的陰影樣式：

```scss
@import '~@angular/material/theming';

.my-custom-button {
  @include mat-elevation(2);
}
```

等於得到如下的陰影樣式：

```css
.my-custom-button {
  box-shadow: 
    0px 3px 1px -2px rgba(0, 0, 0, 0.2), 
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
```

真是省時又省力啊！

## 替某個Angular Material元件客製化樣式

這個技巧在之前其實已經提過幾次，但真的很實用也很重要，因此在這邊再次提一下。在Angular Material中，幾乎所有的元件與directive，都會加上一個與它自己同名的CSS class，例如`mat-button`這個directive會在它的元件上加入同名的CSS class。因此我們可以直接在撰寫CSS時，透過這個class來調整樣式，例如：

```css
.mat-button {
    font-size: 24px;
}
```

透過這樣的方式，要針對某個元件為調整符合需求的呈現就變得非常簡單哩。

## 善用panelClass

Angualr Material中，有許多popup的呈現，都能透過設定panelClass來改變整個popup的呈現，以筆者實際遇到的一個狀況為例：專案需要一個dialog，已經由美工設計好，這個dialog是**沒有padding**的，但使用Angular Material打開的dialog預設會套用一個`mat-dialog-container`樣式，團隊討論後不希望直接像上一段描述的調整全域`mat-dialog-container`樣式，這時候我們就替要打開的dialog設定了一個panelClass：`custom-dialog`，並調整樣式把裡面`mat-dialog-container`的padding設為0，如下：

```scss
.custom-dialog {
  .mat-dialog-container {
    padding: 0px;
  }
}
```

之後打開dialog時，程式調整成：

```typesecript
this.dialog.open(SomeDialogComponent, {
  panelClass: 'custom-dialog'
});
```

就能夠改變顯示dialog底層panel的樣式啦！

其他可能的狀況如背景顏色、調整陰影等等，都可以透過panelClass來做設定！

這個技巧在所有popup類型的元件都可以使用，除了dialog、snackbar是使用程式控制以外，其他元件如`<mat-select>`或`<mat-menu>`等，都有一個`panelClass`的input可以直接使用。

另外使用Angular CDK的overlay時，也能夠透過panelClass來設定樣式。

## 單獨使用某個Angular Material元件

要單獨使用某個元件其實不難，只要import對應的Ｍodule就好，就算把所有Module都import近來好了，Angular Material也會在build時透過tree shaking機制來甩掉用不到的程式，因此原則上是不用擔心會入過多程式造成檔案龐大的問題，但這是程式面的部分，而CSS就不是這麼一回事了！

當我們使用`@include angular-material-theme()`的同時，也就代表所有Angular Material元件的樣式都被加了進來，但或許我們真的只需要用到整個Angular Material的1~2個功能，又對檔案大小有所要求時，其實我們還是能單獨匯入特定元件的樣式。

簡單的步驟說明如下：

### 定義基本主題顏色

要單獨使用某個樣式，當然就必須拋棄現有theme的CSS檔(或看看未來Angular Material會不會提供單純theme的SCSS定義檔)，因此我們必須自己定義theme的顏色，這部分在昨天的文章已經介紹過了，如下：

```scss
@import '~@angular/material/theming';

@include mat-core();

$custom-primary: mat-palette($mat-light-blue);
$custom-accent: mat-palette($mat-green);
$custom-warn: mat-palette($mat-brown);

$custom-theme: mat-dark-theme($custom-primary, $custom-accent, $custom-warn);
```

### 加入核心樣式

接下來我們要加入核心的樣式，這些樣式是大部分元件都通用的，因此必須先加進來，除了`mat-core()`已經有了最基本的共用樣式外，還需要加入`mat-core-theme()`

```scss
.custom-theme-1 {
  @include mat-core-theme($custom-theme);
}
```

### 加入元件樣式

最後，我們只加入想要的元件樣式就好，Angular Material中將所有的元件都依模組切成了不同的mixin，只需要針對對應模組加入`mat-xxxxx-theme`，例如button對應的就是`mat-button-theme`

```scss
.custom-theme-1 {
  @include mat-core-theme($custom-theme);
  @include mat-button-theme($custom-theme);
}
```

這時候就只有按鈕元件會套用相關的樣式啦！

### 進一步瘦身

上列步驟是一個**簡單且保險的方法**，但還是可能會加入許多不必要的樣式；舉例來說，`mat-core()`包含了overlay相關的樣式，在只使用button時根本用不到；而`mat-core-theme()`裡面其實也沒有與button相關的共用樣式，加入這個設定只會產生用不到的樣式而已，這時候我們可以來看看[_core.scss](https://github.com/angular/material2/blob/5.0.x/src/lib/core/_core.scss)中`mat-core()`和`mat-core-theme()`到底加入了些什麼共用的樣式：

```scss
// Mixin that renders all of the core styles that are not theme-dependent.
@mixin mat-core($typography-config: null) {
  // Provides external CSS classes for each elevation value. Each CSS class is formatted as
  // `mat-elevation-z$zValue` where `$zValue` corresponds to the z-space to which the element is
  // elevated.
  @for $zValue from 0 through 24 {
    .#{$_mat-elevation-prefix}#{$zValue} {
      @include mat-elevation($zValue);
    }
  }

  @include angular-material-typography($typography-config);
  @include mat-ripple();
  @include mat-option();
  @include mat-optgroup();
  @include cdk-a11y();
  @include cdk-overlay();
}

// Mixin that renders all of the core styles that depend on the theme.
@mixin mat-core-theme($theme) {
  @include mat-ripple-theme($theme);
  @include mat-option-theme($theme);
  @include mat-optgroup-theme($theme);
  @include mat-pseudo-checkbox-theme($theme);

  // Wrapper element that provides the theme background when the
  // user's content isn't inside of a `mat-sidenav-container`.
  .mat-app-background {
    $background: map-get($theme, background);
    background-color: mat-color($background, background);
  }

  // Marker that is used to determine whether the user has added a theme to their page.
  .mat-theme-loaded-marker {
    display: none;
  }
}
```

可以看到有些其實是用不到的，但當使用`<mat-select>`時，`mat-option-theme()`就可能是必要的！這時候我們就能夠排除使用`mat-core()`和`mat-core-theme()`，自己選擇要加入的mixin囉，再進一步的瘦身啦！

{% note info %}

以上方法其實已經對於檔案大小有吹毛求疵的要求了，一般狀況很少用到，~~純粹炫耀筆者對Angular Material的理解程度之深(誤)~~ 但當真的有所要求或追求極致時，就是一個可以考慮調教的地方囉！

順帶一提，以筆者目前的範例專案，使用Angular CLI 1.6.0的ng serve指令產出**未壓縮**的`style.bundle.js`檔，使用上述方法瘦身後，減少約150k的大小(當然，許多樣式都消失了)。

{% endnote %}

## 如何單獨使用Angular CDK

Angular CDK是Angular Material共用的部分抽取出來的工具，在之前的文章我們也提過，**不是每個專案都需要使用Material Design，但每個專案基本上都需要打造自己的元件**！因此我們可以不裝Angular Material，但**強烈建議把Angular CDK加入專案中**，但Angular CDK其實還是有基本的樣式，像是overaly的灰底等等，那麼只加入Angular CDK的專案，該怎麼把這些樣式加進來呢？

其實從上一章套用部分樣式中我們就能略知一二，在`mat-core()`中有`cdk-a11y()`和`cdk-overlay()`兩個mixin，給Angular CDK使用，所以我們只需要把Angular CDK的SCSS路徑找出來，再加入style.scss之中就好囉：

```scss
@import "~@angular/cdk/_a11y.scss";
@import "~@angular/cdk/_overlay.scss";

@include cdk-a11y();
@include cdk-overlay();
```

當然啦！如果沒用到Angular CDK的a11y和overlay功能，一樣可以不加入這兩組樣式。

## 本日小結

在筆者一段不算長的時間學習以及正式專案中部分使用Angular Material及Angular CDK經驗中，所遇到的一些需求，如下：

1.  細部調整元件的呈現
2.  打造更加一致具有Material Design風格的元件
3.  檔案瘦身

在Angular Material中已經幫我們把這些都設想好了，我們只要依照前人走好的路，就能更輕鬆達成這些目標，真的是太幸福啦！

## 相關資源

-   [Using elevation helpers](https://material.angular.io/guide/elevation)
-   [Using Angular Material's Typography](https://material.angular.io/guide/typography)
-   [material-colors](https://www.npmjs.com/package/material-colors)
-   [_palette.scss](https://github.com/angular/material2/blob/5.0.x/src/lib/core/theming/_palette.scss)
-   [_core.scss](https://github.com/angular/material2/blob/5.0.x/src/lib/core/_core.scss)

