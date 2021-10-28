---
title: "[RxJS] Multicast 類 Operator (1) - multicast / publish / refCount / share / shareReplay"
date: 2020-10-15 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - multicast
  - refCount
  - publish
  - share
  - shareReplay
---

還記得之前我們介紹過 Cold Observable v.s. Hot Observable 嗎？

Cold Observable 和觀察者 (Observer) 是一對一的關係，也就是每次產生訂閱時，都會是一個全新的資料流。而 Hot Observable 和觀察者則是一對多的關係，也就是每次產生訂閱時，都會使用「同一份資料流」，而今天要介紹的 operators 目的就是將 Cold Observable 轉成 Hot Observable，讓原來的資料流可以共用。

今天的觀念會比較複雜一點，打起精神繼續看下去吧！

<!-- more -->

# multicast

Cold Observable 每次訂閱只會對應一個觀察者，因此也可以說成將資料播放 (cast) 給唯一的觀察者，應此也稱為**單播 (unicast)**，而 `multicast` 就是來源 Observable 變成**多播 (multicast)** 的情況。

在 `multicast` 內必須指定一個產生 Hot Observable 的工廠方法，也就是建立 `Subject`、`BehaviorSubject` 等邏輯。

以下程式將一個單播的 Observable 轉換成一個多播的 Observable，並建立一個 `Subject` 作為多播的資料來源。

```typescript
const source$ = interval(1000).pipe(
  take(5),
  multicast(() => new Subject())
);
// srouce$ 變成一個 multicast 的 Observable
// 使用 Subject 作為多播的來源
```

