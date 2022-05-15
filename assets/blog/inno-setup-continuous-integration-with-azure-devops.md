---
title: "[Inno Setup] CI 時自動產生安裝檔（以 Azure DevOps 為例）"
date: 2022-02-06 18:06:42
category: "Inno Setup"
tags:
  - "Inno Setup"
  - "Azure DevOps"
---

透過 Inno Setup 打包安裝檔非常方便，由於都是腳本指令，加上 Inno Setup 本身也支援以 CLI 的方式執行，因此要搭配 CI/CD 是完全可行的，本篇就以 [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/?WT.mc_id=DOP-MVP-500373) 為例，說明一下使用 Inno Setup 打包安裝檔需要注意的一些事項。

以下為使用 Pipeline as code 的方式說明，因此都是 yaml 設定檔，當然如果使用 Classic editor 的話，也都可以找到對應的 task

<!-- more -->

# 前置準備

由於不再是從本機上打包，因此許多路徑設定等等都需要做出對應的調整，以下說明幾個比較重要的部分：

## 語言檔要一起進入版控

尤其在沒有使用內建的語言檔，或是語言檔有客製化的時候，在 CI 的機器上當然不會有這些客製化的內容，因此必須將這些檔案都加入版控。

之後在 `*.iss` 檔中記得調整語言檔的位置，可以直接將 `MessagFile` 換成版控對應的路徑

```ini
[Languages]
Name: "english"; MessagesFile: "Langs\Default.isl"
Name: "chinesetraditional"; MessagesFile: "Langs\ChineseTraditional.isl"
```

## 檔案打包的路徑

原來都是指向本機的某個絕對路徑，但在 CI 中就要看編譯程式時指定的輸出目錄，以 .Net Core 的程式來說，可能會直接加上 `-o` 指定路徑：

```powershell
dotnet publish -o dist
```

那麼在 `*.iss` 檔中也記得要指定路徑：

```ini
[Files]
Source: "dist\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
```

## 安裝檔輸出路徑

預設安裝檔產生的路徑為 `Output`（或自行設定 `OutputDir`），之後要記得複製到 `$(build.artifactstagingdirectory)`中，這是 Azure DevOps 內建的一個目錄路徑變數，通常打包出來的內容都會放在這裡，然後透過 Publish Artifact 這個 task 上傳，以供之後 Release Pipeline 使用。

# Azure Pipeline 設定

接著來看看 Azure Pipeline 這邊的設定，當然，事前的程式碼編譯等動作就不贅述了。

## 安裝 Inno Setup

在 Windows 上要快速安裝一個程式，最方便的莫過於使用 Chocolatey 了，而 Azure DevOps 也有 [Chocolatey task](https://marketplace.visualstudio.com/items?itemName=gep13.chocolatey-azuredevops)，可以直接拿來使用：

```yaml
- task: gep13.chocolatey-azuredevops.chocolatey-azuredevops.ChocolateyCommand@0
  displayName: '安裝 Inno Setup'
  inputs:
    command: install
    installPackageId: innosetup
```

## 建立安裝檔

安裝好 Inno Setup 後，可以直接執行 `iscc.exe [腳本].iss`，就可以直接根據 `*.iss` 檔裡的腳本建立安裝檔了，因此直接使用 PowerShell 執行程式就好。

```yaml
- powershell: 'iscc.exe installation.iss'
  displayName: '打包安裝檔'
```

## 將安裝檔輸出給 Release Pipeline 使用

將打包好的安裝檔複製到 `$(build.artifactstagingdirectory)`。

```yaml
- powershell: 'copy Output/Setup.exe $(build.artifactstagingdirectory)'
  displayName: '複製安裝檔'
```

{% note info %}

CI 過程中如果還有其他需要發佈的內容，都可以丟到這個目錄來。

{% endnote %}

以及使用 [Publish build artifacts](https://docs.microsoft.com/zh-tw/azure/devops/pipelines/artifacts/pipeline-artifacts?view=azure-devops&WT.mc_id=DOP-MVP-500373&tabs=yaml) 這個 Task 來發佈安裝檔。

```yaml
- task: PublishBuildArtifacts@1
  displayName: 'Publish Artifact: drop'
  inputs:
    PathtoPublish: '$(build.artifactstagingdirectory)'
  condition: succeededOrFailed()
```

之後就看 Release Pipeline 要怎麼將這些內容發佈到指定的地方囉！
