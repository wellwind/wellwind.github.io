---
title: "[Angular 大師之路] exportAs - 取得 directive 實體的方法"
date: 2018-10-24 21:35:33
category: "Angular 大師之路"
tags:
  - Angular
  - Directive
  - exportAs
---

Angular 提供了一種可以很擴充元件或HTML標籤屬性的方式，叫做 `directive`，透過這種方式我們可以很輕易地替現有的元件或 HTML 擴充它的顯示或行為，但單純擴充有時候是不夠的，如果我們希望能夠在程式中操作 directive 的話，今天學習的 `exportAs` 就是一個很好的使用時機。

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：4 顆星

# 先看看程式

假設我們設計了一個簡單的 directive 如下：

```typescript
@Directive({
  selector: '[appColorful]'
})
export class ColorfulDirective {
  @Input() appColorful;
  @HostBinding('style.color') get color() {
    console.log(this.appColorful);
    return this.appColorful || 'red';
  }
}
```

這個 directive 很簡單，就是繫結宿主元素(host element)的 `color` 樣式而已，在使用時也很容易：

```typescript
<p appColorful="blue">Hello World</p>
```

這本身是非常容易的一件事情，現在我們把 `directive` 稍微複雜化一點，變成下面程式：

```typescript
@Directive({
  selector: '[appColorful]'
})
export class ColorfulDirective {
  @Input() appColorful;
  @HostBinding('style.color') get color() {
    console.log(this.appColorful);
    return this.appColorful || 'red';
  }

  changeColor(color) {
    this.appColorful = color;
  }
}
```

跟原來的程式相比，其實只是加了 `changeColor` 方法而已，我們希望可以在 TypeScript 裡面不透過屬性繫結的方式，來讓 `directive` 呼叫 `changeColor()` 方法改變顏色，接下來的問題是，如何取得這個 ｀directive｀ 實體呢？

## 使用樣板參考變數試試看

在設計 component 時，我們只需要掛上樣板參考變數，就能夠取得 component 的實體，例如：

```htmll
<!-- 此時的 colorful 就是 ColorfulComponent 本身 -->
<app-colorful #colorful></app-colorful>
```

若是在樣板中的 component 在掛上 directive 時，很明顯的樣板參考變數也無法取得 directive 本身的實體，若是掛在單純的 HTML 標籤上呢？我們可以試試看會取得什麼東西？

```typescript
@Component({
  selector: 'my-app',
  template: `
  <p appColorful="blue" #color>Hello World</p>
  <button (click)="change()">Change Color</button>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  @ViewChild('color') color;

  change() {
    console.log(this.color);
  }
}
```

在按下按鈕呼叫 `change()` 時，把這個變數印出來看看，如下：

{% asset_img 01.jpg %}

可以看到我們單純的是取得 `ElementRef` 代表這個宿主元素的主體，而非 directive 本身。那麼到底要怎麼拿到 directive 實體呢？就是今天的重點 `exportAs` 啦！

## 使用 exportAs

在宣告 `@Directive()` 裝飾我們的 directive 時，裡面可以設定一個 `exportAs: string`，用來代表這個 directive 實體要以什麼名稱分享出去，所以我們的 `@Directive()` 可以調整成如下：

```typescript
@Directive({
  selector: '[appColorful]',
  // 加上 exportAs
  exportAs: 'colorful'
})
```

之後在樣板上就能夠改用 `#color="colorful"` 的方式，正確的取得 directive 實體啦！取得這個實體後，就可以隨意呼叫裡面的方法：

```typescript
@Component({
  selector: 'my-app',
  template: `
  <!-- 使用 #color="colorful" 取得實體 -->
  <p appColorful="blue" #color="colorful">Hello World</p>
  <button (click)="change()">Change Color</button>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  // 確定取得的是 ColorDirective 的實體
  @ViewChild('color') color: ColorfulDirective;

  change() {
    console.log(this.color);
    this.color.changeColor('black');
  }
}
```

透過這種方式，我們在設計 directive 時，就可以透過 `exportAs` 來設定給外部程式使用的實體，就能夠在程式中針對 directive 進行更細緻的處理，整體設計時也會更加有彈性囉！

{% note warning %}

在設計 `exportAs` 時，為了避免名稱衝突，通常都會直接設定成跟 `selector` 設定一樣的名稱。

{% endnote %}

# 以表單元件舉例

當我們使用 [Template driven form 進行表單驗證](https://angular.io/guide/form-validation#template-driven-validation)時，會出現像是 `#name="ngModel"` 這樣的語法：

```html
<input id="name" name="name" [(ngModel)]="hero.name" #name="ngModel" >
```

其實就是 `ngModel` 這個 directive 也加上了 `exportAs: []`，[原始碼](https://github.com/angular/angular/blob/4c2ce4e8ba4c5ac5ce8754d67bc6603eaad4564a/packages/forms/src/directives/ng_model.ts#L106)看起來如下：

```typescript
@Directive({
  selector: '[ngModel]:not([formControlName]):not([formControl])',
  providers: [formControlBinding],
  exportAs: 'ngModel'
})
```

這樣是不是對 Template driven form 表單驗證常用技巧的原理更加熟悉一點啦！？

# 本日小結

今天我們介紹的 `exportAs` ，在一般應用程式中使用的頻率通常比較低，但使用 `exportAs` 也是有很多好處的，最明顯的是我們可以減少很多不必要的 `@Input` 等設計，直接取得 directive 實體並呼叫相關方法即可；同樣的我們也可以減少樣板上不必要的設定，把大部分的操作全部都移動到 TypeScript 之中，畢竟很多時候比起寫樣板上的語法，寫程式才是我們最擅長的啊！

今天的範例程式碼參考：

https://stackblitz.com/edit/itironman-2019-exportas

# 相關資源

- [Directive - exportAs](https://angular.io/api/core/Directive#exportAs)
