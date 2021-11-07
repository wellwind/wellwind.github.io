---
title: "[Angular Material 完全攻略]開始 & 簡介"
date: 2017-12-19 20:54:15
category: "Angular Material 完全攻略"
tags:
  - Angular
  - Angular Material
  - Material Design
---

從Angular第2版正式release後，根據全球最大工程師討論區StackOverflow的統計，從2016開始的Angular討論度就不斷竄升，甚至超越了React，直到了2017年，甚至擺脫了前一代Angularjs的陰影，躍升成為最熱門的前端議題！可以見得Angular這個前端框架確實具有它值得學習的地方，而在2017年底Angular正式邁向第5版，隔天Angular Material就從breaking changes不斷的beta版正式升到趨於穩定的rc版，沒幾個禮拜就直接正式release了！

一個是由Google推出的前端框架，一個是由Google推出的設計語言的Angular實作，兩者結合想必能加乘產生N倍以上的爆發力！接下來的日子，我們將一步一步地**學會所有Angular Material的元件及特性、Angular CDK及一些進階的技巧**，今天第一天就讓我們以比較輕鬆的節奏來認識所有的基礎知識吧！

<!-- more -->

{% asset_img stackoverflow-angular.svg %}

圖片來源：[StackOverflow](https://insights.stackoverflow.com/trends?tags=reactjs%2Cangular%2Cvue.js%2Cvuejs2%2Cangularjs)

## 關於Angular

Angular是由Google推出的前端框架，其熱門程度在前端領域的不用多說，佔有了非常重要的一席之地，有別於著重在view上的React或Vue這類library，**Angular本身就是一個完整的MVC框架**！由於整合了大部分前端常用的套件，開發人員只需要著重在學習如何使用Angular這個架構即可，對於剛入門前端或是由後端轉前端的人來說大幅降低了學習的曲線，**如果本身已經有MVC架構的基本概念，學習上更是如虎添翼**。

### Angular CLI

搭配**Angular CLI**，開發人員能夠以更簡單的方式產生一個基本的專案範本，同時只要下一些簡單的指令即可產生基本的程式碼架構；隨著Angular CLI逐漸的進步，開發的彈性也越來越高，例如[@angular-devkit/schematics](https://www.npmjs.com/package/@angular-devkit/schematics)可以讓我們在團隊中建立共用的範本程式等等，讓開發速度大耀進！

### TypeScript

除此之外Angular主要**以TypeScript作為開發語言**，TypeScript是JavaScript的超集合，能讓我們在開發JavaScript時能以強型別的方式撰寫程式，並在轉譯成JavaScript時自動檢查型別的錯誤，減少runtime時的debug成本；同時TypeScript能讓我們**不斷享受使用最新的語法來撰寫程式的快感**，只需要稍作設定即可把最新的語法轉為比較舊的語法，避免瀏覽器支援度的問題！也由於Angular開了這一槍，讓各種熱門的前端library/framework也陸陸續續有了TypeScript開發的版本，足見TypeScript對於前端世界的影響力也將越來越高！

### 基本門檻

由於本系列文章屬於稍微進階的Angular議題，因此對於Angular基礎的知識將不會有太多的介紹，建議讀者至少具備以下Angular基礎後，在閱讀本系列文章：

1.  了解Angular的MVC架構
2.  使用Angular CLI建立專案並開始開發
3.  懂得如何設計並共用一個component
4.  理解最基本的Angular相依注入的知識，並能實作一個service注入到component之中
5.  有基本的模組化概念
6.  能設定router完成SPA程式

就算沒有以上的知識，也完全不用擔心，網路上也有很多的參考資源，甚至還[有中文版的文件](https://angular.cn/)，只要願意花個幾天時間，要對Angular有基本的認絕對不會是個問題！

當然，如果你有更多前端的相關知識如node、webpack等等，對於學習Angular或Angular Material絕對是加分的要素。

### 相關資源

-   [Angular官方文件](https://angular.io/) | [中文版](https://angular.cn/)
-   [Angular CLI](https://github.com/angular/angular-cli)
-   [TypeScript](https://www.typescriptlang.org/)

## 關於Material Design

Material Design是由Google推出的**設計語言**，也可以把它想像成是一種設計的pattern，把視覺化設計的概念、網頁元件、操作互動等等理論及實作整理出來的設計準則，從元件的配色、陰影到特效都有一定的規則可循，我們能透過這些準則設計出清楚明確且容易使用的使用者介面(UI)，打造更好的使用者經驗(UX)；如果你是Google相關服務的愛用者，又對Material Design有點了解，相信你一定也有發現Google的各種服務在設計上也已經不斷朝Material Design邁進了。

### Material Design的實作

由於Material Design僅僅只是一種設計的準則，不像bootstrap這類css framewrok，有直接的css樣式或javascript library可用，而是交由設計人員依照準則進行實作，偏偏Material Design的設計準則又非常多，一般開發人員不可能有時間依照這些準則一一設計，好在也有許依照Material Design的設計準則開發且open source的專案可用。例如Google官方推出的[Material Design Lite](https://getmdl.io/)和和多平台都支援的[Material Components](https://material.io/components/)，或是由4個亞洲人合力開發出來的[Materialize.css](http://materializecss.com/)等等，都是目前常見的Material Desig實作版本。

當然像是React或Vue這類熱門的前端框架也很容易能夠找到相關的設計套件，透過這些實作套件，**即使是沒有美感的前端工程師也能夠輕易設計出簡單大方，又不失設計感的頁面**。

而身為爸爸同樣是Google的Angular，有一套由官方推出的Material Design套件也不是件奇特的事情，也就是接下來要介紹的[Angular Material](https://material.angular.io/)。

### 相關資源

-   [Material Design官方介紹](https://material.io/) | [中文翻譯](https://wcc723.gitbooks.io/google_design_translate/content/material-design-introduction.html)

## 關於Angular Material

Angular身為Google自家推出的主力前端框架，而Material Design又是Google未來設計的主要方向，自然而然的，也免不了要替Angular量身打造一套Material Design的套件，也就是本系列的主軸－Angular Mateial。

根據Angular Material官方的說法，Angular Material的目標是使用Angular及TypeScript打造出**高品質的UI元件**，同時這些元件必須遵守Material Design的設計標準。

### 高品質的Angular Material

所謂的高品質，對於Angular Material來說包含了以下幾個重點：

-   i18n及a11y：所有Angular Material提供的元件原則上都不會有無法支援多語系的情況，且同時也都能夠可存取性(a11y)的開發，讓所有使用者都能夠輕易與這些元件互動。
-   直覺的API
-   在大部分通用的情況下，是不會有bug的
-   所有的元件都有撰寫良好的單元測試及整合測試
-   可以依照Material Design準則客製化這些元件的細節
-   高效能
-   乾淨的程式碼且所有元件都有清楚的文件及範例

### 追求高品質的後果與成果

從上段介紹可以看到，Angular Material對於品質的要求，從程式碼本身到元件實用性都完全顧慮到了，如果能夠達到這樣的品質，**絕對可以說是目前其他任何Material Deesign套件所望成莫及的程度**！也因此不難想像在beta時期，Angular Material可以說是不斷的breaking change，想必就是為了能夠不斷的往所謂**"高品質"**的目標邁進，這也成了很多想要進入Angular Material世界的人裹足不前的理由；儘管罵聲不斷，但朝著目標邁進的Angular Material在不斷進化的Angular推出第5版後，Angular Material的版本也**從2.0.0-beta一下子大躍進為5.0.0-rc**！同時才幾個禮拜後的2017/12/06邁入正式版，在這個剛release的時候進入學習既能避免不斷breaking changes的傷害，又能夠 ~~跟別人炫耀~~ **贏在起跑點**，實在是個很不錯的進入時機！這也成了這次鐵人賽想要以Angular Material為目標的主要原因！

## 系列文章規劃

本系列的文章將會以[Angular Material的官方文件](https://material.angular.io/)為主要依據，一步一步帶領讀者們學習利用目前(5.0.0)所有的元件(共30個)來打造一個具備**設計質感**後台網站(dsahboard)，並完成一些簡單的頁面，並會進一步介紹功能強大好用的Angular CDK，時間允許的話，再介紹一些關於Angular Material的進階技巧！初步的規劃有如下3個單元：

1.  **完全掌握Angular Material**(約20天)：這段時間會介紹所有的Angular Material元件，並穿插在不同功能之中，除了設計一個基本的後台架構以外，也會設計出簡單的問卷表單、部落格和郵件收件夾的畫面，讓讀者能對所有的Angular Material元件都能夠有一定的掌握度，並懂得如何依照需求變化出不同的呈現方式。這個單元會切成5個子單元，分別是**基礎篇、Dashboard篇、問卷表單篇、部落格篇和收件夾篇**。
2.  **介紹Angular CDK**(約5~10天)：Angular CDK(Component Development Kit)是Angular Material在設計元件時拉出來的共用程式，用來解決許多元件設計上的問題，**幫助開發人員即使不使用Material Design，也能夠透過Angular CDK設計出高品質的元件或互動功能**，元件開發工具(Component Development Kit)這個詞實在是當之無愧！在這單元中我們會透過Angular CDK來解決一些上個單元後台網站不足的部分，讓整個網站更加的豐富。
3.  **進階的Angular Material開發技巧**(約5天，狀況允許的話能多寫就多寫)：介紹一些**客製化Angular Material**的方式，除了直接使用Angular Material提供的元件以外，要讓網站具有Material Design的設計質感還有很多的方式，也會在這個單元一併介紹。

之後的程式碼將會統一放在[GitHub](https://github.com/wellwind/it-ironman-demo-angular-material)上，並以天為單位建立分支(day-02, day-03, ...ect)，方便大家隨時切換到每一天的記錄去了解程式碼的變化，相信對於學習會更有幫助。

## 討論是進步的起點

關於這系列的文章，是筆者個人對於Angular Material及Angular CDK研究後的整理，希望能幫助讀者更容易進入Angular Material的世界，如果有任何問題，歡迎隨時在留言提出討論，彼此學習，互相成長；若發現有任何詞句不順、錯別字、或是觀念錯誤等等，也一樣歡迎提出來，讓整個系列文章的完整度更高！幫助更多人進入這個美妙的世界！！

## 本日小結

今天的文章目標主要是讓大家對於Angular、Material Design及Angular Material有個初步的理解，Material Design本身是個非常棒的設計概念，以筆者有限的能力可能無法很完成的將精髓傳達給每個人，建議大家有空可以直接多去看看Material Design的設計風格，時間允許的話也可以大致瀏覽一下Material Design的設計準則，對於之後學習Angular Material開發時會更加的有感覺！

明天開始就讓我們前往高質感的前端設計之路邁進吧！！
