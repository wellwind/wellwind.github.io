---
title: "[NgRx 速成班] 用 Effects 讓元件持續保持單純"
date: 2022-08-07 09:01:34
category:
  - "NgRx 速成班"
tags:
  - Angular
  - NgRx
  - Effects
ogImage: 01.png
---

前幾天我們已經講 NgRx 狀態管理最重要的幾個核心角色 - Store、Selector、Action 和 Reducer 介紹過了；今天我們來講講 NgRx 另外一個很重要的角色 - Effects。

<!-- more -->

{% asset_img 01.png %}

# 元件中的 Side Effects

在前端應用上，我們經常會做出許多的 side effects 處理，例如後端 WebAPI 呼叫、存取 storage 等等，這些行為在過去我們可能都會直接寫在元件裡，如果搭配 NgRx 時，大概看起來會像這樣：

```typescript
export class TodosComponent implements OnInit {
  // 取得想要的狀態資料
  isLoading$ = this.store.select(selectTodoLoading);
  todoItems$ = this.store.select(selectTodoItems);

  constructor(
    private store: Store, 
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    // 先進入 loading 狀態
    this.store.dispatch(loadTodos());
    // 呼叫 API 取得資料
    this.httpClient.get('...').subscribe(data => {
      // 取得資料後，告訴 Reducer 完成
      this.store.dispatch(loadTodosSuccess({ items: [...data] }));
    });
  }
}
```

這樣的程式功能當然沒什麼問題，不過在元件內多了一個「呼叫 API」的 side effect 操作，會讓元件的複雜度增加！

在 NgRx 的概念下，我們會希望元件本身越單純越好，一個元件的角色就是拿資料顯示，和叫別人去儲存資料；至於資料改怎麼拿怎麼存，站在元件設計的觀點都是不應該知道的；而當呼叫 API 取得資料的功能寫在元件裡面，就代表元件多了一些職責，也破壞了元件「不應該知道存取資料的實作細節」的原則，當功能越來越複雜時，也就會導致元件越來越難理解和維護。

這時候我們可以透過 NgRx 提供的 Effects 角色，將這些有 side effects 的邏輯抽出來，讓元件在設計時不用去看到這些邏輯，繼續維持「用 Selector 拿資料」和「分配 Action 工作」那麼單純就好！

# 使用 NgRx Effects

NgRx 的 Effects 概念很簡單，它會依照某個 Action 觸發（跟 Reducer 類似），來決定接下來要做什麼事情，與 Reducer 不同的是，Reducer 只是單純的將資料更新回 Store，而 Effects 則是去處理更多的 side effect 操作；當操作完成後如果要更新 Store，我們需要再回傳一個 Action，此時 Reducer 可以針對這個回傳的 Action 來決定如何更新 Store！

## Effects 基本架構

