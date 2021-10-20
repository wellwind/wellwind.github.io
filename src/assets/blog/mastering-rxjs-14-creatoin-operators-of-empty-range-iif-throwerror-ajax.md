---
title: "[RxJS] 建立類型 Operators (1) - EMPTY / of / range / iif / throwError / ajax"
date: 2020-09-29 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - of
  - empty
  - range
  - iif
  - throwError
  - ajax
---

今天開始進入各種 Operators 的介紹啦！首先我們先來看看「建立類型」的 operators，除了前兩天介紹從頭開始建立 Observable 的方法外，在 RxJS 內有非常多種內建的方法可以讓我們依照不同的情境需求來建立 Observable，今天先來看看其中幾種。

<!-- more -->

# EMPTY

`EMPTY` 就是一個空的 Observable，沒有任何事件，就直接結束了，直接看程式：

```typescript
import { EMPTY } from 'rxjs';

EMPTY.subscribe(data => data => console.log(`empty 範例: ${data}`));
// (不會印出任何東西)
```

為什麼沒印出任何東西呢？如同前面提到的，因為沒有任何事件，就直接結束了，我們把 `complete()` 處理也加進去看看：

```typescript
EMPTY.subscribe({
  next: data => console.log(`empty 範例: ${data}`),
  complete: () => console.log('empty 結束')
});
// empty 結束
```

彈珠圖：

```
|
```

在轉換各種資料流時，有時候就是希望「什麼都別做」，就是使用 EMPTY 的時機了！稍後再來舉例說明。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-empty

# of

`of` 基本上非常簡單，就是將傳進去的值當作一條 Observable，當值都發送完後結束，直接上程式：

```typescript
import { of } from 'rxjs';

of(1).subsctibe(data => console.log(`of 範例: ${data}`));
// of 範例: 1
```

畫成彈珠圖也非常簡單：

```
(1|)
```

也就是立刻發出數值 `1` 的資料，然後立刻結束 (`complete()`)。

`of` 也可以帶入多個值，當訂閱發生時這些值會各自送出 (`next()`)，然就結束：

```typescript
of(1, 2, 3, 4).subscribe(data => console.log(`of 範例: ${data}`));
// of 範例: 1
// of 範例: 2
// of 範例: 3
// of 範例: 4
```

彈珠圖：

```
(1234|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-of

# range

`range` 顧名思義就是依照一個範圍內的數列資料建立 Observable，包含兩個參數：

- **start**: 從哪個數值開始
- **count**: 建立多少個數值的數列

例如：

```typescript
import { range } from 'rxjs';

range(3, 4).subscribe(data => console.log(`range 範例: ${data}`));
// range 範例: 3
// range 範例: 4
// range 範例: 5
// range 範例: 6
```

上面程式會從 3 這個數值開始建立一個 4 個數值的數列，也就是「3、4、5、6」。

彈珠圖：

```
(3456|)
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-range

# iif

`iif` 會透過條件來決定產生怎麼樣的 Observable，有三個參數：

- **condition**: 傳入一個 function，這個 function 會回傳布林值。
- **trueResult**: 當呼叫 condition 參數的 function 回傳 `true` 時，使用 trueResult 的 Observable
- **falseResult**: 當呼叫 condition 參數的 function 回傳 `false` 時，使用 falseResult 的 Observable

一樣用程式來理解：

```typescript
import { iif, of, EMPTY } from 'rxjs';

const emitHelloIfEven = (data) => {
  return iif(() => data % 2 === 0, of('Hello'), EMPTY);
};

emitOneIfEven(1).subscribe(data => console.log(`iif 範例 (1): ${data}`));
// (不會印出任何東西)
emitOneIfEven(2).subscribe(data => console.log(`iif 範例 (2): ${data}`));
// iif 範例 (2): Hello
```

這邊練習的關鍵在：

```typescript
iif(() => data % 2 === 0, of('Hello'), EMPTY);
```

也就是當傳入的 `data` 是偶數時，回傳 `of('Hello')` 這個 Observable，若不是則不做任何事情，也就是回傳 `EMPTY` 這個 Observable。

當需要一些簡單條件來控制使用的 Observable 時，`iif` 就很方便囉！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-iif

# throwError

`throwError` 看名字應該不難理解，就是用來讓整條 Observable 發生錯誤 (`error()`) 用的！因此訂閱時要記得使用 `error` 來處理，同時當錯誤發生時，就不會有「完成」發生。直接來看程式碼：

