---
title: "[RxJS] 三步驟快速上手 RxJS"
date: 2020-09-18 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Stream
  - Observable
  - Operators
---

昨天我們學會了如何開始將專案加入 RxJS，今天讓我們從頭開始，認識一下基本的 RxJS 起手式吧！

<!-- more -->

# RxJS 超簡單三步驟

{% asset_img 01.jpg %}

上圖示 ReactiveX 網站的介紹，要使用 ReactiveX 相關的套件 (以本系列文章來說就是 RxJS) 只有三個步驟：

1. **Create**: 建立一個新的資料流或事件流，稱為 stream，在 ReactiveX 中也稱為「可觀察的物件」(之後我們會統稱 **Observable**)。
2. **Combine**: 透過操作符 (之後我們會統稱 **Operator/Operators**) 的使用和組合，來轉換來源 Observable。
3. **Listen**: 監聽，在 Reactive 中也稱為**訂閱 (subscribe)**，也就是訂閱這個資料流，已進行取得資料後續要做的事情。

在上一篇文章建立一個 RxJS 專案後，其實就已經包含這三個步驟了，接下來我們來快速看一下每個步驟的一些基本知識及使用方式。

## 建立新的 Observable

要建立一個新的 Observable 基本上分成兩種方式，第一種是自己從頭開始建立新的資料流，第二種則是透過現有的資料或事件來建立。

而大多數建立 Observable 的 API 都在 `rxjs` 這個 namespace 裡並遵循 ES6 的模組化方式管理，例如要使用上篇文章 `fromEvent`，則可以透過以下語法：

```typescript
import { fromEvent } from 'rxjs';
```

### 自己從頭開始建立新的 Observable

在 ReactiveX 的定義中，我們把它稱為 **Subject**；中文翻譯叫做「目標」，從意義上也很容易可以看出來他是一個「可觀察的 (observable)」。

這個 Subject 預設會有三個方法，分別是：

- `next`：用來觸發新的事件資料，呼叫 `next` 並傳入新的事件資訊後，在訂閱步驟就會知道有新事件發生了。
- `error`：只有第一次呼叫會在訂閱步驟觸發，當整個流程發生錯誤時，可以呼叫 `error` 並傳入錯誤資訊，用來告知錯誤內容，同時整個 Observable 就算是結束了。
- `complete`：只有第一次呼叫會在訂閱步驟觸發，當整個 Observable 結束時，用來通知已經結束了，由於是單純的結束了，`complete()` 方法不用帶入任何參數。

在 RxJS 內有一個 `Subject` 的類別，可以幫助我們從頭開始建立一個新的 Observable：

```typescript
import { Subject } from 'rxjs';

const source = new Subject();
source.next('hello');
source.next('world');

if(...) {
   source.error('error message');
}

source.complete();
```

當我們在訂閱步驟時，就會針對這三個方法呼叫時寫出對應的處理程式，這也是觀察者模式 (Observer Pattern) 的基礎。

{% note info %}

對於觀察者模式不熟悉也沒關係，我們會在後面的文章說明。

{% endnote %}

除了基本的 Subject 外，ReactiveX 也定義了幾種加強型的 Subject，我們之後再來好好介紹跟比較。

### 透過現有的資料或事件來建立 Observable

從頭自己建立當然是比較麻煩，所以 RxJS 還提供許多方式來將現有的資料或事件作為來源，包裝成新的 Observable；以上篇文章處理 document 的 click 作為例子來說，如果我們要自己使用 `Subject` 來開始建立新的 Observable 那會是多麼麻煩的事情：

```typescript
import { Subject } from 'rxjs';

const source = new Subject();
document.addEventListener('click', (event) => {
  source.next(event);
});
```

而 RxJS 因應這點提供了 `fromEvent` 方法，協助我們直接處理這些細節：

```typescript
import { fromEvent } from 'rxjs';
const source = fromEvent(document, 'click');
```

看起來是不是簡單很多啊！當我們有進行最後一個訂閱步驟時，每當 document 觸發 click 事件，都會接收到相關的資訊。

另外也可以直接把現有的資料包裝成一個 observable，例如 `of`，就是單純的把一個資料變成一個 observable：

```typescript
import { of } from 'rxjs';
const source = of('abc');
```

雖然乍看之下把單純的資料包裝成 Observable 沒什麼意義，但在組合多個 Observable 時，就會變得很常見，之後我們會在實際案例中介紹。

## 使用 Operators 組合/轉換來源 Observable

上一步驟這些建立 Observable 用的 API 也是被定義為 operators 的一種，只是統一都被分類成「建立」類型的 operators。而當我們要針對 Observable 做一些操作時會使用到其他類型的 operators，這些「非建立」類型的 Operators 統一都在 `rxjs/operators` 內，例如上一篇的文章使用了 `filter` 及 `map` 兩個，那麼就會出現以下程式碼：

```typescript
import { filter, map } from 'rxjs/operators';
```

ReactiveX 定義了非常多的 operators 來協助我們用更簡潔的方式處理各種複雜的問題，要組合這些 operators，需要搭配 Observable 的 `pipe` 方法：

```typescript
fromEvent(document, 'click')
  .pipe(
    filter((_, index) => index % 2 === 0), // 使用 filter operator
    map((event: MouseEvent) => ({ x: event.x, y: event.y })) // 使用 map operator
  )
```

