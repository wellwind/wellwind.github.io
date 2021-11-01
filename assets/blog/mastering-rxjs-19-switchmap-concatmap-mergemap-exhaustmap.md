---
title: "[RxJS] 轉換類型 Operators (2) - switchMap / concatMap / mergeMap / exhaustMap"
date: 2020-10-04 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - switchMap
  - concatMap
  - mergeMap
  - exhaustMap
---

今天介紹幾個使用頻率非常高、功能非常類似，又有很大差別的轉換類型 operators：`switchMap` / `concatMap` / `mergeMap` / `exhaustMap`。

前一天介紹的轉換類型 operators 都是將 Observable 傳進來的事件值換成另外一個值，而今天介紹的類型都是將傳進來的值換成另外一個 Observable 資料流。什麼意思呢？繼續看下去就知道囉。

<!-- more -->

# 轉換成 Observable 的難題

舉個例子來說，當假如有一個功能是抓取 API 的資料，且在每次點擊「重新整理按鈕」時，都要重新抓取 API 資訊，我們可以設計兩個 Observable：

```typescript
// 重新整理資料流
const refresh$ = fromEvent(document.querySelector('#refresh'), 'click');

// 抓 API 的資料流
const request$ = ajax('https://api.github.com/repos/reactivex/rxjs/issues')
  .pipe(map(response => response.response));
```

此時我們會先訂閱 `refresh$` 來取得每次滑鼠點擊的事件，接著在每次事件發生時，訂閱 `resuest$` 抓取 API 資料來更新畫面：

```typescript
refresh$.subscribe(() => {
  request$.subscribe(result => {
		// 更新畫面資訊
    ...
  });
})
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-19-nested-subscribe-problem

看到問題了嗎？巢狀的 `subscribe` 發生了！為了避免巢狀 `subscribe` 發生，我們需要一些 operator 來將資料換成另外一個 Observable，並且幫我們完成訂閱動作！

# switchMap

`switchMap` 內是一個 `project` function 傳入的參數為前一個 Observable 的事件值，同時必須回傳一個 Observable；因此可以幫助我們把來源事件值換成另外一個 Observable，而 `switchMap` 收到這個 Observable 後會幫我們進行訂閱的動作，再把訂閱結果當作新的事件值。

```
source$ ------ 1--  ----- 3--  ----- 5-------|
project = (i) = i*10--i*10|

click$.pipe(switchMap(project))

        ------10--10-----30--30-----50--50---|
               ^ source$ 發出事件 1，轉換成 10--10|
                          ^ source$ 發出事件 3，轉換成 30--30|
                                     ^ source$ 發出事件 5，轉換成 50--50|
```

`switchMap` 還有另外一個重點，就是「切換」(switch)的概念，當來源 Observable 有新的事件時，如果上一次轉換的 Observable 還沒完成，會退訂上一次的資料流，並改用新的 Observable 資料流，例如：

```typescript
interval(3000).pipe(
  switchMap(() => timer(0, 1000))
).subscribe(data => {
  console.log(data);
});
// 0
// 1
// 2
// 0 (新事件發生，退訂上一個 Observable)
// 1
// 2
// ...
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-switchmap-02

來源 Observable (`interval(0, 3000)`) 每次有新事件發生時，會產生新的 Observable (`timer(0, 1000)`)，如果上一次 Observable 沒有完成，會被退訂閱掉，「切換」成新的 Observable。因此每次都只會產生 `0, 1, 2` 的循環。

直接畫張彈珠圖來理解看看：

{% asset_img 01-switch-map.jpg %}

每次事件發生時，都會被換成另一個 Observable 並且訂閱它，同時上一個 Observable 如果還沒完成，會把它退訂掉。

當我們需要關注在「新事件產生的新資料流，過去的資料流不再重要時」，就可以考慮使用 `switchMap` 囉。

用開頭提到重新抓 API 資料的例子，資料流就會變成：

```
refresh$: -----c-----c-----c-----|
request$: ---x|

refresh$.pipe(switchMap(data => request$))
         --------x-----x-----x-|
              ^ 第 1 次按下重新整理的時間點
                 ^ 經過一段時間後取得資料
                    ^ 第 2 次按下重新整理的時間點
                       ^ 經過一段時間後取得資料
```

程式碼如下：

```typescript
// 用 switchMap 換成其他另一個 Observable
refresh$.pipe(
  switchMap(data => request$)
).subscribe(result => {
	// 更新畫面資料
  ...
});
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-switchmap-01

如此一來就可以避開巢狀的訂閱啦！假如還有其他資料整理等邏輯，也可以繼續寫在 pipe 裡面：

```typescript
// 用 switchMap 換成其他另一個 Observable
refresh$.pipe(
  switchMap(data => request$),
  map(.....),
  map(.....)
).subscribe(result => {
	// 更新畫面資料
  ...
});
```

整個資料流就會變得平整好理解囉！

{% note info %}

一般來說在像是 API 呼叫這種通常需要最新結果的情境，非常適合使用 `switchMap`。

{% endnote %}

# concatMap

`concatMap` 一樣在每次事件發生時都會產生新的 Observable，不過 `concatMap` 會等前面的 Observable 結束後，才會「接續」(concat)新產生的 Observable 資料流。

```typescript
interval(3000).pipe(
  concatMap(() => timer(0, 1000))
).subscribe(data => {
  console.log(data);
});
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// (不會結束...）
```

上面的程式碼中，由於 `concatMap` 轉換了一個沒有結束機會的 Observable，因此來源 Observable (`interval(3000)`) 雖然持續有新事件，但卻因為上一次的 Observable 沒有發生而無法繼續。

在使用 `concatMap` 時，轉換後的 Observable 基本上都必須設定結束條件，也就是要確保會完成 (complete)，否則很容易就會產生不可預期的問題(就是一直不會結束...)。

```typescript
const source1$ = interval(3000);
const source2$ = timer(0, 1000).pipe(take(5));

