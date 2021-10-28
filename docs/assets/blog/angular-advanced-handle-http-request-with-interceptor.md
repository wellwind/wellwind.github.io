---
title: "[Angular進階議題]使用HttpInterceptort為HttpClient Request打點前後大小事"
date: 2017-10-29 11:57:12
tags:
    - Angular
    - HttpInterceptor
    - HTTP_INTERCEPTORS
    - HttpClient
---

在實際進行專案的時候，Angular內建的HttpClient其實常常是不符合需求的，因為我們可能會需要為每次的HttpRequest都加上一樣的Header，或針對HttpResponse要有一致性的處理，如果同樣的動作在每次Request都進行的話，只會產生一堆同樣的程式碼，既不美觀也容易出錯，好在Angular提供了[HttpInterceptor](https://angular.cn/api/common/http/HttpInterceptor)來幫助我們在Reqquest前主動幫我們處理好各種事情！

<!-- more -->

# 使用HttpInterceptor前的情境

假設需要抓一隻網路上的API，程式碼可能很簡單如下：

```typescript
  data$: Observable<any>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.data$ = this.httpClient.get('https://jsonplaceholder.typicode.com/posts/1');
  }
```

View的程式碼也很簡單：

```html
<pre>
  {{ data$ | async | json }}
</pre>
```

我們使用HttpClient抓取了一隻網路上的API，並把它顯示在畫面上，這是非常基本且常用的情境。但實際上我們很容易遇到以下的狀況：

1.  取得API前需要認證：所以可能需要在RequestHeader上加入一些驗證資訊如[JWT Token](https://wellwind.idv.tw/blog/2016/11/28/jwt-auth-with-asp-netweb-api/)等等。
2.  需要一個公用的API錯誤處理介面：例如401和403的錯誤需要跳轉到登入頁面，其他內部共用的錯誤訊息處理等等。

以上兩個狀況極有可能是一個專案內數十甚至數百隻以上API都需要進行一樣的行為，如此一來在每一隻API處理時都加入同樣程式的話，只會是一個糟糕的設計。

{% note info %}  

HttpClient是Angular 4新提供的服務，節省原來Angular 2的Http處理上比較花時間的問題。

{% endnote %}

# 自訂ProxyService

一個簡單的方法是自定一個BackendService，當作一個proxy的角色，先把Request前後該做的事情處理好，之後在程式裡都使用BackendService提供的方法，簡單的程式碼如下：

```typescript
@Injectable()
export class BackendService {
  constructor(private httpClient: HttpClient) { }
  get<T>(url: string): Observable<T> {
    // before: 加上自訂的header
    return this.httpClient
      .get(url)
      .do( // after: 處理錯誤等等...
      () => { },
      (error) => this.handleError(error)
      ) as Observable<T>;
  }
  
  post() {} // 其他方法
}
```

接著我們就不直接使用HttpClient，改用BackendService來幫我們處理所有HTTP的事情：

```typescript
@Injectable()
export class AnotherService {
  constructor(private backendService: BackendService) { }
  
  getSomeData() {
    return this.backendService.get('http://someapi.com/api');
  }
}
```

這解決了要在所有API都加上一樣邏輯的問題，不過這麼做還是有幾個明顯的缺點：

1.  可能需要為HttpClient的方法都加上完全一樣的方法簽章，才能應付各種不同的狀況，上述的例子明顯沒有達到要求，HttpClient的get方法還有很多參數能用，但在這裡只有加上了url參數而已。
2.  個人開發時由於BackendService是自己撰寫的，所以非常清楚每次要呼叫API時都需要加入，但團隊開發時若沒有溝通好，可能會造成其他人依然忘記使用的問題。
3.  假設是開發到一半才決定要用這種proxy的方式，可能導致太多程式碼需要額外的修改。
4.  ~~我就是想用HttpClient，討厭自己包裝一層...~~

這時HttpInterceptor就能夠派上用場啦！

# 使用HttpInterceptor

## 基本概念

HttpInterceptor可以在HttpClient發生前攔截我們的request，讓我們可以傳回一個新的request，或針對response處理；偷看一下Angular的[HttpClient原始碼](https://github.com/angular/angular/blob/72c7b6edea39f6591463c2a22eb24d087fd756b7/packages/common/http/src/client.ts)可以發現，HttpClient的建構式本身就注入了一個HttpHandler，透過注入這個HttpHandler我們就能夠在request發生前處理些什麼事情：

```typescript
export class HttpClient {
  constructor(private handler: HttpHandler) {}
}
```

接著我們再來看看[HttpInterceptor的程式碼](https://github.com/angular/angular/blob/72c7b6edea39f6591463c2a22eb24d087fd756b7/packages/common/http/src/interceptor.ts)：

```typescript
export interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
```

其實就只是個介面而已，但我們可以透過實作intercept這個方法，來處理攔截後要做的事情，Angular已經內建了一個NoopInterceptor：

```typescript
export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);   
  }
}
```

由於HttpInterceptor其實是個介面而已，轉換成JavaScript時不會產生任何的程式碼，因此Angular提供了**InjectionToken**來產生一個空的實體，才不會導致我們要設定相依注入時沒有東西可以注入**(TypeScript的Interface對JavaScript等於沒有東西)**

而NoopInterceptor則實作了HttpInterceptor介面，同時給了一個超簡單的程式碼，把原本送進來的request直接透過HttpHandler送出去而已！

所以當我們在Module中設定了HTTP_INTERCEPTORS要注入NoopInterceptor時，在每次HttpClient發生request之前就會來**處理我們加入的intercept方法**，並透過`next.handle(someNewRequest)`來得到新的request資訊！

```typescript
@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
  }],
})
export class AppModule {}
```

有了基本的概念後，我們就來實際設計自己的HttpInterceptor吧！

## 自訂HttpInterceptor在Request前處理事情

假設我們想在Request前，加上一個驗證的Header，我們可以設計一個HttpInterceptor如下

```typescript
export class TokenAuthHttpInterceptor implements HttpInterceptor {
  constructor() { }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({ setHeaders: {Authotization: 'Bearer 123456'}});
    return next.handle(newRequest);
  }
}
```

內容非常簡單，為原本的request複製一份新的，並且在header中設定一個驗證資訊，然後再透過`next.handle(newRequest)`回傳。

有了這個HttpInterceptor後，我們只要在Module中設定：

```typescript
@NgModule({
  // before
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenAuthHttpInterceptor,
      multi: true
    }
  ],
  // after
})
export class AppModule { }
```

就可以啦！原本request的程式完全不用改，直接上瀏覽器的開發工具(F12)看結果：

{% asset_img 01.png %}

是不是很方便啊！！

## 自訂HttpInceptor處理Response資訊

除了在Request前整理資料外，我們也時常會需要處理Response的資訊，例如401或403轉到登入頁面或其他的錯誤處理、log等等，在這邊我們舉個簡單的例子，記錄每次request花費的時間，不過interceptor參數只能得到request的資料，response要從哪裡來呢？好加在next.handle()回傳的是一個Observable&lt;HttpEvent&gt;，很明顯看得到我們可以以**透過處理這個Observable來得到Http事件變化的結果**，程式碼看起來如下：

```typescript
export class RequestTimeLogHttpInterceptor implements HttpInterceptor {
  constructor() { }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`存取網址： ${req.urlWithParams}`);
          console.log(`花費時間： ${elapsed} ms`);
        }
      });
  }
}
```

我們使用`next.handle(req)`直接回傳原本的request，但是透過**Observable.do**的方式，在HTTP事件變化時取得HttpResponse，並且跟發出request時的時間做比較，得到這次request所花費的時間。

接著我們再回到Ｍodule中，加入這個RequestTimeLogHttpInterceptor：

```typescript
@NgModule({
  // before
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenAuthHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestTimeLogHttpInterceptor,
      multi: true
    }
  ],
  // after
})
export class AppModule { }
```

由於我們為HTTP_INTERCEPTORS加入了`multi: true`的設定，因此會得到多個HTTP_INTERCEPTORS，在處理時則會依照我們提供的順序逐個處理，最後送出request！

再回瀏覽器看看執行結果：

{% asset_img 02.png %}

可以看到request的時間就被確實記錄下來啦！

# 小結

今天我們實作了HttpInterceptor，並且在Module中設定了要注入的HTTP_INTERCEPTORS，來達到HTTP發生前後的資料處理。透過這樣的方式，每當我們需要為Http的request前後進行打點時，就加上個對應的HttpInterceptor，原來的程式完全不做修改！實在是太美妙啦！！

範例程式碼：https://github.com/wellwind/angular-advanced-topic-demo/tree/http-interceptor

參考資源：

-   https://angular.io/guide/http#intercepting-all-requests-or-responses

-   [https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8](https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8)

    ​