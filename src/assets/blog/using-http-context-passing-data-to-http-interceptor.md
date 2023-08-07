---
title: "使用 HttpContext 傳遞資料給 HttpInterceptor"
date: 2021-11-07 15:00:00
category: "Angular 大師之路"
tags:
  - "Angular"
  - "Angualr 12"
  - "HttpInterceptor"
  - "HTTP_INTERCEPTORS"
  - "HttpContext"
---

Angular 中的 HttpInterceptor 可以幫助我們攔截每個 HttpClient 送出的呼叫，幫助我們在呼叫前後打點各種大小事情，不過有時候我們反而希望 HttpInterceptor 不要自作主張幫我們處理太多事情，之前有些過一篇文章介紹[如何忽略 HTTP_INTERCEPTORS](https://fullstackladder.dev/blog/2019/01/06/mastering-angular-31-how-to-create-new-http-client-and-ignore-http-interceptors/)，而到了 Angular 12 之後，則內建了 [HttpContext](https://angular.io/api/common/http/HttpContext) 的功能，方便在程式中主動傳遞一些資料給我們自己設計的 HttpInterceptor，來達到一些更細緻的操作，這篇文章就來看一下 HttpContext 該如何使用。

<!-- more -->

# 簡單的 HttpInterceptor 及問題

首先我們先簡單寫一個 `AuthInterceptor`，當 HttpClient 呼叫得到 401 錯誤時，提示訊息並將畫面轉到 `/login`：

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert('登入逾時或權限不足，請重新登入');
          this.router.navigateByUrl('/login');
        }
        return throwError(error)
      }
    );
  }
}
```

雖然很簡單，但有些時候我們希望不要提是錯誤並轉頁，例如我們本來就在 `/login` 頁面時，如果輸入帳號密碼錯誤回傳 401 時應該要自己定義其他的提示，希望 HttpInterceptor 可以根據我們要的情況有不同的處理行為。

這時候我們就可以在呼叫時傳遞一個 [HttpContextToken](https://angular.io/api/common/http/HttpContextToken)，而在我們自己撰寫的 `AuthInterceptor` 內，則可以判斷指定 HttpContext 的內容，決定後續要如何處理。

# 使用 HttpContextToken

## 定義 HttpContextToken

首先我們要先定義好需要的 `HttpContextToken`：

```typescript
import { HttpContextToken } from '@angular/common/http';

/**
 * 當 401 錯誤時是否提示訊息
 */
export const SUPRESS_401_MESSAGE = new HttpContextToken<boolean>(() => false);


/**
 * 當 401 錯誤時是否轉到登入頁面
 */
export const SUPRESS_401_REDIRECT = new HttpContextToken<boolean>(() => false);

```

每個 `HttpContextToken` 建立時候需要傳入一個 callback function，這個 callback function 會回傳 `HttpContextToken` 的預設值，也就是當我們使用 HttpClient 呼叫時，若沒有指定 HttpContextToken 內容，則會以此為預設值。

## 在 HttpInterceptor 內取得 HttpContextToken

在自訂的 HttpInterceptor 內，可以使用 `HttpRequest.context.get` 得到原來 `HttpClient` 呼叫時傳入的 `HttpContextToken`，如同前面所說，如果 HttpClient 呼叫時沒指定，則會使用最早建立 token 時指定的預設值。

```typescript
intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  return next.handle(newRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // 使用 request.context.get 取得執定的 HttpContextToken
        // 並根據 token 內容決定如何進一步執行程式
        
        if(!request.context.get(SUPRESS_401_MESSAGE)) {
          alert('登入逾時或權限不足，請重新登入');          
        }

        if(!request.context.get(SUPRESS_401_REDIRECT)) {
          this.router.navigateByUrl('/login');          
        }
      }
      return throwError(error)
    }
  );
}
```

## HttpClient 傳遞 HttpContextToken

之後在 HttpClient 呼叫時，如果需要傳遞 HttpContextToken 讓 HttpInterceptor 根據條件處理不同行為時，只要在呼叫時設定好要使用哪些 HttpContextToken 及資料即可，不管是 `get`、`post` 還是其他方法，都可以在 `options` 參數內傳遞 `context` 參數：

```typescript
this.httpClient.post<any>(
  `api/ligin`, 
  loginData, 
  {
    context: new HttpContext()
      .set(SUPRESS_401_MESSAGE, true)
      .set(SUPRESS_401_REDIRECT, true)
  }
).pipe(
  catchError(error => {
    // 因為不讓 HttpInterceptor 處理了
    // 所以可能就需要自己處理錯誤
    return of(error);
  })
);
```

如此一來這次 API 呼叫時，就會將 `SUPRESS_401_MESSAGE` 和 `SUPRESS_401_REDIRECT` 的值設定為 `true`，而自訂的 HttpInterceptor 就可以根據這些 token 來決定該如何進一步處理了。

# 本日小結

要控制 HttpInterceptor，以前常見的做法是主動在 header 加料，然後在 HttpInterceptor 內額外處理，一方便沒有把行為分開，另一方面也容易不小心將不必要的 header 也一起傳出去了；Angular 12 推出 HttpContext 功能後，要在 HttpClient 呼叫時控制 HttpInterceptor 就變得更加容易了！

# 相關資源

- [Passing metadata to interceptors](https://angular.io/guide/http#passing-metadata-to-interceptors)
- [使用 HttpInterceptort 為 HttpClient Request 打點前後大小事](https://fullstackladder.dev/blog/2017/10/29/angular-advanced-handle-http-request-with-interceptor/)
- [如何忽略 HTTP_INTERCEPTORS](https://fullstackladder.dev/blog/2019/01/06/mastering-angular-31-how-to-create-new-http-client-and-ignore-http-interceptors/)
