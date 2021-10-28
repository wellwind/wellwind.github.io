---
title: "[RxJS] 認識觀察者模式 - Observer Pattern"
date: 2020-09-21 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Observer Pattern
---

今天我們來認識 ReactiveX 的重要組成之一，也就是「觀察者模式 - Observer Pattern」。有學過物件導向程式設計的朋友應該都聽過設計模式 (Design Pattern)，而觀察者模式就是其中一種，也是蠻常見的一種，同時也是 ReactiveX 的主要核心，所以如果你還不知道什麼是觀察者模式，務必繼續看下去喔！

<!-- more -->

# 關於觀察者模式

以下文字摘取自[維基百科對於觀察者模式的介紹](https://zh.wikipedia.org/wiki/观察者模式)：

{% note info %}

**觀察者模式**是[軟體設計模式](https://zh.wikipedia.org/wiki/軟件設計模式)的一種。在此種模式中，一個目標物件管理所有相依於它的觀察者物件，並且在它本身的狀態改變時主動發出通知。這通常透過呼叫各觀察者所提供的方法來實現。此種模式通常被用來實時事件處理系統。

{% endnote %}

我個人認為這個模式最重要概念的是：「當我們要觀察一個資料的變化時，與其主動去關注它的狀態，不如**由觀察的目標主動告知我們資料變化**，可以更加即時且可靠的得知資料變化。」

## 觀察者模式解決的問題

我們在日常生活中有各種「觀察」的現象存在，例如看看某個 Youtuber 有沒有新的影片上線，走在路上要注意紅綠燈的狀態等等，許多都是「主動」觀察的行為，然而這樣的觀察並不一定這麼方便且即時。

以 Youtuber 上架新影片為例，如果我們想在第一時間就知道某個 Youtuber 上架了新影片，就必須不斷、定時的重新整理某個頁面，才能看到有沒有新的影片上架，想當然這種「被動」的方法並不是一個方便且即時的方式。

{% asset_img 01.jpg %}

而有在使用 Youtube 平台的應該都知道有個「開啟小鈴鐺」功能，這個功能可以在新影片上架時「主動」的通知我們，隨著現在瀏覽器、APP 的「通知」功能越來越完善，要即時收到第一手資訊也變得越來越容易！

{% asset_img 02.jpg %}

這就是觀察者模式想要達到的境界，同樣是「觀察」，由被觀察目標主動通知效率好多了！

## 觀察者模式定義的角色

下圖一樣來自維基百科

{% asset_img 03.png %}

基本上只有兩個角色，每個角色有各自的方法需要實作：

- **觀察者 (Observer)**
    - `notify`： 當目標資料變更，會呼叫觀察者的 notify 方法，告知資料變更了
- **目標 (Subject)**
    - `notifyObservers`：用來通知所有目前的觀察者資料變更了，也就是呼叫所有觀察者物件的 `notify` 方法
    - `addObserver`：將某個物件加入觀察者清單
    - `deleteObserver`：將某個物件從觀察者清單中移除

# 使用 JavaScript 實作觀察者模式

接著我們以「影片上架通知」功能作為範例，實際上用 JavaScript 實作看看。

實作程式碼：https://stackblitz.com/edit/mastering-rxjs-06-observer-pattern-video-notify-demo

## 實作觀察者 (Observer)

假設現在有兩個人想要知道影片上架了，也就是這兩個人都是所謂的「觀察者」，每個觀察者必須實作 `notify` 方法，用來接受新影片的通知

```typescript
// 觀察者 A
const observerA = {
  notify: id => {
    console.log(`我是觀察者 A，我收到影片 ${id} 上架通知了`);
  }
};

// 觀察者 B
const observerB = {
  notify: id => {
    console.log(`我是觀察者 B，我收到影片 ${id} 上架通知了`);
  }
};
```

## 實作目標 (Subject)

接著實作要觀察的「目標」，這個目標要負責管理所有的觀察者，並且在需要的時候通知它們

```typescript
const youtuberSubject = {
  // 存放所有的觀察者，也就是開啟通知的使用者
  observers: [],
  // 通知所有觀察者新影片上架了
  notifyObservers: id => {
    // 列舉出每個觀察者，並進行通知動作
    youtuberSubject.observers.forEach(observer => {
      observer.notify(id);
    });
  },
  // 加入新的觀察者，也就是有新使用者開啟通知了
  addObserver: observer => {
    youtuberSubject.observers.push(observer);
  },
  // 將某個觀察者移除，也就是某個使用者關閉通知了
  deleteObserver: observer => {
    youtuberSubject.observers = youtuberSubject.observers.filter(
      obs => obs !== observer
    );
  }
};
```

## 實際執行看看

有了「觀察者」和「目標」後，我們就可以實際看看雙方互動的結果啦！

首先在沒有任何觀察者進行觀察的情況，上架一個新影片：

```typescript
// 影片 1 上架，此時還沒有觀察者
youtuberSubject.notifyObservers(1);
// 輸出結果：
// (沒有任何輸出)
```

想當然，因為現在沒人開啟通知，因此也不會有人收到通知。

接著加入一個觀察者，然後上架新影片：

```typescript
// 加入觀察者 A，也就是觀察者 A 開啟通知了
youtuberSubject.addObserver(observerA);
// 影片 2 上架，此時觀察者 A 會收到通知
youtuberSubject.notifyObservers(2);
// 輸出結果：
// 我是觀察者 A，我收到影片 2 上架通知了
```

有了一個觀察者後，當新影片上架，自然就會收到通知啦！

如果有兩個觀察者呢？

```typescript
// 加入觀察者 B，也就是觀察者 B 開啟通知了
youtuberSubject.addObserver(observerB);
// 影片 3 上架，此時觀察者 A 跟 B 都會收到通知
youtuberSubject.notifyObservers(3);
// 輸出結果：
// 我是觀察者 A，我收到影片 3 上架通知了
// 我是觀察者 B，我收到影片 3 上架通知了
```

當然是兩個觀察者都會收到通知啦，而這兩個觀察者收到通知後，就可以依照自己的喜好來決定如何繼續處理這段影片，這也是一種「關注點分離」的實現，同樣收到新影片 A 跟 B 想做的事情可能截然不同，如果硬要寫在一起，程式碼肯定也會越來越複雜，而拆開後只要各做的事情就好囉。

最後我們移除一個觀察者看看：

```typescript
// 移除觀察者 B，也就是觀察者 B 關閉通知了
youtuberSubject.deleteObserver(observerB);
// 影片 4 上架，此時只剩下觀察者 A 會收到通知
youtuberSubject.notifyObservers(4);
// 輸出結果：
// 我是觀察者 A，我收到影片 4 上架通知了
```

可以看到，適當的使用觀察者模式對於未來程式的維護性會高很多，當影片上架需要做額外的事情時，只要增加一個觀察者，讓新的觀察者來做就好，若某件事情不需要做了，也只需要將做這件事情的觀察者移除，被觀察的目標完全不用修改任何程式碼！

# ReactiveX 與觀察者模式

還記得昨天文章我們講到 ReactiveX 將任何事情都視為**串流 (Stream)** 嗎？在今天的例子應該不難看出串流的影子，這個通知功能就是一條串流，將每次影片上架的消息「流」到每個觀察者中。

因此除了任何事情都是串流外，我們也會將每一條串流都視為**「可被觀察的」(Observable)**，所以在使用 ReactiveX 時，我們會常常聽到：

- 這個物件是一個 observable
- 這裡是將資料轉換成另外一個 observable
- 這裡要訂閱一個 observable
- 這個 observable 在這裡結束了
- ...

Observable 這個名詞會非常大量的被使用，而有了**觀察者模式**的概念後，未來在使用 ReactiveX 設計程式時，就不會搞不清楚這個名詞囉！

# 隨堂測驗 - 使用 RxJS 實作影片通知功能

看到這裡，再回顧一下之前「快速上手 RxJS」的文章，應該也不難發現 RxJS 基礎的使用方式就是觀察者模式的延伸：

- 每個被觀察的目標就是 RxJS 的 `Subject` 物件
- 觀察目標中的 `addObserver` 就是 RxJS 的 `subscribe` 方法，都是把「觀察者」加入清單內
- `deleteObserver` 就是訂閱 (subscribe) 後拿到 Subscription 物件的 `unsubscribe` 方法
- 觀察者實作的 `notify` 方法就是 RxJS 中提到 Observer 的 `next()` 方法 (負責接收通知)
- 觀察目標實作的 `notifyObservers` 就是每個 Subject 的 `next()` 方法 (負責送出通知)
- 除了 `next()` 通知處理之外，ReactiveX 還另外定義了 `error()` 和 `complete()` 方便我們另外處理錯誤和完成兩種類型的通知。

因此今天的隨堂測驗就是：「請嘗試使用 RxJS 完成今天練習的影片上架通知功能」。

相信有了這些共通的觀念，要完成一樣的功能應該不難才對，明天我們再來公佈解答。

# 本日小結

今天我們學習到了觀察者模式的基本概念，也嘗試用實際的程式碼感受了一下這個模式的方便之處，觀察者模式在許多地方都有大量的被應用到；而 ReactiveX 就是以觀察者模式為基礎設計的，因此也不難看到許多共通的影子。

有了觀察者模式的基本觀念後，在使用 RxJS 開發網頁應用程式時也會更加得心應手，至少會知道自己在做什麼！

最後我們出了一道題目，目的是有觀察者模式的觀念後，再用同樣觀念實際感受看看 RxJS 的觀察者模式應用，明天我們再來解答做法囉。
