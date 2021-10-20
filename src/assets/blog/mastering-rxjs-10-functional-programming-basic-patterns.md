---
title: "[RxJS] Functional Programming 常用基本技巧及應用"
date: 2020-09-25 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Functional Programming
  - Currying
  - Compose
  - Pipe
  - Tap
---

昨天的文章我們把 functional programming 的大致概念介紹了一下，今天我們來介紹一些使用 functional programming 開發時常用的基本技巧！這些技巧可以讓程式碼的可讀性、可維護性都更高，習慣以後對於這種流暢的思考方式絕對會讓你覺得寫 code 是一件很過癮的事情啊！

<!-- more -->

# Functional Programming 基礎技巧

實作程式碼：https://stackblitz.com/edit/mastering-rxjs-10-functional-programming-intro-02-practice

## Curry Function

在前一篇文章我們提到 functional programming 的一個重要提件是：function 本身可以當作另一個 function 的參數傳入，同時也能夠**回傳一個新的 function**。

透過這種方是，我們可以很輕易的把<u>**「設定」和「資料」進行隔離**</u>！而這種 function 我們就稱為 Curry Function。

### Currying

舉個非常簡單的例子，兩個數字相加：

```typescript
const add = (a, b) => a + b;
```

我們可以重新解成 **a 是「設定」**，代表的是要「加多少」；而 **b 是「資料」**，代表的是「即將被增加的數」，換個好讀的寫法：

```typescript
const add = (num, data) => num + data;
```

接著可以把原來兩數相加的程式改成這樣：

```typescript
const add = (num) => {
  return (data) => num + data;
};
```

上面程式我們先建立了一個包含參數 num 的 function，這個 function 會回傳另一個 function，而 num 在這裡就只是個**設定**的動作，我們可以用這個 function 建立更多不同功能的 function

```typescript
const plusOne = add(1); // 一個用來 +1 的 function
const plusTwo = add(2); // 一個用來 +2 的 function
const generateNextId = add(1); // 雖然都是 +1，但這裡透過命名讓意圖更加明確
```

拿到這特定功能的 function 後，只要把「**資料**」帶進去就可以得到想要的結果囉：

```typescript
const data = 1;
const plusOneResult = plusOne(data); // 2
const plusTwoResult = plusTwo(data); // 3
const nextId = generateNextId(data); // 2
```

是不是很酷啊！這種將 function 內的每個參數設定拆成回傳下一個參數設定的 function 的行為，我們稱為「currying(中文不少人稱文「科里化」)」。而最終產生的這種 function 就稱為「curry function」。

透過 curry function，我們可以把一些參數設定先拆出來，但不處理資料運算；而傳入不同的設定參數後取得不同目標的 function，把 function 功能拆分得更小，也讓程式的重用性更高。

另外 Curry function 有一個非常大的作用，稱為<u>**惰性求值(lazy evaluation)**，或稱為**延遲評估**</u>。Lazy evaluation 的重點在於「**盡可能延後進行複雜運算的行為**」！以上面的例子來說，我們可以透過 `add(n)` 這種方法需要運算的 function 先行準備好 (此時還沒真的進行運算)，直到需要的時候，才將資料帶入運算。

```typescript
// 先準備好運算邏輯 (此時還沒真的進行資料運算)
const generateNextId = add(1);
// 假設這裡還有一系列的其他行為
// ...

// 在真正需要的時候，才進行運算
const nextId = generateNextId(data);
```

### 實際運用

接著我們拿昨天文章用到的「偶數平方和」作為例子，假設除了「平方」外，我還想另外計算「立方」該怎麼辦呢？

這時候就可以把原來「平方」的程式，，先抽出一個 N 次方的 function：

```typescript
// power 是一個 curry function，
// 把設定 (n) 和 資料 (inputArray) 拆開來
const power = (n: number) => {
  // 回傳一個 function，只有這個 function 被呼叫時才會真正進行運算
  return inputArray => {
   return inputArray.map(item => Math.pow(item, n));
  };
};
```

