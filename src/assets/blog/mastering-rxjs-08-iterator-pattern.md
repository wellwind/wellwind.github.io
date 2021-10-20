---
title: "[RxJS] 認識疊代器模式 - Iterator Pattern"
date: 2020-09-23 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Iterator Pattern
---

前兩天的文章中我們介紹了「觀察者模式 - Observer Pattern」，今天我們來介紹另外一個在 ReactiveX 中也很重要的觀念：「疊代器模式 - Iterator Pattern」。其實我們在寫程式時會經常遇到疊代器模式，但通常不會直接碰觸到它，而是程式語言針對疊代器模式提供了原生語法的支持，將背後的細節隱藏了起來(這也是它的目的)；大多數程式語言都提供疊代器模式整合到原生語法內，可見它有多們重要！

<!-- more -->

# 關於疊代器模式

以下文字摘取自[維基百科對於疊代器模式的介紹](https://zh.wikipedia.org/wiki/疊代器模式)：

{% note info %}

在物件導向程式設計裡，**疊代器模式**是一種設計模式，是一種最簡單也最常見的設計模式。它可以讓使用者透過特定的介面巡訪容器中的每一個元素而不用了解底層的實作。

此外，也可以實作特定目的版本的疊代器。

{% endnote %}

關於 Iterator 的中文名字，有不少版本，像是 `疊代器`、`迭代器` 或 `反覆器`，基本上聽得懂就好，這邊採用的是維基百科的中文版本。

而疊代器的重點在於「**如何走訪集合內的所有元素，並隱藏實作細節**」。

## 疊代器模式解決的問題

想想看我們平常要列出(走訪)一個陣列(集合)中所有的內容，大概會有這樣的程式碼：

```typescript
const data = ['a', 'b', 'c'];
for(let i = 0; i < data.length; ++i){
  console.log(data[i]);
}
```

然而，如果今天我的資料集合不是陣列型態，而是一個樹狀結構呢？或儘管是陣列型態，但必須有著不同的走訪規則呢？這時候當然就需要自己針對需要的資料結構或走訪規則而外撰寫程式。

雖之而來的問題是，如何共享這些規則？這就是疊代器模式要處理的問題！

## 疊代器模式的角色定義

下圖來自[英文版的維基百科](https://en.wikipedia.org/wiki/Iterator_pattern)：

{% asset_img 01.jpg %}

疊代器模式包含兩個角色：

- 疊代器 (Iterator)：用來存放集合的內容，除此之外更重要的是提供走訪集合內容的底層實作，並公開出兩個方法
    - `next()`：用來取得目前集合的下一個元素
    - `hasNext()`：用來判斷是否還有下一個元素需要走訪，當沒有下一個元素需要走訪時，代表已經完全走訪過全部的元素
- 聚合功能 (Aggregate)：用來產生疊代器實體的角色。

而實際上要走訪疊代器內的集合內容時，只需要搭配 `next()` 及 `hasNext()` 及可依照疊代器內的規則走訪所有的元素。

## 使用 JavaScript 實作疊代器模式

實作程式碼：https://stackblitz.com/edit/mastering-rxjs-08-even-odd-iterator-pattern-demo

假設我們的規則是：「針對陣列集合的走訪，依照元素索引值(index)，先依序印出偶數索引值的內容，再印出奇數索引值得內容」，

例如陣列內容為 `['a', 'b', 'c', 'd']` 時，先印出偶數索引值(0 以及 2)的內容分別為 `a, c` ，再印出奇數索引值(1 以及 3)的內容 `b, d`。

在實作疊代其實就必須針對這樣的規則來實做：

```typescript
// 先顯示偶數索引在顯示奇數索引內容的疊代器
// 參數 value 代表實際的集合內容
// any[] 是 TypeScript 的用法，代表 data 是任意型別的「陣列」
const createEvenOddIterator = (data: any[]) => {
  let nextIndex = 0;

  // 實作走訪集合的規則
  return {
    hasNext: () => {
      return nextIndex < data.length;
    },
    next: () => {
      const currentIndex = nextIndex;
      // 下一個索引值需要加 2
      nextIndex += 2;
      // 如果下一個索引值超過陣列長度，且索引值為偶數時
      // 代表偶數索引走訪完畢，跳到奇數索引的起點
      if(nextIndex >= data.length && nextIndex % 2 == 0) {
        nextIndex = 1;
      }
      // 回傳目前索引值內容
      return data[currentIndex];
    }
  };
};
```

對於實際走訪的人來說，則根本不需要知道裡面的實作內容，只要溝通好，確保疊代器有提供 `hasNext()` 和 `next()` 給我們使用就好：

```typescript
// 建立疊代器
const iterator = createEvenOddIterator(['a', 'b', 'c', 'd']);
console.log('原始資料');
console.log('開始走訪')
// 實際走訪所有元素內容，但不需要理解細節
while (iterator.hasNext()) {
  const value = iterator.next();
  console.log(value);
}
console.log('結束走訪');
```

# JavaScript 原生語法內建的疊代器

實作程式碼：https://stackblitz.com/edit/mastering-rxjs-08-even-odd-symbol-iterator-demo

在走訪陣列每一個元素時，除了 `for()` 語法外，我們也可以透過 `for of ` 語法來走訪每個元素：

```typescript
const data = ['a', 'b', 'c', 'd'];
for(let item of data) {
  console.log(item);
}
```

能夠這種語法就是一種疊代器的應用，在 JavaScript 中有許多語法都是搭配疊代器使用的，方便我們已更加簡易的方法去操作集合資料。

如果我們有自己的資料結構或走訪規則，也想要搭配 JavaScript 的語法使用呢？

```typescript
// 有辦法做到嗎？

// 使用 for of 語法
for (let item of createEvenOddIterator(['a', 'b', 'c', 'd'])) {
  console.log(item);
}

// 使用展開運算子
console.log([...createEvenOddIterator(['a', 'b', 'c', 'd'])]);
```

此時可以搭配 JavaScript 內的[疊代器 (iterater protocol) 協議](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)來實作：

```typescript
const createEvenOddIterator = (data: any[]) => {
  let nextIndex = 0;

  return {
    // 根據 iteratable protocol 實作 [Symbol.iterator] 的方法
    [Symbol.iterator]: () => {
      return {
        // 根據 iterator protocol 實作疊代器走訪規則
        next: () => {
          const currentIndex = nextIndex;
          // 下一個索引值需要加 2
          nextIndex += 2;
          // 如果下一個索引值超過陣列長度，且索引值為偶數時
          // 代表偶數索引走訪完畢，跳到奇數索引的起點
          if (nextIndex >= data.length && nextIndex % 2 == 0) {
            nextIndex = 1;
          }
          
          // 回傳走訪結果，結果為一物件，包含
          // value: 走訪到的值
          // done: 是否走訪完畢
          if (currentIndex < data.length) {
            return {
              value: data[currentIndex],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        }
      };
    }
  };
};
```

之後就可以搭配 JavaScript 原生的語法來使用囉！

{% note info %}
在 ES6 之後也可以搭配 [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 來實作，程式碼會更精簡，因為主題還是介紹 ReactiveX，而不是 JavaScript，就不花太多時間說明。有興趣可以看[我在 StackBlitz 上的 generator 實作](https://stackblitz.com/edit/mastering-rxjs-08-even-odd-generator-demo?file=index.ts)。
{% endnote %}

# ReactiveX 與疊代器模式

串流思考本身就是疊代的一種，我們可以把串流想像成就是一個大的集合，每一次事件發生的值就是集合內的一個值，而透過 operators 我們可以自由自在的操作整個串流的流向，在這種情況下我們要怎麼得到整個串流內的資料流向呢？(用疊代器的思考就是「如何走訪每次發生事件的時候？」)這就是疊代器重要的地方。而控制了整個串流走向的 operators，某種程度也是在改變走訪集合資料的方法，個人覺得也是疊代器的一種應用哩！

在 ReactiveX 的實作中，我們也可以把疊代器模式的 `next()` 想像成觀察者的 `next()`，而疊代器模式中的 `hasNext()` 就像是觀察者的 `complete()`，差異只在處理的是集合還是串流而已。

也因此在整個建立 Observable 時，其實是結合了前天提到的**觀察者模式**及今天提到的**疊代器模式**後的成果！

# 本日小結

如同文章開頭說過的，疊代器很重要的核心，但我們卻很少直接觸碰到它，在 ReactiveX 中也是一樣，怎麼走訪串流中每個事件的細節透過疊代器隱藏起來之後，我們就可以更加專注在資料的處理上囉！

明天我們會開始介紹 Functional Programming，想要把 RxJS 程式碼寫得漂亮，這也是一門必修課哩！
