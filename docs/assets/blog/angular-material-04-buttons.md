---
title: "[Angular Material完全攻略]MatButton、MatButtonToggle和MatRipple"
date: 2017-12-22 17:35:13
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatButton
  - MatButtonToggle
  - MatButtonToggleGroup
  - MatRipple
---

今天我們要來介紹Angular Material按鈕(button)的使用方法，按鈕可以說是一切互動介面的基本，只要按下了按鈕，所有事情都可能會發生，也因此設計良好的按鈕是非常重要的，除了讓事情發生外，也要讓使用者能夠明確的知道按鈕背後的意義，今天就讓我們看看Material Design中按鈕的設計思維，以及如何在Angular Material如何輕易地達到這些設計的目標吧！

<!-- more -->

## 關於Material Design的按鈕

在[Material Design的Button的設計指南](https://material.io/guidelines/components/buttons.html#)中，按鈕主要分為3種類型：

1.  **扁平化按鈕(Flat Button)**：一個基本的文字矩形，通常使用在dialog、toolbar之中，顏色很簡單，在不是以按鈕為主的元件中這些按鈕扮演著配角的角色，讓你不會過度的注意它，但在需要時又能明顯知道它的存在
2.  **凸起的按鈕(Raised Button)**：具有陰影且明顯的按鈕，在畫面上會比較有立體感、甚至是一個明顯的色塊，會跟其他扁平化的元素產生不同空間的感覺，因此在視覺上會非常具有存在感，適合用在需要提醒使用者按下的地方，例如加入購物車這種的按鈕就很適合使用。
3.  **浮動的動作按鈕(Floatng Action Button)**：Floating Action Button是Material Design中非常重要且獨特的一種設計方式，重要到在官方的設計指南中有[獨立的一個完整篇章](https://material.io/guidelines/components/buttons-floating-action-button.html)在介紹它，它通常會固定在整個螢幕或是某個功能區快的固定位置，用來提醒使用者這個按鈕具有(或包含)畫面上最常使用到的功能，也可以想像成是一種捷徑的概念。為了凸顯這種按鈕的存在，又要避免存在有著突兀的感覺，因此會設計成**圓形但不會太佔空間的按鈕**，也因此基本上按鈕中只會放置Icon，比較少會放文字。

{% asset_img 00-material-button.png %}

除了扁平化的按鈕是為了在畫面上有協調的感覺以外，其他的按鈕設計都是為了凸顯自身的存在，因此在設計上也都會呈現陰影的感覺，讓視覺上更加清楚。

## 在Angular Material中使用按鈕

在Angular Material中，所有的按鈕都放置在MatButtonModule中，因此使用時記得加入這個Ｍodule

```typescript
import { MatButtonModule } from '@angular/material';

@NgModule({
  ...
  imports: [
    ...,
    MatButtonModule],
  ...
})
export class AppModule {}
```

由於按鈕在網頁上的存在極具意義，Angular Material在設計上並未把按鈕封裝成component，而是以directive的方式附著在button或a標籤上，並透過樣式的變化讓原來的button或a標籤具有Material Design的風格。

### 扁平化按鈕(mat-button)

扁平化按鈕是最基本的按鈕樣式，使用上非常簡單，在原來的button或a標籤上加上`mat-button`即可

```html
<button mat-button>我是按鈕</button>
```

這時候在畫面上看起來會完全沒有按鈕的感覺，而只是個文字的存在，但當滑鼠移到按鈕上時，則會看到比較深色的背景，按下去時則會產生互動的漣漪效果。

{% asset_img 01-basic-button.gif %}

當然，我們也可以使用`color`屬性來改變按鈕的顏色，同時也可以使用`disabled`屬性禁止按鈕被點選。

```html
  <button mat-button>我是按鈕</button>
  <button mat-button color="primary">Primary</button>
  <button mat-button color="accent">Accent</button>
  <button mat-button color="warn">Warn</button>
  <button mat-button disabled>Disabled</button>
  <a mat-button>Link</a> <!-- 放在a tag裡面也沒問題 -->
```

效果如下：

{% asset_img 02-mat-button-color.gif %}

### 凸起的按鈕(mat-raised-button)

比起扁平化的按鈕，凸起的按鈕會有明顯的反差，也會有比較深的陰影效果，以凸顯按鈕的存在，凸起的按鈕需要加上mat-raised-button

```html
  <button mat-raised-button>我是raised按鈕</button>
  <button mat-raised-button color="primary">Primary</button>
  <button mat-raised-button color="accent">Accent</button>
  <button mat-raised-button color="warn">Warn</button>
  <button mat-raised-button disabled>Disabled</button>
  <a mat-button>Link</a>
```

效果如下：

{% asset_img 03-mat-raised-button.gif %}

### Icon按鈕

要替按鈕加上Icon本身是一件很簡單的事情，在標籤內加上`<mat-icon>`就可以了，例如：

```html
<button mat-raised-button color="primary"><mat-icon>thumb_up</mat-icon> 我有Icon</button>
```

效果如下：

{% asset_img 04-button-with-icon.png %}

不過如果我想只想要icon，不要搭配文字呢？

```html
<button mat-raised-button color="primary"><mat-icon>thumb_up</mat-icon></button>
```

結果：

{% asset_img 05-button-with-icon-only.png %}

這樣有點問題的是，左右留白太多了好像有點浪費空間，畢竟只想要icon的按鈕通常就是為了能夠節省空間啊！這時候可以使用專門為了呈現icon的`mat-icon-button`來解決這個問題：

```html
<button mat-icon-button color="primary"><mat-icon>thumb_up</mat-icon></button>
```

結果：

{% asset_img 06-mat-icon-button.png %}

看起來就單純許多，如果希望凸顯這個按鈕，我們可以先用`mat-raised-button`將它變成更明顯的按鈕，再使用`mat-icon-button`改變成為左右不留白的樣式

```html
<button mat-raised-button mat-icon-button color="primary"><mat-icon>thumb_up</mat-icon></button>
```

結果：

{% asset_img 07-raised-icon-button.png %}

可以看到按鈕的留白就移除了，邊角也變成了圓形的，只有Icon的單一按鈕用這樣的呈現方式感覺還不錯！

### 浮動的動作按鈕(mat-fab / mat-min-fab)

接下來要介紹的是預設就是圓形的floating action button，我們使用到`mat-fab`這個directive：

```html
  <button mat-fab>
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-fab color="primary">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-fab color="accent">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-fab color="warn">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-fab disabled>
    <mat-icon>thumb_up</mat-icon>
  </button>
```

效果如下：

{% asset_img 08-mat-fab.gif %}

可以發現一件事情，在沒有指定顏色的時候，`mat-fab`的樣式與accent顏色是一樣的，可以見得floating action button本身的設計理念就是為了凸顯它的存在感，這剛好與accent的概念是用來強調這裡有東西的顏色概念一樣，不得不佩服Angular Material設想得非常周到。

`mat-fab`本身應為圓形且要凸顯的效果，整個按鈕看起來會比較大，但對於比較小的區塊中要使用時反而會顯得太過突兀，這時候我們也可以使用`mat-mini-fab`來產生比較小的floating action button

```html
  <button mat-mini-fab>
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-mini-fab color="primary">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-mini-fab color="accent">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-mini-fab color="warn">
    <mat-icon>thumb_up</mat-icon>
  </button>
  <button mat-mini-fab disabled>
    <mat-icon>thumb_up</mat-icon>
  </button>
```

跟原來的按鈕比較效果如下：

{% asset_img 09-mat-mini-fab.png %}

`mat-mini-fab`產生的按鈕樣式跟一般的按鈕高度就會一樣，因此看起來會跟使用`mat-raised-button`加上`mat-icon-button`的組合技有一樣的效果，不過在語義上則是不一樣的東西。

以上就是整個Angular Material中的按鈕基本用法，並不會非常困難，主要就是幾個directives，依照不同的情境決定使用方式；接下來要介紹的是類似按鈕卻不是按鈕的東西，叫做按鈕開關(button toggle)。

## 按鈕開關(button toggle)

按鈕開關基本上不是按鈕，反而比較類似checkbox，偏偏它又不像checkbox是表單控制項，可以搭配ngModel使用，因此單一的按鈕開關使用上會比較沒有意義，而是使用一個群組式的按鈕開關，應用層面比較廣

### 基本的Button Toggle(mat-button-toggle)

`mat-button-toggle`放在MatButtonToggleModule中，使用前記得加入這個Module，加入後我們可以直接在畫面上使用

```html
<mat-button-toggle>我是個開關</mat-button-toggle>
```

結果如下：

{% asset_img 10-button-toggle.gif %}

可以看到每次點下去，就有切換開關的效果。`mat-button-toggle`這個component本身還有如`checked、value、disabled`等屬性可以使用，我們將在下一個Button Toggle Group中一起混著使用

### 搭配Button Toggle Group(mat-button-toggle-group)

`mat-button-toggle-group`可以放置多個`mat-button-toggle`，並且依照被選取的mat-button-toggle來決定自己的值是什麼，我們可以設計一個簡單的畫面如下：

```html
<mat-button-toggle-group #formatAlignGroup="matButtonToggleGroup">
  <!-- button toogle所代表的值 -->
  <mat-button-toggle value="left">
    <mat-icon>format_align_left</mat-icon>
  </mat-button-toggle>
  <!-- 預設被選取 -->
  <mat-button-toggle value="center" checked="true">
    <mat-icon>format_align_center</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="right">
    <mat-icon>format_align_right</mat-icon>
  </mat-button-toggle>
  <!-- 不允許選擇的button toggle -->
  <mat-button-toggle value="justify" disabled>
    <mat-icon>format_align_justify</mat-icon>
  </mat-button-toggle>
</mat-button-toggle-group>
<div>對齊方式為：{{ formatAlignGroup.value }}</div>

<!-- 加上multiple，則裡面的mat-buttong-toggle可以複選 -->
<!-- 加上vertical="true", 改變排列方式 -->
<mat-button-toggle-group multiple vertical="true">
  <mat-button-toggle value="bold" #buttonToggleBold>
    <mat-icon>format_bold</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="italic" checked="true" #buttonToggleItalic>
    <mat-icon>format_italic</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="underlined" checked="true" #buttonToggleUnderlined>
    <mat-icon>format_underlined</mat-icon>
  </mat-button-toggle>
</mat-button-toggle-group>
<div>粗體：{{ buttonToggleBold.checked }}、斜體：{{ buttonToggleItalic.checked }}、底線：{{ buttonToggleUnderlined.checked }}</div>
```

在上面的程式中，第一段ButtonToggleGroup中我們使用value為每個`mat-button-toggle`中設定所屬的值，並且設定`checked="true"`來設定預設選取的效果、以及`disabled`來設定禁止點選，接著透過template reference取得ButtonToggleGroup的value值，也就是裡面真正被開啟的按鈕值。

第二段ButtonToggleGroup中我們加入了`mutiple`，讓裡面的ButtonToggle可以複選，另外加上了`vertical="true"`改變排列方式，不過在複選時我們無法直接使用buttonToggleGroup.value來取得值，因此只能各自取得裡面的ButtonToggle的選取狀態。

效果如下：

{% asset_img 11-button-toggle-group.gif %}

關於ButtonToggleGroup中`mutiple`的設定，值得注意的是沒有加上`mutiple`時，我們可以直接取用其中的value，來得到被選取的狀態，同時也支援使用ngModel；加上`mutiple`後，由於不會有資料傳入value中，因此ngModel也因此無法使用了。

詳細的其他屬性可以參考[ButtonToggle的API文件](https://material.angular.io/components/button-toggle/api)。

## 漣漪效果(mat-ripple)

介紹一個官方文件沒有提到，但官方source code的demo app有示範的一個有趣的東西，也就是漣漪效果，這個效果主要用在按鈕上面，在許多其他元件也可看到這個特效的蹤影，在剛剛的介紹中我們也看到了按下按鈕後會產生的特效；實際上這個特效有寫成一個directive，讓我們可以在不同地方使用，而且能調整許多細節。

首先加入MatRippleModule後，我們先來個簡單的版本，直接用一個div並加上`mat-ripple`這個directive就好！

```html
<div class="demo-ripple-container" mat-ripple>
```

我們在這邊加上了一個class的設定

```css
.demo-ripple-container {
  height: 150px;
  width: 200px;
  position: relative;
  transition: all 200ms linear;
  border: 1px solid black;
}
```

position和transaition是必要的，其他可以依照情況設定，只要有這樣的設定，立刻就可以為我們的畫面加上漣漪效果啦！

{% asset_img 12-basic-mat-ripple.gif %}

### mat-ripple的其他屬性

除了基本的設定外，`mat-ripple`還有其他屬性可以設定，讓畫面呈現更加不一樣，以下是`mat-ripple`的主要屬性

-   `matRippleCentered`：true代表不管滑鼠在元件上的哪裡點下去，都會從中心點開始產生漣漪。

-   `matRippleDisabled`：true代表取消元件上的漣漪效果。

-   `matRippleUnbounded`：true代表漣漪的效果擴大後會超過元件之外。

    {% asset_img 13-ripple-unbounded.gif %}

-   `matRippleRadius`：漣漪產生的大小，數值越大大表大小越大。

-   `matRippleCol`：漣漪的顏色。

-   `matRippleSpeedFactor`：漣漪擴散的速度，數值越大速度越快

例如以下程式碼，我們可以在畫面上產生數個粉紅色且擴散速度慢的漣漪點。

```html
<div class="demo-ripple-container" mat-ripple
[matRippleCentered]="false"
[matRippleDisabled]="false"
[matRippleUnbounded]="false"
[matRippleRadius]="10"
[matRippleColor]="'pink'"
[matRippleSpeedFactor]="0.5"></div>
```

結果如下：

{% asset_img 14-ripple-properties.gif %}

### 從程式觸發漣漪的效果

我們也能從程式裡面去直接觸發漣漪的產生，如下：

```typescript
export class AppComponent implements OnInit {
  @ViewChild(MatRipple) ripple: MatRipple;
  
  triggerRipple() {
    const point1 = this.ripple.launch(0, 0, { color: 'pink', centered: true, persistent: true, radius: 50 });
    const point2 = this.ripple.launch(0, 0, { color: 'yellow', centered: true, persistent: true, radius: 20 });
      
    setTimeout(() => {
      point1.fadeOut();      
    }, 500);
  }

  clearRipple() {
    this.ripple.fadeOutAll();
  }
}
```

`ripple.launch`的前兩個參數為漣漪點產生的位置，但目前這個計算會跑掉，所以我們在第三個參數中設定相關屬性時將centered設為true，強制從中心點開始，另外這邊我們加了一個persistent為true，代表漣漪點產生後不會自動淡出。我們可以透過`fadeOutAll()`把所有漣漪點都淡出。

效果如下：

{% asset_img 15-launch-ripple.gif %}

是不是很有趣啊！

## 本日小結

今天我們介紹了非常實用的元件－**按鈕**，按鈕可以說是一切互動的開始，透過按鈕我們可以期待會有事情發生，而在Material Design中對於按鈕的設計也是一門學問，如何在低調與奢華的按鈕之間選擇，影響了使用者對畫面的觀感。

除此之外我們也介紹了**開關型的按鈕**，這種按鈕在特定的情境下會非常實用。

最後我們額外介紹了文件目前沒有的**漣漪效果**，這個效果在許多元件中都能看到，因此拉出來變成一個獨立的directive也是件正常不過的事情，除此之外`mat-ripple`還能有許多更細部的設定，讓效果更加豐富。

在介紹過幾個實用的元件及功能後，明天開始我們就要開來組合各種元件，並且完成各式各樣的畫面啦！！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-04-mat-button
分之：day-04-mat-button

## 相關資源

-   [Material Design - Buttons](https://material.io/guidelines/components/buttons.html)
-   [Material Design - Floating Ation Button](https://material.io/guidelines/components/buttons-floating-action-button.html)
-   [Angular Material - Button](https://material.angular.io/components/button/overview)
-   [Angular Material - Button Toggle](https://material.angular.io/components/button-toggle/overview)
-   [Angular Material - Demo App - Ripple](https://github.com/angular/material2/tree/master/src/demo-app/ripple)
