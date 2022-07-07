---
title: "如何在 Azure CloudShell 上傳/下載檔案"
date: 2022-07-05 18:51:20
category: "Azure 小技巧"
tags:
  - "Azure"
  - "Azure CloudShell"
---

Azure CloudShell 可以幫助我們直接在 Azure Portal 上直接下指令進行各種資源的操作，不過偶爾我們需要將地端的檔案上傳到 Azure CloudShell 或是需要將在 Azure CloudShell 上面的檔案下載下來，今天分享一些小技巧，讓我們可以輕鬆的在 Azure CloudShell 上傳/下載檔案。

<!-- more -->

# Azure CloudShell 上傳/下載技巧

## 直接使用 Azure CloudShell 的上傳/下載功能

在 Azure CloudShell 介面上方，有一個上傳/下載功能，這是最直覺快速的一種方法

{% asset_img 01.png %}

選擇上傳時，可以直接選擇本地的檔案上傳；選擇下載時，則需要自行輸入 Azure CloudShell 上的檔案路徑

{% asset_img 02.png %}

如果檔案存在，則右下角會出現下載連結，點擊後就可以下載了

{% asset_img 03.png %}

## 使用 Azure Storage FileShare

使用 Azure CloudShell 時，會先建立一個 Azure Storage FileShare，所以我們只要找到這個 Storage account，也可以直接在 Azure Portal 介面上進行檔案的上傳/下載

{% asset_img 04.png %}

這裡面的內容會背當成網路磁碟掛載到 Azure CloudShell 的 `clouddrive` 目錄下

{% asset_img 05.png %}

由於是一個 FileShare，因此我們也可以直接掛載成為本機的網路磁碟，點擊上放的「Connect」後，會根據不同的作業系統提示要如何掛載這個磁碟

{% asset_img 06.png %}

## 使用 download 指令下載檔案

最後分享一個小技巧，在操作 Azure CloudShell 時，如果想要下載檔案，可以直接用 `download` 指令進行下載

{% asset_img 07.png %}

# 本日小節

Azure CloudShell 是一個非常方便的功能，讓我們能在 Azure Portal 的 web 介面上也能快速的執行一些指令來操作資源。當然有些時候還是需要整合地端的檔案，這時候透過上傳/下載的功能，就能快速的達到目標了！
