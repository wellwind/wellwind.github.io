---
title: "[NgRx 速成班] 簡介 NgRx"
date: 2022-04-17 11:47:42
category:
  - "NgRx 速成班"
tags:
  - Angular
  - NgRx
  - Redux
  - Flux
ogImage: 00.png
---

NgRx 是一個強大，且功能完整的 Angular 狀態管理套件，在我們的應用程式越來越複雜的時候，它很適合用來管理一些全域的狀態，並透過適度的抽象化以及加入一定的規範，降低整體程式的耦合性，打造出更好維護及管理的程式碼。

接下來的一系列文章將會介紹 NgRx 的核心精神，使用方式及相關工具。

<!-- more -->

# 為何要用 NgRx？

要學習一個技術，通常建議先從它的文件中了解背後的問題及提出的解決方法，我們可以先從 NgRx 的核心套件 [@ngrx/store 的文件](https://ngrx.io/guide/store)中來看看 

{% asset_img 01.png %}

來源：https://ngrx.io/guide/store

直接翻譯來看的話，NgRx 是在 Angular 應用程式中使用 RxJS 的「全域狀態」「管理工具」，靈感來自 Redux（React 陣營被應用最廣泛的狀態管理工具）；它提供了一個 Store，作為「乘載狀態的容器」，幫助我們在 Angular 程式中寫出更「高效且具有一致性」的程式碼！

## 全域狀態

什麼是全域狀態呢？先看一下以下程式碼：

```typescript
class Student {
  score = 0;
  
  getScore() {
    return this.score;
  }
  
  setScore(value) {
    if(value < 0) {
      this.score = 0;
    } else {
      this.score = value;
    }
  }
}
```

上述程式是一個類別，其中包含兩個方法，`getScore()` 和 `setScore()`，這兩個方法共用的一個類別的屬性 `score`，這個 `score` 就是一種「狀態」，狀態可能是會隨著時間變化而改變的，在程式裡面，所有的變數都是一種狀態，我們撰寫程式的目的常常就是去取得或改變這些狀態。

可以想像的是，當需要被存取的狀態越多，或是越多人要去存取同一個狀態時，程式就會變得更複雜，越難維護；讓我們把事情變複雜一點，再看一下這個例子：

```typescript
// 全域狀態
let score = 0;

class Student {
  // 取得全域狀態
  getScore() {
    return score;
  }
}

class Teacher {
  // 取得全域狀態
  getScore() {
    return score;
  }
  
  // 設定全域狀態
  setScore(value) {
    if(value < 0) {
      score = 0;
    } else {
      score = value;
    }
  }
}

const student = new Student();
const teacher = new Teacher();

teacber.setScore(100);
console.log(student.getScore());
console.log(teacher.getScore());

teacher.setScore(-100);
console.log(student.getScore()); // 0
```

跟上一段程式碼不同的是，原來是一個類別裡面去控制類別自己的狀態（`score` 屬性），現在這個狀態被拉到更全域的地方了，並且被兩個類別產生的實體所使用，同時，這兩個類別並沒有任何規範與限制，可以隨意的存取 `score` 全域狀態；這會導致我們在追查 `score` 這個全域狀態時，變得更加困難，因為當程式越來越複雜時，我們很難找出是「誰」在「什麼時候」改變了這個狀態。

快速舉個例子，因為 `score` 誰都可以改，因此雖然在 `Teacher` 類別中我們限制了設定成績不可以小於零，但卻無法限制我們額外寫一段程式來讓它變成負數：

```typescript
class Bug {
  setScore(value) {
    score = value;
  }
}

const bug = new Bug();
bug.setScore(-100); // -100
```

可以看到我們輕易的就把這個成績不可以小於零的規則給破壞掉了，在現實中我們當然不會刻意去寫一個破壞規則的程式，但我們卻無法避免「不小心」寫出破壞規則的程式，結果就是花費大量的時間去找問題（bug）。

因此在設計過程中，我們可以適當地加入一些具有管理規則的程式，並限制其他程式的使用方式，來避免一些 bug 的發生，也更容易追查問題。

## Store 容器

`@ngrx/store` 提供了一個容器，幫助我們存放所有前面提到的全域狀態，並提供一致的方法來進行存取，也就是我們限制了存取的「位置」和「方式」藉此來達到一定程度的控管；讓我們撇開套件，先想想看如何用一個容器來管理這些全域狀態，我們可能會寫出這樣的程式：

```typescript
class StudentStore {
  private store;
  
  getStore() {
    return this.store;
  }

  setScore(value) {
    if(value < 0) {
      this.score = 0;
    } else {
      this.score = value;
    }
  }
}

const studentStore = new StudentStore();
```

我們建立了一個裝載學生成績的容器，並將成績的實際資料封裝起來，未來想要取得成績，只能夠過這個容器的 `getScore()` 方法；通樣的，如果要修改成績，也只能透過 `setScore()` 方法；這樣做有幾個好處：

1. **更具有一致性**：在開發過程中，我們會限定其他程式存取狀態的方法，其他程式只要直接使用就好，不過去管它背後的實作邏輯，更不用擔心自己要如何實作這些邏輯
2. **更好追查問題**：當我們要查是誰存取了這個全域狀態，我們可以直接搜尋是誰呼叫了 `studentStore.getScore()` 或 `studentStore.setScore()` 即可；當存取狀態有 bug 時，也只需要修改這兩個方法即可
3. **更穩固的規則**：由於修改成績只能透過呼叫 `studentStore.setScore()`，因此我們只需要把規則寫在這裡面，就不用擔心規則配破壞了
4. **更具有擴充性**：如果今天在特定情況要成績可以小於零，原來的 `setScore()` 無法使用怎麼辦？寫一個新的 `negativeScore()` 就好了，不用擔心原來的規則被破壞，又能夠輕易加上新的規則

原本程式的三個類別，都會從「直接相依全域狀態」變成「相依一個存放狀態的容器」：

```typescript
class Student {
  getScore() {
    return studentStore.getScore();
  }
}

class Teacher {
  getScore() {
    return studentStore.getScore();
  }
  setScore(value) {
    return studentStore.setScore(value);
  }
}

class Bug {
  setScore(value) {
    return studentStore.setScore(value);
  }   
}

const student = new Student();
const teacher = new Teacher();
const bug = new Bug();

teacher.setScore(100);
console.log(student.getScore()); // 100
teacher.setScore(-100);
console.log(student.getScore()); // 0
bug.setScore(-100);
console.log(student.getScore()); // 0 (沒有管理時，這裡會變成 -100)
```

## 限制自由帶來穩定

從上面的範例程式可以看到，只要附加一定程度的抽象，把一些細節包裝起來，我們就可以避免掉很多不必要的問題，當程式發生 bug 時要追查也會變得更加簡單，同時可以要求所有人使用更加具有「一致性」的方法去處理資料；這就是管理可以帶來的好處，雖然不再能自由地修改狀態，但透過限制自由，卻可以達到更穩定、好追蹤的效果！

當然，上面的程式還有許多可以改善的地方，透過 NgRx 的管理機制，可以讓我們把各種「存」「取」狀態的方式都抽象化，提供一致的 SOP，確保團隊內都可以用差不多的寫法來管理狀態，以寫出穩定、更加一致的程式碼。

{% note info %}

NgRx 就是 SOP

{% endnote %}

## SHARI 準則

講了這麼多好處，到底什麼時候適合用 NgRx 呢？這就是非常主觀以及吃經驗的問題了，不過 NgRx 文件中提供了一個 SHARI 準則可以參考：

資料來源：https://ngrx.io/guide/store/why#when-should-i-use-ngrx-store-for-state-management

以下做個簡單的截取，不算是正式的翻譯，實際還是以文件中的說明為主；當你覺得有以下狀況時，可以考慮使用 NgRx

- **共享（<u>S</u>hared）**：狀態會在許多的元件和服務之間共用
- **混合（<u>H</u>ydrated）**：狀態除了在程式中，也會混和儲存在外部如資料庫之類的外部儲存體
- **可用性（<u>A</u>vailable）**：當頁面（路由）重新進入時，原來的狀態可以繼續使用
- **檢索（<u>R</u>etrieved）**：狀態需要在 side effect 相關程式被檢索
- **影響（<u>I</u>mpacted）**：狀態會被其他來源操作影響

這個準則來自 2018 年的 Angular Connect 研討會，影片支援：

<iframe width="560" height="315" src="https://www.youtube.com/embed/omnwu_etHTY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# NgRx 資料流

了解 NgRx 的目的，並且確定要使用 NgRx 之後，當然就需要知道實際上 NgRx 的運作原理了，NgRx 將一般的資料流程拆成好幾個角色，每個角色專注在自己該做的事情

{% asset_img 00.png %}

{% note warning %}

這張圖非常重要！建議多看幾遍，把它的流程記下來，實際上在寫程式時也可以持續的對照圖片，理解資料的流向，之後在實際示範程式碼時，也會持續對照這張圖。

{% endnote %}

## NgRx 核心角色

圖中的 Component 與 Service 是 Angular 內的單元，其他 NgRx 的角色有

- **Store**：用來存放所有狀態的地方
- **Selector**：從 Store 取得實際上想要的資料
- **Action**：定義會改變 Store 的行為，但不實際改變 Store 內容
- **Reducer**：實際上改變 Store 內容的程式
- **Effects**：不在 `@ngrx/store` 套件內，而是被單獨到 `@ngrx/effects` 套件；用來管理 Side Effect 的行為

透過這樣的角色拆分，針對狀態的處理就會變成

- 當 Component 要取得狀態資料是，並不是直接從 Store 拿資料，而是透過寫好的 Selector 拿資料
- 當 Component 要改變狀態資料時，並不是直接修改 Store，而是分配（Dispatch) 一個 Action，並由 Reducer 根據這個 Action 的內容來改變狀態
- 有 Side Effect 的行為時，則是透過 Effects 這個角色，根據分配過來的 Action 決定如何處理，處理完成後再分配另外一個 Action，讓 Reducer 來改變狀態

