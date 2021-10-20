---
title: "[RxJS] 過濾類型 Operators (4) - distinct / distinctUntilChanged / distinctUntilKeyChanged"
date: 2020-10-09 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - distinct
  - distinctKey
  - distinctUntilChanged
  - distinctUntilKeyChanged
---

今天來分享過濾類型的 operators - `distinct` 系列，這系列的 operators 都是用來避免「重複的事件資料」發生，但各有不同的用處，讓我們繼續看下去吧！

<!-- more -->

# distinct

`distinct` 會將 Observable 內重複的值過濾掉，基本用法很簡單：

```typescript
from([1, 2, 3, 3, 2, 1, 4, 5])
  .pipe(distinct())
  .subscribe(data => {
    console.log(`distinct 示範 (1): ${data}`);
  });
// distinct 示範 (1): 1
// distinct 示範 (1): 2
// distinct 示範 (1): 3
// distinct 示範 (1): 4
// distinct 示範 (1): 5
```

從結果可以看到，重複的事件值是不會再次發生的，例如 `1`、`2`、`3` 事件發生後，接著發生的 `3`、`2` 和 `1` 的事件值因為前面發生過了一樣的值了，因此被過濾掉不發生！

彈珠圖：

```
(1   2   3   3   2   1   4   5)
distinct()
(1   2   3               4   5)
             ^ 因為資料重複，不發生事件
```

如果今天是傳入的是物件呢？我們都知道兩個物件直接用 `==` 比較是不會相同的，例如以下程式碼會印出 `false`：

```typescript
const a = { id:1, score: 100 };
const b = { id:1, score: 100 };
console.log(a === b);
// false
```

也因此當使用 `distinct` operator 時，若傳入的都是物件，判斷上會有問題，這時候可以在 `distinct` 內加入一個 `keySellector` 的 callback function，callback function 會傳入每次事件的資料，並需要回傳比較用的任意值 `key`； `distinct` 會透過這個 callback function 的回傳值來決定是否重複：

```typescript
const students = [
  { id: 1, score: 70 },
  { id: 2, score: 80 },
  { id: 3, score: 90 },
  { id: 1, score: 100 },
  { id: 2, score: 100 }
];
from(students)
  .pipe(distinct(student => student.id))
  .subscribe(student => {
    console.log(`distinct 示範 (2): ${student.id} - ${student.score}`);
  });
// distinct 示範 (2): 1 - 70
// distinct 示範 (2): 2 - 80
// distinct 示範 (2): 3 - 90
```

上面程式碼中，我們在 `distinct` 內加入一個 function，並回傳每個物件的 `id` 屬性，將這個屬性值作為資料是否重複的判斷，因此第四次事件的 `id` 在之前事件有發生過了，所以不會發生此事件。

`distinct` 內部會記錄所有發生過的事件值，我們也可以透過再多傳入一個 Observable 的方式(參數名稱為 `flushes`)來幫助我們判斷何時要清空紀錄事件值的內容，每當這個 Observable 有新事件發生時，就會清空來源 Observable 內用來記錄資料重複的物件：

```typescript
const source$ = new Subject<{id: number, score: number}>();
const sourceFlushes$ = new Subject();
source$
  .pipe(distinct(student => student.id, sourceFlushes$))
  .subscribe(student => {
    console.log(`distinct 示範 (3): ${student.id} - ${student.score}`);
  });

setTimeout(() => source$.next({ id: 1, score: 70 }), 1000);
setTimeout(() => source$.next({ id: 2, score: 80 }), 2000);
setTimeout(() => source$.next({ id: 3, score: 90 }), 3000);
setTimeout(() => source$.next({ id: 1, score: 100 }), 4000);
// 在這裡清掉 Observable distinct 內記錄資料重複的物件
setTimeout(() => sourceFlush$.next(), 4500);
setTimeout(() => source$.next({ id: 2, score: 100 }), 5000);
// distinct 示範 (3): 1 - 70
// distinct 示範 (3): 2 - 80
// distinct 示範 (3): 3 - 90
// (第四秒發生 {id: 1, score: 100}，因為重複，所以事件不發生)
// (清空紀錄資料重複物件)
// distinct 示範 (3): 2 - 100 (id: 2 有發生過，但紀錄已被清空，因此事件會發生)
```

彈珠圖：

```
source$:   ---1---2---3---1---2--...
flushes$:  -----------------x----...

source$.pipe(distinct(data => data), flushes$);
           ---1---2---3-------2--...
                            ^ 從這裡清空紀錄，重新判斷 distinct
```

透過 `distinct`，我們可以就可以確保收到的事件資料不會重複囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-distinct

# distinctUntilChanged

`distinctUntilChanged` 會過濾掉重複的事件值，直到事件資料變更為止。

也就是說，只要目前事件資料值跟上一次事件資料值一樣，這次就事件就不會發生，若目前事件資料值跟上一次事件資料值不同時，這次事件就會發生；直接來看看程式碼：

```typescript
from([1, 1, 2, 3, 3, 1]).pipe(
  distinctUntilChanged()
).subscribe(data => {
  console.log(`distinctUntilChanged 示範 (1): ${data}`)
});
// distinctUntilChanged 示範 (1): 1
// distinctUntilChanged 示範 (1): 2
// distinctUntilChanged 示範 (1): 3
// distinctUntilChanged 示範 (1): 1
```

