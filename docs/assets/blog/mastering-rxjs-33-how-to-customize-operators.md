---
title: "[RxJS] 如何設計自己的 RxJS Operators"
date: 2020-10-18 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Operator
---

今天我們來聊點輕鬆(?)的主題 - 「如何設計出自己的 RxJS Operators」吧！

<!-- more -->

# 為何要自己設計 opereators

RxJS 提供了超過 100 個 operators，其實已經可以應用非常非常多的情境了，還需要自己設計 operator 嗎？其實我們確實是不一定需要設計 operator 的，但以下幾種狀況，可能很適合自己設計 operator。

- **單元測試**：當我們將一堆 operators 使用 `pipe` 串起來時，多多少少會需要加上一些 side effect 的程式碼，而這樣的行為會讓我們撰寫單元測試時變得更不容易，此時我們可以把 side effect 前和後的 operators 各自建立成新的 operators 獨立測試。
- **共用性**：假設我們是負責撰寫 library 的開發人員，在提供共用的功能時，我們不太可能跟使用 library 的人說：「你就去把某幾個 operators 串起來就可以啦！」，這時候就適合把共用的部分抽出來，讓其他人更容易的使用。
- **可讀性**：當功能越來越複雜時，是有可能在一個 `pipe` 裡面一口氣寫數十個 operators 的！這時候反而可能會造成閱讀上更加不易，維護上亦然。那麼將不同組的動作抽成獨立的 operators，不僅可讀性會更高，也能讓關注點再次分離。
- **重構**：我們會重構程式碼，當然也會重構 operators，將 operators 抽出成新的 operator，就跟把一段複雜的程式碼抽成一個 function 一樣。
- **真的沒有適合的 operator**：實際上應該是不太可能發生，就像陣列處理只要 `map`、`filter` 和 `reduce` 幾乎就可以完成各種變化，其他都只是讓語意更明確、使用更方便一樣；我們其實也可以透過 `map`、`filter` 和 `reduce` operators 組合出任何想要的功能才對，最多就是程式寫起來更醜更難維護而已。

接著讓我們再認識一次 RxJs 的 Operators 定義，然後進入實作吧！

# 再次認識 RxJS Operators 結構

所謂的 operator，其實就是個 curry function！在之前介紹 「RxJS 的 functional programming 文章中」，我們曾經看過 `map` 的基本結構：

```typescript
export function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R> {
 return function mapOperation(source: Observable<T>): Observable<R> {
  ...
 };
}
```

curry function 最外層是設定相關資料就不用多說了，這個 function 需要回傳一個 `OperatorFunction`，而內層的 `function mapOperation` 實際上就是回傳這個 `OperatorFunction` 且傳入參數和回傳值都是一個「Observable」，如果多看幾個 operator 的程式碼，可以發現結構都是一致的！也就是說，我們只要會定義一個「以一個 Observable 當作參數，且能夠回傳一個 Observable 的 function」，就等於時做出一個 RxJS 的 operator 囉！

以下定義一個「不做任何事情」的 operator：

```typescript
const doNothing = (source) => {
  return source;
}
```

實際使用：

```typescript
source$ = from(1, 2, 3, 4);
source$.pipe(
  doNothing
);
```

就是這麼簡單，當我們產生訂閱 (subscribe) 時，RxJS 就會把來源 Observable (`source$`)，當作參數去呼叫 `doNothing` 這個自訂的 operator，再將會傳的 Observable 傳入下一個 operator，直到最後。

如果需要定義「有參數」的 operator，寫個 curry function 就好了：

```typescript
const doSomething = (args) => {
  return (source) => {
	  return source;
  };
};
```

很簡單吧！接著就是在 function 裡面加上變化，讓回傳的 Observable 更佳符合握們的需求啦。

# 兩種自訂 Operator 的方法

在之前介紹 map 的文章中，我們舉了個例子，「將學生分數調整成開根號後乘以 10，並指顯示及格的學生」，我們就來嘗試看看如何將這樣的邏輯抽成自訂的 operator 吧！

## 直接串現有的 operators

既然 operator 的邏輯是將現有的 Observable 參數轉換成一個新的 Observable，那麼最簡單的方式當然是將傳入的 Observable 參數搭配現有的 operators，產生一個新的 Observable 回傳啦！

```typescript
const adjustAndFilterPassScore = () => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      map(score => Math.sqrt(score) * 10),
      filter(score => score >= 60)
    )
  }
};
```

如果單純使用 function 時，可以寫成：

