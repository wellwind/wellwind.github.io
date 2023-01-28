---
title: "使用 Horusec 對程式碼安全性進行掃描"
date: 2023-01-07 15:00:47
category:
tags:
  - "Horusec"
  - "OWASP"
---

[Horusec](https://github.com/ZupIT/horusec) 是一套開源的程式碼靜態分析工具，他可以幫助我們對程式碼進行安全性掃描，並且支援許多常見的語言，功能非常強大。

<!-- more -->

## 安裝 Horusec

Horusec 支援各個平台，也很容易安裝，可以直接參考[文件](https://github.com/ZupIT/horusec#installing-horusec)說明。

Horusec 有內建的源碼掃描工具，同時也整合了許多其他家的開源掃描工具，給我們更全面的掃描結果，而這些掃描工具都通通整合到獨立的 Docker images 了，因此建議無論如何在掃描的機器上都把 Docker 安裝起來，以取得最完整掃描結果。

## 開始使用 Horusec 進行掃描

透過 CLI 指令，可以輕鬆的對某個目錄價所有支援的程式碼進行掃描

```bash
horusec start -p .
```

如果是直接使用 docker image 掃描的話，除了 volume mapping 要對應好外，由於 horusec 還會另外拉很多 image 下來掃描，所也需要加上 `docker.sock` 對應，另外加上 `-P` 參數，代表要掃的專案不是在 container 內：

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/src horuszup/horusec-cli:latest horusec start -p /src -P $(pwd)
```

### 輸出掃描結果

Horusec 預設為將所有掃描結果都輸出到 console 上，我們可以使用 -O 指定輸出目錄，也可以使用 -o 指定輸出格式，目前支援的格式有 `"text"|"json"|"sarif"|"sonarqube"`

```bash
horusec start -p . -O report.sarif -o sarif
```

### 排除掃描目錄

由於 Horusec 是指定一個目錄後，會自動找出目錄下所有支援的檔案進行掃描，因此許多放在目錄內的第三方套件等檔案也會被掃描到像是前端的 `node_modules` 或是 .NET 的 `Bin`、`Obj` 目錄等，這些在靜態分析時是不會希望被掃描的（否則你會發現掃出的弱點比你寫的程式碼都還要多，也會浪費許多掃描時間），這時候我們可以使用 `-i` 指定要排除的目錄，支援 glob pattern，並且可以使用 `,` 隔開多個路徑，例如：

```bash
horusec start -p . -i "**/node_modules/**, **/bin/**, **/obj/**"
```

### 不使用 Docker

Horusec 預設會針對支援的檔案內容拉一些其他工具下來掃描，這些工具都是以 Docker image 的方式提供，因此如果你不想使用 Docker，可以使用 `-D` 參數，這樣就不會去拉 Docker image 了：

```bash
horusec start -p . -D true
```

### 掃出弱點時報錯

如果希望在掃出弱點時，直接報錯，可以使用 `-e` 參數，在 CI 時，就可以將有弱點視為 CI 不通過。

```bash
horusec start -p . -e
```

### 設定 timeout 時間

預設的 timeout 時間為 600 秒（10 分鐘），如果你的專案掃描時間會，可以使用 `-t` 參數來設定：

```bash
horusec start -p . -t 1200
```

## VSCode 套件

Horusec 提供了一個 [Visual Studio Code 的套件](https://marketplace.visualstudio.com/items?itemName=ZupInnovation.horusec)，讓我們可以直接在 Visual Studio Code 進行掃描，省去記憶指令的麻煩。

我們還可以透過套件來根據問題選擇修復或是排除，我們可以在掃描出來的弱點上點擊右鍵，選擇「False Positive」，代表這個弱點視誤判；也可以選擇「Risk Accept」，代表我接受了這個弱點的風險，不進行修復。

{% asset_img 01.png %}

選擇完後，會將相關設定存在 `horusec-config.json` 中，之後再掃描時，可以加上 `--config-file-path=path/to/horusec-config.json`，就可以自動忽略掉我們選擇的弱點。

## 本日小結

Horusec 功能真的非常強大，支援的語言也多，就是掃描速度長久了一點，~~和容易掃描出一堆弱點，改都改不完~~，有興趣的朋友可以拿自己的專案出來掃看看，邊掃邊學習，讓自己未來的程式更加安全 💪。

## 相關資源

- [Horusec](https://horusec.io/)
- [Horusec 文件](https://docs.horusec.io/docs/overview/)
