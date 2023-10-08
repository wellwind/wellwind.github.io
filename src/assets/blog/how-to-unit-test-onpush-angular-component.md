---
title: "如何測試使用 OnPush 策略的 Angular 元件"
date: 2023-10-08 08:57:56
category: "Angular 大師之路"
tags:
  - Angular
  - OnPush
  - Testing
---

`OnPush` 策略可以打造出高效能的元件，但也會對撰寫測試程式造成一些不方便，今天就來看看有哪些方法可以幫助我們測試 `OnPush` 策略的元件吧！

<!-- more -->

## 先看看狀況

先用一個簡單的元件來做示範:

```typescript
@Component({
  selector: 'app-adder',
  template: `<div>{{ a }} + {{ b }} = {{ a + b }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdderComponent {
  @Input() a = 0;
  @Input() b = 0;
}
```

測試程式：

```typescript
describe('AdderComponent', () => {
  let component: AdderComponent;
  let fixture: ComponentFixture<AdderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdderComponent]
    });
    fixture = TestBed.createComponent(AdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add two numbers', () => {
    component.a = 1;
    component.b = 2;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1 + 2 = 3');
  });
});
```

看起來很合理，我們設定元件的 `a=1` 和 `b=2`，並預期畫面上的內容會是兩個數字的相加結果 `1 + 2 = 3`。

不過實際上執行測試時會得到以下錯誤：

```txt
Expected '0 + 0 = 0' to contain '1 + 2 = 3'.
```

奇怪，我不是指定好數字 `1` 和 `2` 了，也呼叫了 `fixture.detectChanges()` 進行變更偵測及重新渲染？怎麼會是預設的 `0 + 0 = 0`？

原來問題在元件的 `changeDetection: ChangeDetectionStrategy.OnPush` 這行，這個設定會讓元件只有在 `@Input()` 變更時才會重新渲染，而我們在測試程式中其實並沒有變更 `@Input()`，因為這是外部元件使用我們的測試目標才會有的行為，在只有單純對屬性變更 (如 `component.a = 1`) 時並不算是「`@Input()` 變更」。所以元件並沒有判斷變更，也因此畫面上的內容還是 `0` 和 `0`。

## 解決方法

解決方法蠻多種的，一個一個來

### 方法1: 使用假元件模擬對元件的使用

由於元件只有在 `@Input()` 變更時才會重新進行變更偵測以及畫面渲染，因此我們可以建立一個假元件，並將資料塞進去，來模擬實際 `@Input()` 變更的行為：

```typescript
@Component({
  template: '<app-adder [a]="a" [b]="b"></app-adder>',
})
class FakeComponent {
  a = 1;
  b = 2;
}
```

當要進行測試時，再以此 `FakeComponent` 作為測試目標，來測試畫面是否如預期：

```typescript
describe('AdderComponent (using FakeComponent)', () => {
  let component: FakeComponent;
  let fixture: ComponentFixture<FakeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeComponent, AdderComponent]
    });
    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add two numbers', () => {
    component.a = 1;
    component.b = 2;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1 + 2 = 3');
  });
});
```

這也是一直以來我自己在撰寫 `OnPush` 策略元件的測試程式時，最常使用的方法，這個方法的好處是同時可以想想我們實際上使用元件時是否合理好用，有沒有需要重構的空間；當然缺點其實也很明顯，就是麻煩。

### 方法 2: 修改變更偵測策略

上一個方法可以從測試程式中直接想像我們未來該如何使用元件，不過當情境變多時，可能要產生一堆假元件，也是蠻累的。

另一種方式是，在撰寫測試程式時，覆寫掉元件的設定，改成使用預設的變更偵測策略：

```typescript
TestBed.configureTestingModule({
  declarations: [AdderComponent],
}).overrideComponent(AdderComponent, {
  set: {
    changeDetection: ChangeDetectionStrategy.Default,
  }
});
```

如此一來就會產生使用 `ChangeDetectionStrategy.Default` 的元件，而不是 `ChangeDetectionStrategy.OnPush` 的元件，這樣就一來就可以模擬畫面變更的結果了。

{% note warning %}

這算是一種比較偷懶的方法，因為我們並沒有實際測試到 `@Input()` 變更的情境，只是單純變更屬性而已，對於比較複雜的元件，可能會有些案例漏測試，千萬要小心。

{% endnote %}

### 方法 3: 使用 `fixture.componentRef.setInput()` 參數

在動態產生元件時，我們都會得到一個 [ComponentRef](https://angular.io/api/core/ComponentRef) 物件，而在 Angular 14 後，這個物件多提供了一個 `setInput()` 方法，不僅在動態產生元件時可以直接達到 `@Input()` 變更的效果，也可以在測試程式中使用。

```typescript
it('should add two numbers', () => {
  fixture.componentRef.setInput('a', 1);
  fixture.componentRef.setInput('b', 2);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('1 + 2 = 3');
});
```

如此一來就可以輕鬆測試 `@Input()` 變更的效果啦！

唯一需要注意的是，這是 Angular 14 之後才有的功能，因此如果你的專案還是使用 Angular 13 或更早的版本，就要評估看看是不是要升級囉。

會寫這篇文章，也是因為最近後知後覺的想到 Angular 14 新的 `setInput()` API 可以幫助我們解決這個問題，就順便整理一下了。

{% note info %}

現在這個時間點都快要出 Angular 17 了，我才想到 Angular 14 提供的解決方案，真的是有夠後知後覺

{% endnote %}

## 本日小結

`OnPush` 策略可以幫助我們開發出更高效能的 Angular 元件，但在撰寫測試程式時也需要做些調整，今天分享了三種幫助我們測試 `OnPush` 策略元件的方法，可以參考看看囉！
