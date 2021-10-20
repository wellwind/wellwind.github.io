---
title: "[RxJS] 組合/建立類型 Operators (1) - concat / merge / zip / partition"
date: 2020-10-01 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - concat
  - merge
  - zip
  - partition
---

接下來我們來介紹「組合/建立類型」的 operators，這類型 operators 的目標依然是「建立」新的 observable，但來源不再是特定的數值等，而是直將另外一個(或數個) Observable 當作資料來源建立新的 Observable。

<!-- more -->

# concat

`concat` 可以將數個 Observables 組合成一個新的 Observable，並且在每個 Observable 結束後才**接續執行**下一個 Observable，想像看看以下三個 Observables：

```typescript
const sourceA$ = of(1, 2);
const sourceB$ = of(3, 4);
const sourceC$ = of(5, 6);
```

如果希望 `sourceA$` 跑完再跑 `sourceB$` 接著最後跑 `sourceC$`，在不知道如何使用 operators 的情況就會寫成：

```typescript
sourceA$.subscribe({
  next: data => console.log(data),
  complete: () => sourceB$.subscribe({
    next: data => console.log(data),
    complete: () => sourceC$.subscribe({
      next: data => console.log(data)
    })
  })
});
// 1
// 2
// 3
// 4
// 5
// 6
```

不用多說，只要有點經驗的工程師都知道問題在哪裡吧？就讓我們直接用一張經典圖片表示：

{% asset_img 01.jpg %}

這種深層巢狀的波動拳寫法絕對是大忌！為了避免被同事 (以及未來的自己) 白眼，可以使用 `concat` 來解救我們：

```typescript
concat(sourceA$, sourceB$, sourceC$).subscribe(data => {
  console.log(data);
});
```

結果完全一樣，所有的 Observable 會依序執行，目前的 Observable 結束後再去執行下一個 Observable。

要注意的是，由於一定會等到目前 Observable 結束才繼續，因此在設計來源 Observable 時，一定要將「結束」這件事情考量在內，當然不是一定要結束，畢竟這關係到 Observable 本身的流程設計，但常見的一個小錯誤是用了不會結束的 Observable 如 `interval` 或使用 `Subject` 卻忘了呼叫 `complete()`，結果永遠等不到下一個 Observable 執行的情況。

順便附上示意用彈珠圖：

```
sourceA$: 1------2------|
sourceB$: 3------4------|
sourceC$: 5------6------|

concat(sourceA$, sourceB$, source$)
(sourceA$)    (sourceB$)    (sourceC$)
1------2------3------4------5------6------|
             ^ 到這裡 sourceA$ 結束，接續下一個 sourceB$
                           ^ 到這裡 sourceB$ 結束，接續下一個 sourceC$
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-concat

# merge

`merge` 跟 `concat` 類似，但會同時啟動參數內所有的 Observable，因此會有「平行處理」的感覺，直接看程式碼：

```typescript
const sourceA$ = interval(1000).pipe(
  map(data => `A${data}`)
);

const sourceB$ = interval(3000).pipe(
  map(data => `B${data}`)
);

const sourceC$ = interval(5000).pipe(
  map(data => `C${data}`)
);

const subscription = merge(sourceA$, sourceB$, sourceC$).subscribe(data => {
  console.log(`merge 範例： ${data}`)
});
// merge 範例： A1
// merge 範例： A2
// merge 範例： A3 (A3, B1 會同時發生)
// merge 範例： B1
// merge 範例： A4
// merge 範例： A5 (A5, C1 會同時發生)
// merge 範例： C1
// merge 範例： A6 (A6, B2 會同時發生)
// merge 範例： B2

```

實際跑起來內容不少，直接用彈珠圖來看：

```
sourceA$: --A1--A2--A3--A4--A5--A6--....
sourceB$: ----------B1----------B2--...
sourceC$: ------------------C1------....

merge(sourceA$, sourceB$, sourceC$)

--A1--A2--(A3,B1)--A4--(A5,C1)--(A6,B2)------.......
```

為了方便解釋，每個從上面的彈珠圖可以看到

- 第 1、2 秒時，各自會產生 `sourceA$` 的 A1 和 A2 事件
- 第三秒時 `sourceA$` 和 `sourceB$` 同時分別發生了 A3 和 B1 事件
- 第五秒時 `sourceA$` 和 `sourceC$` 同時分別發生了 A5 和 C1 事件
- 第六秒時 `sourceA$` 和 `sourceB$` 同時分別發生了 A6 和 B2 事件

之所以會這樣是因為 `sourceA$`、`sourceB$` 和 `sourceC$` 是同時開始的，只是透過 `merge` 組合成一條 Observable。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-merge

# zip

`zip` 是拉鍊的意思，拉鍊是把兩個鏈條合併在一起，且資料是「一組一組合併在一起的」，實際上在使用時，`zip` 會將傳入的 Observables 依次組合在一起成為一個陣列，已經被組合過的就不會再次被組合，範例如下：

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

zip(sourceA$, sourceB$, sourceC$).subscribe(data => {
  console.log(`zip 範例: ${data}`)
});
// zip 範例: [A1, B1, C1]
// zip 範例: [A2, B2, C2]
// zip 範例: [A3, B3, C3]
```