之後「平方」跟「立方」就可以透過這個 power 的 curry function 來產生：

```typescript
// 產生計算平方和次方的 function
const square = power(2);
const cube = power(3);
console.log(`平方: ${square([1, 2, 3])}`); // 1, 4, 9
console.log(`立方: ${cube([1, 2, 3])}`); // 1, 8, 27
```

接下來「偶數平方和」和「偶數立方和」就可以各自運算啦：

```typescript
// even 和 sum 之前寫過了可以參考範例程式碼
const sumEvenSquare = inputArray => {
  const evenData = even(inputArray);
  // 計算平方值
  const squareData = square(evenData);
  const sumResult = sum(squareData);
  return sumResult;
};
console.log(`偶數平方和: ${sumEvenSquare(data)}`);

const sumEvenCube = inputArray => {
  const evenData = even(inputArray);
  // 計算立方值
  const cubeData = cube(evenData);
  const sumResult = sum(cubeData);
  return sumResult;
};
console.log(`偶數立方和: ${sumEvenCube(data)}`);
```

上面的程式基本上都一樣，只是把「平方」的 function (第 5 行) 換成了「立方」的 function (第 14 行)。所以我們也可以把這個 function 視為是一種「可以被設定的參數」，寫成新的 curry function

```typescript
// 由於多少次方和是可以抽換的，我們也可以寫成 curry function
const sumEvenPower = powerFn => {
  return inputArray => {
    const evenData = even(inputArray);
    const powerData = powerFn(evenData);
    const sumResult = sum(powerData);
    return sumResult;
  };
};

// 建立偶數平方和的 function
const sumEvenSquare = sumEvenPower(square);
// 建立偶數立方和的 function
const sumEvenCube = sumEvenPower(cube);

console.log(`偶數平方和: ${sumEvenSquare(data)}`);
console.log(`偶數立方和: ${sumEvenCube(data)}`);
```

我們已經可以很好的運用 curry function 了，但目前的程式中我們為了運算產生了很多變數，寫起來還是有點煩，接著讓我們運用 compose 和 pipe 兩種技巧來解決這個問題。

## Compose

以前面例子的 `sumEvenPower` 來說，每次產生一個新的 function 都宣告一個變數，稍微麻煩了一點，懶惰點的人可，懶惰點的人可能就直接寫成一行

```typescript
const sumEvenPower = powerFn => {
  return inputArray => {
    // 原本的寫法
    // const evenData = even(inputArray);
    // const powerData = powerFn(evenData);
    // const sumResult = sum(powerData);
    // return sumResult;
   
    // 直接用一行來寫，但可讀性就比較低
    return sum(powerFn(even(inputArray)));
  };
};
```

這種寫法就如同數學運算是一樣，function 內在包個 function。

不過這樣一整行寫起來可讀性比較差一點，如果可以把要執行的 function 都當作參數，再組合成新的運作 function 就好了，這時候我們就可以寫一個「**組合函數 (compose function)**」：

```typescript
const compose = (...fns) => {
  return data => {
    let result = data;
    // 從最後一個 function 開始執行
    for (let i = fns.length - 1; i >= 0; --i) {
      result = fns[i](result);
    }
    return result;
  };
};
```

上面的例子中，我們宣告一個名稱為 compose function，這個參數就是我們想要傳進去組合的所有 function，由於最裡面的 function 會最先呼叫，因此要從傳入的最後一個 function 開始呼叫。

```typescript
const data = 1;
a(b(c(data))); // 實際上 c 會先被呼叫
```

接著將所有要傳入的 function 傳進去 compose 內作為參數，就會自動幫我們組合出一個新的 function 囉！

