---
title: "[RxJS] 實戰練習 - 使用 RxJS 實作 Flux Pattern"
date: 2020-10-17 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Flux
  - BehaviorSubject
  - from
  - map
  - shareReplay
  - of
  - delay
  - concat
---

使用 React 作為前端架構的朋友對於 Flux 應該都不陌生，React 也內建了 Flux 讓我們可以直接使用，同時也有許多其他的 library 以這個架構為基礎設計，並應用在各種前端框架下，如 [Redux](https://redux.js.org/) (for React)、[NgRx](https://ngrx.io/) (for Angular) 和 [Vuex](https://vuex.vuejs.org/) (for Vue) 等等。可以見得它是多麽重要的東西，今天我們來嘗試實際使用 RxJS 來實作一下這種架構，也藉此多認識一下 Flux Pattern 的重要觀念。

<!-- more -->

# 簡介 Flux Pattern

在現代化的網頁 SPA 架構下，我們已經非常習慣將畫面上的眾多內容拆成許多小的元件，讓它們可以各司其職，最後再組合起來，也因此不論是 Angular、React 還是 Vue 這些目前當紅的前端架構都以元件化設計為基礎，然而當畫面越來越複雜時，元件跟元件之間的溝通就成為了一個問題；負責處理資料的元件可能需要將資料一路傳到下面好幾層負責顯示內容的元件，讓管理上變得更加麻煩且複雜。

{% asset_img 01.jpg %}

因此 Facebook 提出了 Flux 架構，並內建在 React 內，統一了資料的來源，及資料處理流向，讓我們能用更加一致的方法去變更資料，以及得知資料變更的結果，並更新在畫面上。

## Flux Pattern 重要角色

下圖是 Flux 的基本資料流程：

{% asset_img 02.png %}

資料來源：https://facebook.github.io/flux/docs/in-depth-overview

Flux Pattern 包含幾個重要角色：

- **View**：負責畫面顯示，也就是網頁上的各個元件。
- **Action**：負責定義要執行的行為，Action 只負責定義行為類型 (type) 和所需的資料 (payload)，但不會參與實際變更資料的實作，通常由 View 或其他邏輯程式負責發起這個 Action。
- **Dispatcher**：負責分配行為變更資料的方法，Dispatcher 會根據 Action 的內容來對資料進行變更，也就是實際負責讓資料被改變的角色。
- **Store**：資料來源，也就是 Dispatcher 實際要變更的目標，當 Store 資料被變更時，也需要負責告知 View 資料被異動了，View 才會知道需要更新畫面。實際上不止 View 需要知道 Store 內容異動，只要使用到 Store 資料的程式，都應該需要知道資料被改變了，以便進行對應處理。

## Flux Pattern 資料流向

從圖片中我們也可以看到，資料的流向是單向的。

首先由 View 或其他程式邏輯負責發起 Action 給 Dispatcher

{% asset_img 03.jpg %}

Dispatcher 收到 **Action** 後，再針對 Action 提供的資訊來決定如何更新 **Store** 資料來源

{% asset_img 04.jpg %}

當 Store 資料更新後，所有使用到 Store 資料的程式都需要知道資料被更新了，以便進行其他操作

{% asset_img 05.jpg %}

透過這樣單向資料流的方式，我們能更容易理解資料的流向，而每個角色也只需要負責自己該做的事情：

- View 只需要負責發起 Action 就好，不用擔心資料變更的邏輯，而資料變更後也會由 Store 通知。
- Action 不用也不用負責資料變更的邏輯，只負責定義提供給 Dispatcher 的資料就好。
- Dispatcher 只專注在如何根據 Action 類型的不同來更新 Store 資料。
- Store 專注在提供資料給需要的程式。

乍看之下拆出了很多角色讓程式變得更加複雜，但實際上在越來越複雜的邏輯時，各自處理各自的事情在閱讀和維護上都會更加容易；另外一種應用是：在程式開發的初期，我們也可以先思考好要處理哪些 Action，以及如何從 Store 取得資料，而不用擔心資料該如何變更，可以更快速的先開始工作，等到資料變更的邏輯明確後，再進入 Dispatcher 的開發。

使用 Flux Pattern 的另一個好處是，由於資料來源統一放在 Store 內了，這代表當元件很複雜時，我們可以不用考慮元件跟元件之間該如何傳遞資訊，只需要統一跟 Store 溝通就好，管理上會更加容易。

{% asset_img 06.jpg %}

有了基本觀念後，就來看看使用 RxJS 如何實作一個簡單的 Flux Pattern 吧！

# 使用 RxJS 實作 Flux Pattern 與 Todo List App

首先先看一下我們預計實作的結果：

{% asset_img 07.jpg %}

我們要練習的是 RxJS 的實作，因此關於 HTML 與 DOM 物件的操作，已經先準備好了，可以先到以下網址練習：

https://stackblitz.com/edit/mastering-rxjs-flux-pattern-starter

完整的程式碼：

https://stackblitz.com/edit/mastering-rxjs-flux-pattern-finished

在 `index.ts` 內已經先填好一些程式並註解掉跟 Flux Pattern 有關的操作了，當相關程式完成後，只需要取消註解就可以看到相關的行為。

之後大部分的程式都會在 `todo-store` 這個目錄內實作。

## 虛擬的元件架構

雖然沒有使用如 Angular 等前端框架，但我們依然可以虛擬的想像成有幾個元件，讓這些元件各自處理各自的事情：

{% asset_img 08.jpg %}

## 實作資料來源 - Store

首先我們先開始實作一個資料來源 Store，在 RxJs 內，要得知資料改變再容易不過了，只要建立一個 Observable，之後在需要時就可以直接訂閱這個 Observable 來得知內容改變，至於要選用哪種類型的 Observable 呢？

考量到未來 Dispatcher 要更新資料時，我們會需要 Store 內的資料，因此使用 `BehaviorSubject`，這麼一來不僅可以立刻給予一個初始內容，也可以使用 `value` 屬性隨時得知目前資料的內容。因此在練習專案內我們打開 `todo-store/todo-store.ts` 建立一個 `BehaviorSubject`：

```typescript
import { BehaviorSubject } from 'rxjs';

export interface TodoState {
  loading: boolean;
  todos: {
    id: number;
    name: string;
    done: boolean;
  }[]
}

export const store$ = new BehaviorSubject<TodoState>({
  loading: false,
  todos: []
});
```

`interface` 部分是 TypeScript 語法，讓我們先定義好想要的資料模型。

在元件部分，考量到元件產生的時機點不同，訂閱 Observable 的時機也不同，如果想要在元件產生的訂閱就能取得最新的資料，使用 `ReplaySubject` 是一個比較好的選擇，但在 Store 內使用 `BehaviorSubject` 比較方便，該怎麼辦呢？由於 Strore 外的目標是使用 Observable，而不會直接改變狀態，因此我們可以先使用 `asObservable()` 讓 Subject 的 `next()` 等實作隱藏起來，再搭配 `shareReplay()` operator 來讓外部程式訂閱時能得到最新的 store 資料，因此我們打開 `todo-store/index.ts` 設定外部程式可以使用的內容：

```typescript
import { shareReplay } from 'rxjs/operators';
import { store$ as storeSubject$ } from './todo-store';

export const store$ = storeSubject$.asObservable().pipe(shareReplay(1));
```

透過這種方式外部程式在使用 `store$` 時，就不用擔心呼叫到 `next()` 來變更資料，也可以在訂閱時取得最近一次的事件資料內容囉，例如以下程式 (`index.ts`)：

```typescript
import { store$ } from './todo-store';

// 訂閱 store$ Observable，當資料改變時可即時收到通知
// 透過 map operator，可以只專注在想要的資料上
store$.pipe(map(store => store.todos)).subscribe(todos => {
  // 當 store$ 資料變更後，在此更新畫面
});
```

## 實作執行動作 - Actions

接著來設計要更新資料的行為，這裡預定有三個行為要處理，包含

- 設定預設的 todo list
- 新增 todo item 到 todo list 內
- 變更 todo item 完成狀態

我們先打開 `todo-store/todo-action-types.ts` 設定好要處理的 Action 類型：

```typescript
export class TodoActionTypes {
  static LoadTodoItems = '[Todo List] Load Todo Items';
  static AddTodoItem = '[Todo List] Add Todo Item';
  static ToggleTodoItem = '[Todo List] Toogle Todo Item'
}
```

`TodoActionTypes` 主要是用來定義有哪些 Action 類型可用，以便之後 Dispatcher 透過這些資訊決定要怎麼更新內容。

接著打開 `todo-store/todo-actions.ts` 來建立幾個產生這些 Action 的方法：

```typescript
import { TodoActionTypes } from "./todo-action-types";

export const loadTodoItemsAction = () => {
  return {
    type: TodoActionTypes.LoadTodoItems,
    payload: null
  };
}

export const addTodoItemAction = (payload) => {
  return {
    type: TodoActionTypes.AddTodoItem,
    payload
  }
}

export const toggleTodoItemAction = (payload) => {
  return {
    type:TodoActionTypes.ToggleTodoItem,
    payload
  }
}
```

每個方法都會設定目前 Action 的類型，同時提供要傳入的資訊 (payload)，之後 Dispatcher 可以針對這個 payload 內容來改變 Store 的資料，例如 `addTodoItemAction()` 可以傳入要新增的 todo item 文字，之後 Dispatcher 得知 Action 類型是 `TodoActionTypes.AddTodoItem` 時，就可以將 payload 設定為新的 todo item 的文字內容。

最後再 `todo-store/index.ts` 內設定讓外部程式可以使用這些建立 Action 的方法：

```typescript
export * from './todo-actions';
```



## 變更資料的實際邏輯 - Dispatcher

在 Dispatcher 這邊，我們稍微複製一點 Redux 的概念，加入一個 Reducer 的角色，Dispatcher 會將目前資料以及 Action 傳給 Reducer，而 Reducer 負責回傳一個新的結果，Dispatcher 再將得到的新結果更新成目前的資料內容。

### Reducer 邏輯

先打開 `todos-store/todo-reducer.ts` 加入預設處理內容：

```typescript
import { of } from 'rxjs';
import { TodoActionTypes } from './todo-action-types';

// currentState: 目前 store 內的資料
// action: 要執行的 Action
export const todoReducer = (currentState, action) => {
  switch (action.type) {
    // TODO: 針對 action.types 來決定要如何更新資料
    // case TodoActionTypes.XXXX: {
    //   return
    // }
  }
  // 如果沒有可以處理的 action type，直接回傳原來的內容
  return of(currentState);
};
```

在這裡我們設定 `todoReducer` 需要回傳一個 Observable，以便充分利用 RxJS 的特性，在 `todoReducer` 內，我們需要針對不同的 Action 來決定要怎麼改變目前的資料，例如當 Action type 為 `TodoActionTypes.AddTodoItem` 時，將目前資料加入一筆新的 todo item，並包裝成 Observable 回傳：

```typescript
import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TodoActionTypes } from './todo-action-types';

export const todoReducer = (currentState, action) => {
  switch (action.type) {
    // action.type 為 TodoActionTypes.AddTodoItem
    case TodoActionTypes.AddTodoItem:
      const newState = {
        ...currentState,
        todos: [
          ...currentState.todos,
          {
            id: currentState.todos.length + 1,
            // todo item 的 name 屬性就是 action.payload
            name: action.payload,
            done: false
          }
        ]
      };
      return of(newState);
      break;
  }

  // 如果沒有可以處理的 action type，直接回傳原來的內容
  return of(currentState);
};
```

包裝成 Observable 的好處是除了單純回傳新的資料外，也可以組合成複雜的資料流，例如使用 `ajax` 呼叫 API，或是先改變 `loading` 屬性當作一次事件，再以新的資料當作第二次事件：

```typescript
import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TodoActionTypes } from './todo-action-types';

export const todoReducer = (currentState, action) => {
  switch (action.type) {
    case TodoActionTypes.AddTodoItem:
      const loadingState = { ...currentState, loading: true };
      // 第一個事件，設定 loading 為 true
      const loadingState$ = of(loadingState);

      const newState = {
        ...currentState,
        todos: [
          ...currentState.todos,
          {
            id: currentState.todos.length + 1,
            name: action.payload,
            done: false
          }
        ],
        loading: false
      };
      // 第二個事件，設定 todos 屬性，以及設定 loading 為 false
      // 這裡加上 delay(500) 以模擬呼叫 API 的延遲
      const newState$ = of(newState).pipe(delay(500));

      // 最後使用 concat 組合成一個新的資料流
      return concat(loadingState$, newState$);
      break;
  }

  // 如果沒有可以處理的 action type，直接回傳原來的內容
  return of(currentState);
};
```

其他兩個 Action 也是一樣，都是針對資料做處理，就不浪費篇幅，完成程式碼在這裡：

https://stackblitz.com/edit/mastering-rxjs-flux-pattern-finished

### Dispatcher 邏輯

Reducer 只是負責決定新的資料為何，最終變動資料的依然是 Dispatcher 的責任，我們繼續把 `todo-store/todo-dispather.ts` 內容補起來：

```typescript
export const todoDispatcher = action => {
  from(todoReducer(store$.value, action)).subscribe({
    next: (data: any) => store$.next(data),
    error: data => store$.error(data)
  });
};
```

`todoDispatcher` 邏輯很簡單，先將 `store$` 的資料和 Action 傳入 `todoReducer` 來決定新的資料內容，最終使用 `from` 包起來可以讓 `todoReducer` 不一定非要回傳 Observable 不可，如果沒有複雜邏輯，直接回傳新的資料也可，但在 `todoDispatcher` 內用 `from` 包起來了，所以可以統一使用 Observable 的流程處理資料；得到新的 store 資料後，呼叫 `store$.next()` 來產生新的 Observable 事件。如此一來只要有訂閱 `store$` 就可以得知資料的變化啦！

## 實際使用

我們已經把 Flux Pattern 的 Store、Action 和 Dispatcher 角色相關程式碼都完成了，接著就是用 View 的角色實際使用啦！我們可以把 範例專案內 `index.ts` 的相關註解取消，來看看實際成果。以下舉幾個使用的例子：

使用 `loadTodoItemsAction()` 建立取得起始資料的 Action 接著傳入給 `todoDispatcher`，即可將目前 store 資料更新成包含預設資料的內容：

```typescript
todoDispatcher(loadTodoItemsAction());
```

當我們要新增一個新的 todo items 時，可以使用 `addTodoItemAction()` 傳入一個文字當作 payload 來建立 Action，然後將此 Action 傳入給 `todoDispatcher`：

```typescript
const todoItemValue = 'Hello World';
todoDispatcher(addTodoItemAction());
```

要得知目前有所有的 todo items，只需要訂閱 `todo-store` 的 `store$` 即可：

```typescript
store$.pipe(map(store => store.todos)).subscribe(todos => {
  // 更新畫面
});
```

如果要顯示 loading 呢？一樣訂閱 `store$` 並專注在 `loading` 屬性就好：

```typescript
loading$.subscribe(loading => {
	// 根據 loading 狀態顯示或隱藏
});
```

除此一來我們就可以把「讀取資料」和「更新資料」各自拆開來處理囉。

# 本日小結

今天我們學會了 Flux Pattern 的基本知識，並使用 RxJS 完成了一個簡易的 Flux Pattern 實作，透過 RxJS 我們可以很容易的把讀取資料和更新資料的流程拆開，並且各自處理各自該做的事情。

許多其他前端架構提供的相關 library，概念上也是大同小異，只是讓設計方式更加一致而已，因此今天的內容可以多練習幾次，把每個行為的資料流向畫出來好好理解，未來在使用時，應該就能更加容易上手啦！
