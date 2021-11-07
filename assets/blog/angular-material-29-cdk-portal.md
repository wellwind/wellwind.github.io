---
title: "[Angular Material 完全攻略]Angular CDK(5) - Portal"
date: 2018-01-16 15:39:19
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

接下來我們要介紹Angular CDK中的Portal分類，透過這裡面的功能，我們可以很容易的動態切換各種不同的元件和templates，讓動態產生內容不再是件麻煩的事情！

其實在Angular中，我們已經能夠使用`<ng-container>`搭配`ngTemplateOutlet`或`ngComponentOutlet`來切換不同的template或component了，而Angular CDK的Portal可以想像成是它的簡單好用加強版！甚至我們可以透過Portals裡面的功能，把元件放在整個Angular程式的控制範圍之外，但元件依然還在Angular的控制內，非常的強大！

就讓我們繼續往下看吧！！

<!-- more -->

## 開始使用Angualr CDK的Portal

Angular CDK中的Portal類別中提供了一些方便的directives和services，用來產生動態的內容，使用前要先加入`PortalModule`：

```typescript
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  exports: [
    PortalModule
  ]
})
export class SharedMaterialModule {}
```

### 基本知識

在使用Portal相關功能之前，有兩個簡單名詞要先介紹：

-   **Portal**：真正要被切換的內容，這些內容會用Portal包起來，如果要切換的內容是一個template reference，則會使用`TemplatePortal`；如果是元件(component)，則使用`ComponentPortal`。
-   **PortalOutlet**：實際放置內容的地方，**如果Portal是插頭，那麼PortalOutlet就可以想像成是插座**。

接著我們來實作一個簡單的Tab功能，說明Portal如何動態切換內容！

### 使用cdkPortalOutlet

我們先設計好要放置插座的地方，也就是PortalOutlet，這裡我們設計了一個如下的畫面

```html
<div class="portal-demo">
  <div class="tabs">
    <button mat-button (click)="changePortal1()">功能1</button>
    <button mat-button (click)="changePortal2()">功能2</button>
    <button mat-button (click)="changePortal3()">功能3</button>
    <button mat-button (click)="changePortal4()">功能4</button>
  </div>
  <div class="tab-content">
    <div [cdkPortalOutlet]="currentPortal"></div>
  </div>
</div>
```

其中的`[cdkPortalOutlet]="currentPortal"`就是我們插座放置的位置，接著我們要在程式中宣告一下這個插頭`currentPortal`：

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  currentPortal: Portal<any>;
```

之後只要替換掉插頭，就可以切換不同內容顯示囉。

### 使用cdkPortal directive

cdkPortal是一個簡單的directive，其實就是`TemplatePortal`衍生的directive版本，透過這個directive，我們可以很容易的透過`@ViewChild`或`@ViewChildren`取得畫面上的portal。

`cdkPortal`需要放在`<ng-template>`裡面：

```html
<ng-template cdkPortal>
  <p>
    功能1：我放在ng-template + cdkPortal = TemplatePortal裡面
  </p>
</ng-template>
```

當然，這種語法也能換成語法糖asterisk(*)的方式：

```html
<p *cdkPortal>
  功能2：我放在一般的HTML Element內，加上cdkPortal後變成了一個TemplatePortal
</p>
```

一般的`<ng-template>`不要加上`cdkPortal`可以嗎？當然可以，只是需要再加工一下，我們先擺上來：

```html
<ng-template #template>
  功能3：我放在ng-template內，但不是TemplatePortal，要用我要記得先包裝一下
</ng-template>
```

cdkPortal的用法就這樣，很簡單吧！

### 切換不同的cdkPortalOutlet內容

接下來我們要在程式中動態切換`cdkPortalOutlet`的內容，使用`cdkPortal`的話，一切都簡單很多：

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  @ViewChildren(CdkPortal) templatPortals: QueryList<CdkPortal>;
            
  changePortal1() {
    this.currentPortal = this.templatPortals.first;
  }

  changePortal2() {
    this.currentPortal = this.templatPortals.last;
  }
}
```

