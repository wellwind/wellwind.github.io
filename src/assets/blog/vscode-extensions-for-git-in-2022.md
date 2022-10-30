---
title: "目前我在 VS Code 中使用的 Git 相關擴充功能 (2022 版)"
date: 2022-09-03 17:01:48
category:
tags:
---

分享一下目前我有在使用 Git 相關的 VS Code 擴充功能。

<!-- more -->

# GitLens

<img src="https://raw.githubusercontent.com/gitkraken/vscode-gitlens/main/images/docs/gitlens-logo-anybg.png" />

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) 可以說是 VS Code 上功能最強大的套件，它跟我在 VS Code 外最愛用的 Git 軟體 [GitKraken](https://www.gitkraken.com/) 是同一家公司開發的，這家公司在增強 git 體驗可以說是不遺餘力！這個套件一裝起來，在 Source Control 的頁籤瞬間就多了一堆功能可以使用！

GitLens 對我來說有兩個很重要的功能，第一個是 blame，可以讓我們快速看到程式碼中每一行最後一次是由「誰」在「什麼時候」因為「什麼原因」異動的，在追查程式 bug 時非常方便，可以快速找到需要一起討論問題的人！

{% asset_img 01.png %}

{% note info %}

當然你知道的，git blame 常常都是 blame 到自己 XD

{% endnote %}

另一個就是強大的 interactive rebase 功能了！GitLens 將 interactive rebase 做成了非常漂亮好用的介面，省去面對以往要改一堆文字內容的痛苦。

{% asset_img 02.png %}

{% note info %}

GitLens 也有商用的付費功能，但整體來說免費的就非常非常夠用了！

{% endnote %}

# Git Graph

<img src="https://github.com/mhutchie/vscode-git-graph/raw/master/resources/demo.gif" />

[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) 要做的事情非常簡單，就是把 git commit 記錄顯示出來，這個功能其實 VSCode 已經內建了，但個人覺得不怎麼美觀，在外觀部分，還是 Git Graph 大勝！Git Graph 圖形界面上同時也提供了一些如 merge、reset 等功能，方便我們直接操作！

# Gitmoji

<img src="https://raw.githubusercontent.com/seatonjiang/gitmoji-vscode/main/images/gitmoji.gif" />

你是否看過一些 open source 的專案，會在 commit message 中加上一些 emoji？這其實是有一個規範在的，叫做 [gitmoji](https://gitmoji.dev/)，Gitmoji 是一個 git commit message 的規範，它的目的是讓 commit message 更容易閱讀，也讓 commit message 更有趣！

而在 VSCode 上，也有一個對應的套件 [Gitmoji](https://marketplace.visualstudio.com/items?itemName=seatonjiang.gitmoji-vscode)，讓我們可以遵循 gitmoji 的規範來撰寫 commit message，讓整個 commit 記錄更加生動活潑。

# gitignore

[gitignore](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore) 可以說是非常重要，只是使用機會相對少的套件，它可以幫助我們快速產生一個 `.gitignore` 檔，只要我們執行 `F1` -> `Add gitignore`，就可以針對不同的專案類型直接選擇對應的 `.gitignore` 範本，對於專案初期來說是非常方便的！只是建立完後通常也就不會再用這個套件了，如果不是頻繁在建立專案的話，用到的機會也不多。

# 本日小結

以上就是幾個在 VSCode 上常用的 git 相關套件，如果你有其他推薦的，也歡迎在下方留言分享給大家！

