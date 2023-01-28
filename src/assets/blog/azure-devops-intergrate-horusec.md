---
title: "[Azure DevOps] 整合 Horusec 掃描結果"
date: 2023-01-08 10:40:05
category:
  - "Azure DevOps"
tags:
  - "Azure DevOps"
  - "Horusec"
  - "SARIF"
ogImage: 00.png
---

之前在文章中介紹了「[Horusec](https://fullstackladder.dev/blog/2023/01/07/introduction-horusec/)」這個強大的程式碼安全掃描工具，今天也來介紹一下如何整合到 Azure DevOps 的 CI pipeline 中。

<!-- more -->

## 官方提供的設定

在 [Horusec 文件](https://docs.horusec.io/docs/cli/installation/#azure-devops-pipeline)中已經將常見的 CI 工具都提供了範例，其中 Azure DevOps 的範例如下：

```yaml
pool:
  vmImage: 'ubuntu-18.04'

steps:
- script: |
    curl -fsSL https://raw.githubusercontent.com/ZupIT/horusec/main/deployments/scripts/install.sh | bash -s latest
    horusec start -p ./    
```

基本上也很簡單，就是透過 curl 下載並執行安裝腳本，接著執行 `horusec start` 來開始掃描。

## 輸出報告

如果想要輸出成 SARIF 報告，除了指定 `-o` 和 `-O` 之外，也需要再加上 PublishBuildArtifacts task。

```yaml
pool:
  vmImage: 'ubuntu-18.04'

steps:
- script: |
    curl -fsSL https://raw.githubusercontent.com/ZupIT/horusec/main/deployments/scripts/install.sh | bash -s latest
    horusec start -p ./ -o sarif -O $(build.artifactstagingdirectory)/scan-report.sarif

- task: PublishBuildArtifacts@1
  displayName: 'Publish Artifact: CodeAnalysisLogs'
  inputs:
    PathtoPublish: '$(build.artifactstagingdirectory)/scan-report.sarif'
    ArtifactName: 'CodeAnalysisLogs'
    publishLocation: 'Container'
```

記得安裝 [SARIF SAST Scans Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.scans&targetId=a3049b43-59dc-4090-9872-b69f38c1f4af) Azure Pipelines Extension，讓我們可以即時在 build 結果看到掃描報告！

另外報告的路徑如果想要整合到 Azure Repos，可以另外寫段程式來處理，如：

```powershell
# 把 https://xxx@dev.azure.com.... 的 xxx@ 部分拿掉
$chunks = "$(Build.Repository.Uri)".Replace("https://", "").Split("@")
$baseUri = $chunks[0]
if($chunks.Length -gt 1)
{
  $baseUri = $chunks[1];
}

# 讀取 SARIF 檔案，並轉成 JSON 物件
$content = Get-Content -Path '$(Build.SourcesDirectory)\scan-report.sarif' -Raw
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
$newContent | Set-Content -Path '$(Build.ArtifactStagingDirectory)\scan-report.sarif'
```

## 使用 Horusec Scan Task

最後也推銷一下自己寫的 Azure Pipelines Extension - [Horusec Scan Task](https://marketplace.visualstudio.com/items?itemName=MikeHuang.horusec-scan-task)，可以讓我們在 Azure Pipelines 中直接使用 Horusec 來掃描程式碼，並且可以輸出成 SARIF 報告。

{% asset_img 01.png %}

我把常用的參數都拉出來可以直接設定了，也可以在 `Other options of Horusec CLI command` 中指定其他的參數。

如果喜歡這個 Extension，還請記得幫我留個五興好評！使用上遇到任何問題也歡迎提出來囉。

## 相關資源

- [Horusec Scan Task](https://marketplace.visualstudio.com/items?itemName=MikeHuang.horusec-scan-task)
