---
title: "[Angular Material完全攻略]打造問卷頁面(6) - Checkbox、Radio和Slide Toggle"
date: 2018-01-01 20:06:38
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
---

昨天我們介紹了Angular Material的Form Field，為我們的輸入類型控制項帶來一致的顯示成果；今天我們來介紹三個相對簡單但是使用頻率也非常高的元件－Checkbox、Radio和Slide Toggle，這三個元件有很多類似的地方，因此很適合放在一起學習，遇到類似的地方，還可以當做複習哩。

<!-- more -->

## 關於Material Design的Checkbox與Radio

在Material Design中，Checkbox、Radio和Slide Toggle都被歸類在[Selection controls](https://material.io/guidelines/components/selection-controls.html#)中，基本上的概念跟我們使用HTML原生的Checkbox和Radio沒什麼不同；Checkbox主要是用來提供使用者選擇多個選項使用的，而Radio則是提供使用者進行單一選項的選擇。

不同的是，Material Design對於focused和pressed狀態提出了更容易被識別的效果，如下圖：

{% asset_img 01-components-switches-check3.png %}

圖片來源：https://material.io/guidelines/components/selection-controls.html#selection-controls-checkbox

另外在Selection controls中還有提到一個元件－Switch，跟同是開關型的Checkbox類似，但建議上**Checkbox是提供多個選項時使用**，而**Switch則是單純的狀態開跟關**而已。

例如`興趣`可以選擇很多種，這時候就可以用`Checkbox`；而某個`功能的關閉或打開`，則適合使用`Switch`。

## 使用Angular Material的Checkbox

在Angular Material中Checkbox的功能包裝在一個`<mat-checkbox>`元件中，要使用這個元件必須先載入`MatCheckboxModule`模組。

### 使用mat-checkbox

`<mat-checkbox>`是表單元件的一種，因此支援和`FormsModule`或`ReactiveFormsModule`搭配使用，在這邊我們使用ReactiveFormsModule先建立一個資料模型，大致內容如下：

```typescript
this.surveyForm = new FormGroup({
  ...,
  mainQuestinos: new FormGroup({
    payForBook: new FormControl(false),
    payForMusic: new FormControl(false),
    payForMovie: new FormControl(true),
  })
})
```

接著我們就可以直接使用`<mat-checkbox>`來binding這些資料囉

```html
<div>除了生活消費外，你最常花費在哪些項目上？</div>
<mat-checkbox formControlName="payForBook">書籍</mat-checkbox>
<mat-checkbox formControlName="payForMusic">音樂</mat-checkbox>
<mat-checkbox formControlName="payForMovie">電影</mat-checkbox>
```

{% asset_img 02-checkbox-basic.gif %}

一個落落大方的checkbox完成，由於我們的payForMovie的值是`true`，因此預設會是被勾選的狀態；我們可以試著勾選/取消勾選某個項目看看它的特效，或是使用tab來切換不同的checkbox，看看被focus的checkbox的狀態。

### 調整label的位置

在`<mat-checkbox>`中，我們不需要跟`<input type="checkbox">`一樣需要特地用一個`<label>`設定標籤內容，只需要在`<mat-checkbpx>`裡面寫入要顯示的label內容即可，不過這麼一來我們不就無法控制label和checkbox誰要在前面誰要在後面了嗎？還好Angular Material早就想到這一點了，我們可以透過設定`labelPosition`屬性為`after`(預設)或`before`來決定label要顯示在checkbox的後面還是前面。

```html
<mat-checkbox formControlName="payForBook" labelPosition="before">書籍</mat-checkbox>
```

結果如下：

{% asset_img 03-checkbox-label-position.png %}

label就跑到checkbox之前啦！(老實說還真的不太習慣@@)

### 設定Indeterminate狀態

Indeterminate是checkbox一種有趣的狀態，這種狀態**代表的是介於"選取"和"未選取"之間**，常常使用在一個checkbox代表全選/取消全選的時候，透過Indeterminate可以得知目前的狀態是"部分被選取"。

以下舉個例子，我們在原來的功能加上一個全選的checkbox，並設定`inteterminate`狀態及一些事件綁定：

```html
<mat-checkbox formControlName="payForAll" [indeterminate]="indeterminateSelectedPayFor" (change)="checkAllChange($event)">全部</mat-checkbox>
<mat-checkbox formControlName="payForBook" (change)="payForChange()">書籍</mat-checkbox>
<mat-checkbox formControlName="payForMusic" (change)="payForChange()">音樂</mat-checkbox>
<mat-checkbox formControlName="payForMovie" (change)="payForChange()">電影</mat-checkbox>
```

接著調整一下程式碼，如果選擇全部時會依照狀態決定是否要「全選」，或「全不選」；只選擇部分選項時，則會將`indeterminate`狀態設定為`true`：

```typescript
export class SurveyComponent implements OnInit {
  indeterminateSelectedPayFor: boolean;

  constructor(private httpClient: HttpClient) {
    this.surveyForm = new FormGroup({
      ...
      mainQuestions: new FormGroup({
        payForAll: new FormControl(false),
        payForBook: new FormControl(false),
        payForMusic: new FormControl(false),
        payForMovie: new FormControl(true)
      })
    });
  }

  ngOnInit() {
    this._setSelectAllState();
  }
  
  checkAllChange($event: MatCheckboxChange) {
    this.surveyForm
      .get('mainQuestions')
      .get('payForBook')
      .setValue($event.checked);
    this.surveyForm
      .get('mainQuestions')
      .get('payForMusic')
      .setValue($event.checked);
    this.surveyForm
      .get('mainQuestions')
      .get('payForMovie')
      .setValue($event.checked);
    this._setSelectAllState();
  }

  payForChange() {
    this._setSelectAllState();
  }

  private _setSelectAllState() {
    const payForBook = this.surveyForm.get('mainQuestions').get('payForBook').value;
    const payForMusic = this.surveyForm.get('mainQuestions').get('payForMusic').value;
    const payForMovie = this.surveyForm.get('mainQuestions').get('payForMovie').value;
    const count = (payForBook ? 1 : 0) + (payForMusic ? 1 : 0) + (payForMovie ? 1 : 0);
    this.surveyForm.get('mainQuestions').get('payForAll').setValue(count === 3);
    this.indeterminateSelectedPayFor = count > 0 && count < 3;
  }
}

```

接著就來看看結果吧：

{% asset_img 04-checkbox-indeterminate.gif %}

很酷吧！透過`indeterminate`的狀態調整，Checkbox功能變得更加豐富了！

### 設定Checkbox點擊後的預設行為

`<mat-checkbox>`預設點擊的行為如下：

1.  改變`checked`狀態，原來為開會變成關，反之亦然。
2.  改變`indeterminate`狀態，不管原來是`true`或`false`，只要使用者滑鼠點擊，都會變成`false`

我們可以透過設定`MAT_CHECKBOX_CLICK_ACTION`來改變這個行為，例如：

```typescript
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
@Component({
  ...
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
  ]
})
export class SurveyComponent implements OnInit {
```

結果如下：

{% asset_img 05-checkbox-click-action-noop.gif %}

由於我們設定`MAT_CHECKBOX_CLICK_ACTION`為`noop`，代表按下去時除了特效以外什麼都不會做，因此我們必須自己加上click事件必撰寫程式來調整狀態，但是我們也有了最大的調整彈性。

`MAT_CHECKBOX_CLICK_ACTION`有3種狀態可以設定

-   **noop**：按下去後什麼都不做，必須在click事件完成該處理的事情，最麻煩但也最有彈性。
-   **check**：只會切換`checked`狀態，而不會改變`indeterminate`狀態。
-   **check-indeterminate**：預設行為，會切換`checked`狀態以及把`indeterminate`設為`false`。

### 改變mat-checkbox顏色

改變顏色沒有什麼特別的技巧，跟其他Angular Material的元件一樣，只要加上`color`屬性即可：

```html
<mat-checkbox color="primary">書籍</mat-checkbox>
<mat-checkbox color="accent">音樂</mat-checkbox>
<mat-checkbox color="warn">電影</mat-checkbox>
```

成果如下：

{% asset_img 06-checkbox-color.png %}

## 使用Angular Material的Radio

接下來我們來聊聊Radio的使用方式，我們可以在加入`MatRadioModule`後，搭配`<mat-radio-group>`和`<mat-radio-button>`來完成一組單選題。

### 使用mat-radio-group和mat-radio-button

由於`<mat-radio>`是單選的狀態，為了避免畫面上所有的`<mat-radio>`只能有一個被選擇，我們還需要再使用`<mat-radio-group>`來包住`<mat-radio>`，在`<mat-radio-group>`中，只能會有一個`<mat-radio>`被選取。這樣的概念跟`<select>`和`<optoin>`的組合很像，因此實際上的表單元件是`<mat-radio-group>`。

直接來看看怎麼使用吧！

```html
<div>對於Angular，你的評價是？</div>
<mat-radio-group formControlName="angularLikeScore">
  <mat-radio-button [value]="1">超討厭</mat-radio-button>
  <mat-radio-button [value]="2">討厭</mat-radio-button>
  <mat-radio-button [value]="3">普通</mat-radio-button>
  <mat-radio-button [value]="4">喜歡</mat-radio-button>
  <mat-radio-button [value]="5">超喜歡</mat-radio-button>
</mat-radio-group>
<div>對於Angular Material，你的評價是？</div>
<mat-radio-group formControlName="angularMaterialLikeScore">
  ...
</mat-radio-group>
```

成果如下：

{% asset_img 07-radio-basic.gif %}

可以看到每個`<mat-radio-group>`是彼此獨立內的，裡面`<mat-radio-button>`都只能有一個被選取。

### 調整label的位置

跟前面介紹的`<mat-checkbox>`一樣，我們都可以用`labelPosition`來調整label的位置，而且在`<mat-radio-group>`和`<mat-radio-button>`中都可以使用；在`<mat-radio-group>`設定的話，裡面所有的`<mat-radio-button>`都會照著這個規則走；在`<mat-radio-button>`設定的話，則會蓋過`<mat-radio-group>`的設定。

```html
<mat-radio-group formControlName="angularMaterialLikeScore" labelPosition="before">
  <mat-radio-button [value]="1">超討厭</mat-radio-button>
  <mat-radio-button [value]="2">討厭</mat-radio-button>
  <mat-radio-button [value]="3">普通</mat-radio-button>
  <mat-radio-button [value]="4">喜歡</mat-radio-button>
  <mat-radio-button [value]="5" labelPosition="after">超喜歡</mat-radio-button>
</mat-radio-group>
```

成果如下：

{% asset_img 08-radio-label-position.png %}

### 改變radio的顏色

一樣，調整`color`即可，不過目前無法針對`<mat-radio-group>`整個群組一起調整，有點可惜；只能單一調整每個`<mat-radio-button>`

```html
<mat-radio-button [value]="1" color="primary">超討厭</mat-radio-button>
<mat-radio-button [value]="2" color="accent">討厭</mat-radio-button>
<mat-radio-button [value]="3" color="warn">普通</mat-radio-button>
```

結果如下：

{% asset_img 09-radio-color.gif %}

## 使用Angular Material的Slide Toggle

最後我們來講Material Design的Switch功能，這個功能在Angular Material被設計成`mat-slide-toggle`元件，因此我們必須先加入`MatSlideToggleModule`。

```html
<div>訂閱電子報</div>
<div>
  <mat-slide-toggle formControlName="subscribeAngular">Angular技巧全集</mat-slide-toggle>
</div>
<div>
  <mat-slide-toggle formControlName="subscribeAngularMaterial">Angular Material全攻略</mat-slide-toggle>
</div>
<div>
  <mat-slide-toggle formControlName="subscribeNgRx">NgRx入門班</mat-slide-toggle>
</div>
```

結果如下：

{% asset_img 10-slide-toggle-basic.gif %}

我們不僅可以直接點擊來切換狀態，也可以用滑鼠拖曳，來慢慢的把狀態移到另外一邊，在放開滑鼠前，都可以後悔拉回原來的位置，很方便吧！

{% note info %}

`<mat-slide-toggle>`沒有`indeterminate`狀態。

{% endnote %}

### 設定label位置

老規矩，透過`labelPosition`就可以達成了。

```html
<mat-slide-toggle labelPosition="before">Angular技巧全集</mat-slide-toggle>
```

結果如下：

{% asset_img 11-slide-toggle-label-position.png %}

### 設定mat-slide-toggle的顏色

還是老規矩，加上`color`：

```html
<mat-slide-toggle formControlName="subscribeAngular" color="primary">Angular技巧全集</mat-slide-toggle>
<mat-slide-toggle formControlName="subscribeAngularMaterial" color="accent">Angular Material全攻略</mat-slide-toggle>
<mat-slide-toggle formControlName="subscribeNgRx" color="warn">NgRx入門班</mat-slide-toggle>
```

結果如下：

{% asset_img 12-slide-toggle-color.gif %}

## 本日小結

今天我們把Checkbox、Radio和Slide Toggle這3個元件的功能都做了介紹，這3個元件都跟狀態的改變非常相關，而除了Checkbox有比較多變化外，其他的其實都不複雜，而且有許多共同之處，因此學習上應該也滿輕鬆的。

學會了Checkbox、Radio和Slide Toggle，之後遇到狀態改變相關的畫面，應該就能靈活運用囉。

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-14-checkbox-radio-slide-toggle

分支：day-14-checkbox-radio-slide-toggle

## 相關資源

-   [Material Design - Selection controls](https://material.io/guidelines/components/selection-controls.html#)
-   [Angular Material - Checkbox](https://material.angular.io/components/checkbox/overview)
-   [Angular Material - Radio button](https://material.angular.io/components/radio/overview)
-   [Angular Material - Slide toggle](https://material.angular.io/components/slide-toggle/overview)
