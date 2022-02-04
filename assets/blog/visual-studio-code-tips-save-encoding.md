---
title: "[Visual Studio Code 小技巧] 將檔案已指定編碼儲存"
date: 2022-01-31 12:00:00
category: "Visual Studio Code 小技巧"
tags:
  - "Visual Studio Code"
---

以下說明如何使用 Visual Studio Code 來將文字檔編碼進行轉換。

範例如圖，目前是一個 Big5 編碼的文字檔：

{% asset_img 01.png %}

我們想轉換成 UTF-8，該如何處理呢？

<!-- more -->

首先按下 `F1` 開啟指令視窗，輸入 `encoding` ，選擇「變更檔案的編碼」按下 Enter

{% asset_img 02.png %}

選擇「以編碼儲存」

{% asset_img 03.png %}

接著選擇想要轉換的編碼，例如「UTF-8 with BOM」

{% asset_img 04.png %}

可以看到檔案就會以「UTF-8 with BOM」的格式儲存啦！

{% asset_img 05.png %}



