---
title: "[Angular 大師之路] 使用 HTTP_INTERCEPTORS 攔截 Http Request"
date: 2018-11-01 21:43:31
category: "Angular 大師之路"
tags:
  - Angular
  - HTTP_INTERCEPTORS
  - HttpRequest
  - HttpHandler
---

在開發 Angular 應用程式時，HTTP 請求絕對可以說是最常使用的功能之一，而在一般的應用情境上，我們很常會需要針對請求再做額外的包裝，或統一的管理，這時候我們就可以使用 `HTTP_INTERCEPTORS` 來協助我們攔截 HTTP 請求，並做額外的處理！

<!-- more -->

**類型**：技巧

**難度**：4 顆星

**實用度**：5 顆星

# 建立一個 HTTP_INTERCEPTORS 實體

要建立 `HTTP_INTERCEPTORS` 很簡單，先建立一個 service，接著實作 `HttpInterceptor` 這個界面即可，如下：

```typescript
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor() { }
  
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req);
    return next.handle(req);
  }
}
```

在上面程式中，我們建立了 service ，並實作 HttpInterceptor 介面的 intercept 方法，這個方法包含兩個參數：

- `req: HttpRequest<any>`：代表目前送出的 HTTP 請求資訊
- `next: HttpHandler`：代表一個可以用來處理 HTTP 請求的實體，HttpHandler 只有一個 `handle` 方法，裡面傳入的是另一個 `HttpRequest`

在每次進入 intercept 時，必須回傳一個新的 `HttpRequest` 請求，由於我們還沒有要處理任何事情，所以使用 `next.handle(req)`，把目前的請求當作當作新的來處理。

建立好 service 之後，我們要讓 Angular 程式知道要使用這個 `HTTP_INTERCEPTORS`，實際上它是一個可以被注入的 token，因此可以在要使用的 `@NgModule` 加入此設定：

```typescript
@NgModule({
  ...,
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AppHttpInterceptor,
    multi: true,
  }],
})
export class AppModule {}
```

在這裡加入 `multi: true` 的用意是，讓 Angular 知道 `HTTP_INTERCEPTORS` 是可能有多個程式在處理的。

接著只要在程式中任何地方注入 `HttpClient` 並送出 HTTP 請求，就可以看到相關資訊被攔截，且被 `console.log` 記錄下來啦！

接著我們來看看實務上兩種常見使用 `HTTP_INTERCEPTORS` 的方法，剛好也代表了請求前和請求後處理的範例。

# 在請求前加上認證 token

在 SPA 架構下，想要完成認證功能，通常是把帳號密碼送到後端驗證，並請求一個 token 並暫時存下來，之後每次的 HTTP 請求再將此 token 放在 request header 送給後端 API，API 端則需要驗證此 token 是否合法，若合法才允許存取相關資源。

因此我們可以在每次攔截到請求時，替 request 加上要驗證的 token，在傳送出去，如下：

```typescript
@Injectable()
export class TokenAuthHttpInterceptor implements HttpInterceptor {
  constructor() { }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // token 可以來自任何地方
    const newRequest = req.clone({ setHeaders: {Authorization: 'Bearer 123456'}});
    return next.handle(newRequest);
  }
}
```

在上述程式中，我們使用 `req.clone()` 的方式，設定 `Authorization` 的內容。

我們其實可以使用 `req.headers` 來取得目前要送出的 headers 資訊，那麼為什麼要用 `req.clone()` 來建立新的 request 呢，因為 `HttpRequest` 內的屬性大多是唯獨的，因此 `HttpRequest` 額外提供了 `clone` 方法，來建立新的請求。

這時候若打開 F12，就可以看到每次發出 HTTP 請求時都會帶著我們設定好的 header 啦！

# 全域的處理 HTTP 回應錯誤

一般來說，我們會預期後端的 API 都是正常的，且在上線環境我們的請求也是都正確並測試過的，因此當發生錯誤時，都應該會是未預期的錯誤，例如 API 伺服器掛掉，甚至是改版等等。我們可以在每次使用 `HttpClient` 時都去處理這些錯誤，也可以在攔截時就預先進行處理，如下：

```typescript
@Injectable()
export class BackendApiHttpInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private systemService: SystemService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        throwError(error);
        return of(null);
      })
    );
  }
}
```

由於 `next.handle(req)` 回傳的是一個 observable，因此我們可以在這個時候針對取得的資料在做一些處理，例如上面程式我們使用了 `catchError` 這個 RxJS 的 operator，在錯誤發生的時候記錄下來，並把錯誤再次拋出，透過這樣的方式，我們就能夠在 HTTP 發生錯誤時第一時間得知並處理囉。

# 本日小結

HTTP 請求幾乎是所有前端程式都會用到的功能，因此能夠全域的攔截並處理請求及回應資訊是非常重要的一件事請，才能大量減少重複的程式碼，寫出來的程式也會更加簡單！

# 相關資源

- [Intercepting requests and responses](https://angular.io/guide/http#intercepting-requests-and-responses)
  - 官方文件提供了不少應用情境，值得參考一下
- [HTTP_INTERCEPTORS](https://angular.io/api/common/http/HTTP_INTERCEPTORS)
- [HttpHandler](https://angular.io/api/common/http/HttpHandler)
- [HttpRequest](https://angular.io/api/common/http/HttpRequest)
