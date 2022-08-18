---
title: "[RxJS] 建立 Observable 的基礎 - Observable / Subject / BehaviorSubject / ReplaySubject / AsyncSubject"
date: 2020-09-27 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Observable
  - Subject
  - BehaviorSubject
  - ReplaySubject
  - AsyncSubject
---

今天我們來介紹一下幾種最基本建立 observable 的方式。

<!-- more -->

# Observable

`Observable` 是 RxJS 中建立串流最基本的方式之一，我們可以透過 `Observable` 類別來建立一個「可被觀察的」物件，我們會在這個物件內先寫好整個資料流的流程，以便未來訂閱 (subscribe) 時可以依照這資料流程進行處理：

## 建立 Observable

因為 `Observable` 是一個類別，所以最簡單的建立方式自然是直接 `new` 它：

```typescript
import { Observable } from 'rxjs';
const source$ = new Observable();
```

{% note info %}

另外一種建立方式是 `Observable.create()` 不過這種方式在 RxJS 6 之後已被標示為棄用，在這裡提出來純粹是說明，以免未來接手別人舊程式時有用到看不懂。

{% endnote %}

## 建立資料流

使用 `Observable` 建立資料流時，可以傳入一個 callback function，function 內只有一個物件參數，我們稱為訂閱者 (Subscriber)，這個訂閱者就是處理資料流程的人，也就是負責呼叫 `next()`、`complete()`和 `error()` 的物件，我們可以透過這個物件先設計好資料流的流程，例如發送 1、2、3、4 然後結束：

```typescript
const source$ = new Observable(subscriber => {
  console.log('stream 開始');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.next(4);
  console.log('stream 結束');
  subscriber.complete();
});
```

## 訂閱 Observable

有了這個資料流後，就可以開始進行訂閱啦！

```typescript
source$.subscribe({
  next: data => console.log(`Observable 第一次訂閱: ${data}`),
  complete:() => console.log('第一次訂閱完成')
});
```

之後就會看到如下圖結果：

{% asset_img 01.jpg %}

每次訂閱發生時，就會呼叫 `new Observable()` 內的 callback function，以上面的例子來說，這樣的呼叫是**同步**的，也就是發生兩次訂閱時，會依序等前一次訂閱全部執行完畢才會執行下一次訂閱，例如：

```typescript
source$.subscribe({
  next: data => console.log(`Observable 第一次訂閱: ${data}`),
  complete:() => console.log('第一次訂閱完成')
});
source$.subscribe({
  next: data => console.log(`Observable 第二次訂閱: ${data}`),
  complete:() => console.log('第二次訂閱完成')
});
```

實際上的執行順序是第一次訂閱全部跑完，才跑第二次訂閱：

{% asset_img 02.jpg %}

{% note warning %}

許多新手 (包含過去的我自己) 會聽說 RxJS 很適合用來處理非同步，就認為所有 Observable 都是非同步執行的，實際上並不是這麼一回事，上面的例子已經說明的很清楚了。

{% endnote %}

那麼有沒有辦法讓它已非同步執行呢？非常簡單，只要在一個非同步方法內呼叫 `next()` 即可：

```typescript
const source$ = new Observable(subscriber => {
  console.log('stream 開始');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
    console.log('stream 結束');
  });
});
```

此時原來的訂閱例子執行結果為：

{% asset_img 03.jpg %}

1、2、3 發出後，4 和 complete 放到 `setTimeout()` 內變成非同步執行，因此會在兩次訂閱都收到 1、2 和 3 後，才會收到 4 和完成；另外要小心的是，使用非同步處理時， `complete()` 一定也會是非同步，而且要想辦法在整個非同步處理程式中最後呼叫，以免提早結束而收不到後續 `next()` 的資料。

`Observable` 非常適合在有**固定資料流程**的情境，先把流程建立好，之後每次訂閱都會照這個流程走囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-observable

# Subject

`Subject` 系列繼承了 `Observable` 類別，並給予了更多不同的特性，因此我們會說 `Subject` 也是一種 `Observable`；而 `Subject` 與 `Observable` 有兩個明顯不同的地方：

