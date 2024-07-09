---
title: "[RxJS] 如何替 RxJS 撰寫測試 - 一般測試與彈珠圖測試方法"
date: 2020-10-20 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Testing
  - "Marble Diagrams"
---

今天我們來聊聊如何撰寫測試程式來確保寫出來的 RxJS 如我們所想的一般運作，也就是撰寫測試程式碼！撰寫測試程式是軟體開發中非常重要的一環，雖然不是所有程式碼都一定要有對應的測試程式，但良好的測試程式卻可以幫助我們撰寫住更加穩固的程式碼。

至於到底該怎麼測試 RxJS？撰寫 RxJS 測試程式時又有什麼需要注意的呢？就讓我們繼續看下去吧！

<!-- more -->

# 範例專案說明

這邊假設大家對於撰寫前端測程式已經有一定理解和經驗了，就不多說明基本的撰寫測試方法了；接下來我們撰寫的測試程式都是運行在 [Karma](https://karma-runner.github.io/latest/index.html) + [Jasmine](https://jasmine.github.io/) 上，原始檔如下：

https://github.com/wellwind/rxjs-marble-testing-demo

當然，想要用其他測試框架也是完全 ok 的喔！

只要專案下載下來後執行 `npm install` 安裝相關套件，接著執行 `npm run test` 即可看到所有測試程式執行的結果。

## 專案結構

範例專案內多數都是些基本的設定如使用套件、TypeScript 設定等等，另外有兩個重要的目錄：

- `src`：所有要測試的目標程式碼所在的位置
- `test`：所有針對測試目標所撰寫的測試程式碼

## 測試目標

在 RxJS 中，基本上有兩件事情要測試，分別是

- Observable 訂閱得到的結果是否正確
- Observable 資料流動的過程是否正確

在範例專案中，我們設計了幾種 Observable，有些很好測試，有些則相對沒那麼簡單：

```typescript
export const emitOne$ = of(1);
export const emitOneToFour$ = of(1, 2, 3, 4);
export const emitOntToFourPerSecond$ = timer(0, 1000).pipe(
  take(4)
);
```

另外我們也設計了一個 operator：

```typescript
export const plusOne = () 
  => (source$: Observable<number>) 
	=> source$.pipe(map(value => value + 1));
```

這個 operator 內容很簡單，將輸入的資料加一而已，主要是拿來測試整個資料流是否能依照我們設計的 operator 流動。

另外，我們在前幾天[實戰介紹「自動完成」功能](https://fullstackladder.dev/blog/2020/10/16/mastering-rxjs-31-practicing-autocomplete-search-sort-pagination/)時，有透過組合好幾個 operators 來讓資料查詢不要那麼頻繁，我們也將它抽成一個比較複雜一點的 operator 來測試看看：

```typescript
export const debounceInput = () 
  => (source$: Observable<string>) 
    => source$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(data => data.length >= 3)
    );
```

接著就讓我們來看看兩種不同的測試手法，一種很簡單，但比較難測試各種情境；另外一種比較複雜，但可以應付幾乎所有情境的測試。

# 在 subscribe callback 內進行測試

第一種方法很簡單，這種手法在「同步 Observable」或是「非同步 Observable 但有明確結束時機點」兩種狀況時適合使用，也不用想太多，直接在 `subscribe` 的 callback 方法內測試結果即可。

測試程式碼請參考範例專案內的 `test/subscribe-test.spec.ts`。

## 單一事件值的 Observable 測試

針對 `of(1)` 這種只有一個事件值的測試程式可以很容易的直接在 `subscribe` 內進行驗證：

```typescript
// const emitOne$ = of(1);
it('測試單一個事件的 Observable', () => {
  emitOne$.subscribe(data => {
    expect(data).toEqual(1);
  });
});
```

非常簡單吧！

## 多個事件值的 Observable 測試

那麼如果來源 Observable 有多個事件值呢？`expect(data)` 後面該怎麼寫？這時我們可以在 `subscribe` 時將訂閱值存起來，再測試結果：

```typescript
// const emitOneToFour$ = of(1, 2, 3, 4);
it('測試多個事件的 Observable', () => {
  const actual: number[] = [];
  emitOneToFour$.subscribe(data => {
    actual.push(data);
  });
  expect(actual).toEqual([1, 2, 3, 4]);
});
```

上述程式第 4 行將每次事件資料存到 `actual` 陣列中，接著在第 7 行比較結果。由於整個 Observable 是「同步執行」的，因此可以確定所有事件都發送完畢，直到 Observable 結束後才進行比較。

## 非同步 Observable 測試

如果是「非同步執行」的 Observable 如 `timer` 處理呢？那就先要看測試框架是否支援非同步處理了，以 Jasmine 來說可以在測試 function 內傳入一個 `done` 的 function，並在非同步程式中測試完畢後呼叫它代表非同步程式結束：

```typescript
// const emitOntToFourPerSecond$ = timer(0, 1000).pipe(
//   take(4)
// );
it('測試非同步處理的 Observable', (done) => {
  const actual: number[] = [];
  emitOntToFourPerSecond$.subscribe({
    next: data => {
      actual.push(data);
    },
    complete: () => {
      expect(actual).toEqual([0, 1, 2, 3]);
      done();
    }
  });
});
```

上述程式第 8 行在 `subscribe` 中的 `next()` 將來源資料存入陣列，直到 Observable 結束後，在 `complete()` 內驗證測試結果，並呼叫 `done()` 告知測試框架「非同步處理的程式碼測試完畢」。

這種方式看起來合理，但上面程式碼實際上有一些缺點

- 來源 Observable 到結束會等待 3 秒鐘，如果程式內有許多類似的 Observable 要測試，就會讓整體測試時間拉長
- 大部分測試框架在處理非同步時，都會給一個等待時間，逾時就會自動失敗，以 Jasmine 來說預設是 5 秒鐘，也就是 Observable 會需要超過 5 秒鐘的話，必須另外設定拉長等待時間
- 如果是一個不會結束的 Observable 呢？雖然我們也可以在程式中主動加上 `take()` operator 或想辦法加上其他條件讓它結束，但那就變成在寫程式而不是寫測試了，因此不是個推薦的解法

這些問題，在之後介紹「彈珠圖測試」時會解決。

## Operator 測試

如果要測試某個自訂的 operator 是否如我們預期處理資料流，只需要準備一個來源 Observable 並搭配 `pipe` 將資料傳入我們自訂的 operator 即可：

```typescript
// const plusOne = () 
//   => (source$: Observable<number>) 
//     => source$.pipe(map(value => value + 1));
it('使用 pipe 測試 operator', () => {
  of(1).pipe(
    plusOne()
  ).subscribe(data => {
    expect(data).toEqual(2);
  });
});

it('單獨測試一個 operator', () => {
  const source$ = of(1);
  plusOne()(source$).subscribe(data => {
    expect(data).toEqual(2);
  });
});
```

有兩種測試方式，其實是一樣的概念，第一種是把它真的當作 operator，以操作 operator 的方式處理，因此第 5 行使用 `of(1).pipe(...)` 的方式，來確認資料流向及處理。

而第二種測試是把它當作一個 function，因為 operator 其實就是一個 function 而已，所以第 14 行我們呼叫這個 `plusOne` function 後，會得到一個參數和回傳值都是 Observable 的 function，再把我們的來源 Observable 當參數傳入，然後訂閱測試結果。

# Marble Testing 彈珠圖測試

上一段落我們單純的使用測試框架提供的功能來進行測試，已經足以應付不少情境了，但還是有些情境不是那麼適合，因此 RxJS 提供了一個 **TestScheduler** 測試工具，來協助我們以更直覺、圖像的方式處理各種同步、非同步的 RxJS 程式碼！

{% note info %}

Scheduler 是用來「安排」事件發生時機點的工具，而 TestScheduler 就是其中一種，這種 Scheduler 可以幫助我們處理測試中遇到的各種問題。

關於 Scheduler，可以參考之前的文章「[[RxJS] 認識 Scheduler](https://fullstackladder.dev/blog/2020/10/19/mastering-rxjs-34-introduce-scheduler-of-rxjs/)」

{% endnote %}

## 認識 TestScheduler

TestScheduler 是 RxJS 開發出來協助我們撰寫測試程式的工具，它可以幫助我們：

- 將所有「非同步執行」的 RxJS 程式碼轉換成「同步執行」
- 建立假的 Observable，Hot 或 Cold Observable 都可以
- 讓我們使用彈珠圖的視覺方式確認程式碼運作結果

不過 TestScheduler 使用上也有些條件：「必須使用跟 timer 相關的 Observable 當作測試來源，如 `timer`、`interval`、`delay` 等等」，這類型的測試來源都是使用 `asyncScheduler`；而使用 Promise 或是其他非同步的 Scheduler 如 `asapScheduler` 和 `animationFrameScheduler` 則會變得比較不可靠，這是需要注意的一點。

{% note info %}

當然，遇到這種狀況時，還是可以走回原來 `subsctibe` callback 的測試方式

{% endnote %}

## 使用 TestScheduler 的基本流程

### 起手式：建立 TestScheduler

要建立 TestScheduler 很簡單，因為它只是個類別，直接 new 它就好，而在建立時需要傳入一個 callback function 用來決定如何比較兩個物件是否相同。

```typescript
const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});
```

上述程式我們產生了一個新的 TestScheduler，並在建立時指定比較兩個物件的方法，以 Jasmine 的例子來說，我們使用 `toEqual` 來進行深層比較 (deep equality comparison)，以確保物件內所有屬性都完全相等。如果使用其他測試框架，則須要看該測試框架使用那種方式比較兩個物件。

### 呼叫 run() 取得測試用的 helper

建立好 TestScheduler 後，我們需要呼叫該物件的 `run()` 方法，`run()` 方法內也是一個 callback function，在此 function 內會得到一個 `helper` 物件，這個物件可以幫助我們「以同步的方式測試非同步 Observable」，這個 helper 包含幾個方法：

- `hot`：依照指定的彈珠圖建立一個 Hot Observable
- `cold`：依照指定的彈珠圖建立一個 Cold Observable
- `expectObservable(...).toBe(...)`：用來判斷兩條 Observable 是否結果相同
- `expectSubscription(...).toBe(...)`：用來判斷「訂閱」和「結束訂閱」的結果是否符合預期
- `flush`：用來立即完成一個 Observable，通常用不到，只要在很細的控制測試需要

## 認識測試用彈珠圖

我們之前已經介紹過了「文字版彈珠圖」，裡面的符號在一般溝通時已經足夠使用，但在測試時，需要更精準的知道事件發生的時間，因此讓我們回顧一下基本的符號、在測試時的意義，以及之前沒有用到的符號。

- `-`：如同之前所介紹，它是一個時間的最小單位，在測試中我們稱為一個 `frame`，通時它也虛擬地代表了 1 毫秒。
- `  `：空白符號，一樣只是用來對齊使用，不會發生任何事情，也不代表時間
- `[0-9]+[ms|s|m]`：代表經過了多少時間，畢竟一個 `-` 代表 1 毫秒，那一秒鐘要畫 1000 個 `-`，太辛苦了
- `[a-z0-9]`：代表事件發生了，一個符號代表一個事件值發生了，也就是 `next()` 被呼叫了
- `( )`：用來群組同時間發生的資料，例如 `(12)` 並不是事件「十二」發生，而是同一個時間點 (frame) 發生了 `1` 和 `2` 兩個事件
- `|`：Observable 完成
- `#`：Observable 發生錯誤
- `^`：代表訂閱開始的時間點，專門用來測試訂閱何時開始的
- `!`：代表訂閱結束的時間點，專門用來測試訂閱何時結束的

上述符號在測試時，`^` 和 `!` 在測試 Observable 資料流程時不可使用；而在測試訂閱時機時，則可以使用 `^`、`!`、和時間相關的符號 `1` 和 `[0-9]+[ms|s|m]`，稍後看到實際程式會更加清楚。

實際畫幾個圖來說明一下：

- 使用時間符號取代 frame (`-`) 

```
----------
(10ms)
// 上下兩組發生時間一樣長
```

- 對齊加上時間符號

```
--- 1s ---
// 實際上用掉了 1006 個 frames
---    ---
// 實際只用掉了 6 個 frames
```

- 事件發生加上時間符號

```
a 1s b
=> a 事件發生後，再等待 1000 個 frames 後發生 b 事件
```

- 事件發生在同一個 frame

```
---  1   ---
---(abc)---
=> 用掉了 7 個 frame，事件 abc 都在同一個 frame 發生
```

- 訂閱發生時間

```
---1---2---3---4---5|
     ^-----------|
     => 實際上訂閱的時間點
```

## 彈珠圖測試範例

接著就讓我們直接舉例，用彈珠圖來進行測試看看吧！我們先把 Observable 都寫在測試程式裡面，以便理解各種彈珠圖測試方式。

測試程式碼請參考範例專案內的 `test/marble-test-basic.spec.ts`。

### 基本彈珠圖測試

首先第一步，在每個要使用 TestScheduler 的測試之前，都需要建立一次 TestScheduler，因此我們用 `beforeEach` 來處理：

```typescript
describe('使用 TestScheduler 測試', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });    
});
```

接著只要在測試案例的 `it` 內，呼叫 `testScheduler.run()` 並執行測試即可，以下以 `take` operator 進行示範：

```typescript
it('測試 take operator', () => {
  testScheduler.run(helpers => {
    const { cold, expectObservable, expectSubscriptions } = helpers;

    const sourceMarbleDiagram =  '---a---b---c---d---e---|';
    const expectedSubscription = '^----------!';
    const expectedResult =       '---a---b---(c|)';

    const sourceObservable = cold(sourceMarbleDiagram);
    const source$ = sourceObservable.pipe(take(3));

    expectObservable(source$)
      .toBe(expectedResult);
    expectSubscriptions(sourceObservable.subscriptions)
      .toBe(expectedSubscription);
  });
});
```

- 第 2 行：呼叫 `testScheduler.run` 開始進行彈珠圖測試
- 第 3 行：將需要的程式從 `helpers` 中取出
- 第 5 行：來源 Observable 的彈珠圖
- 第 6 行：實際測試的 Observable 訂閱後預期的訂閱時機點
- 第 7 行：實際測試的 Observable 預期產出的彈珠圖
- 第 9 行：依照第 5 行的彈珠圖，建立一個 Cold Observable
- 第 10 行：建立實際要測試的 Observable，一般來說就是來源 Observable (第 9 行建立) 加上要測試的 operators (以這邊的例子是 `take(3)`)
- 第 12 行，使用 `expectObservable` 測試 `source$` 訂閱後產生的資料流彈珠圖是否符合預期
- 第 14 行，使用 `expectSubscriptions` 測試 `source$` 的訂閱時機點 (`sourceObservable.subscription`)是否符合預期

這樣就完成第一個彈珠圖測試啦！之後要進行彈珠圖測試時，可以用同樣的模式，把要被測試的目標換掉 (以這邊的例子是 `source$`)，以及設定正確的彈珠圖，就可以看到結果囉！

### 帶入指定物件到彈珠圖內

上述例子我們用 `a`、`b` 和 `c` 當作事件值，但實際上我們的來源 Observable 不會只有這麼單純的文字資料而已，很多時候都是物件的處理，這時候我們可以在使用 `cold` 和 `hot` 建立 Observable 時給予一個對應事件名稱當作屬性的物件，當作來源資料；同時在 `expectObservable` 時用一樣的方式給予物件，當作結果資料。先看個簡單的例子：

```typescript
it('測試 map operator (帶入 value)', () => {
  testScheduler.run(helpers => {
    const { cold, expectObservable } = helpers;
    const sourceMarbleDiagram = '--a--b--c--d--|';
    const expectedResult =      '--w--x--y--z--|';

    const sourceObservable = cold(sourceMarbleDiagram, { a: 1, b: 2, c: 3, d: 4 });
    const source$ = sourceObservable.pipe(map(value => value + 1));
    expectObservable(source$).toBe(expectedResult, { w: 2, x: 3, y: 4, z: 5 });
  });
});
```

- 第 4 行和第 5 行建立彈珠圖，包含來源 Observable 和預期轉換成新的 Observable 的彈珠圖
- 第 7 行使用 `cold` 建立 Cold Observable 時，除了給予彈珠圖文字外，也傳入一個物件，因此彈珠圖上的事件 `a` 實際上發出的事件值會是物件內的數字 `1`，以此類推
- 第 9 行在比較彈珠圖結果時，`toBe` 傳入預期的結果物件，因此彈珠圖上的事件 `w` 實際上會發出的事件值會是物件內的數字 `2`，以此類推

看完簡單的例子後，改成帶入更複雜的物件看看，原理一樣，就不多說明囉：

```typescript
it('測試 map operator (帶入更複雜的 value)', () => {
  testScheduler.run(helpers => {
    const { cold, expectObservable } = helpers;

    const input = {
      a: { name: 'Student A', score: 25 },
      b: { name: 'Student B', score: 49 },
      c: { name: 'Student C', score: 100 },
      d: { name: 'Student D', score: 0 }
    };
    const expected = {
      w: { name: 'Student A', score: 50 },
      x: { name: 'Student B', score: 70 },
      y: { name: 'Student C', score: 100 },
      z: { name: 'Student D', score: 0 }
    };

    const sourceMarbleDiagram = '--a--b--c--d--|';
    const expectedResult =      '--w--x--y--z--|';

    const sourceObservable = cold(sourceMarbleDiagram, input);

    const source$ = sourceObservable.pipe(
      map(student => ({ ...student, score: Math.sqrt(student.score) * 10 }))
    );
    expectObservable(source$).toBe(expectedResult, expected);
  });
});
```

### 測試長時間的 Observable

使用 `testScheuler` 除了可以畫圖用視覺畫理解測試外，另一個最大的方便就是一切都變成同步執行的，儘管 Observable 是每秒發生一次，在 `testScheduler` 內也只是虛擬時間，不會等待那麼長的時間，而彈珠圖中也可以直接用時間單位表達發生多久，如下：

```typescript
it('測試時間 time frame', () => {
  testScheduler.run(helpers => {
    const { cold, expectObservable } = helpers;

    const sourceMarbleDiagram = '(123|)';
    const expectedResult =      '--- 7ms 1 9ms 2 9ms (3|)';

    const sourceObservable = cold(sourceMarbleDiagram);
    const source$ = sourceObservable.pipe(
      concatMap(value => of(value).pipe(delay(10)))
    );

    expectObservable(source$).toBe(expectedResult);
  });
});
```

這裡重點測試是 `source$` 內的 `delay(10)`，透過 `concatMap` 讓原始 Observable 的每個值都延遲 10ms 發生，然後串在一起。

在 `expectedResult` 裡面 `--- 7ms` 實際上就是 10 毫秒，直接寫成 `10 ms` 也可以，意義完全一樣；；而整體 Observable 彈珠圖則是 `1 9ms 2 9ms (3|)`，值得注意的是每次事件發生的那個當下也代表了一個 `frame`，因此是 `1 9ms` 而不是 `1 10ms`，而最後事件值 `3` 發生後會直接結束，因此使用 `( )` 包起來， `(3|)` 代表兩個事件 (`3` 和 `|` 結束) 是在同一個 frame 發生的。

就算是一個不會結束的 Observable，彈珠圖畫出來也只是沒有 `|` 符號而已囉。

### 測試 Hot Observable

Cold Observable 在每次訂閱時會重新跑完整個資料流，而 Hot Observable 則是一個資料流，在不同時間點訂閱可能會得到不同的結果，因此 Hot Observable 測試時還有一個重點，就是不同時間訂閱的結果，聽起來很麻煩，但一畫成彈珠圖就簡單多了！

```typescript
it('測試 Hot Observable', () => {
  testScheduler.run((helpers) => {
    const { hot, expectObservable } = helpers;

    const sourceMarbleDiagram = '--1--2--3--4--5--6--7--8';
    const subscription1 =       '-------^-------!';
    const subscription2 =       '-----------^-----!';
    const expectedResult1 =     '--------3--4--5-';
    const expectedResult2 =     '-----------4--5---';

    const sourceObservable = hot(sourceMarbleDiagram);

    expectObservable(sourceObservable, subscription1).toBe(expectedResult1);
    expectObservable(sourceObservable, subscription2).toBe(expectedResult2);
  });
});
```

上面程式我們只訂了兩個訂閱時機 (`subscription1` 和 `subscription2`)，從彈珠圖就可以看到時機點的不同，以及畫出兩種預期得到資料的結果，在處理 Hot Observable 時，可以在 `expectObservable` 中給予訂閱的時機，藉此來比較該訂閱時機點下，得到的彈珠圖是否與預期相同。

## 使用彈珠圖測試實際的 Observables 與 Operators

有了這些觀念後，就讓我們實際測試看看一開始寫的那些程式吧！

測試程式碼可以參考範例專案內的 `src/marble-test-for-observables.spec.ts` 以及 `src/marble-test-debounce-input.spec.ts` 兩個檔案，裡面有各種寫法，有了前面的觀念後要寫出類似的測試程式應該不困難，這裡只挑出一些重點。

### 基本彈珠圖測試

與之前一樣，只是來源 Observable 是我們真正寫好的程式碼：

```typescript
it('使用彈珠圖測試單一個事件的 Observable', () => {
  testScheduler.run((helpers) => {
    const { expectObservable } = helpers;

    // 1 會被當事件字串，因此不能這樣寫
    // const expectedResult = (1|);
    const expected = '(a|)';
    expectObservable(emitOne$).toBe(expected, { a: 1 });
  });
});
```

這裡有一個值得注意的小地方，由於彈珠圖內的事件預設都是字串，因此 `of(1)` 雖然一般可以想成彈珠圖 `(1|)`，但在測試時 `1` 會被當作字串，而跟結果比較不符合，所以正確的寫法是給一個字母如 `a` 當作事件點，然後把物件傳入來指定該是件時間點的事件值。

### 測試多個事件的 Observable

可以畫彈珠圖之後，一切就變得簡單啦！

```typescript
it('使用彈珠圖測試多個事件的 Observable', () => {
  testScheduler.run(helpers => {
    const { expectObservable } = helpers;

    const expected = '(abcd|)';
    expectObservable(emitOneToFour$).toBe(expected, { a: 1, b: 2, c: 3, d: 4 });
  });
});
```

一樣要注意的是資料型態問題。

### 測試非同步的 Observable

要測試非同步 Observable 也不困難，在彈珠圖上標記經過時間即可：

```typescript
it('使用彈珠圖測試非同步處理的 Observable', () => {
  testScheduler.run((helpers) => {
    const { expectObservable } = helpers;

    // 因為事件本身佔一個 frame，所以用 999ms
    const expected = 'a 999ms b 999ms c 999ms (d|)';
    expectObservable(emitOntToFourPerSecond$).toBe(expected, { a: 0, b: 1, c: 2, d: 3 });
  });
});
```

跟之前提過的一樣，事件發生點本身就佔一個 frame，這是需要多注意的地方。

### 測試複雜的 Observable

最後要來測試前面提到旦沒測試過的 `debounceInput()` 啦！這個 `debounceInput()` 是三個 operators 組合起來的，所以至少根據每個 operator 特性會撰寫一組測試案例才對，同時這些測試案例的結果也必須符合組合起來的結果。

首先是最簡單的「文字長度大於等於 3」也就是 `filter(data => data.length >= 3)` 的條件：

```typescript
it('文字長度大於等於 3 才允許事件發生', () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const input = {
      a: 'rxjs',
      b: 'rx',
    };
    const expectedOutput = {
      x: 'rxjs',
    };

    // b 事件的內容不到 3 個字，因此沒有事件發生
    const sourceMarbleDiagram = 'a 300ms   100ms b';
    const expectedResult =      '  300ms x 100ms  ';

    const sourceObservable = cold(sourceMarbleDiagram, input);
    const source$ = sourceObservable.pipe(debounceInput());
    expectObservable(source$).toBe(expectedResult, expectedOutput);
  });
});
```

`input` 代表每次事件發生時輸入的內容，可以搭配 `sourceMarbleDiagram` 彈珠圖一起看，而 `expectedOutput` 則搭配 `expectedResult` 彈珠圖憶起看，在事件 `a` 時間點時，輸入內容超過 3 個字，因此預期的 Observable 會得到這個資料，而事件 `b` 時間點指輸入 2 個字，因此在新的 Observable 上沒有事件發生。同時考量到整個 operator 有一個 `debounceTime(300)`，因此事件 `a` 發生後等待 `300ms` 沒有新事件才會在新的 Observable 上發生事件 `x`。

這裡的 `x` 實際上就是 `a` 事件，因此我們也可以把 `expectedResult` 的 `x` 直接取代成 `a`，比較時可以都傳入 `input` 會更好理解這個彈珠圖，這裡只是示範帶入不同物件的方法。

接著測試 `debounceTime(300)` 的行為：

```typescript
it('300ms 內沒有的輸入才允許事件發生', () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const input = {
      a: 'rxjs-demo',
      b: 'rxjs-test',
      c: 'rxjs',
    };

    // a--b 後等待 100ms 繼續輸入文字 (事件 c)，因為沒超過 300ms 所以沒有新事件
    // 之後 300ms 沒有新的輸入，將最後資料當作事件發送
    const sourceMarbleDiagram = 'a--b 100ms c';
    const expectedResult =      '---- 100ms 300ms c';

    const sourceObservable = cold(sourceMarbleDiagram, input);
    const source$ = sourceObservable.pipe(debounceInput());
    expectObservable(source$).toBe(expectedResult, input);
  });
});
```

考量到 `filter(data => data.length >= 3)` 的條件，我們將事件內容都設定超過 3 個字，而事件 `a`、`b` 和 `c` 之間的間隔都沒有超過設定的 `300ms` 因此過程中不會有新的事件，直到事件 `c` 發生後 `300ms` 沒有新事件，才在新的 Observable 發生來源 Observable 的最後一個事件值 `c`。

最後測試 `distinceUntilChanged` 的行為：

```typescript
it('事件值跟上次相同時，不允許本次事件發生', () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;

    const input = {
      a: 'rxj',
      b: 'rxjs',
      c: 'rxjs',
      d: 'rxj',
    };

    // 由於 b 事件跟 c 事件的內容一樣，因此事件不會發生
    // 由於 c 事件跟 d 事件的內容不同，因此事件繼續發生
    // 若使用 distinct 則會因為 a 和 d 事件一樣而不發生新事件
    const sourceMarbleDiagram = 'a 300ms   b 300ms   c 300ms d';
    const expectedResult =      '  300ms a   300ms b - 300ms   300ms d';

    const sourceObservable = cold(sourceMarbleDiagram, input);
    const source$ = sourceObservable.pipe(debounceInput());
    expectObservable(source$).toBe(expectedResult, input);
  });
});
```

一樣的需要考量到 `debounce(300)` 和 `filter(data => data.length >= 3)` 的問題；事件 `a` 發生後 `300ms` 發生在新的 Observable 上，事件 `b` 也是；而事件 `c` 和事件 `b` 內容相同，因此不會發生在新的 Observable 上。

# 本日小結

今天我們學習到兩種測試 RxJS 的方法

- 直接在 `subscribe` callback 內驗證：直覺簡單，但比較不能應付複雜情境，非同步程式的測試可能會拉長整體測試時間
- 使用彈珠圖測試 (Marble Testing)：使用 TestScheduler；前置步驟比較多，但可以畫出彈珠圖來以視覺畫的方式進行測試，同時可以把所以非同步程式都當作同步程式來測試，效能會更好

如果 Observable 真的很簡單，可以考慮使用 `subscribe` callback 的方法就好，如果遇到比較複雜的狀況，RxJS 都幫我們想好了，使用 TestScheduler 可以幫助我們用很好理解的方式撰寫測試程式囉！

# 相關資源

- [Marble Testing](https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing)
- [TestScheduler](https://rxjs-dev.firebaseapp.com/api/testing/TestScheduler)

# 完賽感言

終於！把我覺得 RxJS 想介紹的內容都寫完了！！希望這 35 篇內容可以幫助大家由淺入深的理解 RxJS，同時體會到它的強大、便利以及可靠。雖然 RxJS 真的是一個比較抽象的東西，但只要花點時間多多練習這些內容，相信一定可以幫助大家打通 RxJS 任督二脈，搖身一變成高手啦！

RxJS 還有很多 operators 沒機會介紹到，之後我會再花些時間整理這些 operators，以及補上更多實戰練習，這部分就敬請期待囉。
