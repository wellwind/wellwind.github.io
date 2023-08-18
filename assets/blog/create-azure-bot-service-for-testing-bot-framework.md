---
title: "建立 Azure Bot Service 來測試 Bot Framework"
date: 2023-02-19 13:08:43
category:
  - "Azure Chat Bot"
tags:
  - "Microsoft Bot Framework"
  - "Bot Framework SDK"
  - "ChatBot"
  - "Azure Bot Service"
ogImage: "00.webp"
---

上一篇文章我們介紹了如何[使用 Microsoft Bot Framework SDK 打造跨平台聊天機器人](https://fullstackladder.dev/blog/2023/02/18/develop-chat-bot-using-microsoft-bot-framework/)，今天我們來介紹一下如何使用 Azure Bot Service 來測試 Bot Framework，並且為未來發佈到各個平台做準備。

<!-- more -->

{% asset_img 00.webp (width=640) %}

## 建立 Azure Bot Service

透過 Azure Portal，我們很容易可以將一個 Azure Bot Service 加入我們的資源群組

{% asset_img 01.webp (width=640) %}

接著就是輸入一些服務的基本資訊了，包含名稱、地區、計費方案 (測試時可以選擇 F0 使用免費的就好) 等等；另外，使用 Azure Bot Service 需要註冊一個 Microsoft App Id，我們可以依照自己的需要決定類型。

如果我們的機器人不需要存取目前租戶以外的資源，可以選擇「User-Assigned Managed Identity」，不然則可以選擇「單租戶 (Single Tenant)」或「多租戶 (Multi Tenant)」。之後則可以選擇現有的 App Id，或是讓 Azure Bot Service 幫我們建立一個新的。

由於我們要進行本機測試，所以會將本機的資源開放給 Azure Bot Service 使用，同時為了未來可以跟其他服務整合，這裡選擇「多租戶」

{% asset_img 02.webp (width=640) %}

之後按下 "Review + Create" 確認沒問題後再按下 "Create" 即可建立相關資源。

## 設定 Azure Bot Service 訊息來源

接著我們要讓 Azure Bot 與我們用 Bot Framework 開發好的程式整合在一起，由於目前是本機開發，我們可以使用 [ngrok](https://ngrok.com/) 工具，讓本機的服務可以透過網路被外部存取。

```sh
ngrok http 3978 --host-header rewrite
```

我們會得到一段公開的網址，這段網址會對應到我們本地端地 3978 port：

{% asset_img 03.webp %}

接著我們要將這個網址填入 Azure Bot Service 的訊息來源；進入 Azure Bot Service 服務後，選擇左邊「Configuration」，接著選擇「Messaging Endpoint」，將 ngrok 的網址加上 `/api/messages` 填入後按下「Apply」儲存。

接著我們要記錄一些聊天機器人程式中要使用的資訊，在目前設定這個畫面，我們要將「Bot Type」和「Microsoft App ID」記錄下來，

{% asset_img 04.webp (width=640) %}

同時點擊「Microsoft App ID」旁邊的 「Manage Password」，建立一組密碼

{% asset_img 05.webp (width=640) %}

這組密碼要先記錄下來，只會顯示一次，之後就無法再看到了。

{% asset_img 06.webp %}

最後，在這個 App 頁面的 Overview 可以查到整個帳號的「租戶 ID」也就是「Directory (tenant) ID」，也要記錄下來。

{% asset_img 07.webp %}

## 在程式中設定 Bot Service

接著我們要在程式中設定 Bot Service 資訊，這些資訊可以讓 Azure Bot Service 驗證我們的應用程式，以確保可以安全只有我們寫的程式可以使用我們建立的 Azure Bot Service 資源。

我們可以修改之前建立的專案的 `.env` 檔，內容都是上一個步驟抄下來的

```txt
MicrosoftAppType=[[Bot Type]]
MicrosoftAppId=[[Microsoft App ID]]
MicrosoftAppPassword=[[APP 的密碼，上一步驟建立的]]
MicrosoftAppTenantId=[[租戶 ID]]
```

接著再使用 `npm start` 或 `npm run watch` 執行伺服器，就可以開始測試了。

## 使用 Test in Web Chat 進行測試

最後，在 Azure Bot Service 中，我們可以使用 Test in Web Chat 功能來測試我們的機器人，這個功能可以讓我們在瀏覽器中測試我們的機器人，並且可以在瀏覽器中看到機器人的回應。

{% asset_img 08.webp (width=640) %}

## 組合其他來源 (Channel)

我們可以在其他服務測試聊天機器人的回應，這部分可以在 Azure Bot Service 中的 Channels 中，看到支援服務，輸入相關資訊後按下「Apply」啟用。

{% asset_img 09.webp (width=640) %}

在每個服務設定頁面中，也可以看到文件連結，點擊進去即可參考該服務的設定方式

{% asset_img 10.webp (width=640) %}

## 本日小節

今天我們已經成功建立 Azure Bot Service，並可以在本機建立服務測試了，接下來當我們的聊天機器人完成後，就可以將服務發佈到任何一個支援的網站服務上，並在 Configuration 中設定 Message Endpoint，再到 Channels 中請用想要支援聊天機器人的服務，就可以開放讓所有人使用機器人啦！

## 相關資源

- [Provision and publish a bot](https://learn.microsoft.com/en-us/azure/bot-service/provision-and-publish-a-bot?view=azure-bot-service-4.0&wt.mc_id=DT-MVP-5003734&tabs=userassigned%2Ccsharp)
- [Debug a bot from any channel using ngrok](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-debug-channel-ngrok?view=azure-bot-service-4.0&wt.mc_id=DT-MVP-5003734)
- [Configure a bot to run on one or more channels](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-manage-channels?view=azure-bot-service-4.0&wt.mc_id=DT-MVP-5003734)
