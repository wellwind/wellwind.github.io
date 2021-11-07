---
title: "[Angular Material 完全攻略]Angular CDK(6) - Overlay"
date: 2018-01-17 18:30:35
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

今天我們要來介紹Angular CDK中的Overlay！Overlay在Angular Material中可以說是隨處可見，只要是任何會從螢幕上**彈出**資訊的功能，如Select、Dialog等等都免不了要使用Overlay；因此也能說Overlay是Angular Material中讓畫面**更具有立體感**的大功臣，到底這個功能能幫助我們達到多少目標呢？就讓我們繼續看下去吧！

<!-- more -->

首先當然不能忘記，要加入`OverlayModule`：

```typescript
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  exports: [
    OverlayModule
  ]
})
export class SharedMaterialModule {}
```

## 一切的關鍵－Overlay service

Overlay裡面有許多不同大大小小的classes，其中主宰一切的關鍵，來自於一個service－Overlay，透過這個service，我們可以用來決定一個component或template動態的產生，以及要產生在什麼位置，甚至可以"黏在"另外一個元件的旁邊！

### 使用Overlay讓物件與物件連結

我們先來小試身手一下，做一個經典的功能，再畫面右下角加入一個floating action button，並在點選後呈現另一個選單！

畫面設計如下：

```html
<button mat-fab color="accent" class="float-menu" (click)="displayMenu()" #originFab>
  <mat-icon>add</mat-icon>
</button>

<ng-template #overlayMenuList>
  <div class="fab-menu-panel">
    <mat-nav-list>
      <a mat-list-item>新增信件</a>
      <a mat-list-item>管理聯絡人</a>
    </mat-nav-list>
  </div>
</ng-template>
```

我們在畫面上加了一個按鈕，以及一個選單的樣板，這個樣板稍後會出現在按鈕的附近，接著我們透過CSS讓按鈕固定在畫面右下方，CSS如下：

```css
.float-menu {
  position: fixed !important;
  right: 15px;
  bottom: 15px;
  z-index: 2;
}

.fab-menu-panel {
  border: 1px solid black;
  background-color: white;
}

.fab-menu-panel .mat-nav-list {
  padding-top: 0px;
}
```

最後就是程式部分啦！

```typescript
export class InboxComponent implements OnInit {
  @ViewChild('overlayMenuList') overlayMenuList: TemplateRef<any>;
  @ViewChild('originFab') originFab: MatButton;
  overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const strategy = this.overlay
      .position()
      .connectedTo(this.originFab._elementRef, { originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' });
    this.overlayRef = this.overlay.create({
      positionStrategy: strategy
    });
  }
  
  displayMenu() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else {
      this.overlayRef.attach(new TemplatePortal(this.overlayMenuList, this.viewContainerRef));
    }
  }
}
```

以上程式中的步驟大致描述如下：

1.  注入`Overlay`
2.  在`ngOninit()`中，使用`const strategy = this.overlay.position().connectedTo()`，建立一個`ConnectedPositionStrategy`，代表overlay要與某個物件連結的策略，其中的參數分別為：
    1.  要被連結的物件(也就是我們的originFab這個按鈕)要被連結的物件(也就是我們的originFab這個按鈕)
    2.  連結物件的連結點位置，以這裡的程式來說，就是右上角為連結點。
    3.  overlay連結物件時的連結點位置，以這裡的程式來說，就是右下角為連結點。
    4.  用圖解釋的話大概是這種感覺：
      {% asset_img 01-cdk-overlay-connect-explain.png %}
3.  使用`overlay.create()`建立一個新的`OverlayRef`，`create()`方法可以傳入許多設定資料，在這裡我們設定上一步驟所建立的連結策略。
4.  在`displayMenu()`方法中，檢查是否有attach東西上去，如果有，就執行`detach()`，如果沒有，就把`overlayMenuList`這個template轉成`TemplatePortal`並attach上去。

{% note info %}

對於`attach()`有感到眼熟嗎？沒錯！就是昨天介紹的Portal功能，而Overlay正是使用Portal的功能，來決定要把什麼東西放到Overlay上面！

{% endnote %}

接著我們就可以來看看結果啦！

{% asset_img 02-floating-action-menu-demo.gif %}

當我們點下固定在右下角的按鈕，就會看到一個簡單的選單自動「黏」在我們的按鈕上！很酷吧！

#### 設定withFallbackPosition

在設定完`connectedTo()`後，我們能接著設定`withFallbackPosition()`，如果`connectedTo`顯示overlay時會超過螢幕畫面，會改使用`withFallbackPosition()`的設定值，因此我們可以透過`withFallbackPosition()`來設定無法完整顯示時，重新調整連結點的Plan B、Plan C…Plan Z。

例如之前我們在介紹menu時提過，當畫面捲動時，menu會先試著 ~~搶鏡頭~~ 讓自己能被完整呈現，實作的程式碼大致看起來如下：

```typescript
this._overlay.position()
  .connectedTo(this._element, {originX, originY}, {overlayX, overlayY})
  .withFallbackPosition(
    {originX: originFallbackX, originY},
    {overlayX: overlayFallbackX, overlayY})
  .withFallbackPosition(
    {originX, originY: originFallbackY},
    {overlayX, overlayY: overlayFallbackY},
    undefined, -offsetY)
  .withFallbackPosition(
    {originX: originFallbackX, originY: originFallbackY},
    {overlayX: overlayFallbackX, overlayY: overlayFallbackY},
    undefined, -offsetY);
```

參考：https://github.com/angular/material2/blob/5.0.x/src/lib/menu/menu-trigger.ts

### 使用Overlay讓物件顯示在畫面上，不連結任何物件