讓我們來回顧一下使用 NgRx Schematics 建立出來的 Effects 程式碼骨架：

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodosEffects {

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe( 
      ofType(TodosActions.loadTodoss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => TodosActions.loadTodossSuccess({ data })),
          catchError(error => of(TodosActions.loadTodossFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
```

從程式中我們可以看到，NgRx Schematics 已經幫我們把基本的內容都建立好了；另外要記得，在 import `EffectsModule` 時同時宣告要使用的 Effects

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    EffectsModule.forRoot([TodosEffects])
  ]
})
```

如果是跟著 lazy loading 模組載入的，則可以使用 `forFeature([])`

```typescript
EffectsModule.forFeature([TodosEffects])
```

## 拆解撰寫 Effects 的步驟

接著讓我們來一步一步拆解撰寫 Effects 要做的事情。

首先，先在程式中注入 `Actions` 物件，這是一個 Observable 物件，每當我們透過 NgRx 的 `Store` 去 `dispatch` 一個 Action 時，訂閱這個 Observable 物件的觀察者都會收到有 Action 發生了。

```typescript
constructor(private actions$: Actions) {}
```

接下來我們要準備一個處理 side effect 的物件，我們可以用 `createEffect` 來產生：

```typescript
loadTodos$ = createEffect(() => {
  ...
})
```

`loadTodos$` 也是一個 Observable 物件，他最終也要回傳一個 Action，NgRx 會訂閱這個物件，當有回傳 Action 時，就等同於使用 Store 去做 dispatch 的動作。

在 `createEffect` 中是一個 callback function，我們要在這裡面先填入「需要處理什麼 Action」，這時候可以使用 `actions$` 搭配 `ofType` operator 來處理：

```typescript
loadTodos$ = createEffect(() => {
  // 以 actions$ 作為事件來源
  return this.actions$.pipe( 
    // 在這裡只處理 TodosActions.loadTodos 這個 Action
    ofType(TodosActions.loadTodos),
    ...
  )
});
```

`ofType` 可以想像成是 `filter` operator 的擴充版本，它可以幫我們過濾出我們想要的 Action，當然背後做的事情更多！

取得想要的 Action 後，接著要「根據 Action 去做實際上想做的事情」，通常也就是 API 的呼叫，另外通常也會搭配 `concatMap` (當然，還是要看實際需求決定)，來確保每個 side effect 都有正常被執行：

```typescript
loadTodos$ = createEffect(() => {
  return this.actions$.pipe( 
    ofType(TodosActions.loadTodos),
    // 使用 concatMap 轉換成 API 呼叫 (side effect) 的 Observable 物件
    // 比較好的寫法還是把 HttpClient 再包到一個 service 裡面
    // 為了方便說明這邊還是簡化直接使用 HttpClient
    concatMap((action) => this.httpClient.get('...'))
  )
});
```

處理完 side effect 後，我們可以把處理結果「轉換成一個 Action 當作最終事件」，之後 Reducer 如果有處理這個事件，就可以幫我們寫回 Store 內了！

```typescript
loadTodos$ = createEffect(() => {
  return this.actions$.pipe( 
    ofType(TodosActions.loadTodos),
    concatMap((action) => 
      // 調整 side effect 的 Observable
      // 讓它可以回傳一個 Action
      this.httpClient.get('...').pipe(
        // 成功的話，使用 loadTodosScuccess Action
        map(result => TodosActions.loadTodosSuccess({ item: [...result] })),
        // 發生例外的話，使用 loadTodosFailure Action
        catchError(error => of(TodosActions.loadTodosFailure({ error })))
      )
    )
  )
});
```

一步一步拆解完成後，是不是就覺得 Effects 也沒那麼複雜啦！透過 Effects，我們可以把 side effect 操作都抽出來，元件就會變得更加單純，以目前的程式來說，元件就只剩下：

```typescript
export class TodosComponent implements OnInit {
  // 取得想要的狀態資料
  isLoading$ = this.store.select(selectTodoLoading);
  todoItems$ = this.store.select(selectTodoItems);

  constructor(private store: Store) { }

  ngOnInit(): void {
    // 聲明我們要讀取 todos，剩下的交給 Effects 和 Reducer
    // 之後 this.todoItems$ 自然就會有資料
    this.store.dispatch(loadTodos());
  }
}
```

可以看到元件就變得非常簡單，元件就只是個發號司令的角色，我要什麼資料，跟 Selector 說一聲，我想要做什麼動作，就叫 Store 分配(dispatch)一個動作(store)出去就好，非常的單純！

# 其他 Effects 使用技巧

接下來分享兩個在撰寫 Effects 也常使用到的技巧，這些在文件中也有，我就只挑個人常用的分享

## 不 dispatch action

Effects 處理預設是「輸入一個 Action 並輸出另一個 Action」，有些時候我們不一定希望有 Action 回傳，例如記錄 log 等等，這時候可以加上 `{dispatch: false}` 的參數設定：

```typescript
loadTodos$ = createEffect(
  () => {
    return this.actions$.pipe( 
      ofType(TodosActions.loadTodos),
      // 沒有回傳 Action
      tap(action => console.log(action))
    )
  },
  // 當沒有回傳 Action 時，需要另外設定 dispatch: false
  { dispatch: false }
);
```

## 組合其他的狀態

在使用 Effects 時，預設只會有目前 Action 提供的資訊，如果需要再額外拿到其他的狀態資料，一樣可以注入 Store 後搭配 Selector，不過 Store 也是 Observable 物件，因此要組合在一起比較麻煩一點，不過 NgRx 提供了一個 `concatLatestFrom` operator，讓我們可以用比較簡單的方式達成目標：

```typescript
loadTodos$ = createEffect(
  () => {
    return this.actions$.pipe( 
      ofType(TodosActions.loadTodos),
      concatLatestFrom(() => this.store.select(selectTodoCount))
      concatMap(([action, todoCount] => ...)
    )
  },
)
```

如果有多個 selector 呢？大概會有三種方式

1. 建立一個新的 Selector，來組合這些 selector
2. 使用多次 concatLatestFrom，不過要注意會層層包裝

```typescript
loadTodos$ = createEffect(
  () => {
    return this.actions$.pipe( 
      ofType(TodosActions.loadTodos),
      // 這時候資料是 [action, someData]
      concatLatestFrom(() => this.store.select(someSelector)),
      // 這時候資料變成 [[action, someData], anotherData]
      concatLatestFrom(() => this.store.select(anotherData)),
      // 越多 concatLatestFrom 就會越多層陣列組合
      concatMap(([[action, someData], anotherData] => ...)
    )
  }
)
```

3. 使用 `zip` operator 組合所的 selector

```typescript
loadTodos$ = createEffect(
  () => {
    return this.actions$.pipe( 
      ofType(TodosActions.loadTodos),
      // 這時候資料是 [action, [someData, anotherData]]
      concatLatestFrom(() => zip(this.store.select(someSelector), this.store.select(anotherSelector))),
      // 無論多少個 selector，只會多一層陣列
      concatMap(([action, [someData, anotherData]] => ...)
    )
  }
)
```

# 本日小結

今天我們把最後一個 NgRx 的重要角色 Effect 也介紹完了，透過 Effects 我們可以適當的把一些 side effect 邏輯都抽到 Effects 裡面，保持元件職責更加單純！

當我們能夠靈活運用這些角色以後，寫出來的程式將會更加「高內聚、低耦合」，也會更有彈性更好維護喔！
