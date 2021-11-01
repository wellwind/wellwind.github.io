---
title: "[Angular 大師之路] 認識 AsyncPipe (2) - 進階技巧"
date: 2018-11-12 20:09:24
category: "Angular 大師之路"
tags:
  - Angular
  - AsyncPipe
  - ChangeDetectorRef
  - OnPush
---

今天我們來認識一下兩個重要的 AsyncPipe 特性，可以幫助我們在使用 AsyncPipe 時更有信心，打造出更高效能的程式！

<!-- more -->

**類型**：觀念/技巧

**難度**：5 顆星

**實用度**：4 顆星

# 特性 1：自動退訂

先來看看這段簡單的程式碼：

```typescript
import { Component, OnInit, OnDestroy} from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-counter',
  template: `{{ value }}`
})
export class CounterComponent implements OnInit, OnDestroy {
  value = 0

  ngOnInit() {
    interval(1000).subscribe((counter) => {
      console.log(counter);
      this.value = counter;
    })
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}


@Component({
  selector: 'my-app',
  template: `
    <app-counter *ngIf="display"></app-counter>
    <button (click)="display = !display">Toggle</button>
  `,
})
export class AppComponent  {
  display = true;
}
```

在上面的程式碼中，我們設計了 `CounterComponent` 並使用 RxJS 的 `interval()` 在訂閱後每秒變更一次資料，另外在畫面上設計一個按鈕來決定是否需要銷毀這個元件，當 `display` 為 `false` 時，`<app-counter>` 元件將會被銷毀，而當 `display` 為 `true` 時， `<app-counter>` 元件將重新產生。

看起來一切沒什麼問題，但是當我們打開 F12 時會發現，雖然元件被摧毀了，但 `interval()` 的行為並沒有停止！這將會造成每次產生元件時，就會產生一段新的 `interval()` ，當次數多了後將會佔據大量的記憶體，進而發生 memory leak 的問題；要避免這問題，最直覺的方式是當元件要被璀毀時，於 `ngOnDestory` 方法內使用 `unsubscribe` 取消訂閱：

```typescript
export class CounterComponent implements OnInit, OnDestroy {
  value = 0
  subscription: Subscription;

  ngOnInit() {
    this.subscription = interval(1000).subscribe((counter) => {
      console.log(counter);
      this.value = counter;
    })
  }

  ngOnDestroy() {
    console.log('destroy');
    this.subscription.unsubscribe();
  }
}
```

雖然取消訂閱人人有責，但是當程式中的 observable 越來越多時，總是會有不小心忘記訂閱的時候，這時 AsyncPipe 就能派上大作用啦！

## 使用 AsyncPipe 的自動退訂機制

從 [AsyncPipe 的程式碼](https://github.com/angular/angular/blob/7.0.x/packages/common/src/pipes/async_pipe.ts#L25)可以看到，當 AsyncPipe 處理 observable 時，會在 [ngOnDestoy 時](https://github.com/angular/angular/blob/7.0.x/packages/common/src/pipes/async_pipe.ts#L81-L85)自動將 observable 退訂！因此上面的程式我們可以簡單改寫為：

```typescript
@Component({
  selector: 'app-counter',
  template: `{{ value$ | async }}`
})
export class CounterComponent implements OnInit {
  value$: Observable<number>;

  ngOnInit() {
    this.value$ = interval(1000).pipe(
      tap(counter => console.log(counter))
    );
  }
}
```

由於 AsyncPipe 會自動退訂的關係，我們不再需要手動執行退訂的程式，整個程式看起來是不是清爽多啦！

# 特性 2：自動要求變更偵測

在 [AsyncPipe 程式碼的另一角落](https://github.com/angular/angular/blob/7.0.x/packages/common/src/pipes/async_pipe.ts#L143)，我們可以發現在資料變更時(不管是 Promise 還是 RxJS)，會自動使用 `ChangeDetectorRef` 的 `markForCheck()` 方法，自動要求變更偵測發生；會有這樣的程式需求也不難理解，當我們給予一個 observable 實體時，不管內部的值再怎麼變化，observable 的實體參考位置也不會變化，因此當元件的變更偵測策略為 `OnPush` 時，使用 AsyncPipe 就會發生沒有進行變更偵測的問題！所以 AsyncPipe 在訂閱(或呼叫 `then()`)的同時，也會要求變更偵測需要處理！

## 搭配 OnPush 策略

透過上述提到的特性，如果元件中只剩下 observable + AsyncPipe 時，我們就可以光明正大地把元件的 `OnPush` 策略打開，並且完全不用手動去呼叫 `markForCheck` 方法，AsyncPipe 會在需要變更偵測時主動幫我們處理！

```typescript
@Component({
  selector: 'app-counter',
  template: `{{ (data$ | async)?.value }}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {
  @Input() data$: Observable<any>;
  ngOnInit() { }
}
```

從此以後每個單純用來顯示資料的元件，再打開 `OnPush` 之後，既能夠維持元件一定程度的高效能，又不怕忘記呼叫 `markForCheck` 啦！

善用 RxJS 與 AsyncPipe，要打造出既好維護，相對效能又高的元件一點都不困難啊！！

今天的程式碼參考連結：

https://stackblitz.com/edit/ironman2019-asyncpipe-onpush?file=src/app/app.component.ts
