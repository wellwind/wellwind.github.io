---
title: "[Angular速成班]簡介&Hello World!!"
date: 2016-09-28 21:25:41
category: Angular速成班
tags:
    - Angular
    - Angular CLI
    - TypeScript
    - JavaScript
---

Angular前陣子終於脫離RC版堂堂邁入正式版本啦！這代表著基本上之後的更新原則上都不會再有重大的變化，也就是開發上可以比較穩定囉，所以今天就來介紹一下Angular以及使用官方推出的Angular CLI來建立一個簡單的Hello World程式吧！

<!-- more -->

# 關於Angular

Angular是由Google開發維護的**前端MVC框架**，改善了過去AngularJs的一些問題如效能等等，也大幅改善了開發的經驗，並精簡過去開發上要記得的東西太多的問題；並配合官方推出的Angular CLI，強化一般MVC框架「**習慣取代配置**」的精神，讓整個開發流程更加順暢，整體來說，個人覺得Angular有幾個主要優點：

1.  **完整的MVC框架**：與過去AngularJs相同，Angular也一樣是個完整的前端MVC框架，因此包含了許多方便強大的功能來協助開發。
2.  **Angular CLI**：這是Angular個人覺得最令人興奮的地方，過去AngularJs時代最讓人頭痛的問題之一就是程式碼的管理，雖然網路上可以找到許多所謂的best practice，但各有優劣難以抉擇，這次Angular CLI推出後，可直接利用指令列建立Angular專案，並以官方內建的結構來管理程式碼，可以大幅減少專案開始時的陣痛時期；另外藉由習慣取代配置的精神，如果是團隊開發，大家都對於Angular CLI產生的專案架構熟悉後，也很容易共同開發或接手維護，較不會造成溝通上的衝突；除此之外，我們在打包程式時也不用去多想webpack要怎麼配置，直接使用Angular CLI內建的就可以輕鬆完成了！
3.  **對新語法的支援**：Angular在推出時，就以TypeScript為主要開發的語言，另外也可以改使用Dart或單純的JavaScript開發，只是主要推薦TypeScript就是了。在開發JavaScript程式時，對很多人開發C#/Java比較有經驗的程式人員來說沒有強型別是一件很困擾的事情，但搭配TypeScript就可以解決這種困擾，讓開發JavaScript程式時能夠得到強型別的支援；另外**在TypeScript上也可以使用各種ES6(甚至ES7or更新)的最新語法，又不用擔心瀏覽器支援度不好的問題**，因為TypeScript會自動幫你轉成支援舊瀏覽器的語法，這麼一來我們就可以使用最新的語法卻不用擔心瀏覽器支援度問題囉！除此之外**Angular的預設專案架構也加入corejs，來補足TypeScript尚未支援的語法**，讓你可以更加大膽的使用各種最新的JavaScript語法進行開法！

{% note info %}

**Angular、AngularJS傻傻分不清楚嗎？**

再AngularJS進化之後，有分Angular2、Angular4...未來版本還會繼續增加，但核心架構已經一樣了，因此Angular官方團隊對於Angular2以後的版本統稱為**Angular**，新版本原則上完全相容於舊版本，因此未來除非有指定特地版本的新功能，否則一律會以Angular為主要名稱！

{% endnote %}

{% note warning %}

之後的文章我們都會用TypeScript做為開發的程式語言，但不會非常困難，基本上跟JavaScript都差不多，如果不熟悉TypeScript的朋友，依然還是可以使用JavaScript來做開發！

{% endnote %}

當然，Angular2也不是沒有缺點，以下是個人認為的一些缺點：

1.  **學習難度**：在習慣取代配置的精神，其實也代表著某種程度彈性比較低，同時也可能需要多學點其它東西，雖然Angular大幅簡化了過去AngularJs的一堆directives，但比起其他前端框架或類別庫來說，個人覺得Angular還是比較複雜一點的，不過習慣後其實會覺得開發過程更加的流暢！只是對於一些比較簡單的專案來說，還是會使用比較簡單的方式去完成，畢竟硬要使用Angular反而有種殺雞用牛刀的感覺。
2.  **專案龐大**：由於Angular是個完整的前端框架，因此專案在開發時需要引用的npm模組也驚人的多，使用Angular CLI建立的新專案在模組下載完後整個目錄大小高達**200多MB**!!雖然要上線打包的程式檔案大幅縮小，雖然經過壓縮後可大幅縮小到2MB以下(甚至更小)，但看到新專案目錄200多MB還是會覺得有點抖抖的啊！

# 使用Angular CLI建立Hello World

接下來我們就要正式使用Angular CLI建立一個專案來寫程式啦！

## 事前準備

1.  安裝Node.js ([https://nodejs.org/](https://nodejs.org/en/))
2.  使用以下指令確認NodeJs與npm版本

    ```shell
    node -v
    npm -v
    ```

    node需要5.x.x以上

    npm需要3.x.x以上的版本

3.  安裝Angular CLI

    ```shell
    npm install -g angular-cli
    ```

    接著我們可以使用ng -v 來確認Angular CLI版本

    寫這篇文章時是 **1.0.0-beta.15**

{% asset_img 001.png %}

接著我們就可以使用Angular CLI來建立新的Angular2專案囉

**2017/03/11 update: angular-cli已換套件名稱，請改用**

```shell
npm install -g @angular/cli
```

## 使用Angular CLI

要建立Anguar CLI專案非常簡單，只需要下個指令就可以了

```shell
ng new angular-demo
```

接下來就會自動幫你建立專案需要的內容，以及下載相關套件，整個過程需要一段時間，依網路速度大約5~10分鐘左右，這時候就是喝咖啡串門子的時間啦！

建立完成後我們先不修改任何程式，切換到專案目錄下，直接使用`ng serve`指令，啟動一個執行配合專案執行的http server

```shell
cd angular-demo
ng serve
```

然後會看到啟動server與基本打包動作的輸出

{% asset_img 002.png %}

接著就可以開瀏覽器到網址列輸入 http://127.0.0.1:4200 ，來看看執行結果囉！

{% asset_img 003.png %}

使用Angular CLI，我們就不用去想配置一堆檔案，然後才能啟動專案，只要一行指令，初始化動作就通通幫你做到好，再使用一行指令，就可以輕易打包程式並啟動一個http server來觀看執行結果，很方便吧！

# 總結

本篇文章我們簡單介紹了Angular2的特色，以及使用Angular CLI建立了一個簡單的Hello World專案，**透過Angular CLI我們可以省去很多初始化的配置時間**。

下一篇文章我們會先簡單來認識一下Angular CLI，對**Angular CLI與專案目錄架構有個基本的認識概念**後，就可以很老梗的透過寫個TodoList來學習Angular2的常用特色啦！