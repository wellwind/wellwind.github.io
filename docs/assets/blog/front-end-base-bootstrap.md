---
title: "[前端軍火庫]Bootstrap - 最受歡迎的CSS framework"
date: 2016-12-01 11:11:11
category: "前端軍火庫"
tags:
    - Bootstrap
---
[Bootsrtap](http://getbootstrap.com/)可以算是目前最受歡迎的CSS framework之一，能夠用來套用目前主流的設計概念─**RWD及mobile first**，即使沒有高深的HTML/CSS/JS技術，也能輕鬆設計出基本上能看能使用的web app，如下圖，雖然只是個很簡單的demo，但基本的配色、元件等等組裝起來，雖然不夠當做一個網站的門面，但當作後台也很夠用了，因此bootstrap其實非常適合用來快速建構一個後台程式，當然只要經過調整，要當前台門面也是完全沒有問題的！

{% asset_img 0.png %}

<!-- more -->

Demo程式碼: [https://jsfiddle.net/wellwind/3jftzmbg/](https://jsfiddle.net/wellwind/3jftzmbg/)

Bootstrap主要包含幾個部分：

# Normalize.css

Normalize.css是用來**消除瀏覽器之前預設樣式不同**的問題，讓你的畫面預設不管在什麼瀏覽器上，看起來都是差不多一樣的，在這樣的基準上，在來設計網頁的樣式，如此一來就比較不會發生「為什麼我在IE看到的跟在Chrome上面看到的不一樣」這類的問題了。

# Grid System

Grid System是Bootstrap用來建構RWD網站的關鍵技術，在Bootstrap中已經預先定義了數組的class，讓你可以根據不同的裝置大小，來決定內容的呈現模式；在grid system中預設將一列分成12格，並且可在畫面中設定每個要顯示的區塊依照不同裝置大小應該佔幾格或是否要顯示等等，透過這種定義方式，來達到RWD的效果。詳細的使用方式也可以參考[Responsive Utilities](http://getbootstrap.com/css/#responsive-utilities)

# CSS Classes

除了上述提到的Normalize.css與Grid System以外，Bootstrap也為常用的HTML標籤定義了不同的樣式可以使用；例如input標籤一般都是死板的四邊形，但只要加上了````form-control````這個class，立刻就變成了柔和的圓角四方形；另外也可以透過像是````btn btn-default````這樣的class，為按鈕加上漂亮的樣式。還有一些[Helper Classes](http://getbootstrap.com/css/#helper-classes)能夠幫助你快速加上文字顏色、背景色或對齊等等。

# Components

除了為基本的HTML標籤定義的樣式以外，Bootstrap也內建了許多的Components，讓你在不同的應用上使用，例如[NavBar](http://getbootstrap.com/components/#navbar)、[Pagination](http://getbootstrap.com/components/#pagination)或是[Alerts](http://getbootstrap.com/components/#alerts)等等，你只需要把說明網站上的HTML複製下來，在依實際需要調整，**立刻就能得到一個可以派得上用場的元件**。

# JavaScript

前面介紹的都是與CSS相關的部分，除此之外Bootstrap也以jQuery為基礎提供了JavaScript與CSS Components互動的方法，透過這些定義好的API，你可以輕鬆決定一個[Modal](http://getbootstrap.com/javascript/#modals)要不要顯示或是跳到哪個[Tab](http://getbootstrap.com/javascript/#tabs)等等。

# Customize

Bootstrap預設定義了幾種狀態的顏色(primary, info, success, danger, warning)，你也可以透過官方的Customize功能，決定這些顏色的呈現，另外如果你覺得某些Component不需要使用，也可以在這裡勾選你要使用的部分，最後按下最下面的````Compile and Download````，就可以取得客製化的bootstrap樣式了，非常的方便。

# 開始使用Bootstrap

要使用Bootstrap除了下載官方提供的檔案以外，若需要使用JavaScript與Component互動的功能，務必還要加入jQuery。你可以直接下載壓縮檔，或透過bower、npm等方式安裝套件。

一個基本的bootstrap頁面包含：

# HTML5宣告

```html
<!DOCTYPE html>
<html lang="en">
  ...
</html>
```

如果要使用mobile first的話，再加上

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

接著在把CSS樣式及js檔加入就可以開始使用啦！一個簡單的基本樣板如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>
```

關於Bootstrap的各種樣式，因為太多了無法一一介紹，就請直接上官網看吧，基本上都是複製貼上就可以了XD

Bootstrap官方網站: [http://getbootstrap.com/](http://getbootstrap.com/)