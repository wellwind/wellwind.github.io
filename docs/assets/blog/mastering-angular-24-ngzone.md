---
title: "[Angular 大師之路] 效能調校之認識 NgZone"
date: 2018-11-08 21:13:19
category: "Angular 大師之路"
tags:
  - Angular
  - zone.js
  - NgZone
---

許多 Angular 開發人員對於 NgZone 這個詞應該都不太陌生，尤其是在早期 Angular 剛推出時，只要發生錯誤，就會在 F12 開發人員工具看到一堆看不太懂的錯誤，但都會看到 `zone.js` 或 `NgZone` 之類的字眼。這個 NgZone 到底是什麼呢？今天就來簡單介紹一下。

<!-- more -->

**類型**：觀念

**難度**：5 顆星

**實用度**：3 顆星

# 關於 zone.js

`zone.js` 的靈感來自於 Dart 語言，主要是用來幫助我們解決各種非同步執行遇到的問題，在 web 開發中，我們會遇到非常多非同步的動作，像是某個按鈕的事件、setTimeout 或 Http Request 等等，而 Zone 透過替標準的 Web API 補丁的方式，**攔截**每個非同步的事件，因此每當非同步事件發生時，都能透過 `zone.js` 得知！

具體的實作及用法我們就不多說了，在 Angular 裡面，我們只需要知道 `zone.js` 可以幫助我們得知所有非同步事件的發生即可！

# 關於 NgZone

在一個前端框架下，變更偵測可以說是非常重要的一個環節，實作方法非常的多，而 Angular 採取的方式則是「每當非同步事件發生完成時，進行變更偵測」，因為在一般網頁開發上，資料會變動一定是透過某個事件去觸發的，若想要在程式中主動變更，勢必是來自一個 Http Request 或是使用 setTimeout 方法來變更，而這些通通都是非同步的，所以 Angular 包裝了 `zone.js` 程式，透過 `zone.js` 來得知所有事件的發生，並觸發變更偵測，最終成為了我們所知道的 `NgZone` 這個服務。

## onUnstable 與 onStable

在 `NgZone` 實體內有許多方法可以幫助我們得知事件的發生，例如有一個 `onUnstable` 和 `onStable`，都是 `EventEmitter<any>` 型別，透過訂閱這兩個事件，我們就可以得知有非同步行為要進行變更偵測了，同時也能夠知道所有事件跑完後趨於穩定的時機：

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.zone.onUnstable.subscribe(() => { console.log('有事件發生了') });
    this.zone.onStable.subscribe(() => { console.log('事件結束了') });
  }
}
```

在上面程式中我們注入了 `NgZone` 服務，並訂閱 `onUnstable` 和 `onStable` 兩個事件，這時候想辦法按個按鈕之類的，就會看到紀錄啦！

## runOutsideAngular

另外一個常用的是 `runOutsideAngular()` 方法，當我們在會觸發變更偵測的狀態下想要執行一些跟畫面無關的程式時(例如某個數字加一、複雜的運算、或是呼叫一個 API 等等，但不會影響畫面)，可以把程式放在 `runOutsideAngular()`，來避免發生變更偵測造成的效能耗損：

```typescript
this.zone.runOutsideAngular(() => {
  // 進行跟 UI 無關的複雜運算
});
```

## run

跟 `runOutsideAngular` 相反，如果在程式中「不小心」脫離了 Angular 變更偵測的範圍，像是使用 jQuery 或其他第三方與 DOM 操作有關的套件時，很容易不小心就脫離變更偵測了，這時候可以用 `run()` 方法來讓程式回到 Angular 變更偵測內。

```typescript
this.zone.run(() => {
  this.i++;
})
```

這個方法在整合一些現成前端套件的時候特別好用！

# 相關資源

- [zone.js](https://github.com/angular/zone.js/)
- [NgZone](https://angular.io/api/core/NgZone)
