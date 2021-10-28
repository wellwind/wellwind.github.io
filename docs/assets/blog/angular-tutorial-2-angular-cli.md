---
title: "[Angular速成班]用Angular CLI節省你的開發時間"
date: 2016-10-01 21:45:02
category: Angular速成班
tags:
    - Angular
    - Angular CLI
---

**Angular CLI**是隨著Angular發展時一併產生的一個指令列工具，一樣基於「習慣取代配置」的優良傳統，我們可以用Angular CLI快速產生開發Angular程式時所需要的檔案範本，另外也包含了軟體開發生命週期會用到的**bundle, lint, unit test, end to end test**等功能，也全都包在Angular CLI裡面了，因此透過Angular CLI工具，我們可以大幅節省許多準備檔案的時間！由於之後的Angular速成班教學中我們也會大量使用Angular CLI來產生相關需要的檔案，因此今天就先來簡單介紹一下Angular CLI這個強大的產生器功能。

<!-- more -->

在這篇文章會提到一些Angular程式的構成要件，但由於我們還沒正式進入寫程式的階段，所以這裡如果對於一些名詞不太理解，只需要稍微有個底就好，不用太過深入

本篇會簡單介紹一些常用的Angular CLI語法，如需要完整的說明可參考[官方文件](https://github.com/angular/angular-cli)。

# 安裝Angular CLI並產生Angular專案

安裝Angular CLI動作非常簡單，[前一篇](http://wellwind.idv.tw/blog/angular-tutorial-1-hello-world/)文章也介紹過了，基本上只需要確認~~node的版本是4.x.x以上，npm須為3.x.x以上~~(**總之版本越高越好**)即可透過以下指令安裝Angular CLI

```shell
npm install -g @angular/cli
```

接下來就可以使用`ng`這個指令來執行各種開發Angular專案需要的動作啦。

首先我們先用`ng --help `來看看所有可用的指令：

{% asset_img 001.png %}

可以看到洋洋灑灑一大堆的指令說明，也可以用`ng --help [command]`看比較**精簡**一點的說明。例如我想知道generate這個指令的用法，就輸入`ng --help generate`，就可以單純看某個指令的用法囉。

{% asset_img 002.png %}

接下來我們就稍微說明一些常用的Angular CLI指令吧！

# ng new

安裝好Angular CLI以後當然是立刻使用`ng new [專案名稱]` 來產生一個Angular專案啦。

這個指令會**依我們輸入的專案名稱產生一個專案目錄**，同時幫我們**把所有預設需要的相關套件都紀錄在package.json**，然後將所有需要的套件都下載下來；除此之外也會幫我們產生一個Angular專案最基本需要的程式碼、還有簡單的測試案例、測試環境設定、編輯器環境設定(如果編輯器支援的話)、預設的與法規範設定檔(tslint.json)等等；想想看這些步驟如果要自己一個一個處理要花多少時間，還要擔心人腦智慧出錯的可能性，但透過`ng new`，只需要下指令並稍等一下就可以啦！

關於`ng new`產生的專案目錄，在下一篇文章我們會做一個比較詳細的介紹。

# ng generate(ng g)

`ng generate`可以說是**整個Angular CLI裡面最常用到的指令**，它的功能就是用來產生Angular的**元件(component)**、**服務(service)**等等的程式雛形，由於generate指令非常常用，但generate字母又不少，因此我們也可很簡單的使用 `ng g`來執行產生動作，目前`ng g`可產生以下類型的程式

{% asset_img 003.png %}

例如需要產生一個Angular的元件，可以使用`ng g component`，來產生一個component所需要的檔案，另外我們也可以在把剛剛的指令簡化成`ng g c`。只需要短短幾個字，就可以產生許多的程式碼囉！

根據[官方的Angular CLI原始碼](https://github.com/angular/angular-cli/blob/master/packages/angular-cli/commands/generate.ts)，我們也可以看到不同程式碼雛形的指令簡化

{% asset_img 004.png %}

不過很可惜，由於Angular2的route在RC階段一直有改變，雖然正式版已經release了，但目前Angular CLI還不支援route的產生，因此使用ng g r來產生route的話，會出現以下錯誤訊息，期待某天可以正常產生囉！

{% asset_img 005.png %}

使用`ng generate`產生的物件會依照預設值放在特定目錄下，若需要指定目錄也可以透過相對路徑的表示方式來改變目錄，例如`ng g c todo-items`預設檔案會產生在<u>/src/app/todo-list</u>下面，我們可以改用`ng g c todo-list\todo-items`來將檔案改為產生在<u>/src/app/todo-item/todo-list</u>下面。不過需要稍微注意兩點

# ng destroy(ng d)

`ng destroy`是用來移除ng generate所產生的檔案的，不過只是進行把檔案刪除的動作而已，對於用到產生的物件，還是必須手動在程式碼中清除。

例如我們使用`ng g c todo-item`建立一個todi-item的component，但後悔了，就可以使用`ng d component todo-item` (目前不支援 ng d c這種寫法)來移除檔案。

# ng build

當Angular的程式開發完成，需要部屬到別台機器上時，我們可以使用ng build來打包所有的程式碼，**這個步驟會將所有TypeScript的檔案轉譯成JavaScript**，同時也會使用[Tree Shaking](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking)的技術只留下開發時有使用到的相依物件，並將所有程式分類打包，最後產出到專案下的dist目錄，我們就可以將這個目錄部屬到測試或正式環境上執行。另外若是要上線的系統了，還可以使用`ng build --prod`再將產出的JavaScript做最小化壓縮的動作，以節省下載程式碼的等待時間。如果我們希望在程式有修改時就自動進行build的動作，也可以使用`ng build -`w來偵測變更並自動執行build。

Angular CLI使用[webpack](https://webpack.github.io/)作為打包程式的工具，有趣的是使用`ng new`建立的專案找不到webpack.js之類的檔案，這也算是習慣取代配置的好處之一，對於打包程式這件事情我們不用花太多心思，Angular CLI都已經內建好了，只要我們程式撰寫配合通用的習慣，剩下的直接使用別人寫好的範本來跑就好啦！如果想看看Angular CLI預設的webpack程式，可以參考專案目錄下node_modules\angular-cli\tasks下面的檔案。除此之外[Angular官方的webpack介紹](https://angular.io/docs/ts/latest/guide/webpack.html)也說得非常仔細，建議有時間可以去看看。

# ng serve

在程式開發階段，我們經常需要打開瀏覽器來觀看程式執行的結果，使用`ng serve`可以自動幫你把程式打包，並**開啟一個live reload的http server**，如此一來當我們程式有修改時，就會自動幫你重新build一次，同時如果有用瀏覽器打開目前的程式時，也會通知**自動重整**，就不用一直按F5重新整理啦！

# ng lint

使用Angular CLI建立的專案會預設加入一個**tslint.json**檔案，用來設定TypeScript撰寫風格的相關限制，我們可以自行在tslint.json裡面修改來調整符合團隊開發的規範，若要檢查專案中的程式碼是否符合規範，可以使用`ng lint` 來檢查，看看那些檔案中有不符合規則的程式存在。

{% asset_img 006.png %}

# ng test & ng e2e

`ng test`和`ng e2e`兩個指令都是用來執行測試程式的，不同的是`ng test`是屬於**unit test**的部分，會執行src/app下面所有的測試程式碼，使用的測試套件為[karma](https://karma-runner.github.io/1.0/index.html)與[jasmine](http://jasmine.github.io/)。

而n`g e2e`則是用來**執行end to end測試**，會執行e2e資料夾下面的測試程式，使用的測試套件為[karma](https://karma-runner.github.io/1.0/index.html)與[protractor](http://www.protractortest.org/#/)。

如果已經有寫過JavaScript的人對於這些測試程式應該不會太陌生，未來有機會寫到Angular的測試時，在多介紹一些。

# 單元回顧

本篇文章介紹了Angular CLI的一些常用指令，日後在使用Angular CLI時應該能更加清楚指令的用途與原理，透過Angular CLI可以幫助我們在開發的時候節省很多配置時間。

[官方的文件](https://github.com/angular/angular-cli)還有一些小技巧，有興趣的朋友可以去參考看看囉。