我們在撰寫程式的過程，就會開始把所有狀態、行為和邏輯拆到這些角色中，之後在 Component 內就會變得很單純

- **讀取狀態**：從 Selector 拿資料就好
- **改變狀態**：分配 Action 就好

其他的實作邏輯都被包裝到 Reducer 和 Effects 裡面去了，因此在 Component 內的程式就會簡短到不可思議，單純看 Component 時，我們只需要知道它要拿什麼資料來顯示，以及他會做什麼事情就好，背後的細節完全不用管，因此在看 Component 程式時就會很容易快速地上手！只有在維護程式或改 bug 時在往後面的邏輯去追就好

{% note info %}

若有妥善分工，甚至會變成負責設計元件的人只要確認事情有做就好，當確定有做元件該做的事情沒錯後，就去找負責 Reducer 或 Effects 的同事來看是不是背後處理資料的邏輯寫錯了

{% endnote %}

## 單向資料流

除了這些角色外，也可以從箭頭看到所有的資料流都是單向的，也就是說：

- 資料會從 Store 流向 Selector，Selector 不會傳遞任何資料到 Store
- Component 會透過 Selector 得到狀態，但不會透過 Selector 更改狀態
- Component 會透過 Action 改變狀態，但不會從 Action 得到狀態
- Action 會傳遞資料給 Reducer，Reducer 再去改變 Store，不會發生 Reducer 傳資料給 Action 的情況
- Effects 看起來是雙向，但實際上是兩個單向；Effects 會先根據一個 Action 來決定要不要進行 Side Effect 的操作，操作完成後，再分配另外一個 Action 去改變狀態

