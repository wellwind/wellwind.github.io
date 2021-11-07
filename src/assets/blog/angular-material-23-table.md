---
title: "[Angular Material 完全攻略]收件夾頁面(3) - Table (基礎功能)"
date: 2018-01-10 18:34:20
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
---

今天我們要來介紹Angular Material中最複雜的元件之一：**表格Table**。透過組合table、sort header和paginator這三個功能，我們會完成一個大部分情境都適用的data table。

Data table可以說是許多軟體都會被使用到的功能，尤其是管理各種資料的後台程式，更是使用data table的大宗來源，而在商務應用上後台軟體的開發需求也是源源不絕，因此data table可以說是前端應用最大的一個議題也不為過！

也因此在Angular Material中要設計data table自然有非常多彈性可以調整的地方，尤其是我們會一次組合3種元件，來完成data table的功能，讓狀況更加的複雜，因此我們會將data table這個主題拆成2篇介紹，今天我們會先完成一個大部分情境都適用的data table，明天則會針對一些細節的部分做進階的介紹；準備好了嗎？開始囉！

<!-- more -->

## 關於Material Design中的Data Tables

在[Material Design的Data tables設計指南](https://material.io/guidelines/components/data-tables.html#)中，data table用來呈現多筆的資料列，在許多系統中的會使用到，我們能透過data table呈現資料，也能夠進行資料的管理。

Data table基本上就是表格的呈現，只是比起傳統HTML的表格，應該具備更多的功能，如**分頁、排序**等等。

## 開始使用Angular Material的Data Table

基本上大多數的data table，都需要3個主要部分：**資料顯示的主體、允許排序的標題及分頁**。在Angular Material中這三個功能分別放在`MatTableModule`、`MatSortModule`及`MatPaginatorModule`，我們今天會一口氣把這三個功能都介紹過，來完成一個基本功能完整的data table，因此我們可以先把這3個module都加到我們的前端專案中。

### 使用mat-table

我們先從最基本的顯示資料主體開始，使用到`<mat-table>`這個元件；在Angular Material中，使用`<mat-table>`與一般table的使用方式會略有不同，因此讓我們一步一步的來完成

#### 準備data source

我們先把資料來源準備好

```typescript
@Component({ })
export class InboxComponent implements OnInit {
  emailsDataSource = new MatTableDataSource<any>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get<any>('https://api.github.com/search/issues?q=repo:angular/material2&page=1').subscribe(data => {
      this.emailsDataSource.data = data.items;
    });
  }
}
```

這裡我們先把Angular Material的GitHub repository中的issues當作是我們的email資料來源，同時我們建立一個`emailDataSource`當作資料的來源，他的型別是`MatTableDataSource<T>`，其中的`data: T`屬性是用來放置主要呈現資料的屬性，其他屬性我們之後的內容慢慢理解。

{% note %}

**資料來源API**：https://api.github.com/search/issues?q=repo:angular/material2&page=1

{% endnote %}

接著在畫面上可以使用一個`<mat-table>`當作data table的主體，同時使用`dataSource`屬性設定資料的來源，來源必須是`MatTableDataSource<T>`，也就是我們在程式中的`emailDataSource`：

```html
<mat-table [dataSource]="emailsDataSource">
</mat-table>
```

#### 定義表格的欄位及資料呈現

接著在`<mat-table>`裡面，我們可以使用`<ng-container matColumnDef="xxxx">`來定義一個表格的欄位(column)，`matColumnDef="xxxx"`代表這個欄位的名稱。

而在欄位裡面需要提供兩個資訊：

-   `<mat-header-cell *matHeaderCellDef>`：代表資料在標題列cell內容。
-   `<mat-cell *matCellDef="let xxx">`：代表實際呈現資料的cell。

在這裡我們定義了4個column，其中3個負責呈現資料，最後一個則是用來管理資料用的：

```html
<mat-table [dataSource]="emailsDataSource">
  <ng-container matColumnDef="user">
    <mat-header-cell *matHeaderCellDef>寄件人</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.user.login }}</mat-cell>
  </ng-container>
  <ng-container matColumnDef="title">
    <mat-header-cell *matHeaderCellDef>標題</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.title }}</mat-cell>
  </ng-container>
  <ng-container matColumnDef="created_at">
    <mat-header-cell *matHeaderCellDef>日期</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.created_at }}</mat-cell>
  </ng-container>
  <ng-container matColumnDef="management">
    <mat-header-cell *matHeaderCellDef>
      <u>管理</u>
    </mat-header-cell>
    <mat-cell *matCellDef="let row">
      <button mat-button color="primary" (click)="reply(row)">回覆</button>
      <button mat-button color="warn" (click)="delete(row)">刪除</button>
    </mat-cell>
  </ng-container>
</mat-table>
```

#### 顯示標題資料列

我們可以使用`<mat-header-row *matHeaderRowDef="[]">`語法，將資料的標題列顯示出來，其中`*matHeaderRowDef="[]"`放置的是每個標題欄位的名稱，也就是我們上個步驟的`matColumnDef="xxx"`的名稱，設定後會把對應名稱column裡的`<mat-header-cell>`找出來並呈現在畫面上：

```html
<mat-table [dataSource]="emailsDataSource">
  <ng-container matColumnDef="user">
    <mat-header-cell *matHeaderCellDef>寄件人</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.user.login }}</mat-cell>
  </ng-container>
  ...

  <mat-header-row *matHeaderRowDef="['user', 'title', 'created_at', 'management']"></mat-header-row>
</mat-table>

```

這時候我們已經可以看到標題列的呈現囉：

{% asset_img 01-table-header.png %}

#### 顯示資料列

有了標題列之後，我們再來把資料列本身顯示出來，透過`<mat-row *matRowDef="">`的語法，我們可以決定要顯示的欄位資料，使用方式如下：

```html
<mat-row *matRowDef="let emailRow; columns: ['user', 'title', 'created_at', 'management']"></mat-row>
```

在這邊我們拆成兩個部分

-   `let emailRow`：代表每一列的資料列名稱，可以想像成類似`<ng-container *ngFor="let emailRow of dataSource.data"></ng-container>`的概念。
-   `columns`：代表實際上要呈現的資料欄位名稱。

這時候畫面就可以正確呈現data table資料啦！

{% asset_img 02-table-data-row.png %}

#### 圖解程式碼

用文字其實稍微有點難描述，畢竟這跟我們一般使用`<table>`、`<tr>`和`<td>`的習慣不太相同，所以筆者把程式碼截圖後，搭配圖示解說，可以把以下圖片與上面的步驟做對應，應該會比較好理解：

{% asset_img 03-data-table-explain.png %}

以上就是基本的data table資料的呈現方式，剛開始可能會不太適應，但用習慣之後，你會發現這種設計其實更加直覺，維護起來也會更加容易哩！

{% note info %}

雖然是以表格的方式呈現，但在Angular Material的data table已經把資料拆成一塊一塊的，再**透過flexbox排版組合**，因此已經不像原生的HTML的`<table>`了，也同時代表我們能夠有彈性的調整data table的呈現方式囉。

{% endnote %}

### 客製化cell樣式

預設情況下，每個欄位的寬度都會被平均分配，但這不一定是我們需要的，已上述例子來說，「寄件人」其實不用那麼寬，我們可以把空間省下來，至於該如何做呢？其實在每個`matColumnDef`區塊內，都會依照我們給的名稱，加上`mat-column-xxxx`的class，例如寄件人欄位我們定義為`matColumnDef="user"`，此時在裡面的`<mat-header-cell>`和`<mat-cell>`都會加上一個`mat-column-user`的class，所以我們只需要定義這個class就可以啦！

```css
.mat-column-user {
  max-width: 100px;
}

.mat-header-cell.mat-column-user {
  color: red;
}

.mat-cell.mat-column-user {
  font-weight: bold;
  text-decoration: underline dashed #000;
  cursor: pointer;
}
```

上述CSS中我們將所有包含`.mat-column-user`的cell最大寬度都設為`100px`，同時我們也設定了標題cell改用紅色文字，以及內容cell的樣式調整，結果是否如我們預期呢？

成果如下：

{% asset_img 04-styled-cell.png %}

果然完全照著我們的預期顯示，完全不用擔心跟原來習慣不同後會不會產生難以做細部調整的問題，真是太棒了！

### 加入分頁功能

接下來我們要加入另一個data table應該具有的重要功能，**分頁**。

#### 使用前端資料進行分頁

我們可以使用`<mat-paginator>`元件，立刻產生一個基本的分頁畫面，並把這個`<mat-paginator>`傳給我們的`MatTableDataSource`，這時候就可以把分頁功能和data table綁在一起啦！

```html
<mat-paginator #paginator 
               [length]="totalCount" 
               [pageIndex]="0" 
               [pageSize]="10"
               [pageSizeOptions]="[5, 10, 15]">
</mat-paginator>
```

`<mat-paginator>`的幾個重要屬性說明如下：

-   `length`：資料的總筆數，有這個筆數才能夠搭配其他參數算出總共有幾頁等資訊
-   `pageIndex`：目前的頁碼，從0開始，預設值是`0`
-   `pageSize`：每頁要呈現幾筆資料，預設值是`50`
-   `pageSizeOptions`：允許切換的每頁資料筆數

接著我們調整一下程式的部分：

```typescript
@Component({ })
export class EmailListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  
  ...

  ngOnInit() {
    this.httpClient.get<any>('https://api.github.com/search/issues?q=repo:angular/material2&page=1').subscribe(data => {
      this.totalCount = data.items.length;
      this.emailsDataSource.data = data.items;
      this.emailsDataSource.paginator = this.paginator;
    });
  }
```

這裡主要是設定總筆數跟data source所使用的paginator。成果如下：

{% asset_img 05-basic-pagination.gif %}

#### 使用後端資料進行分頁

剛剛我們已經完成一個基本的分頁了，不過目前這個分頁有點問題，因為分頁的對象是已經撈到前端的資料，因此撈出30筆，就只能針對這30筆做分頁，但在實務上我們常常是需要將分頁資訊傳遞給後端，由後端依照分頁資訊撈取資料後，再傳給前端顯示，這應該怎麼做呢？

這時候我們就不再需要把`<mat-paginator>`指定給data srouce，而是接收`<mat-paginator>`的`page: Observable<PageEvent>`變動，當使用者切換分頁資訊時，再依照分頁資訊傳遞給後端重新撈取資料，而使用者切換分頁時會得到一個PageEvent，這個PageEvent有3個參數：

-   `pageIndex`：頁碼
-   `pageSize`：每頁筆數
-   `length`：目前資料總筆數(通常是用不到)

接著就讓我們來調整一下程式碼，讓分頁時可以到後端讀取資料吧！

```typescript
@Component({ })
export class EmailListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  
  ...
  
  ngOnInit() {
    this.getIssues(0, 10);

    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      this.getIssues(page.pageIndex, page.pageSize);
    });
  }

  getIssues(pageIndex, pageSize) {
    this.httpClient
      .get<any>(`https://api.github.com/search/issues?q=repo:angular/material2&page=${pageIndex + 1}&per_page=${pageSize}`)
      .subscribe(data => {
        this.totalCount = data.total_count;
        this.emailsDataSource.data = data.items;
        // 從後端取得資料時，就不用指定data srouce的paginator了
        // this.emailsDataSource.paginator = this.paginator;
      });
  }
