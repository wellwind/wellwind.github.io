---
title: "[前端軍火庫]Onsen UI - 專注於mobile web的UI框架"
date: 2016-12-22 11:11:11
category: "前端軍火庫"
tags:
---
之前我們曾經就紹過Bootstrap這類的UI Framwork，目的是快速打造具有基本且通一的UI，並且支援RWD，不管是desktop或mobile瀏覽器都可以使用，而有時候我們可能不需要顧慮這麼多，只需要專注在mobile平台就可以了，這時候[Onsen UI](https://onsen.io/)就是非常適合使用的UI Framework了。

<!-- more -->

# 關於Onsen UI

[Onsen UI](https://onsen.io/)是一款專注在mobile web上的UI Framework，目前已經出到第2版，由於專注在mobile web上，因此除了做手機版網頁外，也很適合拿來在cordva這類的mobile web app中使用，使用Onsen UI建立的網頁能夠看起來就會像我們一般手機APP的使用經驗一樣。

Onsen UI可以隨著使用的手機平台(Android、iOS)來調整顯示的方式，讓APP上架時更加符合相關的UI設計準則；更棒的是，它預設支援了目前主流的前端框架(Angular 1、Angular 2、React、Vuew.js、Meteor)，對於已經使用這些框架的開發人員來說，能夠以更加習慣的方式上手！

# 開始使用Onsen UI

雖然Onsen UI支援各種前端框架，但為了不要把問題複雜化，我們還是使用最基本的方式來進行開發，儘管如此，Onsen UI依然可以在不使用這些框架的情況下使用Web Component的概念來開發，使用上變得非常簡單。

首先先載入必要的onsenui.css、onsen-css-components.css和onsenui.js，接著在頁面中我們可以在body中直接使用`<ons-page>`來建立一個基本的頁面

```html
  <ons-page>
    Hello World!!
  </ons-page>
```

很簡單吧！接下來我們也可以加入APP中常見的toolbar

```html
  <ons-toolbar>
    <div class="left">
      <ons-back-button>上一頁</ons-back-button>
    </div>
    <div class="center">歡迎光臨</div>
    <div class="right">
      <ons-toolbar-button>
        <ons-icon icon="md-menu"></ons-icon>
      </ons-toolbar-button>
    </div>
  </ons-toolbar>
```

再加個清單的Component

```html
  <ons-list>
    <ons-list-header>主餐</ons-list-header>
    <ons-list-item>咖哩飯</ons-list-item>
    <ons-list-item>牛排</ons-list-item>

    <ons-list-header>飲料</ons-list-header>
    <ons-list-item>可樂</ons-list-item>
    <ons-list-item>紅茶</ons-list-item>
    <ons-list-item>雪碧</ons-list-item>
  </ons-list>
```

結果畫面如下：

{% asset_img 0.png %}

看起來是不是就有模有樣啦！

程式碼DEMO: [https://jsfiddle.net/wellwind/mbonso94/](https://jsfiddle.net/wellwind/mbonso94/)

關於更多Onsen UI的元件使用可以參考: [https://onsen.io/v2/docs/js.html](https://onsen.io/v2/docs/js.html)

# 類似資源

*   [Framework7](https://framework7.io/)：另一款以mobile web為主的UI Framework，內建的Component比Onsen UI多，缺點是不像Onsen UI可以用更直覺的web component方式來使用。