1. `Observable` 在建立物件同時就決定好資料流向了，而 `Subject` 是在產生物件後才決定資料的流向。
2.  `Observable` 每個訂閱者都會得到獨立的資料流，又稱為 unicast；而 `Subject` 則是每次事件發生時就會同步傳遞給所有訂閱者 (Observer)，又稱為 multicast。

由於 `Subject` 是在產生物件後才決定資料流向，因此比較適合在程式互動過程中動態決定資料流向，也就是 `Subjct` 建立好後，將這個 `Subject` 物件傳出去，讓其它程式來透過呼叫該物件的 `next()` 等方法來決定資料流向。

另外，同樣是訂閱，`Subject` 的訂閱與 Observer 的關係是一對多的，而 `Observable` 的訂閱與 Observer 則是一對一關係。

{% note info %}

關於這兩種的差別與關係，我們明天會再更詳細的說明

{% endnote %}

接著讓我們用之前就學過最基礎的 `Subject` 為例。

## Subject

參考以下程式碼：

```typescript
const source$ = new Subject();

source$.subscribe(data => console.log(`Subject 第一次訂閱: ${data}`));
  
source$.next(1);
source$.next(2);
```

由於 `Subject` 是在產生後才決定資料流，因此需要先訂閱，才收得到資料流事件，上述程式執行結果如下：

{% asset_img 04.jpg %}

之後再加上更多事件及訂閱：

```typescript
source$.subscribe(data => console.log(`Subject 第二次訂閱: ${data}`));

source$.next(3);
source$.next(4);

source$.subscribe(data => console.log(`Subject 第三次訂閱: ${data}`));

source$.complete();
```

最終結果如下：

{% asset_img 05.jpg %}

可以看到每次訂閱後，都會在有新的事件時才會收到新事件的資料。每次訂閱都識直接訂閱這條執行中的資料流，這就是跟 `Observable` 最大不同的地方。

關於這種特性，我們會在明天的 **Cold Observable v.s Hot Observable** 說明。

程式碼：https://stackblitz.com/edit/mastering-rxjs-subject

## BehaviorSubject

`Subject` 產生的物件在訂閱時若沒有事件發生，會一直收不到資料，如果希望在一開始訂閱時會先收到一個預設值，且有事件發生後才訂閱的行為也可以收到最近一次發生過的事件資料，則可以使用 `BehaviorSubject`：

```typescript
const source$ = new BehaviorSubject(0);

source$.subscribe(data => console.log(`BehaviorSubject 第一次訂閱: ${data}`));
// BehaviorSubject 第一次訂閱: 0
```

在 `new BehaviorSubject()` 時必須給予一個參數做為預設值，上面程式我們給 `0` 當作預設值，因此建立後在還沒任何訂閱時即可收到一次預設值資料。

當持續有事件發生時，當然會繼續收到資料：

```typescript
source$.next(1);
source$.next(2);
```

執行結果如下：

{% asset_img 06.jpg %}

此時若有一個新的訂閱進來呢？

```typescript
source$.subscribe(data => console.log(`BehaviorSubject 第二次訂閱: ${data}`));
```

這時候會立刻收到「最近一次發生過的事件資料」：

{% asset_img 07.jpg %}

`BehaviorSubject` 產生的物件，有一個 `value` 屬性，可以得知前面提到的「最近一次事件的資料」：

```typescript
source$.next(3);
source$.next(4);

console.log(`目前 BehaviorSubject 的內容為: ${source$.value}`);
```

這時的結果如下圖：

{% asset_img 08.jpg %}

對於需要保留最近一次資料狀態的情境來說，BehaviorSubject 就非常好用囉！

程式碼：https://stackblitz.com/edit/mastering-rxjs-behavior-subject

## ReplaySubject

`ReplaySubject` 有「重播」的意思，`ReplaySubject` 會幫我們保留最近 N 次的事件資料，並在訂閱時重播這些發生過的事件資料給訂閱者，跟 BehaviorSubject 類似，都有 cache 的概念，只是更有彈性。

