---
title: "使用 Microsoft Bot Framework SDK 打造跨平台聊天機器人"
date: 2023-02-18 15:13:57
category:
  - "Azure Chat Bot"
tags:
  - "Microsoft Bot Framework"
  - "Bot Framework SDK"
  - "ChatBot"
ogImage: "00.webp"
---

最近 AI 聊天機器人正夯，也出現不少整合 AI 到這種聊天機器人的服務，方便我們整合到 LINE、Slack 或是 Microsoft Teams。

而微軟推出的 Azure Bot Service 以及 Microsoft Bot Framework，可以幫助我們用一套程式碼，就整合到多家不同的聊天平台，今天就來介紹一下如何使用 Microsoft Bot Framework SDK 打造跨平台聊天機器人。

<!-- more -->

{% asset_img 00.webp (width=640) %}

## Bot Framework SDK

Bot Framework SDK 是微軟提供來打造對話機器人的相關模組，除了讓我們可以快速的開發對話機器人以外，也可以與微軟的 AI 服務平台 Azure Cognitive Service 整合；同時支援多種語言，包含 C#、JavaScript、Python 和 Java (不過 Python 和 Java 即將被退休了)。

## 打造第一支聊天機器人

以下我們將用 node.js 作為示範。

### 建立專案

首先當然是要建立一個聊天機器人的專案，關於 node.js 的專案建立，應該是很基礎的部分，就不多做介紹。

```sh
mkdir my-bot
cd my-bot
npm init -y
```

之後我們需要將 node.js 專案轉換成 bot 轉案，我們可以先安裝 yeoman 以及 generator-botbuilder，

```sh
npm install -g yo
npm install -g generator-botbuilder
```

接著我們就可以使用 `yo botbuilder` 指令來建立專案。

```sh
yo botbuilder
```

過程中會詢問我們要建立的 bot 類型，這邊我們先選擇 `Echo bot` 可以方便我們看到簡單的範例，當熟悉後，也可以選擇 `Core bot` 來建立包含許多範例，更完整的 bot。當然，也可以選擇 `Empty bot` 來建立一個空的專案；另外程式語言我選擇 TypeScript，方便用強型別的方式開發應用程式。

{% asset_img 01.webp %}

之後進入 `my-chat-bot` (專案名稱) 資料夾，使用 `npm i` 安裝相關套件，基本的專案架構就算完成啦！

### 專案說明

接著我們來看一下這個專案的重點檔案

#### package.json

這個檔案不用多說，就是指定安裝的套件，以及一些相關的指令，預設套件包含

```json
{
  ...,
  "dependencies": {
    "botbuilder": "~4.15.0",
    "dotenv": "~8.2.0",
    "replace": "~1.2.0",
    "restify": "~8.5.1"
  },
  "devDependencies": {
    "@types/restify": "8.4.2",
    "nodemon": "^2.0.4",
    "tslint": "^6.1.2",
    "typescript": "^4.0.7"
  }
}
```

以及 `scripts: {}` 內包含的常用的指令

```json
{
  ...,
  "scripts": {
    "build": "tsc --build",
    "lint": "tslint -c tslint.json 'src/**/*.ts'",
    "postinstall": "npm run build && node ./deploymentScripts/webConfigPrep.js",
    "start": "tsc --build && node ./lib/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "nodemon --watch ./src -e ts --exec \"npm run start\""
  }
}
```

可以看到，我們可以使用 `npm start`，來編譯程式，並執行 `./lib/index.js` 這隻編譯後的 JavaScript 程式。

開發過程中也可以用 `npm run watch`，來監聽程式碼的變動，並自動編譯執行。

#### src/index.ts

`src/index.ts` 內有不少程式，主要重點包含：

使用 `restify` 套件，建立一個 restify 伺服器，並使用 `bodyParser` 中介軟體來解析請求的 body。

```typescript
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
```

建立一個 `CloudAdapter`，這是並使用 Bot Framework 提供的相關程式，裡面的內容主要是一些未來上雲端服務使用的設定，在本地環境開發時可以先忽略不管。

這個建立好的 adapter 之後就可以用來幫我們處理對話機器人的請求。

```typescript
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new CloudAdapter(botFrameworkAuthentication);
```

建立一個 `EchoBot`，這個類別在 `src/bot.ts` 稍後會介紹到，另外處理伺服器的 `POST /api/messages` 請求，並將請求傳給 adapter 來處理。

而 adapter 會將請求轉換成一個 `TurnContext` 這個 `TurnContext` 就是對話的相關紀錄，之後則是傳給 `EchoBot` 的 `run` 方法來處理。

```typescript
// Create the main dialog.
const myBot = new EchoBot();

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res, (context) => myBot.run(context));
});
```

#### src/bot.ts

接著來看 `src/bot.ts` 在這個檔案中建立了 `EchoBot` 類別，該類別繼承自 `ActivityHandler`，代表用來處理所有機器人的行為。

在建構式中，有一段程式，主要用來接收來源的訊息，並且回傳一段文字訊息給使用者。

```typescript
this.onMessage(async (context, next) => {
    const replyText = `Echo: ${ context.activity.text }`;
    await context.sendActivity(MessageFactory.text(replyText, replyText));
    // By calling next() you ensure that the next BotHandler is run.
    await next();
});
```

未來對話機器人的開發，會有很多邏輯都會在這個 `onMessage` 處理，並且使用 `context.sendActivity` 來回傳訊息給使用者。

### 測試機器人

對程式碼有基本理解之後，我們可以在本機進行測試，測試完成在發布到 Azure 上。

要在本機測試，可以先安裝 [Bot Framework Emulator](https://github.com/microsoft/BotFramework-Emulator)。

接著我們可以執行 `npm start` 或 `npm run watch` 開啟伺服器，預設會開啟本地的 3978 port。

之後打開 Bot Framework Emulator，按下首頁的 "Open Bot" 輸入伺服器資訊

{% asset_img 02.webp %}

之後按下 "Connect"，就可以開始跟機器人對話啦！

{% asset_img 03.webp %}

## 本日小節

今天我們介紹了如何使用 Bot Framework SDK 來建立一個對話機器人，並且在本地端進行測試。透過今天的練習我們可以看到，所謂的聊天機器人實際上就是一個 API，可以處理我們傳遞的訊息，同時具有回應的能力，而這些複雜的過程都透過 Bot Framework SDK 包裝起來了，我們只要專注在如何處理訊息就好啦！

今天的練習都是在本地測試，下一篇文章我們再來看看如何將使用 Azure Bot Service，以便整合到各種其他平台上。

## 相關資源

- [What is the Bot Framework SDK?](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-overview?view=azure-bot-service-4.0&WT.mc_id=DOP-MVP-5003734)
- [Create a bot with the Bot Framework SDK](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-create-bot?view=azure-bot-service-4.0&WT.mc_id=DOP-MVP-5003734&tabs=javascript%2Cvs)
- [Test and debug with the Emulator](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-debug-emulator?view=azure-bot-service-4.0&WT.mc_id=DOP-MVP-5003734&tabs=csharp)
