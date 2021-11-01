---
title: "[Angular 大師之路] 在 Angular 中應用 RxJS 的 operators (2) - 進階應用"
date: 2018-11-14 20:25:13
category: "Angular 大師之路"
tags:
  - Angular
  - RxJS
  - debounceTime
  - distinctUntilChanged
  - Subject
  - BehaviorSubject
  - ReplaySubject
  - AsyncSubject
  - catchError
  - throwError
  - finalize
---

昨天我們講了幾個常用 RxJS operators，今天再來看看一些其他在 Angular 常見的應用吧！

<!-- more -->

**類型**：技巧

**難度**：5 顆星

**實用度**：5 顆星

# debounceTime

面對搜尋的需求，我們常常會遇到需要在輸入完後自動搜尋資料，而不用再去按個按鈕，這時候我們可以使用 FormControl 或 ngModel 的 `valueChanges` 搭配 `switchMap` 來完成搜尋，例如：

```typescript
data$ = this.searchControl.valueChanges.pipe(
  switchMap(keyword => this.httpClient.get(`.../?q=${keyword}`))
);
```

當然，這有個明顯的問題，當每次資料一變更的瞬間，就會發出一次 API 呼叫，對伺服器的 loading 會太重，這時候就可以使用 `debounceTime` 這個 operator，來進行緩衝，`debounceTime` 可以設定一個時間(毫秒)，在這段時間只要還有新資料傳入，就會暫時忽視，直到一定時間沒有新資料後，才將最新的資料交給下一個 operator，因此上述程式可以改為：

```typescript
data$ = this.searchControl.valueChanges.pipe(
  debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
  switchMap(keyword => this.httpClient.get(`.../?q=${keyword}`))
);
```

# distinctUntilChanged

在使用 `debounceTime` 後，已經可以大幅度減少伺服器的負荷，還有沒有進步空間呢？有的，假設當 `decounceTime` 過去後，不管資料是不是跟上次不同，還是會將資料送到下一個 operator 去，如此一來就有可能出現重複的關鍵字搜尋的狀況，這時候透過 `distinctUntilChanged` 就能在上一次資料與這次資料相同時，主動忽略變更，就能更真正資料有變更時，才觸發搜尋的動作：

```typescript
data$ = this.searchControl.valueChanges.pipe(
  debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
  distinctUntilChanged(), // 當「內容真正有變更」時，才進行搜尋
  switchMap(keyword => this.httpClient.get(`.../?q=${keyword}`))
);
```

# filter

在搜尋的例子最後介紹一個簡單常用的 operator - `filter` ，這個 operator 跟陣列的 `filter` 非常類似，就是用來過濾資料用的，當 `filter` 內的條件符合時，才允許這次變更發生，因此若希望輸入超過 3 個字才允許搜尋的話，可以改為：

```typescript
data$ = this.searchControl.valueChanges.pipe(
  debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
  distinctUntilChanged(), // 當「內容真正有變更」時，才進行搜尋
  filter(keyword => keyword.length >= 3), // 當關鍵字大於 3 個字時，才搜尋
  switchMap(keyword => this.httpClient.get(`.../?q=${keyword}`))
);
```

# 使用 Subject 跨元件傳遞資料

我們知道當父子元件想要傳遞資料時，可以使用 `@Input` 和 `@Output` 來傳遞，但當元件不是父子關係時，就必須靠彼此共同的父元件來傳遞，當關係比較深時，就會有很多個 `@Input` 和很多個 `@Output` 才能夠跨元件傳遞資料；這時候一個常見的做法是使用 service 來存放資料，並跨元件存取：

```typescript
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages = ['hello', 'world'];
}

@Component({
  selector: 'app-chat-info',
  template: `{{ messages.length }} Messages`
})
export class ChatInfoComponent {
  get messages() { return this.chatService.messages }
  constructor(private chatService: ChatService) {}
}

@Component({
  selector: 'app-chat-messages',
  template: `
  <ul>
    <li *ngFor="let message of messages">{{ message }}</li>
  </ul>
  `
})
export class ChatMessagesComponent {
  get messages() { return this.chatService.messages }
  constructor(private chatService: ChatService) {}
}
```

這樣的程式當然沒有什麼太大的問題，但是我們可能會更喜歡用 observable + AsyncPipe 的方式，來取得資料，享受 Angular 先天提供的各種便利，這時候就可以改用 `Subject` 來存放資料，當資料變更時，在呼叫 `next()` 方法，通知所有訂閱的來源更新：

```typescript
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _message = ['hello', 'world'];

  messages$ = new Subject();

  constructor() {
    this.messages$.next(this._message);
  }

  addMessage(message) {
    this._message = [...this._message, message];
    this.messages$.next(this._message);
  }
}
```

每當 `addMessage()` 方法被呼叫時，所有訂閱的來源都會收到新的資料！

## 比較 BehaviorSubject 與 ReplaySubject

單純使用 `Subject` 時，最大的問題是在訂閱時若沒有發生任何的 `next()` 呼叫，會完全收不到過去的資料，例如：

```typescript
const subject = new Subject<string>();
// 分別印出 1, 2
subject.subscribe(data => {
  console.log(`Sub1 => ${data}`);
});

subject.next('1');
// 只會印出 2
subject.subscribe(data => {
  console.log(`Sub2 => ${data}`);
});

subject.next('2');
```

