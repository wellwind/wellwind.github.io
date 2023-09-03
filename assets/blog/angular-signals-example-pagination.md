---
title: "使用 Angular Signals 實作分頁功能"
date: 2023-05-14 13:31:27
category: "Angular 大師之路"
tags:
  - Angular
  - Signals
  - Pagination
---

今天這篇文章來簡單用 Angular Signals 實作一個分頁功能，體驗一下使用 Angular Signals 與 Reactive Programming 的開發思維。

<!-- more -->

## 不使用 Angular Signals

一般來說，至少會需要一個 `currentPage` 變數，儲存目前頁碼。另外我們也準備上一頁的變數 `previousPage` 和下一頁的變數 `nextPage`。

另外一個常識性的重點是，上一頁不可以小於 1，且下一頁不可以大於總頁數，當然目前頁碼也一樣不可以小於 1 及大於總頁數。

因此我們需要至少兩個 `@Input()`

```ts
@Input() page = 1;
@Input() pageCount = 1;
```

另外是在這個範例中不是重點，但也是需要的 `pageChange` 事件，以告知使用元件的人頁碼已經被改變了

```ts
@Output() pageChange = new EventEmitter<number>();
```

最後前面規劃的三個內部狀態，供畫面顯示用

```ts
currentPage = 1;
previousPage = 1;
nextPage = 1;
```

接著是切換頁碼的功能，無論是點擊某個單頁面頁碼，或是點擊「上一頁」、「下一頁」這種按鈕，其實都是「跳到某一個頁碼」的實作

```ts
jumpTo(num: number) {
  this.currentPage = num;

  // 觸發事件
  this.pageChange.emit(num);

  // 上一頁頁碼
  this.previousPage = num - 1;

  // 下一頁頁碼
  this.nextPage = num + 1;
}
```

以上是最簡的實作，但三個頁碼的狀態其實都有額外的規則，我們可以稍微調整一下

```ts
jumpTo(num: number) {
  // 頁碼不可以小於 1 或大於總頁碼
  if(num < 1 || num > this.pageCount) {
    return;
  }

  this.currentPage = num;

  // 觸發事件
  this.pageChange.emit(num);

  // 上一頁不可以小於 1
  if(this.currentPage > 1) {
    this.previousPage = this.currentPage - 1;
  }

  // 下一頁不可以大於總頁碼
  if(this.currentPage + 1 <= this.pageCount) {
    this.nextPage = this.nextPage + 1;
  }
}
```

再補上「上一頁」和「下一頁」的按鈕功能

```ts
goPrevious() {
  this.jumpTo(this.currentPage - 1);
}

goNext() {
  this.jumpTo(this.currentPage + 1);
}
```

一個簡單的邏輯就完成了，邏輯不算太複雜，但也要處理不少事情，接著我們來看看 Angular Signals 加上 Reactive Programming 思維會如何寫作。

## 使用 Angular Signals

在 Reactive Programming 思維下，所有的資料變化都有一個來源，而整個功能目前的最主要來源，就是「頁碼的切換」，因此我們先將 `currentPage` 變成是一個 signal

```ts
currentPage = signal(1);
```

在切換頁碼時，可以單純呼叫 `set` 方法就好

```ts
jumpTo(num: number) {
  // 頁碼不可以小於 1 或大於總頁碼
  if(num < 1 || num > this.pageCount) {
    return;
  }

  // 送出目前頁碼變更的訊號
  this.currentPage.set(num);

  // 觸發事件
  this.pageChange.emit(num);
}
```

此時上一頁以及下一頁的頁碼，就可以很簡單的用 `computed` 來根據 `currentPage` 的變化進行計算

```ts
// 上一頁頁碼
previousPage = computed(() => {
  // 檢查頁碼是否大於 1
  return this.currentPage() > 1 
    ? this.currentPage() - 1 
    : this.currentPage();
})

// 下一頁頁碼
nextPage = computed(() => {
  // 檢查頁碼是否小於總頁數
  return this.currentPage() < this.pageCount
    ? this.currentPage() + 1
    : this.currentPage()
});
```

最後「上一頁」以及「下一頁」的功能就沒什麼變化，只是改成從 signal 取得資料

```ts
goPrevious() {
  this.jumpTo(this.currentPage() - 1);
}

goNext() {
  this.jumpTo(this.currentPage() + 1);
}
```

從這樣的範例可以發現，與之前相比，`jumpTo` 的功能就只關注於「目前頁碼的變化」，不再關注「上一頁頁碼」以及「下一頁頁碼」，職責明顯變簡單，只要明確的處理「目前頁碼」相關的邏輯即可。

而「上一頁頁碼」就單純的「回應」目前頁碼的變化，並只關注在「上一頁頁碼」該如何計算的邏輯；同理，「下一頁頁碼」也是一樣。

如此一來，每段程式碼都會變得更加簡單，且更加關注自己的職責，達到 Reactive Programming 的設計精神囉！

完整程式碼一次看：

```ts
export class PaginationComponent implements OnInit {
  @Input() page = 1;
  @Input() pageCount = 1;

  @Output() pageChange = new EventEmitter<number>();

  // 目前頁碼
  currentPage = signal(1);

  // 上一頁頁碼
  previousPage = computed(() => {
    // 檢查頁碼是否大於 1
    return this.currentPage() > 1 
      ? this.currentPage() - 1 
      : this.currentPage();
  })

  // 下一頁頁碼
  nextPage = computed(() => {
    // 檢查頁碼是否小於總頁數
    return this.currentPage() < this.pageCount
      ? this.currentPage() + 1
      : this.currentPage()
  });

  ngOnInit() {
    // 根據 @Input() 初始頁碼狀態
    this.currentPage.set(this.page);
  }

  jumpTo(num: number) {
    // 頁碼不可以小於 1 或大於總頁碼
    if(num < 1 || num > this.pageCount) {
      return;
    }

    // 送出目前頁碼變更的訊號
    this.currentPage.set(num);

    // 觸發事件
    this.pageChange.emit(num);
  }

  goPrevious() {
    this.jumpTo(this.currentPage() - 1);
  }

  goNext() {
    this.jumpTo(this.currentPage() + 1);
  }
}
```
