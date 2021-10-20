---
title: "[Angular 大師之路] Angular 12 預設開啟 strict mode 的生存之道"
date: 2021-06-21 08:44:59
tags:
  - Angular
  - Angular 12
  - strict mode
---

Angular 12 預設在建立專案時，現在預設會開啟 [strict mode](https://angular.io/guide/strict-mode) 了，strict mode 會加上一些 TypeScript team 建議的檢查，以及 Angular 額外加入的檢查；這代表在不改變設定的情況下，撰寫 Angular 程式將會需要花費更多的心力去處理各種型別的宣告，以避免在 compile 階段發生錯誤。

雖然感覺起來會越來越難寫，但往好處想，這些 strict mode 的檢查，都是為了減少程式在執行階段可能會發生的錯誤，減少非預期錯誤的可能性，也會減少許多 bug 發生的機會，讓我們寫出品質更好的程式碼，也省去更多 debug 的時間浪費！因此花些時間投資在寫出通過 strict mode 檢查的程式碼我覺得是很值得的，今天就來說幾個 strict mode 下容易發生的錯誤以及生存方法。

<!-- more -->

{% note info %}

strict mode 當然是可以關掉的，不過開啟 strict mode 除了除錯更容易以外，對於 Angular 來說使用 strict mode 也會有利於未來使用 `ng update` 更新程式時更容易安全的重構程式碼，為了專案長遠考量，還是很建議把它打開！

{% endnote %}

# strictNullChecks

打開 strict mode 後，最容易發生的錯誤非 `strictNullChecks` 檢查莫屬了！這也是一般撰寫 JavaScript 程式時最容易在執行階段發生錯誤的問題，也就是嘗試去存取一個 `null` 或 `undefined` 的屬性，例如：

```typescript;highlightLines=2:18:2:22;
let user;
console.log(user.name);
```

由於 `user` 還沒給予任何值，直接存取它的 `name` 屬性肯定是錯誤的，使用 TypeScript 開發時就會得到以下錯誤：

{% asset_img 01.png %}

也就是我們存取到的一個可能會是 `undefined` 的物件，如果不管這個錯誤直接執行，就會看到知名的錯誤訊息：

{% asset_img 02.png %}

有非常多的新手開發人員看到這個錯誤訊息都會解讀成 `name` 是 `undefined`，導致在查找問題時根本就找錯方向，`undefined` 的是 `user` 而不是 `user.name`，去追查為什麼 `user.name` 是 `undefined` 完全沒有意義，因為真正 `undefined` 的是 `user` 本身。

這種的解決方式很簡單，確定有賦予變數資料即可：

```typescript;highlightLines=1:1:1:1:true
let user = { name: 'Mike' };
consoe.log(user.name);
```

再舉一個稍微複雜一點的例子，使用陣列的 `find` 查找資料時：

```typescript
const data = [
  { name: 'Mike' },
  { name: 'Will' },
  { name: 'Kevin' }
];
const result = data.find((item) => item.name === 'Mike');
console.log(result.name);
```

一樣會在 TypeScript 檢查時因為 `strictNullChecks` 發生錯誤：

{% asset_img 03.png %}

因為 `Array.find` 會在找不到資料時回傳 `undefined`，這點從它的 TypeScript 方法簽章定義也可以看到：

{% asset_img 04.png %}

解決方法有幾種，第一種最常用的標準方式是主動確認查詢結果是否為 `null` 或 `undefined`，如果不是才處理：

```typescript
if(result) {
  console.log(result.name);
}
```

第二種是使用 JavaScript 的 [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 語法，也就是用 `result?.name` 這種寫法，當 `result` 是 `null` 或 `undefined` 時，就不會繼續往下處理

```typescript
console.log(result?.name);
```

這其實也是一種檢查，不過要注意的是這裡的寫法如果真的是回傳 `undefined`，則會輸出 `undefined` 當作結果。

第三種是使用 TypeScript 的 [Non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)，也就是 `result!.name`，這種寫法是告訴 TypeScript 說「我可以肯定不會出現 `null` 或 `undefined` 的狀況，因此不用特別提醒我」：

```typescript
console.log(result!.name);
```

不過要特別注意的是，這只是我們主動斷言 `result` 不會是 `null` 或 `undefined`，不代表「絕對不會發生」，也就是當執行階段發生錯誤時，我們必須自行負責判斷問題，所以請在真的有信心時才使用這種寫法。

# noImplictAny

當宣告一個變數沒有定義型別，且 TypeScript 無法推斷型別時，預設會當作 `any` 型別，而開啟 `noImplictAny` 後，則會要求你至少要明確定義這是一個 `any` 型別，例如：

```typescript
transform(input) {
  return input;
}
```

這是我們在寫方法時常常犯的錯誤，忘記定義型別，當開啟 `noImplictAny` 後，就會看到錯誤：

{% asset_img 05.png %}

解決方式很簡單，給予一個明確型別就好

```typescript
transform(input: MyInput) {
  return input;
}
```

若真的難以定義型別，至少也要明確定義為 `any`

```typescript
transform(input: any) {
  return input;
}
```

# strictPropertyInitialization

在撰寫 class 的時候，我們會設定很多的屬性(property) 來幫助我們保留程式的狀態，當這些屬性沒有初始值時，開啟 `strictPropertyInitialization` 檢查就會報錯，例如：

```typescript
export class TodoListTableComponent {
  todoList: TodoItem[];
}
```

我們有給 `todoList` 明確的型別定義了，但沒有給予初始值，因此會發生 `Property 'xxxx' has no initializer and is not definitely assigned in the constructor.` 的錯誤。

{% asset_img 06.png %}

這一樣是為了避免我們在沒有任何資料時直接去存取導致存取 `undefined` 的執行階段錯誤，因此只要在宣告屬性時記得一定要給予預設資料即可：

```typescript
export class TodoListTableComponent {
  todoList: TodoItem[] = [
    { text: 'Task 1', done: true },
    { text: 'Task 2', done: false }
  ];
}
```

由於 TypeScript 具有型別推導的能力，因此若能正確推論型別，也不一定要明確宣告型別，只要有初始值，就足以判斷型別為何了：

```typescript
export class TodoListTableComponent {
  todoList = this.getTodoList();
  
  getTodoList(): TodoItem[] {
    return [
      { text: 'Task 1', done: true },
      { text: 'Task 2', done: false }
    ];
  }
}
```

當然還有一招，但不常用，就是宣告屬性時說明這個屬性是有可能 `undefined` 或 `null` 的，那麼不給初始值也是很合理的一件事情：

```typescript
export class TodoListTableComponent {
  todoList: TodoItem[] | undefined;
}
```

# strictTemplates

`strictTemplates` 是 Angular 定義的檢查條件，當開啟 `strictTemplates` 時，在元件的 template 上也會進行嚴格的型別檢查，例如：

```typescript
@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <li *ngFor="let item of todoList">{{ item.text }}</li>
    </ul>`
})
export class TodoListComponent {
  @Input() todoList: TodoItem[] = [];
}

