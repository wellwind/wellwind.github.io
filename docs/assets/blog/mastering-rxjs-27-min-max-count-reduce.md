---
title: "[RxJS] 數學/聚合類型 Operators (1) - min / max / count / reduce"
date: 2020-10-12 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - min
  - max
  - count
  - reduce
---

今天要介紹「數學/聚合類型」的 operators，這些 operators 會把來源 Observable 當作一個單純的資料列，取得一些基本的資訊，也可以自訂如何判斷資訊；這些 operators 都非常直覺好懂，就讓我們輕鬆來學習吧！

<!-- more -->

# min

`min` 會判斷來源 Observable 資料的最小值，在來源 Observable 結束後，將最小值事件資料發生在新的 Observable 上。

```typescript
of(5, 1, 9, 8)
  .pipe(min())
  .subscribe(data => {
    console.log(`min 示範 (1): ${data}`);
  });
// min 示範 (1): 1
```

彈珠圖：

```
(   5   1   9   8|)
max()
(               1|)
```

`min` 內也可以傳入 `comparer` callback function，會傳入 `x` 和 `y` 代表兩個來源 Observable 的事件資料， `min` 會透過 `comparer` function 的回傳值判斷兩組資料的大小，這個 callback function 需要回傳一個數值，大於 0 代表 `x` 大於 `y`，小於 0 代表 `x` 小於 `y`，等於 0 代表 `x` 和 `y` 相同。

```typescript
of(
  { name: 'Student A', score: 80 },
  { name: 'Student B', score: 90 },
  { name: 'Student C', score: 60 },
  { name: 'Student D', score: 70 },
).pipe(
  min((studentA, studentB) => studentA.score - studentB.score)
).subscribe(student => {
  console.log(`min 示範 (2): ${student.name} - ${student.score}`);
});
// min 示範 (2): Student C - 60
```

透過 `comparer` function，就不用擔心傳入資料為物件時無法比較囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-min

# max

`max` 剛好跟 `min` 相反，`max` 會判斷來源 Observable 資料的最大值，在來源 Observable 結束後，將最大值事件資料發生在新的 Observable 上。

```typescript
of(5, 1, 9, 8)
  .pipe(max())
  .subscribe(data => {
    console.log(`max 示範 (1): ${data}`);
  });
// max 示範 (1): 9
```

彈珠圖：

```
(   5   1   9   8|)
max()
(               9|)
```

一樣的 `max` 也可以傳入 `comparer` callback function 來自定判斷資料大小比較條件：

```typescript
of(
  { name: 'Student A', score: 80 },
  { name: 'Student B', score: 90 },
  { name: 'Student C', score: 60 },
  { name: 'Student D', score: 70 },
).pipe(
  max((studentA, studentB) => studentA.score - studentB.score)
).subscribe(student => {
  console.log(`max 示範 (2): ${student.name} - ${student.score}`);
});
// max 示範 (2): Student B - 90
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-max

# count

`count` 可以用來計算來源 Observable 發生過多少次事件：

```typescript
of(5, 1, 9, 8)
  .pipe(count())
  .subscribe(data => {
    console.log(`count 示範 (1): ${data}`);
  });
// count 示範 (1): 4
```

上述程式碼 `of(5, 1, 9, 8)` 總共會發生 4 次事件，因此在來源 Observable 結束時，新的 Observable 會得到資料 `4` 的事件值。

彈珠圖：

```
(   5   1   9   8|)
count()
(               4|)
                ^ 來源 Observable 發生過 4 次事件
```

`count` 可以傳入 `predicate` callback function，來判斷事件資料是否符合固定條件，當來源 Observable 結束時，新的 Observable 會發生的事件值為「所有符合指定條件事件」的總數：

```typescript
of(5, 1, 9, 8)
  .pipe(count(data => data > 5))
  .subscribe(data => {
    console.log(`count 示範 (2): ${data}`);
  });
// count 示範 (2): 2
```

彈珠圖：

```
(   5   1   9   8|)
count(data => data > 5)
(               2|)
                ^ 來源 Observable 符合條件的事件發生過 2 次
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-count

# reduce

`reduce` 用來運算來源 Observable 彙總後的結果，與之前介紹過的 `scan` 非常像，差別在於 `scan` 在來源 Observable 發生事件後都會進行運算並同時在新的 Observable 上發生，而 `reduce` 在來源 Observable 發生事件後，只會進行運算，但不會在新的 Observable 上發生事件，直到來源 Observable 結束時，才在新的 Observable 上發生運算後的結果作為事件。

回顧一下 `scan`：

```typescript
const donateAmount = [100, 500, 300, 250];

const accumDonate$ = of(...donateAmount).pipe(
  scan(
    (acc, value) => acc + value, // 累加函數
    0 // 初始值
  )
);

accumDonate$.subscribe(amount => {
  console.log(`目前 donate 金額累計：${amount}`)
});
// 目前 donate 金額累計：100
// 目前 donate 金額累計：600
// 目前 donate 金額累計：900
// 目前 donate 金額累計：1150
```

彈珠圖：

```
(100      500      300      250|)
scan((acc, value) => acc + value, 0)
(100      600      900     1150|)
```

同樣的程式碼，我們直接把 `scan` 換成 `reduce`：

```typescript
const donateAmount = [100, 500, 300, 250];

const accumDonate$ = of(...donateAmount).pipe(
  reduce(
    (acc, value) => acc + value, // 累加函數
    0 // 初始值
  )
);

accumDonate$.subscribe(amount => {
  console.log(`目前 donate 金額累計：${amount}`)
});
// 目前 donate 金額累計：1150
```

彈珠圖：

```
(100      500      300      250|)
reduce((acc, value) => acc + value, 0)
(                          1150|)
```

是不是一下就看出差異啦！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-reduce

# 本日小結

- `min`：找出來源 Observable 事件的最小值。
- `max`：找出來源 Observable 事件的最大值。
- `count`：找出來源 Observable 事件總數。
- `reduce`：依照指定運算邏輯，找出來源 Observable 事件彙總的結果。

# 相關資源

- [Operator - min](https://rxjs-dev.firebaseapp.com/api/operators/min)
- [Operator - max](https://rxjs-dev.firebaseapp.com/api/operators/max)
- [Operator - count](https://rxjs-dev.firebaseapp.com/api/operators/count)
- [Operator - reduce](https://rxjs-dev.firebaseapp.com/api/operators/reduce)