```

成果如下：

{% asset_img 06-pagination-from-backend.gif %}

我們打開**開發人員工具(F12)**，可以看到每次分頁切換時，就會自動往後端查詢資料，然後再更新到畫面上囉。

### 加入排序功能

有了分頁後，我們再來加入排序的功能。

#### 使用前端資料進行排序

要替欄位加上排序功能很簡單，首先在`<mat-table>`中加入`matSort`，接著在要排序欄位的`<mat-header-cell>`加入`mat-sort-header`這個directive即可。

```html
<mat-table [dataSource]="emailsDataSource" matSort #sortTable="matSort">
  ...
  <ng-container matColumnDef="created_at">
    <mat-header-cell *matHeaderCellDef mat-sort-header>日期</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.created_at }}</mat-cell>
  </ng-container>
  ...
</mat-table>
```

跟前端資料分頁時一樣，要把這個`matSort`的來源交給data source

```typescript
@Component({ })
export class EmailListComponent implements OnInit {
  @ViewChild('sortTable') sortTable: MatSort;
  
  ...

  getIssues(pageIndex, pageSize) {
    this.httpClient
      .get<any>(`https://api.github.com/search/issues?q=repo:angular/material2&page=${pageIndex + 1}&per_page=${pageSize}`)
      .subscribe(data => {
        this.totalCount = data.total_count;
        this.emailsDataSource.data = data.items;
        // 設定使用前端資料排序
        this.emailsDataSource.sort = this.sortTable;
        // 從後端取得資料時，就不用指定data srouce的paginator了
        // this.emailsDataSource.paginator = this.paginator;
      });
  }
```

結果如下：

{% asset_img 07-basic-sort.gif %}

#### 使用後端資料進行排序

當然，我們也一樣可以透過把資料傳遞給後端的方式來進行排序，只需要在加入`matSort`的來源(也就是`<mat-table>`)加入一個`matSortChange`事件即可，當使用者按下欄位排序時，會傳入一個`Sort`型別的變數，包含兩個欄位：

-   active：選擇要排序的欄位。
-   direction：包含`asc`，`desc`和`空字串`，代表要如何進行排序。

```html
<mat-table [dataSource]="emailsDataSource" matSort #sortTable="matSort" (matSortChange)="changeSort($event)">
</mat-table>
```

接著我們針對`matSortChange`來處理排序，並把程式做一些比較大的調整：

```typescript
@Component({ })
export class EmailListComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sortTable') sortTable: MatSort;

