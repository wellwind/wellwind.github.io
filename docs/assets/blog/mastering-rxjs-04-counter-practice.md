---
title: '[RxJS] 隨堂測驗 - 簡易計數器' 
date: 2020-09-19 18:00:00
category:
  - '打通 RxJS 任督二脈'
  - '第 12 屆鐵人賽'
tags:
  - RxJS
  - map
  - filter
  - fromEvent
---

在昨天的文章最後我們出了一個「簡易計數器」的練習，今天就來看看該如何實作這些功能吧！

<!-- more -->

實作完成的程式範例：https://stackblitz.com/edit/mastering-rxjs-practice-day04-counter

# 題目回顧

- 畫面必須顯示三個資訊：
    - 目前狀態：包含「開始計數」、「完成」和「錯誤」(包含錯誤訊息)。
    - 目前計數：當計數器建立後，顯示「計數」按鈕被點擊的次數。
    - 偶數計數：每當「目前計數」數值為偶數時，顯示這個偶數值。
- 畫面包含四個按鈕，功能如下：
    - 「開始新的計數器」按鈕：重新建立一個新的計數器，必須使用 `new Subject()` 來建立；並在「目前狀態」資訊顯示「開始計數」。
    - 「計數」按鈕：當建立新的計數器後，每按下計數按鈕，顯示的計數值就加 1。
    - 「發生錯誤」按鈕：要求使用者輸入錯誤訊息，並將錯誤訊息顯示在「目前狀態」資訊內。
    - 「完成計數」按鈕：在「目前狀態」資訊顯示「完成」
- 其他要求：
    - 當按下「開始新的計數器」時，所有計數器歸 0。
    - 當按下「發生錯誤」或「完成計數」，除非按下「開始新的計數器」，否則其他按鈕按下不會有任何動作。

最終畫面預期如下：

{% asset_img 01.gif %}

# 實作步驟

簡單溫習一下 RxJS 使用的三個步驟

1. 建立新的 Observable
2. 使用 Operators 來組合/轉換 Observables
3. 訂閱 Observable

接下來我們就依循這些步驟，來一步一步完成目標功能囉

## 步驟1：HTML 結構與 DOM 預處理

由於已經知道需要 4 個按鈕，及三種資訊的文字，所以 HTML 部分很簡單：

```html
<button id='start'>開始新的計數器</button>
<button id='count'>計數</button>
<button id='error'>發生錯誤</button>
<button id='complete'>完成計數</button>

<!-- 顯示目前計數器狀態 -->
<div id='status'>
  目前狀態：
</div>
<!-- 目前計數的值 -->
<div id='currentCounter'>
  目前計數：
</div>
<!-- 偶數計數值 -->
<div id='evenCounter'>
  偶數計數：
</div>
```

並且在 JavaScript 中先取得這些元素

```typescript
// 開始按鈕
const startButton = document.querySelector('#start');
// 計數按鈕
const countButton = document.querySelector('#count');
// 發生錯誤按鈕
const errorButton = document.querySelector('#error');
// 計數完成按鈕
const completeButton = document.querySelector('#complete');

// 計數器內容
const currentCounterLabel = document.querySelector('#currentCounter');
// 只顯示偶數的計數器內容
const evenCounterLabel = document.querySelector('#evenCounter');
// 目前狀態
const statusLabel = document.querySelector('#status');
```

## 步驟 2：實作「開始新的計數器」按鈕

由於需要紀錄目前計數值，所以我們可以建立一個變數，來儲存目前計數值且顯示在畫面上。

而當計數值改變時，我們也希望能收到通知進而判斷是否為偶數，並顯示在畫面上，因此建立一個 `subject` 來通知數值改變。

```typescript
// 計數器的值
let counter = 0;
// 自訂 subject 來通知計數器值改變
let counter$: Subject<number>;
```

在命名上，我們習慣會在變數後面加上一個 `$` ，代表它是一個可被觀察的 (`observable`) 物件。

接著就可以將「開始新的計數器」按鈕事件變成一個 observable，並透過**訂閱** (`subscribe`)得知事件發生：

```typescript
// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  // 後面還有...
});
```

接下來就是一些簡單的初始化動作，包含

