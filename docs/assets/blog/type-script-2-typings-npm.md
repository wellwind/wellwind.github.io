---
title: 使用TypeScript2.0撰寫強型別的JavaScript並透過NPM管理定義檔
date: 2016-09-23 23:02:36
tags:
    - JavaScript
    - TypeScript
    - Visual Studio Code
    - NPM
---

TypeScript在美國時間2016/09/22正式推出2.0啦！TypeSciprt 2.0除了推出更多方便的語法之外，個人認為最大的特色就是把原本的d.ts定義檔通通移到npm上去啦。這麼一來我們在專案上就可以省去很多不定要的設定步驟，今天就來介紹一下如何在TypeScript 2.0中使用npm上的定義檔。

<!-- more -->

# 事前準備

1.  安裝[node.js](https://nodejs.org/en/)
2.  安裝TypeScript 2.0

```Shell
npm install -g typescript@2.0
```

我們可以使用`tsc -v`來檢查目前TypeScript的版本。

{% asset_img ts-001.png %}

接下來我們將會使用[Visual Studio Code](https://code.visualstudio.com/)作為編輯器，並試著使用[fabric.js](http://fabricjs.com/)的定義檔，來看看TypeScript 2.0如何使用.d.ts的定義檔。

會使用fabric.js只是因為正好最近使用中拿來當練習而已，我們可以換成任何一個在npm上定義好的套件。

我們可透過<http://microsoft.github.io/TypeSearch/>來搜尋那些定義檔已經在npm上面可以使用了。

{% asset_img ts-002.png %}

# 開始使用

首先我們先建立一個TypeScript2Test資料夾，並使用npm init先設定好一個基本的專案，以及一個基本的`tsconfig.json`檔，讓TypeScript的編譯器(tsc指令)知道目錄下的*.ts檔該如何處理，內容大致如下

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false
    }
}
```

接著打開編輯器試著輸入以下程式碼：

```javascript
var position = new fabric.Text("test", {
    top: 10,
    left: 10,
    hasControls: false
});
```

接下來到指令列中切換到專案目錄，輸入`tsc`，就會看到以下錯誤訊息

{% asset_img ts-003.png %}

可以看到TypeScript的編譯器找不到fabric的定義，假如打開Visual Studio Code，也可以看到一樣的紅色蚯蚓錯誤

{% asset_img ts-004.png %}

# 使用NPM安裝定義檔

在過去TypeScript 2.0之前，我們必須先通過npm安裝typings工具，然後在透過typings cli下指令安裝定義檔，還有一些囉嗦的設定，雖然現在也還是可以用，但是感謝TypeScript 2.0把尋找定義的方式都整合到npm裡面了，我們就可以透過本來就習慣使用的npm來進行定義檔安裝了！

我們可以透過以下指令安裝npm上的定義檔

```shell
npm install --save @types/fabric
```

接著在使用tsc 編譯，就不會有錯誤訊息囉

{% asset_img ts-005.png %}

沒錯！只要簡單的使用npm指令，不用做任何額外設定，就可以使用特定的定義檔啦！這比起之前一堆詭異設定，還要簡單漂亮多了阿！！

## 讓Visual Studio Code支援TypeScript 2.0

{% note warning %}

以下是目前Visual Stuio Code的配套版本還未升級到2.0的應急解法，為了Visual Studio Code改版後，或許就不需要做以下的調整了。

{% endnote %}

{% note danger %}

現在Visual Studio已經完全吃tsconfig.json檔的內容囉！以下文章內容只當作紀錄留念

{% endnote %}

如果是使用Visual Studio Code來開發TypeScript程式的話，由於Visual Studio Code目前內建的配套版本是1.8.10，因此使用Visual Studio Code打開檔案時還是會看到紅色蚯蚓的錯誤，因此我們必須額外做點設定，讓Visual Studio Code使用特定目錄的TypeScript編譯器。

首先將TypeScript 2.0安裝到專案的目錄下

```shell
 npm install --save-dev typescript@2.0
```

接著進入「檔案→喜好設定→工作區設定」，會開啟一個settings.json檔案，加入以下內容

```json
{
     "typescript.tsdk": "node_modules/typescript/lib"
}
```

意思時告訴Visual Studio Code在處理TypeScript時，使用自己專案下安裝的TypeScript版本處理，接著重新開Visual Studio Code，就可以發現不但不會有紅色蚯蚓的錯誤符號，Visual Studio Code還很貼心的把定義檔的資訊都呈現出來給你看囉！

{% asset_img ts-006.png %}

# 參考資料

https://blogs.msdn.microsoft.com/typescript/2016/09/22/announcing-typescript-2-0/

http://blog.miniasp.com/post/2016/08/22/TypeScript-Future-Declaration-Files.aspx

http://blog.miniasp.com/post/2016/08/19/Change-TypeScript-Versions-in-Visual-Studio-Code.aspx