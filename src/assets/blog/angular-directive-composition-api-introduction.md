---
title: "[Angular] Directive composition API 初體驗"
date: 2022-11-20 12:02:43
category:
  - "Angular大師之路"
tags:
  - "Angular"
  - "Angular 15"
  - "Directive"
  - "Directive Composition API"
---

Angular v15 推出了新的 feature - **directive composition API**，可以方便我們更加容易組合出更複雜的 directive。

這篇文章就讓我們來快速體驗一下 directive composition API 使用起來是什麼感覺！

<!-- more -->

# 基本情境

想像一下，我們有個「可以變更背景顏色」的 directive

```typescript
@Directive({
  selector: '[appBgColor]'
})
export class BgColorDirective {
  @Input() @HostBinding('style.background-color') bgColor = 'yellow';
  @HostBinding('style.display') display = 'inline-block';
}
```

使用方式應該很好想像也很簡單

```html
<div appBgColor>Block 1</div>
<div appBgColor bgColor="red">Block 2</div>
```

除了掛在一般的 HTML 元素上以外，要掛在 component 上也是可以的

```html
<app-my-comp appBgColor></app-my-comp>
<app-my-comp appBgColor bgColor="green"></app-my-comp>
```

以上寫法都沒有什麼問題，但假如今天有個情境是，如果我有個 `MyCompComponent` 元件，想要內建支援「變更背景顏色」的功能，而且現有的 `BgColorDirective` 都已經寫好了，我能不能沿用呢？

在 Angular v15 之前，是沒什麼辦法的，只能繼續要求使用的人套上這個 directive，但這就不是內建支援了，所以只能選擇把裡面的程式移植到元件裡面來，但以後如果需又修改，就會改兩個地方，維護性比較差。

到了 Angular v15 以後，由於 directive componsition API 的關係，我們可以輕易的將 directive 「組合」到一個元件，或是 directive 了！

# Directive composition API

話不多說，直接看看 directive composition API 該如何使用，在 `@Component` 和 `@Directive` 這兩個 decorator 上，現在都多了 `hostDirectives: []` 可以設定要組合的 directive。

## 前提

唯一要注意的是，如果要使用 directive composition API，那麼「被組合」的 directive「**必須是 standalone 的**」，因此在原來的 directive 一定加上 `standalone: true` 的設定：

```typescript
@Directive({
  selector: '[appBgColor]',
  standalone: true
})
export class BgColorDirective { ... }
```

{% note info %}

