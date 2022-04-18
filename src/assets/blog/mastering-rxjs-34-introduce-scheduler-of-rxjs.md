---
title: "[RxJS] 認識 Scheduler"
date: 2020-10-19 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Scheduler
  - ObserveOn
  - SubscribeOn
---

今天我們來認識一下 RxJS 的 Scheduler，雖然在一般使用 RxJS 開發應用程式時幾乎不會用到 Scheduler，但 Scheduler 可以說是控制 RxJS 至關重要的角色，偶爾也有可能會需要使用 Scheduler 來調整事件發生時機！

到底什麼是 Scheduler？就讓我們繼續看下去吧！

<!-- more -->

# 快速認識 Scheduler

Schedule 這個單字本身有「安排」的意思，因此 Scheduler 可以想像成是「負責安排」的人，具體來說安排什麼呢？就是安排 Observable 內「事件」該如何發生的時機點。

舉個例子來說，請思考一下以下程式會以什麼樣的順序印出資料？

```typescript
console.log('start');
of(1, 2, 3)
  .subscribe({
    next: result => console.log(result),
    complete: () => console.log('complete')
  });
console.log('end');
```

應該不難判斷，由於 `of(1, 2, 3)` 事件是「同步執行」的，因此結果為：

```
start
1
2
3
complete
end
```

那麼有沒有辦法讓 `of(1, 2, 3)` 變成「非同步執行」呢？當然是有的，我們可以在 `of` 參數的最後放上一個 Scheduler 來安排資料處理的順序，以下範例透過 `asyncScheduler` 來幫助我們將 `of(1, 2, 3)` 的資料變成非同步執行的程式：

```typescript
import { asyncScheduler, of } from 'rxjs';

console.log('start');
of(1, 2, 3, asyncScheduler)
  .subscribe({
    next: result => console.log(result),
    complete: () => console.log('complete')
  });
console.log('end');
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-make-observable-async

此時因為 `of(1, 2, 3)` 是非同步執行的，結果就變成：

```typescript
start
end
1
2
3
complete
```

很簡單吧！透過 Scheduler 可以幫助我們快速的將同步程式切換成非同步程式，當然實際上不只這樣而已，還有許多 Scheduler 的使用技巧，但在介紹更多內容之前，先讓我們簡單(?)理解一下非同步處理的核心邏輯。

# 認識 JavaScript 處理非同步的原理

我們都知道可以使用 `Promise` 或 `setTimeout` 讓一段程式變成非同步執行，那麼以下程式印出的結果為何？

```typescript
setTimeout(() => {
  console.log('A');
});
Promise.resolve('B')
  .then(result => console.log(result));
```

既然都變成非同步了，理論上應該先變成非同步先處理吧，所以應該是先印出 `A` 再印出 `B` 嗎？很可惜的不是，答案是先印出 `B` 再印出 `A`，為什麼會這樣呢？這跟 JavaScript 的非同步處理方式有關。

## 認識 Microtask 與 Macrotask

首先，我們必須先知道的是當 JavaScript 開始執行一段程式時，會產生一個「工作階段 (task)」，並「同步」的執行相關的程式碼，而當遇到 `Promise` 或 `setTimeout` 這類非同步呼叫時，會先將裡面的程式碼丟到一個「等待區 (task queue)」，然後繼續處理其他同步的程式碼，直到目前同步的程式碼處理完後，再從「等待區」將程式碼拿出來以「同步」的方式執行裡面的程式碼

由於等待區是一個佇列 (queue) 的資料結構，佇列的特色就是先進先出，因此先進入等待區的程式會先被執行，以下兩段非同步程式呼叫執行後會先印出 `A` 再印出 `B`：

```typescript
Promise.resolve('A')
  .then(result => console.log(result));

Promise.resolve('B')
  .then(result => console.log(result));
