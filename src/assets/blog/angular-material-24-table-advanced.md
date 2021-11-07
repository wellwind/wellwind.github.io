---
title: "[Angular Material 完全攻略]收件夾頁面(4) - Table (進階功能)"
date: 2018-01-11 11:23:40
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
---

昨天我們把一個data table的基礎功能－「**顯示資料、分頁、排序**」都大致說明了一遍，今天我們來講一些進階的data table用法，以及分頁和排序元件的補充說明；Angular Material中的分頁和排序功能都很強，而且也不會和`<mat-table>`綁死，在任何地方可以應用。

就讓我們繼續往下看吧！

<!-- more -->

## 開始使用Angular Material的Data Table(進階篇)

### 篩選data table資料－filter

要篩選data table的資料，在前後端都不算困難，我們來看看該如何實作。

#### 直接篩選前端資料

要篩選前端已經撈出來的資料並不困難，只需要為提供的data source設定`filter`屬性即可。

我們先在畫面上加入一個輸入框：

```Html
<mat-form-field>
  <input matInput #filter placeholder="搜尋">
</mat-form-field>
```

之後在程式中針對input變化時設定data source的filter：

```typescript
export class EmailListComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  
  ngOnInit() {
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.emailsDataSource.filter = (this.filter.nativeElement as HTMLInputElement).value;
      });
  }
}
```

成果如下：

{% asset_img 01-filter-basic.gif %}

#### 自訂篩選前端資料的邏輯

剛才我們使用`filter`讓data source自己來過濾資料，不過這樣會有點問題，最主要是filter會篩選所有的欄位，只要有某個欄位包含`filter`內容，就會取出結果，但這未必是我們要的，以上面的例子來說，只看得到標題，卻過濾出一些標題不包含`filter`的資訊，依情境而定有可能會造成誤解。

Angular Material的`MatTableDataSource`中有一個`filterPredicate`方法，是用來對`filter`篩選資料用的，我們可以複寫這個方法，來針對需要的欄位篩選就好：

```typescript
this.emailsDataSource.filterPredicate = (data: any, filter: string): boolean => {
  return data.title.indexOf(filter) !== -1;
};
```

這個方法有兩個傳入參數，分別是每列的資料物件(`data`)，以及要篩選的內容(`filter`)，我們可以回傳true代表這筆資料要顯示，反之則不顯示。

再來看看結果：

{% asset_img 02-filter-with-filterPredicate.gif %}

這時候就能夠只針對標題的欄位篩選囉。

#### 篩選後端資料

關於後端篩選，就更加簡單了，不需要再使用data source的`filter`，只需要把篩選資料送給API就好：

```typescript
@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent implements OnInit {
  ...
  @ViewChild('filter') filter: ElementRef;
  currentFilterData: string;

  ngOnInit() {
    ...

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((filterData: string) => {
        // 準備要提供給API的filter資料
        this.currentFilterData = filterData;
        this.getIssuees();
        // 後端篩選就不需要指定filter了
        // this.emailsDataSource.filter = (this.filter.nativeElement as HTMLInputElement).value;
      });

    // 後端篩選就用不到filterPredicate了
    // this.emailsDataSource.filterPredicate = (data: any, filter: string): boolean => {
    //   return data.title.indexOf(filter) !== -1;
    // };
  }

  getIssuees() {
    const baseUrl = 'https://api.github.com/search/issues?q=repo:angular/material2';
    let targetUrl = `${baseUrl}&page=${this.currentPage.pageIndex + 1}&per_page=${this.currentPage.pageSize}`;
    if (this.currentSort.direction) {
      targetUrl = `${targetUrl}&sort=${this.currentSort.active}&order=${this.currentSort.direction}`;
    }
    this.httpClient.get<any>(targetUrl).subscribe(data => {
      this.totalCount = data.total_count;
      this.emailsDataSource.data = data.items;
    });
  }
}
```

成果如下：

{% asset_img 03-filter-from-backend.gif %}

從**篩選、分頁到排序**，3個願望通通都滿足啦！

## 關於matSort和mat-sort-header的補充

### 在任何地方使用matSort和mat-sort-header

在之前的範例中，我們都是針對`<mat-table>`來進行排序，但其實`matSort`和`mat-sort-header`在任何地方都使用，只要在外層元素加上`matSort`，當內部的`mat-sort-header`點擊時，就會發生`matSortChange`事件。因此以下程式是完全可以正常運作的！

以下我們使用`mat-sort-header="xxxx"`，代表排序時的欄位名稱是`title`：

```html
<table matSort (matSortChange)="sort($event)">
  <thead>
    <tr>
      <th mat-sort-header="title">標題</th>
    </tr>
  </thead>
</table>
```

只要任何地方有排序的需求，不管是不是`<mat-table>`只要加上`matSort`和`mat-sort-header`就搞定啦！

### mat-sort-header的參數補充 

