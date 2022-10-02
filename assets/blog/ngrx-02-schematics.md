---
title: "[NgRx 速成班] 使用 NgRx Schematics 快速產生程式碼骨架"
date: 2022-08-01 11:47:42
category:
  - "NgRx 速成班"
tags:
  - Angular
  - NgRx
  - Schematics
ogImage: 01.png
---

在之前的文章「[簡介 NgRx](https://fullstackladder.dev/blog/2022/04/17/ngrx-01-introduce/)」中我們間單的的解釋了 NgRx 的一些基本角色，每個角色都有他的工作，也代表著我們要把一件事情拆成多個角色去負責，每個角色都會有各自獨立的程式碼，我們可以使用 [@ngrx/schematics](https://ngrx.io/guide/schematics) 套件來快速的幫助我們產生所有需要的程式碼！

<!-- more -->

# 安裝 @ngrx/schematics

由於 `@ngrx/schematics` 只是幫我們產生檔案，相關的檔案還是相依於 `@ngrx/store` 等相關套件，因此我們可以先把相關套件安裝起來。

第一個先安裝 `@ngrx/store`：

```shell
ng add @ngrx/store
```

這時候會在 `AppModule` 內預設幫我們 import StoreModule：

```typescript
StoreModule.forRoot({}, {})
```

在 `StoreModule.forRoot({}, {})` 內我們就可以指定要使用哪些存取 Store 資料的邏輯。

`@ngrx/store` 是絕對需要的核心套件，通常我還會在安裝 `@ngrx/effects` 套件。

```shell
ng add @ngrx/effects
```

一樣的會在 `AppModule` 內預設 import 一個 EffectsModule

```typescript
EffectsModule.forRoot([])
```

`StoreModule` 和 `EffectsModule` 都會在 `AppModule` 中使用 `forRoot` 來匯入預設的程式，以及要「全域」使用的狀態和處理程式。

如果要在 lazy loading 載入模組時才將相關程式載入，可以在該模組中使用 `StoreModule` 和 `EffectsModule` 的 `forFeature` 來載入，之後我們會再看到。

接著要安裝 `@ngrx/schematics` 非常簡單，一樣使用 `ng add` 輕鬆搞定

```shell
ng add @ngrx/schematics
```

# 使用 @ngrx/schematics 快速產生程式碼

接著我們來快速產生一組程式碼，在 NgRx 中我們可以把一個資料的各種操作行為統稱為「feature」，這個 feature 就會有自己的 Selector、Action、Reducer 等角色，來從 Store 中依照指定的邏輯存取狀態資料，現在我們就來快速的建立一個名為 `todos` 的 feature:

```shell
ng generate f todos/todos
```

接下來的過程會問一些問題，來幫助我們決定產生出哪些類型的檔案

* Should we generate and wire success and failure actions? (y/N)
  * 除了預設更新資料的 action 外，是否還要額外加上「成功」和「失敗」兩個 action，在這裡我們先選 `y`，之後可以看看產生出了哪些檔案
* What should be the prefix of the action, effect and reducer? (load)
  * 在 action, effect 和 reducer 中使用的前墜文字，主要是處理預設的 action 名稱，例如設定為 `load`，就會產生名為 `loadTodos` 的 action
* To which module (path) should the effect be registered in?
  * 指定 effect 要註冊在哪個 module 下，需要指定完整 module 路徑，例如 `todos/todos.module.ts`

之後就會產生相關的檔案啦，如下圖

{% asset_img 01.png %}

透過 `@ngrx/schematics` 幫我們產生了相關的程式，同時更新了 TodosModule (`tods/todos.module.ts`)，主要在裡面加上這行

```typescript
EffectsModule.forFeature([TodosEffects])
```

也就是在 `TodosModule` 載入時，我們才會使用到 `TodosEffects` 這個 module。

# 使用 @ngrx/schematics 產生的程式碼預覽

接著我們快速看一下用 `@ngrx/schematics` 產生的相關檔案

## todos.actions.ts

```typescript
import { createAction, props } from '@ngrx/store';

export const loadTodoss = createAction(
  '[Todos] Load Todoss'
);

export const loadTodossSuccess = createAction(
  '[Todos] Load Todoss Success',
  props<{ data: any }>()
);

export const loadTodossFailure = createAction(
  '[Todos] Load Todoss Failure',
  props<{ error: any }>()
);
```

在這個檔案中會定義所有可能改變 Store 狀態的「行為」，每個行為都會有它獨立的名稱，以及相關的參數。

值得注意的是，在這裡都只是定義「行為」而已，而不是真正的資料操作，也就是我們會再這裡定義「要做什麼」但不定義「怎麼做」。

至於到底要「怎麼做」呢？就會交給 Reducer 或 Effects 角色來處理。

這裡可以看到每個 Action 都是 `load` 開頭，這也是使用 `@ngrx/schematics` 建立時的預設前墜；除了 `loadTodos` 以外，如果建立時有選擇要產生「成功」和「失敗」Action 的話，也會預設多建立兩個 Action。

## todos.reducer.ts

```typescript
import { Action, createReducer, on } from '@ngrx/store';
import * as TodosActions from './todos.actions';

export const todosFeatureKey = 'todos';

export interface State {
}

export const initialState: State = {
};

export const reducer = createReducer(
  initialState,

  on(TodosActions.loadTodoss, state => state),
  on(TodosActions.loadTodossSuccess, (state, action) => state),
  on(TodosActions.loadTodossFailure, (state, action) => state),

);
```

在這個檔案中主要會定義 todos 這個 feature 在 Store 狀態中的 key 值，由於 Store 是一個全域的大狀態，而 feature 通嘗試這個狀態下的某個資料，在 NgRx 中就會使用不同的 feature key 管理，

例如 Store 的資料可能為：

```json
{
  "todos": { ... },
  "userProfile: { ... }
}
```

那麼 `todos` 和 `userProfile` 都可以被視為一個 feature，而我們現在建立的 todos feature，就是用來管理 key 值為 `todos` 下的狀態。

在這個檔案中還宣告了 `State` interface，代表這個 feature 狀態的型別定義，另外使用 `initialState` 來定義這個 feature 的預設值。

最重要的就是下面的 `reducer` 宣告，Reducer 有「修剪」的意思，也是真正說明「要怎麼做」的地方，它會依照不同的 Action 來決定要將狀態「修剪」成我們想要的樣子。

## todos.selector.ts

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';

export const selectTodosState = createFeatureSelector<fromTodos.State>(
  fromTodos.todosFeatureKey
);
```

在這個檔案中我們會宣告各種從 Store 取得狀態的方法，每個方法都被稱唯一個「selector]，其中預設的 `selectTodosState`，可以幫助我們從全域的 Store 狀態中拿到 `todos` 這個 feature 的狀態，後續我們可以在宣告更多的 Selector，來從這個 feature 狀態中取得真正想要的資料。

## todos.effects.ts

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as TodosActions from './todos.actions';


@Injectable()
export class TodosEffects {

  loadTodoss$ = createEffect(() => {
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

Effects 屬於一個獨立的角色，用來處理各種 side effect 的操作，通常最常見的應該就是呼叫後端 API 了，除此之外，一些關於 local storage、cookie、cache 甚至是提示視窗等等，也都應該屬於 side effect 的範疇。

`loadTodoss$` 是一個 effect 的宣告，在這裡我們會決定當一個 action 發生時 (`ofType(...)`)，要去進行哪些 side effect 的行為，之後要再回傳一個 Observable 物件，且 Observable 物件的是件型別也必須是一個 Action。

Effects 也是屬於「要怎麼做」的宣告，因此它跟 Reducer 一樣會透過 Action 觸發行為，不同的是 Reducer 透過 Action 觸發行為後可以直接「修剪」狀態，而 Effects 必須再發出另外一個 Action，通常這時候會在 Reducer 中處理這個另外被發出的 Action 來改變狀態，當然也可能由另外一個 Effects 來處理；關於 Effects 的相關開發技巧之後再來說明。

# 本日小結

NgRx 將角色拆得很細，雖然可以大幅減少每個資料處理單元的職責，但也大幅增加了檔案數量含程式碼行數 (KPI？)，因此有個工具幫我們產生程式碼是非常重要的一件事情，好在 Angular 有 Schematics 這個好用工具，NgRx 也對應支援，可以幫助我們快速的將相關角色都建立起來，大幅省去初始化建立程式的時間，實在是太方便了！

今天我們也快速的看了一下每個角色的相關程式碼，之後我們再實際把裡面的內容更加完成，完成一個實際可用的狀態管理程式。