```

那麼為什麼稍早的程式中 `setTimeout` 執行順序跟我們想的不一樣呢？這是因為所謂的「等待區」在 JavaScript 處理中其實會有兩種：

- M**i**crotask queue：如 `Promise` 或 node.js 中的 `process.nextTick`，都會丟到 microtask queue 中。
- M**a**crotask queue：如 `setTimeout` 或 `requestAnimationFrame`，都會丟到 marcotask queue 中。

{% noteinfo %}

差一個字母就差很多

{% endnote %}

JavaScript 在同步執行完畢時，會先將所有的 microtask queue 中的程式執行完畢，確認清空 microtask queue 的工作後，再處理下一個 macrotask queue 中的工作，也因此同時有 `Promise` 和 `setTimeout()` 呼叫時，`promise` 會進入 microtask queue 而 `setTimeout` 則進入 macrotask queue，所以 `Promise` 的程式會先進行處理，之後才處理 `setTimeout` 的程式。

## 影片支援

為什麼要切成這樣呢？中間有不少原因，還會牽扯到另一個大主題「event loop」，但這些不是今天的主題，因此就不花篇幅介紹了，有興趣可以看看以下影片 (有中文字幕)：

{% youtube 8aGhZQkoFbQ %}

大方向是，在 macrotask queue 的每個工作結束前，會先清空目前 microtask queue 中的所有工作，之後才會進行畫面渲染，接著處理下一個 macrotask queue 中的工作，因此 macrotask queue 會作用在每次畫面渲染的前後，microtask 則不是。

現在我們只要知道非同步運作有一個粒度小的 microtask 以及一個粒度大的 macrotask ，以及畫面渲染時機的不同，就足以幫助我們更加理解 RxJS 的 Scheduler 囉。

# 再次認識 Scheduler

接著我們再來仔細認識一下 RxJS 的 Scheduler 到底是什麼，Scheduler 實際上就是用來幫助我們決定程式要「同步」或是「非同步」執行的一個角色；在同步執行時，我們可以用來確保不同的 「同步 Observable」事件會在一致的時間點 (frame) 觸發；而在非同步執行時，則可以用來控制使用 microtask 還是 macrotask 處理事件。

從文字來看稍微有點抽象，之後我們會有更多程式碼解釋。

## Scheduler 的種類

Scheduler 依照運作邏輯分成以下幾類：

- `null`：也就是不指定 Scheduler，那們就是同步執行的。
- `queueScheduler`：也是同步處理的，但在執行時 RxJS 會將所有同步的 Observable 資料放到 queue 內，再依序執行，稍後我們會說明這和 `null` 有什麼區別。
- `asapScheduler`：非同步處理，與使用 `Promise` 一樣的非同步處理層級，也就是使用 microtask
- `asyncScheduler`：非同步處理，處理方式同 `setIntervael` ，屬於 macrotask 層級
- `animationFrameScheduler`：非同步處理，處理方式同 `requestAnimationFrame`，也是屬於 macrotask 層級，但更適用於動畫處理 (效能較優)

# 建立類型 Operators 使用 Scheduler

在建立類型的 operators 如 `of`、`from` 和 `timer` 等，都可以在最後一個參數指定要使用哪個 Scheduler 如：

```typescript
of(1, 2, 3, asyncScheduler);
```

此時 operator 會幫我們將每個事件值用指定的處理方式來安排事件發生，以下舉個例子來說明不同 Scheduler 執行的結果。

{% asset_img 01.jpg %}

畫面中有一個紅色方塊，我們將示範使用不同的 Scheduler 來移動這個方塊，並看看執行過果，成式碼如下：

```typescript
const initPosition = () => {
  const blockElement = document.querySelector("#block") as HTMLElement;
  blockElement.style.left = "100px";
  blockElement.style.top = "100px";
};

const updatePositionByScheduler = (scheduler: SchedulerLike) => {
  initPosition();

  setTimeout(() => {
    console.log("start");

    range(0, 100, scheduler).subscribe({
      next: val => {
        const blockElement = document.querySelector("#block") as HTMLElement;
        blockElement.style.left = 100 + val + "px";
        blockElement.style.top = 100 + val + "px";
      },
      complete: () => console.log("complete")
    });
    console.log("end");
  }, 300);
};

fromEvent(document.querySelector("#goNull"), "click").subscribe(() => {
  updatePositionByScheduler(null);
});

fromEvent(document.querySelector("#goQueue"), "click").subscribe(() => {
  updatePositionByScheduler(queueScheduler);
});

fromEvent(document.querySelector("#goAsap"), "click").subscribe(() => {
  updatePositionByScheduler(asapScheduler);
});

