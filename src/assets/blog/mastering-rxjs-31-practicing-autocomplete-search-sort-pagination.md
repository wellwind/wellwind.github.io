---
title: "[RxJS] 實戰練習 - 自動完成 / 搜尋 / 排序 / 分頁"
date: 2020-10-16 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - ajax
  - map
  - switchMap
  - debounceTime
  - distinctUntilChanged
  - share
  - shareReplay
  - filter
  - take
  - startWith
  - catchError
  - mapTo
  - scan
---

今天我們用實際的例子來練習各種 RxJS operators 的組合運用！在一般的應用程式裡面，資料查詢應該算是非常常見的情境了，我們就實際使用資料查詢的功能做範例，加上各種變化，來練習一些 operators 的實際使用吧！

<!-- more -->

# 起始專案

由於我們主要的練習目標是 RxJS，因此許多關於畫面操作的部分，都已經先設計好了，可以到以下網址以起始專案開始練習：

https://stackblitz.com/edit/mastering-rxjs-practice-search-starter

{% note info %}

如果想要跟著練習，建議可以 fork 一份到自己的帳號下，以後可以隨時回來看成果。

{% endnote %}

練習過程中，也可以參考完整版程式碼：

https://stackblitz.com/edit/mastering-rxjs-practice-search-finished

## 預期功能及畫面