只要把加上`cdkPortal`的直接設定就好啦！

至於一般的`TemplateRef`該怎麼辦呢？只要把它用TemplatePortal包裝起來就好啦！

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  @ViewChild('template') template3: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) {}
  ...
  changePortal3() {
    // 使用TemplatePortal把一般的TemplateRef包裝起來
    this.currentPortal = new TemplatePortal(this.template3, this.viewContainerRef);
  }
}
```

這時候就可以來看看結果啦！

{% asset_img 01-template-portal-basic.gif %}

一個簡單的tab功能就這樣完成啦！

### 在cdkPortalOutlet中放置元件(component)

剛剛我們示範了一般的template放到PortalOutlet的方法，但template只會放在一般的HTML內，不像元件(component)那麼容易被重複使用，有沒有辦法放置元件呢？答案當然是可以，只要把元件包裝成`ComponentPortal`就可以囉！

```typescript
changePortal4() {
  this.currentPortal = new ComponentPortal(Portal4Component);
}
```

{% note info %}

**溫馨提醒**：老樣子，動態產生的元件記得加入entryComponents。

{% endnote %}

成果如下：

{% asset_img 02-component-portal-basic.gif %}

簡單的不得了吧！

### 為Portal加入其他外部內容

到目前為止，我們已經學會如何輕易且動態的切換內容，但是實務上常常未必那麼簡單，我們必須讓切換的template或component能夠理解外部的狀態，因此必須**傳入一些外部資訊給裡面的template或component**，越複雜的程式越有可能需要這麼做，那麼要如何才能夠加入其他內容呢？

#### 為template加入其他外部內容

在我們建立`TemplatePortal`時，會需要3個參數，分別是：

-   `template: TemplateRef<any>`：要傳入的template的參考
-   `viewContainerRef: ViewContainerRef`：畫面上的`ViewContainerRef`，來源可由注入取得
-   `context?: any`：要傳入的外部內容。

因此我們可以在自行建立TemplatePortal時，使用`context`參數，決定要傳入的資訊：

```typescript
changePortal3() {
  // 使用TemplatePortal把一般的TemplateRef包裝起來
  this.currentPortal = new TemplatePortal(this.template3, this.viewContainerRef, { nameInObject: this.name});
}
```

這裡我們在第3個參數`context`傳入了要加入的內容，接著在`<ng-template>`上，我們就可以使用`let-xxx="yyy"`的方式，來取得我們的資訊：

```html
<ng-template #template let-nameInTemplate="nameInObject">
    Hi，{{ nameInTemplate }}，功能3：我放在ng-template內，但不是TemplatePortal，要用我要記得先包裝一下
</ng-template>
```

{% note info %}

你可能會問為什麼不直接用`{{ name }}`就好了，實際上這樣是最快的方法沒錯，但有時候要傳入的可能是整理後比較複雜的資料，不一定有一個現成的變數放在那邊可以接，就會有需要囉。

{% endnote %}

`let-nameInTemplate="nameInObject"`可以想像成是宣告成javascript的`let nameInTemplate = context.nameInObject`，只是在畫面上無法這樣直接寫而已。

結果如下：

{% asset_img 03-inject-data-to-template-portal.gif %}

如果是加入`cdkPortal`的元素呢？只需要設定它的`context`屬性即可：

```typescript
this.templatPortals.first.context = { nameInObject: this.name };
```

#### 為component注入其他內容

跟使用template不太一樣的是，我們的第三個參數必須是一個`Injector`，而在component時必須透過注入取得資訊，因此會比較複雜一點，我們接著來看看如何實作吧！

##### 建立要注入的Token

```typescript
export const PORTAL4_INJECT_DATA = new InjectionToken<any>('portal4-inject-data');
```

這個`PORTAL4_INJECT_DATA`就會是我們之後要注入資料的依據。

##### 建立包含自訂Token的PortalInjector

如以下程式，我們寫了一個`_createInjector`，來把我們想要注入的token，和當前的`Injector`，合併成一個新的`PortalInjector`

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  name : string;
  
  constructor(private viewContainerRef: ViewContainerRef, private injector: Injector) {}
  ...
  private _createInjector(): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(PORTAL4_INJECT_DATA, this.name);
    return new PortalInjector(this.injector, injectionTokens);
  }
}
```

