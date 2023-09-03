---
title: "簡介 Angular Signals"
date: 2023-05-07 12:02:27
category: "Angular 大師之路"
tags:
  - Angular
  - Signals
---

Angular 16 推出了 Angular Signals 功能，雖然還在 developer preview，但個人覺得是個非常值得開始學習，並在未來正式版後開始使用的功能，這篇文章就來介紹一下 Angular Signals 的用法。

<!-- more -->

## Why Angular Signals

過去，Angular 的變更偵測主要是依賴 `NgZone` 來處理，`NgZone` 會攔截所有可能需要進行變更偵測的行為，並在這些行為發生時嘗試偵測資料是否有變更，如果有，則重新渲染畫面，例如：

```ts
@Component({
  ...,
  template: `
    <div>counter: {{ counter }}</div>
    <div><button (click)="add()">Add</button></div>
  `
})
class AppComponent {
  counter = 0;

  add() {
    ++this.counter;
  }
}
```

由於 `NgZone` 會攔截按鈕的 `click` 事件，因此在 `click` 事件發生後，Angular 會進行一次變更偵測，此時發現 `counter` 內容被改變了，就會重新渲染畫面。

這樣的錯法看起來很聰明，我們在寫程式時只要專注在改變資料即可，不用去思考框架何時要處理變更，不過也是有不少缺點，如：

* `NgZone` 背後用的 `zone.js` 檔案不小，佔空間
* 有時遇到 `NgZone` 攔截不到的行為，就不會發生變更偵測
* 攔截範圍過大，由於 `NgZone` 只是攔截了「可能會需要變更偵測的行為」，但如果行為沒有需要重新渲染的變更，就額外浪費了一次檢查

隨著前端持續發展，我們需要一種更有效率的變更偵測以及渲染機制，其中一種方式就是「當我們真的有改變需要渲染的資料時，才進行渲染」，我們也可以稱他為一種「回應變化」的處理方式，也就是每次渲染，都一定會有一個主動的變化，也是我們常常講的「reactiㄎdve programming」的一種應用。

為了解決這個問題，Angular 借用了 [solid.js](https://www.solidjs.com/) 提出的 signal 概念，我們可以把它想像成是一種資料的「訊號」，只有當這個「訊號」有發送的時候，我們才進行回應 (也就是畫面渲染)，如此一來就可以提高整體應用程式的效率！

## Angular Signals 使用方法

### 建立一個 Signal

要建立一個 signal 非常簡單，呼叫 `signal` 方法就好，方法內可以帶入預設值

```ts
import { signal } from '@angular/core';

...

counter = signal(0);
```

此時的 `counter` 為一個 writable signal (可寫的 signal)，要得到這個 signal 的目前資料，只要實際把 `counter` 當作方法呼叫即可讓畫面更新，例如：

```html
<div>counter: {{ counter() }}</div>
```

或是在程式中：

```ts
console.log(`counter: ${counter()}`);
```

由於 `counter` 是一個物件，我們無法直接改變它，我們需要對 `counter` 進行「訊號改變」。

#### set

最簡單的方式是，直接呼叫 `counter` 的 `set` 方法，把要改變的資料傳進去

```ts
counter.set(100);
```

此時不管程式是否在 NgZone 的管理範圍內，只要畫面上有 `counter()` 就會重新渲染啦！

#### update

如果要拿到過去的資料，再進行異動，最簡單的方式是先呼叫取的資料後，在用 `set()` 更新：

```ts
counter.set(counter() + 1);
```

不過 Angular 提供的更簡單的方法 `update()`，在 `update()` 內是一個 callback function，且 function 內的參數及為目前的資料

```ts
counter.update(current => current + 1);
```

#### mutate

如果 signal 內是物件資料

```ts
data = signal({ counter: 0});
```

要改變物件資料時一樣可以用 `set` 或 `update`。

使用 `set` 會需要傳入一個新的物件

```ts
data.set({ counter: 1});
```

使用 `update` 的話，則是在 callback 內回傳一個變更後的物件

immutable 處理方式：

```ts
data.update(item => ({ ...item, counter: item.counter + 1}));
```

mutable 處理方式：

```ts
date.update(item => {
  item.counter++;
  return item;
});
```

而 Angular Signals 提供了 `mutate` 方法，類似 `update` 但我們可以直接改變物件，而不用額外回傳

```ts
date.mutate(item => {
  item.counter++;
});
```

有了 Angular Signals，我們可以在任何 `NgZone` 以外的範圍管理狀態資料，又不用擔心渲染問題囉。

#### asReadonly

前面建立的 signal 都是 writable 的，也就是任何人都可以隨意更改資料，這可能不是一個好的設計，尤其是當我們在 service 內共用狀態時，如果任何人都可以不受管制的更新資料，很容易造成無法控制的狀況，此時我們可以用 `asReadonly` 將一個「唯獨的 signal」(readonly signal) 提供給其他程式使用，而「可以被改寫的 signal」(writable signal) 就不要暴露出去。

```ts
@Injectable({ providedIn: 'root'})
export class CounterService {
  private _counter = signal(0);

  get counter() {
    return this._counter.asReadonly();
  }
}
```

### 回應 Signal 變化

除了畫面自動渲染外，我們也可以主動去回應 signal 的變化

#### computed

`computed()` 會回傳一個 readonly signal，且在呼叫時需要傳入一個 callback function，在此 function 內的 signal 發生變化時，這個 callback function 就會自動被呼叫，因此我們可以在 signal 有變化時，才去根據來源 signal 產生新結果，例如

```ts
counter = signal(0);
doubleCounter = computed(() => {
  return counter() * 2;
});
```

當呼叫 `counter.set(2)` 時，`doubleCounter` 內就會產生 `4` 的結果；另外很重要的一點是 `computed` 的 signal 只有在畫面上有使用到時，才會呼叫並且計算，因此不用擔心效能問題！

#### effect

如前面所述，`computed` 只有在真的「被使用」(一般來說，就是畫面上呼叫) 時，才會針對來源 signal 資料的變化而進一步運算出新的結果，如果我們想要在畫面以外得知計算的結果，可以使用 `effect`，例如

```ts
counter = signal(0);
doubleCounter = computed(() => {
  return counter() * 2;
});

effectRef = effect(() => {
  console.log(doubleCounter());
});
```

此時就算畫面沒有使用到 `doubleCounter`，我們依然可以得到它的結果。

要注意的是 `effect` 只可以用在可被注入的時機點 (injection context)，也就是建構式或注入的工廠方法內，與 [inject](https://angular.io/api/core/inject) 方法相同；相關內容可以參考 [NG0203](https://angular.io/errors/NG0203)。

呼叫 `effect` 後，預設會隨著元件銷毀而結束，但我們也可以回傳的 [EffectRef](https://angular.io/api/core/EffectRef) 物件，並呼叫 `destroy()` 方法主動結束 effect。

在 `effect` 呼叫的 callback function 內，也可以傳入一個 `cleanUp` 方法，讓我們在 destroy 時更細膩的處理結束時該做些什麼事情

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## 本日小節

今天我們大概看了一下 Angular Signals 的使用方法，透過 Angular Signals 我們可以打造出更高效率的應用程式，同時也能寫出更 reactive 的程式碼，創造更高效且告可讀性的應用程式囉！

## 參考資料

* [Releases 16.0.0](https://github.com/angular/angular/releases/tag/16.0.0)
* [Angular Signals](https://angular.io/guide/signals)
