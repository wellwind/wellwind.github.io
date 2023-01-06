---
title: "[Visual Studio Code 小技巧] 改變檔案的換行符號"
date: 2022-09-10 21:12:52
category: "Visual Studio Code 小技巧"
tags:
  - "Visual Studio Code"
---

換行符號在不同的作業系統上有不同的表示方式，Windows 會使用 CRLF (a.k.a `\r\n`)，而 Linux 則是使用 LF (a.k.a `\n`)，這樣在不同的作業系統上，如果有人使用不同的換行符號，有時就會出現一些問題，所以我們需要在不同的作業系統上都使用相同的換行符號，這樣才能避免不同的問題。

這篇文章就來說說如何用 VSCode 來改變檔案的換行符號。

<!-- more -->

## 如何判斷檔案的換行符號

打開文件後，在右下角可以看到目前的換行符號，如下圖：

{% asset_img 01.png %}

如果顯示 LF 就代表 Linux/Mac 系統使用的換行符號，CRLF 代表 Windows 系統的換行符號。

### 變更換行符號

#### 滑鼠版

最直覺簡單的方法，是直接點擊右下角的換行符號，然後選擇要轉換的換行符號，如圖：

{% asset_img 02.png %}

#### 鍵盤版

不用滑鼠就是潮，所以我們也可以用鍵盤來完成這個動作，首先按下 `F1` 開啟指令視窗，輸入 `Change of Line Sequence` 後，按下 Enter，即可切換當下檔案的換行符號。

{% asset_img 03.png %}
