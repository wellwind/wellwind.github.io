---
title: "[Angular 大師之路] 認識 Angular 的生命週期"
date: 2018-10-19 18:00:00
category: "Angular 大師之路"
tags:
  - Angular
  - Life Cycles
---

在設計 Angular 元件(component)時，可以在程式中針對 Angular 在運作程式時放入不同的 hooks(我們通常稱為 **lifecycle hooks**)，來在不同的行為中做出更深入的處理，今天就讓我們來看看整個元件在執行時所會發生的生命週期以及應用吧！

<!-- more -->

**類型**：觀念+技巧

**難度**：3 顆星

**實用度**：一般應用 3 顆星；有許多共用元件開發需求或整合第三方套件時 5 顆星

# 如何使用 lifecycle hooks

在不同的生命週期中，我們可以在程式中加入對應生命週期的方法，來得知生命週期變化，以及作出對應的處理，以最常見的 `OnInit` 週期來說，我們會在元件中加入 `ngOnInit()` 方法，如下

```typescript
export class AppComponent {
  ngOnInit() {
    // do something...
  }
}
```

如此一來，當 Angular 核心程式建立元件並進入初始化(`OnInit`)的生命週期時，會判斷其中是否有 `ngOnInit` 方法，若有則執行這個方法。我們便能在元件初始化時執行某些行為。

## 使用介面宣告 lifecycle hooks

為了避免打錯字，Angular 也提供了所有生命週期的介面(interface)宣告，放在 `@angular/core` 中，如下範例程式：

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  ...
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // do something...
  }
}
```

在上面程式中，我們加入了 `OnInit` 的介面，在宣告元件類別時，加上了 `implements OnInit`，讓 TypeScript 在處理程式時，知道我們需要實作 `OnInit` 介面中宣告的方法，`OnInit` 介面中所宣告的方法簽章如下

```typescript
export interface OnInit {
    ngOnInit(): void;
}
```

因此，所有宣告需要實作 `OnInit` 介面的類別，都需要在其中宣告 `ngOnInit()` 方法，由於 JavaScript 本來就不是強行別的程式與言，因此這個宣告要實作介面的行為**不是必須**的，但為了避免不小心打錯字等等的人為疏失，可以透過 TypeScript 的型別機制，確保這個方法一定會被呼叫！

# 元件的完整生命週期

以下是一個元件可能會被呼叫生命週期，按照可能被呼叫的順序排序

## OnChanges

當元件有 `@Input()` 且從外部有透過屬性綁定的方式將資料傳入時，當元件初始化時在 `ngOnInit()` 前呼叫 `ngOnChanges()` 方法；且每當 `@Input()` 的值有變化時，都會呼叫此方法，藉此得知資料被改變了，如下程式：

```typescript
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  template: `<span>{{ price }}</span>`
})
export class PriceComponent implements OnInit, OnChanges {
  @Input() price;

  ngOnInit() {
    console.log('Price Component Init');
  }

  ngOnChanges() {
    console.log('Price Component Input Changed');
  }
}

@Component({
  selector: 'my-app',
  template: `
  <app-price [price]="value"></app-price>
  `
})
export class AppComponent  {
  value = 100;
}
```

執行結果如下圖：

{% asset_img 01.png %}

可以看到 `ngOnChanges()` 確實會在 `ngOnInit()` 之前被呼叫。

{% note info %}

注意如果沒有 `@Input()` 時，是不會有 `ngOnChanges()` 週期的。

{% endnote %}

### 得知 Input() 的變化內容

在 `ngOnChanges()` 內，可以加入一個 [SimpleChanges型別](https://angular.io/api/core/SimpleChanges) 的參數，SimpleChanges 是一個 key/value 的型別，key 代表的是每個 @Input() 的欄位名稱，而 value 都是 [SimpleChange型別](https://angular.io/api/core/SimpleChange)，用來得知以下資訊：

- `firstChange`：boolean 值，只有在第一次呼叫時為 true，之後都是 false
- `previousValue`：上次呼叫時的值
- `currentValue`：這次變更時的值

因此從上述程式，我們可以變化為：將賠率/股價等類型的資訊，放到一個元件中，並依照資訊的增減呈現不同的變化

```typescript
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-price',
  template: `
  <span class="price" [ngClass]="{increase: price > lastPrice, decrease: price < lastPrice }">
    {{ price }}
    <span>{{ firstChange ? '' : (price > lastPrice ? '↑' : '↓') }}</span>
  </span>
  `,
  styles: [
    ` .price { background: black;  color: white; }
      .increase { color: red; }
      .decrease { color: green; }
    `
  ]
})
export class PriceComponent implements OnInit, OnChanges {
  firstChange = true;
  lastPrice;
  @Input() price;