```typescript
// 設定「重播」最近 3 次資料給訂閱者
const source$ = new ReplaySubject(3);

source$.subscribe(data => console.log(`ReplaySubject 第一次訂閱: ${data}`));
  
source$.next(1);
source$.next(2);

source$.subscribe(data => console.log(`ReplaySubject 第二次訂閱: ${data}`));
```

結果如下：

{% asset_img 09.jpg %}

第二次訂閱後還沒有任何事件發生，此時單純是靠 `ReplaySubject` 把最近三次的資料重播，但目前只有兩次事件，所以只會收到兩次事件的資料；當事件繼續發生超過三次時，這時再訂閱就會收到完整 cache 的最近三次資料囉。

```typescript
source$.next(3);
source$.next(4);

source$.subscribe(data => console.log(`ReplaySubject 第三次訂閱: ${data}`));
```

執行結果如下：

{% asset_img 10.jpg %}

程式碼：https://stackblitz.com/edit/mastering-rxjs-replay-subject

## AsyncSubject

`AsyncSubject` 比較特殊一點，當 `AsyncSubject` 物件被建立後，過程中發生任何事件都不會收到資料，直到 `complete()` 被呼叫後，才會收到「最後一次事件資料」，例如以下程式：

```typescript
const source$ = new AsyncSubject();

source$.subscribe(data => console.log(`AsyncSubject 第一次訂閱: ${data}`));
  
source$.next(1);
source$.next(2);

source$.subscribe(data => console.log(`AsyncSubject 第二次訂閱: ${data}`));

source$.next(3);
source$.next(4);

source$.subscribe(data => console.log(`AsyncSubject 第三次訂閱: ${data}`));

source$.complete();
```

執行結果為：

{% asset_img 11.jpg %}

如果用彈珠圖來理解的話，原來發送 `next()` 的過程可能是這樣：

```
----1----2----3----4----|
```

而實際訂閱時，收到的資料變成：

```
-----------------------(4|)
```

如果希望訂閱的 Observer 只關注在結束前的最後資料就好，可以考慮使用 `AsyncSubject`。

程式碼：https://stackblitz.com/edit/mastering-rxjs-async-subject

## 共用 API - asObservable

所有的 `Subject` 系列都有一個共用且常用的 API，稱為 `asObservable`，它的用途是將 `Subject` 當作 `Observable` 回傳，這樣有什麼好處呢？由於 `Observable` 並沒有 `next()`、`complete()` 和 `error()` 這樣的 API，因此可以讓得到這個 `Observable` 物件的程式專注在資料流訂閱相關的處理就好，而不被允許發送新的事件，就可以將發送新事件等行為封裝起來不被外界看到啦！

以下程式簡單說明了 `asObservable` 的使用情境：

```typescript
class Student {
  private _score$ = new Subject();

  get score$() {
    return this._score$.asObservable();
  }

  updateScore(score) {
    // 大於 60 分才允許推送成績事件
    if(score > 60){
      this._score$.next(score);
    }
  }
}

const mike = new Student();

mike.score$.subscribe(score => {
  console.log(`目前成績：${score}`);
});

mike.updateScore(70); // 目前成績: 70
mike.updateScore(50); // (沒有任何反應)
mike.updateScore(80); // 目前成績: 80
mike.score$.next(50); // (錯誤：next is not a function)
```

透過 `asObservable` 我們就可以把資料流傳出去，又能不讓產生新事件囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-as-observable

# 本日小結

今天我們介紹了幾種基本的建立 Observable 的方法，這些方法各有不同的使用情境，可以針對需要的情況使用。

`Subject` 系列類別繼承了 `Observable` 類別，並給予更多的彈性，同時 `Subject` 和 `Observable` 對於觀察者 (Observer) 的處理方式也有所不同，這部分我們在明天的文章再來介紹 Cold Observable 和 Hot Observable 的區別。

# 相關資源

- [Observable](https://rxjs-dev.firebaseapp.com/api/index/class/Observable)
- [Subject](https://rxjs-dev.firebaseapp.com/api/index/class/Subject)
- [BehaviorSubject](https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject)
- [ReplaySubject](https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject)
- [AsyncSubject](https://rxjs-dev.firebaseapp.com/api/index/class/AsyncSubject)
