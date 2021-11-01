---
title: "[RxJS] 錯誤處理 Operators (1) - catchError / finalize / retry / retryWhen"
date: 2020-10-14 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - catchError
  - retry
  - retryWhen
  - finalize
---

今天來介紹一些跟「錯誤處理」有關的 operators。在使用 RxJS 時，資料流是透過 `pipe` 及各式各樣的 `operators` 在處理，且很多時候是非同步的，因此大多時候發生錯誤並不能單純的使用 `try...catch` 方式處理，就需要透過這些錯誤處理相關的 operators 來幫忙囉！

<!-- more -->

# catchError

`catchError` 可以在來源 Observable 發生錯誤時，進行額外的處理，一般來說發生錯誤時，都是在訂閱時使用處理：

```typescript
interval(1000)
  .pipe(
    map(data => {
      if (data % 2 === 0) {
        return data;
      } else {
        throw new Error('發生錯誤');
      }
    }),
  )
  .subscribe({
    next: data => {
      console.log(`catchError 示範 (1): ${data}`);
    },
    error: error => {
      console.log(`catchError 示範 (1): 錯誤 - ${error}`);
    }
  });
// catchError 示範 (1): 0
// catchError 示範 (1): 錯誤 - Error: 發生錯誤
// (發生錯誤，整個資料流中斷)
```

彈珠圖：

```
---0---#
```

但訂閱畢竟不是整個 Observable 資料流的一部份，而是我們訂閱時自己撰寫的邏輯，如果要將錯誤處理也視為整個 Observable 的一部份，就可以使用 `catchError`，`catchError` 內會傳入錯誤訊息，且需要回傳另一個 Observable，當過程中錯誤發生時，就會改成使用 `catchError` 回傳的 Observable，讓後續的其他 operators 可以繼續下去，而不會中斷整個資料流：

```typescript

interval(1000)
  .pipe(
    map(data => {
      if (data % 2 === 0) {
        return data;
      } else {
        throw new Error('發生錯誤');
      }
    }),
    catchError(error => {
      return interval(1000);
    }),
  	map(data => data * 2)
  )
  .subscribe({
    next: data => {
      console.log(`catchError 示範 (2): ${data}`);
    },
    error: error => {
      console.log(`catchError 示範 (2): 錯誤 - ${error}`);
    }
  });
// catchError 示範 (2): 0
// (這時候來源 Observable 發生錯誤，用另一個 Observable 取代)
// (以下是錯誤處理後新的 Observable)
// catchError 示範 (2): 0
// catchError 示範 (2): 2
// catchError 示範 (2): 4
```

彈珠圖：

```
           ---0---#
catchError(---0---1---2...)
           ---0-------0----1----2...
                  ^ 發生錯誤，換成 catchError 內的 Observable
       map(data => data * 2)
           ---0-------0----2----4...
```

如果遇到不能處理的問題，也可以就讓錯誤發生，此時只需要回傳 `throwError` 即可：

```typescript
interval(1000)
  .pipe(
    map(data => {
      if (data % 2 === 0) {
        return data;
      } else {
        throw new Error('發生錯誤');
      }
    }),
    catchError(error => {
      if(error === null) {
        return interval(1000);
      }
      return throwError(error);
    })
  )
  .subscribe({
    next: data => {
      console.log(`catchError 示範 (3): ${data}`);
    },
    error: error => {
      console.log(`catchError 示範 (3): 錯誤 - ${error}`);
    }
  });
// catchError 示範 (3): 0
// catchError 示範 (3): 錯誤 - Error: 發生錯誤
// (發生錯誤，整個資料流中斷)
```

在 Observable 中，不論是 `throw new Error()` 還是回傳 `throwError()` 都會產生錯誤並中斷資料流，所以前面程式使用 `map` 處理錯誤的邏輯也可以改成：

```typescript
switchMap(data => iif(() => data % 2 === 0, of(data), throwError('發生錯誤')))
```

會更有 functional programming 的風格！

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-catcherror

# retry

