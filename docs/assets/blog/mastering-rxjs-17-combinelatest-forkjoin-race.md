---
title: "[RxJS] 組合/建立類型 Operators (2) - combineLatest / forkJoin / race"
date: 2020-10-02 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - combineLatest
  - forkJoin
  - race
---

今天再來介紹幾個常用的「建立/組合」類型的 operators。

<!-- more -->

# combineLatest

`combineLatest` 跟昨天介紹過的 `zip` 非常像，差別在於 `zip` 會依序組合，而 `combineLatest` 會在資料流有事件發生時，直接跟目前其他資料流的「最後一個事件」組合在一起，也因此這個 operator 是 `latest` 結尾，另一個不同的地方是，`comeintLatest` 內的參數是一個 Observable 陣列，訂閱後會把陣列內的這些 Observables 組合起來；直接看看程式碼：

```typescript
const sourceA$ = interval(1000).pipe(
  map(data => `A${data + 1}`)
);
const sourceB$ = interval(2000).pipe(
  map(data => `B${data + 1}`)
);
const sourceC$ = interval(3000).pipe(
  map(data => `C${data + 1}`)
);

const subscription = combineLatest([sourceA$, sourceB$, sourceC$])
	.subscribe(data => console.log(`combineLatest 範例: ${data}`));
// combineLatest 範例: A3,B1,C1
// combineLatest 範例: A4,B1,C1
// combineLatest 範例: A4,B2,C1
// combineLatest 範例: A5,B2,C1
// combineLatest 範例: A6,B2,C1
// combineLatest 範例: A6,B3,C1
// combineLatest 範例: A6,B3,C2
// combineLatest 範例: A7,B3,C2
// combineLatest 範例: A8,B3,C2
// combineLatest 範例: A8,B4,C2
// combineLatest 範例: A9,B4,C2
// combineLatest 範例: A9,B4,C3
```

{% note info %}

RxJS 5 之前參數不用放在陣列內，直接一個一個放進去就好，不過後來改成用陣列了，因此不放陣列的方法也被標記為棄用囉。

{% endnote %}

從結果可以看到每次有事件發生時都會將其他 Observable 最後發生的事件值組合起來，而 A1 發生時，因為其他 Observable 還沒有任何新事件，因此沒有辦法組合，所以直到 C1 發生時，全部 Observable 都有「最後一次事件值」，才進行組合。

彈珠圖：

```
sourceA$: --A1--A2--A3        --A4        --A5......           
sourceB$:   ----B1            --B2        ....
sourceC$:     ------C1                          

zip(sourceA$, sourceB$, sourceC$)
              ------**        --**        --**.......
                [A3,B1,C1]  [A4,B1,C1]  
                            [A4,B2,C1] (兩個來源 Observable 同時發生事件)
```

`combineLatest` 在實務上組合各種 Observables 的時候還蠻常用的，之後實戰練習的時候再來詳細介紹一下。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-combinelatest

# forkJoin

`forkJoin` 會同時訂閱傳入的 Observables，直到每個 Observable 都「結束」後，將每個 Observable 的「最後一筆值」組合起來，一樣直接上程式碼：

```typescript
import { interval, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

const sourceA$ = interval(1000).pipe(
  map(data => `A${data + 1}`),
  take(5)
);
const sourceB$ = interval(2000).pipe(
  map(data => `B${data + 1}`),
  take(4)
);
const sourceC$ = interval(3000).pipe(
  map(data => `C${data + 1}`),
  take(3)
);

forkJoin([sourceA$, sourceB$, sourceC$]).subscribe({
  next: data => console.log(`forkJoin 範例: ${data}`),
  complete: () => console.log('forkJoin 結束')
});
// forkJoin 範例: A5,B4,C3
// forkJoin 結束
```

因為要等所有 Observables 都結束，因此這裡示範使用了 `take()` 這個 operators 會在事件發生指定次數後結束整個 Observable。

上面的程式碼，最後結束的會是`sourceC$` 的 C3，此時 `sourceA$` 和 `sourceB` 都已經結束了，事件值分別是 A5 和 B4，因此最後訂閱時會得到一個 `[A5, B4, C3]` 然後結束。

彈珠圖：

```
sourceA$: --A1--A2--A3--A4--A5|
sourceB$: ----B1  ----B2  ----B3|
sourceC$:     ------C1    ------C2    ------C3|

forkJoin(sourceA$, sourceB$, sourceC#)
              ------      ------      ------**|
                                        [A5,B3,C3]
```

在實務上，我們會使用 `forkJoin` 去平行發送多個沒有順序性的 HTTP 請求，因為 HTTP 請求只會發生一次回傳就結束，如果每個請求之前沒有順序性，那麼一起發送會是比較快可以拿到全部資料的方法，例如：

```typescript
const profile$ = ajax('/me/rofile');
const friends$ = ajax('/me/friends');

forkJoin(profile$, friend$).subscribe((profile, friends) => {
  // 同時處理 profile 和 friends 資料
});
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-forkjoin

# race

`race` 本身就有「競速」的意思，因此這個 operator 接受的參數一樣是數個 Observables，當訂閱發生時，這些 Observables 會同時開跑，當其中一個 Observable 率先發生事件後，就會以這個 Observable 為主，並退訂其他的 Observables，也就是先到先贏，其他都是輸家：

```typescript
const sourceA$ = interval(1000).pipe(
  map(data => `A${data + 1}`)
);
const sourceB$ = interval(2000).pipe(
  map(data => `B${data + 1}`)
);
const sourceC$ = interval(3000).pipe(
  map(data => `C${data + 1}`)
);

const subscription = race([sourceA$, sourceB$, sourceC$])
  .subscribe(data => console.log(`race 範例: ${data}`));
// A1
// A2
// A3
// ... (因為 sourceA$ 已經先到了，其他 Observables 就退訂不處理)
```

彈珠圖：

```
sourceA$: --A1--A2--A3.....
sourceB$:   ----B1.........
sourceC$:     ------C1.....

race(sourceA$, sourceB$, sourceC$)
          --A1--A2--A3..... 
            ^ sourceA$ 先到了，因此退訂 sourceB$ 和 sourceC$
```

這種只有一條 Observable 可以存活的感覺，讓人想忍不住到這張圖啊：

{% asset_img 01.jpg %}

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-race

# 本日小節

這兩天我們介紹了「組合/建立類型」的 operators，這類型的 opereators 都是透過不同的 Observables 來源組合成新的 Observables，讓我們能更靈活的操作各種 Observables。

- `combineLatest`：同時訂閱所有內部 Observables，並將內部 Observables 裡面的最後一次事件資料組合起來。
- `forkJoin`：同時訂閱所有內部 Observables，並將內部 Observables 「完成」前的最後一個事件資料組合起來。
- `race`：同時訂閱所有內部 Observables，當其中一個 Observable 先發生第一次事件後，以此 Observable 為主，並將其他 Observable 取消訂閱。

跟建立類型相關的 operators 介紹到此為止，明天開始讓我們介紹這種轉換資料流向的 operators 囉。

# 相關資源

- [Operators - combineLatest](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest)
- [Operators - forkJoin](https://rxjs-dev.firebaseapp.com/api/index/function/forkJoin)
- [Operators - race](https://rxjs-dev.firebaseapp.com/api/index/function/race)
