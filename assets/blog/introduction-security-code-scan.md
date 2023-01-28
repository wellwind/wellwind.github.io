---
title: "使用 Security Code Scan 為 .NET 應用程式進行程式碼安全性掃描"
date: 2022-12-24 13:34:32
category:
tags:
  - "Security Code Scan"
  - "OWASP"
  - "SARIF"
  - "sarif-tools"
ogImage: 00.png
---

[Security Code Scan](https://security-code-scan.github.io/) 是一套針對 .NET 的程式碼靜態分析工具，他可以針對程式碼中的安全性問題進行掃描，並且提供了一些程式碼修正的建議。今天這篇文章就來介紹一下如何使用 Security Code Scan 來進行程式碼安全性掃描。

<!-- more -->

## 安裝 Security Code Scan

Security Code Scan 有很多安裝方式，包括：

- [Visual Studio Extension](https://marketplace.visualstudio.com/items?itemName=JaroslavLobacevski.SecurityCodeScanVS2019)：如果主力使用 Visual Studio 的話，可以透過此套件在開發掛程中即時得知程式碼中的安全性問題。
- [NuGet package](https://www.nuget.org/packages/SecurityCodeScan.VS2019/)：以 NuGet package 安裝的話，可以再建置階段即時得知程式碼中的安全性問題。
- [Stand-alone runner](https://www.nuget.org/packages/security-scan/)：以 CLI 的方式進行掃描，不用跟著專案跑，只要電腦有裝這個工具，就可以掃描任何的 .NET 應用程式。

### 安裝 Stand-alone runner

Stand-alone runner 算是比較簡單的，而且也較容易整合在 CI 上，同時在專案多的情況下也不用針對每個專案安裝套件，只要在安裝一次就可以了。安裝方式也很簡單，一行指令搞定

```bash
dotnet tool install --global security-scan
```

安裝完後執行 `security-scan` 指令，看到以下畫面就代表安裝完成啦！

{% asset_img 00.png %}

## 使用 Security Code Scan

接著我們可以看看掃描結果，我們可以使用 `seucirty-scan` 並指定專案/方案路徑

```bash
security-scan path/to/sln
```

### 忽略編譯錯誤

Security Code Scan 是「靜態」程式碼分析工具，但還是會先嘗試去 build 整個專案，如果 build 不過就不會進行掃描，雖然程式碼可以 build 過是基本，但有時候遇到各種套件相依問題，我們不一定可以隨意抓個專案下來就能 build 過關，我們可以加上 `--ignore-msbuild-erorrs`，那麼就算編譯錯誤，還是會繼續進行靜態掃描。

```bash
security-scan --ignore-msbuild-erorrs path/to/sln
```

### 掃出弱點直報錯

預設掃出的弱點會以 warning 提示，如果希望掃出弱點時以 error 報錯，可以加上 `--fail-any-warn` 參數

```bash
security-scan --fail-any-warn path/to/sln
```

### 輸出報告

預設掃描完會輸出到 console 上，如果希望輸出成檔案，可以加上 `-x` 參數，報告會以 SARIF 格式輸出

```bash
security-scan --fail-any-warn -x report.sarif path/to/sln
```

{% note info %}

[SARIF](https://sarifweb.azurewebsites.net/) 全名為 (Static Analysis Results Interchange Format)，是一種專門用來描述程式碼靜態掃描結果的格式，實際上就是一種 JSON 格式，因為格式單純，因此可以輕易的整合更ˋ多的工具來讀取這些結果，進而做更多的處理。

{% endnote %}

### 閱讀報告

SARIF 雖然是很好理解的 JSON 檔，但有工具能輔助閱讀更好，以下提供幾種方式協助我們閱讀 SARIF 檔

### 使用官方 Viewer

微軟有提供 [Visual Studio](https://marketplace.visualstudio.com/items?itemName=WDGIS.MicrosoftSarifViewer) 和 [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer) 的套件，可以直接在編輯器中閱讀 SARIF 檔。

### 轉換成 word 或 html

微軟也有提供一個工具叫做 [sarif-tools](https://github.com/microsoft/sarif-tools)，可以將 SARIF 檔轉換成 word 或 html，不過功能還是蠻陽春的，目前只能用 `pip` 安裝，因此電腦還需要額外安裝 Python，官方建議安裝 Python 3.8 以上的版本。

```bash
pip install sarif-tools
```

之後要轉換只要指定格式和 sarif 檔即可，例如以下指令可以將 `report.sarif` 轉成 word 檔：

```bash
sarif word ./output.sarif
```

## 本日小結

Security Code Scan 是一套蠻經量的 .NET 掃描工具，它不用像 SonarQube 一定要台伺服器才能運作，只要安裝好工具就可以直接掃描，而且掃描速度也蠻快的，不過還是有些限制，例如只能掃描 .NET 的專案，且掃描結果只能輸出成 SARIF 格式，但對於想要快速瞭解 .NET 應用程式是否有安全性議題，可以說是蠻方便的工具。