這個 `pipe` 方法可以幫助我們把 operators 給「接起來」，如同他的名字，就像「管線」一樣，每個 operator 就是一種類型的線路，透過 pipe 把各自線路組成一條新的線路，再把資料傳遞進去，完成一條我們預期的流程，

- 每個 operator 的輸入就是來源 Observable
- 每個 operator 的輸出都是另一個 Observable
- 上述兩點可以單純想像成：每個 operator 的輸出就是下一個 operator 的輸入
- 透過組合完畢後我們最後會拿到一個全新的 Observable

上面的程式如果單純以資料流向的方式來看的話，大致上感覺起來會如下圖：

{% asset_img 02.jpg %}

搭配這些 operators 並不是必要的步驟，但可以想想看同樣的功能如果沒有這些 operators 不知道要多寫多少 `if/else` 和 `for`...在後續的文章我們會介紹更多的 operators，來幫助我們解決這種疑難雜症。

Operators 如果運用得當，可以幫助我們寫出更好理解也更好維護的程式碼；但這必須建立在正確的觀念基礎上，如果誤用，反而會寫出更難理解更難維護的程式碼；關於這些重要的觀念在之後的文章會再說明。

ReactiveX 根據不同類型制定出了[不同分類的 Operators](http://reactivex.io/documentation/operators.html) 來處理 Observables，不同的語言又會有特定的分類方式和更多衍生的 Operators，以 [RxJS 的分類來說](https://rxjs-dev.firebaseapp.com/guide/operators)，大致包含以下幾類

- 建立類 Creation Operators
- 組合建立類 Join Creation Operators
- 轉換類 Transformation Operators
- 過濾類 Filtering Observables
- 組合類 Join Operators
- 多播類 Multicasting Operators
- 錯誤處理類 Error Handling Operators
- 工具類 Utility Operators
- 條件/布林類 Conditional and Boolean Operators
- 數學/聚合類 Mathematical and Aggregate Operators

operators 的數量超過 100 個以上，非常的豐富！之後我們會挑出一些比較實用的來介紹。

## 訂閱 Observable

有了一個 Observable 後，當然是要針對每次得到的內容進行處理啦，這也是最後一個步驟，我們會使用 Observable 的 `subscribe` 方法，來「訂閱」Observable 提供的資訊，並針對提供的資訊撰寫程式處理，這些程式我們稱為「觀察者」(Observer)。

至於處理什麼呢？還記得在建立 Observable 時有三個重要方法 `next`、`error` 和 `complete` 嗎？這就是我們要處理的對象，觀察者實際上是一個包含三個 function 的物件，大致看起來如下：

```typescript
const observer = {
  next: (data) => console.log(data),
  error: (err) => console.log(err),
  complete: () => console.log('complete')
};
```

這就對應到建立步驟的三個方法的處理，接著我們只要把這個觀察者傳入 `subscribe` 方法就可以了。

```typescript
source.subscribe(observer);
```

上述是最完整的寫法，也就是針對 `next`、`error` 和 `complete` 各自撰寫處理方式，但許多時候我們只會針對 `next` 做處理，這時候可以直接傳入一個 function 當作 observer 就好，當 subscribe 發現傳進來的不是包含 3 個方法的物件時，就只會當 `next` 處理。也就是說下面兩種寫法基本上完全一樣：

```typescript
// 寫法1: 只處理 next
source.subscribe({
  next: (data) => console.log(data)
});

// 寫法2: 直接傳入一個方法當作參數
source.subscribe((data) => console.log(data));
```

在之後的文章，如果沒有要特別處理錯誤，為了方便起見，統一都會用寫法 2 囉。

當 `subscribe` 呼叫後，我們會拿到一個「訂閱物件」，又稱為 subscription，這個 subscription 控制著目前的訂閱的狀態，當我們不想繼續訂閱時，可以呼叫 `unsubscribe` 方法來「取消訂閱」，之後就算有新的事件 (`next`)發生，也不會處理囉。

當然，如果在「取消訂閱」前就發「發生錯誤 (`error`)」或「完成 (`complete`)」，也會主動處理「取消訂閱」，因此 subscribe 也一樣不會處理新事件。

Subscription 物件還有一個 `closed` 屬性，用來判斷是否已取消訂閱、發生錯誤或完成。

```typescript
import { Subscription } from 'rxjs';

const source = new Subject();
const subscription: Subscription = source.subscribe((data) => console.log(data));

source.next(1); // 顯示 1
source.next(2); // 顯示 2

subscription.unsubscribe(); // 取消訂閱

source.next(3); // 這時候就不會處理了

console.log(subscription.closed);
```

# 隨堂測驗 - 簡易計數器

最後我們出個小題目，讓大家想想看如何只透過今天學會的內容搭配網頁技術來完成以下需求：

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

{% asset_img 03.gif %}

明天我們來看看以目前學到的東西如何使用網頁技術搭配 RxJS 達到需求。

# 本日小結

今天我們介紹了使用 RxJS 最基本的流程，在使用 RxJS 開發應用程式時，都脫離不了這些部分，也可以說是基礎中的基礎，雖然背後還有很多觀念可以學習，但建議先手把這些流程多跑幾次，會越來越有感覺喔！！
