---
title: "[NgRx 速成班] 更改狀態的基礎 Action & Reducer"
date: 2022-08-03 16:27:30
category:
  - "NgRx 速成班"
tags:
  - Angular
  - NgRx
  - Action
  - Reducer
ogImage: 01.png
---

上篇文章我們介紹了 [NgRx 的 Store 和 Selector](2022/08/01/ngrx-02-schematics/)，這兩個角色主要是用來存放資料及讀取資料用的，接著我們來看看如何更新儲存的資料 - Action 和 Reducer。

一樣的，基本的程式骨架已經在「[使用 NgRx Schematics 快速產生程式碼骨架](/blog/2022/08/01/ngrx-02-schematics/)」建立，接下來將會直接沿用產生出來的程式骨架，繼續調整程式碼。

<!-- more -->

# Action - 定義「要做什麼」

{% asset_img 01.png %}

Action 主要是定義「我們**要做什麼事情**」，因此是非常具有**描述性**的，例如：

* 將狀態變更為「已讀取」
* 查詢所有的待辦項目清單
* 更新一筆待辦項目

等等，主要都是行為的定義，但通常也會貼近實際上的需求，在開發前期，就算還沒有任何資料結構或邏輯，我們依然可以先將 Actions 都定義好，未來在針對這些 Actions 來進行實際上的資料規劃與邏輯設計。

## 定義 Action

要定義 Action 非常簡單，使用 `createAction` 方法即可，使用 NgRx Schematics 建立程式骨架時，通常也會包含預設的 Action，例如

```typescript
export const loadTodos = createAction(
  '[Todos] Load Todos'
);
```

`loadTodos` 就是一個 Action 的定義，其中第一個參數為這個 Action 的描述文字，這個描述文字可以方便我們明確的知道「要做什麼」，同時也可以透過一些工具來幫助我們在執行過程中查閱有哪些 Action 被執行過，關於這些工具之後會再介紹。

之後要執行 Action 時，只要使用 `Store` 的 `dispatch` 方法即可：

```typescript
import { loadTodos } from './todos.actions';

export class TodosComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }
}
```

`store.dispatch(loadTodos())` 我們可以解讀成「Store 分配 (dispatch) 了一個 loadTodos 動作 (Action)」，至於實際上這個動作要怎麼做，則會交由 Reducer 來處理，Reducer 稍後會再深入介紹。

使用 `createAction` 建立的 `loadTodos` 本身就是一個 function，當我們呼叫這個 function 時，會建立一個 Action 物件，包含了我們傳進去的資訊，例如：

```typescript
console.log(loadTodos());
// {type: "[Todos] Load Todoss" }
```

這個 `type` 內容就是我們一開始建立時傳入的內容。

## 帶參數屬性的 Action

除了建立一個包含 `type` 的 Action 以外，我們也可以指定要傳入什麼參數，給未來的 Reducer 當作參考，例如原來的 `loadTodosSuccess` 我們想要在成功後帶入讀取結果：

```typescript
// export interface TodoItem { ... }

export const loadTodosSuccess = createAction(
  '[Todos] Load Todos Success',
  props<{ items: Array<{ id: number; text: string; done: boolean }> }>()
);

```

這裡的 `props<{ ... }>()` 代表宣告一個可以被傳入的屬性物件，且為指定的型別定義，之後要呼叫這個 Action 時，就必須要照宣告的型別傳入參數：

```typescript
console.log(loadTodosSuccess({ items: [...] }));
// { items: [...], type:  "[Todos] Load Todos Success"}
this.store.dispatch(loadTodosSuccess({ items: [ { id:1, text: 'Task 1', done: false }] }));
```

如果將 Action 呼叫後的結果印出來，會發現設定的屬性和 Action 的 `type` 屬性混在一起，所以在定義 `props<T>` 型別時，要特別注意不可以包含 `type` 屬性，實際上 NgRx 在設計時也特別限定了 `props<T>` 裡面的 `T` 不可以包含 `type` 屬性，若 `T` 包含 `type` 會直接回報錯誤。

我自己覺得這算是不太好的設計，有時候型別如果已經預先定義好了，還需要額外調整，實在麻煩的，但 NgRx 就是這麼設計了，我們也只能使用，所以在實務上我喜歡定義一個 `payload` 屬性，在這個屬性定義我們要的資料結構：

```typescript
export const setTodoDone = createAction(
  '[Todos] Set Todo Item Done',
  props<{ 
    payload: {
      id: number,
      // 透過包一個 payload，想使用 type 屬性就沒有限制了
      type: string 
    }
  }>()
)

...

this.store.dispatch(setTodoDone({ payload: { id: 1, type: 'custom type' }}));
```

當然這樣的缺點就是有比較深的巢狀的感覺，所以還是看情況酌量使用就好。

另外要注意的是，泛型宣告 `T` 必須為物件型別，也不可以是陣列型別，例如 `props<number>` 或是 `props<Array<TodoItem>>` 也是會回報錯誤的。