```typescript
const sumEvenPower = powerFn => {
  // 原本的寫法
  // const evenData = even(inputArray);
  // const powerData = powerFn(evenData);
  // const sumResult = sum(powerData);
  // return sumResult;
 
 
  // 呼叫順序為從下往上：even、powerFn、sum
  return compose(
    sum,
    powerFn,
    even
  );
};
const sumEvenSquare = sumEvenPower(square);
const sumEvenCube = sumEvenPower(cube);
 
console.log(`偶數平方和: ${sumEvenSquare(data)}`);
console.log(`偶數立方和: ${sumEvenCube(data)}`);
```

跟原本的寫法比起來，透過 compose function 來處理是不是清爽很多啊！而拜 curry function 的 lazy evaluation 特性以及我們設計的 compose function 本身也是 curry function 所賜，最終 compose 出來的 function 一樣具有 lazy evaluation 的特性喔！

另外，這種過程中都不用傳入「資料」的做法 (只有最後在真的帶入資料)，也被稱為 **Point Free** 的操作，算是在 functional programming 中一種很常使用到的風格。

## Pipe

在 compose function 的例子中，function 執行的順序跟傳入的順序是剛好相反的，雖然這在數學上非常合理，但對於一般寫程式的閱讀習慣就不是這麼一回事了，對一般程式閱讀來說，傳入的順序最好跟執行順序一樣，可讀性會好很多！

所以原來的 compose function 可以把執行順序調整成跟傳入參數的順序一樣，我們稱為「**管線函數 (pipe function)**」：

```typescript
const pipe = (...fns) => {
  return data => {
    let result = data;
    // 原本 compose 的 for 迴圈是從最後一個開始執行
    // pipe 內改為從第一個 function 開始執行
    for (let i = 0; i < fns.length; ++i) {
      result = fns[i](result);
    }
    return result;
  };
};
```

之後的程式邏輯基本上都相同，只是組合 function 的方法改成 pipe，因此把順序調整成符合一般閱讀與執行習慣的順序：

```typescript
const sumEvenPower = powerFn => {
  // 呼叫順序為從上往下：even、powerFn、sum
  return pipe(
    even,
    powerFn,
    sum,
   );
};
 
const sumEvenSquare = sumEvenPower(square);
const sumEvenCube = sumEvenPower(cube);
console.log(`偶數平方和: ${sumEvenSquare(data)}`);
console.log(`偶數立方和: ${sumEvenCube(data)}`);
```

對於一般習慣寫程式的人來說，這種寫法的可讀性就再次增加囉！

## Tap

最後我們來介紹 tap！在使用 functional programming 時，我們已經知道要盡量避開 side effect 了，也同時明白不可能完全沒有 side effect，因此要做的事情重點是把 pure function 跟 impure function 隔離，未來要查找問題也才更加知道如何處理，在 functional programming 中，我們會寫一個 tap function，它其實沒做什麼事情，就是單純不處理資料就直接回傳，但允許我們再傳入一個 function 當參數來呼叫：

```typescript
// tap 內處理資料的 function 會執行傳入的 function
// 但不會對傳入的 data 做任何處理，就直接回傳
// 目的是讓我們有機會在此處理一些 side effect
// 直接回傳 data 則是方便後續的 function 繼續處理資料
const tap = (fn) => {
  return (data) => {
    // 呼叫傳入的 function
    fn(data);
    // 直接回傳資料
    return data;
  }
}
```

之後所有的 impure function 都必須傳入 tap function 來執行：

```typescript
const sumEvenPower = powerFn => {
  return pipe(
    even,
    // 用 tap 來隔離 side effect
    tap(data => console.log('even 後，目前資料為', data)),
    powerFn,
    tap(data => console.log('powerFn 後，目前資料為', data)),
    sum,
    tap(data => console.log('sum 後，目前資料為', data)),
  );
};
```

透過這種方式就可以妥善隔離 pure function 和 impure function 啦。

