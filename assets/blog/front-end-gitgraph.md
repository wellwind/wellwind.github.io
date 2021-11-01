---
title: "[前端軍火庫]GitGraph.js - 畫出精美的Git分枝樹狀圖"
date: 2016-12-18 11:11:11
category: "前端軍火庫"
tags:
---
身為一個程序猿，有在使用任一種版本控制系統是很正常的，用過2~3種以上的也絕不稀奇，以目前來說，最受歡迎的莫過於Git了，不過今天不是要介紹Git，而是要介紹一款可以畫出Git類型的樹狀結構的library - [GitGraph.js](http://gitgraphjs.com/)

<!-- more -->

# 關於GitGraph.js

[GitGtaph.js](http://gitgraphjs.com/)是一款用來把Git的分枝樹狀結構視覺化的JavaScript library，它提供的API與Git基本常用的指令完全相同，因此我們可以把使用Git的commit、branch等流程直接透過GitGraph.js的API來顯示出來。當然啦除非你是要開發Git相關的前端GUI否則其實可能用不太到，不過其實我們可以把這種分支樹狀的概念放到一些需要管理流程的系統上，讓流程的顯示更加明確。

接下來我們會在公堂之上假設一下，一個線上文件傳閱的系統需求

1.  由一個人發起文件傳閱的工作
2.  相關的人員都看過後，可以把文件傳遞(cimmit?)給下一位傳閱的同事
3.  可跨部門傳閱(線上版的好處就是文件不是單一份紙本而已)
4.  相關同事都看過後，即完成傳閱流程

相信看到這樣的流程，有點概念的人已經不難想像一個像是Git tree的圖案了，畫出來的圖形大概如下圖

{% asset_img 0.png %}

接下來我們就看看要怎麼畫出這樣的tree吧！

# 開始使用GitGraph.js

載入相關的js/css檔後，我們需要建立一個id為`gitGraph`的canvas

```html
<canvas id="gitGraph"></canvas>
```

這個id可以透過參數去決定要使用什麼id，而GitGraph.js的預設值是gitGraph，因此要在一個頁面上顯示多個Git tree也是可以做到的。

接下來JavaScript我們一步一步操作，首先先產生新的GitGraph，然後產生新的分支，主分支我們命名為"表單"，然後在主分支上建立一個初始的commit，代表流程開始。

```javascript
var gitgraph = new GitGraph();

// Init branch
var master = gitgraph.branch("表單");

// Init commit
master.commit({
  sha1: "2016/12/15 10:00",
  message: "表單傳閱",
  author: "by 總經理"
});
```

在上面程式可以看到每個commit的sha1使用了時間來代替，author也不向一般Git的格式，畢竟這不是真正的Git，主要是流程的樹狀圖形，以上程式碼執行後就可以看到一個初始的節點了：

{% asset_img 1.png %}

接著我們假設文件要傳閱到"研發部"與"財務部"，因此開了兩個分支(branch)：

```javascript
// two branches
var rdBranch = master.branch("研發部");
var finBranch = master.branch("財務部");
```

假設研發部的Wellwind同事已經看完了，要記錄這筆資料，我們可以把研發部的分支checkout出來，然後進行commit：

```javascript
rdBranch.checkout();
gitgraph.commit({
  sha1: "2016/12/15",
  message: "表單已閱",
  author: "by Wellwind"
});
```

{% asset_img 2.png %}

接著財務部的Shawn也看了，所以改成把財務部分支checkout後commit：

```javascript
finBranch.checkout();
gitgraph.commit({
  sha1: "2016/12/17 11:05",
  message: "表單已閱",
  author: "by Shawn"
});
```

接下來的流程都類似，直到財務部的Mary看完後，決定附上一個"經費核准"的標籤(tag)，於是我們在commit的設定中加入了tag：

```javascript
gitgraph.commit({
  sha1: "2016/12/18 11:30",
  message: "表單已閱",
  author: "by Mary",
  tag: "經費核准"
});
```

{% asset_img 3.png %}

到此為止財務部已經傳閱完畢，因此我們可以把財務部的分直合併回主表單分支然後刪除：

```javascript
finBranch.merge(master,{
  dotColor: "lightGreen",
  sha1: "2016/12/18 11:30",
  message: "財務部已傳閱完畢",
  author: "by System"
});
finBranch.delete();
```

在這邊我們的選項另外加上了`dotColor: "lightGreen"`來把合併的節點設定成淺綠色，看起來比較美觀一點。合併後畫面如下

{% asset_img 4.png %}

之後研發部的人員也傳閱完成，重複上面的步驟合併回主分支後，整個流程就算結束了，最後我們在主分支commit一次，並設定`dotColor: "black"`結束整個流程：

```javascript
master.commit({
  dotColor: "black",
  sha1: "2016/12/18 13:40",
  message: "表單已傳閱完畢",
  author: "by System"
});
```

如此一來就整個大功告成啦！透過GitGraph，對於一些類似型態的流程管理，我們也能輕鬆地使用樹狀的模式顯示出來囉。

今天的程式碼DEMO: [https://jsfiddle.net/wellwind/k8o8gwe4/](https://jsfiddle.net/wellwind/k8o8gwe4/)

GitGraph.js還有一些其他細部的設定，和事件的管理等等，有興趣就自行上官網去看sample吧！