在這個專案中，我們要練習使用 [GitHub Search API](https://docs.github.com/en/free-pro-team@latest/rest/reference/search#search-repositories) 來依照指定的名稱搜尋 repositories，預期完成畫面如下：

{% asset_img 01.jpg %}

包含一些基本功能：

- 依照關鍵字搜尋 GitHub repositories
- 分頁功能，包含每頁幾筆及顯示第幾頁
- 排序功能，可依照 stars 或 forks 進行排序

另外還包含了搜尋時的「自動完成」功能：

{% asset_img 02.jpg %}

當輸入文字時，可以提供符合文字的 repositories 建議。

## 相關檔案

在起始專案的 `index.html` 內已經把基本的 HTML 都寫好了，另外在 `index.ts` 內也預先 import 已經寫好的操作邏輯

```typescript
// 畫面上的 DOM 物件操作程式
import * as domUtils from './dom-utils';
// 存取 API 資料的程式碼
import * as dataUtils from './data-utils';
```

`dom-utils.ts` 內都是操作畫面的邏輯，但這不是主要練習的部分，現在前端 SPA 框架的盛行，不同框架會有不同的畫面操作方式，單純操作 DOM 物件其實是髒活，所以大概知道有些什麼功能就好囉：

- `fillAutoSuggestions`：顯示自動完成的建議內容
- `fillSearchResult`：顯示搜尋結果
- `loading`：當開始搜尋資料時，呼叫此方法將畫面遮罩，避免多餘的操作
- `loaded`：當完成搜尋後，呼叫次方法隱藏畫面遮罩，以便進行其他操作
- `updatePageNumber`：更新頁碼的畫面資訊
- `updateStarsSort`：更新依照 stars 排序的畫面資訊
- `updateForksSort`：更新依照 forks 排序的畫面資訊

而在 `data-utils.ts` 內，則是 GitHub API 的呼叫，這裡使用 RxJS 內提供的 `ajax` 來抓取呼叫 API 的內容，並使用 `map` operator 來將需要的內容抓出來，例如「取得建議清單」的程式碼如下：

```typescript
const baseUrl = `https://api.github.com/search/repositories`

export const getSuggestions = (keyword: string) => {
  const searchUrl = `${baseUrl}?q=${keyword}&per_page=10&page=1`;
  return ajax(searchUrl).pipe(
    map(response => response.response.items),
    map(repositories =>
      repositories.map(repository => repository.full_name))
  );
};
```

上述程式碼的第 7 行使用的是 RxJS 內的 `map` operator，而第 8 行使用的是 JavaScript 內建陣列的 `map`，有些時候在閱讀上會不小心造成誤解，這時候可以把裡面的實作邏輯也抽出來，會變得更好閱讀：

```typescript
// 將陣列的處理抽成 function
const toSuggestionList = (repositories) => {
  return repositories.map(repository => repository.full_name)
};

export const getSuggestions = (keyword: string) => {
  const searchUrl = `${baseUrl}?q=${keyword}&per_page=10&page=1`;
  return ajax(searchUrl).pipe(
    map(response => response.response.items),
    map(toSuggestionList)
  );
};
```

此時原來程式就可以閱讀成「將回傳結果轉換成建議清單 (map to suggestion list)」，在實作程式碼比較複雜，或是閱讀上比較不好理解時，適當的將程式碼抽成好讀好理解的 function 對於未來開發和維護都會有加分效果喔！

`data-utils.ts` 內還有一個 `getSearchResult` 方法，是用來取得搜尋結果的，實作基本上大同小異，只是帶入更多的參數而已，就不浪費篇幅在這說明了，有興趣的話可以看一下囉。

# 實作自動完成功能

接著我們來實際做出自動完成的功能，自動完成要做的事情非常簡單，就是在打字時，呼叫 `dataUtils.getSuggestions()` 方法來取得要顯示的清單，並且呼叫 `domUtils.fillAutoSuggestions()` 即可。

## 取得事件資訊

我們可以使用 `fromEvent` 來監聽輸入框的 `input` 事件：

```typescript
const keyword$ = fromEvent(document.querySelector('#keyword'), 'input');
```

此時訂閱的話回得到 `input` 相關的事件，然而我們實際上需要關注的是輸入的內容，因此可以使用 `map` 來進行轉換：

```typescript
const keyword$ = fromEvent(document.querySelector('#keyword'), 'input').pipe(
  map(event => (event.target as HTMLInputElement).value)
);
```

這邊使用了 `event.target` 來取得事件來源的 DOM 物件，由於是一個 `input` 輸入框，因此可以使用 `.value` 來取得相關的值，`as HTMLInputElement` 是 TypeScript 的型別轉換，讓我們可以明確的知道 `input` 輸入框有哪些屬性可用。

此時 `keyword$` 就是一個「關鍵字內容的資料流」，我們可以再將此資料流搭配各種其他的 operators 來產生出不同的變化。

## 將事件轉換成查詢 Observable

現在已經可以拿到輸入的關鍵字了，接下來要把關鍵字帶入 `domUtils.getSuggestions()` 方法來查詢，最簡單的方法如下：

```typescript
keyword$.subscribe(keyword => {
  domUtils.getSuggestions(keyword).subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
  });
});
```

不用多說，這種巢狀的 `subscribe` 是應該盡力避免的，因此我們改用 `switchMap` operator 來協助我們「將某個事件值換成另一個 Observable」：

```typescript
keyword$
  .pipe(
    switchMap(keyword => dataUtils.getSuggestions(keyword))
  )
  .subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
  });
