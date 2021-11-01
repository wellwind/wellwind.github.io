---
title: "[Schematics 實戰] 在本機專案測試 Schematics 執行結果"
date: 2020-01-01 10:58:24
tags:
  - Schematics
---

之前的幾篇文章中，我們已經學會如何使用 Angular Schematics 來改變整個目錄的結構，並使用 Schematics CLI 在專案下測試，但 Schematics 真正的目標是在別的專案內也可以使用，所以我們就來看看如何在本機的其他專案測試 Schematics 的結果吧！

<!-- more -->

# npm link

Schematics 專案本身就是一個 node.js 的專案，所以會在 package.json 內包含了專案名稱及相關設定等等，如果將套件發佈到 npm 上，就可以使用 `npm install [套件名稱]` 的方式將 Schematics 安裝回來。

但是總要本機測試看看吧！這時候我們可以使用 `npm link [套件路徑]` 的方式，將本機的某個 node.js 專案安裝到目前的專案內。

舉例來說，我有一個寫好的 Schematics 專案在 `C:\SchematicsDemo` 下，接著我可以建立另外一個 node.js 專案，假設路徑為 `C:\MyAwesomeProject`，此時我可以在 `C:\MyAwesomeProject` 目錄下執行指令 `npm link C:\SchematicsDemo`，來將本地開發的 Schematics 安裝到目前專案下。

至於 Schematics 的名稱呢？就要看 `C:\SchematicsDemo\package.json` 內的 `name` 屬性了，假設 name 為 `schematics-demo`，這時候就可以在 `C:\MyAwesomeProject\node_modules`，找到這個名稱的目錄，代表安裝成功囉。

### 使用 Schematics CLI 指令

安裝完成後，就可以使用 Schematics CLI 指令來改變專案結構囉，Schematics CLI 指令為：

`schematics [套件名稱]:[Schematics 名稱] ...其他參數`

以上述的例子來說，套件名稱就是 `schematics-demo`，假設我們在專案內設計了一個名為 `my-schematics` 的 Schematics，則完整指令看起來是 `schematics schematics-demo:my-schematics`

此時預設 DryRun 模式為 `false` 代表會直接改變檔案系統，若只想看看改變了哪些檔案，則可以加上 `--dry-run=true` 設定。

# npm publish

當測試一切無誤後，就可以使用 `npm publish` 指令，將開發好的 Schematics 套件發佈到 npm 上囉！

# 本日小結

要在本機測試或使用 Schematics 非常容易，使用 `npm link` 就可以在自己的專案內享用寫好的 Schematics 了；完成後若有意願，也可以使用 `npm publish` 發佈到網路上，供大家使用囉。

下一篇文章我們來看一下如何將 Schematics 與 Angular 做出更好的整合！
