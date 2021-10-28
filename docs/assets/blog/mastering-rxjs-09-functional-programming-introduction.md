---
title: "[RxJS] 認識函式語言程式設計 - Functional Programming"
date: 2020-09-24 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
  - RxJS
  - Functional Programming
  - side effect
  - pure function
  - high order function
---

函式語言程式設計 (Functional Programming) 是 ReactiveX 應用中非常重要的一部份，在個人過去的經驗中，遇過不少覺得 RxJS 不好用，甚至寫出不好維護的程式，有很大的機會是因為沒有掌握到 functional programming 的一些觀念，當然有些觀念在一般學習程式語言時也會被提出來，但使用 functional programming 時這些觀念會顯得更加重要。

在寫 RxJS 時，我們不用成為 functional programming 的專家，但瞭解一些 functional programming 的重要觀念，絕對可以幫助我們寫出更強健的程式碼！不管是否使用 RxJS 都是如此喔！！

<!-- more -->

{% note info %}

在我個人學習 RxJS 的過程中，剛開始其實也不太順利，一直到真正接觸 functional programming 觀念後，才開始對很多 operators 的操作有種豁然開朗的感覺！因此也推薦各位務必多多複習接下來兩天會講到的 functional programming 基本觀念，而在未來學習 operators 時，也多回想看看它運用了哪些 functional programming 的觀念，絕對能讓你對 RxJS 有更加融會貫通的體會！

{% endnote %}

# 關於函式語言程式設計