剛剛我們已經成功讓選單物件連結到按鈕物件上了，接下來我們要試試看讓選單不要連結到任何畫面上，只需要把原來的strategy修改一下：

```typescript
const strategy = this.overlay
  .position()
  .global()
  .width('500px')
  .height('100px')
  .centerHorizontally()
  .centerVertically();
```

在這裡我們改用`overlay.position().global()`來產生一個`GlobalPositionStrategy`，代表部連結任何物件，是**全域的顯示策略**。接著用`width()`和`height()`給予基本的尺寸，再加上`centerHorizontally()`和`centerVertically()`來調整放到畫面的正中間，成果如下：

{% asset_img 03-global-menu.gif %}

一個顯示在畫面正中央的選單就出現啦！

如果不希望顯示在正中間，也可以使用`top()`、`bottom()`、`left()`、`right()`來設定overlay顯示的座標。

接下來我們來看看在`overlay.create()`時，可以使用哪些參數，讓顯示更加靈活！

### 設定OverlayConfig

看過上面兩種Overlay顯示方式後，我們再來看看使用`overlay.create()`時，可以加入哪些參數，這些參數的型別為`OverlayConfig`，以下簡單說明：

-   `hasBackdrop`：是否要顯示一個預設灰底的backdrop。
-   `backdropClass`：讓我們能自訂backdrop的樣式。
-   `direction`：LTR or RTL。
-   `height`、`minHeight`和`maxHeight`：設定高度相關資訊。
-   `width`、`minWidth`和`maxWidth`：設定寬度相關資訊。
-   `panelClass`：給予顯示的Overlay(也就是panel)一個基本的樣式，需要特別注意這個屬性，在`ConnectedPositionStrategy`上面時`overlayRef.deatch()`會正常把`panelClass`拿掉；但`GlobalPositionStrategy`時，使用`overlayRef.deatch()`時會無法拿掉這個樣式，需要改用`overlayRef.dispose()`，而`dispose()`的話，下次還需要使用`overlay.create()`重新建立。
-   `positionStrategy`：顯示位置的策略，文章前半段提到的就是在切換這個策略。
-   `scrollStrategy`：當畫面捲動時，該如何處置Overlay的策略，稍後會詳細說明。

接著我們來看看特定幾個屬性的設定。

#### 設定hasBackdrop

設定這個屬性為true後，會顯示一個基本的灰底backdrop。

```typescript
const config = new OverlayConfig({
  hasBackdrop: true,
  positionStrategy: strategy
});
this.overlayRef = this.overlay.create(config);
```

我們也可以設定當backdrop被點擊後，就自動關閉目前的overlay：

```typescript
this.overlayRef.backdropClick().subscribe(() => {
  this.overlayRef.detach();
});
```

成果如下：

{% asset_img 04-backdrop.gif %}

### 設定backdropClass

預設Angular CDK的Overlay會幫我們加上一個`cdk-overlay-dark-backdrop`的css class，我們可以透過`backdropClass`更換它，例如Angular CDK內建了一個`cdk-overlay-transparent-backdrop`可以幫我們移除掉灰色的背景，但依然有一個透明的backdop在中間，讓我們不能直接跟底層的元件互動：

```typescript
const config = new OverlayConfig({
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-transparent-backdrop',
  positionStrategy: strategy
});
this.overlayRef = this.overlay.create(config);
```

成果如下：

{% asset_img 05-backdrop-class-transparent.gif %}

有了`cdk-overlay-transparent-backdrop`，滑鼠移到按鈕上時，就沒有hover的效果，直到按下去關掉overlay時，才一切又正常了。

### 設定scrollStrategy

最後我們來聊一下`scrollStrategy`，在`ConnectedPositionStrategy`模式下，我們能透過設定`scrollStrategy`來決定當滑鼠滾輪捲動時，overlay該如何處置，例如預設如下：

```typescript
const config = new OverlayConfig({
  scrollStrategy: this.overlay.scrollStrategies.noop()
});
```

此時滑鼠捲動不會影響overlay，overlay的位置依然呈現在原來的位置。

如果希望跟著連結的元件一起移動，可以設定為`reposition()`

```typescript
const config = new OverlayConfig({
  scrollStrategy: this.overlay.scrollStrategies.reposition()
});
```

成果如下：

{% asset_img 07-reposition-scroll.gif %}

{% note info %}

這裡可以看到選單會蓋過上面的toolbar，這是因為overlay預設的`z-index`為1000，所以我們只需要把toolbar的`z-index`設定為超過1000，就可以解決這個問題囉。

{% endnote %}

例外還有兩個可以設定的策略：

-   `close()`：捲動時自動關閉overlay。
-   `block()`：不允許捲動。

應該不難想像結果，就不多寫程式拖時間囉，有興趣的讀者可以自己修改看看。

{% note info %}

當然，設定hasBackdrop後，因為連scroll bar都被backdrop蓋掉無法互動，所以這些捲動就會自動失效，變成類似`block()`的狀態了。

{% endnote %}

## 本日小結

今天我們把Angular CDK目前(5.0.0)主功能分類的最後一塊拼圖－Overlay給介紹完了。這個功能可以讓我們的操作介面更具立體感，應用層面也非常廣，非常多的Angular Material元件都依賴著Overlay功能，因此要寫的程式也不少，不過相信大致操作過一遍後，就能發現這個功能的強大及易用！而且**光是想像自己要達到這些功能需要寫多少程式碼，考量到多少狀態，就覺得Angular CDK實在是太貼心啦**！！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-30-cdk-overlay

分支：day-30-cdk-overlay

## 相關資源

-   [Angular Material - CDK - Overlay](https://material.angular.io/cdk/overlay/overview)