```

使用 `switchMap` 可以在來源資料變更時，退訂上一次的 Observable 訂閱，因此永遠會以最新的來源資料及轉換後的 Observable 為主，如此可以確保我們拿到的資料一定是使用最新的 `keyword` 關鍵字查詢的結果。

{% note info %}

這邊說明一下為何不使用其他 `xxxMap` 系列的 operators：

- `concatMap`：雖然會拿到最後的資料，但因為不會退訂上一次 Observable 訂閱的關係，需要等之前 keyword 變更的查詢都結束，會花費比較多時間。
- `mergeMap`：每次 keyword 變更都會立刻查詢，不退訂之前的 Observable，加上 API 呼叫是非同步的關係，我們沒辦法確保最後一次會來的結果一定就是最新的查詢結果，因此查詢結果會不穩定。
- `exhaustMap`：在之前 Observable 查詢完成之前，有任何新的事件都會被忽略掉，因此只要事件更新前轉換的 Observable 沒結束，就不會拿到新事件的查詢結果。

如果不明白這幾個 operators 的差別，請先看過之前寫的文章：

[[RxJS] 轉換類型 Operators (2) - switchMap / concatMap / mergeMap / exhaustMap](https://wellwind.idv.tw/blog/2020/10/04/mastering-rxjs-19-switchmap-concatmap-mergemap-exhaustmap/)

{% endnote %}

此時已經可以在每次輸入關鍵字就進行查詢囉，但還有很多需要加強的地方！

## 避免資料一變更就查詢

GitHub API 在未驗證時有限制每分鐘只能進行 10 次查詢(有驗證時限制每分鐘 30 次查詢)，這是為了保護伺服器被大量搜尋的機制(稱為 Rate Limits)，在實際應用上，我們也應該要盡可能避免使用者產生大量的查詢，以免前端的疏失操成後端的效能低落，因此在這裡我們可以再加上一個 `debounceTime` operator，來避免一有新事件就查詢的問題：

```typescript
keyword$
  .pipe(
    // 避免一有新事件就查詢
    debounceTime(700),
    switchMap(keyword => dataUtils.getSuggestions(keyword)),
  )
  .subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
  });
```

`debounceTime` 可以在指定的時間內都沒有新事件發生後，才以最後一次的事件值進入下一個步驟，透過這種方式，就可以避免一直打字一直查詢的問題囉。

## 避免重複文字查詢

想像一下，假設目前輸入的內容是「rxjs」，並且已經完成一次建議清單的查詢，接著我們繼續輸入變成「rxjsdemo」，但想了一下又刪掉變回「rxjs」，然後 `debounceTime` 的控制時間才過去，新的事件資料跟上一次的事件資料一樣都是「rxjs」，如果資料其實並沒有改變，還需要再進行一次查詢嗎？這時候當然就可以省略不查詢了，因此可以使用 `distinctUntilChanged` operator，只有當新的事件值與上一次的事件值不同時，才會繼續讓事件發生：

```typescript
keyword$
  .pipe(
    debounceTime(700),
    // 避免重複的查詢
    disintctUntilChanged(),
    switchMap(keyword => dataUtils.getSuggestions(keyword)),
  )
  .subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
  });
```

{% note info %}

如果要避免資料重複，為何不使用 `distinct` 呢？以這邊的例子來說，當我把資料變更成「rxjsdemo」時，如果有產生新的查詢，下一次變更回「rxjs」時，由於 `distinct` 的設計是「整個資料流的事件值不會重複」，因此「rxjs」事件值在整個資料流過程已經發生過了會被忽略掉，導致沒有正確查詢，畫面顯示錯誤的資料。

而使用 `distinctUntilChanged`，則只有跟「上一次」事件值相同才會忽略，因此可以避免掉 `distinct` 的問題。

`distinct` 和 `distinctUntilChanged` 的差別，可以參考之前寫的文章：

[[RxJS] 過濾類型 Operators (4) - distinct / distinctUntilChanged / distinctUntilKeyChanged](https://wellwind.idv.tw/blog/2020/10/09/mastering-rxjs-24-distinct-distinctuntilchanged-distinctuntilkeychanged/)

{% endnote %}

## 避免查出不精準的內容

最後來微調一下，如果不管資料長度都會進行搜尋，就會導致一開始只輸入一個「r」這樣的資料時就會開始進行搜尋，而得到比較不精準的內容，因此可以再做個調整，讓查詢內容大於某個長度時才進行搜尋，例如至少要 3 個字，此時使用最基本的 `filter` operator 就可以了：

```typescript
keyword$
  .pipe(
    debounceTime(700),
    disintctUntilChanged(),
    // 避免內容太少查出不精準的結果
    filter(keyword => keyword.length >= 3),
    switchMap(keyword => dataUtils.getSuggestions(keyword)),
  )
  .subscribe(suggestions => {
    domUtils.fillAutoSuggestions(suggestions);
  });