以下介紹摘取自[維基百科對於函式語言程式設計的介紹](https://zh.wikipedia.org/wiki/函数式编程)：

{% note info %}

函式語言程式設計（英語：functional programming）或稱函式程式設計、泛函編程，是一種編程範式，它將電腦運算視為函式運算，並且避免使用**程式狀態**以及**易變物件**。其中，**λ演算（lambda calculus）**為該語言最重要的基礎。而且，λ演算的函式可以接受函式當作輸入（引數）和輸出（傳出值）。

比起指令式編程，函數式編程更加**強調程式執行的結果而非執行的過程**，倡導利用若干**簡單的執行單元**讓計算結果**不斷漸進**，逐層推導複雜的運算，而不是設計一個複雜的執行過程。

在函式語言程式設計中，函式是**第一類物件**，意思是說一個函式，既可以**作為其它函式的參數**（輸入值），也可以**從函式中返回**（輸入值），被修改或者被分配給一個變數。

{% endnote %}

如果直接搜尋 functional programming 要找中文資料，可能會看到很多名稱如：`函式語言程式設計`、`函式程式設計`、`函數式程式設計`，再加上簡體習慣講「編程」...由於中文名稱太多種，之後會統一稱為 functional programming 或 FP。

對於剛開使踏入 functional programming 的初學者來說，上面的描述可能會包含了許多沒聽過或不理解的東西，所以這篇文章會針對上面介紹我有標粗體的部分，逐步進行介紹，幫助大家對於 functional programming 的輪廓有個完整個基本概念。

# 狀態相依和物件改變

在開發時，完全避免**外部狀態相依**和**物件的改變**是一件非常困難的事情，以下舉一個不太好的程式碼，當我們要計算一個陣列中的偶數平方合時，可能會寫出這樣的程式碼：

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = {
  value: 0
};

// 計算陣列內偶數值得平方合
const sumEvenSquare = () => {
  for (let i = 0; i < data.length; ++i) {
    const value = data[i];
    if (value % 2 === 0) {
      sum.value += value * value;
    }
  }
};

sumEvenSquare();
console.log(sum.value); // 220
```

`sum` 和 `data` 我們會稱為是一個外部的「狀態」，這個狀態可能永遠都不會被改變，卻也可能在某個時間點忽然被改變了。

而 `sumEvenSquare` 是一個用來計算我們所需結果的 function，它直接相依了 `data` 和 `sum` 兩個**外部的狀態**，同時在運算過程中，它改變了 `sum` 這個**外部物件**，這代表外部的狀態也跟個被改變了！

這其實是非常可怕的一件事情，我們在計算過程中不斷的在改變 `sum` 資料，如果今天 `sumEvenSquare` 執行兩次，我們是否會得到一樣的結果呢？

```typescript
sumEvenSquare();
console.log(sum.value); // 220
sumEvenSquare();
console.log(sum.value); // 440
```

答案顯而易見的是「不會」，因為我們在運算第一次後改變了 `sum` 的資訊，卻沒有重設 `sum` 的值，因此第二次運算的時候會繼續改變 `sum` 的內容。

再假設一下，複雜的情境下，我們可能會讓 `sumEvenSquare` 獨立一個執行緒去計算，以增進整體效能，此時若是呼叫兩次 `sumEvenSquare` 會變成怎樣呢？當 `sumEvenSquare` 是個更複雜、耗時更長的運算時，我們不小心改變了 `sum` 或 `data`，會發生什麼事情呢？

答案是：我也不知道！

因為運作過程中可能被改變的情境太多了！在程式設計中不能掌控程式運作過程中資料被變動的情況，也就代表著在越容易產生 bug，同時也越難查出 bug 發生的情況，也就越難修正、越容易改 A 壞 B。

這種情況我們會成為「非執行緒安全(Non-thread Safe)」的計算，是我們應該極力去避免的！那麼怎樣達到「執行緒安全(Thread Safe)」呢？

程式碼：https://stackblitz.com/edit/mastering-rxjs-09-functional-programming-intro-impreative

## 避免外部狀態相依和改變

最簡單的方式是將這些狀態從外部拉到內部，讓他的作用域只能發生在內部：

```typescript
const sumEvenSquare = (dataArray: number[]) => {
  // 把計算總和的物件從外部移動到內部
  let innerSum = {
    value: 0
  };

  // 計算總和
  for (let i = 0; i < dataArray.length; ++i) {
    const value = dataArray[i];
    if (value % 2 === 0) {
      innerSum.value += value * value;
    }
  }

  // 回傳這個總和的內部物件
  return innerSum;
}

// 每次傳入陣列時，都先複製一份新的陣列，避免資料被改變
const sum1 = sumEvenSquare([...data]);
console.log(sum1.value); // 220
const sum2 = sumEvenSquare([...data]);
console.log(sum2.value); // 220
```

程式碼：https://stackblitz.com/edit/mastering-rxjs-09-functional-programming-intro-pure-function

透過這種方式，我們就能避免在運算時發生「外部狀態改變」的情境，由於也不會去更改到外部狀態，因此不用擔心重複呼叫造成外部狀態資料無法掌握的問題！

而這種相依或改變外部狀態資料的行為，我們通常又稱為 <u>**side effect (副作用)**</u>。

Side effect 的範圍非常廣範，只要是與外部狀態有關的，都算是 side effect，例如：

- 全域變數
- DOM 物件操作
- console.log
- HTTP 請求呼叫
- 其他...

{% note info %}

第一次聽到副作用這個名詞時，還覺得很不理解，是寫 code 寫到滑鼠手那種副作用嗎？好一陣子後才明白，原來是外部狀態被改變啊！

{% endnote %}

而這種避免 side effect，把所有資料都變成參數或內部狀態的 function，又稱為「**pure function (純函數)**」。

另外，我們透過 `[...data]` 的方式傳入一個新的陣列，可以避免原來的 `data` 陣列被改變，除此之外，我們也可以用一些不會改變身列本身內容的操作來操作陣列內容，例如新增一個新元素，比起使用 `data.push(100)`，使用 `const data2 = [...data, 100]` 這種寫法可以讓我們不要改到 `data` 本身，這種操作我們成為「 **immutable (不可變的)**」。

不管要不要朝 functional programming 前進，在設計程式時，都建議應該要盡量將 function 設計成 pure function ，同時在操作資料時，也要盡量朝向 immutable 的方式去設計，以避免難以掌握狀態的情境發生！

Pure function 還有一個很重要的特性，**就是不管執行幾次，一樣的輸入就一定會有一樣的輸出**，不會因為任何原因在不同時間產生不同的輸出，由於 pure function 基本上就不會相依任何外部狀態，加上 immutable 的操作，因此這可以說是必然的結果；如果無法達成這些條件，就不可稱它為 pure function，而會稱為 「**impure function (不純的函數)**」。

Pure function 和 immutable 是用來避免 side effect 很重要的方式，也有不少技巧和第三方套件如 [Immutable.js](https://github.com/immutable-js/immutable-js) 等，有興趣可以上網搜尋一下，或之後再來補充囉。

## 與 Side Effect 保持正確關係

當然在實務上，要完全避免 side effect 是不可能的事情，以網頁開發來說，畫面上的每個元素對目前設計的 `sumEvenSquare` 都是外部狀態，但我們不可能不透過這些元素來進行互動，例如從某個輸入框得到畫面的資料，再把結果放到畫面上等等，這些都是 side effect，但是核心的處理資料邏輯，我們就應該以 pure function 來作為設計的中心。

方法很簡單：**把 side effect 的操作整理成要傳入 pure function 的參數 (input)，再將執行結果(output) 拿去做其他的 side effect。**

```typescript
// 計算 "加 1" 的 pure function
const plusOne = (value: number) => value + 1;

document.querySelector('#plusOneBtn').addEventListener('click', () => {  
  // 整理傳給 pure function 的 input，這裡是 side effect
  const input = +(document.querySelector('#val') as HTMLInputElement).value;

  // 計算出 output，因為是 pure function，因此這裡的運算式 thread safe 的
  const output = plusOne(input);

  // 運算出結果再與畫面互動，這裡也是 side effect
  document.querySelector('#result').innerHTML = output.toString();
});
```

這麼一來，重要的運算邏輯又不會與外部狀態相依，也更加容易找出問題！

程式碼：https://stackblitz.com/edit/mastering-rxjs-09-function-programming-intro-with-side-effect

# 函數是一等公民

以前面的 `sumEvenSquare` 例子來說，假設我們希望可以更有彈性，除了「偶數」「平方」和以外，還能給予更多不同的運算方式時，我們可以把偶數和平方的計算方式拉出來，單純計算陣列的和，但陣列本身每個值的運算(如過濾出偶數和轉換成平方)等變成可以被外部呼叫，大概會寫成這樣：

```typescript
// 把陣列中值的運算拉成 processFn，運算時呼叫它 (等於把實作細節拉出去)
const sum = (processFn: (input: number) => number, inputArray: number[]) => {
  let result = 0;
  for(let i = 0; i < inputArray.length; ++i) {
    // 讓傳入的 processFn 來決定運算細節
    result += processFn(inputArray[i]);
  }
  return result;
}
```

上述程式我們把原來計算偶數平方的邏輯拿掉，變成一個可以傳入的 function，當要計算總和時，再針對每個值去呼叫這個 function 進行運算，等於把實作每個值運算的細節拉出去了。而因為function 是一等公民，所以可以把 function 當作參數傳入另一個 function 中。

除此之外，由於 function 是一等公民，因此一個 function 也能回傳另一個 function，以上述例子來說，處理方法和資料是拆開的，我們可以先得到一個運算結果的 function：

```typescript
// 把陣列中值的運算拉成 processFn，運算時呼叫它 (等於把實作細節拉出去)
const sum = (processFn: (input: number) => number) => {
  // 直接回傳一個 function，拿到此 function 的實作可以在任何時候選擇把資料傳入
  return (inputArray: number[]) => {
    let result = 0;
    for(let i = 0; i < inputArray.length; ++i) {
      // 讓傳入的 processFn 來決定運算細節
      result += processFn(inputArray[i]);
    }
    return result;
  }
}
```

另外要計算偶數平方時，可以再寫一段 function 來運算每個值：

```typescript
// 計算偶數平方，奇數回傳 0
const evenSquare = (item: number) => {
  return item % 2 === 0 ? item * item : 0;
};
```

此時計算偶數平均和的函數會變成一個組合出來的結果

```typescript
// 先得到一個 function
const sumEvenSquare = sum(evenSquare);
```

最後再把資料帶入這個 `sumEvenSquare` 內：

```typescript
// 再以剛才得到的 function 實際進行運算
const myResult1 = sumEvenSquare(data);
console.log(myResult1);
```

透過這種設計方式，我們可以將許多細節都抽出來，只留下一個比較抽象的運作過程，而被抽出來的部分，因為只需要關注在它自己要做的事情就好，所以程式碼會更加簡短，加上 pure function 的設計，整體的可維護性就會更加好啦！

這種 function 被視為一等公民寫法，必須要程式語言本身支援，現在許多程式語言也都支援這種寫法了，而這種特色也稱為「**higher order function (高階函數)**」。

程式碼：https://stackblitz.com/edit/mastering-rxjs-09-fp-intro-higher-order-function-lambda

# lambda

Lambda 看起來是個詭異的單詞，實際上就是一種數學運算的表示法而已，舉個例子而言，我們在學習數學時，會看到以下寫法：

{% asset_img 01.jpg %}

`f` 和 `g` 就是一個 function (函式)，小括號裡面的 `x` 和 `y` 就是參數，後面則是運算邏輯。

如果寫成程式就像：

```typescript
const f = (x) => x * x;
const g = (x, y) => x * x + y * y;
```

如果要改個更加明確的名稱，就會顯得比較冗長：

{% asset_img 02.jpg %}

如果名稱不是那麼重要，就乾脆省略吧：

{% asset_img 03.jpg %}

當我們看到 `λ` (lambda) 這個符號時，就知道是一個函數的定義，這種表示法在數學上有更多重要的意義，而在程式開發中，我們可以很簡單的把它當作是一個「<u>**匿名函式 (anonymous function)**</u>」即可！

什麼是匿名函式呢？簡單來說就是個不需要名稱的函示，如果每次都要額外命名一個 function，實在是有點麻煩，所以乾脆直接把函數實作傳入參數，就不需要命名了(這就是匿名函數)，以前面的例子來說，處理每個值運算還要給他一個函數名稱太麻煩了，乾脆就直接把運算邏輯寫進去吧：

```typescript
// 要額外命名 function 太麻煩了，就可以透過匿名函數來處理
const sumResult2 = sum(item => item % 2 === 0 ? item * item : 0, data);
console.log(sumResult2); // 220
```

# 命令式 (Imperative) v.s 宣告式 (Declarative)

在前面介紹時，說明了 functional programming 強調**程式執行的結果**而非**執行的過程**，這對應到了兩種程式語言的思考方式

- **命令式 Imperative**：強調的是執行過程，通常會暴露非常多細節，比較具象
- **宣告式 Declarative**：強調的是執行結果，在思考過程中會隱藏細節，比較抽象

具象的好處是我們可以比較容易看到程式運作的過程和所有細節；而抽象的最大的好處正好相反，是**隱藏細節**；可以想想看當我們想要快速理解一本書中介紹些什麼東西，最快的方式是什麼？相信大多數人都會接受比起直接從正文一頁一頁看起，先閱讀目錄是比較好的方法，透過目錄可以讓我們對於一本書整體想傳達的知識有個基本認知，甚至可以協助我們快速判斷需不需要繼續閱讀下去。

在程式開發也是一樣，如果我們用「目錄」的概念 (也就是 declarative 宣告式的概念) 去寫程式，就會變成如下：

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 以下步驟呼叫的 even、square、sum 在閱讀時不用計較實作細節
// 濾出偶數值
const evenData = even(data);
// 計算平方值
const evenSquareData = square(evenData);
// 加總計算
const sumResult = sum(evenSquareData);

console.log(sumResult);

// 懶得每次都訂一個變數名稱裝資料的話，也可以寫成
console.log(sum(square(even(data))));
```

比較一下前面 imperative 式的寫法：

```typescript
for (let i = 0; i < data.length; ++i) {
  const value = data[i];
  if (value % 2 === 0) {
    sum.value += value * value;
  }
}
```

雖然程式碼行數變多了，但整體閱讀起來是不是覺得 declarative 式的寫法好懂非常多啊！至少我們不用去思考 `for` 和 `if` 是做些什麼的，只要從 function 名稱做基本推斷就可以了。思考方式也很容易變成圖解：

{% asset_img 04.jpg %}

可以看到每個 function 都是一個簡單的「運算單元」，都有單一的 input 和 output，最後資料「漸進式」的變成了我們想要的結果。

當發生 bug 時，也只需要針對每個 function 的**結果**去判斷問題是否在該 function 裡面就好，當習慣這種寫法後，真的會覺得程式的撰寫跟閱讀起來都會非常過癮啊！！

前面所有隱藏的實作，我們都是用 `for` 和 `if` 來處理資料，如果是熟悉 JavaScript 陣列處理相關 API 的人，應該知道 `filter`、`map` 和 `reduce` 這三個 API，其實也是幫助我們把細節處理變得更加 declarative，接下來我們把實作細節也從 `for` 和 `if` 中解放：

```typescript
// 把原來細節的處理也變得更加 declarative
const even = (inputArray: number[]) => {
  return inputArray.filter(item => item % 2 === 0);
};

const square = (inputArray: number[]) => {
  return inputArray.map(item => item * item);
};

const sum = (inputArray: number[]) => {
  return inputArray.reduce((previous, current) => previous + current, 0);
};
```

有沒有發現，原來我們平常就默默的在使用 functional programming 的一些觀念實作程式啦！

其實，如果你覺得特地把 `even`、`square` 和 `sum` 抽出來很囉唆，也可以直接寫成：

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = data
  .filter(item => item % 2 === 0)
  .map(item => item * item)
  .reduce((previous, current) => previous + current, 0);
console.log(result);
```

依然是很宣告式的寫法，對於情境不複雜的情況來說，也很 ok 的！`filter`、`map` 和 `reduce` 本身設計已經幫我們隱藏了走訪每個陣列值的細節，將處理陣列值的實作方式交給我們自己決定，而這些實作要開放到什麼程度，或是否要隱藏起來，就看實際設計時是否覺得已經夠好閱讀了，或是實作是否太複雜來決定囉！

最後，我們把上述寫法再複雜化一下，假設 `filter`、`map` 和 `reduce` 內目前的實作邏輯很複雜，我們可以把這些實作邏輯再次抽出來：

```typescript
const byEven = item => item % 2 === 0; // 假設它很複雜
const toSquare = item => item * item; // 假設它很複雜
const sumTwoValues = (value1, value2) => value1 + value2; // 假設它很複雜
```

最後程式就只剩下：

```typescript
const result = data
  .filter(byEven)
  .map(toSquare)
  .reduce(sumTwoValues, 0);
console.log(result);
```

是不是就像在閱讀一篇文章一樣，而非在閱讀複雜邏輯的程式碼啦！！

{% note info %}

其實不管複雜或簡單的邏輯，都建議將各種「意圖」抽成一個一個小 function，最後再一口氣組合起來，爽度絕對是爆表啊！！

{% endnote %}

程式碼：https://stackblitz.com/edit/mastering-rxjs-09-functional-programming-intro-declarative

# 本日小結

今天的文章中把 functional programming 的一些基本觀念介紹了一輪，讓我們對 functional programming 的整體輪廓有了比較明確的概念；應該不難發現透過 functional programming 的觀念可以幫助我們打造出更好理解及維護的程式，當然通常 functional programming 的寫法效能會相對比較差，但在現今運算技術越來越強的情況下，很多時候這些差異是可以被忽略的 (0.03 秒執行時間是 0.01 秒的三倍，但通常是感覺不出來的)，在沒有明顯效能的考量下，誠心建議也推廣大家使用這種 functional programming 的思考方式來寫程式，以寫出更加穩固的程式碼喔！

要撰寫 functional programming，這些觀念非常重要：

- 撰寫 pure function，盡量避免 side effect，讓除錯更加容易
- 善用 higher order function，將部份實作委外，讓程式更有彈性
- 使用 lamda 寫出更簡短的 function
- 宣告式 (declarative) 思考，將程式步驟拆成更小、更明確運算單元，讓程式更好閱讀

而透過這些 functional programming 的基本觀念，還能組合出更多有趣的應用，明天就讓我們明天再來介紹一些常見的 functional programming 技巧吧！