使用`mat-sort-header`會在內容旁邊加上一個箭頭符號，方便我們判別目前的排序狀態，這個符號也是可以調整的，有以下幾個屬性可以設定：

-   `arrowPosition`：箭頭符號要放在文字的**前面**(`before`)還是**後面**(`after`)
-   `disableClear`：是否允許取消排序，預設為`false`，會以`asc` -> `desc` -> `無`輪流切換；若設成`true`則只會在`asc`和`desc`之間切換。
-   `start`：當按下排序時預設先顯示的排序狀態，預設為`asc`，可以選擇`asc`或`desc`。

以下程式會將欄位的排序規則改為，(1)把箭頭放在前面、(2)無法取消排序和(3)預設先以`desc`排序：

```html
<mat-header-cell *matHeaderCellDef 
                 mat-sort-header 
                 arrowPosition="before" 
                 disableClear="true" 
                 start="desc">
  日期
</mat-header-cell>
```

結果如下：

{% asset_img 04-mat-sort-header-properties.gif %}

可以看到大致上都如我們預期的顯示，唯一的問題是`arrowPosition="before"`後，整個內容被推到右邊了，這是因為flex設定的關係，從開發人員工具可以看到header cell的加上了一個`mat-sort-header-position-before`樣式如下：

{% asset_img 05-mat-sort-header-position-before.png %}

不過這不是大問題，自行CSS調整一下即可：

```css
.mat-sort-header-position-before {
  justify-content: flex-end;
}
```

成果如下：

{% asset_img 06-after-custom-css-for-header-cell.png %}

看起來就正常多啦！

## 關於mat-paginator的補充

### 單獨使用mat-paginator

`<mat-paginator>`一樣不需要跟`<mat-table>`綁死，我們可以在任何需要呈現多筆資料的地方使用`<mat-paginator>`，只要設定好至確的參數及可正常顯示，並且得知分頁切換時的事件。

```html
<mat-paginator #paginator 
               [length]="totalCount" 
               [pageIndex]="0" 
               [pageSize]="10"
               [pageSizeOptions]="[5, 10, 15]"
               (page)="pageChange($event)">
</mat-paginator>
```

相關的內容在上一篇文章都已經有詳細的說明了，在這邊就不多做說明囉。

### 設定mat-paginator的提示文字

在`<mat-paginator>`中的文字內容都是英文的，包含上一頁及下一頁按鈕，當滑鼠移過去時會呈現一個tooltip，如下：

{% asset_img 07-default-paginator-intl.png %}

當然這個文字我們也可以進行調整，只要在`MatPaginatorIntl`這個service裡面設定即可：

```typescript
@Component({ })
export class EmailListComponent implements OnInit {

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit() {
    // 設定顯示筆數資訊文字
    this.matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0 || pageSize === 0) {
        return `第 0 筆、共 ${length} 筆`;
      }

      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `第 ${startIndex + 1} - ${endIndex} 筆、共 ${length} 筆`;
    };

    // 設定其他顯示資訊文字
    this.matPaginatorIntl.itemsPerPageLabel = '每頁筆數：';
    this.matPaginatorIntl.nextPageLabel = '下一頁';
    this.matPaginatorIntl.previousPageLabel = '上一頁';
  }
}
```

成果如下：

{% asset_img 08-custom-paginator-intl.png %}

所有的文字都變成中文呈現啦！

## 本日小結

今天我們介紹了另一個常在data table中常出現的功能，篩選資料(filter)，一樣的，不管是直接處理前端的資料還是後端，都不會造成問題；在前端篩選時我們甚至幾乎不用寫什麼程式即可完成篩選，當然我們也能透過自訂`filterPredicate`來決定篩選邏輯；在後端資料篩選時則沒有什麼特別，就是傳遞資料給API而已。

另外我們也補充了一些關於分頁及排序元件的使用方法，這些方法都是筆者個人認為比較重要的部分，但實際上則有更多可以調整的部分；例如排序功能其實也有一個`MatSortHeaderIntl`可以設定文字，但主要是在螢幕閱讀器的部分使用，比較難用畫面呈現，因此也就沒有特別介紹了。

關於排序、分頁還有許多可以設定的屬性、API等等，可以直接到官方的文件上去看，也有詳細的說明。

本日的程式碼GitHub：

分支：day-24-table-advanced

我們終於把所有Angular Material目前版本(5.0.0)所有的30個主要功能和常見的使用情境都介紹過啦！有沒有覺得非常充實，也對於Angular Material的設計和互動感及考量的全面性感覺到非常佩服啊！？如果有任何問題不明白，或是覺得需要補充的內容，都歡迎你直接在下方留言喔！

明天開始我們要邁入從Angular Material衍伸出來的另一大主題－**Angular CDK**，讓你不必非得要綁死Angular Material，也能打造出具有**互動感**的元件，準備好迎接新的挑戰吧！！

## 相關資源

-   [Angular Material - Sort header](https://material.angular.io/components/sort/overview)
-   [Angular Material - Paginator](https://material.angular.io/components/sort/overview)

