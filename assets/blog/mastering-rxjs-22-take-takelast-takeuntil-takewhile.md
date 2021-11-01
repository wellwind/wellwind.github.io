---
title: "[RxJS] 過濾類型 Operators (2) - take / takeLast / takeUntil / takeWhile"
date: 2020-10-07 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - take
  - takeLast
  - takeUntil
  - takeWhile
---

今天來介紹 `take` 系列的各種過濾類型 operators。

<!-- more -->

# take

`take` 代表要從來源 Observable 中觸發 N 次事件的值；當訂閱開始後，如果發生過的事件數量已經達到我們設定的數量後，就會結束；在前面我們也稍微介紹過，並不困難：

```typescript
timer(0, 1000).pipe(
  take(6)
).subscribe({
  next: data => console.log(`take 示範: ${data}`),
  complete: () => console.log(`take 結束`),
});
// take 示範: 0
// take 示範: 1
// take 示範: 2
// take 示範: 3
// take 示範: 4
// take 示範: 5
// take 結束
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---...
take(6)
0---1---2---3---4---(5|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-take

# takeLast

`take` 是從事件開始時抓取前面 N 次的事件值，而  `takeLast` 則是從抓取 Observable 最後 N 次的事件值，因次 `takeLast` 會等到 Observable 結束後，才會得到最後幾次事件的資料。

```typescript
range(1, 5).pipe(
  takeLast(3)
).subscribe(
  data => console.log(`takeLast 示範: ${data}`)
);
// takeLast 示範: 3
// takeLast 示範: 4
// takeLast 示範: 5
```

彈珠圖：

```
(12345)
takeLast(3)
  (345)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-takelast

# takeUntil

`takeUntil` 會持續觸發來源 Observable 的事件值，直到 (until) 指定的另外一個 Observable 發生新事件時，才會結束，算是蠻常用的一個 operator。

```typescript
const click$ = fromEvent(document.querySelector('#btnStop'), 'click'); 
const source$ = interval(1000).pipe(map(data => data + 1))

source$.pipe(
  takeUntil(click$)
).subscribe({
  next: data => console.log(`takeUntil 示範: ${data}`),
  complete: () => console.log('takeUntil 結束')
});
// takeUntil 示範: 1
// takeUntil 示範: 2
// takeUntil 示範: 3
// takeUntil 示範: 4
// takeUntil 示範: 5
// (click$ 發出新事件)
// takeUntil 結束
```

彈珠圖：

```
          ---1---2---3---4---5---6-...
takeUntil(---------------------c---...)
          ---1---2---3---4---5-|
```

可以看到訂閱後在 `click$` 事件發生前，會持續觸發 `source$` 的事件，直到 `click$` 發生事件，就結束整個 Observable。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-takeuntil

# takeWhile

`takeWhile` 內需要傳入一個 callback function，這個 callback function 決定 `takeWhile` 發生事件的時機，只要事件值持續符合 callback function 內的條件，就會持續產生事件，直到不符合條件後結束。

```typescript
const source$ = interval(1000).pipe(map(data => data + 1))

source$.pipe(
  takeWhile(data => data < 5)
).subscribe({
  next: data => console.log(`takeWhile 示範 (1): ${data}`),
  complete: () => console.log('takeWhile 結束 (1)')
});

// takeWhile 示範 (1): 1
// takeWhile 示範 (1): 2
// takeWhile 示範 (1): 3
// takeWhile 示範 (1): 4
// takeWhile 結束 (1)
```

彈珠圖：

```
---1---2---3---4---5---6---7....
takeWhile(data => data < 5)
---1---2---3---4---|
                   ^ 不符合條件了，結束
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-takewhile

`takeWhile` 的 callback 可以傳入事件值 (value) 及索引值 (index)；除了 callback function 之外，還有一個 `inclusive` 參數，代表是否要包含判斷不符合條件的那個值，預設為 `false`，當設為 `true` 時，發生結束條件的那次事件值也會被包含在要發生的事件內。

```typescript
source$.pipe(
  takeWhile(data => data < 5, true)
).subscribe({
  next: data => console.log(`takeWhile 示範 (2): ${data}`),
  complete: () => console.log('takeWhile 結束 (2)')
});

// takeWhile 示範 (2): 1
// takeWhile 示範 (2): 2
// takeWhile 示範 (2): 3
// takeWhile 示範 (2): 4
// takeWhile 示範 (2): 5
// takeWhile 結束 (2)
```



# 本日小節

`take` 系列的 operators 都是決定來源 Observable 的事件可以發生多少次的方法，但各有不同使用情境：

- `take`：代表要讓前 N 次事件可以發生，符合數量後結束目前的 Observable。
- `takeLast`：代表要讓後 N 次事件可以發生，因此需要來源 Observable 結束。
- `takeUntil`：會持續讓來源 Observable 事件發生，直到指定的另一個 Observable 發生新事件了，結束目前的 Observable。
- `takeWhile`：可以判斷資料是否符合條件，只要資料符合條件，事件就會持續發生，當資料不符合條件，目前的 Observable 就會結束。

`take` 本身是「拿資料」的意思，明天會介紹另外一組剛好相反，有著「忽略資料」意思的 `skip` 系列 operators。

# 相關資源

- [Operator - take](https://rxjs-dev.firebaseapp.com/api/operators/take)
- [Operator - takeLast](https://rxjs-dev.firebaseapp.com/api/operators/takeLast)
- [Operator - takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil)
- [Operator - takeWhile](https://rxjs-dev.firebaseapp.com/api/operators/takeWhile)
