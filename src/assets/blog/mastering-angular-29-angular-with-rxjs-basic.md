---
title: "[Angular 大師之路] 在 Angular 中應用 RxJS 的 operators (1) - 基礎篇"
date: 2018-11-13 21:51:21
category: "Angular 大師之路"
tags:
  - Angular
  - RxJS
  - map
  - tap
  - switchMap
  - mergeMap
  - concatMap
  - exhaustMap
  - combineLatest
  - forkJoin
  - startWith
---

在前兩天介紹 AsyncPipe 時，我們不難發現當進入 RxJS 思維時，搭配 AsyncPipe 可以帶來非常多的好處！雖然透過這種不使用 `subscribe()` 訂閱的方式，對於許多剛進入 Angular 或 RxJS 世界的朋友會感到不適應；尤其是當有更多複雜資料要處理時，不使用 `subscribe()` 訂閱後處理資料還真的不知道該如何處理是好。

其實只要透過 RxJS 提供的運算子(operators)，便能夠幫助我們減少大量的程式，並寫出更加好維護的程式碼！這兩天就讓我們來看看一些我個人在開發 Angular 時常用的 RxJS 應用技巧吧！

<!-- more -->

**類型**：觀念/技巧

**難度**：4 顆星

**實用度**：5 顆星

# map 

RxJS 提供的 `map()` operator 跟我們在 JavaScript 使用的 `map()` 非常類似，不同的是 JavaScript 的 `map()` 是**將一個陣列換成另外一個陣列**，而 RxJS 則是**將一個訂閱可以得到的資料轉換成另外一筆資料**，例如：

```typescript
title$ = this.httpClient.get('...').pipe(
  map(data => data.title)
);
```

以上程式使用 `HttpClient` 的 `get()` 方法取的資料，並透過 `map()` operator 將原來的資料轉換成另外一個資料，此時 `title$` 就不會得到 Http Request 取得的資料，而是轉換後的結果！

另外一種常用的情境將是：有一個元件需要帶入一個陣列，當作選單資料來源，而在從網路取得資料後，希望能加入一筆預設值，此時也是使用 `map()` 的絕佳時機：

```typescript
menuItems$ = this.httpClient.get('...').pipe(
  map(items => [{label: 'Please Select', value: null}, ...items])
);
```

`map()` 的使用頻率非常高，只要當資料需要進行轉換時，都是使用 `map()` 的最好時機！

# tap

`tap()` 不會幫我們做認資料的變換，也不會影響整個 RxJS 資料流方向，某種程度的意思是「什麼都不影響」，然而在 `tap()` 內是可以寫一些程式的，只是跟 RxJS 整個流向無關而已，因此最常使用的就是在 `tap()` 內加個 `console.log` 就能夠方便我們進行一些除錯，如下：

```typescript
title$ = this.httpClient.get('...').pipe(
  tap(data => console.log(data)), // 在 map() 前先印一次資料
  map(data => data.title),
  tap(data => console.log(data)) // 在 map() 後再次印一次，觀察 map 內程式的結果
);
```

透過 `tap()` ，搭配 `console.log` 就能夠確保我們使用的 operators 邏輯是否正常啦！

另外，當我們嚐到 AsyncPipe 的甜頭後，在程式中幾乎會將 `subscribe()` 全部移除，但偶爾真的遇到需要把資料暫存的情境呢？這時候也能夠使用 `tap()` ，暫時將資料存下來，做額外的處理！

```typescript
data$: Observable<any>;
data: any;
  
ngOnInit() {
  this.data$ = this.httpClient.get('...').pipe(
    tap(data => this.data = data)
  );
}

buttonClick() {
  this.data.title = 'Hello';
}
```

# switchMap

`switchMap()` 可以在收到 observable 資料時，轉換成另外一個 observable，不使用 `switchMap()` 時，什麼時候有可能會把 observable 資料換成另一個 observable 呢？比較常見的是路由內容(observable)變更時，再去 API 請求(observable)資料，當使用 `subscribe()` 時，看起來會如此：

```typescript
constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

ngOnInit() {
  this.route.params.subscribe(params => {
    this.httpClient.get(`.../post/${params['id']}`).subscribe(post => {
      this.post = post;
    })
  });
}
```

這種巢狀的 `subscribe()` 可以說是 RxJS 中最常見的一種 anti pattern，就算沒有 Angular 的 AsyncPipe，也應該只要有一層 `subscribe()` 好！而當有一系列有前後順序必要的 observable 時，該怎麼處理呢？這時候就可以使用 `switchMap()`！如下：

