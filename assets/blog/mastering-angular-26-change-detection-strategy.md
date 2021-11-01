---
title: "[Angular 大師之路] 認識元件的變更偵測策略"
date: 2018-11-10 09:58:47
category: "Angular 大師之路"
tags:
  - Angular
  - ChangeDetectionStrategy
  - OnPush
  - ChangeDetectorRef
  - Pure Component
---

今天我們來看看元件內的變更偵測策略，打造高效能元件！

<!-- more -->

**類型**：觀念

**難度**：5 顆星

**實用度**：4 顆星

# 關於元件內的變更偵測

首先來看一下這段程式碼：

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    Num: {{ data.num }}
  `
})
export class CounterComponent {
  @Input() data;
}

@Component({
  selector: 'app-root',
  template: `
    <app-counter [data]="data"></app-counter>
    <button (click)="plus()"> + 1</button>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  data = { num: 1 };
  
  plus() {
    ++this.data.num;
  }
}
```

上面的程式很單純，就是一個 `CounterComponent` 用來顯示資料，沒有任何的邏輯；而 `AppComponent` 中負責變更 `data` 物件內的資料。

我們可以在元件的 `@Component` 中設定 `changeDetection` 屬性，這個屬性包含兩個設定，分別是

- `Default`：預設的變更偵測設定，會檢查所有屬性資料的變更，若資料是物件，物件內的屬性變更也會檢查，也就是「盡可能找到所有變更」，又稱為「**髒檢查**」(dirty check)
- `OnPush`：當設定為 `OnPush` 時，只有在元件的 `@Input` 變更，且**真正有變更**時，才會進行變更偵測。

## 物件變數真正的變更

什麼叫真正變更呢？假設有一個物件 `data = {num: 1}`，則：

```typescript
data.num = data.num + 1;
```

上述程式對於 `data` 物件本身而言，是沒有變更的，因為物件在程式是個參考位置，變更裡面的屬性不會變更物件的參考位置。

```typescript
data = { num: data.num + 1 };
```

上述程式對於 `data` 物件，才算是真正的變更，因為我們建立個一個新的物件，並指派給 `data` 變數！

# 使用 OnPush

有了基本物件變更的觀念後，我們來看看使用 `OnPush` 策略會發生什麼事情：

```typescript
@Component({
  selector: 'app-counter',
  template: `
    Num: {{ data.num }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  @Input() data;
}
```

我們將元件的變更偵測策略改成了 `OnPush` ，此時在原來 `AppComponent` 內的程式 `++this.data.num`，將不會觸發 `CounterComponent` 的變更偵測，因為對於 `CounterComponent` 的 `data` 這個 `@Input` 來說，並沒有**真正的變更**，所以畫面並沒有更新！

{% note info %}

另外值得注意的是，當一個元件設定變更偵測策略為 `OnPush` 時，這個元件下使用的其他子元件，也通通不會觸發變更偵測！

{% endnote %}

## Pure Component

通常我們什麼時候會使用 `OnPush` 呢？主要是有效能考量的時候，我們不希望 Angular 使用 dirty check 的方式進行變更偵測，只有在資料真正變更時才更新。

在設計上，這類的元件通常就不會有很複雜的程式邏輯在裡面，而是單純的顯示資料，並給予最少的邏輯，以及最少的內部資料變更，由於他是單純顯示資料，我們通常也稱為 Pure Component！

也就是說，由於 PureComponent 只負責資料顯示，沒有更多的變更邏輯，因此我們可以設定成 `OnPush` 策略，以避免所有元件都進行了不必要的變更偵測，讓程式更快！

# 使用 ChangeDetectorRef 的 markForCheck

當我們設定了 `OnPush` 策略時，只有在 `@Input` 真正被變更時才會進行變更偵測處理，但現實中的情境總是不一定那麼簡單，如果在設定 `OnPush` 策略的元件內想要主動觸發變更偵測時，該怎麼辦呢？這時候我們可以使用 `ChangeDetectorRef` 提供的 `markForCheck` 方法，主動通知 Angular 進行變更偵測！

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <span (click)="plus()">Num: {{ data.num }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {
  @Input() data;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 5000)
  }
}
```

今天的程式碼參考位置：

https://stackblitz.com/edit/ironman2019-change-detection-strategy

# 相關資源

- [Component#changeDetection](https://angular.io/api/core/Component#changeDetection)
- [ChangeDetectionStrategy](https://angular.io/api/core/ChangeDetectionStrategy)
- [A Comprehensive Guide to Angular onPush Change Detection Strategy](https://netbasal.com/a-comprehensive-guide-to-angular-onpush-change-detection-strategy-5bac493074a4)
- [Everything you need to know about change detection in Angular](https://blog.angularindepth.com/everything-you-need-to-know-about-change-detection-in-angular-8006c51d206f)
- [EDU - Understand Angular Change Detection](https://danielwiehl.github.io/edu-angular-change-detection/)
  - 這是一個很有趣的網站，我們可以在畫面上指定某個元件要不要使用變更偵測，然後看到哪些元件真正被觸發變更偵測了
