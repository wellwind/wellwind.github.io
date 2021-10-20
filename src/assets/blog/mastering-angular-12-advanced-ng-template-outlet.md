---
title: "[Angular 大師之路] *ngTemplateOutlet 與 ng-template 的完美組合"
date: 2018-10-27 22:01:09
category: "Angular 大師之路"
tags:
  - Angular
  - "*ngTemplateOutlet"
  - ng-template
---

昨天我們稍微提到了 `<ng-template>` ，並說明了可以把 `<ng-template>` 當作是一種樣板上等著被呼叫的方法(function)，這時候應該會有兩個問題是：

1. 只有在 `*ngIf` 的 `else` 中可以使用嗎？
2. 既然是方法，是否可以帶入參數呢？

今天介紹的 `*ngTemplateOutlet` 可以幫助我們解答這些問題！

<!-- more -->

**類型**：技巧

**難度**：4 顆星

**實用度**：4 顆星

# 使用 *ngTemplateOutlet

`*ngTemplateOutlet` 顧名思義，就是用來放置 template (也就是 `<ng-template>` 的地方)，這個概念就跟 `<router-outlet>` 的想法是類似的，在 Angular 的命名中，當我們看到 `xxxOutlet`，都能想像成它是個放置某個東西的地方！

使用方式其實很簡單，如下：

```html
<ng-template #data>
  Hello World
</ng-template>

<div *ngTemplateOutlet="data"></div>
```

在上述程式中，我們使用 `<ng-template>` 並設定一個名為 `data` 的樣板參考變數，來代表這個樣板，而在要使用這個樣板的地方使用 `*ngTemplateOutlet=data` 的方式，來決定顯示這個樣板！

我們可以想像成，透過 `*ngTemplateOutlet` 來決定要呼叫某個樣板上名為 `data` 的樣板方法，因此我們可以在這個樣板上的任何地方，放上 `*ngTemplateOutlet` 來顯示某個樣板，把重複的樣版內容抽出來，設計上就會更加靈活。

# 使用 ngTemplateOutletContext 帶入參數

下一個問題是，既然要把 `<ng-template>` 想像成是一個方法，我們能夠帶入參數嗎？答案當然是可以的，在使用 `*ngTemplateOutlet` 時，可以加上 `context` 代表要傳入 `<ng-template>` 的參數，如下：

```html
<div *ngTemplateOutlet="data; context: {$implicit: {value: 1}}"></div>
```

在上面程式中，我們在指定要呼叫的樣板後，使用 `context`，並帶入一個物件 `{$implicit: {value: 1}}`，這個 `$implicit` 是一個固定用法，當使用帶入一個物件並有個 `$implicit` 的屬性時，後面的內容就會被當作 `<ng-template>` 帶入的預設參數。

而在 `<ng-template>` 內該怎麼接受這個參數呢？我們只需要使用 `let-xxx` 的方式，想像是宣告一個變數名稱，會傳入 `context` 內物件的 `$implicit` 內的屬性：

```html
<ng-template #data let-input>
  {{ input | json }}
</ng-template>

<div *ngTemplateOutlet="data; context: {$implicit: {value: 1}}"></div>
```

這裡我們使用 `let-input`，讓 `<ng-template>` 內有個 `input` 變數，並把它以 json 的格式顯示，我們就可以預期會顯示 `{value : 1}` 的資料囉。

## ng-template 傳入多個參數

當然，我們要傳入多個參數也不是問題，`$implicit` 只是代表當設定 `let-xxxx` 時，有個預設傳入的值而已，實際上它等於 `let-xxx="$implicit"`，因此當我們有其他的參數時，也可以直接放到 `context` 裡面：

```html
<div *ngTemplateOutlet="data; context: {$implicit: {value: 1}, another: {value: 2}}"></div>
```

上面除了 `$implicit` 外，又額外多了個屬性 `another`，那麼要怎麼接收這個屬性呢？就可以用 `let-xxx="another"` 的方法，如下：

```html
<ng-template #data let-input let-another="another">
  <div>{{ input | json }}</div>
  <div>{{ another | json }}</div>
</ng-template>

<div *ngTemplateOutlet="data; context: {$implicit: {value: 1}, another: {value: 2}}"></div>
```

