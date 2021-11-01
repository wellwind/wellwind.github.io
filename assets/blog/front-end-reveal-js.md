---
title: "[前端軍火庫]Reveal.js - 用前端技術完成酷炫簡報"
date: 2016-12-14 11:11:11
category: "前端軍火庫"
tags:
---
相信或多或少，大家都有製作投影片進行簡報的經驗，以製作投影片來說最主要的軟體大概非PoertPoint莫屬了；而想要使用PowerPoint做出絢麗的簡報沒有一番功夫可是做不到的...不過，我們可是前端工程師阿！如果有一款簡報軟體，可以使用我們熟悉的前端技術來完成，不是很棒的一件事情嗎？而Reveal.js就是這樣一款好用的簡報框架。

<!-- more -->

# 關於Reveal.js

[Reveal.js](https://github.com/hakimel/reveal.js)是一款允許使用HTML來完成簡報的框架，透過Reveal.js前端工程師們可以使用自己最熟悉的HTML/CSS/JS來完成精美的投影片，也有許多內建的themes以及plugins可以選擇，讓你製作投影片更加得心應手！

# 開始使用Reveal.js

下載Reveal後，我們先載入reveal.js及reveal.css，然後可以再themes選擇一個喜歡的主題使用，接著加入以下HTML

```html
<div class="reveal">
  <div class="slides">
  </div>
</div>
```

這是最基本的簡報外框，我們可以在裡面加入許多的`<section>`區塊，這些區塊就代表了每一張投影片，例如：

```html
<div class="reveal">
  <div class="slides">
    <section>
      <h1>
        使用Reveal.js
      </h1>
      <h2>
        前端製作簡報好簡單！
      </h2>
    </section>
  </div>
</div>
```

接著在JavaScript加入一段簡單的程式碼

```javascript
Reveal.initialize();
```

一張標準的簡報就完成啦！

{% asset_img 0.png %}

# 加入多張投影片

剛剛已經提過了，每個`<section>`區塊就代表一張投影片，因此我們需要幾張投影片，就加入幾個`<section>`

```
<section>Page 1</section>
<section>Page 2</section>
```

接著我們就可以使用方向鍵的左(←)右(→)來切換投影片，除了左右建以外，我們也可以在一個`<section>`中再加入多個子`<section>`，此時就可以使用上(↑)下(↓)鍵來切換，例如：

```html
<section>Page 1</section>
<section>
  <section>我是第2頁，請按方向鍵(↓)</section>
  <section>我是第2-1頁</section>
</section>
```

我們也可以按下`esc`，一次可以看到多張的投影片。

{% asset_img 1.png %}

程式碼DEMO: [https://jsfiddle.net/wellwind/46ufzs2b/](https://jsfiddle.net/wellwind/46ufzs2b/)

# 加入其他plugins

Reveal.js也內建了一些plugins可以使用，例如我們希望可以在簡報中直接使用markdown語法，那麼可以修改JavaScript為

```javascript
Reveal.initialize({
  dependencies: [{
    src: '/plugin/markdown/marked.min.js',
    condition: function() {
      return !!document.querySelector('[data-markdown]');
    }
  }, {
    src: 'plugin/markdown/markdown.min.js',
    condition: function() {
      return !!document.querySelector('[data-markdown]');
    }
  }]
});
```

接著在`<section>`加上`data-markdown`這個attribute，然後把markdown語法放在`<script type="text/template">`裡面，就可以啦！  
關於Markdown與plugins的細節可以參考[Markdown](https://github.com/hakimel/reveal.js#markdown)說明與[Dependencies](https://github.com/hakimel/reveal.js#dependencies)的說明部分。

# 其他參數設定

Reveal.js也有很多參數可以讓你調整簡報的細節，可以考[Configuration](https://github.com/hakimel/reveal.js#configuration)說明，以下簡單舉個例子，假設我們希望可以自動加上頁碼，以及每3秒自動播放下張投影片，那麼JavaScript如下

```javascript
Reveal.initialize({
  slideNumber: true,
  autoSlide: 3000
});
```

# 其他...

Reveal.js還有其他更多的設定部分，一篇文章很難介紹得完，有興趣可以直接上[GitHub的文件](https://github.com/hakimel/reveal.js/blob/master/README.md)去看看，或先到[官方DEMO](http://lab.hakim.se/reveal-js/#/)參考看看囉！

# 類似資源

*   [Deck.js](https://github.com/imakewebthings/deck.js)：也是一款功能強大、擴充性強的簡報框架，小缺點是相依於jQuery及Modernizr。
*   [fullPage.js](https://github.com/alvarotrigo/fullPage.js)：也是非常強大的簡報框架，同樣相依於jQuery，不過最特別的是他提供了Wordpress的外掛，以及對Reace/Angular 1.x/Angular 2.x的支援，在設計上能更加方便。