假設我們在 impure function 做了有問題的操作，導致程式壞掉，在確認 pure function 邏輯都正確的前提，我們就可以優先懷疑是 tap function 內的程式有問題，找 bug 也會更加輕鬆：

```typescript
// 以下範例特地在 tap 中做到讓程式出問題的 side effect
// 由於我們可以確定除了 tap 外都是 pure function
// 因此出問題時若確定 pure function 邏輯沒錯，就可以優先檢查 tap 內的實作
const sumEvenPowerBugVer = powerFn => {
  return pipe(
    even,
    // pure function 邏輯沒問題時，就可以優先看 tap 內的程式碼
    tap(data =>{
      data.push(100);
    }),
    powerFn,
    sum,
  );
};

const sumEvenSquare2 = sumEvenPowerBugVer(square);
console.log(`偶數平方和: ${sumEvenSquare2(data)}`); // 結果和想的不一樣
```

tap function 一樣是個 curry function，搭配 compose 和 pipe 在真正傳入資料開始運算之前，都不會呼叫 tap 內的 function，也代表在真正運算前不可能發生 side effect 的情境，這也是確保程式穩定很重要的一個技巧！

在 functional programming 的技巧中，還有一些幫助我們隔離 side effect 的方法如 monad，但它更加的抽象，且需要預備更多的知識，本系列的文章目標是幫助大家建立 functional programming 的基本知識以便進入 ReactiveX 的世界，因此更進階的技巧就先不介紹了；之後若有機會再來分享。

# RxJS 中的 FP 實際應用

接著我們來實際看看 ReactiveX 中是如何應用前面提到的 functional programming 技巧。了解這些背後的運作邏輯，對我們實際寫程式會更有幫助，也會更加知道我們的程式到底在幹嘛，以及工具幫我們做了些什麼事情！

由於本系列文章是介紹 RxJS，所以就從 RxJS 的程式碼中來一窺究竟吧！

實作程式碼：https://stackblitz.com/edit/mastering-rxjs-10-apply-fp-to-reactive

## Curry Function

