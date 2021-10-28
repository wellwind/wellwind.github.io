---
title: "[Schematics 實戰] 好用 VSCode 套件介紹 - Schematics Snippets"
date: 2019-12-05 20:00:06
tags:
  - Schematics
  - Visual Studio Code
---

今天來介紹一個自己開發來幫助增加 Schematics 開發生產力的 Visual Studio Code 套件 - [Schematics Snippets](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets)。

<!-- more -->

![Schematics Snippets](https://github.com/wellwind/vscode-schematics-snippets/raw/master/icon.png)

在撰寫程式時，總是會有一些常見的 pattern 出現，但卻需要輸入重複的程式碼。在建立檔案部分，我們可以靠 Schematics 幫忙，而在撰寫部分，則可以靠現在大多程式編輯器都有的功能：「程式碼片段(Code Snippets)」。

而這個套件 [Schematics Snippets](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets) 最初設計的想法就是要整理自己在使用 Visual Studio Code 撰寫 Schematics 時常用的一些程式片段，隨著時間的演化，也額外又產生了一些不錯的功能，今天就來簡單介紹一下吧！

# Code Snippets

使用程式碼片段的方式很簡單，只要在檔案中輸入 `sch-` 開頭的文字，就會列出一些常用的片段出來，例如要建立一個 Rule，可以在 TypeScript 程式中輸入 `sch-rule`：

{% asset_img 01.gif %}

在不同的設定檔案內，會有不同的程式碼片段可以使用，之後的 Schematics 練習中，會再介紹一些已經定義好的程式碼片段，幫助我們提高生產力。

# Schematics 程式碼骨架產生器

上一篇文章中我們已經知道一個基本的 Schematics 產生器應該包含了至少在 `collection.json` 內定義檔案的位置，以及一個相對應的檔案來撰寫程式碼，也就是說，如果我們要產生一個新的 Schematics 產生器，至少要做兩個步驟，相對比較麻煩，這時候可以使用 `F1` -> `Schematics: Generate A Schematic` 指令，來快速產生一個基本的 Schematics 產生器的程式碼骨架：

![Schematics: Generate A Schematic](https://github.com/wellwind/vscode-schematics-snippets/raw/master/docs/images/feat-generate-schematic.gif)

一下子就能產生好相關的檔案啦！！有了好的工具支援，很多繁複的步驟就一下簡化許多了。

# 本日小結

今天很簡短的介紹~~工商~~了一下 [Schematics Snippets](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets) 這個套件，雖然簡短，但對於生產力幫助卻非常的大！而且未來再介紹 Schematics 時也會不斷用到，來節省時間；記得開發 Schematics 一定要裝起來，如果你喜歡的話，也歡迎到套件頁面幫我按個 5 顆星並留下評價，如果你在開發 Schematics 時覺得有其他程式碼片段可以補充，也歡迎留言給我或直接[到 GitHub 上發個 PR](https://github.com/wellwind/vscode-schematics-snippets)！感恩 XDD。
