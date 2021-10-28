---
title: "[RxJS] 過濾類型 Operators (1) - filter / first / last / single"
date: 2020-10-06 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - filter
  - first
  - last
  - single
---

今天開始我們來介紹「過濾類型」的 operators，「過濾類型」的 operators 主要功能是讓 Observable 資料流內的事件在符合特定條件時才發生；這類型的 operators 數量不少，也都很實用，且多半也不太困難，值得多花點時間學習。

<!-- more -->

# filter

`filter` 是最常用的「過濾類型」的 operator，用法也非常簡單，跟陣列的 `filter` 是一樣的，傳入一個 callback function，在裡面寫入指定的條件，每當來源資料流事件的資料符合 callback function 內的條件時，才會發生！直接看範例程式：

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  filter(data => data > 3)
)
.subscribe(data => {
  console.log(`filter 範例 (1): ${data}`);
});
// filter 範例 (1): 4
// filter 範例 (1): 5
// filter 範例 (1): 6
// filter 範例 (1): 7
// filter 範例 (1): 8
// filter 範例 (1): 9
```

很容易看得出來我們的 `filter` 條件是事件資料需要大於 3，因此只會印出資料大於 3 的內容。

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
filter(data => data > 3)
----------------4---5---6---7---8---9|
```

`filter` 的 callback function 參數除了事件值以外，還有這個事件是第幾次發生的 (index)：

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  filter((data, index) => data > 3 && index % 2 === 0)
)
.subscribe(data => {
  console.log(`filter 範例 (2): ${data}`);
});
// filter 範例 (2): 4
// filter 範例 (2): 6
// filter 範例 (2): 8
```

應該不難理解，直接上彈珠圖

```
0---1---2---3---4---5---6---7---8---9|
filter((data, index) => data > 3 && index % 2 === 0)
----------------4-------6-------8----|
                ^ 從這裡開始符合 data > 3 的條件
                ^ 之後顯示 index 為偶數的事件資料
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-filter

# first

`first` 顧名思義，就是取得第一筆資料，因此當 Observable 訂閱後，資料流的第一次事件發生時，會得到這個事件資料，然後結束。

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  first()
)
.subscribe(data => {
  console.log(`filter 範例 (1): ${data}`);
});
// filter 範例 (1): 0
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
first()
0|
```

除此之外，`first` 內也可以傳入一個 callback function，一樣是設定過濾條件，參數跟 `filter` 一樣，當有這個條件時，就會變成判斷「第一次符合條件」的事件資料值：

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  first(data => data > 3)
)
.subscribe(data => {
  console.log(`first 範例 (2): ${data}`);
});
// first 範例 (2): 4
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
first(data => data > 3)
----------------4|
```

https://stackblitz.com/edit/mastering-rxjs-operator-first

# last

`last` 跟 `first` 相反，`last` 是取整個來源資料流「最後一次發生的事件」，因此原來的資料流一定要有「結束」(complete) 發生：

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  last()
)
.subscribe(data => {
  console.log(`last 範例 (1): ${data}`);
});
// last 範例 (1): 9
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
last()
------------------------------------9|
```

一樣的，也可以傳入一個 callback function，來找出「符合條件的最後一次事件」值，不過要記得，會等到 Observable 資料流結束才會發生：

```typescript
const source$ = timer(0, 1000).pipe(take(10));

source$.pipe(
  last(data => data < 3)
)
.subscribe(data => {
  console.log(`last 範例 (2): ${data}`);
});
// last 範例 (2): 2
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
last(data => data < 3)
------------------------------------2|
        ^ 符合條件的最後一次事件值
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-last

# single

`single` 比較特殊，它可以幫助我們「限制」整個資料流只會有一次事件發生，當發生第二次事件時，就會發生錯誤：

```typescript
timer(0, 1000).pipe(
  take(10),
  single()
)
.subscribe({
  next: data => {
    console.log(`single 範例 (1): ${data}`);
  },
  error: (err) => {
    console.log(`single 發生錯誤範例 (1): ${err}`)
  }
});
// single 發生錯誤範例 (1): Sequence contains more than one element
```

彈珠圖：

```
0---1---2---3---4---5---6---7---8---9|
single
----#
```

如果整個資料流只有一次事件發生，就不會發生錯誤：

```typescript
timer(3000, 1000).pipe(
  take(1),
  single()
)
.subscribe({
  next: data => {
    console.log(`single 範例 (2): ${data}`);
  },
  error: (err) => {
    console.log(`single 發生錯誤範例 (2): ${err}`)
  }
});
// single 範例 (2): 0
```

要確認是否只有一次事件，當然要等資料流結束才會確認是否會發生錯誤喔！

如果整個資料流沒有事件就結束呢？也算是不符合「發生一次事件」的條件，因此一樣會發生錯誤

```typescript
EMPTY.pipe(
  single()
)
.subscribe({
  next: data => {
    console.log(`single 範例 (3): ${data}`);
  },
  error: (err) => {
    console.log(`single 發生錯誤範例 (3): ${err}`)
  }
});
// single 發生錯誤範例 (3): EmptyError: no elements in sequence
```

`single` 也一樣可以傳入 callback function，此時條件會變成「在條件符合時，如果整個資料流只發生過一次事件，發生該事件的值，否則發生 undefined，然後結束」，直接看例子：

```typescript
timer(1000).pipe(
  take(5),
  single(data => data === 0)
).subscribe({
  next: data => {
    console.log(`single 範例 (4): ${data}`);
  },
  error: (err) => {
    console.log(`single 發生錯誤範例 (4): ${err}`)
  },
  complete: () => {
    console.log('single 範例結束 (4)');
  }
});
// single 範例 (4): 0
// single 範例結束 (4)
```

彈珠圖：

```
---0---1---2---3---4|
single(data => data === 0)
---0|
因為符合條件的事件 0 發生時，就只有發生過這一次事件
```

如果在符合條件前就發生超過兩次事件；或符合條件時已經是第二次事件，就會得到 `undefined`

```typescript
timer(1000).pipe(
  take(5),
  single(data => data === 1)
).subscribe({
  next: data => {
    console.log(`single 範例 (5): ${data}`);
  },
  error: (err) => {
    console.log(`single 發生錯誤範例 (5): ${err}`)
  },
  complete: () => {
    console.log('single 範例結束 (5)');
  }
});
// single 範例 (5): undefined
// single 範例結束 (5)
```

彈珠圖：

```
---0---1---2---3---4|
single(data => data === 1)
-------(undefined)|
符合條件時已經不是只發生一次事件的情境，得到 undefined
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-single

# 本日小結

- `filter`：用來依照指定的條件過濾事件值，只有符合條件的事件值會發生。
- `first`：只有第一個事件值會發生，若有指定條件會變成符合條件的第一個事件值會發生。
- `last`：只有最後一個事件值會發生，若有指定條件會變成符合條件的最後一個事件值會發生。
- `single`：可以用來確保整個 Observable 「只會發生一次事件」，沒有指定條件時，發生兩次以上事件會發生錯誤；有指定條件時，發生兩次以上事件會產生 `undefined` 事件值。

# 相關資源

- [Operators - filter](https://rxjs-dev.firebaseapp.com/api/operators/filter)
- [Operators - first](https://rxjs-dev.firebaseapp.com/api/operators/first)
- [Operators - last](https://rxjs-dev.firebaseapp.com/api/operators/last)
- [Operators - single](https://rxjs-dev.firebaseapp.com/api/operators/single)