##### 將PortalInjector加入ComponentPortal

之後，在建立ComponentPortal時，只需要把這個`PortalInjector`也傳入即可

```typescript
changePortal4() {
    const portalInjector = this._createInjector();
    this.currentPortal = new ComponentPortal(Portal4Component, undefined, portalInjector);
  }
```

建立ComponentPortal的第二個參數一樣是`ViewContainerRef`，但這只有在Angular的管理範圍外建立動態元件的時候，需要一個來源`ViewContainer`，如何在Angular範圍外動態建立元件呢？稍後我們會在`DomPortalOutlet`介紹。

所以這裡我們不用傳入，只要傳入`undefined`即可。

而在Component內，則可以直接透過注入`PORTAL4_INJECT_DATA`，來取得對應的資料：

```typescript
@Component({ ... })
export class Portal4Component implements OnInit {
  get name() {
    return this.data.nameInObject;
  }

  constructor(@Inject(PORTAL4_INJECT_DATA) private data: any) {}

  ngOnInit() {
  }
}
```

這時候畫面上就可以直接使用啦！

{% asset_img 04-inject-data-to-component-portal.gif %}

### 在程式中控制cdkPortalOutlet

我們也能在程式中直接控制cdkPortalOutlet要顯示什麼樣的資料，原來的畫面只要找得到`cdkPortalOutlet`的reference就好：

```html
<div cdkPortalOutlet #portalOutlet="cdkPortalOutlet"></div>
```

接著就可以在程式中直接使用啦！

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  @ViewChild('portalOutlet') portalOutlet: CdkPortalOutlet;
            
  changePortal2() {
    this.portalOutlet.attach(portalOutlet);
  }
}
```

`CdkPortalOutlet`有以下幾個主要方法：

-   `attach()`：附加一個Portal上去，可以是ComponentPortal，也可以是TemplatePortal
-   `attachComponentPortal()`：附加一個ComponentPortal
-   `attachTemplatePortal()`：附加一個TemplatePortal
-   `deatch()`：把目前附加的Portal拿掉
-   `hasAttached()`：用來檢查目前是否有任何Portal被附加上去了

### 使用DomPortalOutlet

`DomPortalOutlet`是一個很有趣的插座，他可以幫助我們把插座產生在Angular的管理範圍內，以一般的Angular程式來說，就是`<app-root>`之外，聽起來很不可思議吧！立刻來看看該怎麼做吧！

#### 注入必要條件

說穿了，DomPortalOutlet就是操作DOM來做些事情，以及把產生的內容丟到一個`<app-root>`外的插座上，但其實它還是在管理範圍內，只是不住在`<app-root>`裡面而已，因此在建立時，還是需要把可以管理他的範圍界定起來，這些也是DomPortalOutlet要建立時所相依的類別：

```typescript
@Component({ ... })
export class MainComponent implements OnInit {
  domPortalOutlet: DomPortalOutlet;