第二次事件，和前一次事件一樣資料都是 `1`，因此該次事件不發生；第三次事件和第二次事件不同，因此第三次事件會發生。

彈珠圖：

```
(1   1    2    3    3    1)
distinctUntilChanged()
(1        2    3         1)
    ^ 事件值跟上次一樣，不顯示
          ^ 事件值跟上次不一樣，顯示
```

如果傳入的是物件，該怎麼比較呢？`distinctUntilChanged` 內可以傳入一個 `compare` callback function，這個 function 會傳入「目前」和「上次」的事件值，讓我們可以比較判斷是否有被變更。

```typescript
const students = [
  { id: 1, score: 70 },
  { id: 1, score: 80 },
  { id: 2, score: 90 },
  { id: 3, score: 100 }
];
from(students).pipe(
  distinctUntilChanged((studentA, studentB) => studentA.id === studentB.id)
)
.subscribe(student => {
  console.log(`distinctUntilChanged 示範 (2): ${student.id} - ${student.score}`);
});
// distinctUntilChanged 示範 (2): 1 - 70
// distinctUntilChanged 示範 (2): 2 - 90
// distinctUntilChanged 示範 (2): 3 - 100
```

除此之外，`distinctUntilChanged` 還有第二個參數是 `keySelector` function，這個 function 跟 `distinct` 的 `keySelector` 參數一樣，是用來決定傳入的物件比較是否重複用的 key：

```typescript
from(students).pipe(
  distinctUntilChanged(
    // compare function
    (idA, idB) => idA === idB,
    // keySelector function
    student => student.id
  )
)
.subscribe(student => {
  console.log(`distinctUntilChanged 示範 (3): ${student.id} - ${student.score}`);
});
// distinctUntilChanged 示範 (3): 1 - 70
// distinctUntilChanged 示範 (3): 2 - 90
// distinctUntilChanged 示範 (3): 3 - 100
```

執行結果會完全一樣，但好處是我們把「決定比較的 key」和「實際比較邏輯」拆成兩個 function 了，整體閱讀上會更加容易。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-distinctuntilchanged

# distinctUntilKeyChanged

`distinctUntilKeyChanged` 跟 `distinctUntilChanged` 基本上非常相似，但特別適合用在物件的某一個屬性就是比較用的關鍵值 (key) 的狀況，以前面 `distinctUntilChanged` 的例子來說，我們需要傳入比較的邏輯 (compare function)，和決定物件 key 的邏輯 (keySelector function)，但實際上就是比較 `id` 一個屬性的情況，我們就可以用 `distinctUntilKeyChanged` 來簡化寫法。

`distinctUntilKeyChanged` 的第一個參數就是事件物件的關鍵 key 值，`distinctUntilKeyChanged` 就會幫我們用物件的內名稱與 key 值相同的屬性，來決定資料是否重複發生。

```typescript
const students = [
  { id: 1, score: 70 },
  { id: 1, score: 80 },
  { id: 2, score: 90 },
  { id: 3, score: 100 }
];
from(students).pipe(
  distinctUntilKeyChanged('id')
)
.subscribe(student => {
  console.log(`distinctUntilKeyChanged 示範 (1): ${student.id} - ${student.score}`);
});
// distinctUntilKeyChanged 示範 (1): 1 - 70
// distinctUntilKeyChanged 示範 (1): 2 - 90
// distinctUntilKeyChanged 示範 (1): 3 - 100
```

寫起來就簡單多啦！

除此之外，`distinctUntilKeyChanged` 還可以在再傳入一個 `compare` function，來決定資料是否重複：

```typescript
from(students).pipe(
  distinctUntilKeyChanged(
    'id',
    (idA, idB) => idA === idB
  )
)
.subscribe(student => {
  console.log(`distinctUntilKeyChanged 示範 (2): ${student.id} - ${student.score}`);
});
// distinctUntilKeyChanged 示範 (2): 1 - 70
// distinctUntilKeyChanged 示範 (2): 2 - 90
// distinctUntilKeyChanged 示範 (2): 3 - 100
```

當有需要自行決定忽略事件值的邏輯時，`compare` function 就非常好用囉！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-distinctuntilkeychanged

# 本日小結

- `distinct`：用來過濾「重複」的事件值發生，`distinct` 會把出現過的事件值記錄下來，當事件資料曾經出現過，就不讓事件發生，我們也可以自己決定何時要把這個紀錄清除。
- `distinctUntilChanged`：如果事件資料「持續重複」就會被過濾掉，直到這次事件資料與上次事件資料不同時，才允許事件發生。
- `distinctUntilKeyChanged`：與 `distinctUntilChanged` 邏輯一樣，但提供了比較簡單的方式，讓我們處理事件物件的某個屬性就是 key 值的情境。

# 相關資源

- [Operators - distinct](https://rxjs-dev.firebaseapp.com/api/operators/distinct)
- [Operators - distinctUntilChanged](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged)
- [Operators - distinctUntilKeyChanged](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilKeyChanged)
