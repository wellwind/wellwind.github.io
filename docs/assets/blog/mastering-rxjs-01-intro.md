---
title: "[RxJS] 打通 RxJS 任督二脈"
date: 2020-09-16 18:00:00
category:
  - "打通 RxJS 任督二脈"
  - "第 12 屆鐵人賽"
tags:
    - RxJS
---

RxJS 是 ReactiveX (又稱 Reactive Extensions，簡稱 Rx) 這個概念的 JavaScript 實現版本；而 ReactiveX 本身的概念是透過組合一些常用的程式技巧，來處理**「非同步」及「串流(或事件)」**情境容易變得很複雜的問題，讓寫出來的程式碼更好理解、也更容易維護。

儘管在近幾年 RxJS 的能見度已經越來越高，但許多人初進入 RxJS 世界就因為它太過抽象，而提早登出；甚至遇過客戶外包時因為害怕接手維護 RxJS，而禁止使用 RxJS 的情境！這是非常令人厄婉的一件事情。

而我自己在比較理解 RxJS 後，則是深深的被其流暢的寫法及可維護性給吸引，開始在公司努力推坑同事使用 RxJS，也因此促成這系列文章，整理出我自己認為比較適合 (推坑成功率比較高？) 的學習路徑，希望幫助大家「打通 RxJS 任督二脈」！

<!-- more -->

# 關於 ReactiveX

ReactiveX 本身只是一個觀念，以及一些作法的規範，讓我們先來看一下 ReactiveX 官網的介紹。

{% asset_img 01.jpg %}

{% note info %}

An API for asynchronous programming with observable streams

{% endnote %}

從一段簡短的介紹可以看到 ReactiveX 使用了「**觀察者 (Observable)**」及「**串流 (Stream)**」的概念，定義了用來處理「**非同步程式 (Asynchronous programming)**」的 API。

再往下捲一點，可以看到 ReactiveX 是組合了三個重要觀念而實做出來的。

{% asset_img 02.jpg %}

{% note info %}

ReactiveX is a combination of the best ideas from the Observer pattern, the Iterator pattern, and functional programming

{% endnote %}

這三個重要觀念分別是：

- 觀察者模式 (Observer pattern)
- 疊代器模式 (Iterator pattern)
- 函式語言程式設計 (Functional programming)

看到這邊，是否已經頭昏了呢？目前整理起來我們會發現整個 ReactiveX 涵蓋幾個重要觀念：

包含兩個**要解決的議題**：

- 非同步程式 (Asynchronous programming)
- 串流 (Stream)

和三個**程式設計的方式**：

- 觀察者模式 (Observer pattern)
- 疊代器模式 (Iterator pattern)
- 函式語言程式設計 (Functional programming)

以上五個主題對於許多程式初學者(甚至是老手)來說都相對抽象很多，都可以獨立寫個數篇甚至數十篇的文章，有些主題就算獨立出一本書來介紹都很有可能！由這麼多個抽象的念組合起來，不難想像 ReactiveX 肯定只會更加抽象！！這也導致了不少初接觸 ReactiveX 的新手沒多久就棄坑投降。

但反過來想，只要能基本掌握 (真的不一定要深入) 這五個重要觀念，就相當於**把 ReactiveX 的內功心法掌握住了**，而掌握了內功心法，之後不管要出什麼招式，都能夠更加得心應手，寫出更加洗鍊、好讀且好維護的程式碼，而在同樣理解 ReactiveX 的人之間溝通，也會更加的容易！

掌握這些基本觀念後，ReactiveX 還定義了一系列非常語意化的**操作符 (Operators)**，方便我們在解決非同步程式、串流等議題時更加容易，這也是 ReactiveX 的一個強大賣點。

關於 ReactiveX，之後會再更深入的介紹。

# 關於 RxJS

