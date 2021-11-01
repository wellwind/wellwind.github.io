---
title: "[Angular速成班]關於CSS的使用"
date: 2016-11-27 11:11:11
category: "Angular速成班"
tags:
    - Angular CLI
    - Angular
    - CSS
---
在web應用程式中使用CSS可以說是在基本不過的事情，就算移到的Angular，CSS當然還是依然會大量的被使用；使用CSS感覺好像沒什麼好聊的，不過Angular可是個花費了數年且結合了社群的腦力激盪開發最終才release的框架，對於處理CSS自然有更獨到方便管理的做法，今天就來談談在Angular中使用CSS的一些技巧吧！

<!-- more -->

# 每個Component各自CSS獨立

還記得我們的@Component這個decoration嗎？在每個Angular中的Component都會宣告這個decoration，其中有一個參數是styleUrls，像這樣

```javascript
    styleUrls: ['./todo-items.component.css']
```

Angular會將這裡面的CSS路徑檔案都**轉成目前Component專屬的樣式，並且不會因為不同的Component而造成衝突**，以下舉個例子說明，在我們之前練習的TodoItemComponent中，我們可以打開todo-items.component.css，並輸入以下的樣式

```css
strong {
    color: red;
}

.blue {
    color: blue;
}
```

接著在todo-items.component.html中，我們會加入了使用strong標籤和blue class的內容

```html

<div>
  <strong>TodoItemsComponent中測試strong標籤</strong>
</div>

<div>
  <span class="blue">TodoItemsComponent中測試blue class</span>
</div>

```

執行起來結果如下，基本上沒什麼意外

{% asset_img 0.png %}

接著我們在在header.component.html也加入類似的程式碼看看

```html

<div>
  <strong>HeaderComponent中測試strong標籤</strong>
</div>

<div>
  <span class="blue">HeaderComponent中測試blue class</span>
</div>

```

執行起來畫面如下

{% asset_img 1.png %}

發現到不一樣的地方了嗎？**在HeaderComponent的顯示畫面中我們的strong標籤和加上red class的內容，但卻不會套用TodoItems裡面設定的CSS**，這是怎麼回事呢？讓我們打開開發人員工具(F12)來看看

{% asset_img 2.png %}

可以注意到我們在TodoItemsComponent中所有的標籤都被加上了**_ngcontent-nt-4**這個屬性，而我們之前定義了strong的CSS變成了

```css
strong[_ngcontent-ntl-4] {
    color: red;
}
```

在來看看HeaderComponent裡面的標籤則是都被加上**_ngcontent-ntl-2**屬性，因此就不會被套用到**strong[_ngcontent-ntl-4]**這個selector啦！

{% asset_img 3.png %}

這樣做有什麼好處呢？這樣一來我們就可以更加專注在開發目前的Component上，而不用擔心目前設計的樣式會應想到其他人的樣式，造成調整來調整去的問題，讓樣式設計的關注點也一起分離，開發上就更容易囉。

那麼如果我們使用global的CSS該怎麼辦呢？在Angular專案中，我們還是可以加入global CSS的

# 加入Global的CSS

要使用global CSS，只需要把CSS加入src/style.css就可以了，例如我們可以把原來todo-items.component.css裡面的內容移到src/style.css中，再來看看執行結果

{% asset_img 4.png %}

可以看到不管HeaderComponent還是TodoItemsComponent，只要是用到strong標籤或是red class都會照著style.css裡面的內容呈現了，這是怎麼做到的呢？

在使用Angular CLI建立新專案時，都會有一個angular-cli.json檔案這裡面存放著Angular CLI執行指令時需要的設定檔，在這裡面我們可以看到app.styles的內容

```json
      "styles": [
        "styles.css"
      ],
      "scripts": [],
```

這一段內容就是告訴Angular CLI，在進行編譯程式的時候，請**把style.css也一起編譯進來**，而scripts裡面則可以放入要一起編譯進來的global JavaScript；因此我們也可以使用這種方式加入更多第三方的JavaScript或CSS，例如我們想加入jQuery和bootstrap，我們可以先使用npm進行下載

```shell
npm install --save jquery
npm install --save bootstrap
```

接著調整angular-cli.json裡面app.styles和app.scripts設定

```json
    "styles": [
      "../node_modules/bootstrap/dist/css/bootstrap.css",
      "styles.css"
    ],
    "scripts": [
      "../node_modules/jquery/dist/jquery.js",
      "../node_modules/bootstrap/dist/js/bootstrap.js"
    ],
```

如果我們的ng serve指令正在執行中的話，記得先關掉然後重新執行，才會讀到新的angular-cli.json的設定檔

接著我們就可以在畫面上自由加入bootstrap的樣式啦，例如以下畫面的button就是使用bootstrap的btn-primary

{% asset_img 5.png %}

{% note info %}  
我們也可以使用SCSS，可以參考[https://github.com/angular/angular-cli#css-preprocessor-integration](https://github.com/angular/angular-cli#css-preprocessor-integration)  
{% endnote %}  

# 單元回顧

今天我們介紹了在Angular專案中設定CSS的兩種方法，一種是與各自的Component獨立設計，好處是關注點分離，能更加專注在目前Component的樣式設計上面；若要使用global的CSS，則把CSS路徑加入angular-cli.json即可，如此以來我們可以輕易整合各種第三方的css，讓開發美觀的畫面更加容易！

今天的程式碼在這裡: [https://github.com/wellwind/AngularDotblogsDemo/tree/CssDemo](https://github.com/wellwind/AngularDotblogsDemo/tree/CssDemo)