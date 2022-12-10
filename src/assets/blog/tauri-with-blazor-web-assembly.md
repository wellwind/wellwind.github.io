---
title: "將 Blazor WebAssembly 整合進 Tauri 應用程式"
date: 2022-12-10 09:10:11
category:
  - "Tauri"
tags:
  - "Tauri"
  - "Blazor"
  - "Blazor WebAssembly"
---

Tauri 內建了很多前端的專案範本，但可惜的是沒有 Blazor WebAssembly 的範本，但 Tauri 架構本身已經考量得很完善了，只要最終產出是純前端的網站，任何應用程式都可以包裝到 Tauri 內，今天這篇文章就來說明一下如何將 Blazor WebAssembly 加到 Tauri 應用程式內。

<!-- more -->

# 基本原理說明

Tauri 本身就是一個桌面應用程式包裝一個網站在裡面的架構而已，至於要包裝什麼網站？如何包裝？其實 Tauri 的設定都已經很明確了！

當我們用 Tauri 建立一個新的應用程式時，會看到 Tauri 會建立一個 `src-tauri` 的資料夾，裡面會有一個 `tauri.conf.json` 的設定檔，這個設定檔就是告訴 Tauri 要包裝哪個網站，以及要如何包裝，內容範例如下。

```json
{
  "build": {
    "beforeDevCommand": "npm run serve",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:8080",
    "distDir": "../dist"
  }
}
```

從設定可以很明顯看到，在開始開發前，會執行 `beforeDevCommand` 指定的指令；開發時期，會使用 `devPath` 的位址塞到瀏覽器內。

因此在開發階段，只要確定 `beforeDevCommand` 指定的指令可以正常執行，並且可以在 `devPath` 的位址看到網站，就可以開始開發了。

開發完後，要打包成桌面應用程式時，則是在打包前會執行 `beforeBuildCommand` 指定的指令，並且將 `distDir` 的資料夾內容打包成桌面應用程式。

只要能掌握這個規則，就可以將任何網站整合進 Tauri 應用程式內。

有了這樣的概念後，我們就可以開始將 Blazor WebAssembly 加入 Tauri 了。

# 將 Blazor WebAssembly 加入 Tauri

## 建立 Blazor WebAssembly 專案

首先，我們建立 Tauri 專案時，可以選擇 `vanilla` 的範本，這是最基本的範本，不會套用任何的前端框架，就是單純的 HTML/JavaScript/CSS，也因此幾乎不會產生出什麼額外的前端相關檔案，所有前端程式碼都會在 `src` 裡面，當然這裡面的內容不是我們要的，只要把它移除就好。

之後我們再重新將 Blazor WebAssembly 專案建立在 `src` 目錄內，可以執行以下指令

```bash
dotnet new blazorwasm --name TauriWebDemo --output src
```

這樣就會在 `src` 目錄內建立一個 Blazor WebAssembly 專案了。

## 修改 Tauri 設定檔

接著我們要修改 `tauri.conf.json` 設定檔，讓 Tauri 可以正確的執行 Blazor WebAssembly 專案。

### beforeDevCommand

首先是 `beforeDevCommand`，這裡可以直接換成以下指令

```bash
dotnet watch run --project src/TauriWebDemo.csproj --non-interactive
```

使用 `dotnet watch run`，可以做到變更程式時即時重新編譯，節省手動的時間，而 `--non-interactive` 是 .NET 7 的新參數，在 hot reload 需要重新 build 時就不需要手動回覆了，會直接重新 build。

### devPath

`devPath` 是開發階段時要包裝到 Tauri 提供的是桌面應用程式的網站網址，因此我們要將 Blazor WebAssembly 的網站網址填入這裡。

在 `dotnet new` 時會自動建立一個 `launchSettings.json` 檔案，裡面會有 Blazor WebAssembly 的網站啟動時的位置，直接將裡面的內容填到 `devPath` 設定即可。

{% note info %}

也可以依照團隊習慣，修改 `launchSettings.json`，只要能確定最終位置都是一致的就好！

{% endnote %}

這兩個步驟完成後，只要執行 `npm run tauri dev` 指令，就會自動啟動 Blazor WebAssembly 的網站，並可以在 Tauri 應用程式看到結果了。

### beforeBuildCommand

接著是最終建置成桌面應用程式的設定，在 `beforeBuildCommand` 這裡，我們可以設定如何將 Blazor WebAssembly 專案輸出成一個純前端的應用程式，例如：

```bash
dotnet publish src/TauriWebDemo.csproj -c release -o dist
```