以之前我們練習 RxJS 時就學過的 map operator 作為例子，會看到類似下面的程式碼 ([完整 source 在這]((https://github.com/ReactiveX/rxjs/blob/6.x/src/internal/operators/map.ts#L45)))：

```typescript
export function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R> {
 return function mapOperation(source: Observable<T>): Observable<R> {
  ...
 };
}
```

可以看到 map 本身就是個 curry function，而 `project` 參數就是用來決定資料該如何轉換的「**設定**」，內部的 `mapOperation` 是最終會被執行的方法，**帶入的「資料」則是一個 observable，同時也會回傳一個 observable**。

所有的 operators 基本上都是 curry function，且輸入輸出都是 observable，因此我們可以直接帶入參數後得到一個新的 function 來處理 observable 的結果，例如：

```typescript
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const source$ = new Subject<number>();

// 產生新的 function，參數必須是一個 observable
const double = map((data: number) => data * 2);
// 產生新的 function，參數必須是一個 observable
const plusOne = map((data: number) => data + 1);

// 組合出一個新的 observable
const generateNextId$ = plusOne(double(source$));

generateNextId$.subscribe(data => console.log(data));

source$.next(1); // generateNextId$.subscribe 的結果是 3
source$.next(2); // generateNextId$.subscribe 的結果是 5
```

當然實際上我們幾乎不可能會這樣寫，因為在 RxJS 內我們也有內建的 pipe 可以用！

## 使用 Pipe 串起每個 Operators

熟悉 RxJS 的朋友相信都不會想用剛剛的寫法來撰寫程式，實際上 observable 會提供 `pipe` 方法，觀念跟 functional programming 的 pipe 一樣，讓我們把 operators (functions) 串起來：

```typescript
const source$ = new Subject<number>();
// 透過 pipe 將 source$ 換成另一個新的 observable
const generateNextId$ = source$.pipe(
  map(data => data * 2),
  map(data => data + 1)
);
 
generateNextId$.subscribe(data => console.log(data));
source$.next(1); // generateNextId$.subscribe 的結果是 3
source$.next(2); // generateNextId$.subscribe 的結果是 5
```

由於每個 operator 都是傳入及回傳一個 observable 的 curry function，搭配上 pipe，回傳自然就一樣是個 observable 囉。

如同 functional programming 提到 **higher order function** 一樣，把 function 當作一等公民看待，在使用 RxJS 時，我們也應該秉持 **higher order observable** 的精神，將 Observable 也當作一等公民，傳入傳出都優先考量 Observable，當慢慢習慣這樣思考後，寫起 RxJS 就會越來越順利囉。

有興趣的話也可以看看 [RxJS 的 pipe 實作](https://github.com/ReactiveX/rxjs/blob/6.x/src/internal/util/pipe.ts#L24)，也是把每個 function 組合起來的 curry function！可見 curry function 應用層面真的非常的廣泛啊！

## 使用 Tap 隔離 Side Effect

最後我們來看 side effect，不管是 functional programming 還是 ReactiveX，甚至是平常寫程式時，都建議隨時把**避免 side effect** 當作最高處理原則！而在 ReactiveX 中，也有定義 tap operator 來幫助我們處理 side effect！

```typescript
const source$ = new Subject<number>();
const generateNextId$ = source$.pipe(
  map(data => data * 2),
  // 使用 tap 來隔離 side effect
  tap(data => console.log('目前資料', data)),
  map(data => data + 1),
  tap(data => console.log('目前資料', data))
);
 
generateNextId$.subscribe(data => console.log(data));
source$.next(1); // generateNextId$.subscribe 的結果是 3
source$.next(2); // generateNextId$.subscribe 的結果是 5
```

# 本日小結

今天我們介紹了幾個 functional programming 常用的基本技巧，就算不使用 RxJS，還是可以透過這些 functional programming 技巧寫出非常穩固的程式碼，建議各位多練習多使用。

- curry：將原本的參數拆成好幾個小 function，每個參數帶入後回傳的都是準備帶入下個參數的 function，藉此讓 function 單元更小，重用性更高；建議將真正要執行的資料放在最後一個參數，把「設定」和「資料」隔離。
- compoes：用比較簡易的方法把 function 呼叫順序包起來，去除巢狀的呼叫，讓整個運算邏輯變得更加清晰，搭配 curry function 有著奇效，在整個呼叫過程只要傳入一次資料就好，這種設計風格也稱為 Point Free。
- pipe：跟 compose 一樣是把 function 呼叫包起來，但 compose 是符合數學運算的習慣，比較後面的 function 會先被呼叫；pipe 則是設計成比較前面的 function 會先呼叫，更符合一般程式設計的閱讀習慣。
- tap：輸入資料就是輸出資料的一個 function，重點在會呼叫傳入的 callback function，可以透過這種方式將 「side effect」和「非 side effect」的程式隔開，在程式出現問題時能更容易找到需要除錯的地方。

另外，也有不少 JavaScript 的函式庫是以這種 functional programming 風格打造的，也內建了 curry、compose、pipe 這類的工具方法，像是 [Ramda](https://ramdajs.com/) 或 [loadsh/fp](https://github.com/lodash/lodash/wiki/FP-Guide) 等等，有興趣的話也可以自行研究看看。

當然 functional programming 還有更多的技巧，像是 functor、monand，以後有機會再來深入介紹囉。

最後我們實際應用學到的 function programming 基礎技巧來理解 RxJS 的背後行為，我們不用很深入的鑽研 RxJS 的原始碼，但稍微理解背景在做的事情及相關知識，相信對於未來要靈活應用也會非常有幫助！

花了不少的天數介紹各種遨遊在 ReactiveX 中所需要擁有的知識，明天開始我們就會正式進入 ReactiveX 的世界內囉！

