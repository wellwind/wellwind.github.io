---
title: "設計 @Output 時的命名注意事項"
date: 2019-02-16 21:16:12
category: "Angular 大師之路"
tags:
  - Angular
  - "@Output"
---

最近在開發 Angular 程式時，遇到了一個詭異的情況，其實主要是來自對於 HTML 底層的一些觀念沒有弄清楚，跟[保哥](https://www.facebook.com/will.fans)討論釐清後，雖然不是 Angular 的問題，但要是一個沒注意，很容易不小心發生問題，因此在這篇文章記錄一下！！

<!-- more -->

# 問題描述

先看看以下簡單的元件設計：

```typescript
@Component({
  selector: 'app-fake-form',
  template: `
  <form>
    <input name="username" type="text" placeholder="Username" [(ngModel)]="username" />
    <button (click)="save()">Save</button>
  </form>
  `
})
export class FakeFormComponent {
  username = '';
  @Output() submit = new EventEmitter();

  save() {
    this.submit.emit();
  }
}

@Component({
  selector: 'my-app',
  template: `
  <app-fake-form (submit)="submit()">
  `
})
export class AppComponent  {
  submit() {
    console.log('do something...')
  }
}
```

這段程式非常的簡單，在 `app-fake-form` 子元件內有一個表單，當這個表單按下按鈕時，呼叫了我們自訂的 `submit()` 事件，並將資料傳出去，接著在使用 `app-fake-form` 的父元件處理這個事件來決定該做些什麼事情。

```html
<form>
  <input name="username" type="text" placeholder="Username" [(ngModel)]="username" />
  <button (click)="save()">Save</button>
</form>
```

在 `<form>` 裡面的 `<button>` 只要不是設定 `type="button"`，都會造成表單產生送出的行為，所以當我們在表單上加上 `submit` 事件處理時，是會有資料的，但在這裡我們其實不用特別理會，因為我們的最終目標只是要讓自訂元件能發送事件給父元件而已，有產生表單送出其實我們並不需要在意。

{% note info %}

一般來說當 HTML 表單有送出發生時，會重新整理才對，但 Angular 會將所有 `<form>` 處理成 [NgForm](https://angular.io/api/forms/NgForm) 實體，並有額外的機制來迴避掉瀏覽器送出表單的行為。

如果不希望 Angular 幫我們處理 `<form>` 元素，可以加上 `ngNoForm`，如：`<form ngNoForm>`。即可當作一般瀏覽器標單處理。

{% endnote %}

看起來非常普通的程式，我們可以預期按下按鈕後，在 console 內可以看到一筆記錄，而實際執行起來如何呢？如下：

{% asset_img 01.gif %}

當按下按鈕時，竟然產生兩筆記錄，看起來我們自訂的 submit 事件被觸發了兩次，到底這是什麼原因呢？

# 原來所有的 HTML 元素都內建 submit 事件

在 HTML 內，我們可能會不自覺的認為 `submit` 事件只有表單才會有，所以以下程式非常合理：

```html
<form (submit)="doSomething()">
  ...    
</form>
```

而自訂的元素，或其他非表單的元素，都不應該有 `submit` 事件才對，應此以下程式理論上都不會被執行

```html
<my-fake-app (submit)="doSomething()"></my-fake-app>
<div (submit)="doSomething()"></div>
```

但從上面了例子，看起來又不太像是這麼回事。

在釐清一些觀念後，發現了原來在瀏覽器裡面「所有的元素都有 submit」事件！

該如何證明呢？先從文件看起吧！

在由 Mozilla 維護的 MDN web docs 裡面有說明瀏覽器中所有 DOM 物件的共通的父物件 - [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) 內，竟然就包含了 `onsubmit` 事件！而點進去看看 [onsubmit](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onsubmit) 的說明，可以看到他是 [GlobalEventHandlers](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers) 這個物件的其中一個屬性！由於所有的 DOM 元素都繼承自 HTMLElement，因此所有的 HTML 元素都有 `onsubmit` 事件是非常合理的。

再來我們直接從瀏覽器看看，打開 F12 後在 Elements 頁籤可以看到目前的 DOM tree，隨便點擊一個非表單元素，再往下找到 Properties，可以看到目前選中的元素與它的繼承關係，展開 `HTMLElement` 後，就可以看到 `onsubmit` 就站在那邊對你偷笑，**原來所有的 HTML 元素都內建了 submit 事件**啊...有了這個概念後，一切就豁然開朗啦！

雖然只有在表單裡面才可能會有 submit 行為發生，但關於 `onsubmit` 這個事件，則是所有 HTML 元素都有的事件；接著讓我們來解釋一下為什麼外層元素的 `onsubmit` 事件也會被觸發！

# 來談談「事件冒泡」

在 HTML 的事件中，有一個有趣的機制，叫做事件冒泡(bubble)，它的意思非常簡單：「當事件發生時，這個事件會像泡泡一樣，往父層元素發送，因此所有父層元素也會觸發一樣的事件」。

我們可以從 MDN 提供的 HTML 文件中，來看看對應的事件是否會冒泡：

{% asset_img 02.jpg %}
[圖片來源](https://developer.mozilla.org/en-US/docs/Web/Events/submit#General_info)

由於表單的 onsubmit 事件是會冒泡的，因此以我們最初的例子來說，事件就會被觸發兩次：

1. 第一次是內部表單產生 submit 事件後，冒泡上去的
2. 第二次才是我們真正使用自訂 `@Output` 並命名為 submit 的事件名稱

{% note info %}

如果對於事件冒泡的細節有興趣，可以參考以下文章，圖文並茂且解釋得非常清楚

- [Bubbling and Capturing](https://javascript.info/bubbling-and-capturing)

{% endnote %}

# 解決問題

所有造成問題的知識都釐清後，我們就來解決問題吧！

最推薦的處理方法，是替我們的 `@Output` 宣告換一個名稱！我們不需要跟瀏覽器原生的機制做對，只需要把原來的 `@Output submit = new EventEmitter();` 改成其他名稱如 `@Output formSubmit() = new EventEmitter();` 即可，這麼一來我們在使用元件時就不會與 HTML 原生的事件名稱衝突，也比較不會產生各種衍伸問題！

這也提醒了我們，我們在規劃元件 `@Output` 時應該盡可能避免與 HTML 事件名稱衝突到！

如何避免 `@Output` 與 HTML 事件名稱衝突呢？最簡單的方式就是在 Angular 專案的 `tslint.json` 加上 `"no-output-named-after-standard-event": true` 這條規則！接著記得一定要在編輯器中安裝 TSLint 套件，就可以在開發階段即時看到錯誤：

{% asset_img 03.jpg %}

{% note info %}

這條 TSLint 規則是來自 [codelyzer](http://codelyzer.com) 套件，使用 Angular CLI 安裝的專案預設會安裝此套件並設定好相關規則(只是沒加上這條)，如果專案不是用 Angular CLI 建立的，記得先將 codelyzer 裝起來，這條規則才有作用！

{% endnote %}

當然我們也可以選擇其他幾種方式，但這些方法都不能避免我們與原生的事件名稱衝突，所以並不推薦，就簡單列出來：

- 拿掉 `<form>`
- 改成 `<button type="button">`
- 使用 `event.stopPropagation()`

# 結論

在 Angular 中規劃 `@Output` 時，我們應該盡量避免與原生的 HTML 事件名稱衝突，以本篇文章的例子就是因為不理解 `submit` 這個名稱在所有的 HTML 元素都有，才會發生錯誤！

因此在設計前，若覺得名稱可能與現有事件衝突，不妨先查一下資料！如果在開發時發現有莫名重複的事件呼叫，也可以試著往這個方向，找找設計的 `@Output` 是否與原生的事件名稱衝突。

當然我們不可能背下所有 HTML 元素的所有事件名稱，所以透過 TSLint 幫我們檢查，可以說是一種非常好的方式。

不管怎樣，只要遭遇過一次慘痛教訓後，以後遇到類似問題，至少會有方向找答案啦！