當使用 `multicast` 時，新的 Observable 型別會是一個 [ConnectableObservable](https://rxjs-dev.firebaseapp.com/api/index/class/ConnectableObservable)，和一般的 Observable 的差別就在於 ConnectableObservable 是多播的，而且必須呼叫它的 `connect` 方法，才會開始進行多播的動作：

```typescript
source$.subscribe(data => {
  console.log(`multicast 示範 (1) 第一次訂閱: ${data}`);
});

setTimeout(() => {
  source$.subscribe(data => {
    console.log(`multicast 示範 (1) 第二次訂閱: ${data}`);
  });
}, 5000);

setTimeout(() => {
  // pipe 的回傳一律是 Observable 型別
  // 因此使用 TypeScript 轉型成 ConnectableObservable
  // 使用 JavaScript 則直接呼叫 connect() 就好
  (source$ as ConnectableObservable<any>).connect();
}, 3000);
// multicast 示範 (1) 第一次訂閱: 0
// multicast 示範 (1) 第一次訂閱: 1
// multicast 示範 (1) 第二次訂閱: 1
// multicast 示範 (1) 第一次訂閱: 2
// multicast 示範 (1) 第二次訂閱: 2
// multicast 示範 (1) 第一次訂閱: 3
// multicast 示範 (1) 第二次訂閱: 3
// multicast 示範 (1) 第一次訂閱: 4
// multicast 示範 (1) 第二次訂閱: 4
```

運作過程如下：

1. 第一次發生訂閱，但 `source$` 是 ConnectableObservable 且還沒呼叫 `connect()`，因此持續等待
2. 三秒後 `source$` 呼叫了 `connect()`，因此資料流開始
3. 第四秒發出 `source$` 的第一個事件值 `0`，第一次訂閱收到事件 `0`
4. 第五秒發出 `source$` 的第二個事件值 `1`，第一次訂閱收到事件 `1`；同時第二次訂閱發生，由於 `source$` 是多播的 Observable，因此第二次訂閱也收到事件 `1`。
5. 第六秒後，第一次訂閱和第二次訂閱都持續收到 `source$` 多播的事件值

彈珠圖：

```
--0--1--2--3--4--5--6...
take(5)
--0--1--2--3--4| -> 此時是 Cold Observable
source$ = multicast(() => new Subject())
--0--1--2--3--4| -> 此時是 Hot Observable

第一次訂閱：          ----------0--1--2--3--4|
                    ^ 第一次訂閱時間點
第二次訂閱：                       1--2--3--4|
                                 ^ 第二次訂閱時間點
source$.connect():          --0--1--2--3--4|
                            ^ connect 時間點
```

有興趣的話也可以把產生 Subject 的方法換成其他的如 `AsyncSubject` 看看結果，以 `AsyncSubject` 來說，就會等到 `source$` 結束後，同時收到最後一個事件資料。

除了傳入建立 Subject 類別的方法外，也可以在第二個參數傳入一個 `selector` callback function，這個 `selector` function 會收到被建立的 Subject 類別，同時回傳另一個 Observable，當使用這個參數時，將不再會對來源 Observable 進行多次訂閱，變成每次訂閱都會重新建立新的 Subject 並加上 `selector` function 回傳的 Observable 進行訂閱；也因此新的 Observable 不再是 ConnectableObservable，也就不用再次呼叫 `connect()`(因為也沒這方法可呼叫)：

```typescript
const source2$ = interval(1000).pipe(
  take(5),
  multicast(
    () => new Subject(), 
    (subject) => subject.pipe(map((data: number) => data + 1)))
);

source2$.subscribe(data => {
  console.log(`multicast 示範 (2) 第一次訂閱: ${data}`);
});

setTimeout(() => {
  source2$.subscribe(data => {
    console.log(`multicast 示範 (2) 第二次訂閱: ${data}`);
  });
}, 3000);
// multicast 示範 (2) 第一次訂閱: 1
// multicast 示範 (2) 第一次訂閱: 2
// multicast 示範 (2) 第一次訂閱: 3
// multicast 示範 (2) 第一次訂閱: 4
// multicast 示範 (2) 第二次訂閱: 1 (第二次訂閱，但從頭收到所有事件資料)
// multicast 示範 (2) 第一次訂閱: 5
// multicast 示範 (2) 第二次訂閱: 2
// multicast 示範 (2) 第二次訂閱: 3
// multicast 示範 (2) 第二次訂閱: 4
// multicast 示範 (2) 第二次訂閱: 5
```

上面程式中，每次訂閱發生時，會使用 `new Subject()` 產出的新 Subject 類別做為多播的來源，以及搭配 `selector` function 回傳的 Observable 訂閱，並多播給每次訂閱的觀察者，由於是使用 Subject 類別，因此訂閱來源依然是多播的 Observable，只是這個 Observable 只會有目前訂閱的觀察者收到而已。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-multicast

# Publish

`publish` 將 `multicast` 內封裝了 `multicast` 內建立 Subject 的方法，直接使用 `new Subject()`，因此以下兩段程式碼完全一樣：

```typescript
interval(1000).pipe(
  multicast(() => new Subject())
);

interval(1000).pipe(
  publish()
);
```

如果去挖 [publish 的程式碼](https://github.com/ReactiveX/rxjs/blob/6.x/src/internal/operators/publish.ts#L63-L67)，更可以發現它就是呼叫 `multicast` 而已，只是預設建立 Subject 的工廠方法帶入程式碼 `new Subject()`。

因為前面就示範過使用 `new Subject()` 時的運作過程，因此就不多作介紹啦，直接看 `multicast` 的範例即可。

當我們想要自行決定使用哪一種 Subject 類別建立 Hot Observable 時，請使用 `multicast`，當直接使用 `Subject` 時，則可以使用 `publish`，封裝一些細節。

除此之外，`publish` 對應不同的 `Subject` 類別還有其他的 operators：

- `publishLast`：等於 `multicast(() => new AsyncSubject())`
- `publishBehavior`：等於 `multicast(() => new BehaviorSubject())`
    - 使用的參數與 `BehaviorSubject` 相同
- `publishReplay`：等於 `multicast(() => new ReplaySubject())`
    - 使用的參數與 `ReplaySubject` 相同

# refCount

當 Observable 是 Connectable Observable 時，我們必須主動呼叫 `connect`，才可以讓資料開始流動 (當然也要有訂閱發生)，如果不需要自行控制 `connect` 時機，可以使用 `refCount` 來幫我們呼叫 `connect`。

```typescript
const source1$ = interval(1000).pipe(
  take(5),
  publish()
);

const source2$ = interval(1000).pipe(
  take(5),
  publish(),
  refCount(),
);

source1$.subscribe((data) => {
  console.log(`refCount 示範 (source1$ 訂閱值): ${data}`);
});

source2$.subscribe((data) => {
  console.log(`refCount 示範 (source2$ 訂閱值): ${data}`);
});
// refCount 示範 (source2$ 訂閱值): 0
// refCount 示範 (source2$ 訂閱值): 1
// refCount 示範 (source2$ 訂閱值): 2
// refCount 示範 (source2$ 訂閱值): 3
// refCount 示範 (source2$ 訂閱值): 4
```

從執行結果可以看到， `source1$` 因為沒有主動去呼叫 `connect()` 的關係，雖然有訂閱，但還沒辦法開始；而 `source2$` 則使用 `refCount()` 幫我們呼叫 `connect()`，因此當訂閱發生時，整個資料流就會直接開始。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-refcount

# share

`share` 基本上就是 `multicast(new Subject())` 與 `refCount()` 的組合，當然也可以當作是 `publish()` 與 `refCount()` 的組合，在之前介紹 Cold Observable 與 Hot Observable 時，就介紹過了使用 `share()` 來進行轉換，如果對前面的範例都能理解，`share()` 應該就沒什麼問題囉！在實務上，都會直接使用 `share()` 來取代 `multicast(new Subject())` + `refCount()`，畢竟程式碼比較短，也更好理解。

# shareReplay

`shareReplay` 可以直接當作 `multicast(new ReplaySubject())` 與 `refCount()` 的組合，與 `share()` 不同的地方在於，`shareReplay()` 還有重播的概念，也就是每次訂閱時，會重播過去 N 次發生的資料：

```typescript
const source$ = interval(1000).pipe(
  shareReplay(2)
);

source$.subscribe(data => {
  console.log(`shareReplay 示範 第一次訂閱: ${data}`);
});

setTimeout(() => {
  source$.subscribe(data => {
    console.log(`shareReplay 示範 第二次訂閱: ${data}`);
  });
}, 5000);
// shareReplay 示範 第一次訂閱: 0
// shareReplay 示範 第一次訂閱: 1
// shareReplay 示範 第一次訂閱: 2
// shareReplay 示範 第一次訂閱: 3
// shareReplay 示範 第一次訂閱: 4
// (第二次訂閱發生時，先重播過去兩次的資料)
// shareReplay 示範 第二次訂閱: 3
// shareReplay 示範 第二次訂閱: 4
// shareReplay 示範 第一次訂閱: 5
// shareReplay 示範 第二次訂閱: 5
// shareReplay 示範 第一次訂閱: 6
// shareReplay 示範 第二次訂閱: 6
```

如果對於 `ReplaySubject` 還有印象，這部分應該不困難才對囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-sharereplay

# 本日小結

- `multicast`：將單播 (unicast) 的 Observable 轉換成多播 (multicast)，需要決定使用哪種多播的來源(`Subject`、`BehaviorSubject` 等等)，之後會得到一個 ConnectableObservable，需要呼叫它的 `connect()` 方法後才能開始資料流。可自行決定 `connect()` 時機。
- `publish`：`multicast` 的特定版本，直接使用 `Subject` 類別做為多播的來源。
    - 等同於 `multicast(() => new Subject())`
    - 另外還有：
        - `publishLast`： `multicast(() => new AsyncSubject())`
        - `publishBehavior`： `multicast(() => new BehaviorSubject())`
        - `publishReplay`： `multicast(() => new ReplaySubject())`
- `refCount`：幫我們直接呼叫來源 ConnectableObservable 的 `connect()` 方法。
- `share`：意義為來源 Observable 的資料共享給所有觀察者。
    -  `multicast(() => new Subject())` + `refCount()`
- `shareReplay`：每次訂閱時會重播來源 Observable 最近 N 次的資料，也就是最近 N 次事件資料共享給所有觀察者。
    -  `multicast(() => new ReplaySubject())` + `refCount()`

如果能理解單播和多播的不同，對於今天的 operators 應該會相對好理解，如果覺得太抽象，可以多看幾次文章，如果還是不容易理解，至少要知道 `share` 和 `shareReplay`，因為實務上幾乎都是直接使用這兩個 operators。

# 相關資源

- [ConnectableObservable](https://rxjs-dev.firebaseapp.com/api/index/class/ConnectableObservable)
- [Operator - multicast](https://rxjs-dev.firebaseapp.com/api/operators/multicast)
- [Operator - publish](https://rxjs-dev.firebaseapp.com/api/operators/publish)
- [Operator - publishLast](https://rxjs-dev.firebaseapp.com/api/operators/publishLast)
- [Operator - publishBehavior](https://rxjs-dev.firebaseapp.com/api/operators/publishBehavior)
- [Operator - publishReplay](https://rxjs-dev.firebaseapp.com/api/operators/publishReplay)
- [Operator - refCount](https://rxjs-dev.firebaseapp.com/api/operators/refCount)
- [Operator - share](https://rxjs-dev.firebaseapp.com/api/operators/share)
- [Operator - shareReplay](https://rxjs-dev.firebaseapp.com/api/operators/share)
