---
title: "[RxJS] 建立類型 Operators (2) - from / fromEvent / fromEventPattern / interval / timer / defer"
date: 2020-09-30 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - from
  - fromEvent
  - fromEventPattern
  - interval
  - timer
  - defer
---

今天我們來介紹更多建立類型的 operators，分別是 fromXXXX 系列，和一些跟時間操作有關的 operators。

<!-- more -->

實作範例程式碼：https://stackblitz.com/edit/mastering-rxjs-15-creation-operators-02

# from

`from` 算是使用機會不低的 operator，它可以接受的參數類型包含陣列、可疊代的物件 (iterable)、Promise 和「其他 Observable 實作」 等等，`from` 會根據傳遞進來的參數決定要如何建立一個新的 Observable。

## 傳遞陣列當參數

```typescript
import { from } from 'rxjs';

from([1, 2, 3, 4]).subscribe(data => {
  console.log(`from 示範 (1): ${data}`);
});
// from 示範 (1): 1
// from 示範 (1): 2
// from 示範 (1): 3
// from 示範 (1): 4
```

跟前一天介紹的 `of` 非常的像，差別在只是 `from` 會將陣列內的內容一個一個傳遞給訂閱的觀察者。

彈珠圖：

```
(1234|)
```

## 傳遞可迭代的物件當參數

在之前的文章中我們介紹過 Iterator Pattern，JavaScript 原生也支援讓 `for` 語法等支援的迭代器寫法，只要支援疊代器的物件，也可以直接傳入 `from` 中，結果和傳入一般的陣列相同，把陣列中所有的內容作為事件傳遞給訂閱的觀察者。

```typescript
// 使用 generator 建立 iterable
function* range(start, end) {
  for(let i = start; i <= end; ++i){
    yield i;
  }
}

from(range(1, 4)).subscribe(data => {
  console.log(`from 示範 (2): ${data}`);
});
// from 示範 (2): 1
// from 示範 (2): 2
// from 示範 (2): 3
// from 示範 (2): 4
```

我們可以輕易地依照自己的規則來撰寫 generator，或使用其它套件時，若該套件回傳的資料支援，就能輕易地透過 `from` 轉成 Observable。

## 傳遞 Promise 當參數

Promise 是前端處理非同步最常見的手段，如 fetch API 本身也是回傳一個 Promise 物件，有了 `from` 我們也能輕易將一個 Promise 物件建立為新的 Observable:

```typescript
// 傳入 Promise 當參數
from(Promise.resolve(1)).subscribe(data => {
  console.log(`from 示範 (3): ${data}`);
});
// from 示範 (3): 1
```

許多 JavaScript 的非同步 API，或網路上的套件並不會特地回傳 Observable，但回傳 Promise 已經是非常常見了，我自己在使用這些 API 時，基本上都是二話不說用 `from` 包起來，好處是未來可以統一都使用 `pipe` 來調整或組合其他 Observable，也可以統一使用 `subscribe` 來得到資料，一致性會更高！

當然，此時的 Observable 也會是非同步的囉。

## 傳遞 Observable 當參數

`from` 也可以把一個 Observable 當作參數，此時 `from` 會幫我們訂閱裡面的資料，重新組成新的 Observable：

```typescript
from(of(1, 2, 3, 4)).subscribe(data => {
  console.log(`from 示範 (4): ${data}`)
});
// from 示範 (4): 1
// from 示範 (4): 2
// from 示範 (4): 3
// from 示範 (4): 4
```

