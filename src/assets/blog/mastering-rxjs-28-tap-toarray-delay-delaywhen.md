---
title: "[RxJS] 工具類型 Operators (1) - tap / toArray / delay / delayWhen"
date: 2020-10-13 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - tap
  - toArray
  - delay
  - delayWhen
---

今天要介紹的是「工具類型」的 Operators，也都不太困難，很好理解，繼續輕鬆學習吧！

<!-- more -->

# tap

在之前文章介紹 functional programming 在 RxJS 應用時，已經稍微介紹過 `tap` 這個 operator 了，今天來更深入的介紹一下。

`tap` 主要就是用來處理 side effect 的，在使用各種 operators 時，我們應該盡量讓程式內不要發生 side effect，但真的有需要處理 side effect 時，可以使用 `tap` 把「side effect」和「非 side effect」隔離，未來會更加容易找到問題發生的地方。

```typescript
interval(1000).pipe(
  map(data => data * 2),
  // 使用 tap 來隔離 side effect
  tap(data => console.log('目前資料', data)),
  map(data => data + 1),
  tap(data => console.log('目前資料', data)),
  take(10)
).subscribe((data) => {
  console.log(`tap 示範 (1): ${data}`);
});
```

把 `tap` 拿掉時，我們完全可以知道整個運作的過程，而實際上加入 `tap` 後運作過程也不會因此改變，我們只是在 `tap` 中處理 side effect 的邏輯 (如 `console.log`、DOM 操作等)。

一般來說，在整個 Obsevable 運作時只建議在 `Subscribe` 內運行執行 side effct 程式碼，但若在 Observable 資料流動中執行 side effect 時，使用 `tap` 來處理就對了！

上面的程式中，我們都是接受來源 Observable 的 `next()` 事件資料；除此之外，`tap` 也可以用來接收來源 Observable 的 `error` 和 `complete` 資訊，只要傳入一個觀察者物件即可：

```typescript
const observer = {
    next: (data) => console.log(`tap 示範 (2): ${data}`),
    error: (error) => console.log(`tap 示範 (2): 發生錯誤 - ${error}`),
    complete: () => console.log('tap 示範 (2): 結束'),
  };

interval(1000).pipe(
  take(3),
  map(data => data * 2),
  map(data => data + 1),
  tap(observer)
).subscribe();
// tap 示範 (2): 1
// tap 示範 (2): 3
// tap 示範 (2): 5
// tap 示範 (2): 結束
```

上面的例子會收到每次事件，以及完成的資訊，接下來看看發生錯誤的情境：

```typescript
interval(1000).pipe(
  take(3),
  map(data => data * 2),
  map(data => data + 1),
  // 當資料為 3 時，拋出錯誤
  switchMap(data => iif(() => data === 3, throwError('error'), of(data))),
  tap({
    next: (data) => console.log(`tap 示範 (3): ${data}`),
    error: (error) => console.log(`tap 示範 (3): 發生錯誤 - ${error}`),
    complete: () => console.log('tap 示範 (3): 結束'),
  })
).subscribe();
// tap 示範 (3): 1
// tap 示範 (3): 發生錯誤 - error
```

還有一種寫法，是直接在 `tap` 內傳入三個 callback function 分別代表 `next()`、`error()` 和 `complete()`：

```typescript
interval(1000).pipe(
  take(3),
  map(data => data * 2),
  map(data => data + 1),
  tap(
    // 處理 next
    (data) => console.log(`tap 示範 (4): ${data}`),
    // 處理 error
    (error) => console.log(`tap 示範 (4): 發生錯誤 - ${error}`),
    // 處理 complete
    () => console.log('tap 示範 (4): 結束'),
  )
).subscribe();
// tap 示範 (4): 1
// tap 示範 (4): 3
// tap 示範 (4): 5
// tap 示範 (4): 結束
```

{% note danger %}

傳入 3 個 callback 的寫法在 RxJS 7 將被標示為棄用 (只傳入一個處理 `next()` 沒問題)，沒意外的話 RxJS 8 會移除，屆時要處理 `error()` 或 `complete()` 需要使用傳入 Observer 物件的寫法。

{% endnote %}

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-tap

# toArray

`toArray` 在來源 Observable 發生事件時，不會立即發生在新的 Observable 上，而是將資料暫存起來，當來源 Observable **結束**時，將這些資料組合成一個陣列發生在新的 Observable 上。

```typescript
interval(1000)
  .pipe(
    take(3),
    toArray()
  )
  .subscribe(data => {
    console.log(`toArray 示範: ${data}`);
  });
// toArray 示範: 0,1,2
```

彈珠圖：