```typescript
const scores$ = of(0, 16, 36, 49, 100);
adjustAndFilterPassScore()(sources$).subscribe();
```

當然，有了 `pipe` 我們就不會這樣寫啦！使用 `pipe` 的寫法：

```typescript
const scores$ = of(0, 16, 36, 49, 100);
score$.pipe(
  adjustAndFilterPassScore()
);
```

我們也可以將「調整成績」和「過濾成績」兩個行為拆開成兩個各自的 operator，最後再組合起來：

```typescript
const adjustScore = () => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      map(score => Math.sqrt(score) * 10)
    )
  }
};

const filterPassScore = () => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      filter(score => score >= 60)
    )
  }
};

const adjustAndFilterPassScore = () => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      adjustScore(),
      filterPassScore()
    )
  }
};

of(0, 16, 36, 49, 100)
  .pipe(
    adjustAndFilterPassScore()
  ).subscribe(score => {
    console.log(`自訂 operator 示範 (1): ${score}`);
  });
// 60
// 70
// 100
```

看起來程式碼好像變多了，但其實是讓 operator 要專注的事情更少了，未來維護上會更加容易喔！

如果需要加上指定及格分數呢？很簡單！curry function 是個好東西！！

```typescript
const filterPassScoreBy = (passScore: number) => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      filter(score => score >= passScore)
    )
  };
};

const adjustAndFilterPassScoreBy = (passScore: number) => {
  return (source$: Observable<number>) => {
    return source$.pipe(
      adjustScore(),
      filterPassScoreBy(passScore)
    );
  };
};

of(0, 16, 36, 49, 100)
  .pipe(
    // 指定及格成績
    adjustAndFilterPassScoreBy(70)
  ).subscribe(score => {
    console.log(`自訂 operator 示範 (2): ${score}`);
  });
// 70
// 100
```

很容易吧！

程式碼：https://stackblitz.com/edit/mastering-rxjs-customize-operators-by-piping-other-operators

## 從新的 Observable 開始

另外一種自訂 operator 的方法，就是從一個新的 Observable 開始，這麼做的好處是具有更大的彈性，不過就需要更全面地進行考量囉！一樣拿上述的例子來看，中間的各種觀念就省略了，直接看看程式碼：

```typescript
const adjustAndFilterPassScoreBy = (passScore: number) => {
  return source$ => {
    // 建立新的 Observable
    return new Observable(subscriber => {
      // 訂閱來源 Observable
      // 並建立觀察者 Observer 來處理來源 Observable 的各種事件
      source$.subscribe({
        next: score => {
          // 成績轉換
          const newScore = Math.sqrt(score) * 10;
          // 判斷成績決定要不要產生新事件
          if (newScore >= passScore) {
            // 及格，產生新事件
            subscriber.next(newScore);
          }
        },
        // 也要處理 error 和 complete 事件
        error: error => subscriber.error(error),
        complete: () => subscriber.complete()
      });
    });
  };
};
```

第 4 行程式建立並回傳一個新的 Observable，因此所有發生事件的時機就可以在裡面的 callback function 內自行決定；由於 `source$` 是我們的資料來源，因此在第 7 行程式直接訂閱它，並建立一個 Observer 來處理 `source$` 訂閱的 `next()`、`error()` 和 `complete()` 事件，當來源 Observable 有新的 `next()` 事件時，依照我們自定義的邏輯來處理

- 第一步進行成績轉換
- 第二部判斷是否及格，及格才讓新的 Observable 產生事件

另外要注意的是，雖然我們只專注在 `next()`，但 `error()` 和 `complete()` 也需要處理，在來源 Observable 發生錯誤或完成時，後續的 operators 或實際訂閱的 Observer 才會知道有事情發生了！

程式碼：https://stackblitz.com/edit/mastering-rxjs-custom-operator-by-new-observable

{% note info %}

這種從新的 Observable 開始處理的方式，也是許多 RxJS operators 底層實際處理的方式。

{% endnote %}

# 本日小結

今天我們學會了如何建立出屬於自己的 RxJS operators，各自有好有壞：

- 直接轉現有的 operators：簡單易懂，宣告式 (declarative) 的程式碼也好閱讀；雖然可以滿足大部分的需求了，但缺乏一點彈性
- 使用新的 Observable：具有最大彈性，但程式碼變成指令式 (imperative) 的了，需要更小心撰寫出好讀好維護的程式碼，同時也必須自行處理 Observer 內所有的事件。

學會自訂 operators，就能寫出更加漂亮的 RxJS 程式碼囉！
