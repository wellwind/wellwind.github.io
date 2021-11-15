---
title: "[RxJS] 組合類型 Operators (1) - switchAll / concatAll / mergeAll / combineAll / startWith"
date: 2020-10-05 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - switchAll
  - concatAll
  - mergeAll
  - combineAll
  - startWith
---

今天要介紹的是「組合類型」的 operators，這類型的 operators 會根據指定的條件將來源 Observable 的資料進行「組合」，變成一條新的 Observable 資料流。

<!-- more -->

# switchAll

還記得昨天文章提到的 `switchMap` 嗎？`switchMap` 可以將來源 Observable 事件的「資料」轉換成 Observable，`switchAll` 則非常相似，是將來源事件的「Observable」轉換成另一個 Observble。

乍聽之下感覺有點饒舌，直接來看一下程式碼：

```typescript
const generateStream = round =>
  timer(0, 1000).pipe(
    map(data => `資料流 ${round}: ${data + 1}`),
    take(3)
  );
  
const source$ = new Subject();

const stream$ = source$.pipe(map(round => generateStream(round)));

stream$.pipe(switchAll())
  .subscribe(result => console.log(result));

// 第一次事件
source$.next(1);

// 第二次事件
setTimeout(() => {
  source$.next(2);
}, 4000);

// 第三次事件
setTimeout(() => {
  source$.next(3);
}, 5000);

// 資料流 1: 1
// 資料流 1: 2
// 資料流 1: 3 (資料流 1 結束)
// 資料流 2: 1 (第二次事件開始，產生資料流 2)
// 資料流 3: 1 (資料流 2 未結束，第三次事件就開始了，產生資料流 3)
// 資料流 3: 2
// 資料流 3: 3
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-switchall

上面的程式中，我們建立一個 `source$` 的 Subject 以便我們在想要的時間控制事件發生，而 `stream$` 則是將每次 `source$` 的事件轉換成另外一個 Observable 物件，由於是使用 `map` 因此只是單純得到一個 Observable 物件而已，不會做任何的訂閱。

之後我們再將這條「將資料轉換成 Observable 物件」的 Observable 透過 `switchAll` 串在一起，`switchAll` 會建立一條資料流，當每次收到一個 Observable 時，`switchAll` 就會幫我們訂閱這個 Observable，當這個 Observable 有新事件時，就讓事件發生在 `switchAll` 自行建立的資料流上；而訂閱的 Observable 還沒結束同時卻收到下一個要訂閱的 Observable 時，就會將上一個 Observable 退訂閱。

{% note info %}

這種 Observable 的事件值也是 Observable 的情境，稱為 Observable of Observable。

{% endnote %}

彈珠圖：

{% asset_img 01-switch-all.jpg %}

`switchAll` 和 `switchMap` 的差別在於：

`switchMap` 會將 callback function 呼叫回傳的 Observable 進行訂閱，因此 Observable 的來源是從 callback function 轉換過來的：

```typescript
source$.pipe(switchMap(data => of(data));
                    // ^ 這個 callback function 是 swtichMap 訂閱的資料來源
```

而 `switchAll` 沒有這個 callback function，它的來源是從前一個資料流過來的，因此前一個資料流的「資料」必須是個 Observable：

```typescript
source$.pipe(
  map(data => of(data)), // 這裡將資料轉換成 Observable
  switchAll() // 訂閱上一個 operator 傳給我的 Observable
);
```

因此 `switchMap` 適合用在明確知道下一步要使用哪個 Observable 的情境，由我們自行撰寫程式決定要轉換成什麼 Observable；而 `switchAll` 則適用在來源 Observable 不明確的情境，以上面的例子來說，`stream$` 可能是別人寫好的程式碼，我們只需要知道它的「事件值是一個 Observable」(也就是 Observable of Observable) 需要訂閱，不需要知道背後的實作細節。

而 `switchAll` 和 `switchMap` 相同的地方在於，當收到新的 Observable 要訂閱時，都會退訂上一個 Observable，因此可以確保永遠都只有最後一個 Observable 正在執行！

# concatAll

如同 `switchMap` 和 `switchAll` 的差別一樣，`concatMap` 和 `concatAll` 都會等待前一個 Observable 完成，在開始繼續新的 Observable 資料流訂閱，因此可以確保每個資料流都執行至完成：

```typescript
const generateStream = round =>
  timer(0, 1000).pipe(
    map(data => `資料流 ${round}: ${data + 1}`),
    take(3)
  );
  
const source$ = new Subject();

const stream$ = source$.pipe(map(round => generateStream(round)));

stream$.pipe(concatAll())
  .subscribe(result => console.log(result));

source$.next(1);

setTimeout(() => {
  source$.next(2);
}, 4000);

setTimeout(() => {
  source$.next(3);
}, 5000);

// 資料流 1: 1
// 資料流 1: 2
// 資料流 1: 3
// 資料流 2: 1
// 資料流 2: 2 (此時第三次事件已經發生了，但資料流 2 還沒結束，等待中)
// 資料流 2: 3
// 資料流 3: 1 (資料流 2 結束後，才讓資料流 3 開始)
// 資料流 3: 2
// 資料流 3: 3
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-concatall

彈珠圖：

{% asset_img 02-concat-all.jpg %}

# mergeAll

如同 `switchMap` 和 `switchAll` 的差別一樣，`mergeMap` 和 `mergeAll` 在得到新的資料流後會直接訂閱，且不退訂之前的資料流，因此所有資料流會依照各自發生的時間直接的發生在 `mergeAll` 建立的資料流上：

```typescript
const generateStream = round =>
  timer(0, 1000).pipe(
    map(data => `資料流 ${round}: ${data + 1}`),
    take(3)
  );
  
const source$ = new Subject();

const stream$ = source$.pipe(map(round => generateStream(round)));

stream$.pipe(mergeAll())
  .subscribe(result => console.log(result));

source$.next(1);

setTimeout(() => {
  source$.next(2);
}, 2000);

setTimeout(() => {
  source$.next(3);
}, 3000);

// 資料流 1: 1
// 資料流 1: 2 
// 資料流 2: 1 (第二次事件發生，產生資料流 2，原來資料流不退訂)
// 資料流 1: 3 (原來的資料流 1 在此結束)
// 資料流 3: 1 (第三次事件發生，產生資料流 3，原來的資料流不退訂)
// 資料流 2: 2
// 資料流 3: 2
// 資料流 2: 3
// 資料流 3: 3
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-mergeall

彈珠圖：

{% asset_img 03-merge-all.jpg %}

由於 `mergeAll` 會同時訂閱多個 Observable，當要訂閱的 Observable 數量龐大時容易產生效能的問題，因此 `mergeAll` 還可以帶入一個 `concurrent` 參數，代表同時最多可以訂閱幾個 Observable，預設值為正無限大。

```typescript
source$.pipe(mergeAll(5));
// 對於傳入的 Observable，最多只會訂閱 5 個，其餘的依然必須排隊等待
source$.pipe(mergeAll(1));
// 效果等同於使用 concatAll()
```

# combineAll

`combineAll` 和 `combineLatest` 非常類似，都是把資料流的資料組合在一起，規則是每當有資料流發生新事件值時，將這個事件值和其他資料流最後一次的事件值組合起來。

`combineLatest` 需要明確指定要組合哪些 Observable，而 `combineAll` 則適用在來源不明確的 Observable of Observable 的情境；另外因為來源並不明確，因此必須等到整個 Observable 結束，明確知道所有要組合的 Observable 後，才會進行相關動作。

```typescript
const generateStream = round =>
  timer(0, 1000).pipe(
    map(data => `資料流 ${round}: ${data + 1}`),
    take(3)
  );
  
const source$ = new Subject();

const stream$ = source$.pipe(map(round => generateStream(round)));

stream$.pipe(combineAll())
  .subscribe(result => console.log(result));

source$.next(1);

setTimeout(() => {
  source$.next(2);
  // 結束資料流，不然 combineAll 會持續等待到結束
  source$.complete();
}, 3000);

// (等候 3 秒，到 source$ 結束)
// ["資料流 1: 1", "資料流 2: 1"]
// ["資料流 1: 2", "資料流 2: 1"]
// ["資料流 1: 2", "資料流 2: 2"]
// ["資料流 1: 3", "資料流 2: 2"]
// ["資料流 1: 3", "資料流 2: 3"]
```

彈珠圖：

{% asset_img 04-combine-all.jpg %}

# startWith

`startWith` 會在一個 Observable 內加上一個起始值，也就是訂閱產生時會立刻最先收到的一個值，例如在前兩天練習 `pairwise` 時，會因為第一個事件值沒有「上一個事件值」被忽略，因此改用 `scan` 來解決，但也可以使用 `startWith`，會更加簡單：

```typescript
interval(1000).pipe(
  take(6),
  map(data => data + 1),
  startWith(0), // 給予初始事件值
  pairwise() // 再搭配 pairwise 時，就能讓原始 Observable 的第一個事件有搭配資料可用
).subscribe(result => {
  console.log(result);
});
// [0, 1]
// [1, 2]
// [2, 3]
// [3, 4]
// [4, 5]
// [5, 6]
```

彈珠圖：

```
---1---2---3---4---5---6|
startWith(0)
0--1---2---3---4---5---6|
```

有些時候在訂閱 Observable 時需要立刻有一個預設值來處理時，`startWith` 就是很好用的 operator 囉！

# 本日小節

- `xxxAll` 系列和 `xxxMap` 系列處理「上一個」資料流的方式一樣，差別在於 `xxxAll` 是使用別人傳給我們的 Observable of Observable，而 `xxxMap` 必須自行撰寫轉換成 Observable 的規則 。
- `cominbeAll` 和 `combineLatest` 行為也非常類似，`combineAll` 的資料來源是 Observable of Observable，而 `combineLatest` 則必須明確指定要組合哪寫 Observables。
- `startWith` 適合用在一些希望訂閱 Observable 時就能夠有第一筆預設值的情境。

# 相關資源

- [Operators - switchAll](https://rxjs-dev.firebaseapp.com/api/operators/switchAll)
- [Operators - concatAll](https://rxjs-dev.firebaseapp.com/api/operators/concatAll)
- [Operators - mergeAll](https://rxjs-dev.firebaseapp.com/api/operators/mergeAll)
- [Operators - combineAll](https://rxjs-dev.firebaseapp.com/api/operators/combineAll)
- [Operators - startWith](https://rxjs-dev.firebaseapp.com/api/operators/startWith)