```

透過這些 operators 的控制，就能設計出兼顧效能及準度的自動建議功能啦。

像這樣的程式碼，可以想想看沒有各種 operators 加持的情況下，要判斷多少狀態、條件，而有了 RxJS 及各種 operators，真的可以幫助我們大幅減少許多程式碼的撰寫！

# 實作關鍵字搜尋功能

關鍵字的建議及自動完成功能搞定了，接著先來單純的針對關鍵字進行搜尋，這裡我們希望按下「search」按鈕時，才針對我們要的關鍵字進行查詢：

## 取得事件資訊

一樣的，我們可以使用 `fromEvent` 來將按鈕事件包裝成 Observable

```typescript
const search$ = fromEvent(document.querySelector('#search'), 'click');
```

接著我們就需要在事件發生時，依照輸入的關鍵字進行搜尋。

## 將事件轉換成查詢 Observable

我們一樣可以透過 `switchMap` operators 來將按鈕事件轉換成查詢資料的 Observable：

```typescript
search$.pipe(
  switchMap(() => dataUtils.getSearchResult(
    (document.querySelector('#keyword') as HTMLInputElement).value)
  )
).subscribe(result => {
  domUtils.fillSearchResult(result);
});
```

第 2 行程式使用 `switchMap` 將事件轉換成查詢的 Observable，裡面的參數在第 3 行直接取得輸入框 DOM 物件資料。

在關鍵字內容部分，我們已經有一個 `keyword$` 的資料流了，不多加運用實在很可惜：

```typescript
const searchByKeyword$ = search$.pipe(
  switchMap(() => keyword$),
  switchMap(keyword => dataUtils.getSearchResult(keyword))
);