1. 重新建立 `counter$` 實體
2. 將 `counter` 歸零
3. 顯示狀態

```typescript
// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  counter$ = new Subject();
  counter = 0;

  statusLabel.innerHTML = '目前狀態：開始計數';
  
  // 後面還有...
});
```

有了 counter$ 後，我們就可以透過「訂閱」這個 observable 來得知計數值的變化，並進行後續動作，以目前的例子來說，就是顯示「目前計數值」及「偶數計數值」

```typescript
// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  counter$ = new Subject();
  counter = 0;

  status.innerHTML = '目前狀態：開始計數';
  
  // 訂閱 counter$ 並顯示目前計數值
  // 以下程式有優化的空間，先想想，之後來調整
  counter$.subscribe(data => {
    currentCounterLabel.innerHTML = `目前計數：${data}`;
    if (data % 2 == 0) {
      evenCounterLabel.innerHTML = `偶數計數：${data}`;
    }
  });
}
```

最後我們讓 `counter$` 這個 subject 送出新的「計數值事件」，讓畫面一開始就能顯示計數器內容為 0

```typescript
// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  counter$ = new Subject();
  counter = 0;

  status.innerHTML = '目前狀態：開始計數';
  
  // 訂閱 counter$ 並顯示目前計數值
  // 以下程式有優化的空間，先想想，之後來調整
  counter$.subscribe(data => {
    currentCounterLabel.innerHTML = `目前計數：${data}`;
    if (data % 2 == 0) {
      evenCounterLabel.innerHTML = `偶數計數：${data}`;
    }
  });
  
  // 送出預設值
  counter$.next(counter);
}
```

按按看「開始新的計數器」，就能看到目前狀態，以及預設的計數值。

{% asset_img 02.gif %}

這邊可以注意送出「計數值事件」和「訂閱計數值」的時機，如果先發生「計數值事件」，再「訂閱計數值」的話，會因為事件已經現送出過了，而沒有訂閱到第一次事件發生，因次「計數值事件」必須發生在「訂閱計數值」之後，才會正確處理。

{% note info %}

當然也是有辦法在「訂閱計數值」時處理**最近一次**的計數值事件，而不用等到下次發生事件發生才處理，在之後介紹各種 operators 時再來說明。

{% endnote %}

## 步驟 3：實作「計數」按鈕

基本顯示邏輯有了之後，就是實際處理「計數」按鈕啦！這部分就簡單很多，只需要將「計數」按鈕事件包裝成 observable 訂閱，並通知計數器產生變化即可！

```typescript
// 「計數」按鈕事件訂閱
fromEvent(countButton, 'click').subscribe(() => {
  counter$.next(++counter);
});
```

上面的程式碼我們先將 `counter` 的值加 1 之後，在使用 `counter$` 的 `next` 方法，讓所有 `counter$` 的訂閱得知資料被改變了。

此時畫面上就已經完成基本的計數功能啦！

{% asset_img 03.gif %}

接下來我們再繼續優化及完成剩下兩個按鈕。

## 步驟 4：偶數值判斷優化

每當計數值增加時，需要在畫面上顯示**目前的計數值**，還有**偶數計數值**兩個部分，在前面的程式中，我們單純的使用 `if` 條件式來判斷，但也可以將兩種顯示方式視為獨立的事件運作，也就是「目前計數值」改變是一個事件，「偶數計數值」改變也是一個事件，然後各自訂閱。

第一個訂閱顯示**目前計數值**：

```typescript
counter$.subscribe(data => {
  currentCounterLabel.innerHTML = `目前計數：${data}`;
});
```

第二個部分我們要自行再建立一個「偶數計數值」的計數器，它可以從「目前計數值」這個 observable 搭配 `filter` 這個 operator 來獲得一個新的 observable：

```typescript
const evenCounter$ = counter$.pipe(
  filter(data => data % 2 === 0)
)
```

此時的 `evenCounter$` 就是透過 `filter` 這個 operator 來建立的「新的 observable」，接著就可以訂閱這個 observable，來取得「偶數計數值」改變時的內容：

```typescript
evenCounter$.subscribe(data => {
  evenCounterLabel.innerHTML = `偶數計數：${data}`;
});
```

