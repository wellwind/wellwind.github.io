---
title: "[Inno Setup] 包裝安裝檔時顯示中文"
date: 2022-02-03 18:59:52
category: "Inno Setup"
tags:
  - "Inno Setup"
---

Inno Setup 內建多種語言的安裝檔，不過內建不支援繁體中文，雖然文件上有非官方語言包可以下載，但還是有一些地雷在，這篇文章就簡單記錄一下。

<!-- more -->

# 下載語言包

在 Inno Setup 文件中，有提供各種語言的[語系檔下載](https://jrsoftware.org/files/istrans/)，在下方有繁體中文的版本可以直接下載。

我們只需要把檔案放到 Inno Setup 安裝目錄下的 Languages 目錄即可。

（預設目錄為 `C:\Program Files (x86)\Inno Setup 6\Languages`)

之後在執行腳本精靈時就會多一個「Chinese Traditional」的選項。

{% asset_img 01.png %}

產出的腳本程式碼：

```ini
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesetraditional"; MessagesFile: "compiler:Languages\ChineseTraditional.isl"
```

# 解決編碼問題

現在已經有繁體中文的語言檔了，不過此時若直接編譯成安裝檔並執行，會看到一連串的亂碼：

{% asset_img 02.png %}

如果遇到這個問題，代表我們的檔案編碼有問題，要記得務必儲存成「包含 BOM 的 UTF8 檔案」。

可以參考之前寫的文章，[以 Visual Studio Code 將檔案轉為指定編碼儲存](https://fullstackladder.dev/blog/2022/01/31/visual-studio-code-tips-save-encoding/)，同時選擇 「**UTF-8 with BOM**」。

{% asset_img 04.png %}

同時要記得，安裝檔 `iss` 和語言檔 `isl` 都需要變更編碼。

之後就可以看到正確編碼的安裝檔囉。

{% asset_img 03.png %}