searchByKeyword$.pipe(
  switchMap(keyword => dataUtils.getSearchResult(keyword))
).subscribe(result => {
  domUtils.fillSearchResult(result);
});
```

我們建立了一個 `searchByKeyword$` 的 Observable，它會：

1. 當搜尋按鈕按下時，轉換成 `keyword$` Observable
2. 當 `keyword$` Observable 有新事件時，轉換查詢用的 Observable

但這樣會有兩個問題：

1. 轉換為 `keyword$` 後，還沒有新的事件發生，因此不會進行查詢，需要等 `keyword$` 有新事件才會查詢
2. 因為 `keyword$` 資料流不會結束(因為隨時可能輸入新的文字)，因此搜尋按鈕事件後，每次 `keyword$` 有新事件都會變成查詢，這不是我們要的，我們希望拿到最新的關鍵字後直接進行查詢，然後結束。

接著我們來解決這兩個問題

### 共享關鍵字資料流

由於轉換成 `keyword$` 後，需要等待新事件才會查詢，我們希望能立刻得到最後一次事件資料，因此我們可以使用 `shareReplay()` 將 `keyword$` 轉換成 Hot Observable 並將最後 N 次事件資料共享出來：

```typescript
const keyword$ = fromEvent(document.querySelector('#keyword'), 'input').pipe(
  map(event => (event.target as HTMLInputElement).value),
  // 共享最後一次事件資料
  shareReplay(1)
);
```

在這裡我們建立了 `keywordForSearch$` 的 Observable，專門給 `search$` 轉換使用，`keywordForSearch$` 內使用 `shareReplay(1)` 確保每次訂閱時會先拿到事件的最後一筆資料。

{% note info %}

為何不使用 `share()` 呢？由於 `share()` 實際上是建立一個 `Subject`，而 `Subject` 的特性是訂閱後需要等 `Subject` 有新事件才會得到資料，因此使用 `shareReplay()` 來建立 `ReplaySubject` ，`ReplaySubject` 會依照設定紀錄最近 N 次事件資料。

關於 `share()` 和 `shareReplay()` 背後默默做的事情及差異，可以參考之前的文章：

[[RxJS] Multicast 類 Operator (1) - multicast / publish / refCount / share / shareReplay](https://wellwind.idv.tw/blog/2020/10/15/mastering-rxjs-30-multicast-publish-refcount-share-sharereplay/)

{% endnote %}

### 確保 switchMap 內資料流會結束

確定可以拿到 `keyword$` 最後一次事件資料後，接著來處理事件不會結束的問題，這個問題很好解決，使用 `take` 就好，`take` operator 可以在訂閱後取得前 N 次事件資料，然後結束資料流，因此只需要設定成 1，就可以在拿到第一次資料後結束。

```typescript
const keywordForSearch$ = keyword$.pipe(
  // 取得一次資料流事件後結束
  take(1)
);
const searchByKeyword$ = search$.pipe(switchMap(() => keywordForSearch$));
```

整體流程就會變成：

1. `search$` 發生新事件，轉換成 `keywordForSearch$` Observable
2. `keywordForSearch$` Observable 使用 `keyword$` 作為來源，並且有 `shareReplay(1)` 的關係，會立刻得到最近一次 `keyword$` 的事件資料
3. 再加上 `take(1)`，因此在取得最近一次事件資料的同時，結束 Observable

### 排除按鈕事件比關鍵字事件早發生的問題

最後，還有一個問題：當搜尋按鈕按下時，如果 `keyword$` 還沒有事件資料，那麼轉換後的 `keywordForSearch$` 就不會立刻結束，此時會變成按下按鈕後，再變更搜尋文字才會進行查詢，這是不合理的，因此我們要給 `keyword$` 資料流一個初始資料：

```typescript
const keyword$ = fromEvent(document.querySelector('#keyword'), 'input').pipe(
  map(event => (event.target as HTMLInputElement).value),
  // 讓資料流有初始值
  startWith(''),
  // 共享最後一次事件資料
  shareReplay(1)
);
```

接著我們必須避免空字串的查詢，因此加上 `filter` 不讓空字串的事件發生：

```typescript
const searchByKeyword$ = search$.pipe(
  switchMap(() => keywordForSearch$),
  // 排除空字串查詢
  filter(keyword => !!keyword)
);
searchByKeyword$.pipe(
  switchMap(keyword => dataUtils.getSearchResult(keyword))
).subscribe(...);
```

如此一來，就將「關鍵字變更的資料流 (`keyword$`) 」和「按鈕事件的資料流 (`search$`)」整合成「依照關鍵字進行搜尋(`searchByKeyword$`)」的資料流囉。

# 實作排序與分頁功能

最後我們將分頁與排序都整合進搜尋功能，整個畫面就會很完整啦！

## 建立搜尋條件的 Observables

之前已經有 `searchByKeyword$` 依照關鍵字查詢的 Observable 了，接著我們要處理排序、分頁等條件的 Observables。

### 取得排序相關事件

在排序部分，我們希望預設能以 stars 數量降冪排序，也就是預設 stars 越多的越前面，同時能針對 stars 和 forks 進行升冪/降冪排序，stars 和 forks 是兩個不同的欄位，但排序是「一個資訊」，因此我們可以使用 `Subject` 類別，並分別訂閱兩個欄位的事件，來改變 `Subject` 資訊。

我們需要有一個預設的排序條件，同時在改變排序時也會需要這個排序資訊來決定下一次的排序方式，因此可以使用 `BehaviorSubject`。

```typescript
// 建立 BehaviorSubject，預設使用 stars 進行降冪排序
const sortBy$ = new BehaviorSubject({ sort: 'stars', order: 'desc' });
```

接著訂閱畫面上 stars 和 forks 的點擊事件，來改變這個 `sortBy$` 的事件值：

```typescript
const sortBy$ = new BehaviorSubject({ sort: 'stars', order: 'desc' });
const changeSort = (sortField: string) => {
  if (sortField === sortBy$.value.sort) {
    sortBy$.next({
      sort: sortField,
      order: sortBy$.value.order === 'asc' ? 'desc' : 'asc'
    });
  } else {
    sortBy$.next({
      sort: sortField,
      order: 'desc'
    });
  }
};

