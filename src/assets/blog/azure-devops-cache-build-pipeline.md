---
title: "[Azure DevOps] 透過 cache 加快 CI pipeline 速度"
date: 2023-12-17 12:04:50
category:
  - "Azure DevOps"
tags:
  - "Azure DevOps"
  - "Pipeline caching"
---

在 CI 階段時，我們經常會需要針對專案內容安裝各種套件，不過其實套件內容也很少更動，但每次安裝都會花上不少時間，雖然都放著讓 CI 跑就好了，但還是免不了要等一段時間，好在 Azure DevOps 提供了 [Pipeline caching](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching?view=azure-devops&WT.mc_id=DOP-MVP-5003734) 功能，讓我們可以將套件內容先暫存起來，下次就不用再安裝了，加快 CI pipline 的速度，這篇文章就來介紹一下 Pipeline caching 的工能。

<!-- more -->

## 沒有 Pipeline caching 的情況

先來看看一個簡單的專案，我建立了一個 Angular 專案，並安裝了 cypress 套件，由於 cypress 套件每次安裝時也會安裝一套 Chromium 瀏覽器，所以安裝時間會比較久，我們先來看看沒有使用 Pipeline caching 的情況。

{% asset_img 01.png %}

跑了三次，大概會花 5 分鐘左右，再仔細進去看，會發現在安裝套件時就佔 4 分多鐘，也就是大約 8 成的時間都在安裝套件，如果這段時間可以省下來，那麼整體的等待時間就可以大幅縮短！

{% asset_img 02.png %}

## 加上 Pipeline caching 的情況

接著我們來替 CI 加上 cache 功能，為了方便解釋，使用 classic editor，透過介面來看看每個重要的參數。

### 加入 cache task

收首先我們要先加入 cache 這個 task

{% asset_img 03.png %}

### 設定 Key

接著設定 key 欄位，這個 key 代表了用來判斷式否要重新 cache 的內容，我們可以在這裡設定「當哪些檔案變動時，我們就不使用原來 cache 住的內容」，這邊我們設定當 `package-lock.json` 變動時，就要重新 cache，這樣就可以確保我們的套件都是最新的。另外一個小技巧，由於 npm 套件有可能會因為作業系統不同而有所差異（尤其是會安裝一些額外的執行檔時），所以額外把作業系統當做 key，在 Azure DevOps 的 CI Pipeline 中，可以用 `$(Agent.OS)` 來取得作業系統，而當有多個 key 時，可以用 `|` 來分隔。

{% asset_img 04.png %}

### 設定 Path

顧名思義，就是哪些路徑要被 cache 起來。

使用 npm 時，會有一個固定的 cache 路徑，不過這個路徑會跟著作業系統不同而也差異，導致結果可能會無法預測。

所以我們可以覆蓋 `npm_config_cache` 環境變數，變成一個可預期位置，例如 `$(Pipeline.Workspace)/.npm`

{% asset_img 05.png %}

接著在 `path` 這邊就可以設定為 `$(npm_config_cache)`，代表這個路徑會被 cache 住。

{% asset_img 06.png %}

{% note info %}

npm 預設是有一個 cache 位置的，但使用 Azure DevOps 內建提供的 agent 時，會因為每次進行 CI 時都是建立新的容器，導致並沒有任何內容被暫存下來，所以才需要 cache task 來幫忙。

{% endnote %}

### 最後來看結果

接著我們就實際再跑一次 CI 來看看，第一次跑的時候會發現時間沒有變少，甚至還變多了，這是因為我們需要進行 cache 的關係，也可以看到這時候沒有找到任何 cache 內容：

{% asset_img 07.png %}

在最後則是多了一個 `Post-job: Cache` 的工作，會因為這個 key 還沒有 cache，而將指定的路徑暫存起來：

{% asset_img 08.png %}

但是第二次跑的時候，就會看見還原套件的時間縮短了，同時在 cahe task 也有進行還原動作：

{% asset_img 09.png %}

{% note info %}

內容越多，cache 的效益越顯著！

{% endnote %}

在 key 沒有變動的情況下，`Post-job: Cache` 工作顯示不需要額外進行 cache

{% asset_img 10.png %}

## 本日小結

透過 Pipeline caching，我們可以把 CI 的時間大幅縮短，這樣就可以讓我們的開發流程更加順暢，也可以讓我們的 CI 更加快速，讓我們的開發更加有效率。

今天只是簡單介紹了 cache 這個 task 的基本用法，相更深入瞭解的話，可以閱讀 [Pipeline caching](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching?view=azure-devops&WT.mc_id=DOP-MVP-5003734) 文件。

裡面有許多注意事項，以及常見的 cache 情境如 docker 等等，方便我們可以直接抄來用 😉。

## 相關資源

- [Pipeline caching](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching?view=azure-devops&WT.mc_id=DOP-MVP-5003734)
- [Cache@2 - Cache v2 task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/cache-v2?source=recommendations&view=azure-pipelines&WT.mc_id=DOP-MVP-5003734)
