---
title: "搶先體驗 Standalone Components / Directives / Pipes"
date: 2022-05-14 08:42:44
category:
 - "Angular 大師之路"
tags:
 - "Angular 14"
 - "Standalone"
ogImage: 01.png
---

Angular 14 預計會推出一個重磅功能 - 「Standalone Components / Directives / Pipes」！這個功能允許我們「獨立」的使用 components、directives 和 pipes，不用再強制依靠 `@NgModule`。

目前 Angular 14 已經推出 RC.0 了，這個版本內也包含了 Standalone 的開發人員預覽版本（developer preview of standalone），讓我們可以搶先體驗一下這種**獨立使用元件**的版本，這篇文章就來介紹一下為什麼要使用 Standalone 以及該如何使用。

<!-- more -->

{% note warning %}

由於目前還是**預覽**版本，因此正式推出之後也有可能會有一些不同，也不建議這時候就用在正式環境上，不過基本概念已經是確定是不會變的！

{% endnote %}

# Why Standalone？

Angular 從第 2 版開始，就一直是使用`@NgModule`，也就是**模組**為單位來組織我們的應用程式，包含整個應用程式的啟動，也是啟動一個模組（通常也稱為根模組）

```typescript
platformBrowserDynamic().bootstrapModule(AppModule)
```

不管是畫面上用到的各種元件，或是自訂的服務、`HTTP_INTERCEPTORS` 等等，甚至包含需要用到其他模組的元件，通通都會設定在一個 `@NgModule` 裡面集中管理，這樣做的好處當然是有一個地方管理所有元件或模組，但壞處其實也不少。

## 相依關係較難查找

假設我有一個 `TodoListModule` 模組裡面包含了 `TodoListComponent` 元件，HTML 內容如下：

```html
<ul>
  <li *ngFor="let item of todos">
    <app-todo-item [todoItem]="item">
  </li>
</ul>
```

從畫面中我們可以看到這個元件使用了 `<app-todo-item>` 標籤，合理的可以推斷會有一個 `TodoItemComponent` 的元件存在，不過它是否包含在 `TodoListModule` 內，還是在其他 `@NgModule` 內呢？在這個元件內如果有注入其他程式或使用其他元件，相關的設定也都需要追尋到它自己所屬的模組內。

這就造成了在 Angular 中模組成為了最小的推論（和重用）程式單元，為了查一個元件的相依關係，勢必要往元件所屬的模組去查找，就需要不斷地切換各種檔案；但是，難道不能在元件內就清楚的判斷出相關的相依關係嗎？

## 動態產生元件

再看以下程式：

```typescript
@Component(...)
class AdComponent {
  constructor(private httpClient: HttpClient) { }
}

@NgModule({
  declarations: [AdComponent]
  imports: [HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdInterceptor,
      multi: true
    }
  ]
})
class AdModule { }

@Component(...)
class HostComponent {
  constructor(private vc: ViewContainer) { }

  ngOnInit() {
    this.vc.createComponent(AdComponent);
  }
}

@NgModule({
  declarations: [HostComponent]
})
class HostModule { }
```

這是一個在 `HostComponent` 內動態產生 `AdComponent` 元件的程式，從 `@NgModule` 的角度來看，各自元件所屬的模組是沒有相依關係的，但在 `HostComponent` 中我們卻直接動態的產生了 `AdComponent`，因此原本 `AdModule` 內的 `HTTP_INTERCEPTORS` 設定就沒辦法產生效果了，這會造成很多時候開發上的混淆。

# SCAM Pattern

