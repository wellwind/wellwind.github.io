---
title: "[Schematics 實戰] 撰寫第一個 Schematics"
date: 2019-12-01 20:33:04
tags:
  - Schematics
---

上篇文章我們介紹了[Schematics 的基礎](https://wellwind.idv.tw/blog/2019/11/30/schematics-workshop-01-intro/)今天我們來快速學學如何撰寫第一個 Schematics。

<!-- more -->

# 前置準備

## 安裝 schematics-cli

要開始撰寫 Schematics，首先需要安裝 [@angular-devkit/schematics-cli](https://www.npmjs.com/package/@angular-devkit/schematics-cli)，這部份對於現在大部分前端開發人員應該都沒有難度才對：

```shell
npm install -g @angular-devkit/schematics-cli
```

## 建立一個空的 Schematics 專案

安裝完 Schematics CLI 後，就可以輕鬆地透過指令產生一個基本的 Schematics 專案啦！

```shell
schematics blank --name=schematics-workshop
```

之後就會看到這樣的畫面，有使用過 Angular CLI 產生程式碼的話應該會覺得這畫面很熟悉

{% asset_img 01.jpg %}

## 建立包含基本範例的 Schematics 專案

剛才的指令我們使用 schematics 這個命令，加上 `blank`  參數來建立一個空的 Schematics 專案，另外我們也可以使用 `schematic` 指令，來建立包含一些基本範例檔案的專案：

```shell
schematics schematic --name=schematics-workshop-with-samples
```

為了方便進行，接下來我們都用空白的 Scheamtics 專案來說明。

# Schematics 專案架構

接下來我們使用 Visual Studio Code 打開 schematics-workshop 這個專案目錄，看看裡面有哪些重要內容：

{% asset_img 02.jpg %}

## package.json

不用多說，這是現在前端開發人員都認得的套件設定檔，而在這個套件設定檔內，有一個 `schematics` 的設定

```json
"schematics": "./src/collection.json"
```

看到這個設定，就代表這是一個 Schematics 專案啦！未來在使用 Schematics CLI 時，都會從 `package.json` 內的 `schematics` 設定來判斷是否為 Schematics 專案，同時去找出有哪些可使用的產生器

## src/collection.json

沿著 `package.json` 的 `schematics` 設定，即可找到這個 `collection.json`，裡面內容如下：

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "schematics-workshop": {
      "description": "A blank schematic.",
      "factory": "./schematics-workshop/index#schematicsWorkshop"
    }
  }
}
```

在這裡面的 `schematics: { }` 設定，就代表了這個專案內有多少個產生器可以使用，以目前的例子來說，有一個名為 `schematics-workshop` 的產生器，包含兩個屬性設定：

- description: 說明文字
- factory: 實際上會執行的程式來源，以這個例子來說，會是 `./schematics-workshop/index.js` 檔案的 `schematicsWorkshop` 這個函式

## src/schematics-workshop/index.ts

雖然真實會執行的程式是 `./schematics-workshop/index.js` 但 Schematics 預設建立的是 TypeScript 專案，因此在建置前，只有 `./schematics-workshop/index.ts` 這個檔案，裡面的內容也很簡單：

```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function schematicsWorkshop(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

在程式內可以看到 `schematicsWorkshop` 是一個函式，回傳型別為 `Rule`，而 `Rule` 的結構是什麼呢？其實也是回傳另外一個函式，且這個函式有兩個參數 `(tree: Tree, _context: SchematicContext)`，同時回傳值為 `tree`。

因此我們可以理解為將一個參數包含 tree 且會回傳 tree 的函式，就是一個 `Rule`。

{% note info %}

這裡還有 `_options: any` 和 `_context: SchematicContext`，未來會再介紹。

{% endnote %}

# 開始嘗試建立檔案

終於看到 Tree 和 Rule 的本尊了，接下來我們就在 Rule 內，異動看看 Tree 吧！這裡我們簡單使用 `create()` 方法來建立一個檔案，此時 `index.ts` 完整內容為：

```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function schematicsWorkshop(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('hello.txt', 'world');

    return tree;
  };
}
```

我們只加入了一行程式碼：`tree.create('hello.txt', 'world');`，可以將這段程式碼解讀為，執行 Tree 的 `create()` 這個 Action，來改變 Tree 的結構。

從程式碼中，我們也可以很容易的理解成會建立一個檔案，檔名為 `hello.tx`，內容為 `world`。

# 執行寫好的 Schematics

## 建置 TypeScript

接著我們就來執行看看吧！要執行寫好的 Schematics 前，我們要先將 TypeScript 程式碼轉成 JavaScript 程式碼，只要執行 `npm run build` 即可。此時會看到產生了相關的 `.js` 檔案。

{% asset_img 03.jpg %}

## 執行 Schematics

接著就可以使用以下指令執行我們寫好的程式囉：

```shell
schematics .:schematics-workshop
```

這裡可以分成三個部分，第一個是執行 `schematics` 這支程式，而後面的 `.:schematics-workshop` 參數，實際上的規則為`套件名稱:Schematics名稱`，也就是代表目前 Schematics 專案 (`.`) 下的 `schematics-workshop` (名稱設定在 `collection.json`) 這支 Schematics 程式。

執行後就可以看到以下訊息：

{% asset_img 04.jpg %}

看起來 `hello.txt` 建立好啦！但實際上卻找不到這個檔案，怎麼回事呢？

{% asset_img 05.jpg %}

這是因為當執行 Schematics 時設定的套件名稱為目前套件，也就是 `.` 的時候，為了避免不斷產生無謂的檔案，因此預設會以 **dry run** 的模式進行，也就是 Tree 雖然被改變了，但卻不會改變檔案系統，這樣在測試有產生哪些檔案時，才不用擔心一直產生不必要的檔案。

若想真的看看改變檔案系統的結果，可以加上 `--dry-run=false` 參數，關閉 dry run 模式

```shell
schematics .:schematics-workshop --dry-run=false
```

結果如下：

{% asset_img 06.jpg %}

檔案就實際上被產生啦！透過這樣的練習，我們可以發現 Schematics 在實際上撰寫程式時，並不會真的去直接改變檔案系統，而是在真正被要求改變時，才會將變更結果套用到檔案系統上，相對安全的多！

{% note info %}

當使用的是外部套件時，預設會關掉 **dry run** 模式，直接產生檔案，減少額外的參數設定，當然這時候也可以手動加上 `--dry-run` 參數，只看產生了哪些檔案，而不要實際改變檔案系統。

{% endnote %}

# 其他 Tree 的 API

除了 `create()` 外，Tree 有很多基本的內建 API，來幫助我們改變 Tree 的結構，以下簡單介紹幾個常用且名稱也非常直觀，一看就知道功用的的 API：

- `delete`: 刪除檔案
- `overwrite`: 複寫檔案內容
- `rename`: 重新命名檔案
- `exist`: 檢查檔案是否存在
- `read`: 讀取檔案內容

拜 Visual Studio Code 與 TypeScript 所賜，這些 API 可用的參數都很容易看得到：

{% asset_img 07.jpg %}

其他還有很多，未來有機會再來介紹。

有了這些 API，我們就幾乎能夠完成大部分檔案系統變更的需求，其他的都是工具的使用，如 Schematics 設定、各種 Tree APIs 和 Rules；或是需要異動程式碼時，需要另外的語法樹 (AST，Abstract Syntax Tree) 工具協助分析等等，但本質上都還是需要對檔案系統進行操作。

# 本日小結

今天我們實際動手建立了一個 Schematics 程式，並透過它來產生一個檔案，有了這樣的概念，我們就可以完成大部分檔案系統操作的需求囉。接下來就是各種設定和應用的情境啦！不過在這之前，下一篇文章我們先來介紹一些好用的工具，讓開發或使用 Schematics 更加得心應手！！