而 `BehaviorSubject` 和 `ReplaySubject` 可以幫助我們解決這種問題！

**BehaviorSubject** 可以在資料被訂閱前，給予初始資料，任何 `next` 發生前執行 `subscribe()`都會得到初始資料，如下：

```typescript
// 建立 BehaviorSubject 時，給予初始資料
const subject = new BehaviorSubject<string>('1');
// 分別印出 1, 2, 3
subject.subscribe(data => {
  console.log(`Sub1 => ${data}`);
});

subject.next('2');

// 分別印出 2, 3
// 由於已經有 next() 取得新資料過了，因此初始資料就無法再訂閱得到
subject.subscribe(data => {
  console.log(`Sub2 => ${data}`);
});
subject.next('3');

```

**ReplaySubject** 會記錄所有呼叫 `next()` 變更的資料，在被 `subscribe()` 時，**重新播放所有紀錄**(可設定紀錄最近的 N 筆)

```typescript
// 可以指定紀錄筆數
const subject = new ReplaySubject<string>(2);
subject.next('1');
// 分別印出 1, 2, 3, 4
subject.subscribe(data => {
  console.log(`Sub1 => ${data}`);
});

subject.next('2');
subject.next('3');

// 分別印出 2, 3, 4 (2, 3 是最近 2 次的重播)
subject.subscribe(data => {
  console.log(`Sub2 => ${data}`);
});
subject.next('4');
```

善用這兩種 Subject 類型，就不怕在訂閱時沒有初始資料啦！

## AsyncSubject

另外還有一個比較不常用的 Subject 類型叫做 `AsyncSubject` 他只有在 `complete()` 方法被呼叫時，才能訂閱到「最後一次 `next()` 的資料」

```typescript
const subject = new AsyncSubject();
// 只會在 complete() 後印出 3
// 如果沒有 complete() 結束整個 observable，不會收到任何資料
subject.subscribe(data => {
  console.log(`Sub1 => ${data}`);
});

subject.next('1');
subject.next('2');
subject.next('3');

subject.complete()
```

# 錯誤處理

我們知道當 observable 錯誤時，可以從 `subscribe()` 時設定處理錯誤的訊息：

```typescript
subject.subscribe(
  data => {
    console.log(`Sub2 => ${data}`);
  },
  error => {
    console.log('error', error)
  });
```

不過這有兩個小缺點：

1. 在整個 pipe 中只要任一個 operator 內發生錯誤，整個 observable 都會錯誤並結束
2. 在 Angular 中當我們愛上使用 AsyncPipe 時，幾乎不會再有 `subscribe()` 了怎麼辦

若希望不要中斷整個 observable，又能記錄錯誤，改怎麼做呢？在 RxJS 內有提供一些類似 `try ... catch` 的 operator，我們可以使用 `catchError` 來攔截錯誤：

```typescript
this.httpClient.get(`.../posts`).pipe(
  catchError(error => {
    console.log(error);
    return of([]);
  })
)
```

`catchError` 可以攔截發生的錯誤，並回傳另外一個 observable，讓整個 observable 可以順利繼續運作，透過這種方式可以避免 observable 運作中斷，也能記錄到錯誤訊息！

如果希望錯誤時就整個中斷，或是主動拋出錯誤呢？可以使用 `throwError`！

```typescript
this.httpClient.get(`.../posts`).pipe(
  tap(data => {
    if(data.length === 0) {
      // 主動丟出錯誤
      throwError('no data')
    }   
  }),
  catchError(error => {
    console.log(error);
    return of([]);
  })
)
```

在 `try ... catch` 的程式中，通常會提供一個 `finally {}` 來放置最後一定要執行的程式，在 RxJS 內有沒有呢？有的，就是 `finalize` 這個 operator：

```typescript
this.isLoading = true; // 進入讀取中狀態
this.httpClient.get(`.../posts`).pipe(
  finalize(() => {
    // 不管中間程式遇到任何錯誤，一定會進入 finalize 裡面
	this.isLoading = false;        
  })
)
```

# 本日小結

雖然我們常說 RxJS 最後比的是對於 operators 的熟練度，但沒有應用情境時，要熟練也不是那麼容易，希望藉由這兩天整理的個人在開發 Angular 時常見的應用，能幫助大家在 Angular 中慢慢加入各種 RxJS 的 operators 應用，進而愛上使用 RXJS！打造出更加流暢、好維護的程式啦！！

# 相關資源

- [debounceTime](https://rxjs-dev.firebaseapp.com/api/operators/debounceTime)
- [distinctUntilChanged](https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged)
- [filter](https://rxjs-dev.firebaseapp.com/api/operators/filter)
- [Subject](https://rxjs-dev.firebaseapp.com/api/index/class/Subject)
- [BehaviorSubject](https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject)
- [ReplaySubject](https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject)
- [AsyncSubject](https://rxjs-dev.firebaseapp.com/api/index/class/AsyncSubject)
- [catchError](https://rxjs-dev.firebaseapp.com/api/operators/catchError)
- [throwError](https://rxjs-dev.firebaseapp.com/api/index/function/throwError)
- [finalize](https://rxjs-dev.firebaseapp.com/api/operators/finalize)