fromEvent(document.querySelector('#sort-stars'), 'click').subscribe(() => {
  changeSort('stars');
});
fromEvent(document.querySelector('#sort-forks'), 'click').subscribe(() => {
  changeSort('forks');
});
```

在 `changeSort` 方法裡面，我們可以使用 `sortBy$.value` 得到 `BehaviorSubject` 最近的事件值，並依此判斷接下來排序的規則。

### 取得每頁幾筆的事件

接著我們先來處理「每頁顯示幾筆」的下拉選單，我們可以很容易的使用 `fromEvent` 來將 `select` 的事件資料進行轉換，這部分跟 `keyword$` 非常類似，差別只在處理的來源和事件不同而已：

```typescript
const perPage$ = fromEvent(document.querySelector('#per-page'), 'change').pipe(
  map(event => +(event.target as HTMLSelectElement).value)
);
```

### 取得切換頁碼事件

最後是切換頁碼，實際上是兩個按鈕分別代表「上一頁」和「下一頁」，頁數分別會「減 1」和「加 1」，因此我們可以分別把按鈕事件變成 1 和 -1，以便用來計算下一頁的頁碼：

```typescript
const previousPage$ = fromEvent(
  document.querySelector('#previous-page'),
  'click'
).pipe(
  mapTo(-1)
);

const nextPage$ = fromEvent(
  document.querySelector('#next-page'), 
  'click'
).pipe(
  mapTo(1)
);
```

因為轉換的是一個固定不動的常數，因此可以直接使用 `mapTo` operator 進行轉換。

接著我們可以把這兩個 Observables 使用 `merge` 組合成一個 Observable，並使用 `scan` 來變更頁碼資訊：

```typescript
const page$ = merge(previousPage$, nextPage$).pipe(
  scan((currentPageIndex, value) => {
    const nextPage = currentPageIndex + value;
    return nextPage < 1 ? 1 : nextPage;
  }, 1)
);
```

透過這種方式，也可以輕鬆完成「下 5 頁」、「下 10 頁」的功能囉。

## 將搜尋條件的 Observable 組合

所有查詢相關的資料來源都準備完畢後，最後我們只需要把這些條件組合在一起就可以了，我們需要每個事件最後一次的資訊，因此可以使用 `combinteLatest` 來組合每個資料流最後的事件值，再將這些資料丟給 `dataUtils.getSearchResult()` 查詢：

```typescript
// 組合搜尋條件
const startSearch$ = combineLatest([
  searchByKeyword$,
  sortBy$,
  page$,
  perPage$
]);

// 將搜尋條件轉換成查詢 Observable
const searchResult$ = startSearch$.pipe(
  switchMap(([keyword, sort, page, perPage]) =>
    dataUtils.getSearchResult(keyword, sort.sort, sort.order, page, perPage)
  )
);

searchResult$.subscribe(result => {
  domUtils.fillSearchResult(result);
});
```

由於 `combineLatest` 是將裡面 Observables 的「最後一次事件」組合起來，因此若某個 Observable 還沒發生過事件，整個 `combineLatest` 組合的 Observable 都還不會有事件值，此時 `page$` 和 `perPage$` 都沒有啟始資料，因此就算按下搜尋，還不會有任何反應，所以最後針對 `page$` 和 `perPage$` 再使用 `startWith` 給予初始資料：

```typescript
const startSearch$ = combineLatest([
  searchByKeyword$,
  sortBy$,
  // 給予 page$ 初始資料
  page$.pipe(startWith(1)),
  // 給予 perPage$ 初始資料
  perPage$.pipe(startWith(10))
]);
```

基本的查詢、分頁和排序功能就完成啦！！

最後讓我們再來針對一些細節來做調整。

# 顯示頁碼/排序資訊

這部分很簡單，訂閱原來的事件，然後把事件資訊更新到畫面上就好了：

```typescript
page$.subscribe(page => {
  domUtils.updatePageNumber(page);
});