是不是非常方便啊！

# 實際應用看看吧

有了上面的觀念後，我們來實做看看一個類似輪播的效果吧！

假設我們有 3 個等著被輪播的 template 如下：

```html
<ng-template>
  Page 1
</ng-template>
<ng-template>
  Page 2
</ng-template>
<ng-template>
  Page 3
</ng-template>
```

這時候我們可以替每個 `<ng-template>` 都加上名稱，接著在 `*ngTemplateOutlet` 呈現不同的內容，但這樣總是有點不靈活，這時候我們可以建立一個 directive，並掛在每個 `<ng-template>` 上，之後在程式內就可以使用 `@ViewChildren` 的方式，拿到這些 `<ng-template>` 囉！

首先我們先建立一個 directive：

```typescript
@Directive({
  selector: '[appCarouselPage]'
})
export class CarouselPageDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}
```

在這裡面我們注入 `TemplateRef` (從 `@angular/core` )，代表 directive 所在的宿主元素樣板，並將它設為 `public`，以便拿到 directive 時同時可以拿到所屬的宿主元素樣板。

接著在畫面上掛上這個 directive：

```html
<ng-template appCarouselPage>
  Page 1
</ng-template>
<ng-template appCarouselPage>
  Page 2
</ng-template>
<ng-template appCarouselPage>
  Page 3
</ng-template>
<div *ngTemplateOutlet="displayPage"></div>
```

在 `*ngTemplateOutlet` 內放置了一個 `displayPage` 變數，接著我們就要在程式中決定這個變數要放置哪個樣板：

```typescript
export class AppComponent implements AfterViewInit {
  @ViewChildren(CarouselPageDirective) carouselPages: QueryList<CarouselPageDirective> 
  displayPage: TemplateRef<any>;
  index = 0;

  setDisplayPage(index) {
    this.displayPage = 
      this.carouselPages.find((item, index) => index === this.index).templateRef;
  }

  ngAfterViewInit() {
    this.setDisplayPage(this.index);
  }
}
```

上面程式我們使用 `@ViewChildren` 取得樣板上所有掛著 `CarouselPageDirective` 的 directive，並在 `ngAfterViewInit` 的生命週期內，將取得的所有 directives 的第一筆，設定給要顯示資料的 `displayPage` 變數，此時畫面上就能顯示 `Page 1` 的樣板囉！

{% note info %}

如果不知道為什麼要在 `ngAfterViewInit` 取得這些 directives，可以回去看看之前[介紹生命週期](https://wellwind.idv.tw/blog/2018/10/19/mastering-angular-04-life-cycles/)的文章

{% endnote %}

之後我們可以再補上輪播的程式，例如：

```typescript
  next() {
    this.index = (this.index + 1) % this.carouselPages.length;
    this.setDisplayPage(this.index);
  }
```

就可以達到不斷輪播每個 `<ng-template>` 的效果啦！

若要帶入參數，也非常容易，如下：

```html
<ng-template appCarouselPage let-bg="background">
  <span [style.background-color]="bg">Page 1</span>
</ng-template>
<ng-template appCarouselPage let-bg="background">
  Page 2
</ng-template>
<ng-template appCarouselPage let-bg="background">
  Page 3
</ng-template>
<div *ngTemplateOutlet="displayPage; context: {background: backgroundColor}"></div>
<button (click)="next()">Next</button>
<button (click)="setBackground()">Set Blue Background</button>
```

最終效果參考如下：

{% asset_img 01.gif %}

原始碼位置：

https://stackblitz.com/edit/ironman2019-ngtemplateoutlet?file=src/app/app.component.html

# 本日小結

今天我們更加徹底的學習了如何使用 `<ng-template>` 的技巧，我們可以使用 `*ngTemplateOutlet` 來決定顯示什麼 `<ng-template>` ，當需要有點變化時，也可以搭配 `context` 傳入不同的參數！並搭配了自訂 directive 的方法，實際做了個小玩具。有了這些彈性的功能，我們在開發樣板時，就能更加有彈性，架構也會更加漂亮，雖然要額外學一點語法，但絕對是非常值得啊！

# 相關資源

- [ngTemplateOutlet](https://angular.io/api/common/NgTemplateOutlet)
