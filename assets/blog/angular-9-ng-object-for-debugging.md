---
title: "[Angular 大師之路] 使用 ng 物件幫助我們快速除錯"
date: 2020-02-07 21:07:15
category: "Angular 大師之路"
tags:
  - Angular
  - Angular 9
---

Angular 9 在今天 (2020/02/07) 正式推出了！在這個版本最重要的是加入了 Ivy，讓我們開發出更快、更輕巧的應用程式，同時也從 Ivy 延伸了許多有趣的新功能，不過在一般開發時其實習慣幾乎不會有太大的改變。不過有個功能，很有可能會改變未來開發的除錯和手動測試使用習慣，就是增強了 `ng` 物件！

<!-- more -->

# 更好除錯的 ng 物件

在這次 Angular 9 之後，預設會開啟 Ivy 模式，編譯速度更快、產出檔案更小，同時在**開發模式**時，也加強了原來就存在 window 中的 `ng` 物件，加了數個 API，這些 API 可以幫助我們快速的得知元件內的狀態，並且與其互動，更加及時得到結果，也更容易發現錯誤的位置！！

## 過去的除錯方式

在 Angular 9 之前，開發模式要除錯大致上只有兩種方式：

1. 產生 *.map 檔，並在開發人員模式 (F12) 下插入中斷點來觀看。(當然 Visual Studio Code 也支援相關工具)
2. console.log 到處插入

使用 `console.log` 的缺點很明顯，就是事後清理麻煩；而使用插入中斷點的方式當然是中規中矩，但除非真的需要釐清整個程式的運作過程，否則插入中斷點這種方式還是略嫌麻煩的。

{% asset_img 01.jpg %}

## 使用 ng 物件即時取得相關元件實體

在 Angular 9 後，只要是開啟 Ivy (預設開啟)，並且在開發模式下，打開 F12 的 console 後，只要輸入 `ng.`，就可以看到出現了一些新的 API 可以使用，從名稱不難看出，這些 API 是用來幫助我們取得程式內某些元件實體用的！

{% asset_img 02.jpg %}

先來看看如何拿到一個畫面上的元件 (component)，我們知道畫面上的元件其實是一個對應的 HTML 標籤，也會對應元件 `@Component` 中的 `selector` 設定，若要拿到這個標籤，可以單純的使用 `document.querySelector` 的方式，得到標籤元素 (element)，這是一件容易的事情。

另外一個簡單拿到元素的技巧是，開啟 F12 的 Elements 頁籤中找到該元素後，按右鍵 -> Store as global variable，即可產生一個 tempX 的變數，代表這個元件所屬元素。

{% asset_img 03.jpg %}

### ng.getComponent

問題是，這個元素代表的一個 HTML 原生的標籤元素，並不是我們的 Angular 元件實體，如果我想要進行測試，該怎麼辦呢？此時可以使用 `ng.getComponent()` 的方式，將元素當參數帶入，即可取得此元素代表的元件實體！

{% asset_img 04.jpg %}

這對開發測試來說真的是一大方便的工具！我們可以在任何時候透過正確的 select 搭配 `ng.getComponent()` 來拿到任何想要的元件實體物件，代表隨時可以得知該元件的內部狀態。

### ng.applyChange

拿到物件後，我們也可以很容易的變更物件的屬性，如果物件屬性跟畫面有關，也可以使用 `ng.applyChange(comp)` 的方式，觸發指定元件的變更偵測，畫面也會跟著變更，真的超級方便的！！

### ng.getHostElement

當取得某個元件物件後，想知道他是畫面上的哪個實體元素，也可以使用 `ng.getHostElement(comp)` 的方式，找到對應的元素。

## ng 物件其他 API

目前 `ng` 物件的 API 清單及說明如下：

- `ng.applyChanges()`：觸發指定元件物件的變更偵測
- `ng.getComponent()`：傳入一個元素，取得此元素代表的元件物件實體
- `ng.getContext()`：如果元素放在一個 embedded view 內(如 `*ngIf` 或 `*ngFor` 或任何自訂的樣板)，可以取得元素在哪個樣板下

{% asset_img 05.jpg %}

- `ng.getDirectives()`：依照某個元素取得掛在此元素上的 directives
- `ng.getHostElement()`：取得元件或 directive 所屬的元素
- `ng.getInjector()`：取得元素、元件或 directive 的 injector
- `ng.getListeners()`：取得元素目前被監聽的事件，如某個元件使用 `(click)="xxx()"`，透過 `ng.getListeners()` 即可知道該元素(or 元件) 目前有綁定 click 事件。需要注意的是，只有使用事件繫結或 `@HostListener` 的才會計算，自己使用如 `addEventListener()` 的不會被算進去。

{% asset_img 06.jpg %}

- `ng.getOwningComponent()`：取得元素屬於哪個元件內(取得父元件)
- `ng.getRootComponents()`：取得某個元素或元件屬於哪個「根元件」

# 本日小結

Angular 9 推出了許多令人感興趣的功能，大多數不會改變原有的開發習慣，只是更好、更快，而新增的 `ng` 物件相信會大幅改變開發人員未來的除錯和測試習慣，一定要趕快學起來，比別人早下班就靠這招啦！！

# 相關資源

- [Version 9 of Angular Now Available — Project Ivy has arrived!](https://blog.angular.io/version-9-of-angular-now-available-project-ivy-has-arrived-23c97b63cfa3)
- [Angular - @angular/core/global](https://angular.io/api/core/global)