sortBy$.pipe(filter(sort => sort.sort === 'stars')).subscribe(sort => {
  domUtils.updateStarsSort(sort);
});

sortBy$.pipe(filter(sort => sort.sort === 'forks')).subscribe(sort => {
  domUtils.updateForksSort(sort);
});
```

以上程式直接訂閱 `page$`，並使用 `domUtils.updatePageNumber()` 更新頁碼資訊，而排序資訊則依照排序類型有兩個不同的方法呼叫，因此使用 `filter` 將不同的的排序欄位分成兩個 Observable，並各自訂閱然後呼叫各自對應的方法來更新排序欄位資訊。

# 查詢中的遮罩畫面

接下來我們需要在查詢資料時呼叫 `domUtils.loading()` 遮罩畫面，並在查詢結束時呼叫 `domUtils.loaded()` 隱藏遮罩，在查詢條件變更時就需要遮罩住畫面，因此訂閱 `startSearch$` Observable 即可：

```typescript
startSearch$.subscribe(() => {
  domUtils.loading();
});
```

接著在查詢完畢後，除了畫面更新外，也要將此遮罩隱藏：

```typescript
searchResult$
  .subscribe(result => {
    domUtils.fillSearchResult(result);
    domUtils.loaded();
  });
```

# 錯誤處理

當查詢過程發生錯誤時，整條訂閱的 Observable 會完全中斷，這也代表如果中途產生無法處理的錯誤，會造成之後無法繼續進行查詢作業，為了避免這個問題，我們可以使用 `catchError()` 來攔截並處理錯誤：

```typescript
searchResult$
  .pipe(
    // 處理搜尋事件的錯誤，以避免整個資料流從此中斷
    catchError(() => of([]))
  )
  .subscribe(result => {
    domUtils.fillSearchResult(result);
    domUtils.loaded();
  });
```

乍看之下沒什麼問題，當 `searchResult$` 發生錯誤時，攔截錯誤並給予空陣列，這樣便可以確保 `subscribe` 的 `next()` 可以收到資料，但 `catchError()` 回傳的 Observable 會讓目前訂閱的 Observable 剩下一個空陣列的資料然後結束，因此依然會讓整個訂閱結束，而導致無法繼續查詢。

這時候就要朝錯誤的源頭下手，也就是 `startSearch$.pipe(switchMap(...))` 內的 Observable，在這裡面進行錯誤處理，才不會讓整個 Observable 訂閱被結束，所以我們把查詢的程式拉出來，並加上錯誤處理機制：

```typescript
const getSearchResult = (
  keyword: string,
  sort: string,
  order: string,
  page: number,
  perPage: number
) =>
  dataUtils
    .getSearchResult(keyword, sort, order, page, perPage)
    .pipe(
      // 從查詢開始處理錯誤
      catchError(() => of([]))
    );
```

如此原來的 `searchResult$` 就不會有其他需要處理的錯誤，整個訂閱就不會因此而結束。

# 顯示錯誤訊息

上個階段我們已經能處理錯誤了，但目前只是當錯誤發生時查不到資料而已，使用者感覺不出有錯誤發生，因此我們需要提示錯誤訊息，最簡單的方式是在 `catchError()` 內進行提示：

```typescript
const getSearchResult = (
  keyword: string,
  sort: string,
  order: string,
  page: number,
  perPage: number
) =>
  dataUtils
    .getSearchResult(keyword, sort, order, page, perPage)
    .pipe(
      // 從查詢開始處理錯誤
      catchError((error) => {
        alert(error.response.message);
        return of([]);
      })
    );
