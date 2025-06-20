---
title: "[Angular] Resource / rxResource / httpResource 完整教學與分析"
date: 2025-06-20 19:47:16
category: "Angular 進階議題"
tags:
    - Angular
    - Angular Resource
    - Angular rxResource
    - Angular httpResource
    - Angular HTTP
---

Angular 20 正式推出了全新的 Resource API 系列，包括 `resource()`、`rxResource()` 和 `httpResource()`，以 Angular Signals 強大的 reactive programming 思考簡化非同步資料處理。這篇文章將針對這三種用法做完整介紹與比較，了解它們的使用方式、與傳統 `HttpClient` 的差異，以及在實際中小型應用中的應用情境。文中也會涵蓋撰寫單元測試驗證 Resource API 呼叫的方法，並分享最佳實務與常見地雷。讓我們一起來看看 Angular 20 的這項新功能如何讓開發更輕鬆又優雅吧！

<!-- more -->

## Resource / rxResource / httpResource 是什麼？

Resource API 是 Angular 19 引入的實驗性功能 (Angular 19.0 提供 `resource` / `rxResource`，19.2 新增了 `httpResource`），並在 Angular 20 進一步改良。

其核心概念是：**將非同步操作的結果暴露為 Signal**。

過去我們使用 `HttpClient` 時，通常會得到一個 Observable 物件，需要手動訂閱 (subscribe) 才能取得資料，而且還得自己處理 loading 與 error 等狀態；現在透過 Resource API，我們可以用宣告式的方式定義非同步資料來源，讓 Angular 自動追蹤依賴的參數變化，並在參數變化時自動重新抓取資料。

更棒的是，Resource API 會提供額外的 Signal 狀態，例如**是否載入中、是否有錯誤**等等。簡單來說，Resource API 就是為了讓非同步資料流在 Angular 應用中變得更簡單又直覺。

在 Resource API 中有三種主要用法：

* `resource()`：建立一般的 resource Signal，可用於任何非同步操作 (如 fetch 或自行封裝的 Promise)。它透過 `params` 和 `loader` 兩個方法來定義非同步資料如何取得。
* `rxResource()`：類似 `resource()`，但專門用來整合 RxJS Observable 流。如果你的資料來源已經是 Observable (例如 Angular HttpClient 的回傳內容)，可以用 `rxResource` 包裝，使之成為 Resource，並同樣擁有 loading、error 等狀態管理功能。
* `httpResource()`：這是 Angular 19.2 引入、Angular 20 強化的新介面。它建構在 `resource` 之上，而內部則是直接包裝使用 Angular HttpClient 發送請求。我們只需提供 URL 或請求資訊，它便會回傳一個帶有 Signals 狀態的資源物件，方便地處理 HTTP 資料載入，是對 HttpClient 的高階封裝。特別的是，`httpResource` 支援完整的 HTTP 選項設定以及內建快取、錯誤處理和載入狀態指示等功能。

接下來，我們將分別介紹這三種函式的使用方式與範例程式碼，並比較它們與傳統 HttpClient 用法的不同。

## 使用 resource() 建立非同步資源

先從最基本的 [resource()](https://angular.dev/api/core/resource) 開始。`resource()` 函式可以讓我們定義一個會自動追蹤參數變化並執行非同步載入的資源。使用時需要傳入一個物件，其中包含兩個主要屬性：`params` 和 `loader`。

* `params`: 一個函式，回傳此資源所需的參數。它可以讀取其他 Signals 的值，當那些依賴的 Signals 發生變化時，`params` 會重新計算，進而觸發 loader 的執行。
* `loader`: 一個非同步函式，接收一個物件 (包含 params、previous 以及 abortSignal），負責真正執行資料獲取（例如發出 HTTP 請求或其他 Promise 操作）。每當 `params` 的結果改變時，Angular 會自動呼叫這個 `loader` 以取得新資料。

`resource()` 會回傳一個 [ResourceRef](https://angular.dev/api/core/ResourceRef) 物件，我們可以從中取得多種 Signal 屬性來反應式地使用結果，包含：

* `value()`：載入完成後的結果值 (尚未載入前為 undefined，除非提供了 defaultValue)。
* `error()`：載入過程中發生的錯誤對象（若從未錯誤過則為 undefined）。
* `isLoading()`：布林值，表示目前是否正在載入中。
* `hasValue()`：布林值，表示是否已經取得過至少一次值。
* `status()`：字串，表示當前資源狀態，可能值如 `'idle' | 'error' | 'loading' | 'reloading' | 'resolved' | 'local'`，可以參考 [ResourceStatus](https://angular.dev/api/core/ResourceStatus)。

以下是一個使用 `resource()` 的簡單範例。我們模擬一個使用者資料頁面，透過 userId Signal 來載入不同使用者的資訊：

```typescript
import { Component, signal, resource, computed, effect } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <h3>使用者資料</h3>
    @if(userResource.isLoading()) {
      <div>資料載入中...</div>
    } @else if(userResource.error()) {
      <div>載入失敗：{{ userResource.error().message }}</div>
    } @else {
      <p>姓名：{{ user().name }}</p>
      <p>Email：{{ user().email }}</p>
    }
    <button (click)="reloadData()">重新載入</button>
  `
})
export class UserProfileComponent {
  private userService = inject(UserService);
  // 假設 userId 來自路由或其他來源，這裡我們用訊號模擬
  userId = signal('u123');

  // 使用 resource() 根據 userId 載入使用者資料
  userResource = resource({
    params: () => this.userId(),  // 依據目前的 userId Signal 決定要載入哪個使用者
    loader: ({ params, abortSignal }) => 
      // 呼叫 UserService 取回使用者資料（回傳 Promise 或使用 fetch）
      this.userService.fetchUserById(params).catch(err => {
        // 可以在這裡額外處理錯誤或轉換
        throw err;  // 丟出錯誤以便讓 resource 捕捉到傳給 error 信號
      }),
    defaultValue: { id: '', name: '', email: '' }  // 預設值，避免未載入前 value 為 undefined，沒有 `defaultValue` 的話，一開始資料就會是 undefined
  });

  // 將 resource 的值作為一個 Signal 使用
  user = this.userResource.value;

  reloadData() {
    // 手動重新載入當前 userId 的資料
    this.userResource.reload();
  }
}
```

在上述程式碼中，我們定義了一個 `userId` Signal，以及一個 `userResource`。它的 params 參數回傳目前的 `userId`，而 `loader` 會透過 `UserService.fetchUserById` 發出 HTTP 請求取得使用者資料。

每當 `userId()` 的值改變時，`userResource` 會自動重新執行 loader 取得新資料，而不需要我們手動訂閱或管理先前請求。

`resource` 會確保只有最後一次請求的結果會被採用，多餘的請求結果將自動被忽略 (類似 RxJS switchMap 的行為)。同時，Angular 也會在參數改變時自動取消先前還未完成的請求，透過傳入的 AbortSignal 幫助中止舊請求。

{% note warning %}

`loader` 函式本身不會追蹤裡面使用的其他 Signals。也就是說，如果你在 `loader` 中讀取了某個 Signal 的值，而該值後續改變了，不會直接觸發新的載入。只有在 `params` 所回傳的內容改變時才會重新執行 `loader`。因此，所有會影響資料載入的條件都應該放入 `params` 計算中，確保變化能被偵測。

{% endnote %}

## 使用 rxResource() 整合 RxJS 資料流

有時我們的非同步資料來源已經是 Observable 物件 (例如 HttpClient 回傳的 Observable)。[rxResource](https://angular.dev/api/core/rxjs-interop/rxResource) 就是為了這種情況設計的。它的用法與 `resource()` 幾乎相同，不同點在於我們提供的是 stream 而不是 Promise，也就是需要使用 Observable 物件。

`rxResource()` 的參數選項與 `resource()` 類似：

* `params`: 定義依賴的參數（跟 `resource` 相同）。
* `stream`: 定義一個函式，利用 `params` 去產生一個 Observable 串流，例如呼叫 `HttpClient.get()` 或其他 RxJS 操作，回傳 `Observable<T>`。
* 以及選用的 `defaultValue`、`equal` 等配置。

{% note warning %}

如果你是在 Angular 19 使用 rxResource 的話，`stream` 要改成 `loader`，因為 Angular 20 才重新將名稱正名為 `stream`

{% endnote %}

當 `params` 改變時，`rxResource` 會自動取消先前的 Observable 訂閱並訂閱新的 Observable，以取得資料並更新其內部的 Signals 狀態。 來看看一個範例：假設我們有一個商品搜尋列表元件，使用者輸入關鍵字後需要查詢對應的商品列表。我們可以使用 `rxResource` 將 HttpClient 的請求結果轉為資源：

```typescript
import { Component, signal, rxResource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface Item { id: number; name: string; }

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="keyword" placeholder="搜尋商品" />
    <button (click)="search()">搜尋</button>
    @if(itemsResource.isLoading()) {
      <div>查詢中...</div>
    }
    <ul>
      @for (let item of items()) {
        <li>{{ item.name }}</li>
      }
    </ul>
    @if(itemsResource.error()) {
      <div>發生錯誤：{{ itemsResource.error().message }}</div>
    }
  `
})
export class ItemListComponent {
  private http = inject(HttpClient);

  keyword = model('');  // 雙向繫結用的搜尋字串
  
  itemsResource = rxResource<Item[], string>({
    // 每當 keyword 改變，就使用新關鍵字進行查詢
    params: () => this.keyword(),
    // stream 使用 HttpClient 呼叫後端 API，回傳 Observable<Item[]>
    stream: ({ params }) => this.http.get<Item[]>(`/api/items?search=${params}`).pipe(
      // 簡單錯誤處理：若發生錯誤，回傳空陣列，並讓 resource.error 捕捉錯誤資訊
      catchError(err => {
        console.error('查詢錯誤', err);
        // 將錯誤丟出以讓 itemsResource.error() 捕捉
        throw err;
        // 或者我們也可以選擇回傳 of([]) 讓串流不要錯誤，而 error 信號維持 undefined
      })
    ),
    defaultValue: []  // 預設空陣列，確保 items() 初始可迭代
  });

  // Resource 的值 Signal
  items = this.itemsResource.value;
}
```

上述程式中，`keyword` 是我們將使用者輸入關鍵字包裝成的 Signal。`rxResource` 定義了 `params` 為 `keyword()` 的當前值，`stream` 則使用 Angular HttpClient 發出 GET 請求取得商品列表。當關鍵字 `keyword()` signal 改變時，`rxResource` 會自動取消上一次的請求訂閱並發出新請求。

透過 `itemsResource.isLoading()` 可以顯示「查詢中...」的狀態，而請求成功後 `items()` Signal 會提供最新的商品列表來顯示。

如果發生錯誤，會將錯誤資訊存在 `itemsResource.error()` 內，方便我們後續處理。

{% note info %}

在 `rxResource` 的 stream 中可以使用 RxJS 的 `catchError` 來處理錯誤。如果想讓 Resource 的 error Signal 介入處理，可以在 catchError 裡 throw err 將錯誤重新拋出，讓 Resource 接管錯誤狀態；或者你也可以在 `catchError` 中回傳一個預設值 Observable(例如 `of([])`)，如此一來整個串流不會噴錯，但要注意此時 `error()` Signal 就不會有內容，而是以正常值 (如提供的空陣列) 存到 `value` 內結束。

{% endnote %}

## 使用 httpResource() 發送 HTTP 請求

[httpResource](https://angular.dev/api/common/http/httpResource) 是建立在 Resource API 基礎上的高階函式，用於處理 HTTP 請求。它讓我們以更簡潔的方式取得 HttpClient 的資料，同時還可以擁有 Signals 狀態管理的優勢。

`httpResource` 內部直接使用了 Angular 的 HttpClient 作為 `loader、保留了` HttpClient 的所有特性 (例如可套用 HttpInterceptor、可以和 HttpClient 進行一樣的測試等等)，但使用起來像操作 Signals 一樣簡單，而且會自動在 Signal 變化時重新發送請求。

使用 `httpResource()` 非常直接。我們只需提供一個參數，可以是：

* **回傳字串的函式**：例如 `() => \${baseUrl}/users/${userId()}`，允許 URL 動態依據 Signal 改變。當函式依賴的 Signal 值改變時，將自動觸發新的 HTTP 請求。
* **回傳 HttpResourceRequest 的函式**：允許動態改變不只是 URL，還包括 method、headers 等整組請求參數。

`httpResource` 會回傳一個 [HttpResourceRef<T>](https://angular.dev/api/common/http/HttpResourceRef)，其擁有的 Signal 屬性與一般 resource 相似，包括 `value()`、`error()`、`isLoading()`、`status()` 等，同時也額外提供 HTTP 特有的資訊 Signals，例如 `headers()` (回應標頭)、`statusCode()` (狀態碼)、`progress()` (進度百分比，在請求有設定回報進度時)。我們不再需要額外透過 HttpResponse 去取得這些資訊，直接使用 Signals 就可以了，真的超方便的啦！

以下是個簡單的使用 `httpResource` 的範例，假設我們要實作一個分頁的使用者列表：

```typescript
// 假設有兩個 Signal 控制當前的分頁與每頁數量
page = signal(0);
pageSize = signal(10);

// 定義 httpResource，使用函式傳入請求資訊，使其對 page/pageSize 變化具反應性
usersResource = httpResource<{
  users: User[];
  totalPages: number;
}>(() => ({
  url: '/api/users',
  method: 'GET',
  // 將分頁參數附加在查詢參數中
  params: { 
    page: this.page(), 
    limit: this.pageSize() 
  }
}));
```

上面範例中，我們透過函式傳回一個包含 URL 和 params 的物件給 `httpResource`。每當 `page` 或 `pageSize` 的值變動時，該函式回傳的內容就會改變（因為它呼叫了 `this.page()` 等），`httpResource` 會偵測到變化並自動發出新的 GET 請求。這非常適合用在分頁、篩選等場景，當使用者切換頁碼或修改篩選條件時，我們不需手動寫額外的邏輯，只要更新對應的 Signal 值就會自動重新抓取資料。

{% note info %}

`httpResource` 預設會將回傳內容解析為 JSON。如果需要處理純文字、Blob 或 ArrayBuffer 等非 JSON 資料，`httpResource` 提供了對應的靜態方法如 `httpResource.text()`、`httpResource.blob()`、`httpResource.arrayBuffer()` 來建立相應型別的資源，比起以前使用 HttpClient，真的是簡化非常多。

{% endnote %}

## 傳統 HttpClient 寫法 vs. Resource API 差異

引入 Resource API 後，Angular 在處理 HTTP 資料流方面有了顯著不同。以下以對照範例說明傳統做法與 Resource API 的差異

**首先是傳統 HttpClient 用法：**

```typescript
export class UsersComponent implements OnInit {
  http = inject(HttpClient);
  users: User[] = [];
  isLoading = false;
  error: any;

  ngOnInit() {
    this.isLoading = true;
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err;
        this.isLoading = false;
      }
    });
  }
}
```

在過去使用 HttpClient 寫法中，我們必須自己管理 `isLoading` 的狀態開關、進行錯誤處理。若資料需要根據某些參數變化重新載入（例如路由參數改變），通常我們還需要在 `ngOnChanges` 或透過 `switchMap` 等額外寫邏輯，整體而言比較繁瑣，學習成本也比較高。

**使用 Resource API 的寫法：**

```typescript
export class UsersComponent {
  usersResource = httpResource<User[]>('/api/users');
  users = this.usersResource.value;
  // isLoading 和 error 都可以直接從 resource 獲取，不需要自己定義變數
  // isLoading = this.usersResource.isLoading;
  // error = this.usersResource.error;

  // 透過 computed 取代過去的 rxjs operators，類似 HttpClient + RxJS map 的用法
  userIds = computed(() => this.users().map(user => user.name));

  // 透過另外一個 resource 請求來轉換原始請求，類似 HttpClient + RxJS switchMap 的用法
  userNames = httpResource<string[]>(() => ({
    url: '/api/user-names',
    params: { ids: this.userIds() }  // 假設我們需要根據 userIds 重新載入
  }));
}
```

可以看到，新寫法大幅簡化了程式碼：不必手動維護 loading/error 狀態。這些都由 Resource API 自動管理。

此外，如果我們希望基於某個變數變化自動重新取資料，只需將該變數以 Signal 方式宣告，並加入 `params`（或直接在 httpResource 的 URL 函式中使用）即可，無需額外寫監聽邏輯。

同時在很多情況下，也可以透過 `computed` 甚至更多的 `resource`/`rxResource`/`httpResource` 等 Signal 相關 API 來簡化過去學習 RxJS operators 的成本。

{% note info %}

以個人最近使用 Resource 相關 API 的經驗來說，真的確實少寫很多 RxJS operators 了，身為曾經是本 RxJS 書籍的作者來說，心裡真是五味陳雜啊...

當然不是說 RxJS 就用不到了，比較複雜的情境還是 RxJS 的天下，但在大部分的常見情境下，Resource + Signals 已經可以搞定絕大多數的工作了。

{% endnote %}

## 本日小節

`resource` / `rxResource` / `httpResource` 的出現，代表 Angular 在 reactive programming 以及非同步程式設計的發展道路上又向前邁進了一大步。

這套 Resource API 為非同步資料處理提供了更直觀且強大的工具，我們不用再手忙腳亂地訂閱/退訂 Observable 物件、不用額外管理一堆狀態變數，就能優雅地撰寫出乾淨的程式來處理資料載入。

今天我們介紹了它們的使用方法，提供了實際範例，並比較了與傳統 HttpClient 的差異。如果你還沒嘗試過 Resource API，非常鼓勵動手實作看看，相信會對它帶來的簡潔與便利感到驚喜！
