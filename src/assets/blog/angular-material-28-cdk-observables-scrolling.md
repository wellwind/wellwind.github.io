---
title: "[Angular Material 完全攻略]Angular CDK(4) - Observables、Scrolling"
date: 2018-01-15 20:10:10
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

今天我們要介紹兩個比較簡單的Angular CDK功能分類，分別是Observables和Scroll。這兩個功能使用上非常簡單，但乍看之下使用的機會不高，因此我們也會來稍微偷看一下Angular Material的原始碼，看看有什麼樣讓人意想不到的使用情境！

<!-- more -->

## 開始使用Angualr CDK的Observables

Angular CDK的Observables分類中，目前只有一個`cdkObserveContent`，在加入`ObserversModule`後就可以直接用啦

```typescript
import { ObserversModule } from '@angular/cdk/observers';

@NgModule({
  exports: [
    ObserversModule
  ]
})
export class SharedMaterialModule {}
```

### 使用cdkObserveContent

在自己設計元件時，為了方便客製化，我們常常會元件的內容交給使用元件的人去決定，而元件設計上則使用`<ng-content>`把外面的內容放到裡面的某個位置上，這時候我們可以使用`cdkObserveContent`這個directive來得知`<ng-content>`內容的變化，而這個`cdkObserveContent`本身也是一個`＠Output`事件，簽章如下：

```typescript
@Directive({
  selector: '[cdkObserveContent]',
  exportAs: 'cdkObserveContent',
})
export class CdkObserveContent implements AfterContentInit, OnDestroy {
  @Output('cdkObserveContent') event = new EventEmitter<MutationRecord[]>();
}
```

參考：https://github.com/angular/material2/blob/5.0.x/src/cdk/observers/observe-content.ts

我們簡單的來設計一個元件，並使用看看，就知道變化了！

1.  先建立一個`CdkObserveContentDemoComponent`並在畫面上加上`cdkObserveContent`

    ```html
    <div class="content-wrapper" (cdkObserveContent)="projectContentChanged($event)">
      <ng-content></ng-content>
    </div>
    ```

