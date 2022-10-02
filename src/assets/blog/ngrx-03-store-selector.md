---
title: "[NgRx 速成班] 讀取狀態的基礎 Store & Selector"
date: 2022-08-02 10:30:00
category:
  - "NgRx 速成班"
tags:
  - Angular
  - NgRx
  - Store
  - Selector
ogImage: 01.png
---

對 NgRx 基本架構和程式碼有了一些概念後，接著來看一下如何將狀態讀取出來給程式使用，這會利用到 Store 與 Selector 兩個角色。

基本的程式骨架再上一篇「[使用 NgRx Schematics 快速產生程式碼骨架](/blog/2022/08/01/ngrx-02-schematics/)」已經說明過了，這邊將會直接沿用產生出來的程式骨架，繼續調整程式碼。

<!-- more -->

# Store - 集中管理的狀態

{% asset_img 01.png %}

## 取得 Store

NgRx 是一個完整的狀態管理機制，所有的狀態會被儲存在 Store 內，我們可以隨時在程式中注入 `Store` 來得到狀態資料。

```typescript
export class TodosComponent {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.subscribe((data) => console.log(data));
  }
}
```

不過目前還是一個空的物件，也就是整個 Store 是個單純沒有任何 feature 的物件

```typescript
{ }
```

我們還需要定義實際上需要的 feature reducer。

## 宣告使用的 Reducer

要能夠取得想要的狀態資料，必須先告訴 NgRx 要使用哪些狀態，這時候必須告訴 NgRx 我們要用的 Reducer 是誰。

如果是全域的狀態，可以在 AppModule 中宣告

```typescript
import { 
  todosFeatureKey, 
  reducer as todosReducer 
} from './todos/todos.reducer';

@NgModule({
  ...,
  imports: [
    ...,
    StoreModule.forRoot({ [todosFeatureKey]: todosReducer }, {})
  ]
})
export class AppModule { }
```

`todosFeatureKey` 是使用 NgRx Schematics 建立 feature 時一起建立的 feature 名稱，以之前的例子來說就是宣告成一個字串 `todos`。

```typescript
// todos.reducer.ts
export const todosFeatureKey = 'todos';
...
```

`{ [todosFeatureKey]: todosReducer }`，代表 `todos` (也就是 `todosFeatureKey`) 這個 feature 會使用 `todosReducer` 來修剪資料。

如此在 Angular 程式一開始載入時，就會將 `todosReducer` 載入，並將得到的資料存到 `todos` 這個 feature 中，這時候的 Store 物件內會包含 `todos`：

```typescript
{
  todos: {}
}
```

有些時候我們會再使用到某個模組時，才需要這些狀態資料，就可以改成在指定的模組內宣告

```typescript
import { 
  todosFeatureKey, 
  reducer as todosReducer 
} from './todos/todos.reducer';

@NgModule({
  ...,
  imports: [
    ...
    StoreModule.forFeature(todosFeatureKey, todosReducer)
  ]
})
export class TodosModule { }
```

`StoreModule.forFeature` 主要就是兩個參數，分別是 feature 的名稱和使用的 reducer。

這時候就只有在「第一次」使用到該模組時，才會將狀態資料載入，對於一些需要延遲載入的模組，還同時具有將 feature 相關程式碼也都延遲載入的效果。

## feature 狀態的預設值

使用 NgRx Schematics 建立 feature 的話，feature 狀態的相關定義會被放在 `*.reducer.ts` 中。

```typescript
// todos.reducer.ts
export interface State {
}

export const initialState: State = {
};

export const reducer = createReducer(
  initialState,
  ...
);
```

其中的 `State` interface 就是用來定義這個狀態的型別；而 `initialState: State` 就可以用來建立初始資料，下面的 `reducer` 使用 `createReducer` 方法來建立一個 Reducer，並且第一個參數就代表了這個 feature 狀態的預設值。

由於程式中會有許多的狀態，因此我會習慣把 `State` 重新命名成比較符合需求的名稱，如果狀態比較龐大，也會考慮額外抽一個檔案出來。

不過目前只是示範，就先不更改這些定義名稱，現在我們可以把型別和預設資料都先定義好，例如

```typescript
export interface State {
  isLoading : boolean;
  todoItems: Array<{
    id: number;
    text: string;
    done: boolean;
  }>;
}

export const initialState: State = {
  isLoading : false,
  todoItems: [
    {
      id: 1,
      text: 'Task 1',
      done: true
    },
    {
      id: 2,
      text: 'Task 2',
      done: false
    }
  ]
};
```

這時候在讀取 `Store` 時，就可以看到 `todos` 這個 feature 下的預設資料了：

```typescript
{
  todos: {
    isLoading: false,
    todoItems: [
      {
        id: 1,
        text: 'Task 1',
        done: true
      },
      {
        id: 2,
        text: 'Task 2',
        done: false
      }
  }
}
```

如果有多個 features，只需要如法炮製，使用 NgRx Schematics 建立 feature，並設定好在 StoreModule 中使用對應的 reducer，以及狀態預設值後，就可以統一透過 Store 來存放這些 features 的狀態了！

讀者們可以自行練習看看建立多個 features 將 Store 的內容變成以下物件：