  currentPage: PageEvent;
  currentSort: Sort;
  
  ...

  ngOnInit() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
    this.getIssues();

    // 分頁切換時，重新取得資料
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getIssues();
    });
  }

  changeSort(sortInfo: Sort) {
    // 因為API排序欄位是created，因此在這邊做調整
    if (sortInfo.active === 'created_at') {
      sortInfo.active = 'created';
    }
    this.currentSort = sortInfo;
    this.getIssues();
  }

  getIssues() {
    const baseUrl = 'https://api.github.com/search/issues?q=repo:angular/material2';
    let targetUrl = `${baseUrl}&page=${this.currentPage.pageIndex + 1}&per_page=${this.currentPage.pageSize}`;
    if (this.currentSort.direction) {
      targetUrl = `${targetUrl}&&sort=${this.currentSort.active}&order=${this.currentSort.direction}`;
    }
    this.httpClient
      .get<any>(targetUrl)
      .subscribe(data => {
        this.totalCount = data.total_count;
        this.emailsDataSource.data = data.items;
        // 從後端進行排序時，不用指定sort
        // this.emailsDataSource.sort = this.sortTable;
        // 從後端取得資料時，就不用指定data srouce的paginator了
        // this.emailsDataSource.paginator = this.paginator;
      });
  }
}
```

程式碼看起來有點多，但主要的部分就是把分頁和排序都串在一起，然後再一次跟後端取得資料。

成果如下：

{% asset_img 08-sort-from-backend.gif %}

同樣的打開**開發人員工具(F12)**，可已看到每次按排序時，就會自動向後端抓資料囉。

## 本日小結

在資料呈現上，data table可以說是最實用的一種呈現方式，傳統使用`<table>`呈現資料有許多的限制，但若要自己使用CSS排版來重新設計一個data table也不是一件容易的事情，好在Angular Material幫我們設計了一個`<mat-table>`來實現各種data table所需要的功能。

今天我們把一個data table最關鍵的三個部分：顯示資料、分頁及排序都介紹過了，剛開始也許會對於這樣的設計方式不太習慣，但多做幾次後就不難發現這種設計方式會更加直覺，管理上也更加容易。

不管是從前端整理資料，還是把排序、分頁等資訊都交給後端處理，在Angular Material的data table都有對應的方法，以期漂亮的UI，在設計上可以說是沒死角！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-23-data-table

分支：day-23-table

明天我們會在介紹兩個進階的data table功能，以及針對排序、分頁功能做一些進階的說明。

## 相關資源

-   [Material Design - Data tables](https://material.io/guidelines/components/data-tables.html#)
-   [Angular Material - Table](https://material.angular.io/components/table/overview)
-   [Angular Material - Sort header](https://material.angular.io/components/sort/overview)
-   [Angular Material - Paginator](https://material.angular.io/components/sort/overview)