看起來好像比單純使用 `if` 判斷多一些程式碼，但這麼做的好處是「**關注點分離**」，也就是「目前計數值」和「偶數計數值」其實應該是兩個需要關注的部分，如果我們把這兩個邏輯透過單一個 observable 訂閱全部寫在一起，當程式碼越來越複雜時或需要擴充更多功能時，可讀性跟可維護性就會越來越差。

而分成兩個 observable 各自訂閱處理，就不需要去管別人的計數器內容，只需要**關注自己需要處理的範圍即可**。且未來若還要有「質數計數器」、「10 的倍數計數器」、「每 3 秒統計一次計數器」等各種需求時，都只要使用基礎的 observable 搭配各種 operators 來產生各自需要的 observable 來訂閱就好，**擴充能力**也會比單一個 observable 訂閱加上一堆 `if` 條件判斷還要高出非常多！

{% note info %}

這也是 ReactiveX 的重大好處之一，只要盡量都以 observable 的想法開始，通成比較容易可以設計出「好讀、好維護、好擴充」的程式碼，要達到這些目標還有更多好用的技巧，之後的文章我們再來一一介紹。

{% endnote %}

## 步驟 5：實作「發生錯誤」及「完成計數」按鈕

接下來的「發生錯誤」及「完成計數」按鈕就簡單多啦！它們剛好對應到 `counter$` 的 `error()` 和 `complete()` 兩個部分，因此我們在按鈕內把這兩個呼叫加上去就好。

```typescript
fromEvent(errorButton, 'click').subscribe(() => {
  const reason = prompt('請輸入錯誤訊息');
  counter$.error(reason || 'error');
});

fromEvent(completeButton, 'click').subscribe(() => {
  counter$.complete();
});
```

接著就回到原來 `counter$` 被「訂閱」的地方，加上錯誤處理的判斷就好囉

```typescript
// 這是原來處理計數的方法
// counter$.subscribe(data => {
//   currentCounterLabel.innerHTML = `目前計數：${data}`;
// });

// 這是加上 error 和 complete 處理的方法
counter$.subscribe({
  next: data => {
    currentCounterLabel.innerHTML = `目前計數：${data}`
  },
  error: message => {
    statusLabel.innerHTML = `目前狀態：錯誤 -> ${message}`
  },
  complete: () => {
    statusLabel.innerHTML = '目前狀態：完成'
  }
});
```

實際上，每個 observable 都是可以被多次訂閱的，每個訂閱可以有各自不同的處理方法，以上面的例子來說，也可以將 「顯示計數」和「顯示狀態」處理視為不同的關注點分開訂閱：

```typescript
// 原來方法維持，只處理「顯示計數」邏輯
counter$.subscribe(data => {
  currentCounterLabel.innerHTML = `目前計數：${data}`;
});

// 只處理「顯示狀態」邏輯
counter$.subscribe({
  next: () => {}, // 這行其實可以不加，因為我們目的只是處理「錯誤」跟「完成」，沒處裡「計數」
  error: message => {
    statusLabel.innerHTML = `目前狀態：錯誤 -> ${message}`;
  },
  complete: () => {
    statusLabel.innerHTML = '目前狀態：完成';
  }
});
```

{% note info %}

以上面的例子來說，若是關注點在於如何處理顯示，拆開來當然合理；而關注的點如果是 `counter$` 本身遇到各種情境的處理，拆開來反而就顯得太多了。「關注點」本身就帶有很大的討論空間，上面的程式單純是示範說明 observable 是可以重複訂閱各自處理的，實務上還是要依照情境來應用喔！

{% endnote %}

# 本日小結

今天的範例需求其實並不難，不使用 RxJS 也可以輕易辦到，但在實作過程中，我們可以發現透過 observable 的方式，能省去不少事件相關的處理；而搭配各種 operators，除了可以精簡一些程式碼邏輯外，只要搭配正確的觀念，還能讓我們容易寫出更加強健的程式碼。

RxJS 本身幫助我們處理了很多網頁上會遇到的資料來源，搭配 ReactiveX 規範的各種 operators，當寫習慣後，真的會寫上癮啦！

明天開始我們會花幾天時間說明 ReactiveX 背後運用的觀念及技術，讓我們未來能更輕易的駕馭 RxJS 巨獸！
