---
title: "[GitHub Projects]在GitHub上使用看板功能"
date: 2016-09-16 22:54:47
tags:
    - GitHub
    - GitHub Projects
    - Kanban
---

GitHub在2016/09/15推出了許多新的功能(文章來源[A whole new GitHub Universe: announcing new tools, forums, and features](https://github.com/blog/2256-a-whole-new-github-universe-announcing-new-tools-forums-and-features))，其中最令人興奮的功能之一就是[Projects](https://help.github.com/articles/about-projects/)這項功能，也就是GitHub直接內建看板啦！！剛才稍微試玩了一下，今天就來做個簡單的介紹吧！

<!-- more-->

GitHub是目前世界上最大的開源中心之一，也有很多人在上面管理自己開放出來的程式碼。內建的Issue功能也非常方便，可以在上面提出需要改進/加強的地方。但對於專案開發的人來說，管理上就比較不方便一點，尤其是在越來越流行使用看板方法管理的時代，條列式的Issues就會顯得比較雜亂難以管理。也有許多第三方的公司推出與GitHub整合的看板功能，但管理上總是會稍微有點不方便，因此GitHub也決定推出了內建的看板功能─Projects！讓你可以輕鬆的整合目前的Issues/Pull Requests到看板上，雖然看板整體功能比較陽春，但基本的功能也都有了，操作方式也與目前流行的看板軟體功能都類似，且對於GitHub直接整合，實在是方便許多啊！接下來就用我目前自己在做的一個小專案[8ComicDownloaderElectron](https://github.com/wellwind/8ComicDownloaderElectron)來介紹一下GitHub上的看板功能吧！

# 使用Projects

進入GitHub的專案後，可以看到多出了一個Projects頁籤，由於一開始我們還沒有任何看板，我們可以趕快來按下[Create a project]按鈕，來產生第一個看板

{% asset_img github-projects-001.png %}

需要填入的資訊也非常簡單，就是看板的名稱和描述，然後按下[Save project]就好囉

{% asset_img github-projects-002.png %}

每個GitHub的repo可以建立無限的project(當然前提是你有權限)，而每個project都是公開的，因此網友也可以很容易的在上面看到目前進行中的進度。例如我們可以多建立幾個看板，來讓不同人員追蹤不同需要的進度

{% asset_img github-projects-003.png %}

進來之後可以看到很簡單的空白畫面，有使用過Trello這類看板軟體的朋友應該都不會太陌生，接下來就用[Add column]來建立一些看板欄位

{% asset_img github-projects-004.png %}

簡單建立幾個欄位後，一個有模有樣的看板雛型就完成囉

{% asset_img github-projects-005.png %}

# 管理卡片

我們可以利用每個欄位的[+]符號來建立卡片

{% asset_img github-projects-006.png %}

建立後就可以看到這張卡片囉

{% asset_img github-projects-007.png %}

## 將卡片轉換成Issue

我們也可以很容易地把這張卡片轉換成一個Issue，如下圖

{% asset_img github-projects-008.png %}

轉換後就會立刻出現一個連結，因為它已經變成一個Issue囉，點擊進去就可以看到熟悉的Issue畫面囉

{% asset_img github-projects-009.png %}

## 將Issues轉換成卡片

我們可以很容易將建立好的卡片轉到Issue，那麼要如何將現有的Issues轉成看板上的卡片呢，只需要按左上角的[Add Cards]，就可以看到現有的Issues/PRs，我們可以把想要加進去的Issue拉到指定欄位中，成為一張卡片。

如下圖，我先搜尋已經關閉的Issue，然後將其中一張完成功能加到Done欄位中

{% asset_img github-projects-010.png %}

完成後就可以看到以下畫面

{% asset_img github-projects-011.png %}

所有看板上的卡片都是可以直接拖曳移動到其他欄位的，非常方便吧！

目前GitHub上的Projects看板功能大致上就是這些，大致上操作方法都跟目前主流的看板軟體如Trello等類似，只是功能比較陽春，像是沒有核選清單、附件等等常用的方便功能，遇到比較複雜的編輯功能時也稍微有點麻煩，但好處就是可以直接無縫整合GitHub上的Issues/PRs；對於開發人員來說也不用特地在去其他看板軟體上開新的看板操作，更能夠專注在一個平台上就把事情做完，還是非常方便的。

相信之後GitHub上的看板功能會越來越完整，真的是非常令人期待啊！！

順便附個簡單官方圖片介紹

{% asset_img github-projects-012.gif %}

再順便加上官方介紹影片墊內容XD

https://www.youtube.com/watch?v=C6MGKHkNtxU

# 參考資料

[https://github.com/blog/2256-a-whole-new-github-universe-announcing-new-tools-forums-and-features](http://github.com/blog/2256-a-whole-new-github-universe-announcing-new-tools-forums-and-features)

<https://help.github.com/articles/tracking-the-progress-of-your-work-with-projects/>

<https://www.youtube.com/watch?v=C6MGKHkNtxU>

<https://github.com/wellwind/8ComicDownloaderElectron>

**