其實 Observable 觀念本身也是 [ECMAScript 一個尚未推出規範](https://github.com/tc39/proposal-observable)，因此也有一些套件根據此規範進行實作(RxJS 也是其中之一)，只要這些實作也是用一樣的 `subscribe` 方法，都可以透過 `from` 包成 RxJS 的 Observable，享用 RxJS 豐富的 operators。

目前瀏覽器基本上也還沒實作 Observable 這功能(畢竟尚未正式推出)，但若未來推出了，瀏覽器也我們也能將原生的 Observable 包裝成 RxJS 的 Observable，然後透過 `pipe` 享受各種便利的 operators 啦！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-from

# fromEvent

`fromEvent` 是能將瀏覽器事件包裝成 Observable，參數有兩個：

- target：實際上要監聽事件的 DOM 元素
- eventName：事件名稱

使用方式也很簡單：

```typescript
fromEvent(document, 'click').subscribe(data => {
  console.log('fromEvent 示範: 滑鼠事件觸發了');
});
```

瀏覽器上許多的事件本身也就是一種資料流的概念，把它們包裝成 Observable 也是剛剛好而已啦！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-fromevent

# fromEventPattern

`fromEventPattern` 可以根據自訂的邏輯決定事件發生，只要我們將邏輯寫好就好；`fromEventPattern` 需要傳入兩個參數：

- addHandler：當 subscribe 時，呼叫此方法決定如何處理事件邏輯
- removeHandler：當 unsubscribe 時，呼叫次方法將原來的事件邏輯取消

`addHandler` 和 ` removeHandler` 都是一個 function，串入一個 handler 物件，這個物件其實就是一個被用來呼叫的方法，直接看例子：

```typescript
const addClickHandler = (handler) => {
  console.log('fromEventPattern 示範: 自定義註冊滑鼠事件')
  document.addEventListener('click', event => handler(event));
}

const removeClickHandler = (handler) => {
  console.log('fromEventPattern 示範: 自定義取消滑鼠事件')
  document.removeEventListener('click', handler);
};
 
const source$ = fromEventPattern(
  addClickHandler,
  removeClickHandler
);
  
const subscription = source$
  .subscribe(event => console.log('fromEventPattern 示範: 滑鼠事件發生了', event));

setTimeout(() => {
  subscription.unsubscribe();
}, 3000);
```

上面程式中，我們宣告了兩個 function，並傳入 `handler` 參數， 這兩個 function 可以透過這個 handler (其實就是個 callback function) 來決定事件發生處理時要呼叫它，或以它為依據來取消事件。

之後使用 `fromEventPattern` 傳入這兩個 function，來完成一個 Observable；當訂閱 (subscribe) 產生時，會產生 `handler` 並呼叫 `addClickHandler`，這裡面的程式則是註冊 document 的 click，並在事件發生時呼叫 `handler` callback function。

接著三秒後呼叫 `unsubscribe` 來取消訂閱，此時就會呼叫 `removeClickHandler` 處理取消事件監聽的行為。

以上面的例子來說其實用 `fromEvent` 就可以解決了，但當我們有比較複雜的監聽事件及取消事件邏輯時，就可以使用 `fromEventPattern` 囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-fromeventpattern

# interval

`interval` 會依照的參數設定的時間 (毫秒) 來建議 Observable，當被訂閱時，就會每隔一段指定的時間發生一次資料流，資料流的值就是為事件是第幾次發生的 (從 0 開始)，以下程式建立一個每一秒發生一次的資料流：

```typescript
interval(1000).subscribe(data => console.log(`interval 示範: ${data}`));
```

在取消訂閱前，事件都會持續發生，因此彈珠圖看起來像這樣：

```typescript
----0----1----2----3----.......
```

當然我們可以在一段時間後把它取消訂閱來結束 Observable：

```typescript
const subscription = interval(1000)
  .subscribe(data => console.log(`interval 示範: ${data}`));

setTimeout(() => {
  subscription.unsubscribe();
}, 5500);
```

彈珠圖：

```typescript
----0----1----2----3----4--|
```

當然還可以搭配更多的 operators 來協助我們取消訂閱，之後再慢慢來節紹。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-interval

# timer

`timer` 跟 `interval` 有點類似，但它多一個參數，用來設定經過多久時間後開始依照指定的間隔時間計時。

以下範例會在 3000 毫秒後開始以每 1000 毫秒一個新事件的頻率計時：

```typescript
timer(3000, 1000)
  .subscribe(data => console.log(`timer 示範 (1): ${data}`));
// timer 示範 (1): 0
// timer 示範 (1): 1
// timer 示範 (1): 2
// timer 示範 (1): 3
// ....
```

彈珠圖：

```
--------------------0-----1-----2--......
＾ 經過 3000 毫秒
```

`interval` 有個小缺點，就是一開始一定會先等待一個指定時間，才會發生第一個事件，但有時候我們會希望一開始就發生事件，這個問題可以透過 `timer` 解決，只要等待時間設為 `0` 即可：

```typescript
timer(0, 10000).subscribe(data => console.log(`timer 示範: ${data}`));
```

彈珠圖：

```
0----1----2----3----......
```

還有一個重點，`timer` 如果沒有設定第二個參數，代表在指定的時間發生第一次事件後，就不會再發生任何事件了。

```typescript
timer(3000).subscribe(data => {
  console.log(`timer 示範 (2): ${data}`);
});
// timer 示範 (2): 0
```

彈珠圖：

```
--------------------0|
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-timer

# defer

`defer` 會將建立 Observable 的邏輯包裝起來，提供更一致的使用感覺，使用 `defer` 時需要傳入一個 factroy function 當作參數，這個 function 裡面需要回傳一個 Observable (或 Promise 也行)，當 `defer` 建立的 Observable 被訂閱時，會呼叫這個 factroy function，並以裡面回傳的 Observer 當作資料流：

```typescript
const factory = () => of(1, 2, 3);
const source$ = defer(factory);
source$.subscribe(data => console.log(`defer 示範: ${data}`));
```

`source$` 每次被訂閱時才會去呼叫裡面 factroy function，這麼做的好處是建立 Observable 的邏輯被包裝起來了，同時也可以達成**延遲執行的目標**。

以上面的程式碼，其實不使用 `defer` 也沒什麼問題：

```typescript
const factory = () => of(1, 2, 3);
factory().subscribe(data => console.log(`defer 示範: ${data}`));
```

那麼為什麼還要用 `defer` 呢？如同剛才所說的，有一個很重要的目標是「延遲執行」，如果今天產生 Observable 的邏輯希望在「訂閱」時才去執行的話，就很適合使用 `defer`，最常見的例子應該非 `Promise` 莫屬了！`Promise` 雖然是非同步執行程式，但在 Promise 產生的一瞬間相關程式就已經在運作了：

```typescript
const p = new Promise((resolve) => {
  console.log('Promise 內被執行了');
  setTimeout(() => {
    resolve(100);
  }, 1000);
});
// Promise 內被執行了
// (就算還沒呼叫 .then，程式依然會被執行)

p.then(result => {
  console.log(`Promise 處理結果: ${result}`);
});
```

就算用 `from` 包起來變成 Observable，已經執行的程式依然已經被執行了，呼叫 `.then()` 不過是再把 `resolve()` 的結果拿出來而已；在設計 Observable 時如果可以延遲執行，直到被訂閱時才真的去執行相關邏輯，通常會比較好釐清整個流程，此時 `defer` 就可以幫我們達到這個目標：

```typescript
// 將 Promise 包成起來
// 因此在此 function 被呼叫前，都不會執行 Promise 內的程式
const promiseFactory = () => new Promise((resolve) => {
  console.log('Promise 內被執行了');
  setTimeout(() => {
    resolve(100);
  }, 1000);
});
const deferSource$ = defer(promiseFactory);
// 此時 Promise 內程式依然不會被呼叫
console.log('示範用 defer 解決 Promise 的問題:');
// 直到被訂閱了，才會呼叫裡面的 Promise 內的程式
deferSource$.subscribe(result => {
  console.log(`Promise 結果: ${result}`)
});
```

可以看到用了 `defer`，整體了運作順序就非常流暢囉！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-defer

# 本日小結

這兩天我們把幾個常用的「建立類型」的 operators 給介紹了一輪，透過這些 operators 可以幫助我們快速建立各種類型的 Observable，下一篇文章我們來介紹一下同樣是「建立」，但多加了「組合」功能的一些 operators。

- `from`：使用陣列、Promoise、Observable 等來源建立新的 Observable。
- `fromEvent`：封裝 DOM 的 `addEventListener` 事件處理來建立 Observable。
- `fromEvenPattern`：可依照自行定義的事件來建立 Observable。
- `interval`：每隔指定的時間發出一次事件值。
- `timer`：與 `interval` 相同，但可以設定起始的等待時間。
- `defer`：用來延遲執行內部的 Observable。

# 相關資源

- [Operator - from](https://rxjs-dev.firebaseapp.com/api/index/function/from)
- [Operator - fromEvent](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent)
- [Operator - fromEventPattern](https://rxjs-dev.firebaseapp.com/api/index/function/fromEventPattern)
- [Operator - interval](https://rxjs-dev.firebaseapp.com/api/index/function/interval)
- [Operator - timer](https://rxjs-dev.firebaseapp.com/api/index/function/timer)
- [Operator - defer](https://rxjs-dev.firebaseapp.com/api/index/function/defer)
