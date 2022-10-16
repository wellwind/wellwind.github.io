---
title: "[Chrome DevTools] 透過開發者工具動態切換暗黑模式"
date: 2022-10-16 10:47:15
category:
  - "Chrome DevTools"
tags:
  - "Chrome DevTools"
  - "DarkMode"
ogImage: 04.png
---

Dark mode (暗黑模式) 已經逐漸成為現代網頁開發的主流，很多網站也都逐漸加入的對 dark mode 的支援，讓網站預設也可以跟著作業系統的深色或淺色模式自動切換

雖然顏色偏好讓使用者體驗更好，但也確實增加了網站開發時期的負擔，我們必須同時測試兩種顏色模式的顯示效果，如果每次測試都要主動切換系統的模式，也未免太辛苦了！還好 Chrome DevTools 內建了主題切換，讓我們可以直接在開發工具切換目前網頁的顯示模式，大幅度的節省時間，今天就來看看如何在深色和淺色模式之間自由的切換！

<!-- more -->

# 切換深色/淺色測模式

## Emulate CSS media

在 Chrome 的開發工具中，我們可以模擬各種不同的 CSS media 狀態，除了深色/淺色模式外，甚至也可以模擬在列印模式下的顯示，非常方便。

## 打開 Rendering 視窗

在打開 DevTools 後，我們可以點選左邊直接從 `More Tools` 下選擇 `Rendering`

{% asset_img 01.png %}

另外也可以直接用 Command Pelette 開啟 Rendering 視窗

`Ctrl + Shift + P` -> `Show Rendering` 

{% asset_img 02.png %}

## 設定 prefers-color-sheme

開啟 Rendering 視窗後，在下面就會有一個「Emulate CSS media feature prefers-color-scheme」，在這裡就可以切換深色/淺色模式啦！

{% asset_img 03.png %}

{% note info %}

Rendering 下還有很多功能，有興趣都可以試試看

{% endnote %}

當然，不一定要開啟 Rendering 視窗才可以設定，我們也可以直接用 Command Pelette 快速切換

{% asset_img 04.png %}

# 相關資源

- [Emulate CSS media features - Emulate CSS media feature prefers-color-scheme](https://developer.chrome.com/docs/devtools/rendering/emulate-css/#emulate-css-media-feature-prefers-color-scheme)
