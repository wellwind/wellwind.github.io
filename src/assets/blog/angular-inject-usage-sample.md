---
title: "使用 inject() 簡化建構式注入的內容"
date: 2022-05-21 21:44:05
category: "Angular 大師之路"
tags:
  - Angular
  - Angular 14
  - inject
---

Angular 14 將加強原有的 [inject](https://angular.io/api/core/inject) 功能，讓我們在元件的建構式內可以直接透過呼叫 `inject(...)` 取得原本所有可以在建構式注入的內容，這種做法可以大幅簡化原來建構式的程式，但也可能帶來一些問題，今天就來看一下神奇的 `inject()` 新用法。

<!-- more -->

# inject() 使用方式

先來看看古早的寫法：

```typescript
// inject 來自 @angular/core，之後就不特別說明
import { inject } from '@angular/core';

@Component( ... )
export class ChildComponent {
  constructor(http: HttpClient) {
    http.get(...).subscribe(console.log);
  }
}
```

上面程式我們在建構式中注入了 `HttpClient`，在對應的模組內只要有 `imports: [HttpClientModule]`，那麼 `HttpClient` 就是一個可以被注入的 token。

有了 `inject()` 之後，我們可以改成這樣寫：

```typescript
@Component( ... )
export class ChildComponent {
  constructor() {
    const http = inject(HttpClient);
    http.get(...).subscribe(console.log);
  }
}
```

神奇吧！這個 `inject()` 允許我們在建構式的階段去取得原本元件內所有可以被注入的 token，讓我們不用再把要注入的內容寫到 `constructor` 中；當然，這只能作用在建構式階段，因此可以在建構式以及屬性初始化時呼叫 `inject()`：

```typescript
@Component( ... )
export class ChildComponent {
  // 初始化屬性也屬於建構式執行的階段
  post$ = inject(HttpClient).get<any>(...);

  constructor() {
    const http = inject(HttpClient);
    http.get(...).subscribe(console.log);
  }
}
```

不過在其他的方法內呼叫時，就會出現錯誤

```typescript
@Component( ... )
export class ChildComponent {
  ngOnInit() {
    // ngOnInit 不屬於 class 本身的建構式階段
    // 因此呼叫 inject() 會出錯
    inject(HttpClient);
  }

  someMethod() {
    // 在這裡使用 inject() 當然也不行
    inject(HttpClient);
  }
}
```

錯誤訊息大概看起來如下圖：

{% asset_img 01.png %}

那麼在建構式呼叫 `inject()`，感覺不過就是把原來在建構式的注入改成由 `inject()` 取得而已，有什麼好處呢？

好處在我們可以開始把一些邏輯抽出成 function，同時改成在該 function 取得要注入的 token 實體，例如：

```typescript
const getPosts = () => {
  const http = inject(HttpClient);
  return http.get<any[]>('...');
}
```

之後在元件內就變得超簡單：

```typescript
@Component( ... )
export class ChildComponent {
  posts$ = getPosts();
}
```

可以看到元件內的 `constructor` 消失了，因為要注入的邏輯已經連同 `inject()` 移動到 `getPosts()` 內了，如果善用這個功能，未來有機會什麼都不用注入，就能完成過去要注入很多東西才能完成的功能，同時重複的一些邏輯也可以抽出來，大幅減少重造輪子的力氣啊！

# inject() 使用案例

由於這是新功能，目前還沒有很多明確的範例可以參考，以下就自己的經驗和想像提供一些案例。

## 取得路由參數

我們經常透過 `ActivatedRoute.paramMap` 來取得路由的參數，因此注入 `ActivatedRoute` 是一個必要且常見的做法，通常還會搭配一些 `map` operator 來取得參數資料，建在我們可以輕易把這些邏輯都抽出來了！

```typescript
export const getRouteParam = (id: string) => {
  const route = inject(ActivatedRoute);
  return route.paramMap.pipe(
    map(paramMap => paramMap.get(id))
  );
}

@Component( ... )
export class ChildComponent {
  id$ = getRouteParam('id');
}
```

## 非同步驗證器

過去我們在設計 Angular 表單的非同步驗證器時，如果需要使用 API 呼叫，必須把它當作參數傳入，例如：

```typescript
const myAsyncValidator = (http: HttpClient) => {
  return (source: AbstractControl) => {
    return http.post('path/to/validation', { value: source.value });
  };
}
```

也因此元件內就必須自行注入 `HttpClient`，當有了 `inject()` 後，就可以簡化了：

```typescript
const myAsyncValidator = () => {
  // 注意，要在這裡就取得 HttpClient
  // 如果放在下面的驗證 function 內，會變成每次驗證都取得 HttpClient
  // 造成不是在建構式中取得 HttpClient 的錯誤
  const http = inject(HttpClient);
  return (source: AbstractControl) => {
    return http.post('path/to/validation', { value: source.value });
  };
}

@Component({
  ...,
  template: `
    <input [formControl]="name" />
    <div *ngIf="name.pending">Pending</div>
    <div *ngIf="name.invalid">{{ name.errors | json }}</div>
  `,
})
export class AppComponent {
  name = new FormControl('', null, myAsyncValidator());
}
```

## 動態產生元件

過去我們需要主動注入 `ViewContainer` 來動態產生元件，對於許多新手來說看到這個 `ViewContainer` 是相對不友善的，但抽出來後可以變成：

```typescript
const componentCreator = () => {
  const vc = inject(ViewContainer);
  return (component: any) => {
    return vc.createComponent(AdComponent);
  }
}

@Component({ ... })
export class AppComponent {
  createBanner = componentCreator();
  banners = {
    A: BannerAComponent,
    B: BannerBComponent
  };

  someMethod(bannerType: string) {
    this.createBanner(this.banners[bannerType]);
  }
}
```

整個可讀性是不是就大幅提升了！

## 簡易狀態管理

{% note warning %}

事先聲明，以下的程式碼未必是一種好方法，因為可能有封裝過度的嫌疑，造成程式看起來更加複雜，僅當作參考。

（但我自己覺得這樣寫很酷 😎）

{% endnote %}

全域的狀態，我們通常會抽成一個 service，然後在元件內注入，之後在對應的事件方法內呼叫 service，之後也許可以寫成這樣：

先建立一個簡單的狀態管理程式：

```typescript
export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoListStoreService {
  private _todoList$ = new BehaviorSubject<TodoItem[]>([]);

  get todoList$() {
    return this._todoList$.asObservable();
  }

  addTodo(text: string) {
    this._todoList$.next(/* 實作邏輯 */);
  }

  toggleTodo(id: number) {
    this._todoList$.next(/* 實作邏輯 */
  }
}
```

上面程式我們建立一個 `TodoListStoreService` 來管理全域狀態，這也是很常見的一種利用 service 管理全域狀態的方法，接著我們可以實作一個 `useTodoListStore()` 的方法，來幫助我們取得 `TodoListStoreService`，並且只回傳想要公開的部分：

```typescript
export const useTodoListStore = () => {
  const todoListStoreService = inject(TodoListStoreService);
  return {
    todoList$: todoListStoreService.todoList$,
    addTodo: todoListStoreService.addTodo,
    toggleTodo: todoListStoreService.toggleTodo
  };
}
```

之後在元件內只要呼叫這個 `useTodoListStore()` 就好：

```typescript
@Component({
  ...,
  template: `
    <input
      #input
      type="text"
      (keyup.enter)="todoListStore.addTodo(input.value); input.value = ''; input.focus()" />
    <ul>
      <li *ngFor="let todo of todoListStore.todoList$ | async">
        <label [style.text-decoration]="todo.completed ? 'line-through' : 'none'">
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="todoListStore.toggleTodo(todo.id)" />
          {{ todo.text }}
        </label>
      </li>
    </ul>
  `,
})
export class AppComponent {
  todoListStore = useTodoListStore();
}
```

由於不用再注入 `TodoListStoreService` 了，加上元件內的畫面操作都跟公開出來的來源有關，因此在元件內就可以徹底將 `this` 從元件中移除，只剩下樣板而已，徹底簡化元件的程式！

# 本日小結

由於這是新出來的功能，整體到底會讓 Angular 的寫作習慣變成如何還需要觀察，但透過 `inject()` 我們確實「有機會」讓建構式變得更加精簡，有些過去一定要注入才能使用的邏輯未來都可以把 token 和基礎邏輯都抽出來，不過這也可能造成在開發時期如果一下要注入，一下又改用 `inject()`，這種不一致的寫法很有可能會造成混淆。

而站在更快速完成功能的角度來看，假設前面提到如 `getRouteParam` 等未來也由 Angular 本身內建，那麼我們很有可能可以大幅減少初期的學習曲線，畢竟要注入一堆 DI token，然後才能依照邏輯寫程式，還遠不及單純使用如 `getRouteParam` 來的簡單易懂，且更具有宣告性，從「元件變得更簡單」這點來看 `inject()` 的發展還是值得看好的！！
