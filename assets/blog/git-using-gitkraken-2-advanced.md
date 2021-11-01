---
title: "[Git]GitKraken 強大的剛剛好的Git GUI神器(2)進階篇-GitFlow、Commit Template和衝突管理"
date: 2018-04-04 20:13:53
category: Git
tags:
  - Git
  - GitKraken
  - GitGUI
  - GitFlow
  - Commit Template
---

昨天我們簡單的說明了[GitKraken的基本功能](https://fullstackladder.dev/blog/2018/04/03/git-using-gitkraken-1-basic/)，今天我們來介紹如何在GitKraken中一些其他的功能，包含GitFlow開發流程、Commit Template和衝突的處理方式

<!-- more -->

# 使用GitFlow

## 什麼是GitFLow

Git本身具有強大的分支管理功能，要開分支可以說是成本極低的一件事情，也因此若是胡亂開分支，容易造成管理上的混亂，因此也有很多不同的管理方式，而GitFlow就是其中一種很受歡迎的管理方式，以下是GitFlow的簡單流程圖示

{% asset_img git-flow.png %}

資料來源：[A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)

簡單來說，整個工作分成兩個主要分支，分別是master與develop，而其他分支則是輔助這兩個分支用的。

1.  master是用來放置交付版本的程式，而develop分支則是用來放置開發中的功能。
2.  develop分支上，依照不同的需求，再開不同的feature分支，來處理各自feature的開發，當feature開發完畢後，在合併回develop分支。
3.  當develop分支累積足夠的features後，就可以準備release，這時候會再從develop開出release分支，處理release前的工作，如版號變更、撰寫changelog等等。
4.  當release準備完後，就可以合併到master分支，作為最終交付的版本，此時可以給予一個版本號的tag。
5.  當已交付程式有bug發生時，可以在master分支上建立hotfix分支，進行緊急的修復，修復完成後，直接再合併回master。
6.  release和hotfix分支的異動結果，也會同步合併回develop分支。
7.  一般來說master和develop分支，都只會留有被合併的結果，而不會直接在這兩個分支上進行commit。

這樣的方式很適合在比較有組織的開發團隊，藉由一致的規範來管理code base，又不至於分支開得太過雜亂，因此成為了目前最熱門的code base管理實務之一。

GitFlow也有提供CLI工具，直接擴充Git指令，方便我們依照規範建立/合併分支，甚至有中文版的說明，有興趣的讀者可以參考看看：

-   [git-flow 備忘清單](https://danielkummer.github.io/git-flow-cheatsheet/index.zh_TW.html)

## 使用GitKraken進行GitFlow開發

身為最熱門的管理方式之一，自然有許多Git的GUI工具都支援使用GitFlow的開發流程，當然，身為以實用為基礎開發出來的GitKraken，也內建了這種管理方式，不需要額外安裝其他工具，全部都在GitKraken上就可以搞定啦！接下來就讓我們來看看如何使用GitKraken進行GitFlow開發吧！

## 初始化Git Flow設定

首先，開啟任何一個git專案，再點選右上角的Perferences

{% asset_img 01.png %}

接著點選左邊頁籤下面的Git Flow，即可進行Git Flow的設定，主要是設定各個分支的名稱，一般來說照預設設定就可以了

{% asset_img 02.png %}

設定完成後，按下[Initialize Git Flow]，再回到主畫面就能看到左邊的分支管理區多了一塊[Git Flow]區塊，區塊標題右邊有個綠色小按鈕，按下去就會顯示可以開啟或結束的分支

{% asset_img 03.png %}

這時候我們就能夠決定要新增feature、release或是hotfix啦！

## 建立新的feature分支

我們先來建立一個新的feature分支看看

{% asset_img 04.gif %}

只需要輸入feature名稱，例如`test`，就能夠在develop分之上建立一個`feature/test`分支，我們可以嘗試做一些修改，和多建立幾個feature分支，這時候可以看到GitKraken的另一個特色，針對使用`/`分類的分支，GitKraken會把它當作一個資料夾，以階層的方式顯示，如此一來管理就非常方便啦！

{% asset_img 05.png %}

## 合併feature分支

當feature開發完成後，就可以進行合併的動作，此時在GitFlow的Finish區塊可以看到有feature可以合併了

{% asset_img 06.png %}

點擊下去後，可以選擇要完成哪一個feature分支

{% asset_img 07.png %}

除了選擇分支以外，下方還有兩個選項可以使用

-   Rebase on develop：先將目前的feature分之rebase到develop上，再進行合併，可以產生比較漂亮的分支線圖，但也比較容易發生衝突，是否要使用就自行斟酌。
-   Delete branch：合併完成後，是否要刪除目前的feature分支。

最後按下Finish Feature，就算合併完成啦！

{% asset_img 08.png %}

## 建立新的release分支

當累積足夠的features後，我們就可以準備release，此時我們可以建立一個release分支，建立方法同上，再GitFlow的Start區塊中按下Release按鈕後，輸入release名稱即可

{% asset_img 09.png %}

我們可以在此時進行一些release的前置準備，如下：

{% asset_img 09.png %}

## 合併release分支

當release分支處理完後，就可以直接使用Finish合併，同時在打開GitFlow功能選單時，最下面也會直接出現[Finish release/{branch name}]的按鈕，方便我們快速完成release動作

{% asset_img 10.png %}

跟合併feature分支不同的是，我們可以在此時輸入一個tag message，而tag name不用輸入，因為就是這個release分支的名稱

{% asset_img 11.png %}

確認合併後就大功告成啦！如下圖，我們可以看到release分支同時合併到develop和master分支，並且在這次合併到master的結果上加了一個`1.0`的tag，節省很多我們的時間！

{% asset_img 12.png %}

由於release與hotfix差不多，只是一個是從develop分支開，另一個是從master分支開，因此操作上都大同小異，就不多作介紹囉。

{% note info %}

如果在設定Git Flow時，有設定version tag的話，則會自動在release名稱前面加上這個version tag，例如version tag設定為`v`，release name為`1.0`，則合併後tag名稱會自動變成`v1.0`

{% endnote %}

# Commit Template

Commit Template是GitKraken 3.5.0之後支援的新功能，這也是[git本身就有的](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_code_commit_template_code)一個特色，簡單來說，就是預先定義好commit的樣板，節省每次commit的打字時間，也算是個蠻實用的功能。

要開啟Commit Template功能很簡單，一樣從git專案的Perference進去，左邊頁籤下方就有Commit Template的選項，點進去後就可以設定預設的commit訊息

{% asset_img 13.png %}

按下[Save commit template]按鈕即可儲存，儲存後，每次commit時，就會帶出預設的commit template，如下

{% asset_img 14.png %}

# 衝突管理

到目前為止，我們的分支合併都沒有任何衝突發生，但實際上團隊開發時，都不會發生衝突基本上是不可能的事情，因此管理衝突時很重要的一件事情，至於GitKraken是怎麼處理衝突的呢？就讓我們繼續看下去吧！

當我們合併分支發生衝突時，畫面上會出現合併錯誤，並有衝突發生的訊息：

{% asset_img 15.png %}

此時右邊的管理區塊會看到有衝突發生的檔案

{% asset_img 16.png %}

如果自行使用外部工具處理衝突的話，可以在解決衝突後，按下右上方的[Mark all resolved]，讓GitKraken知道衝突已經解決了。

要使用GitKraken內建的衝突管理工具的話，可以在點擊發生衝突的檔案後，進入比較模式：

{% asset_img 17.png %}

GitKraken內建的合併工具，會在左右邊分別出現來源及目標的變更，滑鼠移到highlight的程式碼上時，可以選擇要使用某一行，也可以點選上方的checkbox，選擇使用者個檔案作為合併的版本；最後按下右上[save]按鈕就算解決衝突了，之後再進行commit就算完成合併囉。

{% note info %}

老實說個人覺得GitKraken的合併工具並不好用，當然GitKraken也能夠選擇使用其他的合併工具，但只能使用GitKraken指定的，要選擇更多不同合併工具的話，需要購買pro版本。

在遇到衝突時，通常我會自己打開其他工具來處理衝突，而非使用GitKraken

{% endnote %}

最後輕鬆一下，附個merge產生衝突的示意圖：

{% asset_img merge.png %}

# 本日小節

今天介紹了一些GitKraken的進階功能，包含了非常實用的GitFlow和Commit Template，以及功能有待加強的衝突管理工具。

在團隊開發時，GitFlow是非常被拿出來使用的一種管理流程，而透過GitKraken，可以幫助我們省去許多指令敲打的麻煩，讓開發更加簡單；至於Commit Template，在有要求commit內容規範的情境時，非常的實用；至於合併發生衝突該怎麼辦呢？雖然GitKraken有內建的處理工具，但還是建議用回自己順手的工具吧...

到目前為止都還在單機開發的階段，明天我們再來介紹如何與遠端的repository一起工作吧！
