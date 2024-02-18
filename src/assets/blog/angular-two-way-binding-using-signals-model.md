---
title: "使用 Signal Model Input 輕鬆達成 two way binding"
date: 2024-02-15 20:17:46
category: "Angular 大師之路"
tags:
  - "Angular"
  - "Angular 17.2.0"
---

Angular 自從 17 推出 Signals 後，就持續改進，從 17.1 的 Signal Input 到現在最新的 Model Input，讓開發者可以更輕鬆的達成 two way binding！今天就來看看如何使用透過 Signal Model Input 來達成 two way binding 吧！

<!-- more -->

過去的文章我們已經介紹過兩種 two way binding 的方法，一種是使用[實作 control value accessor](https://fullstackladder.dev/blog/2018/10/23/mastering-angular-08-customize-form-control/)，這種方法雖然麻煩，但可以享受到完整的 Angular 表單支援；[另外一種](https://fullstackladder.dev/blog/2018/10/22/mastering-angular-07-simple-two-way-binding/)是實做一組 `xxxx` 的 `@Input` 屬性，以及另外一個 `xxxxChange` 的 `@Output` 事件，雖然無法支援 Angular 表單，但確實一個簡單的 two way binding 實作。

現在我們來看看如何透過 Angular 最新的 model 來達成 two way binding 吧！

```typescript
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <span>{{ counter() }}</span>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  counter = model(0);

  increment() {
    this.counter.update(counter => counter  + 1);
  }

  decrement() {
    this.counter.update(counter => counter - 1);
  }
}
```

這樣就完成了一個簡單的計數器元件，並且透過 model 來達成 two way binding，是不是非常簡單呢？

使用方式也很容易，只要在父元件中使用 `[(counter)]` 就可以了：

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-counter [(counter)]="counter"></app-counter>
    <div>{{ counter }}</div>
  `
})
export class AppComponent {
  counter = 0;
}
```

這是單純宣告一個屬性的方式，除此之外，也支援使用 `signal`:
  
```typescript
counter = signal(0);
```

同時，也能支援直接使用 `model`

```typescript
counter = model(0);
```

一個 `model` 就能輕易達成過去要宣告兩個屬性的方式，真的是太方便啦！

## 參考資源

- [Angular v17.2 is now available](https://blog.angular.io/angular-v17-2-is-now-available-596cbe96242d)
- [model](https://angular.dev/api/core/model?tab=usage-notes)
