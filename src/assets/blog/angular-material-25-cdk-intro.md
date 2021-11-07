---
title: "[Angular Material 完全攻略]Angular CDK(1) - 基礎介紹"
date: 2018-01-12 20:01:45
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

我們即將要邁入新的篇章－**Angular CDK**，我們今天先不來寫程式，而是大致的把目前(5.0.0)Angular CDK的架構做一個整體的介紹，讓讀者們能先在心中有個藍圖，在未來學習Angular CDK應該會更有感覺！

<!-- more -->

CDK是**component development kit**的簡寫，顧名思義就是「**用來開發元件的工具**」，因此不難想像Angular CDK就是用來幫助我們開發各種元件的好用工具。建議讀者可以先看過2017年在奧蘭多的Angular Mix大會上的一段關於Angular CDK介紹的影片：

<iframe width="560" height="315" src="https://www.youtube.com/embed/kYDLlfpTLEA" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

https://www.youtube.com/watch?v=kYDLlfpTLEA

-   [投影片](https://www.google.com/url?q=http://g.co/ng/mix17-cdk&sa=D&ust=1514819320781000&usg=AFQjCNGKIdtAGQjeTzzkY5H8GCO4ki-JTQ)
-   [影片的範例原始碼](https://github.com/jelbourn/mix17-cdk-demo)

當然，如果你不想看英文或沒有時間看影片，也可以直接往下看，以下內容將會以上段影片及投影片為主要參考，來介紹Angular CDK。

## 簡介Angular CDK

### 故事的起源

故事是這樣的，Angular Material團隊在開發這套library時，對於品質有許多的堅持，這是我們都已經知道的事情；而在開發時，團隊發現一件鐵一般的事實：「許多元件都有部分的功能是共用的！」如下圖：

{% asset_img 01-angular-cdk-slide-01.png %}

就算不是如同Angular Material開發團隊般擁有頂尖的人才，只要是有一定經驗的開發人員，就算不公開成人人可用的library，將這些共用的部分抽取出來，絕對是一件再正常不過的事情；而抽出來的部分，就是**Angular CDK**。

{% asset_img 02-angular-cdk-slide-02.png %}

### Why CDK？

但是我們為什麼需要使用Angular CDK呢？畢竟就算不使用Angular Material，我們還有很多現成的元件庫可以使用不是嗎？更不用說不是每個人都需要Material Design了！如下圖，已經有許多知名的Angular元件庫可以使用：

{% asset_img 03-angular-component-libries.png %}

但是，儘管有很多現成好用的元件庫，在專案中我們幾乎不可能避免**要依照需求設計自己的元件庫**

{% asset_img 04-angular-cdk-slide-04.png %}

也因此，我們需要一套library，**它不需要華麗的元件，但要能夠提供各種模組，來幫助我們依照需求來打造各式各樣的元件**。

{% asset_img 05-angular-cdk-slide-05.png %}

基於以上原因，Angular Material團隊便將他們開發過程中共用的部分，提煉出一個共用的類別庫，來解決上面提到的問題，這也就是Angular CDK啦！

## Angular CDK目前擁有的功能

在Angular Material的文件中，上方有一個CDK的連結，點進去可以看到目前Angular CDK主要分成兩大類，分別是**Common Behaviors和Components**：

{% asset_img 06-cdk-in-doc.png %}

### Common Behaviors內的功能

Common Behaviors主要是一些常見的互動需求，這裡面的內容通常不會直接影響畫面或元件的呈現，但卻與它們的行為息息相關。

{% asset_img 07-cdk-common-behaviors.png %}

目前包含了：

-   **Accessibility**：包含了一系列的工具，讓元件的操作更加容易，也更容易讓螢幕閱讀器的功能理解。
-   **Observables**：主要是替基於web平台提供的observers提供一層包裝，讓使用上更加容易。
-   **Layout**：打造響應式網頁(RWD)必備的一套工具，用來判斷目前瀏覽器配置的變化，以回應不同的呈現需求。
-   **Overlay**：提供一些方法來在螢幕上呈現一個操作畫面(panel)，是dialog類型元件的核心。
-   **Portal**：提供我們在呈現template或component上更加彈性的功能；對於需要動態載入的功能非常有用。
-   **Bidirectionality**：主要用來處理RTL和LTR變化。
-   **Scrolling**：針對捲軸捲動時的互動，提供了一些處理方法。

### Components內的功能

Components內主要就是在設計些常用元件時的輔助directive，替我們的元件直接加上某個功能。

{% asset_img 08-cdk-components.png %}

目前包含：

-   **Table**：方便我們建立一個data table。
-   **Stepper**：方便我們建立一個精靈功能。

在Angular Material中我們的Table和Stepper就是建立在這兩個Angular CDK的directive在進行擴充，因此這兩個功能我們幾乎可以說是已經學習過了，因此之後的文章不會介紹，不過直接上文件去看，在比對一下Angular Material本身的元件介紹，要上手也是很容易的！

## 本日小結

今天我們簡單的對Angular CDK做了介紹，也把目前Angular CDK所能夠提供的功能部分大致說明了一下；讀著們可以想想同樣的類似的功能，若自己要寫程式實作需要花多少時間，就能理解若有人幫我們都設計好，只要直接使用是多麽方便的一件事情！

在之後介紹每個功能時，也可以一樣的想想這樣的功能，不使用CDK我們要寫出多少程式碼，相信會對於Angular CDK有更加的印象深刻。

明天開始，我們就來介紹這些強大的CDK吧！

順便置入一下筆者前陣子在[線上Angular讀書會](https://www.facebook.com/groups/angularstudygroup/)介紹Angular CDK的影片

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZxY3QoGkLhQ" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

https://www.youtube.com/watch?v=ZxY3QoGkLhQ

## 相關資源

-   [Angular CDK: The Component Dev Kit by Jeremy Elbourn](https://www.youtube.com/watch?v=kYDLlfpTLEA) | [投影片](https://docs.google.com/presentation/d/1inxmh3WKTVUmpqGfupkxjR9klysIVvlkRnA81ByBqbk/preview?slide=id.p)
-   [Angular Material - CDK - Categories](https://material.angular.io/cdk/categories)
-   [Angular讀書會 - Angular CDK簡介](https://www.youtube.com/watch?v=ZxY3QoGkLhQ)