當 Observable 發生錯誤時，可以使用 `retry` 來重試整個 Observable，在 `retry` 內可以指定重試幾次：

```typescript
interval(1000)
  .pipe(
    switchMap(data => 
      iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
    map(data => data + 1),
    retry(3),
  )
  .subscribe({
    next: data => {
      console.log(`retry 示範 (1): ${data}`);
    },
    error: error => {
      console.log(`retry 示範 (1): 錯誤 - ${error}`);
    }
  });
// retry 示範 (1): 1
// (發生錯誤，重試第 1 次)
// retry 示範 (1): 1
// (發生錯誤，重試第 2 次)
// retry 示範 (1): 1
// (發生錯誤，重試第 3 次)
// retry 示範 (1): 1
// (發生錯誤，已經重試 3 次了，不在重試，直接讓錯誤發生)
// retry 示範 (1): 錯誤 - 發生錯誤
```

彈珠圖：

```
---1---#
retry(3)
---1------1------1------1---#
       ^ 發生錯誤，重試第 1 次
              ^ 發生錯誤，重試第 2 次
                     ^ 發生錯誤，重試第 3 次
                            ^ 不在重試，直接讓錯誤發生
```

若不指定次數，預設為 `-1`，代表會持續重試；若不想重試，也可以指定次數為 `0`，就會直接讓錯誤發生。

程式碼：https://stackblitz.com/edit/mastering-rxjs-opereator-retry

# retryWhen

`retryWhen` 也可以再發生錯誤時進行重試，但 `retryWhen` 更有彈性，在 `retryWhen` 內需要設計一個 `notifier` callback function，`retryWhen` 會將錯誤資訊傳入 `notifier` function，同時需要回傳一個 Observable，`retryWhen` 會訂閱這個 Observable，每當有事件發生時，就進行重試，直到這個回傳的 Observable 結束，才停止重試。

以下程式在錯誤發生時，會每三秒重試一次，共重試三次：

```typescript
interval(1000)
  .pipe(
    switchMap(data => 
      iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
    map(data => data + 1),
    retryWhen((error) => interval(3000).pipe(take(3)))
  )
  .subscribe({
    next: data => {
      console.log(`retryWhen 示範 (1): ${data}`);
    },
    error: error => {
      console.log(`retryWhen 示範 (1): 錯誤 - ${error}`);
    },
    complete: () => {
      console.log('retryWhen 示範 (1): 完成');
    }
  });
// retryWhen 示範 (1): 1
// retryWhen 示範 (1): 1
// retryWhen 示範 (1): 1
// (重試的 Observable 完成，因此整個 Observable 也完成)
// retryWhen 示範 (1): 完成
```

彈珠圖：

```
-1-#
retryWhen(---0---1---2|)
-1----1----1----1|
   ^ 發生錯誤，三秒後重試
                ^ 重試的 Observable 完成，因此整個 Observable 也完成
```

由於是讓重試的 Observable 完成，因此整個資料流也會當作「完成」，處理訂閱的 `complete()` callback。

如果希望重試幾次次後發生錯誤，一樣加入 `throwError` 即可：

```typescript
const retryTimesThenThrowError = (every, times) => interval(every).pipe(
  switchMap((value, index) => 
    iif(() => index === times, throwError('重試後發生錯誤'), of(value)))
  );

interval(1000)
  .pipe(
    switchMap(data => 
      iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
    map(data => data + 1),
    retryWhen((error) => retryTimesThenThrowError(3000, 3))
  )
  .subscribe({
    next: data => {
      console.log(`retryWhen 示範 (2): ${data}`);
    },
    error: error => {
      console.log(`retryWhen 示範 (2): 錯誤 - ${error}`);
    },
    complete: () => {
      console.log('retryWhen 示範 (2): 完成');
    }
  });
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 1
// retryWhen 示範 (2): 錯誤 - 重試後發生錯誤
```

另外一個小技巧，我們也可以讓使用者自己決定何時要重試：