  ngOnInit() {
    console.log('Price Component Init');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Price Component Input Changed');
    this.firstChange = changes['price'].firstChange;
    this.lastPrice = changes['price'].previousValue;
  }
}
```

執行結果如下圖：

{% asset_img 02.gif %}

關於以上 `ngOnChanges` 的參考程式如下：

https://stackblitz.com/edit/ironman-2019-lifecycles-ngonchanges?file=src/app/app.component.ts

## OnInit

OnInit 的週期就相對簡單的多，在第一次執行完 `ngOnChanges()` 後(如果有的話)，就會進入 `ngOnInit()` 週期，大部分的初始化程式都建議在 `ngOnInit()` 週期中執行，而非在建構式處理，尤其是比較複雜程式或 ajax 呼叫，建議都在 `ngOnInit()` 中執行。

放在建構式中明顯的缺點是：撰寫單元測試時，由於建構式本身對外部程式的依賴太重，容易造成測試程式難以撰寫。

## DoCheck

`ngDoCheck()` 會在 Angular 核心程式執行變更偵測後呼叫，我們可以在這裡面額外撰寫程式來處理變更偵測所無法偵測到的部分。

例如剛才原本練習 `ngOnChanges()` 的程式中，若我們把原來的 price 改成一個物件，如下：

```typescript
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-price',
  template: `
  <span class="price" [ngClass]="{increase: price > lastPrice, decrease: price < lastPrice }">
    {{ price.value }}
    <span>{{ firstChange ? '' : (price > lastPrice ? '↑' : '↓') }}</span>
  </span>
  `,
  styles: [
    ` .price { background: black;  color: white; }
      .increase { color: red; }
      .decrease { color: green; }
    `
  ]
})
export class PriceComponent implements OnInit, OnChanges {
  firstChange = true;
  lastPrice;
  @Input() price;

  ngOnInit() {
    console.log('Price Component Init');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Price Component Input Changed');
    this.firstChange = changes['price'].firstChange;
    this.lastPrice = changes['price'].previousValue;
  }
}

@Component({
  selector: 'my-app',
  template: `
  <app-price [price]="price"></app-price>
  <button (click)="increase()">Increase</button>
  <button (click)="decrease()">Decrease</button>
  `
})
export class AppComponent {
  price = { value: 100 };

  increase() {
    this.price.value += 2;
  }

  decrease() {
    this.price.value -= 2;
  }
}
```

此時的執行結果如下：

{% asset_img 03.gif %}

可以看到畫面上雖然有變化，但除了第一次以外，完全不再進入 OnChanges 生命週期中，因此偵測不到資料是否真的有變化了，這是因為在變更偵測時，我們的 `price` 物件本身的**參考位置(reference)**沒有改變的關係，因此在變更偵測時 Angular 認為 price 這個 Input 並沒有變更。

要改變這個結果有兩種方式，一種是複製一個新的物件再改變新物件的內容，並把 price 指派為新的物件，此時因為物件的參考位置修改了，變更偵測就能夠認得；當然每次都建立新物件是有成本的，所以我們也能在 DoCheck 週期中自行判斷，如下：

```typescript
import { Component, DoCheck, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  template: `
  <span class="price" [ngClass]="{increase: priceIncrease, decrease: priceDecrease }">
    {{ price.value }}
    <span>{{ firstChange ? '' : (priceIncrease ? '↑' : '↓') }}</span>
  </span>
  `,
  styles: [
    ` .price { background: black;  color: white; }
      .increase { color: red; }
      .decrease { color: green; }
    `
  ]
})
export class PriceComponent implements OnInit, DoCheck {
  firstChange = true;
  lastPriceValue:number;
  priceIncrease: boolean;
  priceDecrease: boolean;
  @Input() price: { value: number };

  ngOnInit() {
    console.log('Price Component Init');
  }

