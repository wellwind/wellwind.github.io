---
title: "[RxJS] 過濾類型 Operators (3) - skip / skipLast / skipUntil / skipWhile"
date: 2020-10-08 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - skip
  - skipLast
  - skipUntil
  - skipWhile
---

昨天介紹的 `take` 系列是用來決定要「拿哪些資料」，今天來介紹 `skip` 系列，越來決定「忽略哪些資料」。

<!--more -->

# skip

`skip` 可以傳入一個數字，當訂閱開始時，會「忽略」前 N 個事件值，到第 N + 1 的事件值才會收到資料：

```typescript
interval(1000).pipe(
  skip(3)
).subscribe(data => {
  console.log(`skip 示範： ${data}`)
});

// (訂閱後的 0, 1, 2 會被忽略)
// skip 示範： 3
// skip 示範： 4
// skip 示範： 5
// ...
```

彈珠圖：

```
---0---1---2---3---4---5....
skip(3)
---------------3---4---5....
           ^ 忽略前三次事件值
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-oprator-skip

# skipLast

`skipLast` 會忽略整個 Observable 的**最後 N 次事件值**：

```typescript
range(5).pipe(
  skipLast(3)
).subscribe(
  data => console.log(`skipLast 示範 (1): ${data}`)
);

// skipLast 示範 (1): 0
// skipLast 示範 (1): 1
```

彈珠圖：

```
(01234)
skipLast(3)
   (01)
```

跟昨天提到的 `takeLast` 不同的地方是，`skipLast` 不用等到整個 Observable 結束才知道要怎麼開始抓資料的值，從 [skipLast 的實作](https://github.com/ReactiveX/rxjs/blob/6.x/src/internal/operators/skipLast.ts) 來看的話，會在前面 N 次事件發生時不做任何事情，當 N + 1 次事件發生時，才把資料流從頭開始依照每次新事件發生時把資料送出。

舉個例子來看：

```typescript
interval(1000).pipe(
  skipLast(3),
).subscribe(data => {
  console.log(`skipLast 示範 (2)： ${data}`)
});
// (前三次事件發生時不會有事件資料)
// skipLast 示範 (2)： 0 (第四次事件發生時，才印出第一次資料)
// skipLast 示範 (2)： 1
// skipLast 示範 (2)： 2
// skipLast 示範 (2)： 3
// ...
```

`interval(1000)` 是一個不會結束的資料流，而 `skipLast` 不會等資料流結束，就開始產生資料了，而且看起來持續有資料，換成從彈珠圖來看：

```
---0---1---2---3---4---5---...
skipLast(3)
---------------0---1---2---...
```

由於前面 N 次會等到 N + 1 次才發生，因此每次事件發生時，真正拿到的值會比實際上的值早 N 次，以上面例子來說，第四次事件發生時原本應該得到資料 `3`，但得到的其實卻是前三次的事件資料 `0`。

如果資料流結束了呢？從彈珠圖來看就會更明顯：

```
---0---1---2---3---4---5---6|
skipLast(3)
---------------0---1---2---3|
```

也就是轉換後的資料確實永遠拿不到整個資料流的最後 N 次事件資料啦！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-skiplast

# skipUntil

`skipUntil` 會持續忽略資料，直到指定的 Observable 發出新的事件時，才開始資料流：

```typescript
const click$ = fromEvent(document.querySelector('#btnStart'), 'click');
const source$ = interval(1000);

source$.pipe(
  skipUntil(click$)
).subscribe(data => console.log(`skipUntil 示範 (1): ${data}`));

// (按下按鈕後才開始顯示最新的事件資料)
// skipUntil 示範: 2
// skipUntil 示範: 3
// skipUntil 示範: 4
// ...
```

彈珠圖：

```
source$: ---0---1---2---3---4---5...
click$:  ---------c---....

source$.pipe(takeUntil(click$))
         -----------2---3---4---5...
                  ^ 開始顯示資料
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-skipuntil

# skipWhile

`skipWhile` 需要傳入一個 callback function，在這個 function 會決定忽略目前的事件資料的條件，只要符合這個條件，會持續忽略事件值，直到條件不符合為止：

```typescript
interval(1000).pipe(
  skipWhile(data => data < 2)
)
.subscribe(data => console.log(`skipWhile 示範: ${data}`));

// skipWhile 示範: 2
// skipWhile 示範: 3
// skipWhile 示範: 4
// skipWhile 示範: 5
// ...
```

彈珠圖：

```
---0---1---2---3---4---5....
skipWhile(data => data < 2)
-----------2---3---4---5
           ^ 不符合 data < 2 的條件
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operetor-skipwhile

# 本日小結

今天介紹的 operators 可以幫助依照不同情境忽略指定的來源 Observable 資料：

- `skip`：從訂閱開始後忽略指定數量的事件資料。
- `skipLast`：依照指定的數量，忽略整個 Observable 最後的事件數量。
- `skipUntil`：持續忽略目前 Observable 的事件資料，直到另一個 Observable 發生事件為止。
- `skipWhile`：持續忽略目前 Observable 的事件資料，直到事件資料值不符合指定條件為止。

# 相關資源

- [Operator - skip](https://rxjs-dev.firebaseapp.com/api/operators/skip)
- [Operator - skipLast](https://rxjs-dev.firebaseapp.com/api/operators/skipLast)
- [Operator - skipUntil](https://rxjs-dev.firebaseapp.com/api/operators/skipUntil)
- [Operator - skipWhile](https://rxjs-dev.firebaseapp.com/api/operators/skipWhile)
