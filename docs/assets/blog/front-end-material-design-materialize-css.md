---
title: "[前端軍火庫]Materialize - 遵循Google Material Design實作的CSS framework"
date: 2016-12-02 11:11:11
category: "前端軍火庫"
tags:
    - Material Design
---
首先，我們先來談談[Material Design](https://material.google.com/)，Material Design是由Google推出視覺語言，或可以說是一種設計準則，其中定義了基本的樣式、排版、元件等等的設計方向，目標是希望藉由一致的設計樣式規則，讓平面的UI更具立體感，卻又不失操作流暢度，提高使用者體驗(User Experience)，例如設計一個Icon，要怎麼做比較好呢，就可以參考[https://material.google.com/style/icons.html](https://material.google.com/style/icons.html#) 裡面的說明；一個Menu的呈現方式該如何呢？[https://material.google.com/components/menus.html](https://material.google.com/components/menus.html) 也有詳細的說明。

<!-- more -->

如果你有在用Android、Chrome或其他Google服務的話，你也會慢慢發現這些UI都開始慢慢地往Material Design的概念在改變了。

儘管Google推出了Material Design這樣的視覺語言，但不是每個人或每家公司都有能力完全依照Material Design的準則來進行設計，因此[Materialize](http://materializecss.com/)就成了一個現成的好選擇。

# 關於Materialize

Materialize就是一個基於Material Design這樣的準則推出來的CSS框架，是由4個亞洲人一起開發的，在使用這些component時，基本上就等於依照Material Design的設計模式了。

# 使用Materialize

要使用Materialize也很簡單，只要跟著官放的[Getting Start](http://materializecss.com/getting-started.html)下載相關的css/js檔或直接使用CDN就可以啦，一個基本Materialize的HTML樣板如下

```html
  <!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body>
      <!--Import jQuery before materialize.js-->
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
    </body>
  </html>
```

接著假設我要使用一個按鈕，只需要加上

```html
<a class="waves-effect waves-light btn">button</a>
```

恭喜你，一個具有Material Design樣式的按鈕就出來啦！

如果需要調整顏色，Material Design也有一系列的推薦色票，而Materialize也把這些色票都轉為[Color class](http://materializecss.com/color.html)了，例如剛剛的按鈕預設是綠色的，如果需要調整呈橘色的按鈕，只需要加上````orange````的class

```html
<a class="waves-effect waves-light btn orange">button</a>
```

如果覺得這個橘色太暗，也有淺色的色票如````orange lighten-3````，透過這樣的顏色深淺，我們也可以很容易做出多階層的選單，滿層顏色都比上一層深一點，讓層次更加分明。

以下是利用Materialize做的一個簡單的Demo

{% asset_img 0.png %}

程式碼: [https://jsfiddle.net/wellwind/2nmys31q/](https://jsfiddle.net/wellwind/2nmys31q/)

透過Materialize，我們在設計UI時就可以大聲的跟人家說我們網站符合Google Material Design，是Google掛保證的高user experience網站了XDD

# 相關資源介紹

*   [Material design](https://material.google.com/): 官方的Material Design介紹
*   [Google Material Design 正體中文版](https://www.gitbook.com/book/wcc723/google_design_translate/details): 社群翻譯的Material Design繁體介紹
*   [Material Design Lite](https://getmdl.io/index.html): Material Design Lite是另外一款以Material Design質感開發的UI framework，另外也有很酷的[Customize](https://getmdl.io/customize/index.html)功能可以用
*   [Material UI](http://www.material-ui.com/): Material Design的React元件版本
*   [Angular Material](https://material.angularjs.org/): Material Design的AngularJS版本