---
title: "[Angular Material 完全攻略]學習Angular Material的正確姿勢"
date: 2018-01-21 19:00:03
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
---

今天來聊聊筆者這些日子學習Angular Material的方式，希望可以幫助大家能以更快的速度深入Angular Material，並能靈活運用在自己的專案當中。

在筆者的經驗中，Angular Material要學得好，除了需要一定程度的Angular知識以外，另外還有Angular Material三寶：**文件、demo app和source code**。

<!-- more -->

## 透過文件學習Angular Material

不論任何技術，想要快速地上手，**文件絕對是不可或缺的一部份**，Angular Material的文件本身已經提供不少詳細的說明，但在目前還稍嫌不完整，但要幫助初學者上手已經非常足夠了。

Angular Material的文件主要分成兩個部分

-   **Guides**：包含了最基礎的「Getting started」，讓我們能快速開始使用Angular Material；還有一些持續在增加中的文章，補充Angular Material各種功能可以加強的部分。

    {% asset_img 01-angular-material-doc-guides.png %}

-   **Components**、CDK：Angular Material的核心功能，包含了元件(Components)與CDK，在元件頁面，詳列了目前所有Angular Material可以使用的元件功能，每個功能的文件都包含了「Overview」、「API」與「Examples」三個頁籤；CDK則只有「Overview」和「API」

    {% asset_img 02-angular-material-doc-components.png %}

    -   在Overview頁籤中，我們可以看到整個功能的基本使用方式，以及一些常見可以設定的屬性，方法等等。
    -   在API頁籤中，則是該功能的module下所有的元件、service和directives等等，以及詳列所有相關的屬性和方法，對於要進一步使用元件的功能，這個頁面是不可或缺的參考資料。
    -   Examples則是一些簡單的範例和程式碼。

在Angular Material的文件中，包含了許多基本的範例DEMO，如下：

{% asset_img 03-angular-material-doc-example.png %}

右方有兩個按鈕，第一個按鈕是直接檢視相關的原始碼，不過目前大部分點開原始碼出現的程式，版本都不正確，都是`md-xxxx`而不是`mat-xxxx`，這點需要非常小心：

{% asset_img 04-angular-material-doc-example-code.png %}

再旁邊還有一個按鈕，則會跳到[StackBlitz](https://stackblitz.com/)的網站，並顯示這個範例的程式碼，並且放在StackBlitz網站的程式碼都是正確的！~~方便我們copy/paste~~

只要好好的把握文件的使用脈絡，要能夠掌握大部分Angular Material的功能，基本上絕對不是問題！

## 透過demo app學習Angular Material

Angular Material的原始碼本身包含了一個demo app，這個demo app具有非常多的範例程式，如果讀者在閱讀文件時覺得不太知道該如何應用，可以直接看看demo app的程式，會有很多收穫！

使用demo app的方法很簡單，首先我們把整個material2的專案都clone下來：

```shell
git clone https://github.com/angular/material2.git
```

接著進入專案，還原npm套件後，執行`demo-app`的script

```shell
cd material2
npm install
npm run demo-app
```

這時候在進入http://localhost:4200/，就能夠看到一個基本的demo頁面囉

{% asset_img 05-angular-material-demo-app-1.png %}

點擊左上方的選單按鈕，就能夠看到所有的功能demo連結

{% asset_img 06-angular-material-demo-app-2.png %}

至於demo app的原始碼，則是放在material2專案目錄的`src/demo-app`下面，讀者可以在裡面找到許多範例程式碼，也能夠直接修改裡面的程式，看看demo app會對應產生什麼變化。

## 透過source code學習Angular Material

雖然直接看原始碼通常是最後手段，但不得不說Angular Material的原始碼寫得非常漂亮，可度性很高，如果在看過demo app後還是對於使用上有所疑惑，或是單純好奇某個元件功能是怎麼辦到的時候，就是閱讀原始碼的時機啦！

Angular Material的主要元件功能程式碼都方放在`src/lib`中，另外Angular CDK的原始碼則是放在`src/cdk`。

偶爾多看一下Angular Material的原始碼，不僅能更加**深刻理解Angular Material背後運作的原理，更能從中學習到許多元件功能設計的思維**，可以說是一舉數得啊！

## 其他學習資源

上面是筆者在學習Angular Material時，最常使用的三個資源，下面再補充幾個學習Angular Material不可錯過的好去處：

-   Angular Taiwan [Facebook社團](https://www.facebook.com/groups/augularjs.tw/)  | [論壇](https://forum.angular.tw/)：最大的好處，不用多說當然就是裡面所有的人都說中文啦！這裡主要是討論Angular的地方，但是如果對於Angular Material有問題，提出來也是很多高手會回答的！
-   [StackOverflow - Angular Material](https://stackoverflow.com/questions/tagged/angular-material)：StackOverflow應該不用多說，是全世界最大學習各種技術 ~~copy/paste~~ 的最佳來源，卡關的時候，先來這裡找找就對了！
-   [Angular Material的issues](https://github.com/angular/material2/issues)：在Angular Material的issues裡面，不會提供某個元件該怎麼用之類的說明，但是卻可以幫助我們確認某些功能是否真的有它的限制，畢竟有時候某些功能無效，不一定都是我們得問題，也有可能是Angular Material本身的限制，甚至是bug，這時候上issues找最準確啦！
-   [Gitter - angular/material2](https://gitter.im/angular/material2)：Angular Material的線上聊天室，遇到問題時，在這裡問問題也是很棒的選擇！

## 本日小結

今天介紹了筆者在學習Angular Material時所使用的資源，這些資源都有很豐富的內容可以學習，只要願意稍微花點時間，相信要成為Angular Material高手絕對不是一件困難的事情！讓我們一起邁向Angular Material大師的偉大航道吧！

## 參考資源

-   Angular Taiwan  [Facebook社團](https://www.facebook.com/groups/augularjs.tw/) | [論壇](https://forum.angular.tw/)
-   [StackBlitz](https://stackblitz.com/)
-   [StackOverflow - Angular Material](https://stackoverflow.com/questions/tagged/angular-material)
-   [Angular Material - issues](https://github.com/angular/material2/issues)
-   [Gitter - angular/material2](https://gitter.im/angular/material2)