```typescript
this.route.params.pipe(
  switchMap(params => this.httpClient.get(`.../post/${params['id']}`))
)
```

如果有一系列的轉換，且資料都要保存起來呢？可以再額外透過 `map()` 最終組成一個大物件：

```typescript
this.postData$ = this.route.params.pipe(
  switchMap(params => this.httpClient.get(`.../post/${params['id']}`).pipe(
    map(post => ({ id: params['id'], post: post }))
  )),
  switchMap(post => this.httpClient.get(`.../comments/${post.id}`).pipe(
    map(comments => Object.assign(post, { comments: comments }))
  ))
)
```

除了 `switchMap` 外，另外還有常見的 `concatMap`、`mergeMap` 和 `exhauseMap`，都是用來把 observable 資料轉換成另外一個 observable，只是在資料流中有不同的處理方式，有興趣就自行上官方文件看看囉！

# combineLatest

在剛剛討論 `switchMap` 時，我們的呼叫是有順序的，而當沒有順序時，我們可能會希望平行的處理 observable，並將所有 observable 有資料後才進行後續處理，這時候就可以使用 `combineLatest` 來同時取得資料，不會有順序問題！

```typescript
const posts$ = this.httpClient.get('.../posts');
const tags$ = this.httpClient.get('.../tags');

this.data$ = combineLatest(posts$, tags$).pipe(
  map(([posts, tags]) => ({posts: posts, tags: tags}))
)
```

我們也可以整合畫面上各種事件最終得到結果，例如一個包含搜尋、排序和分頁的資料，我們可以將搜尋、排序和分頁都設計成單一個 observable，在使用 `combineLatest` 產生搜尋結果，如下：

```typescript
this.products$ = combineLatest(
  this.filterChange$,
  this.sortChange$,
  this.pageChange$
)
.pipe(
  exhaustMap(([keyword, sort, page]) =>
    this.httpClient.get(`.../products/?keyword=${keyword}&sort=${sort}&page=${page}`))
);

```

# startWith

在使用 `combineLatest` 時，會在 `combineLatest` 內每個 observable 都有資料時才會最終取得新的結果，若是以剛才討論的搜尋程式，希望在程式一開始就給空的資料來產生搜尋結果時，就可以使用 `startWith` 來確保 observable 可以有起始的資料：

```typescript
this.products$ = combineLatest(
  this.filterChange$.pipe(startWith('')),
  this.sortChange$.pipe(startWith({})),
  this.pageChange$.pipe(startWith({}))
)
.pipe(
  exhaustMap(([keyword, sort, page]) =>
    this.httpClient.post(`.../products`, { keyword: keyword, sort: sort, page: page}))
);
```

# forkJoin

`forkJoin` 與 `combineLatest` 類似，差別在於 `combineLatest` 在 RxJS 整個資料流有資料變更時都會發生，而 `forkJoin` 會在所有 observable 都完成(complete)後，才會取得最終的結果，所以對於 Http Request 的整合，我們可以直接使用 `forkJoin` 因為 Http Request 只會發生一次，然後就完成了！

```typescript
const posts$ = this.httpClient.get('.../posts');
const tags$ = this.httpClient.get('.../tags');

this.data$ = forkJoin(posts$, tags$).pipe(
  map(([posts, tags]) => ({posts: posts, tags: tags}))
)
```

# 本日小結

今天我們把一些個人在開發 Angular 時常用的單一個 RxJS operator，當有了更多的實際案例後，就能夠產生越來越多有創意的變化囉！明天我們再來討論一些比較複雜的 RxJS operators 應用吧！

# 相關資源

- [map](https://rxjs-dev.firebaseapp.com/api/operators/map)
- [tap](https://rxjs-dev.firebaseapp.com/api/operators/tap)
- [switchMap](https://rxjs-dev.firebaseapp.com/api/operators/switchMap)
- [mergeMap](https://rxjs-dev.firebaseapp.com/api/operators/mergeMap)
- [concatMap](https://rxjs-dev.firebaseapp.com/api/operators/concatMap)
- [exhaustMap](https://rxjs-dev.firebaseapp.com/api/operators/exhaustMap)
- [combineLatest](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest)
- [forkJoin](https://rxjs-dev.firebaseapp.com/api/index/function/forkJoin)
- [startWith](https://rxjs-dev.firebaseapp.com/api/operators/startWith)