```

這樣依然會有 side effect 的問題，所以可以換個方式，把資料包裝起來，當錯誤發生時，加上一個錯誤的 flag：

```typescript
const getSearchResult = (
  keyword: string,
  sort: string,
  order: string,
  page: number,
  perPage: number
) =>
  dataUtils
    .getSearchResult(keyword, sort, order, page, perPage)
    .pipe(
      // 正常收到資料時，將資料包裝起來且 success 設成 true
      map(result => ({ success: true, message: null, data: result })),
      catchError((error) => {
        // 發生錯誤時，將資料包裝起來且 success 設成 false
        // 同時傳遞錯誤資訊，讓後續訂閱可以處理提示
        return of({
          success: false,
          message: error.response.message,
          data: []
        })
    }));
```

這麼一來就可以保留整個流程，直到 `subscribe` 時在進行處理，原來訂閱是直接拿 `result` 去更新，現在 `result` 變成包含是否成功資訊的物件，因此只要取其中的 `data` 來更新就好：

```typescript
searchResult$.subscribe(result => {
  // 原來的 result 改變了，因此取其中的 data 就好
  // domUtils.fillSearchResult(result);
  domUtils.fillSearchResult(result.data);
  domUtils.loaded();
});
```

而處理錯誤的部分，我們可以拉出另外一條 Observable 來處理：

```typescript
// 處理錯誤提示
searchResult$
  .pipe(
    filter(result => !result.success)
	).subscribe(result => {
    alert(result.message);
  });
```

把「顯示資料」和「錯誤處理」當作兩個不同的資料來源處理，可以讓我們在閱讀程式時更加專注在原本的意圖上。

這裡最後需要注意的是，`searchResult$` 因為針對不同情境處理而被訂閱了兩次，而原來的 `searchResult$` 是 Cold Observable，且其中有 `ajax` 的呼叫，代表每次訂閱都會重跑一次 `ajax`，這麼一來 API 呼叫就會重複，造成不必要的浪費，所以最後再 `searchResult$` 補上 `share()`：

```typescript
const searchResult$ = startSearch$.pipe(
  switchMap(([keyword, sort, page, perPage]) =>
    getSearchResult(keyword, sort.sort, sort.order, page, perPage)
  ),
  // searchResult$ 有多次訂閱
  // 因此使用 share 避免重複請求資料
  share()
);
```

{% note info %}

在前面 `keyword$` 示範時使用 `shareReplay(1)` 是因為訂閱時機會隨著按鈕事件的 `switchMap()` 訂閱時間而不同，且需要最後一次事件的資訊。

在這裡使用 `share()` 則是因為訂閱會立刻發生，且沒有使用最後一次事件資訊需要的關係；當然，要在這裡使用 `shareReplay(1)` 在邏輯上也是完全沒問題的。

{% endnote %}

# 本日小結

今天我們透過實際在網頁程式上常常遇到的查詢、分頁和排序等功能，來說明實務上 RxJS 的應用，以及各種 operators 的組合技巧。

當所有事件都使用資料流及 Observable 的觀點來思考時，整個思路會變得更加單純，我們只需要習慣應用各種已經學會的 operators 來組合這些資料流即可，而且每個資料流、每個訂閱都只處理自己該做的事情，讓每段程式碼都變得更簡短好閱讀，且發生問題時，也可以很容易從問題發生點循序找到每個執行過程，更容易找到錯誤發生的地方！

剛開始在學習 RxJS 時一定會對於何時該使用哪些 operators 的問題覺得不知所措，建議可以多加練習，把上述的程式碼反覆寫過，了解每個資料的流向，接著更可以嘗試組合不同的 operators，用不同的寫法達到一樣的功能，久而久之習慣後，RxJS 功力就會大增囉！！