@Component({
  selector: 'my-app',
  template: `
    <todo-list [todoList]="todoList"></todo-list>
  `
})
export class MyAppComponent {
  todoList: TodoItem[] | undefined;
}
```

由於 `TodoListComponent` 有明確定義 `@Input() todosList` 必須是 `TodoList[]` 型別，但在使用元件時，卻傳入一個可能會是 `undefined` 的物件，因此也會造成型別檢查的錯誤：

{% asset_img 07.png %}

這時候又看要由哪個元件要修改成配合另一個元件的型別定義了，由於 `TodoListComponent` 是共用的元件，且定義了 `@Input() todoList` 不可以傳入可能是 `undefined` 的物件，因此建議配合這些共用元件修改，養成這個習慣後，就算使用第三方元件也比較不會有問題(畢竟不會一有型別衝突就要第三方元件修改吧？)。

```typescript
@Component({
  selector: 'my-app',
  template: `
    <todo-list [todoList]="todoList"></todo-list>
  `
})
export class MyAppComponent {
  todoList: TodoItem[] = [];
}
```

這邊將使用 `TodoListComponent` 的元件屬性配合改成不會 `undefined` 的情況，且明確給予預設值，即可避免出錯。

`strictTemplates` 檢查會讓過去很多沒使用 strict mode 時的開發習慣變成錯誤，剛開始會不太習慣，但理解原理，並保持明確的定義好各種型別，就能夠保持優雅步調的解決各種型別檢查問題，同時 bug 也會越來越少！

# strictTemplates 檢查下使用 async pipe

過去我們介紹過[使用 async pipe 搭配 Observable 物件](https://wellwind.idv.tw/blog/2018/11/11/mastering-angular-27-async-pipe/)的開發技巧，在元件中宣告 Observable 物件，但不做訂閱，而是等到畫面產生時，由 async pipe 幫助我們訂閱，這種寫法過去的習慣在 `strictTemplates` 下會產生一些問題，例如：

```typescript
@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <li *ngFor="let item of todoList">{{ item.text }}</li>
    </ul>`
})
export class TodoListComponent {
  @Input() todoList: TodoItem[] = [];
}

@Component({
  selector: 'my-app',
  template: `
    <todo-list [todoList]="(todoList$ | async)?.data"></todo-list>
  `
})
export class MyAppComponent {
  todoList$ = this.getTodoList();

  getTodoList(): Observable<{ data: TodoItem[] }> {
    return of({
      data: [
        { text: 'Task 1', done: true },
        { text: 'Task 2', done: false }
      ]
    }).pipe(delay(500));
  }
}
```

