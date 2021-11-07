---
title: "[Angular Material 完全攻略]Angular CDK(2) - Accessibility"
date: 2018-01-13 19:34:20
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

今天我們要來介紹第一個Angular CDK的分類功能－Accessibility。Accessibility(簡稱A11y)主要是放置一些方便與使用者互動的功能，以及讓我們在使用螢幕閱讀器時更加方便的工具。我們將介紹裡面幾個有趣的功能！

<!-- more -->

## 開始使用Angular CDK的Accessibility

記得要先從`@angular/cdk/a11y`中加入`A11yModule`

```typescript
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  exports: [
    A11yModule
  ]
})
export class SharedMaterialModule {}
```

### ListKeyManager

**ListKeyManager**是用來管理一組元件，讓這些元件可以跟鍵盤互動，對於跟鍵盤互動，大部分最容易想到的就是如`Tab`、`Esc`、`Enter`和`方向鍵`這些操作，但不是每個元件都支援這樣的鍵盤互動功能，而我們則可以透過使用ListKeyManager，來讓我們的元件輕易地達到跟鍵盤互動的成果！

#### 使用ListKeyManager的基本要求

`ListKeyManager`是一個基礎類別，目前他有兩個衍伸：

-   `FocusKeyManager`：用於切換不同元件間在瀏覽器裡的focus狀態。這些元件需要實作以下interface：

    ```typescript
    interface FocusableOption extends ListKeyManagerOption {
      focus(): void;
    }
    ```

-   `ActiveDescendantKeyManager`：用來切換active的樣式，主要是在使用螢幕閱讀程式時使用。

    ```typescript
    interface Highlightable extends ListKeyManagerOption {
      setActiveStyles(): void;
      setInactiveStyles(): void;
    }
    ```

而這兩個interface都繼承自一個`ListKeyManagerOption`，它的內容如下：

```typescript
interface ListKeyManagerOption {
  disabled?: boolean;
  getLabel?(): string;
}
```

也就是說，當我們希望自訂的元件可以被ListKeyManager使用時，至少需要實作對應interface的功能，不過，`ListKeyManagerOption`的內容不是必須的。

舉例來說，當我們要使用`FocusKeyManager`時，所有包含在內的元件都必須要有個`focus()`方法，但`ListKeyManagerOption`的內容則不是必要的。

而一般來說，要使用`ListKeyManager`功能有3個步驟：

1.  使用`@ViewChildren`查出畫面上需要包含在內的元件
2.  建立一個新的`ListKeyManager`，並把上一步查出來的清單當參數傳入
3.  使用相關的鍵盤事件及設定狀態的方法，來達到互動效果。

接下來我們使用`FocusKeyManager`來做示範，看看該如何使用吧！

#### 使用FocusKeyManager

我們將以之前建立的問卷調查頁面作為範本，讓一些表單元件可以用不一樣的方式來切換focus狀態！

#### 建立一個通用的directive並實作focus()方法

由於需要使用`@ViewChildren`來取得一系列包含`focus()`方法的元件，最簡單的方式是建立一個directive，並實作`ListKeyManagerOption`的`focus()`方法：

```typescript
@Directive({
  selector: '[appSurveyInput]'
})
export class SurveyInputDirective implements FocusableOption {
  constructor(private element: ElementRef) {}

  focus() {
    this.element.nativeElement.focus();
  }
}
```

#### 將要加入FocusKeyManager的元件加上自訂的directive

接著我們把要互動的元件都加上剛剛建立的directive，如下：

```html
<mat-form-field floatLabel="auto" [hideRequiredMarker]="true" hintLabel="最多輸入5個字">
  <input name="name" matInput formControlName="name" maxlength="5" required appSurveyInput>
</mat-form-field>
...
```

#### 使用@ViewChildren查出元件並加入FocusManager

