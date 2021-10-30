---
title: "[Git]GitKraken 強大的剛剛好的Git GUI神器(1)基本篇"
date: 2018-04-03 20:05:24
category: Git
tags:
  - Git
  - GitKraken
  - GitGUI
---

使用[GitKraken](https://www.gitkraken.com/invite/tTwhuFXM)作為個人管理的git工具已經有一年的時間了，最近也有機會開始推坑一些好友使用GitKraken，同時也讓他們用過就回不去了！

為了讓推坑更加順利，決定來寫幾篇關於GitKraken的介紹，宣揚一下這套強剛剛好的強大的git GUI！

<!-- more -->

{% asset_img gitkraken-logo.jpg %}

# 關於GitKraken

GitKraken是一套git的GUI管理工具，透過GUI的幫忙，省去們在進行版本管理的時候需要記憶指令的麻煩；由於是使用Electron最為基底開發，因此它也是一套跨平台的管理工具。

除了跨平台之外，GitKraken與目前知名的[TortoiseGit](https://tortoisegit.org/)等工具最大的差異是：這些知名的工具往往著重在可以透過GUI幫你執行多少指令，結果反而應為大多畫面而顯得雜亂；而GitKraken則是把「最常用」的指令透過GUI的設計，做到最容易理解及操作，因此雖然GitKraken支援的git指令比較少，但對於常用的指令如commit、merge或rebase等等，操作上卻更加容易！(事實上那麼多git指令，我們一般工作上又用得到多少呢？)

GitKarken有分付費版和免費版，在大部分的狀況下，使用免費版就非常足夠了。

{% note warning %}

GitKraken免費版僅供open source和非營利用途，如果在公司內使用，尤其是專案公司或產品公司，請考慮購買pro版！

{% endnote %}

{% note info %}

如果你的身份是學生並且有edu信箱，可以透過申請[GitHub Student Developer Pack](https://education.github.com/pack)，來取得一年的GitKraken Pro使用權限。

{% endnote %}

# 推薦資源

使用GUI之前，最好要有git的基本觀念，以免使用GUI時因為觀念不正確而覺得卡卡的。以下是一些推薦的學習資源：

-   [30 天精通 Git 版本控管](https://github.com/doggy8088/Learn-Git-in-30-days)
-   [[實體課程]Git 版本控管實戰：新手進階篇](https://www.accupass.com/event/1803160942171984741691)

# 開始使用GitKraken

接下來就讓我們看看GitKraken如何使用，以及有些什麼驚人的特色吧！

首先先到GitKraken首頁，就可以看到明顯的下載按鈕，按下去後會針對使用的平台下載對應的版本，下載完後直接安裝即可。

{% asset_img 01.png %}

打開後可以看到如下登入畫面：

{% asset_img 02.png %}

登入後會問你要不要啟用7天的pro帳號試用看看付費版的功能，至於要不要用就看個人囉

{% asset_img 03.png %}

進入後由於還沒有任何repository的關係，畫面上應該是空白的，這時候可以按下左上方的Repository Management來開啟本機的repostory，或clone遠端的repository，或是在Init分頁直接建一個新的repository

{% asset_img 04.png %}

GitKraken支援以下幾種常見的clone方式：

-   URL：只要有公開的git url，都可以直接clone
-   GitHub
-   GitHub Enterprise (pro only)
-   GitLab (pro only)
-   BitBucket
-   Visual Studio Team Service (pro only)

雖然有一些是pro only，但主要是幫你把OAuth認證連結的部分做起來，實際上只要支援basic auth，都可以直接透過URL的方式進行clone，以VSTS為例，雖然免費帳號無法透過OAuth連結VSTS，但可以透過`Alternate authentication credentials`的方式，建立一組帳號密碼

{% asset_img 05.png %}

在使用URL clone時，輸入這組帳號密碼即可

打開一個repository後，就可以看到以下的畫面啦！

{% asset_img 06.png %}

整個畫面大致分成4個區塊：

1.  repository資訊，以及一些最常用的功能
2.  本地/遠端的分支狀態、pull request、tag等資訊
3.  git的樹狀結構，基本上還蠻清楚的
4.  每次commit的資訊

# 快速切換不同的repository

open、clone或init過的repository會被記錄下來，方便我們快速切換，我們可以直接在Repository Management中開啟最近開過的repository，也可以點repository旁邊的星號，把它加進我的最愛，之後快速切換時也可以直接選擇加到最愛的repository

{% asset_img 07-change-repository-1.png %}

也可以直接點擊左上方目前的repository名稱，來切換最近開過或是加到最愛裡面的repository

{% asset_img 07-change-repository-2.png %}

# 第一次commit

接下來就讓我們實際來看看如何進行commit吧！當成是有異動時，GitKraken會自動追蹤目前的異動：

{% asset_img 07.png %}

我們也能切換Path或Tree的顯示方式：

-   Path會顯示異動檔案相對的完整路徑

{% asset_img 07-path.png %}

-   Tree則已目錄階層的方式呈現

{% asset_img 07-tree.png %}

## 執行commit的方式

當有檔案被變更時，我們可以透過[Stage all changes]按鈕，把所有變更加入(等於是下了`git add .`指令)

我們也能夠只新增部分的變更 (對應git的[interactive staging](https://git-scm.com/book/zh-tw/v2/Git-Tools-Interactive-Staging)功能)，只要按下想要stage的行號旁的按鈕就好

{% asset_img 08.png %}

被加入的變更會出現在右邊的[Staged Files]區塊，最後在下面的[Commit Message]中輸入commit的訊息跟描述，在按下最下面綠色的[Commit changes to N file(s)]，就完成一次commit動作啦！

{% asset_img 09.png %}

完成後的commit會立刻顯示在中間的git樹狀結構上，如果只是單行的commit message，也可以直接在樹狀結構上操作，非常方便！

{% asset_img 10.png %}

## 使用reset還原變更

commit完如果後悔了，我們通常會使用`git reset`來還原commit結果，如果要還原到比較之前的記錄，還需要搭配`git log`或`git reflog`等指令找到之前的步驟，透過GUI最大到好處是，我們可以輕易看到所有commit紀錄，要還原也變得特別簡單：

首先我們可以透過上方的[Undo和Redo按鈕]來還原/重做commit，這很簡單

{% asset_img 10-undoredo.png %}

另外一個方法是，在想要還原的某個點上，直接按下右鍵，選擇[Reset {branch} to this commit]，在選擇reset的策略即可，是不是很簡單啊！

{% asset_img 10-reset.png %}

# 基本分支操作

接下來我們來看看使用如何進行分支合併，這是筆者最愛的功能之一！

## 建立分支

要建立分支方式有很多種，最簡單的方式是是按下最上方的[Branch]按鈕，這會立刻在目前分支上載建立一個分支。

{% asset_img 11.png %}

也可以在左邊分支清單中，在想要建立分支的名稱上按右鍵，在按下[Create branch here]

{% asset_img 12.png %}

## 切換分支

切換分之的方式非常的簡單，直接在左邊想要切換的分支名稱上點兩下就好：

{% asset_img 13.gif %}

## 隱藏分支

當分支太多太雜亂時，也可以選擇點選分支旁邊的眼睛按鈕，來隱藏/顯示該分支

{% asset_img 13-toggle-visible-branch.png %}

## 合併分支

合併分支可以說是GitKraken最誘人的地方，我們可以用拖曳的方式，直接把A分支合併到B分支上！

{% asset_img 14.gif %}

在畫面上我們可以看到，rebase也可以用同樣的方式去操作，整個直覺了不少。

到目前為止還沒看過有哪套GUI的合併分支是用拖曳的！只有GitKraken有這麼做，實在是超級方便啦！

{% note info %}

基本上，只要畫面可以看到分支名稱的地方，都是可以拖曳合併的，例如中間的樹狀結構，左方有分支名稱的標籤，也可以直貼拖曳到任何另一個分支名稱上。

{% endnote %}

# 本日小結

GitKraken雖然是商業軟體，但是免費版就已經包含了很多強大的功能，它的目標不是盡可能支援各種的git指令，而是盡可能把最常見的指令做到最好操作，實際上它也做到了！

透過GitKraken，一般我們最常用的功能都可以在畫面上快速的操作，而且對於比較複雜但很重要的指令如merge和rebase，也提供了更加直覺的解決方案，也就是**拖曳合併**！筆者在推坑時，每次介紹這個功能都可以得到很有成就感的驚呼聲XD

雖然說GitKraken不是以支援所有指令為目標，但它的強大也絕對不只今天介紹的文章而已，其他常用的如stash、revert、cherrypick等，都可以在畫面或按右鍵上找到，這部分就留給讀者去探索囉。

明天我們來談談比較進階的GitKraken特色，像是衝突處理、GitFlow等等吧！

-   [[Git]GitKraken 強大的剛剛好的Git GUI神器(2)進階篇-GitFlow、Commit Template和衝突管理](https://fullstackladder.dev/blog/2018/04/04/git-using-gitkraken-2-advanced/)
-   [[Git]GitKraken 強大的剛剛好的Git GUI神器(3)遠端篇](https://fullstackladder.dev/blog/2018/04/05/git-using-gitkraken-3-remote/)