2.  `CdkObserveContentDemoComponent`對應的程式內容如下：

    ```typescript
    @Component({ ... })
    export class CdkObserveContentDemoComponent {
      count = 0;
      projectContentChanged($event: MutationRecord[]) {
        ++this.count;
        console.log(`資料變更，第${this.count}次`);
        console.log($event, this.count);
      }
    }
    ```

    {% note info %}

    `MutationRecord`是dom的原生物件，可以參考[MDN](https://developer.mozilla.org/zh-TW/docs/Web/API/MutationRecord)

    {% endnote %}

來看看結果吧：

{% asset_img 01-cdk-observe-content-basic.gif %}

可以看到每次`<ng-content>`內的資料變更時，我們也能立刻得知變化了！

#### 使用debounce避免大量的變更

`cdkObserveContent`另外提供了一個`debounce`參數，方便我們在大量變化時減少程式碼執行的浪費，只有在變化發生後持續`debounce`設定的時間內沒有再次發生，才會觸發`cdkObserveContent`事件：

```html
<div class="content-wrapper" (cdkObserveContent)="projectContentChanged($event)" debounce="1000">
  <ng-content></ng-content>
</div>
```

成果如下：

{% asset_img 02-cdk-observablecontent-debounce.gif %}

剛按下去變更資料時，事件不會立刻觸發，而是1秒內沒有再次變更時，才會觸發。

#### 使用情境

在Angular Material中，使用的情境目前有3個：Tab、Checkbox和SlideToggle。

應用上來說，大致上都相同，主要都是內容變更時，重新進行資料的調整，或是要求進行變更偵測等行為。

例如`<mat-tab-nav>`的部分原始碼內容：

```html
<div class="mat-tab-links" (cdkObserveContent)="_alignInkBar()">
  <ng-content></ng-content>
  <mat-ink-bar></mat-ink-bar>
</div>
```

參考：https://github.com/angular/material2/blob/5.0.x/src/lib/tabs/tab-nav-bar/tab-nav-bar.html

一看就知道是內容異動時，要求把tab頁籤下針對active狀態重新調整(ink bar)

或是以`<mat-checkbox>`來說，可以看到以下的部分原始碼內容：

```html
<span class="mat-checkbox-label" #checkboxLabel (cdkObserveContent)="_onLabelTextChange()">
```

參考：https://github.com/angular/material2/blob/5.0.x/src/lib/checkbox/checkbox.html

而在程式中`_onLabelTextChange()`做了什麼呢？

```typescript
  /** Method being called whenever the label text changes. */
  _onLabelTextChange() {
    // This method is getting called whenever the label of the checkbox changes.
    // Since the checkbox uses the OnPush strategy we need to notify it about the change
    // that has been recognized by the cdkObserveContent directive.
    this._changeDetectorRef.markForCheck();
  }
```

參考：https://github.com/angular/material2/blob/5.0.x/src/lib/checkbox/checkbox.ts

簡單的說就是因為效能關係，變更偵測的策略為`OnPush`，所以在內容變更時，主動通知變更啦！

可以看到在打造**高效能**元件時，`cdkObserveContent`也是很好的小幫手哩！！

## 開始使用Angualr CDK的Scrolling

在Angular CDK的Scrolling裡面，只有一個`cdkScrollable` directive和`ScrollDispatcher` service，主要都是用來得知scroll是何時發生的，我們需要加入`ScrollDispatchModule`：

```typescript
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

@NgModule({
  exports: [
    ScrollDispatchModule
  ]
})
export class SharedMaterialModule {}
```

### 使用cdkScrollable和ScrollDispatcher

`cdkScrollable`這個directive在單獨使用時，不會有任何感覺，它不會對附加上的元件產生任何變化，也沒有任何的`@Input()`或`@Output`；雖然它能得知元件的scroll狀態變更，但無法透過`#someTemplate="cdkScrollable"`之類的方式管理，而實際上他做的事情很簡單，只有兩個：

1.  監聽scroll狀態
2.  把自己註冊給`ScrollDispatcher`

#### 使用scrolled()

當我們需要知道某個元件的scroll狀態時，必須在元件上加入`cdkScrollable`，之後再注入`ScrollDispatcher`來管理，例如：

```html
<mat-sidenav-content cdkScrollable>
  ...
</mat-sidenav-content>
```

之後在程式碼中加入ScrollDispatcher使用：

```typescript
@Component({ ... })
export class DashboardComponent implements OnInit {
  constructor(private scrollDispatcher: ScrollDispatcher) {}
           
  ngOnInit() { 
    this.scrollDispatcher.scrolled().subscribe((scrollable: CdkScrollable) => {
      console.log('發生scroll了，來源為：');
      console.log(scrollable.getElementRef().nativeElement);
    });
  }
}
```

結果如下：

{% asset_img 03-scroll-dispatcher-basic.gif %}

當畫面捲動時，就會自動得到一個訊息，並且得知是誰發生的啦！

`ScrollDispatcher`的`scrolled()`內也能加入一個`auditTimeInMs`參數，代表的是停止捲動後多久，才觸發事件，例如：

```typescript
this.scrollDispatcher.scrolled(1000).subscribe((scrollable: CdkScrollable) => {
  console.log('發生scroll了，來源為：');
  console.log(scrollable.getElementRef().nativeElement);
});
```

結果：

{% asset_img 04-scroll-dispatcher-with-time.gif %}

#### 使用ancestorScrolled()

除了元件本身的scroll狀態之外，我們也能得知某個目標**有加入cdkScrollable的祖先scroll狀態**，也就是以某個元件往祖先找，當祖先有`cdkScrollable`且產生scroll時，就會發生事件，例如我們直接在某個元件中不加入`cdkScrollable`，但在程式中直接使用`ScrollDispatcher`的`ancestorScrolled()`來得知外部有`cdkScrollable`元件的狀態：

```typescript
@Component({ })
export class SomeChildComponent implements OnInit {
  constructor(private scrollDispatcher: ScrollDispatcher, private elementRef: ElementRef) {}

  ngOnInit() {
    this.scrollDispatcher.ancestorScrolled(this.elementRef, 1000).subscribe((scrollable: CdkScrollable) => {
      console.log('祖先發生scroll了，來源為：');
      console.log(scrollable.getElementRef());
    });
  }
}
```

我們把目前元件的`ElementRef`丟給`ancestorScrolled()`，當祖先元件包含`cdkScrollable`且發生scroll時，我也能夠及時收到通知啦！

{% asset_img 05-scroll-dispatcher-ancestor-scrolled.gif %}

#### 使用getAncestorScrollContainers()

如果一定需要等到scroll發生時，才知道有什麼祖先 ~~顯靈~~ 發生scroll，那未免也太沒效率了，因此我們也能使用`getAncestorScrollContainers()`取得包含`cdkScrollable`的祖先。如下：

```typescript
console.log(this.scrollDispatcher.getAncestorScrollContainers(this.elementRef));
```

這樣操作上就能夠更加主動靈活囉！

#### 使用情境

在Angular Material中，目前使用Scrolling的功能只有一個－Tooltip！

Tooltip在滑鼠移到目標上時才會顯示，所以當捲動事情發生時，也變相等於滑鼠移開tooltip了，那麼會發生什麼事呢？tooltip消失也是很正常的，但實際上真的是如此嗎？

{% asset_img 06-tooltip-scroll-sample.gif %}

實際上我們可以看到，當scroll發生時，tooltip竟然沒有立刻消失！而是等了一小段時間才消失，這麼一來我們就可以避免一捲動就看不到tooltip的問題，又不用擔心tooltip一直在那裡 ~~賴著不走~~ 不消失，可以說是非常貼心的小功能。

而透過偷看Angular Material的程式碼，？我們能夠在Toolip中的程式找到一小段片段如下：

```typescript
private _createOverlay(): OverlayRef {
  const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);
  strategy.withScrollableContainers(scrollableAncestors);
}
```

參考：https://github.com/angular/material2/blob/5.0.x/src/lib/tooltip/tooltip.ts

這裡用到的`OverlayRef`會在後天介紹，但我們可以看到的是，Tooltip把包含`cdkScroll`的祖先找了出來，雖然我們沒仔細去看到裡面的實作細節，但也不難猜出tooltip會偵測祖先`cdkScroll`的狀態，再來決定要不要立刻消失哩！

## 本日小結

今天我們介紹了兩個使用上不太容易有感覺的Angular CDK功能分類，分別是Observables和Scroll。這些功能都能讓我們發現一些細微的變化發生，進而做一些細部的調整。雖然看起來使用的機會不高，但在**打造高效能，注重細節的高品質元件**時，這些可都是不可或缺的功能啊！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-28-cdk-observables-scrolling

分支：day-28-cdk-observables-scrolling

## 相關資源

-   [Angular Material - CDK - Observables](https://material.angular.io/cdk/observers/overview)
-   [Angular Material - CDK - Scrolling](https://material.angular.io/cdk/scrolling/overview)
