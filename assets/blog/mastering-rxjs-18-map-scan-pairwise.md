---
title: "[RxJS] 轉換類型 Operators (1) - map / scan / pairwise"
date: 2020-10-03 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - map
  - scan
  - pairwise
---

在介紹完各種建立 Observable 的 operators 後，接下來我們開始介紹各式各樣放在 `pipe` 裡面，讓 Observable 資料流向更加多采多姿的 operators。

首先要介紹的是各種「轉換」類型的 operators。

<!-- more -->

# map

`map` 在實務上使用的頻率可以說是**壓倒性的高**，因為它最直覺好懂，也是許多 operators 的基礎，也就是說光是懂得如何善用 `map` operator，就可以完成非常非常多的功能，許多其他的 operaotrs 功能其實都可以使用 `map` 來完成。

那麼 `map` 的功能到底是什麼呢？很簡單，就是把 Observable 每次「事件的值」換成「另外一個值」：

```typescript
of(1, 2, 3, 4).pipe(
  map(value => value * 2)
).subscribe(value => console.log(`map 示範 (1): ${value}`));
// map 示範 (1): 2
// map 示範 (1): 4
// map 示範 (1): 6
// map 示範 (1): 8
```

彈珠圖：

```
1    2    3    4|
map(value => value * 2)
2    4    6    8|
```

`map` 內除了傳入每次事件值以外，還可以傳入一個 `index` 參數，代表目前的值是 Observable 第幾次發生的事件：

```typescript
of(1, 2, 3, 4).pipe(
  map((value, index) => `第 ${index} 次事件資料為 ${value}`)
).subscribe(message => console.log(`map 示範 (2): ${message}`));
// map 示範 (2): 第 0 次事件資料為 1
// map 示範 (2): 第 1 次事件資料為 2
// map 示範 (2): 第 2 次事件資料為 3
// map 示範 (2): 第 3 次事件資料為 4
```

對 JavaScript 陣列操作熟悉的朋友應該也不難發現，這跟陣列的 `map` 方法非常幾乎一模一樣，唯一的差別只在

- Observable 的 `map` 是每次有事件發生時進行轉換。
- 陣列的 `map` 會立刻把整個了陣列的資料勁行轉換。

在實務應用時，`map` 使用的時間多辦是需要針對事件資料根據一些規則進行整理，整理後再往下拋，因此下一關不管是搭配其他的 operators 還是直接訂閱處理，都可以專注在想要的邏輯上，而不用去想前面步驟的邏輯(當然，在用陣列的 `map` 也是一樣的思維)，舉個例子來說：

{% note info %}

由於某次考試難度太高，老師決定將考試成績開根號後乘以十後，小數點省略，再顯示大於等於 60 分及格，小於 60 分不及格。

{% endnote %}

在思考的時候，我們可以把步驟一步一步拆解

1. 將成績開根號
2. 開根號後的成績乘以十
3. 把小數點省略
4. 判斷是否及格
5. 將結果顯示在畫面上

將步驟思考好後，就可以逐步地完成每一個步驟：

```typescript
const studentScore = [
  { name: '小明', score: 100 },
  { name: '小王', score: 49 },
  { name: '小李', score: 30 }
];

of(...studentScore).pipe(
  // 專注處理開根號邏輯
  map(student => ({...student, newScore: Math.sqrt(student.score)})),
  // 專注處理乘以十邏輯
  map(student => ({...student, newScore: student.newScore * 10})),
  // 專注處理取整數
  map(student => ({...student, newScore: Math.ceil(student.newScore)})),
  // 專注處理判斷是否及格
  map(student => ({...student, pass: student.newScore >= 60}))
).subscribe(student => {
  // 專注處理如何顯示
  console.log(
    `map 示範 (3): ${student.name} 成績為 ${student.newScore} (${student.pass ? '及格': '不及格'})`);
});
```

這段程式碼中我們也融入了一些過去提到 functional programming 時的觀念，我們將執行步驟盡量拆小，讓關注點更加明確；而在 `map` 內我們也應用了 immutable (不可變物件) 的處理方式，確保每次修改都是回傳一個新的物件，而不會改到原來的物件，讓程式運作過程更可靠；剛開始看到這樣的程式碼可能會覺得不太習慣，但習慣後真的會有種寫得很安心的感覺！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-map

# scan

`scan` 需要傳入兩個參數

- **累加函數**：這個函數被呼叫時會傳入三個參數，可以搭配這三個參數處理資料後回傳一個累加結果，函數參數包含
    - `acc`：目前的累加值，也就是上一次呼叫累加函數時回傳的結果
    - `value`：目前事件值
    - `index`：目前事件 index
- **初始值**

在 Observable 被訂閱時，會以「初始值」作為起始結果，並傳入累加函數中，我們可以在這裡面做一些運算，再回傳下次使用的累加值，每次會傳的結果就被「轉換」成新的事件值：