實際上 ReactiveX 只是將整體架構定義出來而已，而 RxJS 則是 JavaScript 的實作版本，許多語言都有對應 ReactiveX 的實作版，如 Java、.NET、Swift 等，支援的語言都可以在 [ReactiveX 的 GitHub 上找到](https://github.com/ReactiveX)。

{% note info %}

大概是因為 ReactiveX 初期是由微軟基於 LINQ 基礎提出的，所以只有 [.NET 的實作在另外一個 GitHub respository](https://github.com/dotnet/reactive)。

{% endnote %}

由於 ReactiveX 已經先將規範定義好了，因此可以確保不管是哪種語言，儘管因為語言特性導致使用方式可能會略有不同，但只要給予一樣的輸入，預期的輸出結果基本上一定會一樣！如果發現輸出跟預期的不同，由於這些語言的實作也都是開源的，我們可以輕易地在 GitHub 上發 issue，或去看看這些輸出不一樣背後的理由是什麼。

當然，各種語言的常見的適應情境不同，也因此各種語言會發展出一些各自不同的 API，例如 JavaScript 多半用於網頁程式設計上，所以多了一些語言或情境獨有的處理方式如 Promise、網頁事件等等。

而隨著前端的世界越來越複雜，RxJS 也因此逐漸被更加重視，以現在前端三大框架 Angular、React 和 Vue 來說，在其生態圈也都可以看得到 RxJS 的影子，就算脫離這些框架，也有越來越多機會看到 RxJS 的應用。因此身為前端工程師，多花些心思投資在 RxJS 應該算是不錯的選擇。

在接下來的系列文章中，都會以 ReactiveX 的 JavaScript 實作，也就是 RxJS 為主來介紹。 

{% note info %}

雖然以 RxJS 介紹為主，但還是希望各位能著重在 ReactiveX 的觀念；因此在之後的文章中，若提到 ReactiveX，代表想強調的是觀念，若是提到 RxJS，就會比較偏向實作面。如果沒太大感覺，先當作一樣也是 OK 的！

{% endnote %}

# 關於本系列文章

如同前面所述，只要掌握了 ReactiveX 的基本心法，在使用 ReactiveX 觀念撰寫程式就會更加順利；而本系列文章將以 ReactiveX 的 JavaScript 實作為範例，也就是 RxJS，除了介紹如何使用 RxJS 外，會更加著重於 ReactiveX 的重要觀念，建立足夠的觀念基礎後，再搭配實例說明各種應用情境，希望能幫助大家**打通 ReactiveX 的任督二脈**！

目前規劃會依照以下順序介紹：

1. **RxJS 快速上手 (約 2~3 篇)**：雖然系列文章的目標是希望能建立正確的觀念，但在整個基礎都沒有的情況下，立刻講觀念大概只會加速登出，因此會先以最簡單的方式，介紹 RxJS 的使用方式及重要特色。
2. **RxJS 基礎觀念 (約 3~5 篇)**：ReactiveX 組合了很多抽象觀念，這也是許多人登出的原因，因此這部分會先好好介紹這些抽象觀念，目的不在讓大家精通這些抽象觀念，而是把這些觀念內有用的東西擷取出來，理解它們的優點及解決的問題，以便之後靈活運用到程式的撰寫中。
3. **RxJS 完整觀念 (約 10~20 篇)**：有了基本觀念後，再重新開始認識 RxJS 以及一些重要的進階觀念，接著介紹如何閱讀彈珠圖，最後會介紹各種類型的 operators 使用；Operators 可以說是 ReactiveX 強大的主要原因之一，有了正確觀念後，再來看 operators 會更加得心應手！Operators 數量龐大，不太可能全部都介紹完，因此每篇文章大概會介紹 3~6 個 operators 常用或我自己覺得有趣的。
4. **RxJS 實戰案例 (約 3~5 篇)**：比起前面注重心法，這部分會比較貼近實戰練習，在有正確觀念為基礎的前提下，搭配各種 operators 的組合及花式操作，實際應用到網頁開發上。
5. **RxJS 其他技巧 (約 3~5 篇)**：一些不一定常用，但可能很重要的觀念，像是 scheduler、如何自訂 operators 和撰寫單元測試等等。

對了，關於有些名詞，由於個人覺得中文不一定好翻譯，所以在之後的文章還是會以英文呈現，如串流 (Stream)、操作符 (Operators) 這類，在基礎介紹之後，就會統一使用英文撰寫。

另外，本系列文章使用的 RxJS 版本為目前最新的第 6 版。在撰寫這篇文章時，RxJS 7 已經進入 beta 版，隨時都有推出正式版的可能，如果確定出來了，則會視情況以最新版為主，但相信不會有太大的落差，如果有明顯差別會另外再標注。

# 預備知識

本系列文章希望能盡量以最簡單的方式把 ReactiveX 及 RxJS 相關知識分享出來，因此不會針對每個觀念非常深入的去說明，畢竟這些觀念都有實作好的成果可以讓我們直接使用了，因此重點應該放在對這些觀念的目標及解決的問題有基礎的理解，當然若想要更深入，可以再自行搜尋相關資料。

以 ReactiveX 來說，如同之前提過的，需要理解以下 5 個基本觀念：

- 非同步程式 (Asynchronous programming)
- 串流 (Stream)
- 觀察者模式 (Observer pattern)
- 疊代器模式 (Iterator pattern)
- 函式語言程式設計 (Functional programming)

如果對這些主題有深入理解當然是最好，但有不理解部分也沒關係，在之後的文章我們都會做些基本的介紹，包含基礎觀念及它在 ReactiveX 中需要應用到的地方或需要注意的思考方向。

接下來就是程式語言的實作 JavaScript，本系列文章會使用到：

- TypeScript：有些朋友可能沒那麼喜歡 TypeScript，我會盡可能不要直接把 TypeScript 語法寫進來，也就是盡可能可以直接以 JavaScript 的閱讀方式來理解，大部分的時候除了副檔名外應該根本看不到 TypeScript 的影子。只有在必要的時候，會加入一些 TypeScript 的型別定義。
- ES6 相關語法：包含 arrow function、import / export 的模組化管理等等，這些對於已經習慣使用 JavaScript 開發的工程師來說應該不是難事，因此在文章中我也會直接使用不多做說明，如果各位在閱讀時有疑慮，可以自行上網尋找資料，或在文章下面留言討論。

# 歡迎討論

ReactiveX 確實比較抽象，雖然在理解觀念後它的益處還是大於壞處，但在學習時肯定會遇到一些難以理解的情況，這時有幾個方法可以幫助我們進步：

1. 針對程式碼多撰寫幾次，並仔細思考每段程式的目標，及資料的流向
2. 針對觀念不熟悉的地方加強學習
3. 直接在文章下方留言，我們可以一起討論

也歡迎大家提供自己的理解，藉由更多不同人們的見解，更能找到適合自己的理解方式；也歡迎大家針對文章中觀念有誤或是任何有問題、錯字等等提出來，一起讓這系列文章更加完整^^

# 開賽啦！

這是第四次參加鐵人賽，也是第一次自己開團找朋友組隊報名，組隊真的是很有壓力的一種完賽方式，感謝他們逼迫我加強完賽的決心；以下是這次一起奮鬥的隊友，這次的隊友都大有來頭，也歡迎大家去看看他們寫的文章，以下主題依照加入團隊的時間排序：

- [從巨人的 Tip 看 Angular](https://ithelp.ithome.com.tw/users/20129148/ironman/2979)
- [深入 Azure 雲端服務](https://ithelp.ithome.com.tw/users/20105988/ironman/3068)
- [如何用Laravel寫一個簡單的部落格網站](https://ithelp.ithome.com.tw/users/20105694/ironman/3245)
- [推動資安從0起步邁向70分，不用花大錢也能有聲有色保平安。](https://ithelp.ithome.com.tw/users/20129755/ironman/3256)
- [Azure Serverless 平步青雲，漫步雲端](https://ithelp.ithome.com.tw/users/20130168/ironman/3637)

# 本日小結

不可否認 ReactiveX 及 RxJS 真的是相對抽象很多的東西，希望這系列文章可以幫助大家比較順利的掌握這項技術；或許有些內容需要反覆閱讀才能理解，但只要通了就會是一片廣闊的天空！如果遇到任何問題或心得，也歡迎隨時跟我分享，大家一起朝向 RxJS 大坑邁進！