source1$.pipe(
  concatMap(() => source2$)
).subscribe(data => {
  console.log(data);
});
// 0
// 1
// 2
// 3
// 4
// 0
// 1
// ...
```

彈珠圖：

```
source1$ -----0-----1-----2-----3.....
source2$ -0-1-2-3-4|

source1$.pipe(concatMap(() => source2$))

         -------0-1-2-3-4-0-1-2-3-4-0-1-2-3-4-0-1-2-3-4
                ^ source1$ 的事件 0，換成 source2$ 資料流
                    ^ source1$ 的事件 1，但上一次資料流還沒結束，等待中
                        ^ source1$ 事件 0 轉換的資料流結束，開始新的資料流
```

當每個資料流都非常重要不可取消，且必須照著順序執行時，使用 `concatMap` 就對了！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-concatmap

彈珠圖：

{% asset_img 02-concat-map.jpg %}

# mergeMap

`mergeMap` 會把所有被轉換成的 Observable 「合併」(merge)到同一條資料流內，因此會有平行處理的概念，也就是每此轉換的 Observable 都會直接訂閱，不會退訂上一次的 Observable，也不會等待上一次的 Observable 結束，因此任何目前存在中的 Observable 資料流有新事件，都會被轉換成整體資料流的事件，`mergeMap` 

```typescript
const source1$ = timer(0, 3000);
const getSource2 = (input) => timer(0, 1500)
  .pipe(map(data => `資料流 ${input}: ${data}`));

source1$.pipe(
  mergeMap(data => getSource2(data))
).subscribe(result => {
  console.log(result);
});
// 資料流 0: 0
// 資料流 0: 1
// 資料流 1: 0 (新事件，新資料流)
// 資料流 0: 2
// 資料流 1: 1
// 資料流 0: 3
// 資料流 2: 0 (新事件，新資料流)
// 資料流 1: 2
// 資料流 0: 4
// 資料流 1: 3
// 資料流 2: 1

```

文字版彈珠圖不太容易表達，直接畫張彈珠圖：

{% asset_img 03-merge-map.jpg %}

可以看到在轉換的 Observable 結束前，都會即時的得到每個 Observable 產生的事件喔。

`mergeMap` 很適合用來顯示一些即時的訊息，例如聊天室功能，每當一個新的使用者加入聊天室，原始 Observable 就會有新的事件，在使用 `mergeMap` 轉換成這個使用者的最新訊息，如此一來不管哪個使用者輸入新的聊天訊息，都會即時的呈現囉！

不過也要注意的是，如果像是文章開頭提到「重新整理」的例子來說，第一次按下按鈕時呼叫 API 時，若還沒有資料回傳，在按下一次按鈕時，會同時有兩個 API 請求呼叫，此時因為網路不一定會照請求順序回傳的關係，有可能反而造成舊資料蓋掉新資料的問題，因為順序是不可控制的。

# exhaustMap

`exhaust` 有「力竭」的意思，可以把它理解成，來源 Observable 有新事件發生時，它是沒有力氣產生新的 Observable 的；也就是說當來源事件發生時，如果上一次轉換的 Observable 尚未結束，就不會產生新的 Observable。

讓我們直接用彈珠圖來解釋：

{% asset_img 04-exhaust-map.jpg %}

當來源事件 `2` 發生時，由於上一次轉換後的 Observable 還沒結束，因此新的 Observable 不會進行訂閱，直接忽略掉；當來源事件 `3` 發生時，由於之前的 Observable 都結束了，因此新的 Observable 會進行訂閱。

若以文章開始提到「重新整理」的功能來說，當按下按鈕時會去抓 API 資料，此時若是再按一次按鈕，使用 `exhaustMap` 的話，就可以在 API 資料回來(Observable 結束)前避免產生重複的 API 請求囉！

# 本日小結

`switchMap` / `concatMap` / `mergeMap` / `exhaustMap` 的功能都是「將來源 Observable 的事件值轉換成另外一個 Observable 資料流」，我們可以透過這點來避免巢狀訂閱的問題發生。它們針對「來源 Observable 有新事件時」處理方式不同，如下：

- `switchMap`：「切換」的概念，退訂閱上次未完成的資料流，訂閱新的資料流；若有新事件時過去的資料就不重要了，可以使用此 operator。
- `mergeMap`：上次資料流若未完成，不會退訂閱，且繼續訂閱新的資料流；若資料流順序相對不重要，可以使用此 operator，整體效率會比較快。
- `concatMap`：持續等到上次資料流完成，才繼續訂閱新的資料流；若執行順序非常重要，可以使用此 opereator；不過要注意每次轉換的 Observable 都需要有完成，否則永遠不會進入下一個 Observable。
- `exhaustMap`：若上次資料流未完成，則忽略訂閱這次的資料流；若希望避免產生太多資料流，可以考慮使用此 operator。

今天提到的這幾個 operators 都非常實用，實務上用到的機會也不低，但對許多新手來說卻常常搞混使用方式，多半是因為直接照抄前人的程式碼，而忽略了去理解每個 operator 的使用情境，導致誤用，因此請務必多花點時間理解今天講到的 operators 喔！

# 相關資源

- [Operators - switchMap](https://rxjs-dev.firebaseapp.com/api/operators/switchMap)
- [Operators - concatMap](https://rxjs-dev.firebaseapp.com/api/operators/concatMap)
- [Operators - mergeMap](https://rxjs-dev.firebaseapp.com/api/operators/mergeMap)
- [Operators - exhaustMap](https://rxjs-dev.firebaseapp.com/api/operators/exhaustMap)
