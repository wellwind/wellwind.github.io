---
title: "[Schematics 實戰] 在 schema.json 內設定指令參數"
date: 2019-12-08 20:28:34
tags:
  - Schematics
---

之前我們撰寫了第一個 Schematics，也簡單介紹了好用的工具，接著我們開始來學習一些更進階的 Schematics 撰寫與應用，今天我們來看看如何讓 Schematics 接收參數，讓寫出來的工具更有彈性！

<!-- more -->

# 建立一個新的 Schematics

首先我們應該已經安裝 [Schematics Snippets 套件了](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets)，透過此套件，我們可以快速的生成一個基本的 Schematics 程式骨架，按下 `F1`，選擇 `Schematics: Generate A Schematic` 後，輸入今天的練習：`exercise-2`

{% asset_img 01.gif %}

此時會在 `collection.json` 內加上此 `exercise-2` 的設定，另外也會建立兩個檔案在 `exercise-2` 目錄下，分別是

-  `index.ts`：實際執行程式的程式碼
- `schema.json`：關於此 schematic 的相關參數設定

`collection.json` 和 `index.ts` 我們之前都看過了，今天我們要將重點放在 `schema.json` 內。

#帶有參數的呼叫

很多時候，我們會希望使用 `schematics` 指令產生檔案時，能夠使用參數來控制產出的內容，讓程式更有彈性，基本上這是很容易的一件事情，只需要使用 `--key=value` 的格式加在指令後面即可：

```shell
schematics .:exercise-2 --name=Mike
```

這個參數預設會被加入我們建立好的 `index.ts` 內預設的 function 的 `_option` 參數中，我們可以試著把這個變數印出來：

```typescript
export function exercise2(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log(_options);
    return tree;
  };
}
```

{% note info %}

修改 `*.ts` 檔案後，記得要使用 `npm run build` 從重建置程式，或是也可以使用 `npm run build -- --watch`，當檔案有變更時，自動重新建置。

{% endnote %}

結果如下圖：

{% asset_img -2.jpg %}

## 加入 TypeScript 定義

現在我們已經可以成功設定參數了，不過為了方便開發，通常我們會再建立一個 `schema.d.ts`，設定參數的型別，方便進行開發，如下

```typescript
export interface Exercise2Options {
    name: string;
    age: number;
    sex: string;
}
```

之後在原來的程式內就可以替參數套上此段型別定義，享受 TypeScript 帶來的強型別好處：

```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Exercise2Options } from './schema';

export function exercise2(_options: Exercise2Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log(_options);
    return tree;
  };
}
```

# 在 schema.json 內加入更多提示

Schematics 內要使用參數就是這麼簡單，所有事情都會在背後默默完成，但我們可以更進一步替參數設定預設值，或提示使用者要輸入參數等等，這些設定可以在 `schema.json` 內進行處理。

## 提示使用者輸入文字

我們可以打開 `schema.json`，並在裡面的 `properties: {}` 內加入設定

```json
"name": {
  "description": "Your Name",
  "type": "string",
  "default": "Mike",
  "x-prompt": "Your name?"
}
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-property-prompt-input` 快速產生相關程式碼

{% endnote %}

此時程式看起來如下圖：

{% asset_img 03.gif %}

這時候我們使用 `schematics` 指令，但不輸入參數看看：

{% asset_img 04.jpg %}

這時候就可以看到我們自定義的提示訊息啦！可以嘗試看看自己輸入一段文字，或直接按 ENTER，看看印出來的資料。

## 其他提示輸入問題

除了提示輸入文字外，另外常用的設定還有

### 提供一系列選項供使用者選擇

設定：

```json
"sex": {
  "description": "sex",
  "type": "string",
  "default": "m",
  "x-prompt": {
    "message": "Your sex?",
    "type": "list",
    "items": [
      { "value": "m", "label": "Male" },
      { "value": "f", "label": "Female" }
    ]
  }
}
```

成果：

{% asset_img 05.gif %}

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-property-prompt-selection` 快速產生相關程式碼

{% endnote %}

### 讓使用者輸入 true 或 false (y/n) 

設定：

```json
"like": {
  "description": "like",
  "type": "boolean",
  "default": "true",
  "x-prompt": "Like Schematics?"
}
```

成果：

{% asset_img 06.gif %}

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-property-prompt-yes-no` 快速產生相關程式碼

{% endnote %}

## 設定預設參數

如果某個參數一定會輸入，像是 `--name` 屬性這種，可以設定成預設參數，少打一些參數名稱，以 `--name` 為例，我們可以將 `name: {}` 內的 `default` 設定移除，並改成以下程式：

```json
"name": {
  "description": "name",
  "type": "string",
  "$default": {
    "$source": "argv",
    "index": 0
  },
  "x-prompt": "Your Name?"
}
```

成果：

{% asset_img 07.jpg %}

這樣相對就簡單多啦！

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-property-dollar-default` 快速產生相關程式碼

{% endnote %}

# 本日小結

今天我們學習了基本的 `schema.json` 的設定，透過這些設定，可以打造出更容易使用的程式，讓工具推廣更加輕鬆，也可以減少些文件的撰寫哩！