fromEvent(document.querySelector("#goAsync"), "click").subscribe(() => {
  updatePositionByScheduler(asyncScheduler);
});

fromEvent(document.querySelector("#goAnimationFrame"), "click").subscribe(
  () => {
    updatePositionByScheduler(animationFrameScheduler);
  }
);
```

`updatePositionByScheduler` 負責根據指定的 Scheduler 來移動紅色方塊，在程式開始時，先呼叫 `initPosition` 重置紅色方塊的起始位置，接著依照不同的 Scheduler 依序產生一個 0~99 數值，並訂閱此 Observable 來更新畫面。

程式碼已經放在 StackBlitz 上：

https://stackblitz.com/edit/mastering-rxjs-schedulers

可以嘗試按按看每個按鈕，並比較一下畫面更新的方式以及 `console.log` 輸出的順序，以下簡單說明一下執行結果：

## 使用 null

由於 `range()` 本身是同步執行的，因此會在一個工作階段 (task) 中全部跑完，可以直接用同步執行的思維去想就好，輸出結果為：

```
start
complete
end
```

由於執行完才會渲染畫面，因此紅色框框會從左上角立刻出現在右下角。

{% asset_img 02.jpg %}

## 使用 queueScheduler

使用 `queueScheduler` 時，資料依然是「同步執行」的，因此結果與使用 `null` 完全一樣，但在一個同步工作階段中，會再使用 queue 將資料包裝起來處理； `queueScheduler` 做這件事情的目的是什麼？我們在後續說明。

{% asset_img 03.jpg %}

## 使用 asapScheduler

`asapScheduler` 會將每次 Observable 事件值都用「非同步」的方式處理，因此執行順序為：

```
start
end
complete -> 因為是非同步執行 
```

`asapScheduler` 的非同步行為會進入 microtask，而再 microtask 階段是不會處理畫面渲染的，因此畫面中的紅色方塊雖然會「非同步的」被更新座標，但會在最後「直接出現在右下角」。

{% asset_img 04.jpg %}

## 使用 asyncScheduler

`asyncScheduler` 也會將每次 Observable 事件值使用「非同步」的方式處理，所以執行順序一樣是：

```
start
end
complete
```

不過 `asyncScheduler` 是使用 macrotask 處理非同步呼叫，而畫面渲染行為會發生在每次 macrotask 結束之間，因此每次 Observable 的事件跟事件發生之間會產生畫面渲染，結果就是可以看到紅色方塊往右下角移動的動畫。

{% asset_img 05.jpg %}

## 使用 animationFrameScheduler

`animationFrameScheduler` 觸發的時機點和畫面重繪 (repaint) 定義的時機點一樣，就跟我們使用 JavaScript 的 `requestAnimationFrame` 一樣，基本上是 1/60 秒發生一次，使用 `requestAnimationFrame` 的時機通常是使用 JavaScript 處理動畫，可以避免使用 `setTimeout((), 1)` 運算太頻繁，但畫面跟新頻率不需要這麼高的問題。

由於是非同步執行，因此執行結果與前面相同，但可以看到畫面上的紅色方塊以比較慢的速度移動，原則上會是每 1/60 移動一次。

{% asset_img 06.jpg %}

## 不同建立類型 Operators 預設的 Scheduler

以下是可以在最後一個參數設定 Scheduler 的建立類型 operators：

- `bindCallback`
- `bindNodeCallback`
- `combineLatest`
- `concat`
- `empty`
- `from`
- `fromPromise`
- `interval`
- `merge`
- `of`
- `range`
- `throw`
- `timer`

建立類型的 operators 有部分會有預設 operator，尤其是跟時間控制有關的，例如 `interval` 的方法簽章如下：

```
interval(period: number = 0, scheduler: SchedulerLike = async): Observable<number>
```

可以看到是使用 `asyncScheduler`，而有些則沒有預設 scheduler，那麼就依照該 operator 預設的邏輯來決定同步或非同步，例如 `of` 預設的 Scheduler 是 `null`，因此是同步處理，而 `timer` 預設也是使用 `asyncScheduler`。

## 使用 scheduled operator 避免 of 和 from 模糊不清

另外還有一個重點 `of` 和 `from` 裡面的參數是不固定的，因此直接將 Scheduler 放在最後會相對不容易理解，也會有「無法將 Scheduler 物件本身當作事件值發送」的問題，因此 RxJS 還有一個建立類型 Operator - `scheduled` 來處理這個問題。

`scheduled` 只能放兩個參數，第一個參數是資料，如果有多筆則使用陣列處理；第二個參數則是要使用哪個 Scheduler。因此以下程式不建議使用：

```typescript
of(1, 2, asyncScheduler);
```

建議改使用

```typescript
scheduled([1, 2], asyncScheduler);
```

# 使用 Scheduler 控制來源 Observable

除了在建立類型 operators 最後參數加上 Scheduler 外，如果想控制一個來源 Observable 發生的時機點，可以使用 `observerOn` 這個 operator，依照 Scheduler 來控制收到事件的時機點，如：

```typescript
console.log('start');
of(1, 2)
  .pipe(observeOn(asyncScheduler))
  .subscribe({
    next: result => console.log(result),
    complete: () => console.log('complete')
  });