  ngDoCheck() {
    // 在這裡主動判斷資料是否有變更 (判斷 Angular 所無法判斷的部分)
    if (this.price && this.lastPriceValue && this.price.value !== this.lastPriceValue) {
      this.firstChange = false;
      this.priceIncrease = this.price.value > this.lastPriceValue;
      this.priceDecrease = this.price.value < this.lastPriceValue;
    }
    this.lastPriceValue = this.price.value;
  }
}
```

程式碼位置：

https://stackblitz.com/edit/ironman-2019-lifecycles-ngdocheck?file=src/app/app.component.ts

## AfterContentInit 與 AfterContentChecked

在設計元件時，我們會使用 `<ng-content>` 來允許使用元件的時候放置更多的 HTML 內容，我們常使用 `<ng-content>` 來設計類似 tabs 功能的元件，如下：

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-block',
  template: `
  <div class="block">
    <ng-content></ng-content>
  </div>`,
  styles: [
    `.block { border: 1px solid black; }`
  ]
})
export class BlockComponent { }

@Component({
  selector: 'my-app',
  template: `
  <button (click)="tab = 1">Tab 1</button>
  <button (click)="tab = 2">Tab 2</button>
  <button (click)="tab = 3">Tab 3</button>
  <app-block *ngIf="tab === 1">
    Tab 1
  </app-block>
  <app-block *ngIf="tab === 2">
    Tab 2
  </app-block>
  <app-block *ngIf="tab === 3">
    Tab 3
  </app-block>
  `
})
export class AppComponent{
  tab = 1;
}
```

上面程式 BlockComponent 中的樣板透過了 `<ng-content>` 的方式，讓顯示的內容改為由使用元件的父元件來決定，增加元件的彈性。

在 DoCheck 週期後，會立刻觸發 AfterContentInit 週期，之後每當有變更偵測發生時，在 DoCheck 後觸發 AfterContentChecked。

在使用 `<ng-content>` 的元件內，我們可以使用 `@ContentChild` 來取得某個樣板參考變數實體或子元件，若父元件在使用時有加入符合 `@ContentChild` 設定的條件時，在 AfterContentInit 週期就可以取得其實體，若想取得多個實體，則可以使用 `@ContentChildern` 來取得一個包含所有實體的 [QueryList](https://angular.io/api/core/QueryList) 如下：

```typescript
import { AfterContentChecked, AfterContentInit,  ContentChild, ContentChildren, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-block',
  template: `
  <div class="block">
    <ng-content></ng-content>
  </div>`,
  styles: [
    `.block { border: 1px solid black; }`
  ]
})
export class BlockComponent {
  @ContentChild('button') button;
  @ContentChildren('button') buttons;
  
  ngOnInit() {
    // 此時還得不到 <ng-content> 裡面的內容
    console.log('OnInit - The Button is', this.button);
    console.log('OnInit - The Buttons are', this.buttons);
  }

  ngAfterContentInit() {
    // 此時才能取得 <ng-content> 裡面的內容
    console.log('AfterContentInit - The Button is', this.button);
    console.log('AfterContentInit - The Buttons are', this.buttons);
  }

  ngAfterContentChecked() {
    // 在 <ng-content> 內變更偵測都完成後觸發
    console.log('AfterContentChecked - The Button is', this.button);
    console.log('AfterContentChecked - The Buttons are', this.buttons);
  }
}

@Component({
  selector: 'my-app',
  template: `
  <button (click)="tab = 1">Tab 1</button>
  <button (click)="tab = 2">Tab 2</button>
  <button (click)="tab = 3">Tab 3</button>
  <app-block *ngIf="tab === 1">
    Tab 1
    <button #button (click)="tab = 2">Next</button>
  </app-block>
  <app-block *ngIf="tab === 2">
    Tab 2
    <button #button (click)="tab = 3">Next</button>
  </app-block>
  <app-block *ngIf="tab === 3">
    Tab 3
    <button #button (click)="tab = 1">Tab 1</button>
    <button #button (click)="tab = 2">Tab 2</button>
  </app-block>
  `
})
export class AppComponent{
  tab = 1;
}
```



程式碼位置：

https://stackblitz.com/edit/ironman-2019-lifecycles-aftercontent?file=src%2Fapp%2Fapp.component.ts

## AfterViewInit 與 AfterViewChecked

在 AfterContentInit 觸發後，會觸發 AfterViewInit，之後觸發 AfterViewChecked，而在每次變更偵測後也會觸發 AfterViewChecked。

在開發元件時，我們常常會使用 `@ViewChild` 取得樣板上的某個**子元件**宣告，如果想取得樣板上指定的某個子元件的所有宣告，則可以使用 `@ViewChildren` 取得一個包含所有子元件的 QueryList，這些子原件在其父元件的 OnInit 週期時還不會產生實體，必須在 AfterViewInit 之後，才能正確取得實體，如以下程式：

```typescript
import { AfterViewChecked, AfterViewInit, Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<div>Child {{ value }}</div>`,

})
export class ChildComponent {
  @Input() value
}

