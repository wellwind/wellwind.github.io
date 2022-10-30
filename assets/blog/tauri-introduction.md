---
title: "Tauri 初體驗：前端打造桌面應用程式的小巧快速新選擇"
date: 2022-10-30 14:56:12
category:
  - "Tauri"
tags:
  - "Tauri"
ogImage: 00.png
---

[Tauri](https://tauri.app/) 放在我的待研究項目裡面已經有好一段時間了，原本有研究了一小斷時間，但因為環境準備太過複雜而暫時停止。

最新忽然發現 Tauri 出到 v1.1，不再是 beta 版了，看了一下文件發現整體環境準備變得非常簡單，而且功能及文件也都非常完整了，就花了點時間研究一下，整理成以下筆記，也說說自己的體驗心得。

<!-- more -->

{% asset_img 00.png %}

# Tauri 簡介

Tauri 是一套用來幫助我們透過前端技術打造桌面應用程式的工具，這種工具中最經點的非 [Electron](https://www.electronjs.org/) 莫屬了，這類型的工具背後的運作原理都是透過在一個視窗程式中嵌入瀏覽器來顯示我們的網頁，並透過一些 API 讓我們可以在前端直接進行一些桌面應用程式的操作，例如：檔案存取、剪貼簿存取、訊息視窗、系統通知等等。

不過 Electron 是使用 Chromium 當做瀏覽器顯示網頁，因此最終產出的檔案通常都會非常肥大，就算一個空的 Electron 程式，產出的檔案都有 100MB 以上。

而 Tauri 則是直接使用了作業系統自帶的 WebView，因此產出的檔案會比較小，而且也不需要安裝瀏覽器。

{% note info %}

使用 Chromium 雖然肥大，但可以固定版本，以確保在任何平台都可以達到一樣的顯示效果，而使用系統的 WebView 則是會因為作業系統的不同而有所差異，但是可以確保產出的檔案較小。

不過現在各家 WebView 對於 HTML / CSS / JavaScript 的標準支援也越來越完整，因此大多數使用較新的電腦及作業系統的情況下這種問題都可以省略，當然如果真的用到了某些特殊的功能，或是目標受眾使用的作業系統較舊，還是需要多注意一下。

{% endnote %}

關於使用的 WebView，可以參考 Tauri 文件：[WebView Versions](https://tauri.app/v1/references/webview-versions/)

更詳細的 Tauri 介紹也可以參考 Tauri 官方文件：[What is Tarui?](https://tauri.app/about/intro)

# 開始使用 Tauri

## 前置環境準備

除前端環境如 npm 之外，由於 Tauri 是使用 Rust 開發的，我們還需要做一些相關環境的準備，這部分不複雜，只要照著文件操作應該都不會失敗，可以參考文件的「[Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)」依照自己的作業系統進行操作。

## 建立 Tauri App

Tauri 提供了 [create-tauri-app](https://github.com/tauri-apps/create-tauri-app) 工具，可以幫助我們快速產生一個包含前端應用程式的 Tauri 專案，我們可以輕鬆的使用 npm 等套件管理器來建立一個 Tauri 應用程式

```
npm create create-tauri-app
```

{% asset_img 01.png %}

可以看到 Tauri 也支援了許多目前主流的前端技術，如 Angular、Vue、React、Svelte 等等，由於我比較熟悉 Angular，就直接選擇 Angular 吧！

以下是產出來的目錄結構
  
{% asset_img 02.png %}

在 `src` 目錄內就是主要的前端專案，而 `src-tauri` 則是 Tauri 的專案。大致看了一下，前端專案就是很標準的 Angular 專案（因為我們選擇的是 Angular 專案範本），沒有什麼太大問題。

我們可以先使用 `npm i` 指令安裝相關套件，之後可以用 `npm run dev` 來建置前端應用程式，不過這樣依然只是一個網頁，看不到 Tauri 產生的桌面應用程式效果，因此我們可以使用 `npm run tauri dev` 來建置 Tauri 應用程式。

Tauri 會先幫我們執行 `npm run dev` 來建立前端應用程式以及測試伺服器，同時會編譯 Rust 專案內的桌面應用程式：

{% asset_img 03.png %}

最後就會產生一個桌面應用程式，並將網頁嵌入啦！

{% asset_img 04.png %}

{% note info %}

在 dev 模式下，所有的 Rust 程式或設定檔修改，也都會重新自動編譯。

Angular 在 development mode 的 live reload 也一樣有效喔！

{% endnote %}

# 其他 Tauri 使用技巧

以下只列一些目前玩過，且覺得重要的技巧，更多的技巧可以參考 Tauri 官方文件：[Tauri Guides](https://tauri.app/guides)。現在文件已經非常完整，幾乎方方面面都考量到了。

## 作業系統 API 呼叫

會選擇使用桌面應用程式，除了不用依賴網站，任誰都可以下載使用以外，還有一個很大的重點是可以使用作業系統的 API，例如將檔案寫到某個指定位置，或是讀取某個指定位置的檔案等等，這都是網頁本身做不到的事情。

### 使用 IPC

Tauri 提供了一個前端的 `invoke` 方法，讓我們可以跟 Rust 程式溝通：

```typescript
import { invoke } from "@tauri-apps/api/tauri";

...

invoke<string>("greet", { name }).then((text) => {
  this.greetingMessage = text;
});
```

以上程式使用 `invoke` 方法送出一個 `greet` 指令，並將 `{ name }` 物件當做參數傳送，並使用非同步的方式得到結果。

我們可以打開 `src-tauri/src/main.rs` 來看看 Rust 的部分，也針對 `greet` 這個指令進行了處理：

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

我們可以把 Rust 這部分想像是一個 API，只是並不是一般前端常見的 Web API，而是透過 [IPC](https://tauri.app/v1/references/architecture/inter-process-communication/) (Inter-Process Communication) 的方式與寫好的 Rust 溝通，更多細節可以參考文件的「[Calling Rust from the frontend](https://tauri.app/v1/guides/features/command/)」部分。

重要的是，因為可以與 Rust 溝通，所以我們可以使用作業系統的 API，例如讀取檔案等等。

### 使用 JS/TS API

上述方法雖然很有彈性，但對我來說有一個很大的問題，就是我並不熟悉 Rust，因此這對我來說難度就比較大了，好在 Tauri 也另外提供了 JavaScript/TypeScript API，來幫助我們進行一些作業系統層級的操作，以存取檔案來說，可以使用 [fs](https://tauri.app/v1/api/js/fs) API。

由於安全性考量，通常還需要做一些額外的設定，這些在文件中都有相關的說明，設定完後就可以直接使用相關的 API，例如：

```typescript
import { readTextFile } from '@tauri-apps/api/fs';

await writeTextFile('/tmp/temp.txt', 'Hello World!');
```

## 建置執行檔

我們不可能永遠都用 `tauri dev` 指令來執行程式，最終還是要打包成可以使用的執行檔，提供給他人使用。

要打包成最終給他人使用的應用程式也很簡單，直接執行 `npm run tauri build` 即可，最終產生的結果會放在專案目錄的 `/src-tauri/target/release/bundle` 下。

以 MacOS 來說，可以再往下找 `macos/{{name}}.app` 就是實際上的執行檔了：

{% asset_img 05.png %}

可以看到這個行檔才 7.7MB！比起 Electron 隨便就 100MB 起跳來說，可以說是超級輕量阿！！

除了單純的 `*.app` 執行檔外，Tauri 也順便打包成了 `*.dmg` 檔，這是 Mac OS 的安裝檔格式。

{% asset_img 06.png %}

在 Windows 下一樣可以打包成執行檔 (`*.exe`) 以及安裝檔 (`*.msi`)，Linux 使用者也可以包裝成 Debian 套件，如果應用程式想要給各個平台使用，Tauri 也可以使用 GitHub Actions 來自動化打包，同時也省去準備一堆作業系統的麻煩。

相關指令和作法都可以在 [Building](https://tauri.app/v1/guides/building/) 文件中找到！

# 本日小結

Tauri 剛出來時，很多文件都還不太完整，要安裝起整個開發環境也非常複雜，而隨著新版本的推出，現在安裝方式已經變得非常簡單了，同時文件也非常完整，對於一個比較熟悉前端的開發人員來說，幾乎不用花什麼力氣跟 Rust 打交道，產生出來的檔案又非常小（再次看向 Electron），對於有需要將網頁應用程式打包成桌面應用程式的人來說，相信 Tauri 會是一個不錯的選擇！