```
---0---1---2|
toArray()
-----------([0, 1, 2]|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-toarray

`toArray` 還有一種妙用，就是拿來處理陣列相關的邏輯，我們可以使用 `of`、`from` 或 `range` 等建立 Observable 的 operator 來產生一個固定的 Observable，透過 Observable 及 `pipe` 是一筆一筆資料流入所有 operators 的特性，來處理資料：

```typescript
from([1, 2, 3, 4, 5, 6, 7, 8, 9]).pipe(
  map(value => value * value),
  filter(value => value % 3 === 0),
  toArray()
).subscribe(result => console.log(result));
```

乍看之下跟直接使用陣列的操作沒什麼不同：

```typescript
[1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map(value => value * value)
  .filter(value => value % 3 === 0);
```

但實際上效能會好上很多，因為 Observable 不會把整個陣列全部帶入 `map` 再帶入 `filter` 內；同時還可以享有更多 operators 的支援！

# delay

`delay` 會讓來源 Observable 延遲一個指定時間(毫秒)再開始。

```typescript
of(1, 2, 3).pipe(
  delay(1000)
).subscribe(data => {
  console.log(`delay 示範: ${data}`);
});
// (等候 1 秒鐘)
// delay 示範: 1
// delay 示範: 2
// delay 示範: 3
```

彈珠圖：

```
(123|)
delay(1000)
---(123|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-delay

# delayWhen

`delayWhen` 可以自行決定來源 Observable 每次事件延遲發生的時機點，在 `delayWhen` 內需要傳入一個 `delayDurationSelector` callback function，`delayWhen` 會將事件資訊傳入，而 `delayDurationSelector` 需要回傳一個 Observable，當此 Observable 發生新事件時，才會將來源事件值發生在新的 Observable 上：

```typescript
const delayFn = (value) => {
  return of(value).pipe(delay(value % 2 * 2000));
}

interval(1000).pipe(
  take(3),
  delayWhen(value => delayFn(value))
).subscribe(data => {
  console.log(`delayWhen 示範 (1): ${data}`);
});
// delayWhen 示範 (1): 0
// (原本應該發生事件 1，但被延遲了)
// delayWhen 示範 (1): 2
// delayWhen 示範 (1): 1
```

上面例子中，我們自定要延遲的時間點，當資料是偶數時，因為 `delay(0)` 的關係不會有任何延遲，而當資料是奇數時。因為 `delay(2000)` 的關係，所以會延遲兩秒鐘，因此事件資料 `1` 會比較晚發生。

彈珠圖：

```
----0----1----2|
delayWhen(value => of(value).pipe(delay(value % 2 * 2000)))
----0---------2----1|
         ^ 延遲兩秒發生
                   ^ 所以到這時才發生事件
```

`delayWhen` 還有第二個參數(非必須)，是一個 `subscriptionDelay` Observable，`delayWhen` 可以透過這個 Observable 來決定來源 Observable 開始的時機點；當整個 Observable 訂閱開始時，`delayWhen` 會訂閱這個 `subscriptionDelay` Observable ，當事件發生時，才真正訂閱來源 Observable，然後退訂閱 `subscriptionDelay` Observable。

```typescript
interval(1000).pipe(
  take(3),
  delayWhen(
    value => delayFn(value),
    fromEvent(document, 'click')
  )
).subscribe(data => {
  console.log(`delayWhen 示範 (2): ${data}`);
});
// ...(當按下滑鼠時，才開始)
// delayWhen 示範 (1): 0
// (原本應該發生事件 1，但被延遲了)
// delayWhen 示範 (1): 2
// delayWhen 示範 (1): 1
```

彈珠圖：

```
click$   ------c...
source$  ----0----1----2|
delayWhen(
  value => delayFn(value),
  click$
)
         ----------0---------2----1|
               ^ click$ 事件發生
                   ^ 依照 delayFn 的邏輯決定資料延遲時間
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-delaywhen

# 本日小結

- `tap`：可以用來隔離「side effect」以及「非 side effect」，在 Observable 運作過程中，不論是 `next()`、`error()`或`complete()`，只要有 side effect 邏輯都建議放到 `tap` 內處理。
- `toArray`：將來源 Observable 資料彙整成一個陣列。`toArray` 可以應用來處理陣列資料。
- `delay`：延遲一段時間後，才開始運行來源 Observable。
- `delayWhen`：可自行設計 Observable，來決定來源 Observable 每個事件的延遲邏輯。

# 相關資源

- [Operator - tap](https://rxjs-dev.firebaseapp.com/api/operators/tap)
- [Operator - toArray](https://rxjs-dev.firebaseapp.com/api/operators/toArray)
- [Operator - delay](https://rxjs-dev.firebaseapp.com/api/operators/delay)
- [Operator - delayWhen](https://rxjs-dev.firebaseapp.com/api/operators/delayWhen)