```typescript
{
  todos: {
    isLoading: false,
    todoItems: [
      { id: 1, text: 'Task 1', done: true },
      { id: 2, text: 'Task 2', done: false }
  },
  userProfile: {
    isLoading: false,
    profile: {
      name: 'Mike',
      age: 18,
      interests: ['Angular', 'RxJS', 'NgRx']
    }
  }
}
```

當 Store 中存放狀態越來越龐大複雜時，如果只是要取得其中一個 feature 狀態下的某個屬性，直接從龐大的 Store 中讀取會讓程式變的不好閱讀，因此實務上我們會透過接下來的 Selector 來幫助我們讀取想要的狀態。

# Selector - 精準選中目標狀態

Selector 這個角色可以幫助我定義一系列意圖明確的方法，來從 Store 中取得指定的內容

{% asset_img 02.png %}

在使用 NgRx Schematics 時，已經有先定一好一個最基本，從 Store 中直接取得 feature 的 Selector 了：

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';

export const selectTodosState = createFeatureSelector<fromTodos.State>(
  fromTodos.todosFeatureKey
);
```

## Feature Selector

`createFeatureSelector` 方法是用來建議一個「取得 feature 的 selector」，也稱為「feature selector」，它只需要傳入一個參數，就是實際上的 feature key，你可以想像他實際上的程式是這樣的。

例如傳入的是 `todos`，之後 `selectTodosState` 就從 Store 物件中拿到 `todos` 這個屬性下的資料；我們可以使用 `Store` 的 `select` 方法中指定要使用什麼 Selector：

```typescript
import { selectTodosState } from './todos.selectors';
import { Store } from '@ngrx/store';

export class TodosComponent {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectTodosState) // 指定 Selector
      .subscribe((data) => console.log(data));
  }
}
```

如果目前的 Store 物件是：

```typescript
{
  todos: { isLoading: false, todoItems: [...] },
  userProfile: { ... }
}
```

那麼套上 `selectTodosState` 後，訂閱得到的只會剩下 `todos` 裡面的部分

```typescript
{ isLoading: false, todoItems: [...] }
```

如此一來我們就不用管整個 Store 的大狀態，只要專注在我們感興趣的 feature 就好了。

不過這樣還不夠，除了使用 feture selector 取得指定的 feature 狀態外，我們也可以組合這個 feature selector，搭配自訂的程式，來取得更細部的狀態。

## 建立 Selector

我們可以使用 `createSelector` 這個方法，來建立一個新的 selector，這個方法的第一個參數通常是指定 feature selector，之後再撰寫自訂的邏輯，來取得這個 feature 下的資料；以下範例從 feature selector 取得 feature 狀態物件後，從 feature 物件中取得 `isLoading` 的狀態內容：

```typescript
export const selectTodoLoading = createSelector(
  selectTodosState,
  (state) => state.isLoading
)
```

之後就可以直接用這個 selector 來得到 `isLoading` 的狀態啦：

```typescript
isLoading$ = this.store.select(selectTodoLoading);
```

`createSelector` 除了使用 feature selector 當參數外，當然也可以使用一般的 selector，因此我們也可以將 selector 拆小一點以達到共用的目標，例如要取得 todos 的數量，最直覺的寫法為：

```typescript
export const selectTodoCount = createSelector(
  selectTodosState,
  (state) => state.todoItems.length
)
```

但我們可以先寫一個取得 `todoItems` 的 Selector：

```typescript
export const selectTodoItems = createSelector(
  selectTodosState,
  (state) => state.todoItems
);
```

之後再利用這個 Selector 來取的總數：

```typescript
export const selectTodoCount = createSelector(
  selectTodoItems,
  (todosItems) => todosItems.length
);
```

## 組合 Selector

我們也可以透過傳入多個 Selector，把 Selector 的資料組合在一起，例如當 loading 時，todos 的數量設為 -1：

```typescript
export const selectCurrentTodoCount = createSelector(
  selectTodoItems,
  selectTodoLoading,
  (todosItems, loading) => loading ? -1 : todosItems.length
);
```

## 傳參數的 Selector

前面的 Selector 都是固定好要取得的資料，但有時候我們希望可以依照指定條件作為參數來抓資料，例如指定的 id 等等，我們可以自己寫一個 function 來產生 Selector：

```typescript
export const selectTodoItemById = (id: number) => createSelector(
  selectTodoItems,
  (todosItems) => todosItems.find((item) => item.id === id)
);
```

使用時就先帶入參數，即可取得 selector：

```typescript
todo$ = this.store.select(selectTodoItemById(1));
```

## Memoized

NgRx 中透過 Selector 取得資料會有一個內建的暫存機制，也就是當使用 Selector 取得資料後，會將資料快取起來，當再次使用 Selector 時，就可以直接使用，省去計算的成本，直到來源狀態被改變。

如果我們想要清除這個暫存資料，可以呼叫 Selector 的 `release()` 方法：

```typescript
selectTodoItems.release();
```

# 本日小結

今天我們對於 NgRx 的 Store 有了基本的認識，Store 就是用來集中管理存放資料的地方；當要從 Store 取得資料時，比起拿到整個 Store，透過 Selector 可以幫助我們更精確的取得目標資訊。

今天的介紹都以「取得資料」為主，接下來我們相介紹如何「變更」資料，讓整個狀態管理更加完善！
