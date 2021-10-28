---
title: "[Angular 大師之路] 效能調校之認識 ChangeDetectorRef"
date: 2018-11-09 21:13:19
category: "Angular 大師之路"
tags:
  - Angular
  - ChangeDetectorRef
---

昨天我們講到了 Angular 使用 NgZone 來決定變更偵測的時機，今天我們來認識一下 Angular 提供的另外一個比較常用來決定變更偵測時機的工具 - `ChangeDetectorRef`

<!-- more -->

**類型**：觀念

**難度**：3 顆星

**實用度**：4 顆星

# 關於 ChangeDetectorRef

`NgZone` 是用來確認何時要進行變更偵測的工具，是作用在整個 Angular 範圍的；而 `ChangeDetectorRef` 則是每個元件獨立用來控制變更偵測時機的工具，在一個元件中注入 `ChangeDetectorRef` 時，得到的實體裡面有很多方法可以用來決定是否要進行變更偵測，但範圍都僅限於目前所在的元件中。

Angular 在決定要進行變更偵測時，會走訪所有畫面上使用的元件，並去搜集這些元件是否要進行變更偵測，而透過變 `ChangeDetectorRef` 可以用來決定要從「待變更偵測元件清單」中加入或移除！

# detach 與 reattach

`detach` 與 `reattach` 是 `ChangeDetectorRef` 最基本的兩種用法，透過 `detach` 可以將目前元件從需要變更偵測的清單中移除，也就是當有需要變更偵測的情況發生時，目前所在的元件將不再觸發變更，當元件可能會有較大量運算且會異動的資料與畫面無關時，可以使用 `detach` ，避免元件頻繁更新造成的效能耗損。

而當元件需要被納入變更偵測清單時，則可以使用 `reattach`，重新將元件納入變更偵測清單中！

# detectChanges

另外一種應用情境是，為了效能著想，我們可能會在元件一開始就使用 `detach()` 將目前元件的變更偵測關掉，在真正需要變更偵測時，呼叫一次 `detectChanges()` 來觸發變更偵測，這時候變更偵測就只會被觸發一次，而不是重新打開變更偵測，因此實際上變更偵測還是被關閉的，只要在需要時**主動提出**。



```typescript
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <button (click)="detach()">Detach</button>
    <button (click)="trigger()">Trigger Change Detection</button>
    <button (click)="attach()">Attach</button>
    <button (click)="add()">Add</button>

    {{ i }}`
})

export class AppComponent {
  i = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  detach() {
    this.changeDetectorRef.detach();
  }

  attach() {
    this.changeDetectorRef.reattach();
  }
    
  trigger() {
    this.changeDetectorRef.detectChanges();
  }

  add() {
    this.i++;
  }
}
```

如上程式，當 `this.changeDetectorRef.detach()` 呼叫時，不管 `add()` 觸發幾次，樣板上綁定的變數 `i` 將不會被變更，直到 `this.changeDetectorRef.reattach()` 呼叫時，才會重新觸發變更偵測。

另外，當 `detach` 狀態時，我們可以主動呼叫 `this.changeDetectorRef.detectChanges()`，來觸發畫面資料變更，而這之後再呼叫 `add()` 畫面也不會有所變更，因為我們實際上還是在 `detach` 狀態！

程式碼參考：

https://stackblitz.com/edit/ironman2019-change-detector-ref?file=src/app/app.component.ts

關於 `ChangeDetectorRef` 還有一個 `markForCheck` 方法，我們留到明天講 `OnPush` 策略時，再來聊聊。

# 相關資源

- [ChangeDetectorRef](https://angular.io/api/core/ChangeDetectorRef)