```typescript
const donateAmount = [100, 500, 300, 250];

const accumDonate$ = of(...donateAmount).pipe(
  scan(
    (acc, value) => acc + value, // 累加函數
    0 // 初始值
  )
);

accumDonate$.subscribe(amount => {
  console.log(`目前 donate 金額累計: ${amount}`)
});
// 目前 donate 金額累計: 100
// 目前 donate 金額累計: 600
// 目前 donate 金額累計: 900
// 目前 donate 金額累計: 1150
```

彈珠圖：

```
(100      500      300      250|)
scan((acc, value) => acc + value, 0)
(100      600      900     1150|)
```

` scan` 跟 `map` 蠻像的，但 `scan` 可以根據我們的條件保留上一次的狀態，方便我們進行其他的處理。另外還有一個 operator 叫做 `reduce` 行為幾乎一樣，但只會回傳結束時的加總結果，我們留到介紹「聚合」類型的 operators 時再來介紹。

# pairwise

`pairwise` 可以將 Observable 的事件資料「成雙成對」的輸出，這個 operator 沒有任何參數，因為他只需要 Observable 作為資料來源就足夠了，直接看看程式碼：

```typescript
of(1, 2, 3, 4, 5, 6).pipe(
  pairwise()
).subscribe(data => {
  console.log(`pairwise 示範 (1): ${data}`);
})
// pairwise 示範: 1,2
// pairwise 示範: 2,3
// pairwise 示範: 3,4
// pairwise 示範: 4,5
// pairwise 示範: 5,6
```

`pairwise` 會將「目前事件資料」和上一次「事件資料」組成一個長度 2 的陣列，值得注意的是，因為「第一次」事件發生時，沒有「上一次」事件，因此輸出結果的數量永遠會比總是件數量少一次。

彈珠圖：

```
(      1      2      3      4      5      6|)
pairwise()
(           [1,2]  [2,3]  [3,4]  [4,4]  [5,6]|)
      ^ 第一次事件發生時會被過濾掉
```

由於不知道在沒有前一次事件值時該如何處理，因此第一次事件發生時會自動忽略，如果有明確的規則(例如沒有上一次事件時就當作 `null`)，也可以改用剛剛學過的 `scan` 來處理：

```typescript
of(1, 2, 3, 4, 5, 6).pipe(
  scan(
    (accu, value) => ([accu === null ? null : accu[1], value]),
    null
  )
).subscribe(data => {
  console.log(data);
});
// [null, 1]
// [1, 2]
// [2, 3]
// [3, 4]
// [4, 5]
// [5, 6]
```

# 實戰練習 - 股價資訊提示

來做個簡單的實戰練習把今天的 operators 都運用一遍吧！以下是題目：

- 假設有一個資料流會發送每日收盤時股價，平均股價約 100 元上下
- 第一天股價一定是 100 元，可忽略它，從第二天開始呈現以下資訊
    - 當股價比前一天高，顯示「股價上漲了！」
    - 當股價比前一天低，顯示「股價下跌了！」
    - 每天提示從歷史以來股價小於 100 元的天數

假設股價資料為：

```
const priceHistories = [100, 98, 96, 102, 99, 105, 105];
```

輸出結果：

{% asset_img 01.jpg %}

好好思考一下，再參考看看以下解答喔！

以下是程式碼：https://stackblitz.com/edit/mastering-rxjs-18-demo

```typescript
import { from } from 'rxjs';
import { map, pairwise, scan } from 'rxjs/operators';

const priceHistories = [100, 98, 96, 102, 99, 105, 105];

const source$ = from(priceHistories).pipe(
  // 讓資料成雙成對出現
  pairwise(),
  // 將資料整理成物件
  map(([yesterdayPrice, todayPrice], index) => ({
    day: index + 2,
    todayPrice,
    // 計算是否上漲下跌
    priceUp: todayPrice > yesterdayPrice,
    priceDown: todayPrice < yesterdayPrice
  })),
  // 逐步計算股價小於 100 的天數
  scan(
    (accu, value) => ({
      ...value,
      // 股價小於 100，天數 + 1
      priceBelow100Days:
        accu.priceBelow100Days + (value.todayPrice < 100 ? 1 : 0)
    }),
    {
      day: 1,
      todayPrice: 0,
      priceUp: false,
      priceDown: false,
      priceBelow100Days: 0
    }
  )
);

source$.subscribe(data => {
  console.log(`第 ${data.day} 天`);
  console.log(`本日股價: ${data.todayPrice}`);
  console.log(`本日股價 ${data.priceUp ? '上漲': data.priceDown ? '下跌': '持平'}`);
  console.log(`歷史股價小於 100 的有 ${data.priceBelow100Days} 天`);
});
```

也歡迎跟我分享你的寫法喔 ^^

# 相關資源

- [Operator - map](https://rxjs-dev.firebaseapp.com/api/operators/map)
- [Operator - scan](https://rxjs-dev.firebaseapp.com/api/operators/scan)
- [Operator - pairwise](https://rxjs-dev.firebaseapp.com/api/operators/pairwise)
