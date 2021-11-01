---
title: "[Angular 大師之路] 動態載入元件 (簡易版)"
date: 2018-10-28 22:01:09
category: "Angular 大師之路"
tags:
  - Angular
  - "*ngComponentOutlet"
  - EntryComponents
---

在設計 Angular 程式時，我們很習慣的會將各種不同目標或功能的畫面拆成不同的元件，這麼一來每個元件的程式就會相對比較簡單，管理上也會更加容易，不過當樣板上要呈現不同元件時，就容易不小心把樣板程式碼弄髒了，因此我們需要更有技巧地來決定要怎麼顯示元件，也就是今天的主題 - **動態載入元件**的方法

<!-- more -->

**類型**：技巧/觀念

**難度**：3 顆星

**實用度**：5 顆星

# 先來看問題

假設有個樣板程式如下：

```html
<input type="radio" id="formA" name="form" value="A" [(ngModel)]="chooseForm">
<label for="formA">表單A</label>
<input type="radio" id="formB" name="form" value="B" [(ngModel)]="chooseForm">
<label for="formB">表單B</label>
<input type="radio" id="formC" name="form" value="C" [(ngModel)]="chooseForm">
<label for="formC">表單C</label>

<ng-container *ngIf="chooseForm === 'A'">
  <app-component-a></app-component-a>
</ng-container>
<ng-container *ngIf="chooseForm === 'B'">
  <app-component-b></app-component-b>
</ng-container>
<ng-container *ngIf="chooseForm === 'C'">
  <app-component-c></app-component-c>
</ng-container>
```

在上面的程式中，我們可以根據使用者的選擇，呈現不同的元件內容，看起來非常合理，執行起來也沒有問題，但看起來就是有點髒，而且假設 `*ngIf` 內有更複雜的計算方式來決定顯示元件時，把程式都寫在樣板上就會是個比較糟糕的做法，此時我們就會考慮使用**動態載入元件**的方式，來減少一些程式碼。

# 使用 *ngComponentOutlet 動態載入元件

跟之前介紹 `*ngTemplateOutlet` 很像，我們除了可以動態載入不同的樣板以外，Angular 也提供了類似的 `*ngComponentOutlet` 來幫助我們動態載入元件，這時候我們可以把要產生元件的方法教給程式來決定，例如：

```typescript
chooseForm = 'A';
mapping = new Map<string, any>(
  [
    ['A', ComponentAComponent],
    ['B', ComponentBComponent],
    ['C', ComponentCComponent],
  ]
);
```

這時候我們只要使用 `mapping.get(chooseForm)`，就能取得要產生的元件類別，接著在畫面上我們就能使用 `*ngComponentOutlet` 來決定要放什麼元件上去啦！

```typescript
<ng-container *ngComponentOutlet="mapping.get(chooseForm)"></ng-container>
```

原本樣板上複雜的程式，瞬間被濃縮到剩下一行，是不是清爽簡單多啦！

不過到目前為止還沒結束，我們必須把想要動態載入的元件，都放到所屬模組的 `entryComponents: []` 之中：

```typescript
@NgModule({
  ...
  entryComponents: [ComponentAComponent, ComponentBComponent, ComponentCComponent]
})
export class AppModule { }
```

才算是大功告成！

接著我們來討論一下為何要將元件放到 `entryComponents: []` 內。

# 認識 Entry Components

(以下內容全部都是文字描述，如果覺得不是很明白，也可以跳過沒關係，主要是說明 Entry Components 的觀念)

Entry components 代表的是：「要在 Angular 程式中指令式(imperatively)地產生的元件」，跟宣告式(declarative)使用元件不同的地方在於，宣告式是在樣板中宣告要使用的元件，而指令式是在程式(也就是 TypeScript)內設定要使用的元件。

也就是說，當我們看到樣板上宣告了 `<app-demo>` 時，代表就是宣告式的方式決定要使用 `DemoComponent`，但我們在這個單元內，並不會再樣板上宣告使用某個元件，這時候會發生一件事情：

「當我們在使用 Angular CLI 提供的 Webpack 設定打包程式時，會將 Angular 的樣板同時做編譯，來決定哪些元件是要打包的；此時如果我們產生了一個元件，也在模組的 `declarations: []` 加入了元件，但卻沒在樣板中使用到，此元件會被判斷回不必要打包的程式，以減少最終的程式大小」

也就是說，**我們的元件會因為樣板上沒使用到而被過濾掉**，因此當需要動態載入元件時，會發生找不到元件的狀況！

有鑑於此，Angular 的模組加入了 `entryComponents: []` 的機制，當打包程式時，若有在 `entryComponents: []` 內有設定元件，代表這個元件未來可能是會被程式內動態產生了，於是元件的程式也會同時被打包進去，才不會發生錯誤。

雖然看似麻煩了一點，但這可以確保我們的程式大小盡可能得最小化，以增進載入的效能！

除了 `entryComponents: []` 裡面是我們自己聲明要使用的元件外，事實上還有兩個地方也會設定動態載入元件，分別是：

1. `bootstrap: []`：代表要啟動的根元件，此元件也是需要在程式中動態產生的
2. 路由設定的元件：這些元件也不會在樣板中直接被用到，而是當路由變更時比對要產生的元件

在以上兩個地方設定的元件，在觀念上也被歸納在 Entry Components 內！

# 本日小結

今天我們快速的學習了動態載入元件的方式，也理解了 Entry Components 的觀念，Entry Components 看似抽象，但其實多看多用幾次，也就能容易理解哩！

明天我們再來看看複雜版的動態載入元件方式！(也就是 `*ngTemplateOutlet` 與 `*ngComponentOutlet` 之所以能實現的原理)

本日程式碼位置：https://stackblitz.com/edit/ironman2019-ngcomponentoutlet

# 相關資源

- [NgComponentOutlet](https://angular.io/api/common/NgComponentOutlet)
- [Entry Components](https://angular.io/guide/entry-components)