當所有資料流向都很單純，我們要追查問題就會變得很簡單

- 讀取狀態有問題就往讀取狀態那條資料流（Selector）追查
- 寫入狀態有問題就往寫入狀態那條資料流（Reducer）追查

# NgRx 的缺點

講了這麼多，NgRx 難道沒有缺點嗎？實際上當然還是有的，我自己主觀認為的缺點有：

- **學習曲線**：NgRx 底層的觀念是來自 Redux，雖然我們前面提到的資料流程基本上也就是 Redux 的流程，但 NgRx 又加上了 RxJS，也就是對於 RxJS 熟悉也是使用 NgRx 的一大加分項，加分項不代表必要項，但也確實讓整個 NgRx 看起來比 Redux 龐大不少
- **檔案數量**：NgRx 將一個資料流程拆成了很多角色，也就代表我們需要更多的檔案來撰寫這些角色相關的程式碼，這可能造成剛開始不熟悉架構時，不太容易找到對應角色的檔案；之後我們會提到使用 NgRx 的 schematics 來改善這個問題

# 本日小結

NgRx 是一套分常強大的 Angular 狀態管理工具，也因為它的強大，也讓不少人覺得比較抽象，因此今天先把一些重要的觀念和預期達到的目地訴說清處，藉此讓我們來判斷是否真的需要在專案中使用 NgRx，NgRx 也提出了一個 SHARI 準則，協助我們判斷是否真的需要使用 NgRx 這個工具。

決定要使用 NgRx 之後，我們也學習了 NgRx 重要的資料流程與角色，所有角色間的互動都是單向的資料流，而單向的資料流可以幫助我們把大步驟拆成小步驟，減少程式種每個操作所要負擔的邏輯。

剛開始可能還是會對這些角色感到抽象不理解，不過接下來幾篇文章我們將會一步一步來看每個角色的實際程式碼，以及跟其他角色的互動，可以在隨時回來對照 NgRx 的資料流程圖，慢慢的你就會發現 NgRx 實際上是個非常漂亮的設計啦！