@Component({
  selector: 'my-app',
  template: `
  <button (click)="create()" #button>Create New Child</button>
  <app-child *ngFor="let item of list" [value]="item"></app-child>
  `
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('button') button;
  @ViewChild(ChildComponent) child;
  @ViewChildren(ChildComponent) children: QueryList<ChildComponent>;

  list = [0];

  ngOnInit() {
    // 在這裡可以使用 @ViewChild 取得某個原生的 DOM
    // 但取不到子元件實體
    console.log('Button in OnInit', this.button);
    console.log('Child in OnInit', this.child);
    console.log('Children in OnInit', this.children);
  }

  ngAfterViewInit() {
    // 在 AfterViewInit 中可以取得子元件實體
    // 使用 @ViewChild 時，永遠只會取到第一個子元件
    console.log('Child in AfterViewInit', this.child);
    console.log('Children in AfterViewInit', this.children);
  }

  ngAfterViewChecked() {
    // 在每次樣板上元件的變更偵測都完成後觸發
    console.log('Child in AfterViewChecked', this.child);
    console.log('Children in AfterViewChecked', this.children);
  }

  create() {
    this.list = [...this.list, this.list.length];
  }

}
```

程式碼位置：

https://stackblitz.com/edit/ironman-2019-lifecycles-afterview?file=src%2Fapp%2Fapp.component.ts

## OnDestroy

OnDestroy 會在元件不需要被使用時，觸發 `ngOnDestroy()` 方法，通常用來處理一些清理資料行為，若有些程式是不會在元件消失時被清除的，則需要在這個週期內額外處理，最常見的就是使用 RxJS 且有 subscribe 行為時，可能需要額外處理退訂的動作，以免重複訂閱或產生預期外的行為，如下程式：

```typescript
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `{{ counter }}`
})
export class TimerComponent implements OnInit {
  counter = 0;

  ngOnInit() {
    interval(1000).subscribe(val => {
      this.counter = val;
      console.log(this.counter);
    })
  }
}

@Component({
  selector: 'my-app',
  template: `
  Timer: <app-timer *ngIf="displayTimer"></app-timer>
  <button (click)="displayTimer = !displayTimer">Toggle Display Timer</button>`
})
export class AppComponent{
  displayTimer = true;
}

```

執行結果如下：

{% asset_img 04.gif %}

可以看到當 `<app-timer>` 消失時，裡面的 `interval` 程式還依然在執行，且當再次產生 `<app-timer>` 時，就會再次產生新的訂閱，長期下來就容易產生 memory leak，因此就應該在 `ngOnDestroy()` 時，進行退訂的動作。如下：

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `{{ counter }}`
})
export class TimerComponent implements OnInit, OnDestroy {
  counter = 0;
  subscription: Subscription;

  ngOnInit() {
    // 取得訂閱
    this.subscription = interval(1000).subscribe(val => {
      this.counter = val;
      console.log(this.counter);
    })
  }
  
  ngOnDestroy() {
    // 取消訂閱
    this.subscription.unsubscribe();
  }
}
```

{% note info %}

關於 RxJS 的自動退訂，其實還有許多技巧，之後的詳細介紹 RxJS 時再來說明。

{% endnote %}

# 本日小結

今天我們認識了所有 Angular 在執行元件時的生命週期，以及不同的應用情境；在需要撰寫共用元件時，這些生命週期的觀念就非常重要，有了正確的觀念及順序，才能夠正確的設計出好用的元件，也更不容易發生錯誤囉。

# 相關資源

- [Angular - Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks)
- [Component Lifecycle](https://angular-2-training-book.rangle.io/handout/advanced-components/component_lifecycle.html)