關於 standalone 的寫法，可以參考之前的文章：[搶先體驗 Standalone Components / Directives / Pipes](https://fullstackladder.dev/blog/2022/05/14/angular-14-standalone-components-directives-pipe-preview/)

{% endnote %}

## 使用

接著就可以組合這個 directive 了

```typescript
@Component({
  selector: 'app-my-comp',
  hostDirectives: [BgColorDirective],
  ...
})
export class MyCompComponent { ... }
```

使用元件時，只要使用元件就具有 directive 效果了

```html
<app-my-comp></app-my-comp>
```

就等於過去自己加上 appBgColor 的 directive

```html
<app-my-comp appBgColor></app-my-comp>
```

很簡單吧！透過 directive composition API，我們可以輕易的將 directive 組合到元件上，直接在元件內就享用 directive 的功能，在某個元件如果確定要使用某個 directive 功能時，可以大幅簡化程式碼！

## Inputs & Outputs

Directive composition API 不僅是組合一個 directive 本身的功能而已，當 directive 有 inputs 或 outputs 時，也可以在 `hostDirectives: []` 中設定，把 directive **類別內**的 `@Inptut()` 或 `@Output()` 當做事元件自己的，例如我們的 `BgColorDirective` 有一個 `bgColor` 的 `@Input()`，希望在組合到 `MyCompComponent` 時也可以直接使用 `bgColor` 來對 directive 的行為設定，可以寫成：

```typescript
@Component({
  selector: 'app-my-comp',
  hostDirectives: [
    {
      directive: BgColorDirective,
      inputs: ['bgColor']
    }
  ],
  ...
})
export class MyCompComponent { ... }
```

這時候元件就可以如此使用

```html
<!-- 使用預設的 bgColor -->
<app-my-comp></app-my-comp>
<!-- 自訂 BgColorDirective 的 bgColor -->
<app-my-comp bgColor="red"></app-my-comp>
```

如果有自訂的 `@Output()` 事件，也一樣加到 `outputs: []` 即可。

另外，如果擔心名稱衝突，也可以如下設定一個別名

```typescript
@Component({
  selector: 'app-my-comp',
  hostDirectives: [
    {
      directive: BgColorDirective,
      // 設定別名為 backgroundColor
      inputs: ['bgColor: backgroundColor']
    }
  ],
  ...
})
export class MyCompComponent { 
  // 元件內的 bgColor 不會跟 BgColorDirective 的 bgColor 衝突
  @Input() bgColor = '';
}
```

使用時：

```html
<!-- backgroundColor 是 BgColorDirecrive 的 bgColor -->
<!-- bgColor 是 MyCompComponent 本身的 bgColor -->
<app-my-comp 
  backgroundColor="red"
  bgColor="anything"
></app-my-comp>
```

另外，由於等同於在元件上直接掛 directive，因此我們也可以再建構式注入 directive 本身已取得 directive 的實體，例如：

```typescript
@Component({
  selector: 'app-my-comp',
  hostDirectives: [
    {
      directive: BgColorDirective,
      inputs: ['bgColor']
    }
  ],
  ...
})
export class MyCompComponent { 
  constrictor(private bgColorDirective: BgColorDirective) { ... }
}
```

在需要特別控制掛在身上的 directive 時，還蠻有用的。

## directive 組合多個 directives

我們也可以在一個 directive 內透過 `hostDirective: []` 一次組合多個 directives，例如以下 directive 組合了 `BgColorDirective` 和 `TextColorDirective`：

```typescript
@Directive({
  selector: '[appTextBlock]',
  standalone: true,
  hostDirectives: [
    {
      directive: BgColorDirective,
      inputs: ['bgColor']
    },
    {
      directive: TextColorDirective,
      inputs: ['textColor']
    }
  ]
})
export class TextBlockDirective { ... }
```

此時這個 `TextBlockDirective` 就同時具備了 `BgColorDirective` 和 `TextColorDirective` 的功能，可以這樣使用：

```html
<div appTextBlock></div>
<div appTextBlock [bgColor]="bgColor" [textColor]="textColor"></div>
```

未來我們在設計 directive 時，可以拆成許多功能單一個 directives，最後在透過 directive composition API 來組合出各種不同意圖的 directive 囉！

## 組合的 directive 再組合到元件上

這個組合好的 directive 可不可以再組合到元件上呢？是可以的，但有一些要注意的地方：

理想中的基本組合方式

```typescript
@Component({
  selector: 'app-my-comp',
  hostDirectives: [
    {
      directive: TextBlockDirective,
      inputs: ['bgColor', 'textColor']
    }
  ],
  ...
})
export class MyCompComponent { ... }
```

在這邊我預期把原來 `TextBlockDirective` 組合時的兩個 `inputs: []` 設定加進來，因此使用 `inputs: ['bgColor', 'textColor]`，但是會生錯誤

```
Error: src/app/my-comp/my-comp.component.ts:11:18 - error NG2017: Directive TextBlockDirective does not have an input with a public name of bgColor.

11       directive: TextBlockDirective,
                    ~~~~~~~~~~~~~~~~~~


Error: src/app/my-comp/my-comp.component.ts:11:18 - error NG2017: Directive TextBlockDirective does not have an input with a public name of textColor.

11       directive: TextBlockDirective,
                    ~~~~~~~~~~~~~~~~~~
```

為了這個問題我還去 Angular 的 GitHub 發了個 [issue](https://github.com/angular/angular/issues/48105)，得到了這樣的解答：

因為 `TextBlockDirective` 這個 class 本身並沒有 `bgColor` 和 `textColor` 這兩個 `@Input()`，而是內部的 `BgColorDirective` 和 `TextColorDirective` 才有，directive composition API 的 `inputs: []` 和 `outputs: []` 看的是「被組合的 class 內的 `@Input()` 和 `@Output()` 設定」。

要解決這個問題，目前有兩種處理方式：

第一個是補上需要的 `@Input()` 和 `@Output()` 但內容不重要

```typescript
export class TextBlockDirective {
  @Input() bgColor = '';
  @Input() textColor = '';
}
```

如此一來當其他元件組合這個 directive 時，就有了可以使用的屬性，不過我自己覺得這樣非常令人混淆，畢竟 directive 的 `@Input()` 和被組合 directive 的 `@Input()` 應該是不同的。

另外一種方式比較合理一點但我自己還是覺得有點奇怪，就是 `MyCompComponent` 內不要設定 `inputs: []`。

```typescript
@Component({
  selector: 'app-my-comp',
  templateUrl: './my-comp.component.html',
  styleUrls: ['./my-comp.component.scss'],
  hostDirectives: [
    {
      directive: TextBlockDirective,
      // 不用特別設定 inputs，就能使用 TextBlockDirective 內組合的 directives 所公開的 inputs
      // inputs: ['bgColor', 'textColor']
    }
  ]
})
export class MyCompComponent { }
```

我們可以不用特別設定 `inputs: []`，因為在 `TextBlockDirective` 裡面已經設定好要公開 `BgColorDirective.bgColor` 和 `TextBlockDirective.textColor` 了，多設定 `inputs: []` 只會讓 Angular 在尋找可用 `@Input()` 時找不到東西而已。

我自己是覺得這樣還是有一點怪，`TextBlockDirective` 決定讓 `bgColor` 和 `textColor` 可以被使用，不一定代表我在組合 `TextBlockDirective` 時也要讓這裡個屬性可以被使用，應該還是有一個能夠開放或關閉的設定才對，但目前沒有特別看到，文件也沒有說明清楚，畢竟是新東西，文件不夠完善也可以理解。

我自己覺得這可能就是 Angular 一開始預期的設計了，但也沒非常有把握，就看未來文件如何補充了：如果你有更好的想法，也請告訴我 🙏

# 本日小結

組合 (composition) 是現在在前端越來越被重視的一種設計方式，具有將功能拆成比較小的單元，之後再組合起來的設計思維也會越來越重要！隨著不斷 Angular 不斷的改版，也可以看到許多新的 api 著重在更加輕量，更好組合為目標，directive composition API 就是其中一個例子，只要善用組合的設計思維，就能讓程式碼更加簡單元化，也會容易維護。

# 相關資源

- [Directive Composition API](https://angular.io/guide/directive-composition-api)
