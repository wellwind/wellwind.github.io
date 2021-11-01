---
title: "[Angular速成班]了解Angular CLI產生的專案目錄結構"
date: 2016-10-15 11:11:11
category: "Angular速成班"
tags:
    - Angular CLI
    - Angular
---
在上一篇文章中我們快速介紹了Angular CLI的使用方式，透過Angular CLI我們可以很容易的建立一個具有一致性的專案架構，今天我們就來簡單介紹一下使用ng new指令產生的專案目錄內容，讓以後在開發Angular專案時可以很清楚知道檔案的存放位置。

<!-- more -->

使用ng new指令產生的專案基本上看起來像這樣：

{% asset_img 0.png %}接下來我們就來介紹一些重要的目錄以及檔案。

# /protractor.conf.js與/e2e

e2e這個資料夾主要用來存放end to end的測試案例，Angular CLI產生的專案會使用[protractor](http://www.protractortest.org/)來進行end to end測試，protractor是angular開發團隊推出的end to end測試框架，自然跟Angular最match啦！關於測試相關的設定，則是存放在**/protractor.conf.js**這個檔案中。

我們可以透過` ng e2e `指令來進行end to end的測試。

# /node_modules

我想不用介紹太多，只要對前端工程有一定熟悉的人都知道這個目錄是用來幹嘛的，簡單來說就是所有相關會用到的模組都在這個資料夾裡啦！

# /src

這個目錄非常重要，因為它就是我們未來所有撰寫的程式碼會存放的目錄，所以以後會常常近來這個目錄操作哩；當我們使用Angular CLI產生需要的檔案時，也都會存放在這個目錄之中。

# /.editorconfig

[EditorConfig](http://editorconfig.org/)是專門給IDE看的一個檔案，用來告知IDE該如何調整專案目錄下的程式碼風格，如果IDE支援的話，就能夠針對.editorconfig這個檔案的設定來調整你的程式碼風格，如果不支援的話，這個檔案就可有可無囉。

{% note info %}  
如果是使用Visual Studio Code開發的話，可以安裝[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)這個外掛來讓它支援EditorConfig  
{% endnote %}  

# ./angular-cli.json

給Angular CLI看的設定檔，基本上就是一些目錄及打包程式時的設定，如果團隊開發對於檔案存放目錄有特別設定的需求，或打包程式時需要引入額外的程式庫，都可以在這個檔案中設定。

# ./karma.conf.js

Angular CLI產生的專案使用[Karma](https://karma-runner.github.io/1.0/index.html)作為unit test的測試框架，因此相關設定都寫在這裡囉。要進行unit test時，可以使用` ng test `指令。

# ./tslint.json

用來針對TypeScript的程式撰寫風格進行規範(linter)的設定檔，就如同CSSLint、ESLint等，我們也可以透過[TSLint](https://palantir.github.io/tslint/)來檢查TypeScript的coding style，只要執行` ng lint `來檢查就可以了。

# 單元回顧

本篇文章我們快速的看過一次Angular CLI產生的專案架構，並理解了特定資料夾及檔案的功用，在未來開發Angular專案時若需要對專案進行調整時，就能夠清楚知道該去哪裡調整檔案。

對於Angular CLI有了基本認知後，下一篇文章開始我們就要真的開始來寫一個TodoApp當作練習囉！