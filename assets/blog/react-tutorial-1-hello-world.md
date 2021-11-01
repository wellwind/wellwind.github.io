---
title: "[React速成班]前言&Hello World!"
date: 2016-03-04 15:40:42
category: React速成班
tags:
    - React
    - Hello World
---

如果要說2015年最熱門的前端框架，那肯定非[React](https://facebook.github.io/react/)莫屬了！之前看到一篇PTT上的文章[「[心得] 前端/Front-End/F2E面試心得分享(22間)」](www.ptt.cc/bbs/Soft_Job/M.1451695803.A.2B4.html)，作者發表了他個人面試22間公司的心得，其中以可以看到多數的公司現在都開始趨向使用React，其中也有提到一些目前AngularJS的問題，對於已經使用AngularJS一段時間的我來說也頗為感同身受！雖然即將現身(?)的Anular 2會對一些常見的問題進行改善，但跟風學學現在熱門的東西也不是個壞事...所以就決定摸索看看React。

<!-- more -->

說了一堆廢話XD，這系列的文章主要就是用來記錄自己摸索React的心得，雖然搭配官方的tutorial要上手不算太困難，但畢竟React相關的資源在網路上相對還是比較少，希望這系列文章可以幫助一些剛要進入React領域的人少走一些路，也順便作為自己的筆記，每隔一段時間回來看看自己是否有進步XD

第一篇就先來做一些開始寫程式前的準備，然後寫一個Hello World吧！

# 安裝Node.js

恩...這在網路上也太多資源了，總之先裝起來就對了XD

[下載&安裝Node.js](https://nodejs.org/)

# 透過npm安裝http-server

在練習React的時候，有時會遇到在client直接打開html檔會無法執行的狀況，因此先安裝一個小型的http server以供之後使用。

打開node.js CLI，輸入以下指令：

```
npm install http-server -g
```

即可完成安裝。

# 下載React Starter Kit

React Starter Kit可以在[官方的文件](facebook.github.io/react/docs/getting-started.html)找到下載連結，下載完解壓縮後會在build資料夾看到React必須的檔案，以及一個examples資料夾包含各種範例程式。

{% asset_img 000.png %}

之後在解開的壓縮檔的目錄下新增一個helloworld.html，然後輸入以下內容

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>

  </body>
</html>
```

這基本上算是React最基本的程式碼架構，接下來在`<body>`標籤內加入程式碼

```html
    <div id="example"></div>
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById("example")
      );
    </script>
```

簡單解釋一下程式碼，首先先加入一個id為example的div標籤；接著使用`<script type="text/babel">`，告訴瀏覽器**裡面的JavaScript要透過Babel進行編譯**，另外在head標籤內我們也加**入了Babel編譯器的JavaScript程式**。

{% note info %} 
Babel可以協助我們將JavaScript編譯成符合ECMAScript標準的程式碼，同時也可以協助我們編譯裡面的XML內容，在React稱為JSX，關於Babel介紹可以到Babel官網查看。
{% endnote %}

接下來我們使用ReactDOM.render產生一組內容為`<h1>Hello, world!</h1>`的JSX，並利用`document.getElementById("example")`找到id為example的元素，把產生JSX塞進去。

# 實際看看結果

這時候只要用瀏覽器打開helloworld.html就可以看到畫面出現Hello, world!的畫面啦！

如果要模擬http server執行的結果，可以開啟命令提示字元，輸入指令

```
http-server [path]
```

[path]換成你要當作http server的跟目錄路徑，之後在瀏覽器網址列輸入http://127.0.0.1:8080/helloworld.html

就可以用模擬http server的方式瀏覽結果了。

{% note info %} 
關於http server更多指令參數請上：https://www.npmjs.com/package/http-server
{% endnote %}

# 將React JSX程式碼獨立出來

當程式碼越來越複雜時，把JavaScript檔案獨立出來是理所當然的事情，我們可以建立src/helloworld.js，然後把helloworld.html的JavaScript程式碼搬進去

```javascript
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById("example")
);
```

之後在helloworld.html加入js檔參考

```javascript
<script type="text/babel" src="src/helloworld.js"></script>
```

記得一樣要使用`type="text/babel"`，來將js檔進行正確的轉換。

# 離線轉換JSX檔案

透過引入Babel編譯器參考可以讓我們在網頁載入時即時編譯JSX內容，但為了不讓client浪費無謂的CPU去做轉換，我們也可以在本機先將JSX檔做編譯轉換，然後在html檔直接載入轉換後的js檔即可。

首先先透過npm安裝babel-cli

```
npm install -g babel-cli
```

接著移動到helloworld.html所在的資料夾下指令

```
babel --presets react src --watch --out-dir build
```

{% asset_img 001.png %}

透過參數`--watch`可以持續監控src資夾內檔案內容的變化，只要一有變化就自動編譯然後存到build資料夾內。

編譯過的helloworld.js檔看起來會像這樣

```javascript
ReactDOM.render(React.createElement(
  'h1',
  null,
  'Hello, world!'
), document.getElementById('example'));
```

接下來修改helloworld.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <!-- 原本要載入的Babel編譯器可以省略了 -->
  </head>
  <body>
    <div id="example"></div>
    <!-- 直接使用babel編譯過的js檔，也不需要type="text/babel"了 -->
    <script src="build/helloworld.js"></script>
  </body>
</html>
```

就大功告成啦！這時候我們可以試著修改看看src/helloworld.js檔後存檔，只要前面babel自動監控的動作沒有被停止，就會自動將檔案編譯成build/helloworld。

{% note warning %} 
將檔案獨立出來時，如果不預先透過babel編譯過的話，會發生直接點兩下html用瀏覽器打開時，會因為安全性的問題有些瀏覽器無法正確顯示。因此建議之後的練習通通都打開模擬的http server，使用正常 `http://` 的方式觀看結果而不要使用 `file:///` 的方式瀏覽。
{% endnote %}

到目前為止大部分都是參考React的[Getting Started](https://facebook.github.io/react/docs/getting-started.html)文章做出來的，之後的文章我們會做一個簡單的todo list，並慢慢地增強它的功能，同時學到React的各種功能。

# 單元回顧

- 利用React建立一個hello world
- 透過JSX，可以在JavaScript裡面撰寫類似HTML的東西，利用Babel轉換後再由React幫我們加到畫面上