接著我們使用`@ViewChildren`找出前面加入的`SurveyInputDirective`，並取得一個QueryList，然後在ngAfterViewInit中把這個QueryList加入FocusManager

```typescript
@Component({ })
export class SurveyComponent implements AfterViewInit {
  @ViewChildren(SurveyInputDirective) surveyInputs: QueryList<SurveyInputDirective>;
  keyManager: FocusKeyManager<SurveyInputDirective>;
  
  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager(this.surveyInputs).withWrap();
    this.keyManager.setActiveItem(0);
  }
}
```

我們使用了`new FocusKeyManager(this.surveyInputs).withWrap()`建立新的FocusKeyManager，並加上`withWrap()`，這會讓我們的focus狀態成為一個循環，也就是當目前focus的是最後一個元件時，使用程式設定要跳到下一個元件時會回到第一個元件！

接著我們就可以透過`keyManager`來操作所有包含`SurveyInputDirective`的focus狀態啦！例如上面程式我們使用了`setActiveItem(0)`，代表在一開始產生元件時，就會立刻將第一個元件focus起來。

成果如下：

{% asset_img 01-focus-key-manager.gif %}

在我們重新整理後，預設就會將第一個包含`SurveyInputDirective`的元件給focus起來！

{% note info %}

**為什麼要放到ngAfterViewInit**？這是因為在`ngOnInit`時，並沒有任何畫面，所以相關的元件都還沒產生，這時候使用`@ViewChildern`查出來的QueryList一定會是空的，因此要在`ngAfterViewInit`，所有元件都產生後，才加入。

{% endnote %}

#### 與鍵盤互動

接著讓我們試試更複雜的玩法，透過鍵盤事件切換focus狀態。

```typescript
import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';

@Component({ })
export class SurveyComponent implements OnInit, AfterViewInit {
  ...
  
  @HostListener('keydown', ['$event'])
  keydown($event: KeyboardEvent) {
    // 監聽鍵盤事件並依照按鍵設定按鈕focus狀態
    if ($event.keyCode === UP_ARROW) {
      this.keyManager.setPreviousItemActive();
    } else if ($event.keyCode === DOWN_ARROW) {
      this.keyManager.setNextItemActive();
    }
  }

  ...
}
```