因為使用 `@NgModule` 會造成一些管理上的麻煩，因此也有大神提出了 [SCAM Pattern](https://medium.com/marmicode/your-angular-module-is-a-scam-b4136ca3917b) 來組組織程式。

SCAM 是「<u>**S**</u>ingle <u>**C**</u>omponent <u>**A**</u>ngular <u>**M**</u>odule」的縮寫，從名稱就很容易可以看出來這代表著「每個模組都只有一個單一元件」的意思，因此每個元件都會有一個直接對應的模組去管理相關設定，同時也可以將內容都存放在同一個檔案（`*.component.ts`）內，當要追查程式時也不用只是為了看一個元件還要先找出它的模組檔案在哪，省去切換檔案的時間和麻煩。

一個簡單的 SCAM 範例，以下程式把模組和元件都存放在一個 `ad.component.ts` 內：

```typescript
@Component(...)
class AdComponent {
  constructor(private httpClient: HttpClient) { }
}

@NgModule({
  declarations: [AdComponent]
  imports: [HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdInterceptor,
      multi: true
    }
  ]
})
class AdModule { }
```

當要看 `AdComponent` 的相依關係時，直接看 `ad.component.ts` 就好，不需要再找其他的檔案，如果將 template 和 style 也都 inline 在元件裡面，一個檔案就是一個獨立模組，就能夠完全對齊 ES6 module 的管理方式啦！

# Standalone 基本觀念

在 Standalone Components / Directives / Pipes 推出來後，只要在 `@Component`、`@Directive` 或 `@Pipe` 內加上 `standalone: true` 設定，我們就能將 component, directive 和 pipe 都當作是一個獨立模組，因此我們可以直接在這些裝飾器內設定 `imports: []` 來匯入其他模組，由於其他元件也是獨立的模組了，所以都可以直接用 `imports: []` 匯入。

```typescript
@Component({
  standalone: true,
  providers: [ ... ]
})
class AdComponent { }

@Component({
  standalone: true,
  // 將元件當作模組匯入
  imports: [ AdComponent ]
})
class HostComponent { }
```

我們原有的 Angular 模組和相依注入相關的知識和基本上都可以沿用，只是可以把 `@Component` 當作是一個「獨立」的模組來使用和設定，當要追查程式時就不用往上找出對應的模組來看設定啦！

有了基本觀念後，接著我們就實際來看看如何用 Standalone 的觀念來寫程式吧。

# 使用 Standalone 來寫程式

完整的範例程式都放到 GitHub 上了，可以直接參考

https://github.com/wellwind/ng-standalone-preview

## 建立應用程式

由於目前 Angular 14 還在 RC 階段，因此要更新 Angular CLI 需要指定 `@next` 版本：

```shell
npm i -g @angular/cli@next
ng new ng-standalone-preview
```

如果只是想體驗用 Angular 14 RC 版本建立的專案，可以不用把非正式版的 Angular CLI 安裝到全域內

```shel
npx @angular/cli@next new ng-standalone-preview
```

安裝過程中會問你要不要使用新的 `ng completion` 功能，不過這個功能我目前在 RC.0 還沒辦法使用，雖然有加入設定，但背後的指令會出現錯誤訊息，有興趣的可以試試看。

## 啟動應用程式

預設的專案不會啟用 Standalone 功能，因此一切都還是 Angular 的模組，我們可以自己進行調整，一開始應用程式是在 `main.ts` 內啟動根模組（`AppModule`）：

```typescript
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

由於我們可以將元件直接視為模組了，因此也可以直接啟動一個元件，不過要改用新的 API `bootstrapApplication` 來啟動

```typescript
bootstrapApplication(AppComponent);
```

在原來 `app.component.ts` 的 `@Component({ })` 內，還要加上 `standalone: true`，告訴 Angular 說這是獨立元件，由於它同時也是一個模組了，因此我們通常會在模組 import `CommonModule` 來使用一些 `*ngIf` 的語法也需要加上去：

```typescript
@Component({
  // 獨立元件
  standalone: true,
  // 使用 CommonModule
  imports: [CommonModule],
  ...
})
export class AppComponent { }
```

這時候就可以把 `app.module.ts` 拿掉啦！

## Standalone Components

在使用 Angular CLI 時可以加上 `--standalone` 參數來建立獨立元件

```shell
npx ng g c todo-list/todo-list --standalone
```

採用 Standalone 寫法後，個人推薦乾脆也將 template 和 style 都 inline 到元件內，再加上 `--flat` 設定，達到一個元件就是一個檔案，大幅減少檔案切換的麻煩：

```shell
npx ng g c todo-list/todo-list --standalone --inline-style --inline-template --flat
```

產生的內容如下：

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      todo-list works!
    </p>
  `,
  styles: [
  ]
})
export class TodoListComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
```

之後就是一般的元件寫法啦！

{% note info %}

你可能會好奇 inline template 和 style 不會讓整個元件檔案行數大增嗎？

答案是肯定的，因此我們必須更有計畫的將畫面切成多個小元件，讓每個獨立元件的行數減少，達到關注點分離，更好閱讀及維護的程式！

將一切都 inline 到一個檔案，我們就能夠更容易地發現目前元件已經做太多事情了！

{% endnote %}

{% note warning %}

在文章撰寫當下，Visual Studio Code 的 Angular Language Service 還沒辦法正確支援 Standalone Components 的寫法，因此可能會看到找不到元件等問題。

{% endnote %}

原來的 AppComponent 內要使用 TodoListComponent，直接加入 `imports: []` 就可以了！

```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule, 
    TodoListComponent // 將 TodoListComponent 當模組 import
  ],
  selector: 'app-root',
  template: `
    <app-todo-list></app-todo-list>
  `,
})
export class AppComponent { }
```

## Standalone Directives

建立 Standalone Directives 也是一樣的，加上 `--standalone` 參數即可

```shell
npx ng g d todo-list/todo-item-done --standalone
```

產生程式如下，一樣的之後都是基本的 directive 程式撰寫

```typescript
@Directive({
  selector: '[appTodoItemDone]',
  // 獨立的 directive
  standalone: true,
})
export class TodoItemDoneDirective {
  constructor() {}
}
```

在要使用這個 directive 的獨立元件內，一樣加入到 `imports: []` 內即可使用

```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule, 
    TodoItemDoneDirective // 使用 TodoItemDoneDirective
  ],
})
export class TodoItemComponent { ... }
```

## Standalone Pipes

一樣的，建立 pipe 時加上 `--standalone` 參數

```shell
npx ng g p todo-list/todo-item-done --standalone
```

產生的程式：

```typescript
@Pipe({
  name: 'todoItemDone',
  // 獨立的 directive
  standalone: true
})
export class TodoItemDonePipe implements PipeTransform { ... }
```

要使用時一樣直接 import：

```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule, 
    TodoItemDoneDirective,
    TodoItemDonePipe // 使用 TodoItemDonePipe
  ],
})
export class TodoItemComponent { ... }
```

## 延遲載入路由

過去我們在用延遲載入路由時，都是使用 `loadChildren` 來載入一個模組，變成 Standalone Components 後，可以改用 `loadComponent` 來載入元件

```typescript
{
  path: '',
  loadComponent: () => import('./app/todo-list/todo-list.component').then(c => c.TodoListComponent)
}
```

目前路由的相關 API 還沒完善，現在要設定路由只能在 `main.ts` 呼叫 `bootstrapApplication` 時搭配 `importProvidersFrom` 來把 `RouterModule.forRoot()` 轉換成 `providers: []` 接受的格式：

```typescript
bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(RouterModule.forRoot(routes))]
});
```

雖然在元件內也有 `providers: []` 的設定可以用，但目前會有問題，無法直接在元件內使用。

如果只能在 `bootstrapApplication` 設定路由，肯定是完全不足夠的，根據 [RFC: Standalone APIs](https://github.com/angular/angular/discussions/45554) 的描述，未來會有類似 `withRoutes` 的 API 來幫助我們設定路由，且可以在元件內直接設定，不過在目前的 developer preview 版本還沒實作，API 名稱也還在開放討論階段，因此還需要等待一段時間。

# 為了 Standalone 前的準備

現在 Standalone Components / Directivees / Pipes 還是 developer preview 階段，離正式推出應該還有一段時間，可能會是 14.1 以後的事情了，不過如果你可以認同這種寫法，未來也有計畫要使用這種寫法，我認為有一些事情可以從現在開始準備，以後上手比較不會那麼痛苦。

## 只 import 需要的模組

過去我們可能會為了方便，而建立一個共用模組，裡面集中管理所有「可能」用到的模組，例如

```typescript
@NgModule({
  exports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    ...
  ]
})
export class MaterialSharedModule { }
```

這樣做當然是很方便，以後只要 import 一個模組就好，不過這樣做有可能會造成一次 import 太多無用的模組，到時候要追查問題反而有可能會看到一堆無效的程式，我們應該只在自己需要的模組內。

## 開始使用 SCAM Pattern

SCAM Pattern 是一種幫助我們組織程式的方法，可以幫助我們減少對元件之間相依關係理解的困擾，未來 Standalone 功能推出後，就等於是內建 SCAM Pattern 了！早點開始套用這種作法，未來就會更容易上手，也可以大幅減少程式碼的變動。

## 攤平 template 與 style

使用 Standalone 功能後，會開始大幅減少模組的撰寫，因此也減少了許多檔案，某種程度我們再也不用同時考慮到 ES6 的模組和 Angular 模組的差異，既然減少的模組檔案，就順便把 template 與 style 都拉到 `*.component.ts` 內吧！如此一來以後一個檔案就是一個完整的獨立元件，可以大幅減少目錄的巢狀結構，如下圖，每個元件都是獨立檔案，管理更加簡單！

{% asset_img 01.png %}

# 本日小結

Standalone Components / Directivees / Pipes 是許多 Angular 開發人員期待的一個重大功能，它可以讓我們更減少檔案切換的時間，同時更容易釐清與管理元件之間的相依關係，每個元件內都可以直接看到目前相依的其他元件或是模組，更加的一目了然；當然 Standalone 不是強制使用的，因此過去都以 `@NgModule` 模組為主的管理還是可以使用且是預設的，但依然推薦可以開始考慮使用 Standalone 功能囉！

# 參考資源

- [範例程式](https://github.com/wellwind/ng-standalone-preview)
- [SCAM Pattern](https://medium.com/marmicode/your-angular-module-is-a-scam-b4136ca3917b)
- [[Complete] RFC: Standalone components, directives and pipes - making Angular's NgModules optional](https://github.com/angular/angular/discussions/43784)
- [RFC: Standalone APIs](https://github.com/angular/angular/discussions/45554)
