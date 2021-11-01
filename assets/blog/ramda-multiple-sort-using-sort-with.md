---
title: "[Ramda] 使用 sortWith 輕鬆達成多欄位排序條件"
date: 2021-10-10 12:21:01
tags:
  - ramda
  - sortWith
---

多欄位排序是一件不太困難，但也有點麻煩的事情，雖然 JavaScript 本身提供的 `sort()` 就可以達到目標，但寫起來就是醜醜的，而透過 Ramda 的 `sortWith()` 就簡單得多，而且更加好閱讀，今天就來如何使用 `sortWith()` 打造更好閱讀的排序程式。

<!-- more -->

範例程式：https://stackblitz.com/edit/ramda-sort-with-demo

# 先看看資料

假設有一系列的學生資料，我們希望能依照成績進行排序，條件為「國文由低到高、英文由高到低、數學由低到高」，資料如下

```typescript
// 條件：chinese 遞增、english 遞減、math 遞增
const data = [
  { name: 'Student A', chinese: 85, english: 95, math: 80 },
  { name: 'Student B', chinese: 80, english: 90, math: 100 },
  { name: 'Student C', chinese: 90, english: 100, math: 60 },
  { name: 'Student D', chinese: 85, english: 80, math: 75 },
  { name: 'Student E', chinese: 85, english: 95, math: 85 }
];
```

先主觀看一下內容，由於第一個條件為「國文由低到高」，因此明顯地 `Student B` 會排在最前面，而 `Student C` 會排在最後面。

接著 `Student A`、`Student D` 和 `Student E` 因為國文成績同分，所以繼續看「英文由高到低」的條件，`Student D` 會排在最後面。

由於 `Student A` 和 `Student D` 英文也同分，最後看「數學由低到高」條件，得到 `Student A` 會在 `Student E` 前面。

因此最終排序結果為：

```typescript
// 目標答案
// [
//   { name: 'Student B', chinese: 80, english: 90, math: 100 },
//   { name: 'Student A', chinese: 85, english: 95, math: 80 },
//   { name: 'Student E', chinese: 85, english: 95, math: 85 },
//   { name: 'Student D', chinese: 85, english: 80, math: 75 },
//   { name: 'Student C', chinese: 90, english: 100, math: 60 }
// ]
```

# 單純使用 sort()

其實 JavaScript 內的 `sort()` 本身就能幫助我們解決問題：

```typescript
const result1 = [...data].sort((a, b) => {
  // 針對國文成績排序
  if(a.chinese > b.chinese) return 1;
  if(a.chinese < b.chinese) return -1;

  // 國文成績相同，再針對英文成績排序
  if(a.english > b.english) return -1;
  if(a.english < b.english) return 1;

  // 英文成績相同，則最後針對數學成績排序
  if(a.math > b.math) return 1;
  if(a.math < b.math) return -1;
});

console.log(result1);
```

由於 JavaScript 的 `sort()` 會針對陣列本身直接排序，但我期望的是拿到排序結果而非把陣列直接排序，因此使用 `[...data]` 拿到一個新的陣列，再針對這個新陣列來排序。

`sort()` 內的排序條件內是先依照國文成績比較大小，來決定排序順序，只有比較 `<` 和 `>`，當國文成績一樣時，就會往下執行到英文成績的比較，以此類推比完所有成績。

其實沒多難，但裡面出現了很多的 `if`，另外對於不習慣撰寫 `sort()` 條件的人來說，還需要理解回傳 `1` 和 `-1` 分別是代表怎樣的排序方式，閱讀上比較困擾。

# 使用 Ramda 的 sortWith

`sortWith` 可以幫助我們依照多個條件來進行排序，每個條件都是一個比較資料用的 function，這個 function 可以使用 `ascend()` 和 `descent()` 來進行比較，而針對取得比較用的欄位，則可以使用 `prop`；例如針對國文成績由小到大排序的比較 function：

```typescript
import { prop, ascend } from 'ramda';

const chineseAscend = ascend(prop('chinese'));
console.log(chineseAscend(data[0], data[1])); // 1
console.log(chineseAscend(data[1], data[2])); // -1
```

因此只要準備好不同的欄位條件順序，帶入 `sortWith()` 即可：

```typescript
import { sortWith, prop, ascend, descend } from 'ramda';

const chineseAscend = ascend(prop('chinese'));
const englishDescend = descend(prop('english'));
const mathAscend = ascend(prop('math'));

const sortScore = sortWith([
  chineseAscend,
  englishDescend,
  mathAscend
]);
const result2 = sortScore(data);

console.log(result2);
```

我們可以直接把 `asecnd(prop('chinese'))` 理解成「依照中文成績遞增」。

而套用 `sortWith()` 的 `sortScore` function 也可以直接閱讀成

「依條件排序(`sortWith`)：中文遞增(`chineseAscend`)、英文遞減(`englishDescend`)、數學遞增(`mathAscend`)」。

可讀大大提升了！

## 同場加映：由外部設定排序條件

剛剛都是把排序條件先寫成 function，如果要提供一個多欄位排序的共用功能，且希望使用的人可以盡可能簡單設定就好而不用去理解 ramda，可以考慮額外抽成獨立 function，帶入設定好的排序條件即可，如：

```typescript
import { sortWith, prop, ascend, descend, map, ifElse } from 'ramda';

const sortWithColumns = (sortColumns, data) => {
  const buildSortFn = sortColumn => ifElse(
    () => sortColumn.sort === 'asc',
    ascend(prop(sortColumn.column)),
    descend(prop(sortColumn.column))
  )

  const sortFns = map(buildSortFn, sortColumns)

  return sortWith(sortFns, data)
}

const columns = [
  { column: 'chinese', sort: 'asc'},
  { column: 'english', sort: 'desc'},
  { column: 'math', sort: 'asc'}
];

const result3 = sortWithColumns(columns, data);
```

# 參考資源

* [Sorting an array by multiple criteria with vanilla JavaScript](https://gomakethings.com/sorting-an-array-by-multiple-criteria-with-vanilla-javascript/)
* [Ramda - sortWith](https://ramdajs.com/docs/#sortWith)
* [Ramda - prop](https://ramdajs.com/docs/#prop)
* [Ramda - ascend](https://ramdajs.com/docs/#ascend)
* [Ramda - descend](https://ramdajs.com/docs/#descend)
