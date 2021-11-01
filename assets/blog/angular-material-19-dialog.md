---
title: "[Angular Material完全攻略]設計一個部落格(4) - Dialog"
date: 2018-01-06 17:38:25
category: "Angular Material完全攻略"
tags:
    - Angular Material
    - Material Design
---

昨天我們輕鬆地介紹兩個與進度有關的元件，今天讓我們稍微精實一點，來介紹一下寫程式多於寫HTML的Dialog，不管在不在SPA架構，Dialog都是經典且極為重要的元件，也因此我們會比較多的時間來介紹，好讓讀著們能完全的掌控Angular Material中的Dialog使用方式！

<!-- more -->

## 關於Material Design中的Dialog

在[Material Design的Dialogs設計指南](https://material.io/guidelines/components/dialogs.html)中，Dialog的作用是用來提醒使用者需要進行的一些特定工作，同時可能包含了重要的提示訊息，或是需要做一些決定等等。因此我們會有非常多機會在裡面放是表單元件，或是特性訊息等等。

Dialog的主要幾個常見用途如下：

-   **產生提示**：用來立即的中斷使用者目前的行為，並告知使用者目前的狀況或所需要知道的資訊等等。
-   **簡易的選單**：提供一些基本選項讓使用者選取。
-   **確認用**：需要使用者明確的進行一個確認性的選擇。

Dialog可以說是很基礎的元件，也可以說是讓畫面呈現變得更加有立體感的關鍵，例如我們過去介紹的Datepicker、Select、Menu等等，都可以說是Dialog的一種應用結果。

## 開始使用Angular Material的Dialog

要使用Dialog，當然我們必須加入`MatDialogModule`，接著我們就可以來設計一個簡單的Dialog元件。

### 先讓一個Dialog可以顯示吧！

Dialog不像是其他Angular Material元件，只要單純的使用即可，需要一些比較複雜的動作，但其實也不是說多困難，讓我們一步一步來說明：

1.  我們先單純建立一個元件`AddPostDialogComponent`元件，不改變任何內容

    `ng g c dashboard/blog/add-post-dialog`

2.  接著用一個按鈕，希望這個按鈕按下後可以顯示Dialog

    `<button mat-raised-button color="primary" (click)="showAddPostDialog()">新增文章</button>`

3.  在對應的component.ts中，注入`MatDialog`這個Service

    ```typescript
    import { MatDialog } from '@angular/material';
    export class BlogComponent {
      constructor(public dialog: MatDialog) {}
    }
    ```

4.  使用這個`MatDialog`的實體，打開Dialog

    ```typescript
    showAddPostDialog() {
      this.dialog.open(AddPostDialogComponent);
    }
    ```

5.  由於這種方式是動態產生元件的，因此我們需要在所屬Module中的`entryComponents`中加入要產生的component

    ```typescript
    @NgModule({
      ...
      entryComponents: [AddPostDialogComponent]
    })
    export class DashboardModule {}
    ```

雖然看起來步驟比較多，但其實只有兩個重點：

1.  建立要當作Dialog的component
2.  使用注入的`MatDialog`實體把它打開

這種步驟理解並習慣了就很快囉。接著就讓我們直接來看看結果吧！

{% asset_img 01-dialog-basic.gif %}

有沒有很感動啊！一個基本的Dialog就浮現在我們面前啦！我們這時候可以透過點擊灰底(backdrop)的部分來關閉dialog。

{% note info %}

在dialog中這個灰底的部分稱為`backdrop`，我找不到比較好的翻譯，因此之後依舊會直接使用backdrop來稱呼它。

{% endnote %}

### 使用mat-dialog-xxx豐富Dialog內容

在`MatDialogModule`中，定義了幾個重要的directives，這些directives可以幫助我們豐富dialog裡面的內容，同時還能夠減少一些不必要的程式碼，讓我們簡單來介紹一下：

#### mat-dialog-title

代表的是一個dialog的標題部分，儘管因為dialog的內容高度太長而造成捲動，依然會固定在整個dialog的最上方。

#### mat-dialog-content

代表一個dialog的內文部分，當內容長度超過dialog可以容納的高度時，就會變成可以捲動的模式。

#### mat-dialog-actions

用來放置行動按鈕的區塊，呈現位置剛好與`mat-dialog-title`相反，會固定在畫面的最下方，我們會在這裡放置一些如**確認**、**取消**的按鈕。

#### mat-dialog-close

只允許在button上使用的directive，這個directive會使得button變成一個可以關閉目前dialog的按鈕。

#### 實際使用看看

接下來就讓我們把一個簡單的新增文章頁面加入，並透過剛剛介紹的directives讓整個dialog更加完整吧！

```html
<h2 mat-dialog-title>
  新增部落格文章
</h2>

<mat-dialog-content class="post-form">
  <mat-form-field>
    <input matInput placeholder="標題" />
  </mat-form-field>
  <mat-form-field>
    <textarea matInput placeholder="文章內容" rows="3"></textarea>
  </mat-form-field>
  <p>條款01</p>
  <p>條款02</p>
  ...
</mat-dialog-content>

<mat-dialog-actions>
  <button mat-button color="primary">發表</button>
  <button mat-button mat-dialog-close color="warn">取消</button>
</mat-dialog-actions>
```

再來看看結果：

{% asset_img 02-dialog-contents.gif %}

一個標準的dialog就誕生啦！除了依照title、content和actions切割空間之外，按下取消的按鈕就能夠關閉dialog，另外當高度超過可以自動延展的範圍(Angular Material中的dialog設定為`65vh`)時，就會變成可以捲動的狀態。

讀者有興趣可以實際試玩看看這個dialog的效果，可以看到以下幾個亮點：

1.  dialog顯示時，預設會**focus到第一個表單控制項**。
2.  當使用`tab / shift + tab`切換focus狀態時，**永遠不會跳出dialog的範圍，只會在dialog內移動**。
3.  **不只按下取消按鈕可以關閉dialog**，按下`ESC`鍵也可以。

以上特色我們在未來介紹Angular CDK時，都可以透過Angular CDK來幫助我們在自己設計的元件中達到一樣的功能！在這邊就先不多做說明囉。

###關於MatDialog Service 

在一開始介紹如何打開一個dialog時，我們注入了`MatDialog`這個Service，接下來我們來詳細介紹一下這個Service的屬性及方法：

#### ＭatDialog的屬性

MatDialog有3個屬性：

-   `afterAllClosed`：`Observable<void>`，會在所有畫面上的dialog都被關閉時，才會觸發的一個Observable，從這樣的說明應該可以發現：沒錯，**Dialog是可以開多個的**！只需要在任何時候使用`MatDialog.open()`方法即可
-   `afterOpen`：`Observable<MatDialogRef<any>>`，每當一個dialog開啟時，就會觸發一次，並告知目前開啟的dialog
-   `openDialogs`：`MatDialogRef<any>[]`，單純的紀錄目前所有開啟中的dialog。

簡單的範例如下：

```typescript
this.dialog.afterAllClosed.subscribe(() => {
  console.log('目前已經沒有dialog了');
});

this.dialog.afterOpen.subscribe((dialogRef: MatDialogRef<any>) => {
  console.log(`新的dialog已開啟：${dialogRef.id}`);
  console.log(`目前已開啟 ${this.dialog.openDialogs.length} 個dialog了`);
});
```

開啟多的dialog的程式就不多做說明了，只需要呼叫注入的`MatDialog`的`open()`方法，就會自然而然地開一個新的dialog。

我們直接來看看log顯示的結果：

{% asset_img 03-introduce-dialog-properties.gif %}

#### MatDialog的方法

MatDialog有3個方法，可以讓我們自由自在地控制dialog：

-   `closeAll`：顧名思義，就是關閉所有的dialog

    {% asset_img 04-close-all.gif %}

-   `getDialogById`：每個dialog都有他自己的id，當然我們也可以自行指定id，不管是用哪種方式，只要有id，我們就能在任何時候使用`getDialogById(id)`，來取得某個dialog，如果無法取得的話，會回傳`undefined`。

-   `open`：最重要的一個方法，包含2個參數

    -   `componentOrTemplateRef:ComponentType<T> | TemplateRef<T>`：必填，要顯示的dialog，我們可以傳入componet或是一個templateRef。

        ```html
        <ng-template #dialogByTemplate>
          ...
        </ng-template>
        ```

        在程式中可以直接將這個`<ng-template>`當作dialog顯示，可以減少設計太多的component，反而難以管理。

        ```typescript
        @ViewChildren('dialogByTemplate') dialogByTemplate;
        open() {
            this.dialog.open(this.dialogByTemplate);
        }
        ```

    -   `config?:MatDialogConfig<D>`：非必填，用來設定一些顯示的細節。我們稍後會直接針對這個`MatDialogConfig`型別做說明。

### 自行設定MatDialogConfig

我們可以透過`MatDialogConfig`型別設定一些dialog打開時的細節，由於屬性眾多，以下挑幾個個人覺得重要的來介紹：

#### data

**超重要**，我們不可能永遠只是單純地打開一個dialog，一定會有需要傳入一些資訊的時候，這時我們就可以使用data參數來傳入一些資訊，如下：

```typescript
doPost() {
  this.dialog.open(AddPostConfirmDialogComponent, {
    data: {
      title: this.title
    }
  });
}
```

而在dialog內，我們可以使用`@Inject(MAT_DIALOG_DATA)`來注入需要的資訊

```typescript
@Component()
export class AddPostConfirmDialogComponent implements OnInit {
  get title(){
    return this.data.title;
  }
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
      console.log(data.title);
  }
}
```

成果如下：

{% asset_img 05-inject-data.gif %}

#### autoFocus

當dialog打開時，是否要自動focus在第一個控制項

#### id

我們可以為每個dialog自定一個唯一的id

#### 高度與寬度

我們可以使用`height`、`width`、`minHeight`、`minWidth`、`maxHeight`和`maxWidth`來設定dialog的尺寸資訊，除了`height`和`width`一定要用字串表示外，其他屬性可以給予數值，當給予數值而非字串時，預設的單位為`px`。

#### hasBackdrop

是否要使用一個灰色的底來隔絕dialog與下面的畫面，也就是backdrop，如果設定為`false`則依然可以和dialog後面的元件互動。

```typescript
showAddPostDialog() {
  this.dialog.open(AddPostDialogComponent, {
    hasBackdrop: false
  });
}
```

結果如下：

{% asset_img 06-set-hasbackdrop-to-false.gif %}

#### backdropClass

可以設定backdrop的樣式，不太常使用，若對灰色底不滿意時，可以進行調整，預設樣式如下：

```css
background: rgba(0,0,0,.6);
```

#### position

可以設定`top`、`bottom`、`left`和`right`，來決定dialog顯示的位置。

#### disableClose

預設情況下我們可以使用`ESC`鍵關閉dialog，透過設定`disableClose`為`true`，可以取消這個功能，但要注意可能影響使用者的使用經驗。

### 使用MatDialogRef

所有的dialog開啟後，都會產生一個對應的`MatDialogRef<T>`，其中的`T`代表實際產生的component或templateRef，取得這個DialogRef的方式很多，主要有

1.  使用`MatDialog`的`open()`時，回傳的值，例如以下程式範例，可以透過取得開啟對應component的MatDialogRef，來處理原來元件的事件：

    ```typescript
      doPost() {
        const confirmDialogRef = this.dialog.open(AddPostConfirmDialogComponent, {
          data: {
            title: this.title
          }
        });
        // doConfirm是AddPostConfirmDialogComponent中的事件(EventEmitter)
        // 透過componentInstance取得AddPostConfirmDialogComponent產生的實體
        confirmDialogRef.componentInstance.doConfirm.subscribe(() => {
          console.log('開啟的dialog按下確認按鈕了');
        });
      }
    ```

    ​

2.  使用`MatDialog`的`getDialogById`取得

3.  在我們要當作dialog的component中，注入取得

```typescript
@Component()
export class AddPostDialogComponent {
  constructor(private dialogRef: MatDialogRef<AddPostDialogComponent>)
  
  move() {
    this.dialogRef.updatePosition({
      top: '0',
      left: '0'
    });
  }
}
```

結果如下：

{% asset_img 07-mat-dialog-ref.gif %}

ＭatDialogRef還有許多方法都跟前面介紹過的類似，就不多作介紹，有興趣的可以再去仔細看看[dialog的API內容](https://material.angular.io/components/dialog/api)。

## 本日小結

今天我們用了非常多的文字及程式碼來介紹dialog這個功能，要建立並產生一個dialog放到畫面上本身並不是一件困難的事情，但更多時候我們需要的是dialog的細節設定，這時候就必須仰賴程式碼的幫助了。

所以今天的內容會比較多偏向程式碼的方面，來說明所有相關的component、directive和service的屬性方法等等，並透過這些來調整dialog的顯示。

Dialog是前端非常經典的議題，也是SPA架構下不可或缺的一個環節，在Material Design中更是應用範圍極廣，如果能好好善用dialog，在設計互動性較高的介面時，也能夠更加靈活，讓使用者經驗大幅提高哩！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-19-dialog

分支：day-19-dialog

## 相關資源

-   [Material Design - Dialogs](https://material.io/guidelines/components/dialogs.html)
-   [Angular Material - Dialog](https://material.angular.io/components/dialog/overview#)