```typescript
const click$ = fromEvent(document, 'click');
interval(1000)
  .pipe(
    switchMap(data => 
      iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
    map(data => data + 1),
    retryWhen((error) => click$)
  )
  .subscribe({
    next: data => {
      console.log(`retryWhen 示範 (3): ${data}`);
    },
    error: error => {
      console.log(`retryWhen 示範 (3): 錯誤 - ${error}`);
    },
    complete: () => {
      console.log('retryWhen 示範 (3): 結束');
    }
  });
```

以上程式碼能在錯誤發生後，當滑鼠 click 事件發生時，才進行重試。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-retrywhen

# finalize

`finalize` 會在整個來源 Observable 結束時，才進入處理，因此永遠會在最後才呼叫到：

```typescript
interval(1000)
  .pipe(
    take(5),
    finalize(() => {
      console.log('finalize 示範 (1): 在 pipe 內的 finalize 被呼叫了')
    }),
    map(data => data + 1),
  )
  .subscribe({
    next: data => {
      console.log(`finalize 示範 (1): ${data}`);
    },
    complete: () => {
      console.log(`finalize 示範 (1): 完成`);
    }
  });
// finalize 示範 (1): 1
// finalize 示範 (1): 2
// finalize 示範 (1): 3
// finalize 示範 (1): 4
// finalize 示範 (1): 5
// finalize 示範 (1): 完成
// finalize 示範 (1): 在 pipe 內的 finalize 被呼叫了
```

從結果可以看到，儘管 `map` 放在 `finalize` 後面，但還是不斷的處理 `map` 內的邏輯，直到來源 Observable 結束後，才進入 `finalize` 處理，同時也可以注意到 `finalize` 會比 `subsribe` 的 `complete` 還慢進入。

嚴格來說 `finalize` 不算是錯誤處理的 operator，因為 `finalize` 會在整個 Observable 結束時才進入處理，跟有沒有發生錯誤無關，但經常與錯誤處理搭配一起使用。

```typescript
interval(1000)
  .pipe(
    switchMap(data => 
      iif(() => data % 2 === 0, of(data), throwError('發生錯誤'))),
    // 當之前的 operator 發生錯誤時，資料流會中斷，但會進來 finalize
    finalize(() => {
      console.log('finalize 示範 (2): 在 pipe 內的 finalize 被呼叫了')
    }),
    // 當之前的 operator 發生錯誤時，這裏就不會呼叫了
    map(data => data + 1),
  )
  .subscribe({
    next: data => {
      console.log(`finalize 示範 (2): ${data}`);
    },
    error: error => {
      console.log(`finalize 示範 (2): 錯誤 - ${error}`);
    }
  });
// finalize 示範 (2): 1
// finalize 示範 (2): 錯誤 - 發生錯誤
// finalize 示範 (2): 在 pipe 內的 finalize 被呼叫了
```

從結果可以看到，`finalize` 也會比 `subsribe` 的 `error` 還慢被呼叫。透過 `finalize` 我們可以確保就算過程中發生錯誤導致整個資料流中斷，還會有個地方可以處理些事情。

程式碼：https://stackblitz.com/edit/mastering-rxjs-operator-finalize

# 本日小結

- `catchError`：可以用來決定當來源 Observable 發生錯誤時該如何進行，回傳一個 Observable 代表會使用此 Observable 繼續下去，因此回傳 `throwError` 則代表依然發生錯誤。
- `retry`：當來源 Observable 發生錯誤時，重新嘗試指定次數。
- `retryWhen`：當來源 Observable 發生錯誤時，可以照自定的 Observable 來決定重試的時機。
- `finalize`：在 Observable 結束時，無論是 `error()` 還是 `complete()`，最後都可以進入 `finalize` 進行最終處理。

# 相關資源

- [Operator - catchError](https://rxjs-dev.firebaseapp.com/api/operators/catchError)
- [Operator - retry](https://rxjs-dev.firebaseapp.com/api/operators/retry)
- [Operator - retryWhen](https://rxjs-dev.firebaseapp.com/api/operators/retryWhen)
- [Operator - finalize](https://rxjs-dev.firebaseapp.com/api/operators/finalize)
