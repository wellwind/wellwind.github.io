---
title: "[Angular Material 完全攻略]打造問卷頁面(7) - Slider"
date: 2018-01-02 14:06:38
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatSlider
---

今天我們要介紹目前Angular Material裡面關於Form Control的最後一個元件－Slider；完成Slider的學習之後，問卷頁面也會在此告一段落，進入下一個畫面的設計，學習更多Angular Material相關的元件，就讓我們以比較輕鬆的腳步完成今天的課題吧！

<!-- more -->

## 關於Material Design中的Slider

在[Material Design的Sliders設計指南](https://material.io/guidelines/components/sliders.html)中，Slider是一個允許使用者針對某個目標調整其**強度**的功能，例如音量、螢幕亮度等等，都很適合使用Slider來設計其功能，Slider的兩端代表強度的最大值和最小值，習慣上最大值在右邊，而最小值在左邊。

{% asset_img 01-components-sliders.png %}

圖片來源：https://material.io/guidelines/components/sliders.html

## 開始使用Angular Material的Slider

我們可以在載入`MatSliderModule`後，直接指用`<mat-slider>`元件。

### 使用mat-slider

`<mat-slider>`功能類似於HTML原生的`<input type="range">`，我們一樣可以使用`min`、`max`和`step`這些參數；接下來我們試著使用`<mat-slider>`自訂一個RGB顏色選擇器，如下：

```html
<div>選擇你最喜歡的顏色</div>
<div>
  <span>Red</span>
  <mat-slider formControlName="favoriteColorRed" min="0" max="255" step="1"></mat-slider>
</div>
<div>
  <span>Green</span>
  <mat-slider formControlName="favoriteColorGreen" min="0" max="255" step="1"></mat-slider>
</div>
<div>
  <span>Blue</span>
  <mat-slider formControlName="favoriteColorBlue" min="0" max="255" step="1"></mat-slider>
</div>
<div>RGB: ({{ selectedColorRed }}, {{ selectedColorGreen }}, {{ selectedColorBlue }})</div>
<div style="width: 50px; height: 50px; border: 1px solid #000" [ngStyle]="{background: selectedColorStyle}"></div>
      
```

程式碼中我們再加入對應的設定：

```typescript
export class SurveyComponent implements OnInit {
  surveyForm: FormGroup;
  
  get selectedColorRed() {
    return this.surveyForm.get('otherQuestions').get('favoriteColorRed').value;
  }

  get selectedColorGreen() {
    return this.surveyForm.get('otherQuestions').get('favoriteColorGreen').value;
  }
  
  get selectedColorBlue() {
    return this.surveyForm.get('otherQuestions').get('favoriteColorBlue').value;
  }

  // 組合顏色樣式
  get selectedColorStyle() {
    return `rgb(${this.selectedColorRed}, ${this.selectedColorGreen}, ${this.selectedColorBlue})`;
  }

  constructor() {
    this.surveyForm = new FormGroup({
      ...,
      otherQuestions: new FormGroup({
        favoriteColorRed: new FormControl(0),
        favoriteColorGreen: new FormControl(0),
        favoriteColorBlue: new FormControl(0)
      })
    })
  }
}
```

成果如下：

{% asset_img 02-mat-slider-basic.gif %}

很簡單吧！我們可以透過拖曳`<mat-slider>`來調整每個顏色的強度，另外也能使用鍵盤的上下左右鍵來調整數值，甚至可以用`PageDown`、`PageUp`一次跳多一點的數字，以及`Home`和`End`直接跳到起始或結束，只能說Angular Material設計得太貼心啦！

目前`<mat-slider>`可用的鍵盤對應如下：

{% asset_img 03-mat-slider-keyboard-mapping.png %}

### 調整mat-slider的垂直/水平方向

預設下`<mat-slider>`是水平的，但我們可以透過設定`vertical`來改變成垂直的方向。

```html
<mat-slider formControlName="favoriteColorRed" ... vertical></mat-slider>
```

結果如下：

{% asset_img 04-vertical-slider.png %}

### 調整最大/最小值位置

如同文章開始時介紹過，預設情境下，最大值會放在右邊，最小值在左邊；但這個設定也是可以被改變的，只要加上`invert`即可。

```html
<mat-slider formControlName="favoriteColorGreen" min="0" max="255" step="1" invert></mat-slider>
```

結果如下：

{% asset_img 05-invert-slider.png %}

原本設定綠色的Slider最小值`0`就跑到另外一邊去囉。

### 設定thumbLabel

預設下，我們是看不到`<mat-slider>`選擇的數字的，這樣有時候不太方便，如果是一個給予評價的Slider(例如1~5顆星)，總不會單純的是憑感覺去拉動吧！這時候我們可以透過`thumbLabel`，來顯示一個目前數值的標誌，如下：

```html
<div>關於這個問卷你覺得設計得如何？</div>
<mat-slider formControlName="surveyScore" min="0" max="100" step="10" thumbLabel></mat-slider>
```

成果如下：

{% asset_img 06-mat-slider-with-thumb-label.gif %}

### 設定tickInterval

我們也可以設定`tickInterval`，替`<mat-slider>`顯示一個刻度標示，讓我們在選擇時更加的有把握！我們可以給予一個`tickInterval`一個數值，代表每隔多少顯示一個刻度標示；有一點需要特別注意的是，`tickInterval`和`step`是有關係的，我們可以想像成是：**每步要移動幾個數字(step)，且每幾步(tickInterval)放置一個標誌(tick)**，因此假設我們設定每步移動`5`，且每`2`步放一個標誌，代表每移動`10`就會看到一個刻度。

另外我們也可以給一個字串`auto`讓Angular Material自己去算，這麼一來Angular Material會在每`30px`替我們加上一個刻度。

```html
<mat-slider formControlName="surveyScore" min="0" max="100" step="5" thumbLabel [tickInterval]="2"></mat-slider>
```

結果如下：

{% asset_img 07-mat-slider-tick-inverval.png %}

## 本日小結

今天我們用很輕鬆的步調介紹了`<mat-slider>`這個元件，雖然它可以設定的參數不多，因此相對簡單許多，但每個參數都有著華麗的效果，讓使用者在操作Slider時能夠更明確的知道自己目前的狀態。

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-15-slider

分支：day-15-slider

到今天我們終於把所有目前Angular Material的Form Control相關元件全部介紹完啦，代表著問卷表單的功能也該到此告一段落，相信到目前為止各位讀者應該已經能夠熟悉各種表單元件的使用了吧！如果有任何問題都歡迎提出來，大家一起學習討論。

明天開始我們將開始透過另一個新的頁面－部落格，來學習更多Angular Material相關的元件，讓我們繼續徜徉在Angular Material的豐富資源裡面吧！明天見囉！！

## 相關資源

-   [Material Design - Sliders](https://material.io/guidelines/components/sliders.html)
-   [Angular Material - Slider](https://material.angular.io/components/slider/overview)