console.log('end');
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-observeon

由於我們將來源事件用非同步的方式接收處理，因此 `start` 和 `end` 會先印出，然後才依序印出 `1` 、`2` 和 `complete`。

需要特別注意的是 `of(1, 2)` 依然是「同步處理」行為，只是在訂閱時透過 `observeOn(asyncScheduler)` 將收到的資料放到 macrotask 內，因此以下兩段程式碼處理行為完全不同：

```typescript
// (1)
of(1, 2, asyncScheduler);
// 注意：此用法已被標示棄用，這裡純粹拿來比較用
// 實際上建議寫成 scheduled([1, 2], asyncScheduler)
// (2)
of(1, 2).pipe(observeOn(asyncScheduler));
```

第一段程式碼是把「每一個值分別放入 macrotaask 中」。

{% asset_img 07.jpg %}

第二段程式碼則是「產生 1 和 2 後，再將這兩個資料放入 macrotask 中」。

{% asset_img 08.jpg %}

這個觀念非常重要！如果搞錯，很可能整個執行順序都跟想的不同了。

# 使用 Scheduler 控制訂閱時機

 `observeOn` 可以用來控制「處理來源 Observable 事件的時機」，而我們也可以用 `subscribeOn` 來控制「訂閱來源 Observable 的時機」，以下程式一樣是非同步執行的。

```typescript
console.log('start');
of(1, 2)
  .pipe(subscribeOn(asyncScheduler))
  .subscribe({
    next: result => console.log(result),
    complete: () => console.log('complete')
  });
console.log('end');
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-subscribeon

執行結果：

```
start
end
1
2
complete
```

一樣的，別忘記 `of(1, 2)` 本身依然是「同步執行」程式喔！

# null 與 queueScheduler 的差別

最後，我們回到「同步」程式，看看使用 `null` 與使用 `queueScheduler` 到底有什麼不同，先想想看以下程式會如何執行：

```typescript
const sourceA$ = of(1, 2);
const sourceB$ = of(3, 4);

combineLatest([sourceA$, sourceB$])
  .pipe(map(([a, b]) => a + b))
  .subscribe(result => {
    console.log(result);
  });