上述例子中，前三個發生過的事件會各自被組合起來，而 `sourceA$` 和 `sourceB$` 雖然都有第四次事件，但因為 `sourceC$` 沒有第四次事件，所以沒有成功組合成新的資料。

一樣畫的彈珠圖：

```
sourceA$: --A1--A2--A3--A4--............
sourceB$:   ----B1  ----B2  ----B3--....
sourceC$:     ------C1    ------C2    ------C3......

zip(sourceA$, sourceB$, sourceC$)
              ------**    ------**    ------**.......
                [A1,B1,C1]  [A2,B2,C2]  [A3,B3,C3]
```

這邊彈珠圖刻意把時間拉開一點，讓各位可以注意到合併的感覺是依照事件發生的次序進行合併的，也就是「所有第一次發生的事件」會合併成一組，「所有第二次發生的事件」會合併成另外一組，以此類推。

{% asset_img 02.jpg %}

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-zip

# partition

前面介紹的都是將多個 Observable 組合成一條新的 Observable，只是順序和處理資料的方式不同，而 `partition` 則是將 Observable 依照規則拆成兩條 Observable。`partition` 需要兩個參數：

- **source**: 來源 Observable
- **predicate**: 用來拆分的條件，是一個 function，每次事件發生都會將資料傳入此 function，並會傳是否符合條件 (true/false)，符合條件的(true)會被歸到一條 Observable，不符合條件的則被歸到另外一條 Observable。

```typescript
const source$ = of(1, 2, 3, 4, 5, 6);

const [sourceEven$, sourceOdd$] = partition(source$, (data) => data % 2 === 0);

sourceEven$.subscribe(data => console.log(`partition 範例 (偶數): ${data}`));
sourceOdd$.subscribe(data => console.log(`partition 範例 (奇數): ${data}`));
```

彈珠圖：

```
source$:     -----1-----2-----3-----4-----5-----6-----|

[sourceEven$, sourceOdd$] = partition(source$, (data) => data % 2 === 0);

sourceEven$: -----------2----------4------------6-----|
sourceOdd$:  -----1------------3----------5-----------|
```

這功能很像我們之前就用過，之後也會介紹的 `filter`，但使用 `filter` 達成這個需求會比較麻煩：

```typescript
const source$ = of(1, 2, 3, 4, 5, 6);

const sourceEven$ = source$.pipe(filter(data => data % 2 === 0));
const sourceOdd$ =  source$.pipe(filter(data => data % 2 !== 0));
```

在可以肯定二分法的時候，使用 `partition` 會簡單非常多！

在 SPA 架構盛行的現在，我們常常會在網頁上管理各種狀態，像是「登入」和「登出」等狀態，如果我們希望兩種狀態有各自不同的情境處理時，就可以用 `partition` 切成兩條 Observable，然後各自只要專注在處理各自的邏輯就好囉。

```typescript
// 定時變更「登入」、「登出」狀態
// 實際上應該搭配 Subject 來控制
const isLogin$ = interval(1000).pipe(
  map((_, index) => index % 2 === 0)
);

const [login$, logout$] = partition(isLogin$, (data) => data);

login$.subscribe(() => console.log('我又登入囉！'));
logout$.subscribe(() => console.log('我又登出啦！'));
```

這種例子在實際上還蠻常遇到的喔！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-partition

# 本日小結

- `concat`：用來「串接」數個 Observables，會依序執行每個 Observable，上一個 Observable 「完成」後才會執行下一個 Observable。
- `merge`：用來「同時執行」數個 Observables，所有 Observables 會同時執行，並只在一條新的 Observable 上發生事件。
- `zip`：一樣「同時執行」數個 Observables，差別是會將每個 Observable 的資料「組合」成一個新的事件值，在新的 Observable 上發生新事件。
- `partition`：依照指定邏輯，將一條 Observable 拆成兩條 Observables。

# 相關資源

- [Operators - concat](https://rxjs-dev.firebaseapp.com/api/index/function/concat)
- [Operators - merge](https://rxjs-dev.firebaseapp.com/api/index/function/merge)
- [Operators - zip](https://rxjs-dev.firebaseapp.com/api/index/function/zip)
- [Operators - partition](https://rxjs-dev.firebaseapp.com/api/index/function/partition)
