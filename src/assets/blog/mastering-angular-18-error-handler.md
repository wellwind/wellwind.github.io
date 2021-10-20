---
title: "[Angular 大師之路] 使用 ErrorHandler 集中處理錯誤"
date: 2018-11-01 21:43:31
category: "Angular 大師之路"
tags:
  - Angular
  - ErrorHandler
---

今天我們來看看，如何集中管理所有的錯誤訊息。

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：3 顆星

在撰寫程式時，我們很難避免完全不發生任何錯誤，總是會有未預期錯誤發生的可能，有的時候我們會希望在程式內發生任何錯誤訊息時，都將它記錄下來，不只是顯示在 F12 開發人員視窗，甚至希望將訊息傳到後端，已得知錯誤發生的頻率、情境等等。

在 F12 開發人員視窗看錯誤訊息很容易，但要怎麼在錯誤發生時主動得知呢？

很單純使用 JavaScript 時我們可能會這樣做：

```typescript
try {
  // do something
}
catch (error) {
  // 處理錯誤
}
```

在 Angular 中，我們常常用到非同步處理的 RxJS ，可以這樣做：

```typescript
someObservable.pipe(
  // 使用 catchError operator
  catchError(error => {
    console.log(error);
    throwError(error);
  })
).subscribe(
  result => {},
  error => { /* 處理錯誤 */ }
);
```

就算使用 Promise 處理非同步，也沒有什麼問題：

```typescript
somePromise
  .then(() => {})
  .catch(() => { /* 處理錯誤 */ })
```

但若要在每個程式都去進行錯誤處理，未免也太忙煩了！

在 Angular 中，我們可以使用 `ErrorHandler` 來攔截錯誤，並集中處理。

# 實作 ErrorHandler

Angular 在執行時，當錯誤發生時，會在模組中檢查是否有自行實作的 ErrorHandler，如果有，就會呼叫其中的 `handleError()` 方法，並將錯誤訊息放到方法的參數內。

因此我們可以建立一個類別，並實作 `ErrorHandler` 的 `handleError()` 方法，如下：

```typescript
class ErrorLogHandler implements ErrorHandler {
  handleError(error) {
    console.log(error);
    // 或是將 error 記錄到某個後端去
  }
}
```

之後只需要在模組中設定使用這個 error handler 即可：

```typescript
@NgModule({
  ...
  providers: [{provide: ErrorHandler, useClass: ErrorLogHandler}]
})
class AppModule {}
```

這麼一來只要在程式中任何地方有錯誤發生，就會進入自己設計的 `ErrorLogHandler` 內的 `handleError()` 來統一處理，而不用在程式個個地方到處處理錯誤囉！

# 相關資源

- [ErrorHandler](https://angular.io/api/core/ErrorHandler)