這樣就會將 Blazor WebAssembly 專案輸出到 `dist` 目錄，裡面就是純前端的應用程式了。

### distDir

最後就是 `distDir` 設定了，在 Tauri 最終要建立成桌面應用程式時，會將 `distDir` 設定的目錄內容複製到 Tauri 應用程式內。

在 Blazor WebAssembly 專案中使用 dotnet publish 後，完整的純前端應用程式會再指定目錄的 `wwwroot` 目錄下，例如發佈到 `dist` 目錄，則實際上的網站內容會在 `dist/wwwroot` 目錄下，因此我們要將 `distDir` 設定為 `dist/wwwroot`。

最後我們就可以執行 `npm run tauri build` 指令，將整個 Blazor WebAssembly 應用程式與 Tauri 整合在一起啦！！

完整的設定物件看起來如下：

```json
{
  "build": {
    "beforeDevCommand": "dotnet watch run --project src/TauriWebDemo.csproj --non-interactive",
    "beforeBuildCommand": "dotnet publish src/TauriWebDemo.csproj -c release -o dist",
    "devPath": "https://localhost:5001",
    "distDir": "../dist/wwwroot",
  }
}
```

# Invoke 及 JavaScript/TypeScript API

最後一個議題，是在 Blazor WebAssembly 嵌入 Tauri 應用程式後，如何使用 Tauri 提供的 Invoke 及其他 JavaScript/TypeScript API。

在 `tauri.conf.json` 中，我們可以設定 `build.withGlobalTauri` 為 `true`，這樣就可以單純的在 JavaScript 中使用 `window.__TAURI__` 來呼叫 Tauri 提供的相關 API。

```json
{
  "build": {
    "withGlobalTauri": true
  }
}
```

而在 Blazor WebAssembly 中，我們直接使用注入 IJSRuntime 的方式處理，例如：

```csharp
@inject IJSRuntime JSRuntime

<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
    async Task IncrementCount()
    {
        var message = await JSRuntime.InvokeAsync<string>(
            "window.__TAURI__.tauri.invoke", 
            "greet",
            new { name = "Mike" });
        Console.WriteLine(message);
    }
}
```

如果要呼叫作業系統相關的 API，一樣可以使用 Tauri 提供的 JavaScript/TypeScript API，例如：

```csharp
// 用 eval 取得 Tauri JavaScript API 內建的常數
var desktopBasePath = await JSRuntime.InvokeAsync<int>(
    "eval",
    "window.__TAURI__.fs.BaseDirectory.Desktop");

// 呼叫 Tauri 的 JavaScript API
await JSRuntime.InvokeVoidAsync(
    "window.__TAURI__.fs.writeTextFile", 
    "tauri-greet.txt", 
    "Hello World"", 
    new { dir = desktopBasePath });
```

在這邊比較特別的是，我們需要使用 `eval` 來取得 Tauri JavaScript API 內建的常數，例如 `window.__TAURI__.fs.BaseDirectory.Desktop`，因為這個常數是在 Tauri 應用程式內建的，也不是個可以被呼叫的方法，因此這裡改成呼叫 `eval` 來取得指定的常數。

比較理想的作法還是些一個 JavaScript 的 function 來取得這個常數，然後再從 JSRuntime 呼叫這個 function 來取得資料，會比較好一點，不過這邊就偷懶一下，直接用 `eval` 來取得。

{% note info %}

更理想一點，是將這些呼叫通通都包裝成 C# 的 API，把這些醜醜的字串都隱藏起來，不過要花費的時間就比較多了，如果你有實作出來，或看到其他人的實作，歡迎分享給我。

{% endnote %}

之後的 `window.__TAURI__.fs.writeTextFile` 則是呼叫 Tauri 提供的 JavaScript API，跟前面都差不多，這邊就不多做介紹了。

# 結論

今天的文章我們介紹了如何使用 Tauri 將 Blazor WebAssembly 應用程式打包成桌面應用程式，雖然 `create-tauri-app` 沒有內建 Blazor WebAssembly 的範本，不過 Tauri 的架構非常好理解，因此我們可以很容易的將 Blazor WebAssembly 應用程式整合進 Tauri 中。並且理論上任何純前端的架構都能依照這個方法進行整合！

而透過 Blazor WebAssembly 的 IJSRuntime，我們也能輕易的呼叫 Tauri 提供的 JavaScript/TypeScript API，在評估一個非 JavaScript 的純前端框架時，也記得要把這個框架是否能呼叫 JavaScript 當做一個重要的衡量依據喔！
