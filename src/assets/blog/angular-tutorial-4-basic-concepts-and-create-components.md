---
title: "[Angular速成班]來寫個TodoApp(1)-基本原理與架構"
date: 2016-10-18 11:11:11
category: "Angular速成班"
tags:
    - Angular CLI
    - Angular
    - NgModule
    - Component
---
之前的文章介紹過Angular CLI的基本用法之後，本篇文章開始就來寫一個簡單的TodoApp，藉此來練習Angular的各種特色。

<!-- more -->

# 基本觀念

首先，我們必須先知道，**Angular引入了Web Component的概念**，也就是**一個Angular app基本上是由數個元件(component)來組成的**，因此在設計時我們可以適當的將預期的畫面拆解成數個component，然後各司其職，並且適當的彼此溝通，來完成我們預期的程式。

那麼要如何建立一個component呢？其實在之前Hello World的文章我們使用Angular CLI建立一個專案時，就已經有一個最基本app-root的component囉！

我們可以打開**src/app/app.component.ts**，看到以下程式

 ```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
```


在這裡我們可以看到**@Component**就是用來將AppComponent這個class**"裝飾"**成一個component，這是在ES6提出來的一種decorator語法，使用@#XXXX來從不同的切面對程式進行描述，雖然大部分的瀏覽器都還不支援，但我們使用TypeScript撰寫時，編譯器就能將程式轉換成大部分瀏覽器都看得懂得程式碼了！

Angular製作了許多的decorator，而@component就是其中一個，因此只要在class上面使用@component宣告，Angular核心就能夠知道這是一個component囉！而裡面目前看到的三個屬性：

- **selector**: 用來表示在HTML上的哪個element要套用這個component

- **templateUrl**: 用來表示這個component的view存放位置

- **styleUrls**: 用來加入專屬於這個component的css檔案位置

如果要用JavaScript來寫的話看起來大概是這樣(程式碼取自官方文件)：

```javascript
(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      template: '<h1>My First Angular App</h1>'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
```

個人感覺是滿不習慣的啦XD

那麼這個AppComponent是在那裡顯示的呢？我們可以再來看看**src/index.html**

```html
  <meta charset="utf-8">
  <title>AngularDemo</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <app-root>Loading...</app-root>
```


裡面的`<app-root>Loading...</app-root>`這段就是呈現AppComponent的部分！在瀏覽器剛打開時，因為還看不懂app-root是什麼，所以會直接呈現裡面的Loading...，當JavaScript程式碼讀取完後游Angular接手時就會把適當的內容產生上去囉。

{% note warning %}  
值得稍微注意一下的是，這段HTML裡面我們看不到`<script src"..." />`這樣的內容，但在使用ng build打包程式時，會透過webpack自動幫我們把打包好的程式加入這段HTML裡面。  
{% endnote %}  

最後我們來看看src/app/app.module.ts

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


我們在一次看到了一個decorator，不過這次是**@NgModule**，Angular除了component觀念外，也可以**透過module對複雜的components做分類管理**，之後有機會再來詳細介紹，現在只需要知道AppModule是我們程式最主要的module，且是使用@NgModule裝飾就可以了，在declarations裡面放了一開始就有的AppComponent，imports裡面預設加入了三個最常用的module，以及bootstrap裡面宣告我們會由AppComponent來啟動，providers裡面目前是空的，以後我們會加入需要的provider。

# TodoApp架構

有了基本的component概念後，我們接著來看看一個TodoApp需要那些元件，初步我們規劃成3個component，如下圖

{% asset_img 0.png %}

# 加入第一個Component

接下來我們就來實際建立一個component來看看吧！我們先建立一個標題區的component，可以使用`ng g c header`指令來建立，執行完後會發現我們的專案**src/app**下面多了一個header目錄，裡面有4個檔案

{% asset_img 1.png %}其中header.component.spec.ts是用來寫unit test的，在介紹觀念的初期我們不會使用，因此可以考慮把它刪掉，或保留以後再把測試程式加進去。

{% note info %}  
仔細看看檔案和目錄的名稱，我們可以發現使用Angular CLI建立的檔案名稱都非常明確，也嚴格遵循官方推薦的[Style Guide準則](https://angular.io/docs/ts/latest/guide/style-guide.html)，這讓我們在開發時能夠更加順暢的辨識各種檔案的功能。  
{% endnote %}  

另外在**src/app/app.module.ts**中我們可以看到declarations裡面也加入了HeaderComponent。

我們可以先來看看header.component.ts的內容：

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

```

有沒有覺得跟之前的AppComponent非常類似啊！透過Angular CLI，要產生一個component就是一行指令的動作而已，很方便吧！

接下來我們把header.component.html的內容改成如下：

```html
<h1>歡迎來到Todo App</h1>
```

然後把app.component.html的內容從原本的

```html
<h1>{{title}}</h1>
```

改成

```html
<app-header></app-header>
```

然後回到命令提示字元輸入`ng serve`啟動模擬的伺服器，再打開瀏覽器輸入`http://127.0.0.1:4200`，就可以看到我們設計的HeaderComponent正常顯示出來啦！

{% asset_img 2.png %}

# 加入其他Components

有了建立第一個component的概念之後，接下來就簡單多啦！我們可以使用` ng g c add-form`和`ng g c todo-items`來分別建立AddFormComponent和TodoItemsComponent！

{% asset_img 3.png %}

接著我們先把模擬的畫面程式碼填入，首先是**src/app/add-form/add-form.component.html**：

```html
<input type="text" placeholder="請輸入代辦事項"> <button>增加</button>
```

接著是**src/app/todo-items/todo-items.component.html**：

```html
<ul>
  <li><label for="chk_1"><input id="chk_1" type="checkbox">Todo Item 1</label> | <a href="#">刪除</a></li>
  <li><label for="chk_2"><input id="chk_2" type="checkbox">Todo Item 2</label> | <a href="#">刪除</a></li>
  <li><label for="chk_3"><input id="chk_3" type="checkbox">Todo Item 3</label> | <a href="#">刪除</a></li>
</ul>
```


最後再把**src/app/app.component.html**修改為：

```html
<app-header></app-header>

<app-add-form></app-add-form>

<app-todo-items></app-todo-items>
```

再回到瀏覽器，就可以看到我們的TodoApp基本架構的畫面囉。

{% asset_img 4.png %}

之後我們的目標就是把這些基本功能完成，同時學習Angular啦！

# 單元回顧

本篇文章中我們學到了一些Angular的基本原理，以及decorator的使用方式，接著透過Angular CLI建立了3個component，並且觀察到了Angular CLI產生檔案時的變化，透過Angular CLI我們可以快速產生component，減少很多寫程式的時間，讓我們能更專注在核心程式碼中；同時我們也注意到Angular CLI產生的檔案名稱結構都非常明確，這可以幫助我們更容易辨識每個檔案的功能；我們已經把基本的畫面架構完成了，在下一篇文章開始就會慢慢把程式碼填入囉。

本篇文章的程式碼放在[https://github.com/wellwind/AngularDotblogsDemo/tree/TodoAppScaffold](https://github.com/wellwind/AngularDotblogsDemo/tree/TodoAppScaffold)，之後的文章都會以這個repository上建立新的branch，方便大家觀察每個階段的程式碼變化。