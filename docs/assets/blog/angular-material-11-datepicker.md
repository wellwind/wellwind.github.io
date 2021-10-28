---
title: "[Angular Material完全攻略]打造問卷頁面(3) - Datepicker"
date: 2017-12-29 19:40:48
category: "Angular Material完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatDatepicker
---

昨天我們介紹了兩個常用的輸入元件，分別是Input及Autocomplete，在提到Input時有介紹當`<input type>`設為date時，會依照瀏覽器的不同產生不一樣的日期顯示方式，為了消除這種瀏覽器間的差異，我們會選擇不使用原生的畫面，而是自己刻(或找人家寫好的)一個元件來選擇日期。

而在日期選擇方面，Material Design也有訂出一些設計參考，同時Angular Material提供了一個Datepicker，方便我們可以快速的選擇日期。

至於該如何使用呢？就讓我們繼續看下去吧！

<!-- more -->

## 關於Material Design的Pickers

在[Material Design的Pickers設計指南](https://material.io/guidelines/components/pickers.html#)中，針對時間和日期，都提供了一些設計的參考，主要的方向是提供一個給使用者選擇日期或時間的工具，選擇的方式必須直覺好理解。

在行動裝置下，可以用dialog的方式顯示；在螢幕比較大的畫面下，可以在輸入欄位下方直接顯示就好。

{% asset_img 01-material-design-components-pickers.png %}

圖片來源：https://material.io/guidelines/components/pickers.html

## 開始使用Angular Material的Datepicker

Angular Material中目前只有Datepicker可以用來選擇日期，還沒有提供選擇時間的元件，因此今天主要會來介紹這個選擇日期的Datepicker。

### 使用Angular Material Datepicker的前置準備

老規矩，要使用Datepicker，必須先在程式中加入`MatDatepickerModule`。

不過對於Datepicker來說，這樣還不太夠，因為**跟日期有關的部分雖然JavaScript有原生的Date型別可用，但Date在不同瀏覽器偏偏又有不同的實作方式，而且還會遇到語系呈現的問題等等**，因此比較常見的做法是使用[Moment.js](https://momentjs.com/)來處理日期相關的資訊，這部分Angular Material也都設想好了，對於日期處理的部份，我們可以選擇要使用原生的處理日期方式`MatNativeDateModule`或是使用moment.js處理日期的方式`MatMomentDateModule`，為了讓畫面對日期顯示有更好的支援，我們選擇使用`MatMomentDateModule`，不過`MatMomentDateModule`沒有內建在Angular Material中，需要透過npm套件安裝`@angular/material-moment-adapter`

```shell
npm i --save @angular/material-moment-adapter moment
```

安裝完成後再將`MatMomentDateModule`加入我們共用的Ｍodule中就好囉！

### 使用mat-datepicker選擇日期

跟昨天的Autocomplete一樣，我們一樣需要的個`<input>`作為文字輸入的主體，而datepicker則可以使用`<mat-datepicker>`元件，我們只要在input中設定`[matDatepicker]`屬性及可指定input要顯示的datepicker來源，另外我們加上一個`<mat-datepicker-toggle>`來開關`<mat-datepicker>`的顯示方式。

```html
<mat-form-field>
  <input type="text" name="birthday" matInput placeholder="生日" [matDatepicker]="birthdayPicker" />
  <mat-datepicker-toggle [for]="birthdayPicker" matSuffix></mat-datepicker-toggle>
  <mat-datepicker #birthdayPicker></mat-datepicker>
</mat-form-field>
```

{% note info %}

這邊我們用了一個 `matSuffix` directive，這部分會在介紹FormField時做詳細的說明。

{% endnote %}

來看看結果：

{% asset_img 02-datepicker-demo.gif %}

一個美觀大方的datepicker就產生啦！

### 設定datepicker語系

在moment.js的強力支援下，要為Angular Material的datepicker套上中文的語系一點都不難，我們只需要在providers中為`MAT_DATE_LOCALE`注入目標語系的值即可

```typescript
@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' }
  ]
})
export class SharedMaterialModule {}
```

結果如下：

{% asset_img 03-datepicker-locale.png %}

有了中文版，就不怕被英文不好的客戶罵啦XD

### 設定datepicker顯示格式

datepicker會依照不同語系的設定產生不同的顯示格式，這樣有可能會造成不必要的混淆，我們也能夠自行決定顯示的格式，方法與變更語系類似，注入`MAT_DATE_FORMATS`的設定即可：

```typescript
export const TW_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
};

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS }
  ]
})
export class SharedMaterialModule {}
```

我們分別設定了解析(parse)與顯示(display)的規則，`monthYearLabel`是picker左上方選擇年/月時的顯示格式，A11y相關的設定則是在使用螢幕朗讀程式時(或mac的voice over)使用的格式

結果如下：

{% asset_img 04-datepicker-format.png %}

把語系和格式都設定成習慣的格式後，接下來我們再來看看datepicker還有些什麼好玩的功能可以設定吧！

### 調整datepicker的起始畫面

datepicker預設打開的畫面會是日曆形式的日期選擇，我們可以將`<mat-datepicker>`的`startView`屬性設定為"year"(預設為month)，則會先出現一整年的可選月份，選擇月份後，才選擇日期：

```html
<mat-datepicker #demoDatepicker startView="year"></mat-datepicker>
```

結果如下：

{% asset_img 05-start-view.gif %}

### 調整datepicker起始時間

除了起始畫面之外，我們也可以設定`startAt`屬性，來決定datepicker打開時，要從哪一天開始顯示，我們可以先在component.ts中設定一個預設起始時間：

```typescript
export class SurveyComponent implements OnInit {
  startDate = moment(new Date(1999, 0, 1));
}
```

接著在畫面中設定`startAt`屬性

```html
<mat-datepicker #demoDatepicker [startAt]="startDate"></mat-datepicker>
```

就能夠預設以1999年1月1號打開datepicker啦！

{% asset_img 06-start-at.png %}

### 設定datepicker可以選擇的範圍

我們可以使用`min`和`ma`x屬性，來設定一個input的最小值和最大值，當在使用datepicker時，也會根據這兩個值來決定picker可選擇的範圍，例如我們在component中設定了時間範圍：

```typescript
export class SurveyComponent implements OnInit {
  startDate = moment('1999-1-10');
  minDate = moment('1999-1-5');
  maxDate = moment('1999-1-15');
}
```

接著設定input的min和max屬性：

```html
<input type="text" name="birthday" matInput [min]="minDate" [max]="maxDate" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate"></mat-datepicker>
```

結果如下：

{% asset_img 07-min-max-input.png %}

可以看到1999/01/05之前和1999/01/15之後的日期就變成灰底無法選擇，這樣就能固定住datepicker可以選擇的範圍囉。

### 使用filter過濾不可以被選擇的日期

我們也可以使用`matDatepickerFilter`來指定一個過濾可用日期的function，這個function會回傳true或false來告知datepicker什麼時間是不可以被選擇的，例如每週二和五是家庭日不可選，可以寫一個filter如下：

```typescript
familyDayFilter(date: moment.Moment): boolean {
  const day = date.day();
  return day !== 2 && day !== 5;
}
```

接著在畫面程式碼中指定這個filter：

```html
<input type="text" name="birthday" matInput [matDatepickerFilter]="familyDayFilter" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate"></mat-datepicker>
```

成果如下：

{% asset_img 08-date-filter.png %}

### 關於datepicker中的input和change相關事件

文字輸入控制項(`<input type="xxx" />`)都會有原生的input和change事件，不過這些事件都只有在使用者跟input本身互動時才會觸發，因此以下程式碼：

```html
<input type="text" name="birthday" matInput (input)="logDateInput($event)" (change)="logDateChange($event)" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate"></mat-datepicker>
```

得到的紀錄只會是一般的InputEvent等等，不是非常清楚，如下：

{% asset_img 09-native-input-change-event.png %}

若希望紀錄的是真實的日期選擇變化，則可以使用`dateInput`和`dateChange`事件，傳入的事件會是`MatDatepickerInputEvent<T>`如下，`<T>`則看我們使用處理時間的Module是`MatNativeDateModule`還是`MatMomentDateModule`，如果是`MatNativeDateModule`會使用`Date`，`MatMomentDateModule`則是Momen型別：

```typescript
export class SurveyComponent implements OnInit {
  logDateInput($event: MatDatepickerInputEvent<moment.Moment>) {
    console.log($event);
  }

  logDateChange($event: MatDatepickerInputEvent<moment.Moment>) {
    console.log($event);
  }
}
```

接著把畫面上的input和change事件改為`dateInput` 和 `dateChange`：

```html
<input type="text" name="birthday" matInput (dateInput)="logDateInput($event)" (dateChange)="logDateChange($event)" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate"></mat-datepicker>
```

結果如下：

{% asset_img 10-dateiniput-datechange.png %}

由於紀錄的是Date或Moment物件，因此要做後續處理也比較容易哩！

### 關於datepicker的disabled模式說明

#### 整個Input進行dissabled

在input中設定disabled狀態其實不難，但配上datepicker則有了些不同的變化，例如以下是最簡單的disabled狀態，把整個input設為disabled：

```typescript
this.surveyForm = new FormGroup({
  basicQuestions: new FormGroup({
    ...
    birthday: new FormControl({value: '', disabled : true})
  })
});
```

結果如下：

{% asset_img 11-disable-whole-input.png %}

#### 只disable mat-datepicker-toggle按鈕

另外我們也可以針對`mat-datepicker-toggle`單獨設定disabled狀態，我們先把birthday的disabled狀態改掉，再把畫面調整為

原本我們的`mat-datepicker-toggle`日曆icon如下，是黑色可以點選的：

{% asset_img 12-disabled-toggle-before.png %}

改變為disabled後如下：

{% asset_img 13-disabled-toggle-after.png %}

變成了不可以點選的灰底，這時候日期選擇器會無法叫出來，但input文字方塊依然是可以正常輸入了。

#### disable文字input，但picker不做disable

另外一種變形的做法是，我們可以把input文字欄位disable掉，但是依然保留picker可選擇的狀態，這麼做的好處是，**可以避免使用者隨意輸入不必要的內容，造成後續處理的麻煩**；在component.ts中我們再次把birthday的狀態設為disabled，這時原本是不可以輸入，也沒有picker可以用的，而這時候我們可以把`mat-datepicker`的`disabled`狀態設為`false`，就會變成picker可以使用的狀態囉：

```html
<input type="text" name="birthday" matInput (dateInput)="logDateInput($event)" (dateChange)="logDateChange($event)" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate" disabled="false"></mat-datepicker>
```

結果如下：

{% asset_img 14-enable-picker-only.png %}

### 設定Touch UI模式

預設的行為下，datepicker是依附在input之下的，這在一般桌面上的網頁沒有問題，但是移到行動裝置，尤其是螢幕小的觸控式手機上就會顯得不好操作，這時候我們可以為`mat-datepicker`設定`touchUi`，就會變成適合觸控式裝置的模式：

```html
<input type="text" name="birthday" matInput (dateInput)="logDateInput($event)" (dateChange)="logDateChange($event)" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
<mat-datepicker-toggle [for]="demoDatepicker" matSuffix></mat-datepicker-toggle>
<mat-datepicker #demoDatepicker [startAt]="startDate" disabled="false" touchUi="true"></mat-datepicker>
```

成果如下：

{% asset_img 15-touch-ui-mode.gif %}

更進階的做法是，偵測瀏覽器可用的寬度，當寬度低的時候，自動切換Touch UI模式，這部分Angular Material將這樣的功能切到的Angular CDK中，我們會在後面的文章另外做介紹。

### 自行在程式中打開datepicker

`<mat-datepicker>`本身就是一個component，因此我們不一定非得需要搭配`<mat-datepicker-toggle>`來作切換，也能自行在程式中處理，只要去設定`<mat-datepicker>`的`opened`屬性即可：

```html
<mat-form-field>
  <input type="text" name="birthday" matInput (dateInput)="logDateInput($event)" (dateChange)="logDateChange($event)" placeholder="生日" [matDatepicker]="demoDatepicker" formControlName="birthday" />
  <mat-datepicker #demoDatepicker [startAt]="startDate" disabled="false" touchUi="true"></mat-datepicker>
</mat-form-field>
<button mat-raised-button (click)="demoDatepicker.opened = true">打開Datepicker</button>
```

成果如下：

{% asset_img 16-open-datepicker.gif %}

不會很困難吧！

## 本日小結

關於選擇日期這件事情，一直以來都是前端的一個很大的議題，怎麼讓這件事情變得直覺又簡單，有著不同的設計方法，Angular Material依循了Ｍaterial Design中的建議，打造了一個datepickerm元件，讓我們能提供給使用者一個直覺大方的日期選擇器。

今天我們在介紹datepicker同時，也介紹了如何整合moment.js近來，讓datepicker能夠發揮更強大的威力；同時這個datepicker也有許多強大的功能，甚至能對應不同裝置有不同的顯示方式。光是一個datepicker就有這麼多東西可以設定，可以說這個datepicker真的是很重要也很實用啊！

{% note info %}

看到這裡你可能會想問，有沒有選擇時間的元件呢？很可惜目前Angular Material還沒有實作選擇時間的元件，不過既然Material Design也有針對時間元件提出建議，相信在不久的將來也是能夠看到的！

{% endnote %}

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-11-datepicker

分支：day-11-datepicker

## 參考資源

-   [Material Design - Pickers](https://material.io/guidelines/components/pickers.html#)
-   [Angular Material - Datepicker](https://material.angular.io/components/datepicker/overview)
-   [前端工程研究：關於 JavaScript 中 Date 型別的常見地雷與建議作法](https://blog.miniasp.com/post/2016/09/25/JavaScript-Date-usage-in-details.aspx)
