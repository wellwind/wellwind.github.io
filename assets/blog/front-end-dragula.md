---
title: "[前端軍火庫]Dragula - 一步完成Drag & Drop"
date: 2016-12-19 11:11:11
category: "前端軍火庫"
tags:
---
[Dragula](https://bevacqua.github.io/dragula/)是一款協助前端開發人員完成拖曳(drag & drop)功能的library，透過Dragula我們可以輕鬆完成使用滑鼠進行清單的排序、移動位置等等功能，今天我們就來使用Dragula製作一個類似Trello的看板功能。

<!-- more -->

# 開始使用Dragula

首先載入Dragula的js/css之後，為了美觀，我們順便載入了bootstrap，接著使用以下HTML當作基本的看板模板

```html
<div id="kanban" class="row">
  <div class="col-xs-4">
    <div class="panel panel-info">
      <div class="panel-heading pointer">
        <h3 class="panel-title">Todo</h3>
      </div>
      <div class="panel-body">
        <div id="todo">
          &nbsp;
          <div class="alert alert-success pointer" role="alert">Card1</div>
          <div class="alert alert-success pointer" role="alert">Card2</div>
          <div class="alert alert-success pointer" role="alert">Card3</div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-xs-4">
    <div class="panel panel-info">
      <div class="panel-heading pointer">
        <h3 class="panel-title">In Progress</h3>
      </div>
      <div class="panel-body">
        <div id="in-progress">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
  <div class="col-xs-4">
    <div class="panel panel-info">
      <div class="panel-heading pointer">
        <h3 class="panel-title">Done</h3>
      </div>
      <div class="panel-body">
        <div id="done">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</div>
```

此時畫面看起來如下圖：

{% asset_img 0.png %}

在HTML中，我們在每個panel-body裡面放置一個div，並且至少給予一個`&nbsp;`，避免Dragula無法在完全空白的div中移動，接下來我們希望Todo、In Progress和Done裡面的資料能夠拖曳移動，只需要加入以下程式碼，讓Dragula知道那些來源內的資料是一組的：

```javascript
var dragulaCards = dragula([
  document.querySelector('#todo'),
  document.querySelector('#in-progress'),
  document.querySelector('#done')
]);
```

{% asset_img 1.png %}

就完成一個簡單的看板功能囉，當然這樣還有點不足，接著來介紹一些比較進階的使用方式

# Dragula進階使用方式

首先我們希望除了每個清單中的卡片可以移動以外，每組清單的位置也可以互換，因此我們可以把最外面`id="kanban"`的div區塊也當作一個Dragula群組：

```javascript
var dragulaKanban = dragula([document.querySelector('#kanban')]);
```

現在清單可以互相變換位置了，但問題也發生了，每個清單都變成可移動後，即使按下卡片的部分也會被當作清單在移動，結果反而卡片移動的部分出問題了，為了解決這個問題，我們可以加入一個`moves`來決定能夠移動的條件：

```javascript
var dragulaKanban = dragula([
  document.querySelector('#kanban')
], {
  moves: function(el, container, handle) {
    return handle.classList.contains('panel-title');
  }
});
```

我們在moves裡面加入了一個條件檢查，在`dragulaKanban`中，只有在滑鼠按下包含`panel-title` class的時候，才可進行拖曳移動，如此一來按到card部分就不會觸發到外層的移動，就能順利拖曳啦。

{% asset_img 2.png %}

在畫面上這樣已經算是大功告成了，但若需要跟後端連動，則需要知道能夠拖曳後進行些跟後端連動的事情，我們可以透過`drop`事件，在拖拉完成後，得知被移動到哪裡去：

```javascript
dragulaCards.on('drop', function(el, target, source, sibling){
  console.log(source); // from
  console.log(target); // to
  console.log(sibling); // next card

  // 透過ajax與後湍連動
});
```

程式碼DEMO：[https://jsfiddle.net/wellwind/do5pqmmf/](https://jsfiddle.net/wellwind/do5pqmmf/)

實際玩玩看，是不是像極了簡單的看板啊！

# 類似資源

*   [Sortable](http://rubaxa.github.io/Sortable/)：另一款簡單易用的drag & drop library。
*   [Nestable](http://dbushell.github.io/Nestable/)：相依於jQuery，預設就直接支援巢狀的清單，同時位於取得排序資料的方式也比較直覺易懂。