  constructor(
	@Inject(DOCUMENT) private document: any,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {}
```

以上在建構式注入的，除了document以外，都是建立`DomPortalOutlet`的必要條件，那麼注入`document`到底是用來幹嘛的呢？我們要使用這個物件來建立插座。

#### 在app-root外建立插座

因為超過`<app-root>`的範圍，因此伸手直接去摸DOM基本上是不可避免的，我們可以直接用`document`來操作DOM，但在這裡我們卻另外注入了一個document的DOCUMENT token(有點饒舌)，這是為什麼呢？

一般情況下，我們注入的`document`，在網頁上其實就是`window.document`，但Angular是一個可以跨不同平台的設計，因此到了其他平台，就不一定了，另外在撰寫單元測試時，為了避免單元測試下只有JavaScript而沒有DOM，中間墊了一層也是比較好的！也因為如此，雖然我們可以直接使用`window.document`，但還是選擇了使用注入的方式，來隔離相依。

有了這樣的概念後，我們就來建立一個插座吧！

```typescript
createOutletOutOfApp() {
  const element = this.document.createElement('div');
  element.innerHTML = '<br>我在&ltapp-root&gt;之外';
  this.document.body.appendChild(element);
  this.domPortalOutlet = new DomPortalOutlet(element, this.componentFactoryResolver, this.appRef, this.injector);
}
```

在這邊的程式我們直接建立一個`<div>` element，並把它附加到`document.body`，也就直接脫離了`<app-root>`，這是一般JavaScript的寫法，指示document有被我們墊了一層而已。

之後我們再使用`new DomPortalOutlet()`把這個element變成可以被管理的插座。

從這樣的程式不難發現，我們不僅可以建立`<div>`，也能透過`getElementById()`等等的方式，把`<app-root>`之外的某個現有HTML，直接變成插座，來插入我們想要的元件，光用想的就覺得潛力無窮啊！

#### 替外部插座插入內容

建立插座後，要插入內容就簡單多啦！我們可以使用`attachTemplatePortal()`來插入TemplatePortal，或是使用`attachComponentPortal()`來插入ComponentPortal，使用方法跟我們之前使用`PortalOutlet`一模一樣！

```typescript
addTemplatePortal() {
  this.domPortalOutlet.attachTemplatePortal(this.templatPortals.last);
}
```

直接來看看結果吧！

{% asset_img 05-dom-portal-outlet.gif %}

當我們按下產生插座時，在`<app-root>`外產生了一個插座；按下插入內容後，就把我們想要的Portal插進來啦！

#### 使用情境

在Angular Material中的Dialog，顯示dialog時會有一個backdrop，為了避免這個backdrop被其他元件畫面干擾，設計時就是使用DomPortalOutlet的技巧，在`<app-root>`範圍外的一個Overlay上(關於Overlay，是另外一個Angular CDK功能，明天會介紹)建立插座，再把dialog放在上面，如下圖：

{% asset_img 06-dialog-dom-portal-outlet-sample.png %}

簡單的程式碼片段如下：

```typescript
@Injectable()
export class Overlay {
  private _createPaneElement(): HTMLElement {
    const pane = this._document.createElement('div');

    pane.id = `cdk-overlay-${nextUniqueId++}`;
    pane.classList.add('cdk-overlay-pane');
    this._overlayContainer.getContainerElement().appendChild(pane);

    return pane;
  }

  private _createPortalOutlet(pane: HTMLElement): DomPortalOutlet {
    return new DomPortalOutlet(pane, this._componentFactoryResolver, this._appRef, this._injector);
  }
}
```

可以看到只要是超過`<app-root>`以外的元件顯示應用，都很適合使用`DomPortalOutlet`呢！

## 本日小結

今天我們介紹了Angular CDK中動態顯示不同畫面的功能－Portal，透過`cdkPortal`與`cdkPortalOutlet`，要動態切換不同的template變成了一件簡單的事情；若要動態切換component，也只需要簡單的程式碼即可達成。同時我們也學到如何讓動態的template和component如何與外界溝通，在比較複雜的應用時會非常需要。

如果我們需要在`<app-root>`之外動態切換不同的template或component，也能夠使用`DomPortalOutlet`達成！這是一個非常酷，**讓SPA超過SPA**！不再被一個範圍限定死，能夠動態的把功能延伸的管理範圍之外，又同時不會失去控制，讓我們在設計時更加的有彈性！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-29-cdk-portal

分支：day-29-cdk-portal

## 相關資源

-   [NgTemplateOutlet](https://angular.io/api/common/NgTemplateOutlet)
-   [NgComponentOutlet](https://angular.io/api/common/NgComponentOutlet)
-   [Angular Material - CDK - Portal](https://material.angular.io/cdk/portal/overview)
