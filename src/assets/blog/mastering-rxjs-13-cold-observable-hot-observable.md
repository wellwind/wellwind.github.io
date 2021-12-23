---
title: "[RxJS] Cold Observable v.s Hot Observable"
date: 2020-09-28 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Observable
  - Subject
  - Cold Observable
  - Hot Observable
---

昨天我們介紹了 `Observable` 和 `Subject` 系列兩種不同的建立資料流物件的方法，也稍微說明了訂閱時會發生的不同，今天讓我們用比較專有的名詞：Cold Observable 和 Hot Observable 來說明這兩種的差別。從運作的方式去了解，能更幫助我們在開發時更加掌握技術的使用方式！

<!-- more -->

今天的實作程式碼：https://stackblitz.com/edit/mastering-rxjs-13-warm-observable

# Cold Observable

先來回顧一下 `Observable` 類別建立及使用方式：

```typescript
const source$ = new Observable(subscriber => {
  console.log('stream 開始');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.next(4);
  console.log('steam 結束');
  subscriber.complete();
});
 
source$.subscribe(data => console.log(`Observable 第一次訂閱: ${data}`));
// 1, 2, 3, 4
source$.subscribe(data => console.log(`Observable 第二次訂閱: ${data}`));
// 1, 2, 3, 4
```

對於每次訂閱來說，都是一次新的資料流產生；我們可以把整個資料流當作是一條**水管管線設計圖**，每次訂閱時，都是依照這條管線組裝出新的水管線路，然後裝水打開開關讓水流出，這樣的好處是**每次訂閱都是新資料流的所以不會互相影響**。

{% asset_img 01.jpg %}

這種每次訂閱都重新開始的流程，稱為 「**Cold Observable**」。Cold 通常代表被用到時才啟動的行為，在這裡也是如此，說明了這個 Observable 被訂閱時才會開始啟動新的資料流。

以一般的觀察者模式的行為來說，每次事件的發生都是「推送」給觀察者 (Observer) 的；而 Cold Observable 每次訂閱後就只會有一個觀察者，下一個觀察者要進行訂閱時會是一次新的資料流程，因此 Cold Observable 與 observer 是「**一對一**」的關係，這種只會推給唯一一個觀察者的方式也稱為 「**unicast**」。

{% note info %}

先預告一下，下一篇開始我們會介紹各種建立資料流 的 operators，這類 operators 基本上都是屬於 Cold Observable，我們到時候再來看看。

{% endnote %}

# Hot Observable

Subject 系列產生出來的資料流都是屬於 Hot Observable，一樣的先來回顧 Subject 的使用方式：

```typescript
const source$ = new Subject();

source$.subscribe(data => console.log(`Subject 第一次訂閱: ${data}`));
// 1, 2, 3, 4
  
source$.next(1);
source$.next(2);

source$.subscribe(data => console.log(`Subject 第二次訂閱: ${data}`));
// 3, 4

source$.next(3);
source$.next(4);

source$.subscribe(data => console.log(`Subject 第三次訂閱: ${data}`));
// (沒收到任何事件就結束了)
source$.complete();
```

一樣當作水管管線來看的話，`Subject` 就是一條隨時可能有資料流過的線路，每次訂閱都只是等待這條水管線路傳送資料過來而已，而這樣的好處是更有彈性，因為不用事先就把所有流程準備好，可以隨時依照不同情境在程式內讓新的事件發生 (只要呼叫 `next()` 就好)，所有的觀察者都會及時收到這份資料。

{% asset_img 02.jpg %}

這種資料流已經開始，隨時訂閱就是等待最新資料的流程，就稱為 「**Hot Observerable**」。Hot 本身就有隨時準備好的意思，因此每次訂閱時不用從頭來過，只關注最新事件即可。

由於只會有一個 Observable，在每次事件發生時都會推送給所有的 observer，因此 Hot Observable 與 Observer 的關係是「**一對多**」的關係，又稱為 「**multicast**」。

# Warm Observable

有沒有辦法把 Cold Observable 轉成 Hot Observable 呢？嚴格來說並沒有，因為 Cold Observable 一定要有個「啟動」的動作才會開始資料流，而 Hot Observable 在被建立同時就是啟動的狀態了。但是我們可以透過一些 Multicast 類的 operators 來達到類似目標，例如 `share()`：

```typescript
const source$ = new Observable(subscriber => {
  console.log('stream 開始');
  setTimeout(() => subscriber.next(1), 100);
  setTimeout(() => subscriber.next(2), 200);
  setTimeout(() => subscriber.next(3), 300);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
    console.log('steam 結束');
  }, 400);
});

const hotSource$ = source$.pipe(
  share()
);

setTimeout(() => {
  hotSource$.subscribe(data => console.log(`Observable 第一次訂閱: ${data}`));

  setTimeout(() => {
    hotSource$.subscribe(data => console.log(`Observable 第二次訂閱: ${data}`));
  }, 200);
}, 1000);
```

上述程式我們先透過 `setTimeout()` 讓整個 stream 傳遞比較有明顯的時間順序：

```
---1---2---3---(4|)
```

之後透過 `share()` operator 讓整個 Observable 變成 multicast 的 Observable，這時候整個資料流還沒開始，必須有「第一次訂閱」的動作，才會開始提供資料。由於必須要先有一次「訂閱」的動作讓它啟動，所以也稱為 **<u>Warm Observable</u>**。

在程式中我們先等待一秒鐘才開始訂閱，可以藉此看到在這段時間不會印出「stream 開始」的文字，直到第一次訂閱印出。第二次訂閱則刻意再慢一點進行訂閱，已確認收到的資料並不會從頭開始。

整個執行結果如下：

{% asset_img 03.jpg %}

有些時候我們會先設計好一個 Cold Observable，但又不希望每次訂閱時都要重新來過 (例如 HTTP 請求、WebSocket 等)，就很適合把 unicast 轉成 multicast 類型的 Observable！

關於更多 multicast 類型的 operators，在之後的文章我們再來節紹。

# 本日小結

今天我們介紹了 Cold Observable 與 Hot Observable 的不同與應用情境，以及如何把 Cold Observable 轉換成類似 Hot Observable 的 Warm Observable。

- **Cold Observable**：在每次訂閱時，完整的資料流會重新產生；資料流與訂閱者是一對一的關係。
- **Hot Observable**：在訂閱前資料流已開始，每個訂閱者訂閱的都是同一個資料流；資料流與訂閱者是一對多的關係。
- **Warm Observable**：在第一次訂閱開始前不會啟動資料流，直到第一次訂閱發生啟動，所有觀察者都是訂閱同一個資料流；資料流與訂閱者是一對多關係。

這些概念在需要更深入資料流程時就會非常重要，也能讓我們比較容易知道何時該使用什麼樣類型的 Observable。之後的文章我們會有機會再多說明一些。

明天開始就是各種 operators 的介紹啦！敬請期待！



