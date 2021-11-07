---
title: "[Angular 大師之路] 如何忽略 HTTP_INTERCEPTORS"
date: 2019-01-06 20:59:46
category: "Angular 大師之路"
tags:
  - HttpClient
  - HttpBackend
  - HTTP_INTECEPTORS
---

我們都知道在 Angular 中如果想要透過 ajax 呼叫 API，可以透過 HttpClient 服務來達成，同時在此之前我們也提過可以[使用 HTTP_INTERCEPTORS 來攔截處理所有的 HTTP 請求](https://fullstackladder.dev/blog/2018/11/01/mastering-angular-17-http-interceptors/)。但有時候我們會希望不要透過 `HTTP_INTERCEPTORS`，幫我們處理那麼多事情，這有辦法解決嗎？今天就來介紹兩種方式來解決這個問題！

<!-- more -->

假設我們有一個 http interceptor 程式如下：

```typescript
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({setHeaders: {'Authorization': 'Bearer fakeToken'}});
    return next.handle(newRequest);
  }
}
```

當使用 HttpClient 服務呼叫 API 時，都可以在開發人員工具中看到這個請求包含自訂的 header

{% asset_img 01.jpg %}

有時候我們需要避開這個 request，該怎麼做呢？

[程式碼 DEMO](https://stackblitz.com/edit/mastering-angular-ignore-http-inteceotors)

# 方法1：在 Headers 加料

我們可以在使用 HttpClient 時就預先設定好 headers，因此在此時可以替 headers 加一點料，設個 flag 等資訊：

```typescript
this.httpClient.get(
  'https://jsonplaceholder.typicode.com/todos/2', 
  // 設定一個 Anonymous 的 header
  { headers: { 'Anonymous': '' } }
);
```

接著在我們的 http interceptors 中就可以透過檢查是否包含加料資訊的 header 來決定是否要使用原本預計的處理方式！

```typescript
public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // 如果 header 被加料過，把它移除，並不進行原本要處理的行為
  if (req.headers.get('Anonymous') !== undefined) {
    const newHeaders = req.headers.delete('Anonymous')
    const newRequest = req.clone({ headers: newHeaders });
    return next.handle(newRequest);
  } else {
    const newRequest = req.clone({ setHeaders: { 'Authorization': 'Bearer fakeToken' } });
    return next.handle(newRequest);
  }
}
```

透過這種方式，每個 http interceptor 都可以透過不同的條件來決定是否要進行原本預設的行為，算是滿方便的一種方式！但有時候程式中會有許多的 http interceptor，有沒有辦法略過所有的 http interceptor 呢？

# 方法2：建立全新的 HttpClient

當我們建立全新的 HttpClient 時，它就擺脫了原本所有 `HTTP_INTERCEPTORS` 的設定，所以當希望不要被程式中任何一個 http interceptor 影響時，這是一個不錯的方法，在 `new HttpClient()` 時，需要傳入一個 `HttpBackend` 的實體，這個實體是用來真正處理 http request 的程式，我們不用特地產生新的 HttpBackend 實體，只要透過注入的方式即可取得！

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable()
export class AnonymousRequestService {
  // 注入 HttpBackend 實體
  constructor(private httpBackend: HttpBackend) { }

  requestByNewHttpClient() {
    // 建立新的 HttpClient 已擺脫 HTTP_INTERCEPTORS 設定
    const newHttpClient = new HttpClient(this.httpBackend);
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/3');
  }
}
```

# 本日小結

- 透過在 headers 加料的方式，能夠忽略某個特定的 http interceptor
- 透過建立新的 HttpClient 實體的方式，可以忽略所有的 http interceptors

兩種方式適用於不同的情境，也可以混用。依照不同的狀況決定如何使用囉！

# 相關資源

- [HTTP_INTERCEPTORS](https://angular.io/api/common/http/HTTP_INTERCEPTORS)
- [HttpClient](https://angular.io/api/common/http/HttpClient)
- [HttpBackend](https://angular.io/api/common/http/HttpBackend)
- [How to make an angular module to ignore http interceptor added in a core module](https://stackoverflow.com/questions/46469349/how-to-make-an-angular-module-to-ignore-http-interceptor-added-in-a-core-module)
