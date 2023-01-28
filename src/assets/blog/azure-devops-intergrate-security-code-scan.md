---
title: "[Azure DevOps] 整合 Security Code Scan 掃描結果"
date: 2022-12-31 13:10:08
category:
  - "Azure DevOps"
tags:
  - "Azure DevOps"
  - "Security Code Scan"
  - "SARIF"
ogImage: 00.png
---

之前文章介紹過「[使用 Security Code Scan 為 .NET 應用程式進行程式碼安全性掃描](https://fullstackladder.dev/blog/2022/12/24/introduction-security-code-scan/)」，這篇文章接著來介紹一下如何在 Azure DevOps 的 CI pipeline 中整合 Security Code Scan 掃描結果。

<!-- more -->

## 在 Agent 中安裝掃描工具

Security Code Scan 提供了 stand-alone runner，意味著我們可以直接安裝這個工具來進行掃描，因此在 CI 中就變得很簡單，大概是以下幾個步驟

1. 安裝 Security Code Scan 的 stand-alone runner
2. 對專案進行掃描，並輸出報告
3. 發佈報到告 CI 結果

接著就讓我們一步一步來處理

### 安裝 Security Code Scan 的 stand-alone runner

透過 Powershell + dotnet tool，我們可以很輕易的在 Agent 中安裝 Security Code Scan 的 stand-alone runner，只要加入一個 [Powershell 的 task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/powershell-v2?view=azure-pipelines&WT.mc_id=DOP-MVP-5003734)，並在裡面執行以下指令即可

```powershell
dotnet tool install --global security-scan
```

### 對專案進行掃描，並輸出報告

接著要掃描就簡單多了，只皆使用 `security-scan` 指令即可

```powershell
security-scan -x $(Build.ArtifactStagingDirectory)/output.sarif path/to/sln
```

在這邊我們先將結果輸出到 `$(Build.ArtifactStagingDirectory)/output.sarif`，接下來就要將這個結果發佈到 CI 回報的結果中。

### 發佈報到告 CI 結果

微軟提供了一個 Azure Pipeline 的 Extension，叫做 [SARIF SAST Scans Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.scans&targetId=a3049b43-59dc-4090-9872-b69f38c1f4af)，安裝這個 Extension 後，我們只要將 SARIF 檔以名稱為 `CodeAnalysisLogs` 當做 artifacts 發佈，之後就可以在 build 報告中檢視掃描結果。

我們可以使用 [Publish build artifacts](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/publish-build-artifacts-v1?view=azure-pipelines&viewFallbackFrom=azure-devops&WT.mc_id=DOP-MVP-5003734) 這個 Task 來發佈報告：

{% asset_img 01.png %}

之後就可以在 Pipeline 結果看到 `Scans` 頁籤，裡面就會包含掃描報告啦！

### 修正路徑

由於 SARIF 報告呈現的是在 Agent 上的掃描結果，因此路徑會沒辦法正確對應到 Azure DevOps 中的 repo 路徑，因此要自己針對報告中的內容在去找實際上程式碼的路徑，以下提供一個簡單 Powershell 範例，讓我們可以將報告路徑轉換成 Azure DevOps repos 中的路徑：

```powershell
# 把 https://xxx@dev.azure.com.... 的 xxx@ 部分拿掉
$chunks = "$(Build.Repository.Uri)".Replace("https://", "").Split("@")
$baseUri = $chunks[0]
if($chunks.Length -gt 1)
{
  $baseUri = $chunks[1];
}

# 讀取 SARIF 檔案，並轉成 JSON 物件
$content = Get-Content -Path '$(Build.SourcesDirectory)\output.sarif' -Raw
$obj = ConvertFrom-Json -InputObject $content
foreach ($run in $obj.runs) {
  foreach ($result in $run.results) {
    foreach($location in $result.locations) {
      $toReplace = "$(Build.SourcesDirectory)".Replace("\", "/");
      # 取得檔案路徑
      $path = $location.physicalLocation.artifactLocation.uri.Replace("file:///$toReplace", "")
      # 組合成原始檔在 Azure DevOps 上的位置
      $location.physicalLocation.artifactLocation.uri = "https://$($baseUri)?path=$path&version=GC$(Build.SourceVersion)&line=$($location.physicalLocation.region.startLine)&lineEnd=$($location.physicalLocation.region.endLine)&lineStartColumn=$($location.physicalLocation.region.startColumn)&lineEndColumn=$($location.physicalLocation.region.endColumn)"
    }
    foreach($location in $result.relatedLocations) {
      $toReplace = "$(Build.SourcesDirectory)".Replace("\", "/");
      # 取得檔案路徑
      $path = $location.physicalLocation.artifactLocation.uri.Replace("file:///$toReplace", "")
      # 組合成原始檔在 Azure DevOps 上的位置
      $location.physicalLocation.artifactLocation.uri = "https://$($baseUri)?path=$path&version=GC$(Build.SourceVersion)&line=$($location.physicalLocation.region.startLine)&lineEnd=$($location.physicalLocation.region.endLine)&lineStartColumn=$($location.physicalLocation.region.startColumn)&lineEndColumn=$($location.physicalLocation.region.endColumn)"
    }
  }
}
$newContent = ConvertTo-Json -InputObject $obj -Depth 10
$newContent | Set-Content -Path '$(Build.ArtifactStagingDirectory)\output.sarif'
```

路徑可以針對自己實際的使用進行調整。

## 使用 Security Code Scan Task Extension

上述步驟雖然不太困難，但每次要一直複製貼上也是很麻煩，所以我寫了一個 Azure Pipelines Extension，叫做 [Security Code Scan Task](https://marketplace.visualstudio.com/items?itemName=MikeHuang.scs-scan-task)，安裝這個 Extension 後，就可以在 Pipeline 中直接使用 `Security Code Scan` 這個 Task 來執行掃描了。

這個 Extension 執行過程基本上跟前面步驟一樣，同時也提供選項對掃描結果路徑進行轉換，只要勾選「Convert path related to repo」即可。

{% asset_img 02.png %}

## 本日小結

程式碼弱點掃描整合到 CI 是一件非常重要的工作，如此我們才能即時的知道程式碼是否有安全性漏洞，今天介紹了如何將 Security Code Scan 的掃描結果整合到 Azure Pipeline 中，以及如何在 build 完成後即時看到報告，最後的 Security Code Scan Task 則是大幅簡化了設定的麻煩，如果喜歡這個 Extension 的話別忘了留個五興好評！在掃描遇到什麼問題，也歡迎隨時提出來。

## 相關資源

* [Security Code Scan](https://security-code-scan.github.io/)
* [Security Code Scan Task](https://marketplace.visualstudio.com/items?itemName=MikeHuang.scs-scan-task)
* [SARIF SAST Scans Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.scans&targetId=a3049b43-59dc-4090-9872-b69f38c1f4af)
