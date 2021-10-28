---
title: "[Angular速成班]開發Ajax程式不可或缺的重要關鍵—Http Module"
date: 2017-02-04 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - HttpModule
    - RxJS
---
Angular是一個純前端的MVC框架，但在開發Web Application時我們有非常多的機會需要透過Ajax與後端的API進行資料的存取，因此Angular也提供了Http Module，來幫助我們的程式不在只是前端AP而已，而是能與後端聯繫的完整應用。

<!-- more -->

# 開始使用HttpModule

HttpModule內包含了一個名為Http的類別，此類別包含了我們進行Ajax時所需要的方法，除了最基本的request方法外，我們也可以使用get、post、delete、put等方法來傳送常見的Http方法，關於這些方法可以參考[官方的HTTP Api文件](https://angular.io/docs/ts/latest/api/http/index/Http-class.html)。

如同上一篇文章介紹的Service一樣，要使用Http類別我們一樣需要使用建構式注入的方式，因此我們要先確定AppModule(**src/app/app.module.ts**)內已經加入了**HttpModule**，與Service不同的是Module必須加入`imports: []`之中，如下圖：

{% asset_img 0.png %}

確定有加入HttpModule後，我們就可以在我們想要的地方注入Http這個類別啦！

## 在assets目錄模擬後端程式

接著我們在**src/assets**中加入一個todo-list.json的程式，來模擬後端取得TodoList的資料

```json
[
  {
    "id": 1,
    "value": "Todo Item No.1",
    "done": false
  },
  {
    "id": 2,
    "value": "Todo Item No.2",
    "done": true
  },
  {
    "id": 3,
    "value": "Todo Item No.3",
    "done": false
  }
]

```

{% note info %}  
在Angular CLI建立的專案架構下，在使用ng serve或ng build指令時，預設會將src/assets目錄裡的內容都當作靜態內容，將裡面的程式都移到輸出路徑的/assets裡面  
{% endnote %}  

## 在Service中注入並使用Http

接著我們要開始使用Http類別了，我們要在之前建立的TodoListService中加入使用Http從後端抓取資料的程式，**src/app/todo-list.service.ts**的程式碼看起來會如下

```typescript
import { Http } from '@angular/http'; // 我們要使用的Http
import 'rxjs/add/operator/toPromise'; // 幫助我們將RxJs轉為Promise

@Injectable()
export class TodoListService {

  // 原來的資料移到assets/todo-list.json裡面去了
  todoItems: TodoItem[];

  // 建構式注入Http，你應該已經會用了
  constructor(private http: Http) { }

  // 使用http.get取得後端資料
  // http.get會回傳RxJS的Observable物件
  // 我們先用.toPromise()轉回我們會使用的ES6 Prmoise
  並利用toPromise()轉成ES6的Promise
  loadTodoList() {
    this.http
      .get('/assets/todo-list.json')
      .toPromise()
      .then(response => {
        this.todoItems = response.json();
      });
  }

  // 接著是之前已經完成的程式碼...省略
}
```

值得一提的是，**http.get()會回傳一個RxJS的Observable物件**，RxJS是Reactive Programming的JavaScript實做，而Reactive Programming則是另一種管理資料流的概念；雖然RxJS很強大，但也很抽象，需要花點時間才能熟悉，這對我們剛開始學習Angular不一定是件好事，還好我們可以加入`import 'rxjs/add/operator/toPromise';`來為RxJS擴充一個.toPromise()方法，可以把資料轉為我們熟悉的ES6的Promise語法。在有空回來學習RxJS之前，這個.toPromise()非常有用。

{% note info %}  
關於RxJS，可以參考[30天精通RxJS](http://ithelp.ithome.com.tw/users/20103367/ironman/1199)系列文章，內容非常豐富  
{% endnote %}  

{% note info %}  
Angular中其實大量的用到RxJS，只是大部分時間我們感覺不出來而已  
{% endnote %}  

## 調整TodoItemsComponent

在TodoListService中加入好取得後端資料的程式碼後，我們可以在TodoItemsComponent中要求Service來取得資料，這部分的程式可以寫在Component的ngOnInit()方法中，在Component初始化時來執行，在src/app/todo-items/todo-items.component.ts中的程式碼如下：

```typescript
export class TodoItemsComponent implements OnInit {
  // 建構式注入TodoListService，之前已經做過了
  constructor(private todoListService: TodoListService) { }

  // 在ngOnInit()中，要求TodoListService從後端抓取資料
  ngOnInit() {
    this.todoListService.loadTodoList();
  }

  // 以下是之前已經完成的程式碼...省略
}
```

如此就大功告成囉！執行程式後我們可以打開瀏覽器的開發人員工具，看看是否有從後端抓取資料，以Google Chrome舉例

{% asset_img 1.png %}

看到有抓取後端的todo-list.json，程式運作一切正常，就沒有什麼問題啦！

# 單元回顧

今天我們學到了Angular中Http類別的使用，也複習了建構式注入的方法，透過Angular提供的Http，我們可以打造更完整的web應用程式，而不是只有前端的孤兒。能夠應用的方向也更加寬廣囉！

今天的程式碼：

[https://github.com/wellwind/AngularDotblogsDemo/tree/HttpServiceDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/HttpServiceDemo)