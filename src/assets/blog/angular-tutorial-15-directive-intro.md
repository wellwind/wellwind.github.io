---
title: "[Angular速成班]使用attribute directive擴充元件屬性"
date: 2017-02-14 11:11:11
category: "Angular速成班"
tags:
    - Angular
    - Directive
    - \@Directive
    - \@HostListener
---
今天我們要介紹Angular中的attribute directive，透過attribute directive，我們可以自行擴充元件的屬性，讓元件更富有變化性！

<!-- more -->

# 關於Directive

在Angular中，Directive分成3種：

1.  **Components**：也就是我們[之前就介紹過的Angular畫面組成的基本單元](https://dotblogs.com.tw/wellwind/2016/10/18/Angular-basic-concepts-and-create-components)。
2.  **Structural directives**：主要用來改變DOM的配置，例如**ngIf**和**ngFor**，他們會移除或加入某些DOM元素，來讓DOM結構產生變化。
3.  **Attribute directives**：用來改變某個DOM元素、Component甚至是其他directive的顯示方式或行為。

前面兩種我們在過去的文章都已經介紹過了，今天我們要介紹第三種—**Attribute directives**，在Angular中我們也會直接把它稱做directives，透過directive我們可以擴充原有的屬性(attribute)，來達到擴充原有的DOM element、Component甚至其他的directive沒有的功能！

今天我們將示範透過directive來為原來的button加上bootstrap的樣式，並且能透過@Input來傳遞參數給directive，讓設定更加靈活，我們的目標如下圖，每個按鈕可以套用不同的樣式，並且在案下時切換樣式，都只由一個directive搭配不同的參數來完成，如下：

{% asset_img 0.gif %}

# 建立Directive

要建立一個Directive非常容易，使用Angular CLI的`ng g d`指令就可以了

```
ng g d bsButton
```

接著會產生一個bs-button.directive.ts的檔案，內容如下：

```typescript
import { Directive } from '@angular/core';

@Directive({
  selector: '[appBsButton]'
})
export class BsButtonDirective {

  constructor() { }

}
```

所有的directive都必須搭配@Directive這個decorator，以及設定selector參數，這個selector可以決定要套用的屬性名稱，例如目前是`[appBsButton]`，那麼`<button appbsbutton="">...</button>`或是，`<div appbsbutton="">...</div>`都會套用，如果設定為`button[appBsButton]`，則只有`<button appbsbutton="">...</button>`會生效。

接著我們要取得目前套用directive的element，才能知道如何改變element的內容，我們可以**注入ElementRef**，來取得目前directive所在的element：

```typescript
import { ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[appBsButton]'
})
export class BsButtonDirective {

  constructor(private el: ElementRef) { }

}

```

接著我們就可以來改變它的樣式啦！我們加入一個ngOnInit()並撰寫程式碼，如此一來就可以在元件初始化時套用我們的程式碼

```typescript
import { ElementRef,  Directive,  OnInit} from '@angular/core';

@Directive({
  selector: '[appBsButton]'
})
export class BsButtonDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    const button = (this.el.nativeElement as HTMLElement);
    button.classList.add('btn');
    button.classList.add('btn-primary');
  }
}

```  

{% note info %}  
ngOnInit是Angular元件生命週期的一部份，未來我們會在生命週期的文章中詳細介紹  
{% endnote %}  

接著在HTML中套用這個directive

```html
<button appbsbutton="">Button with Attribute Directive</button>
```

就可以看到如下的結果啦！我們是透過directive的方式在程式中為button加入class，而非在button中直接加入`class="btn btn-primary"`；但結果是一樣的。

{% asset_img 1.png %}

由於我們預先知道傳過來的Element是一個HTMLElement，所以透過TypeScript進行轉型，若不確定傳過來的是什麼，也有一個Renderer輔助類別，來幫助我們設定樣式，這個Renderer一樣需要透過注入的方式來使用，最終程式為：

```typescript
import { Renderer, ElementRef, Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[appBsButton]'
})
export class BsButtonDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementClass(this.el.nativeElement, 'btn', true);
    this.renderer.setElementClass(this.el.nativeElement, 'btn-primary', true);
  }
}
```

注意renderer.setElementClass()的第3個參數，設為true代表加入這個class，設為false則代表移除此class，稍後我們也會用到。

# 加入@Input，讓Directive更有彈性

我們之前已經介紹過@Input了，＠Input一樣擴充了屬性，但可以傳遞屬性的內容，接著我們來透過@Input，讓appBsButton可以加上其他樣式。

我們先把directive的程式加入@Input，並設定加入@Input傳進來的資料

```typescript
export class BsButtonDirective implements OnInit {

  @Input() appBsButton;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementClass(this.el.nativeElement, 'btn', true);
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.appBsButton || 'primary'}`, true);
  }
}
```

接著HTML中就可以使用appBsButton="primary"這樣的方式來設定樣式啦！

```html
<button appbsbutton="danger">Button (Danger)</button> 
<button appbsbutton="info">Button (Info)</button> 
```

執行結果：

{% asset_img 2.png %}

# 加入@HostListener，監聽來源Element的事件

當然，我們可以自己用addEventListener來監聽事件是沒有問題的，不過需要注意的是，由於Angular是一個SPA應用程式，因此Element隨時會動態的被產生或消滅，如果我們沒有在Element被消滅時取消監聽的話，長久下來容易造成memory leaks的問題，而@HostListener則可以幫我們解決這個問題，在Element被消滅時自動取消監聽！（順便多學一個decorator）

接下來我們要加入@HostListener，完成最後的目標：**在滑鼠按下時改變樣式**；這個樣式我們一樣希望可以從@Input來取得，最終的程式碼改寫成：

```typescript
import { HostListener, Renderer, ElementRef, Directive, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appBsButton]'
})
export class BsButtonDirective implements OnInit {

  @Input() appBsButton;
  @Input() mouseDownClass; // 額外的@Input

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.appBsButton = this.appBsButton || 'primary';
    this.mouseDownClass = this.mouseDownClass || 'danger';
    this.renderer.setElementClass(this.el.nativeElement, 'btn', true);
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.appBsButton}`, true);
  }

  @HostListener('mousedown') onMouseDown() {
    // 移除原來的樣式
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.appBsButton}`, false);
    // 加入mousedown的樣式
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.mouseDownClass}`, true);
  }

  @HostListener('mouseup') onMouseUp() {
    // 移除mousedown的樣式
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.mouseDownClass}`, false);
    // 加入原來的樣式
    this.renderer.setElementClass(this.el.nativeElement, `btn-${this.appBsButton}`, true);
  }
}

```

在HTML中可以使用**appBsButton**及**mouseDownClass**兩個屬性：

```html
<button appbsbutton="danger" mousedownclass="primary">Button (Danger <-> Primary)</button>
<button appbsbutton="info" mousedownclass="success">Button (Info <-> Success)</button>
```

再執行看看，就是我們想要呈現的結果啦！！

{% asset_img 3.gif %}

# 單元回顧

今天我們介紹了Angular中最後一個與View呈現相關的內容—directive，透過directive我們可以為原來的Element擴充樣式或行為，也可以算是一種**AOP（Aspect-Oriented Programming）**的呈現，讓原來的Element不用去管需要擴充的細節，直接交給directive就好，實在是非常方便阿！

到目前為止所介紹的內容，只要能夠掌握使用方式並靈活使用，就已經足夠在開發Angular大部分的時機實用了，之後的文章就會越來越深入囉！

本日程式碼：[https://github.com/wellwind/AngularDotblogsDemo/tree/DirectiveDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/DirectiveDemo)