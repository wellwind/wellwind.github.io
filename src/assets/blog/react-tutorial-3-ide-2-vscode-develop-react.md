---
title: "[React速成班]有錢沒錢，選個編輯器好過年(2)-用Visual Studio Code開發React支援Highlight, IntelliSense]"
date: 2016-03-06 16:12:21
category: React速成班
tags:
    - React
    - Visual Studio Code
---

要讓Visual Studio Code開發React的語法highlight不要亂掉，只需要把.js檔改為.jsx檔即可，不過大部分React的範例還是會用.js檔來完成，這樣會造成我們在閱讀別人程式碼時的不便，所以今天就來介紹一下如何用Visual Studio Code開發React時可以在.js檔內開發JSX也不會造成highlight的問題，另外也介紹一下如何讓Visual Studio Code支援**React的intellisense**。

<!-- more -->

# 讓.js檔支援JSX highlight

要讓Visual Studio Code在.js檔中支援JSX其實很簡單，安裝一個js-is-jsx外掛即可：

1. 首先打開Visual Studio Code後按下`F1`，輸入ext，然後選擇**Extensions: Install Extension**

    {% asset_img ide2-001.png %}

2. 接著輸入**js-is-jsx**，按下Enter

    {% asset_img ide2-002.png %}

3. 重新開啟Visual Studio Code

這時候打開包含JSX的.js檔就可以看到highlight不會亂掉啦！

# 讓Visual Studio Code支援React的IntelliSense

要在Visual Studio中使用React的IntelliSense設定比較複雜一點，接下來就來解說這些步驟...

## 啟用Salsa功能

{% note danger %}
**2016/0316 updated**: Visual Studio Code的February updated中已經預設以使用Salsa作為編輯JavaScript的處理服務了，所以不用再執行啟用Salsa的功能囉。可以直接往下看安裝TypeScript和typings的動作。
{% endnote %}

Salsa是Visual Studio Code強化TypeScript與JavaScript的一項功能，不過目前正在preview中，所以要啟用Salsa，必須做一些比較麻煩的設定：

### 設定系統變數

1. 在我的電腦按右鍵->內容
2. 在進階分頁點擊「環境變數」
3. 點擊「系統變數」下的「新增」按鈕
4. 變數名稱輸入：**VSCODE_TSJS**；變數值輸入：1
5. 確定

{% asset_img ide2-003.png %}

### 安裝TypeScript

打開Node.js指令列，切換到專案目錄下，輸入以下指令

```
npm install typescript@next
```

### 確認Salsa啟用

重新啟動Visual Studio Code，隨便打開一個.js檔，可以看到右下角的狀態列，如果是出現橘色的(Salsa !)，代表沒有成功

{% asset_img ide2-004.png %}

如果出現白色的(Salsa)就成功啟用Salsa啦！

{% asset_img ide2-005.png %}

## 加入tsconfig.json

請用Salsa後，接著在專案的跟目錄加上一個tsconfig.json檔案，並加入以下內容，告知Visual Studio Code在目前專案處理JavaScript的方法：

```json
{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs"
    }
}
```

## 安裝typings

{% note danger %}
**2016/09/18 updated**: TypeScript 即將推出，屆時將不需要使用typings，而是將所有定義檔交由npm管理，但還不是正式版不確定會來發展會如何，所以這裡先不介紹
{% endnote %}

接著使用npm安裝typings，typings是另外一隻命令列的程式，可以幫助你**尋找並安裝TypeScript的定義檔**，雖然我們沒有要用TypeScript開發程式，但**Visual Studio Code依然可以透過TypeScript的定義檔，來完成JavScript內IntelliSense的功能**

```
npm install -g typings
```

## 利用typings安裝IntelliSense定義檔

安裝完typings後，切換到專案的資料夾，利用typings安裝react-global跟react的定義檔

```
typings install react-global --ambient
typings install react --ambient
```

就算是大功告成啦！

在檔案中輸入React時，就可以看到IntelliSense的結果

{% asset_img ide2-006.png %}

在React compoment內的lifecycle api也照常顯示！

{% asset_img ide2-007.png %}

# 單元回顧

本篇介紹了讓Visual Studio Code支援React開發的一些設定方法，設定完只能說句Visual Studio Code好棒棒啊XD