`props<T>` 最重要的功能就是替傳入 Action 的屬性內容給予一個型別，以便後續開發都能夠有強型別的效果可以使用！

有了 Action 定義「要做什麼」之後，接著我們再來看看如何定義「要怎麼做」。

# Reducer - 定義「要怎麼做」

{% asset_img 02.png %}

剛才我們定義了很多 Action，這些 Action 只是偏向意圖的宣告而已，都還沒有真正的邏輯去控制**要怎麼改變 Store 的資料**，這個部分就是 Reducer 的工作了！

再來回顧一下 Reducer 的骨架程式：

```typescript
export const reducer = createReducer(
  initialState,

  on(TodosActions.loadTodos, state => state),
  on(TodosActions.loadTodosSuccess, (state, action) => state),
  on(TodosActions.loadTodosFailure, (state, action) => state),

);
```

可以看到透過 `createReducer` 建立時，裡面會有許多個 `on`，裡面會指定 Action 和一個 callback function，我們可以把他想像成「當某個 Action 發生時，執行實際要做的行為 (callback function)」。

這個 calllback function 以目前的狀態和 Action 資料作為參數，我們要做的事情是回傳一個「接下來實際上的狀態」，以新的結果當作新的狀態。

例如當使用 `loadTodos` Action 時，我們可以在這時候設定 `isLoading` 狀態為 `true`：

```typescript
on(TodoActions.loadTodos, state => ({
  ...state,
  isLoading: true
}))
```

這裡我們使用展開運算子，複製原來的 `state` 物件，並重新設定 `isLoading` 為 `true`。

如果帶有 `props<T>`，則可以在 callback function 的第二個參數取得該 Action 資訊，例如 `loadTodoSuccess` 會傳入讀取後的結果，我們可以儲存這個結果，並且設定 `isLoading` 狀態為 `false`：

```typescript
on(TodosActions.loadTodosSuccess, (state, action) => ({
  ...state,
  todoItems: [...action.items],
  isLoading: false,
}))
```

之後要更改狀態內容，只要持續「建立 Action」以及「實作 Reducer」的步驟就可以啦！

{% note warning %}

如果是用 NgRx Schematics 產生feature 的話，同時會產生 Effect 來處理相關的 `loadTodosSuccess`，不過由於型別改變了，這裡可以先把相關程式都註解掉就好，之後學會 Effects 後再補齊。

{% endnote %}

# 整體程式回顧

到目前為止整個程式看起來大概會像這樣：

```typescript
export class TodosComponent implements OnInit {
  // 透過 selector 得到我們真正在意的資料
  isLoading$ = this.store.select(selectTodoLoading);
  todoItems$ = this.store.select(selectTodoItems);

  constructor(private store: Store) { }

  ngOnInit(): void {
    // 觀察 Store 狀態變化
    this.store.select(selectTodosState).subscribe(console.log);

    // 此時狀態中的 isLoading 變成 true
    this.store.dispatch(loadTodos());

    // 實際上取得 todos 的邏輯，例如呼叫 API 取得資料

    // 分配 loadTodosSuccess 工作，並將得到的結果傳入
    // 此時狀態中的 todosItems 為傳入的內容，且 isLoading 為 false
    this.store.dispatch(loadTodosSuccess({ items: [ { id:1, text: 'Task 1', done: false }] }));
  }
}
```

應該不難發現我們的 Component 不在直接相依整個存放的大狀態，而是

- 需要讀取狀態資料時，透過 Selector 從狀態中取得資料，但隱藏了 Selector 取得資料的細節
- 需要儲存狀態資料時，透過 Action 去改變狀態資料，一樣的隱藏了更改狀態資料的細節

此時我們的元件就具有高度的抽象化，同時也保持非常好的語意性(當然還是要理解一些 NgRx 的角色和行為)，我們可以很容易的推測針對狀態「要做什麼事情」，而這些事情具體怎麼做就不是元件要負責的範圍了，元件本身就可以將針對狀態管理的需求與意圖**描述**得非常清楚，具體的細節則交給 Selector 以及 Reducer 背後的程式來處理，未來除非需求變更，否則針對程式 bug 的修正，效能的優化等等，都不用在維護元件本身，讓職責更加分明！

{% note info %}

雖然只是理想，但若能達到「元件及文件」，那真的是再好不過了！

{% endnote %}

# 本日小結

今天我們學會了 NgRx 核心角色的最後兩個「Action 與 Reducer」的工作原理，到此已經可以串起整個狀態管理的流程了，雖然看起來程式多了很多，但透過適當的職責分工，當程式架構越來越複雜時，我們依然可以輕易的梳理整個狀態的資料流程，撰寫出更加穩固、好維護的程式碼！

整個 NgRx 的基本流程其實不難，建議可以多練習幾次，每次練習時都多思考這個角色的資料是從哪裡來的，又要把資料傳遞給哪個角色，習慣後相信會覺得這樣的寫法會變得非常的簡潔有力！

NgRx 還提供的許多的類別庫，工具等來協助我們再度的將程式抽象化，以及對 Angualr 框架的整合，之後我們再慢慢來介紹囉。