上面程式我們監聽了`keydown`事件，並依照輸入的`keyCode`來決定要使用`setPreviousItemActive()`回到上一個，還是使用`setNextItemActive()`往下一個focus，而`UP_ARROW`和`DOWN_ARROW`則是Angular CDK預先設定好的幾種常用的鍵盤keyCode。內建的keyCodes可以參考[Angular CDK的原始碼](https://github.com/angular/material2/blob/5.0.x/src/cdk/keycodes/keycodes.ts)。

上面程式執行結果如下：

{% asset_img 02-focus-key-manager-with-keydown.gif %}

雖然用圖示可能看不太出來，但這裡我們試用上下鍵來接換元件的focus狀態的，同時因為剛才有加入`withWrap()`的關係，所以當`setNextItemActive()`卻沒有下一筆元件可以focus時，就會切換到第一筆囉！

這樣一個切換來切換去的複雜功能，透過Angular CDK的FocusKeyManager，只要十幾行就搞定，實在太強啦！

### CdkFocusTrap

接下來我們來聊聊**CdkFocusTrap**，在之前介紹dialog時，我們曾經看到過dialog內的表單，在使用Tab / Shift + Tab切換時，是不會跳到dialog之外的，這樣的功能，我們可以透過FocusTrap提供的一系列directives，來達到目標，我們會使用到以下幾個directives：

-   `cdkTrapFocus`：用來形成一個FocusTrap區間，一般情況下，使用Tab將無法跳出這裡。
-   `cdkFocusRegionStart`：FocusTrap的範圍起點。
-   `cdkFocusRegionEnd`：FocusTrap的範圍終點。
-   `cdkFocusInitial`：區間出現時，一開始會focus的來源。

這裡有幾項我們需要注意

1.  CdkFocusTrap主要是用在**非靜態**的區間，也就是由程式邏輯判斷產生的，當需要產生時，就會預設進入FocusTrap的範圍內
2.  我們依然可以用在靜態的區間，但會產生一個問題，當Tab進這個區間時，會從`cdkFocusRegionEnd`開始，而非`cdkFocusRegionStart`或`cdkFocusInitial`。這是目前已知的問題。

來看看程式碼吧：

```html
<h2>FocusTrap</h2>
<input value="cdkTrapFocus外的Input">
<div cdkTrapFocus>
  <input value="1" cdkFocusInitial>
  <input value="2" cdkFocusRegionStart>
  <input value="3">
  <input value="4" cdkFocusRegionEnd>
</div>
```

從directive的規劃來看，我們focus的順序應該會是` 外面 -> 1 -> 2 -> 3 -> 4 -> 2 -> 3 -> 4 … `

結果如下：

{% asset_img 03-focus-trap-bad.gif %}

很怪異吧！結果竟然是 ` 外面 -> 4 -> 2 -> 3 -> 4 -> 2 -> 3 -> 4 …`，這就是我們前面提到的，FocusTrap目前主要是用在非靜態的區間，當他是靜態的時候，Tab焦點進來時會自動跑到`cdkFocusRegionEnd`，需要特別小心！

我們來改一下程式碼，讓這段FocusTrap變成動態出現的！

```html
<h2>FocusTrap</h2>
<button (click)="displayFocusTrap = !displayFocusTrap">顯示輸入項</button>
<input value="cdkTrapFocus外的Input">
<div cdkTrapFocus *ngIf="displayFocusTrap">
  <input value="1" cdkFocusInitial>
  <input value="2" cdkFocusRegionStart>
  <input value="3">
  <input value="4" cdkFocusRegionEnd>
</div>
```

結果如下：

{% asset_img 04-focus-trap-bad-2.gif %}

當動態產生時，預期`value="1"`的input會被立刻focus，但看起來是沒有，結果又回到原來的問題了，怎麼會這樣呢？再追查Angular CDK的程式及範例後，發現了一個**文件沒有說明**(暈倒)的`cdkTrapFocusAutoCapture`屬性，原來需要加上這個才會正常：

```html
<h2>FocusTrap</h2>
<button (click)="displayFocusTrap = !displayFocusTrap">顯示輸入項</button>
<input value="cdkTrapFocus外的Input">
<!-- 多了cdkTrapFocusAutoCapture -->
<div cdkTrapFocus *ngIf="displayFocusTrap" cdkTrapFocusAutoCapture="true">
  <input value="1" cdkFocusInitial>
  <input value="2" cdkFocusRegionStart>
  <input value="3">
  <input value="4" cdkFocusRegionEnd>
</div>
```

結果如下：

{% asset_img 05-focus-trap-good.gif %}

雖然文件還不太齊全，但只要好好地善用這些directives，真的可以幫助我們節省很多程式碼哩！

接下來我們來介紹一些其他的功能，有興趣的讀者也可以自己玩玩看囉。

### FocusTrapFactory

我們可以使用`cdkFocusTrap`來產生一個focus區間，而FocusTrapFactory則是真正背後在做事的service，包含我們一直提到的dialog，也是使用FocusTrapFactory來產生focus區間的！以下簡單擷取MatDialogcontainer的部分程式，來看看FocusTrapFactory該如何使用：

```typescript
export class MatDialogContainer {
  constructor(
    private _elementRef: ElementRef,
    private _focusTrapFactory: FocusTrapFactory){ }
    
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }
  }
  
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }
  }
}
```

很好理解吧！只要使用`create`方法，將要包起來的範圍丟進去，就自動形成一個focus區間啦！

### FocusMonitor

FocusMonitor是一個用來檢查元件被focus的service，我們可以透過這個service來監看某個元件的focus狀態，以及他被focus的來源是什麼(touch、mouse、keyboard、program)，簡單的程式如下：

```typescript
  startMonitor() {
    console.log('start monitoring element');
    this.focusMonitor.monitor(this.container.nativeElement, this.renderer2, false).subscribe(mode => {
      console.log('element focused by ${mode}');
    });
  }

  stopMonitor() {
    this.focusMonitor.stopMonitoring(this.container.nativeElement);
    console.log('stop monitoring element');
  }
```

### cdkMonitorElementFocus / cdkMonitorSubtreeFocus

剛剛介紹的FocusMonitor會需要寫比較多程式，如果我們只需要針對不同的focus狀態來改變樣式的時候，可以使用`cdkMonitorElementFocus`或`cdkMonitorSubtreeFocus`這兩種directive，差別是：

-   `cdkMonitorElementFocus`：只有自己被focus時有用
-   `cdkMonitorSubtreeFocus`：當裡面的元素被focus時也有用

```html
<div class="demo-focusable" tabindex="0" cdkMonitorElementFocus>
  <p>div with element focus monitored</p>
  <button>1</button><button>2</button>
</div>

<div class="demo-focusable" tabindex="0" cdkMonitorSubtreeFocus>
  <p>div with subtree focus monitored</p>
  <button>1</button><button>2</button>
</div>
```

當加上directive的元素被focus時，會自動加上一個CSS class：`cdk-focused`，方便我們針對focus狀態設計樣式。

另外，針對不同的focus來源，也會加上以下CSS class：

-   `cdk-mouse-focused`
-   `cdk-keyboard-focused`
-   `cdk-program-focused`
-   `cdk-touch-focused`

如此一來我們就可以根據不同的狀況來設計樣式，是不是整個超有彈性的啊！

### InteractivityChecker

InteractivityChecker是一個用來檢查元件互動性的service，透過這個service，我們可以得知某個元件是否支援瀏覽器的某種互動，包含以下檢查：

-   `isDisabled`：是否可以加上`disabled`屬性
-   `isFocusable`：是否可以focus
-   `isTabbable`：使用tab是否可以碰到目標
-   `isVisible`：是否在畫面上可以被看到

程式範例如下：

```typescript
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('button') button: ElementRef;

  constructor(private interactivityChecker: InteractivityChecker) {}

  ngOnInit() {
    console.log(this.interactivityChecker.isDisabled(this.button.nativeElement));
    console.log(this.interactivityChecker.isFocusable(this.button.nativeElement));
    console.log(this.interactivityChecker.isTabbable(this.button.nativeElement));
    console.log(this.interactivityChecker.isVisible(this.button.nativeElement));
  }
}
```

在需要與不同元件互動時，透過InteractivityChecker先檢查一下，就不怕互動錯啦！

### LiveAnnouncer

這是在螢幕閱讀器上使用的一個service，可以讓螢幕朗讀器(Windows)或Voice Over(Mac)唸出指定的文字：

```typescript
@Component({ })
export class SomeComponent {

  constructor(liveAnnouncer: LiveAnnouncer) {
    liveAnnouncer.announce("Hey Google");
  }
}
```

針對需要支援相關無障礙功能的網站來說，也是個不錯的工具哩！

## 本日小結

今天我們針對Angular CDK的A11y功能做了一個大致的介紹，裡面包含了不少幫助我們與畫面互動的功能，很多的比例是針對focus狀態的處理；同時我們也看到A11y提供許多互動性的檢查，甚至針對螢幕朗讀器或Voice Over這類無障礙網頁的解決方案也提供了相關的service。這可是其他元件library很少注重的項目！只能說Angular CDK太貼心啦！！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-26-cdk-accessibility

分支：day-26-cdk-accessibility

## 相關資源

-   [Angular Material - CDK - Accessibility](https://material.angular.io/cdk/a11y/overview)