```

我們已經知道 `combineLatest` 會訂閱參數內的 Observables，當每個 Observables 發生事件時，將這個時與其他的 Observables 「最後一次事件組合在一起」，所以理論上過程如下：

- `sourceA$` 發生事件 `1`，此時 `sourceB$` 還沒有任何事件發生
- `sourceB$` 發生事件 `3`，此時跟 `sourceA$` 最後一次事件值 `1` 組合在一起，得到 `3 + 1 = 4`
- `sourceA$` 發生事件 `2`，此時跟 `sourceB$` 最後一次事件值 `3` 組合在一起，得到 `2 + 3 = 5`
- `sourceB$` 發生事件 `4`，此時跟 `sourceA$` 最後一次事件值 `2` 組合在一起，得到 `4 + 2 = 6`
- `sourceA$` 結束
- `sourceB$` 結束

因此印出的值應該是 `4` 、`5` 和 `6`，實際上是這樣嗎？很可惜，實際結果是：只印出 `5` 和 `6`！怎麼會這樣呢？

## 不使用 scheduler 的同步執行順序

別忘記了 `of` 是「同步執行」的，因此在使用 `combineLatest` 分別訂閱兩個 Observable 時，實際上會變成類似以下程式碼的執行順序：

```typescript
const sourceA$ = of(1, 2);
const sourceB$ = of(3, 4);
sourceA$.subscribe(...);
sourceB$.subscribe(...);
```

看出問題了嗎？因為「同步執行」的關係，在訂閱 `sourceA$` 時會先同步產生 `1` 和 `2` 事件後結束；接著才是訂閱 `sourceB$` 同步產生 `3` 和 `4` 事件然後結束，因此正確運作過程為：

- `sourceA$` 發生事件 `1`，此時 `sourceB$` 還沒有任何事件發生
- `sourceA$` 發生事件 `2`，此時 `sourceB$` 還沒有任何事件發生
- `sourceA$` 結束
- `sourceB$` 發生事件 `3`，此時跟 `sourceA$` 最後一次事件值 `2` 組合在一起，得到 `3 + 2 = 5`
- `sourceB$` 發生事件 `4`，此時跟 `sourceA$` 會後一次事件值 `2` 組合在一起，得到 `4 + 2 = 6`
- `sourceB$` 結束

{% asset_img 09.jpg %}

以上過程都是「同步執行」的，也就是在一個執行階段 (task) 內依序完成。

因此結果只印出 `5` 和 `6` 啦！那麼要怎麼達到我們預期的 `4`、`5` 和 `6` 的結果呢？這時候就是使用 `queueScheduler` 的時機了。

## 使用 queueScheduler 的執行順序

`queueScheduler` 一樣是同步處理的，但在產生資料時，會將資料存入一個佇列 (queue) 內，每個 Observable 都會有自己的 queue，而 queue 除了佇列本身概念外，也可以想像成是一個「虛擬的時間窗格 (frame)」，因此當訂閱發生時，整個資料流就會依照這個 queue 內的虛擬時間窗格「一格一格的產生事件」。

因此上述的 `sourceA$` 和 `sourceB$` 若是使用了 `queueScheduler`，則 `sourceA$` 的事件 `1` 和 `sourceB$` 的事件 `2` 就會同時產生，而要達到這個目的，`combineLatest` 也必須將資料用「時間窗格」的方式訂閱。

{% asset_img 10.jpg %}

最終的程式碼為：

```typescript
const sourceA$ = scheduled([1, 2], queueScheduler);
const sourceB$ = scheduled([3, 4], queueScheduler);

combineLatest([sourceA$, sourceB$])
  .pipe(
    subscribeOn(queueScheduler),
    map(([a, b]) => a + b)
  )
  .subscribe(result => {
    console.log(result);
  });
```

程式碼：

https://stackblitz.com/edit/mastering-rxjs-queuescheduler?file=index.ts

有了這些 Scheduler，控制時間就更容易啦！

# 本日小結

今天我們學習了 JavaScript 處理非同步程式的基礎原理，以及 RxJS 如何使用這些原理來設計出各種的 Scheduler，幫助我們「安排」事件發生的時機點！

- `queueScheduler`：同步處理事件，但有個虛擬的時間窗格概念
- `asapScheduler`：非同步處理事件，使用 microtask，如 `Promise`
- `asyncScheduler`：非同步處理事件，使用 macrotask，如 `setTimeout`
- `animationFrameScheduler`：非同步處理事件，使用 macrotask，背後處理雷同 `requestAnimationFrame`，通常主要用於動畫處理

另外我們也可以使用 `observeOn` 控制事件來源處理時機點，以及使用 `subscribeOn` 處理訂閱事件時機點。

雖然一般開發應用程式時，不太會使用到 Scheduler 控制，但當遇到時，就不怕不知道如何是好囉！

# 相關資源

- [RxJS Scheduler 文件](https://rxjs-dev.firebaseapp.com/guide/scheduler)
- [Operators - scheduled](https://rxjs-dev.firebaseapp.com/api/index/function/scheduled)
- [Operators - ObserveOn](https://rxjs-dev.firebaseapp.com/api/operators/observeOn)
- [Operators - SubscribeOn](https://rxjs-dev.firebaseapp.com/api/operators/subscribeOn)

