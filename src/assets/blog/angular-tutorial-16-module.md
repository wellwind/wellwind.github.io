---
title: "[Angular速成班]透過Module組織管理你的程式"
date: 2017-02-18 11:11:11
category: "Angular速成班"
tags:
    - Angular CLI
    - Angular
    - \@NgModule
---
在過去的文章我們已經學到—Angular的應用程式是由一個一個的component所堆積組合起來的，這麼做的好處不用多說就是關注點分離，讓你專心在目前的功能上，也不用擔心影響到其他的component，但是當你的程式架構越來越龐大時，管理這些數以百計的components就變成一門學問了，這時候我們就可以透過模組化的機制，更有組織的管理你的所有components，這也就是我們今天要談的主題—Module。

<!-- more -->

# 開始使用Module

其實在我們早就已經有使用過Module了，在使用Angular CLI建立一個Angular專案時，就會在src/app下產生一隻為app.module.ts個的檔案，這裡面放著我們Angular專案預設的入口，也就是第一個Module—AppModule，首先讓我們看看裡面的程式：

{% asset_img 0.png %}

從程式中可以看到我們使用Angular CLI建立的components都已經在這裡的`declarations: []`宣告了，如果你還記得的話，在[之前講到Service時](http://wellwind.idv.tw/blog/2017/02/03/angular-tutorial-10-service/)，我們也曾手動將TodoListService加入AppModules的`providers: []`中，另外還有**BrowserModule、FormsModule**這些宣告，則是Angular中內建可用的modules，少了這些modules，我們就沒有像是**ngIf、nfFor和ngModel**這類的好東西可用哩。

看到這些內建的modules也給了我們一些啟發，我們可以藉由將程式封裝成一組一組的modules，就可以把它分享出去給別人使用囉！這在團隊中有共用的一些元件、程式時非常有用，我們可以把共用的程式抽出來封裝到modules裡面，然後上傳到private git中，再使用npm指定git路徑安裝，就能在不同專案間共享程式碼啦！甚至可以把你的心血公開上傳到npm，讓全世界一起使用！聽起來就很熱血阿！！

至於Angular專案怎麼知道AppModule是我們應用程式的入口呢？我們可以打開angular-cli.json看到**apps[0].main**的設定，裡面設定了**main.ts**，這隻程式在Angular CLI編譯打包程式時，會作為主要的程式進入點，而在main.ts中的程式如下：

{% asset_img 1.png %}

我們可以看到`platformBrowserDynamic().bootstrapModule(AppModule);`就說明了AppModule就是我們啟動時要執行的module啦！因此若是有需要，我們也可以在這裡換成其他的module，很有彈性吧！

那麼Angular的Module到底可以用來幹嘛呢？根據[官方文件](https://angular.io/docs/ts/latest/guide/ngmodule.html)的說法，Angular Moduleg是一隻由帶有相關metadata物件的**@NgModule**裝飾的function，這些metadata物件告訴我們：

*   哪些components、directives和pipes屬於這個module
*   module下哪些類別是可以公開給外部使用的
*   在這個module下，我們需要匯入哪些其他的module給我們的components、directives和pipes使用
*   提供了哪些services是應用程式中所有的組件都可以使用的

接下來我們將示範把之前寫好的TodoApp封裝到一個module裡面，同時說明如何在**@NgModule**裡面宣告上述的4個部分，在完成後你將會發現我們的程式及目錄結構變得更加清楚！

# 建立一個Module

要建立一個module非常簡單，透過Angular CLI只要一個指令就搞定

```
ng g m todo-app
```

接著你會看到src/app下面多了一個todo-app的資料夾以及**todo-app.module.ts**

# 搬移相關檔案

接著我們把跟TodoApp相關的程式都移進這個資料夾

{% asset_img 2.png %}

搬移後變成：

{% asset_img 3.png %}

把所有相關的程式都放在一起，看起來是不是舒適很多呢？接著我們建立一個屬於TodoAppModule的component看看，透過指令

```
ng g c todo-app/todo-app
```

我們在用Angular CLI建立程式時，可以輸入相對路徑，程式會建立在你指定的路徑上

{% asset_img 4.png %}

同時，如果你指定的路徑已經包含了module的話，也會自動幫你把相關宣告放在module定義中，打開**todo-app.module.ts**看看

{% asset_img 5.png %}

可以看到Angular CLI在建立component時也幫我們加到自己建立modules中的`declarations: []`囉，接著我們把AddFormComponent和TodoItems也加入**todo-app.module.ts**的declarations中，順便把TodoDonePipe也加入，並把AppModule裡面同樣的宣告移除掉

```typescript
  declarations: [
    TodoAppComponent,
    AddFormComponent,
    TodoItemsComponent,
    TodoDonePipe
  ]
```

到目前我們已經達到了前面說明的`哪些components、directives和pipes屬於這個module`的部分，也就是說，components、directives和pipes在module中，都必須放到`declarations: []`中宣告，如果一開始就規劃好module的話，這些Angular CLI都會幫我們做好，如果是要搬移的話，還是要手動作囉。

# 將TodoListService加入TodoAppModule

由於TodoListService只需要給TodoAppModule使用，因此我們將TodoAppService加入TodoAppModule的providers: []裡面，預設建立的TodoAppModule可能沒有`providers: []`，但我們可以自己在**todo-app.module.ts**中加入

```typescript
providers: [TodoListService]
```

這裡的目標是宣告module中`提供了哪些services是應用程式中所有的組件都可以使用的`。

# 將TodoAppModule加入AppModule

接著我們可以把TodoAppModule加入AppModule的`imports: []`中，告訴AppModule`在這個module下，我們需要匯入哪些其他的module給我們的components、directives和pipes使用`。

**app.module.ts**內容變成

```typescript
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TodoAppModule
  ],
```

另外，在AddForm中我們使用到了`ngModel`，這個指令放在FormsModules中；因此我們必須在TodoAppModule中匯入FormsModule，而`ngIf`和`ngFor`在CommonModule中，但在建立module時預設已經加入囉

```typescript
  imports: [
    CommonModule,
    FormsModule
  ]
```

你可能發現我們import了CommonModule和FormsModule，但TodoListService用到的HttpModule卻不需要在這裡匯入，是因為Http是一個Service，而Service在AppModule中import之後就可以在所有應用程式下面的組件使用（可以回去翻第三點），而且只會產生一次，以增進效能。

 ngIf和ngFor在CommonModule中，但AppModule並沒有import CommonModule卻可以使用，原因我們稍後說明。

# 讓AddFormComponent和TodoItemsComponent可供外部使用

如果這時候我們執行程式起來，會發現程式無法正常執行，而打開F12時看到這樣的訊息

{% asset_img 6.png %}告訴你沒有app-add-form這個component，這是因為我們雖然把AddFormComponent加入TodoAppModule中了，但還需要宣告module下哪些類別是可以公開給外部使用的，我們必須把要提供給外部使用的類別加入exports: []中，因此我們把AddFormComponent和TodoItemsComponent放入這裡面：

```typescript
  exports: [
    AddFormComponent,
    TodoItemsComponent
  ]
```

再執行看看，就大功告成啦！我們已經成功的把TodoList相關的元件封裝到一個TodoAppModule中囉。

在AppModule中不用import CommonModule的原因是因為BrowserModule把CommonModule匯入並重新exports了，因此其實在AppModules中等於已經加入CommonModule了

最後調整一下，把AddFormComponent和TodoItemsComponent都export出來，會變成兩個component可以獨立在不同地方使用，我們不希望發生這樣的事情（e.x.按下AddFormComponent卻看不到任何變化），因此我們把這兩個component加到之前建立的TodoAppComponent的View（**todo-app.component.html**）中：

```html
<app-add-form></app-add-form>

<app-todo-items></app-todo-items>
```

之後只把TodoAppComponent進行export就好囉，TodoAppModule中的`exports: []`改為：

```typescript
  exports: [
    TodoAppComponent
  ]
```

如此一來在TodoAppModule外就不能單獨使用AddFormComponent或TodoItemsComponent囉！這麼一來封裝性就更加強大，程式的職責也更加清楚啦！！

# 單元回顧

今天我們學到了使用@NgModule來將程式模組化，@NgModule參數為一個metadata物件，內容如下：

*   `declarations: []`：哪些components、directives和pipes屬於這個module
*   `exports:[]`：module下哪些類別是可以公開給外部使用的
*   `imports:[]`：在這個module下，我們需要匯入哪些其他的module給我們的components、directives和pipes使用
*   `providers:[]`：提供了哪些services是應用程式中所有的組件都可以使用的

透過將程式模組化，可以讓程式架構更加明確，搭配Angular CLI會自動幫你將模組化的內容收納在對應的資料夾下，見少無謂的重工，增強生產力；善用module，我們可以架構出更加清楚好維護的程式碼，也能夠更容易的將程式碼分享出去，實在是送人自用兩相宜的好工具阿！！ 

今日程式碼：[https://github.com/wellwind/AngularDotblogsDemo/tree/ModuleDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/ModuleDemo)