---
title: "[RxJS] 條件/布林類型 Operators (1) - isEmpty / defaultIfEmpty / find / finxIndex / every"
date: 2020-10-11 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - isEmpty
  - defaultIfEmpty
  - find
  - findIndex
  - every
---

今天介紹「條件/布林類型」的 operators，這類型的 operators 都是用來判斷整個 Observable 是否符合某些條件來當作新的 Observable 事件資料。

<!-- more -->

# isEmpty

`isEmpty` 會判斷來源 Observable 是否沒有「發生過任何事件值」，如果到結束時完全沒有任何事件發生過，則會發生 `true` 事件在新的 Observable 上，反之則新的 Observable 會發生 `false` 事件。

```typescript
EMPTY
  .pipe(isEmpty())
  .subscribe(data => {
    console.log(`isEmpty 示範 (1): ${data}`)
  });
// isEmpty 示範 (1): true

const emptySource$ = new Subject();
emptySource$
  .pipe(isEmpty())
  .subscribe(data => {
    console.log(`isEmpty 示範 (2): ${data}`)
  });
setTimeout(() => emptySource$.complete(), 2000);
// isEmpty 示範 (2): true
```

上面程式中，我們建立兩種 Observable，一種是使用 `EMPTY` 直接建立一個空的 Observable，第二種是使用 `Subject` 建立 Observable，但沒有讓任何事件發生，並在兩秒後結束；由於兩種 Observable 過程中都沒有任合新的事件發生，因此最終會得到 `true` 的結果。

彈珠圖：

```
-----------|
isEmpty()
-----------(true|)
```

如果過程中有發生過事件呢？當然就會得到 `false` 的結果：

```typescript
interval(1000)
  .pipe(
    take(3),
    isEmpty()
  )
  .subscribe(data => {
    console.log(`isEmpty 示範 (3): ${data}`)
  });
// isEmpty 示範 (3): false
```

由於有事件發生，確定不是空的 Observable，因此在事件發生同時，就會得到 `false` 同時結束 Observable。

彈珠圖：

```
---0---1---2---3---4---5...
take(3)
---0---1---2|
isEmpty()
---(false|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-isempty

# defaultIfEmpty

`defaultIfEmpty` 會在 Observable 沒有任何事件發生就結束時，給予一個預設值：

```typescript
const emptySource$ = new Subject();
emptySource$
  .pipe(defaultIfEmpty('a'))
  .subscribe(data => {
    console.log(`defaultIfEmpty 示範 (1): ${data}`)
  });
setTimeout(() => emptySource$.complete(), 2000);
// defaultIfEmpty 示範 (1): a
```

上面程式中，由於來源 Observable 是一個空的 Observable，因此會給予一個指定的預設值。

彈珠圖：

```
------|
defaultIfEmpty('a')
------(a|)
```

如果過程中有發生事件值呢？那麼當然 `defaultIfEmpty` 就不做任何事情囉：

```typescript
interval(1000)
  .pipe(
    take(3),
    defaultIfEmpty(-1) // 因為來源 Observable 有事件值，因此不做任何事情
  )
  .subscribe(data => {
    console.log(`defaultIfEmpty 示範 (2): ${data}`);
  });
// defaultIfEmpty 示範 (2): 0
// defaultIfEmpty 示範 (2): 1
// defaultIfEmpty 示範 (2): 2
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-defaultifempty

# find

`find` 內需要傳入一個 `predictate` callback function，`find` 會將事件資訊傳入此 function，並回傳是否符合指定的條件，如果符合，就會將目前的事件資料發生在新的 Observable 上，同時完成 Observable。

```typescript
interval(1000)
  .pipe(find(data => data === 3))
  .subscribe(data => {
    console.log(`find 示範: ${data}`);
  });
// find 示範: 3
```

上述程式的來源是一個每秒發生一次且不會結束的 Observable，透過 `find`，當符合資料等於 `3` 時，就使用這個資料作為新的 Observable 事件資料，同時結束整個 Observable。

彈珠圖：

```
---0---1---2---3---4---5.....
find(data => data === 3)
---------------(3|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-find

# findIndex

`findIndex` 與 `find` 一樣需要一個 `predicate` callback function，差別在於 `findIndex` 的條件符合時，新的 Observable 事件資料是「符合條件事件的索引值」，也就是這個事件是來源 Observable 的第幾次事件：

```typescript
interval(1000)
  .pipe(
    map(data => data * 2),
    findIndex(data => data === 6)
  )
  .subscribe(data => {
    console.log(`findIndex 示範: ${data}`);
  });
// findIndex 示範: 3
```

上面程式中，符合條件的資料為 `6` 因此將它發生在來源 Observable 的索引值 `3` 發生在新的 Observable 上，同時結束。

彈珠圖：

```
---0---1---2---3---4-...
map(data => daya * 3)
---0---2---4---6---8-...
findIndex(data => data === 6)
---------------(3|)
                ^ 來源資料的索引值
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-findindex

# every

`every` 也是傳入一個 `predicate` callback function，`every` 會將事件資訊傳入此 function，並判斷來源 Observable 是否「全部符合指定條件」，如果符合，在來源 Observable 結束時會得到 `true` 事件；如果不符合，則會在事件資料不符合指定條件同時得到 `false` 事件並結束。

```typescript
const source$ = interval(1000)
  .pipe(
    map(data => data * 2),
    take(3)
  );

source$
  .pipe(
    every(data => data % 2 === 0)
  )
  .subscribe(data => {
    console.log(`every 示範 (1): ${data}`);
  });
// every 示範 (1): true
```

上面程式的 `source$` 資料都會是 2 的倍數，符合 `every` 內條件，因此在 Observable 結束時，會得到 `true` 事件。

彈珠圖：

```
---0---2---4|
every(data => data % 2 === 0)
-----------(true|)
```

當有事件值不符合時，會立刻收到此事件並結束。

```typescript
interval(1000)
  .pipe(every(data => data % 2 === 0))
  .subscribe(data => {
    console.log(`every 示範 (2): ${data}`);
  });
// every 示範 (2): false
```

彈珠圖：

```
---0---1---2---3....
every(data => data % 2 === 0)
-------(false|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-every

# 本日小結

- `isEmpty`：用來判斷來源 Observable 是否是空的，也就是沒有任何事件發生就結束了。
- `defaultIfEmpty`：當來源 Observable 是空的時候，給予一個預設值。
- `find`：用來判斷來源 Observable 是否有符合條件的事件資料，如果有，將此事件資料發生在新的 Observable 上，並結束。
- `findIndex`：用來判斷來源 Observable 是否有符合條件的事件資料，如果有，將此事件資料在來源 Observable 的索引值發生在新的 Observable 上，並結束。
- `every`：用來判斷來源 Observable 的事件是否「全部符合指定條件」。

# 相關資源

- [Operator - isEmpty](https://rxjs-dev.firebaseapp.com/api/operators/isEmpty)
- [Operator - defaultIfEmpty](https://rxjs-dev.firebaseapp.com/api/operators/defaultIfEmpty)
- [Operator - find](https://rxjs-dev.firebaseapp.com/api/operators/find)
- [Operator - findIndex](https://rxjs-dev.firebaseapp.com/api/operators/findIndex)
- [Operator - every](https://rxjs-dev.firebaseapp.com/api/operators/every)
