---
title: "[Angular Material完全攻略] Angular Material 6之快速安裝篇"
date: 2018-05-04 16:28:51
category: "Angular Material完全攻略"
tags:
  - Angular
  - Angular 6
  - Angular Material
  - Angular Material 6
  - Angular CLI
---

Angular Material 6 在今天 (2018/05/04) 正式登場，從 Angular 本身、Angular CLI 到 Angular Material，全部都一次推出第 6 版！這個版本除了對齊版號以外，也投下了非常多驚人的震撼彈，許多都是跟程式架構與產生(schematics)有關！原本的安裝或升級都能夠藉此架構大幅節省心力，今天就讓我們看看，從 Angular 6 與 Angular Material 6 之後，要使用 Angular Material 到底變得有多簡單吧！

<!-- more -->

# 前置準備

首先我們需要一個 Angular 6 的專案，這部分我們可以透過 Angular CLI 6 來完成。

而要將 Angular CLI 升級到第 6 版，這基本上不是什麼太困難的事情，只需要透過以下指令即可完成

```shell
npm i -g @angular/cli
```

我們就可以透過 `ng -v` 來確定是否為 Angular CLI 6 了！

{% asset_img 00.png %}

接著只需要使用 `ng new` 指令，就能夠輕鬆產生 Angular 6 的專案啦！

{% asset_img 01.png %}

有了新的 Angular 6 專案後，就立刻來看看安裝 Angular Material 6 有多簡單吧！

{% note info %}

Angular CLI 6 之後的專案架構有一些變化，如果想要升級舊的專案，可以在升級 Angular CLI 後直接使用 `ng update`指令。

{% endnote %}

# 安裝 Angular Material

如果你看過我之前的文章[[Angular Material完全攻略]環境設定 & 安裝 ＆ Hello World](https://fullstackladder.dev/blog/2017/12/20/angular-material-02-installation/)，或自己曾經安裝過Angular Material 5的話，應該有印象那是多麽麻煩的一件事情，而在 Angular CLI 6 以及 Schematics 的強力支援下，現在要安裝 Angular Material 6，只剩下一行指令的事情了！

只需要透過 `ng add @angular/material` ，所有事情一次搞定！

{% asset_img 02.png %}

簡單到不行的一個動作(~~都不知道以前在忙什麼的XD~~)，就完成 Angular Material 6 的安裝啦，這個指令包含幾個步驟：

1.  在 package.json 中，將 Angular Material 6 加入
2.  在 angular.json 中，將預設主題樣式 indigo-pink.css 加入
3.  在 index.html 中，加入 Material Icon 以及預設字體的設定
4.  在 app.module.ts 中，加入 BrowserAnimationsModule 

這些步驟也就是 Angular Material 的安裝步驟，雖然不多，但也大概要花個 10 分鐘吧！現在只要一行指令就搞定囉。

{% note info %}

由於有動到 package.json，記得自己執行 `npm install` 指令來安裝套件。

{% endnote %}

接下來我們來看一下 Angular Material 搭配 schematics 所產生的強大威力吧！

# 透過 schematic 產生預設範本

在 Angular 6 之後，相關的生態圈都開始陸續支援使用 schematics，透過這樣的整合，我們可以單純的使用 `ng` 指令，來產生各式各樣的程式碼，而目前 Angular Material 6 已經可以產生 3 種類型且非常實用的程式碼範本。

## navigation

這個範本包含了 toolbar 與 sidenav 的外框，只要輸入以下指令，即可產生相關的元件

```shell
ng generate @angular/material:material-nav --name navigation
```

`-- name navigation` 可以換成自訂的元件名稱，即可產生如下圖的元件

{% asset_img 03.png %}

此戲看看裡面的原始碼，它把 RWD 的部分也都已經考量進來了，在行動裝置時，左邊的選單會自動收起來，大幅節省許多程式碼撰寫的力氣！

## dashboard

接著我們來看看 dashboard 範本的使用，一樣用簡單的指令即可產生

```shell
ng generate @angular/material:material-dashboard --name dashboard
```

結果如下圖：

{% asset_img 04.png %}

可以看到這裡標含了非常多基本的 Angular Material 元件，包含了Card、Grid List、Button和Menu，而這些也是許多 dashboard 最基本的組成要件！

## table

table可以說是 Angular Material 裡面相對複雜許多的元件，而在 Angular Material 6 的 schematics 裡面，把 table 也設計成預設的範本了，這麼一來當我們要設計 table 時，就不用一直查找文件，而是直接看產生的範本就好囉：

```shell
ng generate @angular/material:material-table --name table
```

結果如下圖：

{% asset_img 05.png %}

# 本日小結

Angular 6之後，將許多相關生態圈的套件都整合了起來，雖然還不是非常完整，但也已經很夠用了，以 Angular Material 6來說，我們可以一行指令快速安裝，也能夠快速產生 3 種不同的範本做參考，已經很方便了，也越來越讓人期待當這些工具更加完善後，可以替開發人員省下大幅度的時間，避免無謂的重新製造輪子！

今天就先簡單說明 Angular Material 6 的快速安裝方式，以及 schematics 的應用，其他的之後再來介紹囉。

# 參考資源

-   https://material.angular.io/guide/schematics