這是過去的習慣寫法，由於 async pipe 訂閱非同步的 Observable 時一開始可能會沒有資料，因此使用 `?.` 讓存取 `null` 或 `undefined` 屬性這種執行階段的錯誤不會發生，而開啟 `strictTemplates` 檢查後，由於使用的元件定義並不允許傳入 `null`，因此會報錯：

{% asset_img 08.png %}

但偏偏目前的情境就是會傳入 `null`，這就變成了兩難的狀況，除非去修改共用元件的屬性型別定義，否則程式檢查就是會出錯，但我們怎麼能三不五時就亂修改共用元件定義呢？

所以還是要從自身做起，冷靜下來思考一夏到底為什麼會出錯，背後的用意又為何？

很明顯的我們可以知道這就是為了避免出現存取 `null` 或 `undefined` 所造成的錯誤，由於共用元件預設就是非 `undefined` 的資料，如果我們強制傳入 `undefined` 的話，就很有可能會造成共用元件因為存取 `undefined` 而出錯，因此我們必須要能明確的傳入一個預設物件給共用元件。

但我們呼叫 API 存取資料時，使用的是非同步的 Observable 物件，所以一開始一定不會訂閱到任何資料啊！

解決的方式很簡單，使用 `startWith` operator，即可在訂閱發生時立刻給予一個起始事件，讓 async pipe 訂閱時立刻可以得到資料，就不會發生錯誤了：

```typescript
// import { startWith } from 'rxjs/operators';

todoList$ = this.getTodoList()
  .pipe(startWith([]));
```

目前解決的是單純邏輯上的問題，也就是確保元件屬性一定可以收到一個預設物件，而不是 `undefined` 或 `null`，但語法上還是有問題，由於 async pipe 的 `transform` 方法回傳型別依然是定義成有可能是 `null` 的，因此在樣板檢查時型別依然對應不起來，加上使用 `(tosoList$ | async)?.data` 本來就是有傳入 `undefined` 的意義，因此依然會有錯誤。

不過我們使用 `startWith` operator 後，已經可以確定當訂閱時一定會同步擁有一個預設事件了，不會在執行階段因為存取 `null` 或 `undefined` 發生錯誤，因此可以使用 Non-null assertion operator (`!`) 告訴 TypeScript 這裡沒有問題：

```typescript
@Component({
  selector: 'my-app',
  template: `
    <todo-list [todoList]="(todoList$ | async)!.data"></todo-list>
  `
})
```

如此一來在編譯階段也不會再報錯囉！

當然，如果是要傳入整個物件，而不是物件屬性，依然可以直接使用 Non-null assertion operator 語法：

```html
<my-component [data]="(data$ | async)!"></my-component>
```

保持使用 `startWith` operator 與 Non-null assertion operator 的好習慣，就不用害怕在 strict mode 使用 async pipe 啦！

{% note info %}

思維模式懶人包：物件屬性要給予初始值，以 Observable 這種 stream 思考時有一個初始事件也是很合理的！

{% endnote %}

另外一種簡單易懂的處理方式是，用 `ngIf` 來檢查資料是否為 `null` 或 `undefined`：

```html
<ng-container *ngIf="data$ | async as data">
  <my-component [data]="data"></my-component>
</ng-container>
```

這種寫法就如同我們在 TypeScript 會自己寫 `if` 判斷資料是否為 `null` 或 `undefined` 一樣，更加簡單；不過要注意的是，如果元件有很多屬性都會用到 Observable + async pipe 的話，就會出現巢狀的 `ngIf`。

# 本日小結

在 Angular 12 預設開啟 strict mode 後，不可否認會影響過去許多的開發習慣，讓程式開發時變得比較比較綁手綁腳，但只要能理解背後的用意是為了減少 bug 發生，並且知道修改後能大幅減少過去執行階段發生錯誤造成難以追查的問題，就能理解花點時間投資在解決 strict mode 的問題絕對划算！

今天介紹了比較常見在 strict mode 下會因為過去習慣造成的開發時期錯誤，只要能長期在心中保持對應出正確的型別(這也是 TypeScript 的一大目標)，漸漸地就能夠習慣這些多出來的手續，悠然存活在 Angular 12 的 strict mode 之下，並且換來品質更高的程式！

# 相關資源

* [strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks)
* [noImplictAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)
* [strictPropertyInitialization](https://www.typescriptlang.org/tsconfig#strictPropertyInitialization)
* [strictTemplates](https://angular.io/guide/angular-compiler-options#stricttemplates)
* [[Angular 大師之路] 認識 AsyncPipe (1) - 基本使用技巧](https://wellwind.idv.tw/blog/2018/11/11/mastering-angular-27-async-pipe/)