```typescript
import { throwError } from 'rxjs';

const source$ = throwError('發生錯誤了');
source$.subscribe({
  next: (data) => console.log(`throwError 範例 (next): ${data}`),
  error: (error) => console.log(`throwError 範例 (error): ${error}`),
  complete: () => console.log('throwError 範例 (complete)'),
});
// throwError 範例 (error): 發生錯誤了
```

`throwError` 通常不會被單獨使用，而是在使用 `pipe` 設計整條 Observable 時，用來處理錯誤的。

彈珠圖：

```
#
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-throwerror

# ajax

`ajax` 算是比較特殊的工具 operator，放在 `rjxs/ajax` 下，而功能看名字就知道，是用來發送 HTTP 請求抓 API 資料的，會回傳 [ajaxResponse 格式](https://rxjs-dev.firebaseapp.com/api/ajax/AjaxResponse)！例如以下程式會使用 `ajax` 抓取 RxJS 在 GitHub 上的 issues：

```typescript
const source$ = ajax('https://api.github.com/repos/reactivex/rxjs/issues');
source$.subscribe(result => console.log(result.response));
```

雖然有很多現成的工具可以去抓 API 資料，例如原生的 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)，或是 [axios](https://github.com/axios/axios)、[jQuery](https://api.jquery.com/jquery.ajax/) 等套件，但使用 `ajax` 的好處是已經將資料包成 Observable 了，我們可以輕易地直接跟許多現有的 Operators 組合出各式各樣的玩法，若使用其它套件，則需要自行包裝成 Observable。

以下是把 fetch API 包裝成 Observable 的範例程式：

```typescript
const source$ = new Observable(subscriber => {
  fetch('https://api.github.com/repos/reactivex/rxjs/issues')
    .then(response => response.json())
    .then(responseBody => {
      subscriber.next(responseBody);
      subscriber.complete();
    });
});

source$.subscribe(data => console.log(data));
```

{% note info %}

如果資料來源是從 fetch API 的話 RxJS 還有提供一個 [fromFetch](https://rxjs-dev.firebaseapp.com/api/fetch/fromFetch) operator，有興趣的話可以看看囉。

 {% endnote %}

`ajax` 除了單純傳入網址，用 GET 方法取得資料外，也可以改成傳入一個 [ajaxRequest 設定物件](https://rxjs-dev.firebaseapp.com/api/ajax/AjaxRequest)，來控制 GET 或 POST 等方法，或是設定 headers、body等資訊：

```typescript
  const source$ = ajax({
    url: 'https://api.github.com/repos/reactivex/rxjs/issues',
    method: 'GET'
  });
  source$.subscribe(result => console.log('ajax 範例 (2):', result.response));
```

在不使用其它套件、框架的輔助下，我們也可以單純使用 RxJS 的 `ajax` 來抓 API 資料，非常方便！

最後別忘了，`ajax` 建立的也是 cold observable，也就是說在真正訂閱發生前，並不會真的去呼叫 HTTP 請求，也就是我們在介紹 functional programming 時提到的「延遲評估」的特色，在真正需要 (也就是訂閱) 時才真的去發送 HTTP 囉。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-ajax

# 本日小結

- `EMPTY`：用來產生一條「空的 Observble」，也就是沒有發生任合事件值，就結束。
- `of`：用裡面的參數當作每次事件的資料。
- `range`：用一定範圍內的數值資料作為事件的資料。
- `iif`：依照第一個參數的條件，決定要使用不同的 Observable 資料流。
- `throwError`：讓 Observable 發生錯誤。
- `ajax`：呼叫一個 HTTP 請求作為 Observsble 的事件資料。

# 相關資源

- [Operators - EMPTY](https://rxjs-dev.firebaseapp.com/api/index/const/EMPTY)
- [Operators - of](https://rxjs-dev.firebaseapp.com/api/index/function/of)
- [Operators - range](https://rxjs-dev.firebaseapp.com/api/index/function/range)
- [Operators - iif](https://rxjs-dev.firebaseapp.com/api/index/function/iif)
- [Operators - throwError](https://rxjs-dev.firebaseapp.com/api/index/function/throwError)
- [Operators - ajax](https://rxjs-dev.firebaseapp.com/api/ajax/ajax)
- [ajaxRequest 介面](https://rxjs-dev.firebaseapp.com/api/ajax/AjaxRequest)
- [ajaxResponse 介面](https://rxjs-dev.firebaseapp.com/api/ajax/AjaxResponse)
