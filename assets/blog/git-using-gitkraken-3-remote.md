---
title: "[Git]GitKraken 強大的剛剛好的Git GUI神器(3)遠端篇"
date: 2018-04-05 21:12:33
category: Git
tags:
  - Git
  - GitKraken
  - GitGUI
---

這篇是GitKraken系列的最後一篇，前兩篇我們把常用的git操作對應GitKraken的方式都大致說明了一遍，接下來我們要來說明GitKraken如何與操作遠端的repository，這可是團隊開發中最重要的環節支一，因此就算不太困難，也很值得獨立一篇文章來說明。

就讓我們繼續看下去吧！

<!-- more -->

# 將遠端repository加入目前的專案中

在GitKraken終支援多種不同的方式，讓專案能跟遠端的repository一起工作

## 直接clone專案

要將目前專案與遠端repository整合在一起有很多方式，最常見的情境應該都是先在遠端建立好repository，再把它clone下來，這種方式最簡單，只需要在Repository Management的Clone頁籤設定即可

{% asset_img 01.png %}

如果你是使用常見的線上平台，GitKraken也已經整理了常用的平台，讓我們能更加容易從遠端repository下載專案，例如GitHub，我們可以直接透過選擇連結到帳號所擁有的repository中，直接進行選擇，而不用在特別去記住repository的URL

{% asset_img 02.png %}

當然，部分的線上服務在GitKraken中要使用者和功能是付費的，但這不代表就不能使用這些平台服務，而是要想辦法去生出basic auth的帳號密碼，或是ssh金鑰，就可以直接使用repository url的方式進行clone；這部分比較複雜，就不在這裡多做說明。

## 在分支管理的remote區塊加入遠端repository

這是比較少見的做法，通常是希望一個專案關係到多個repository，或是全新專案在本機建立後，想要同步到遠端新建的repository，才會選擇這種方式，也沒什麼難度，滑鼠移到主畫面左邊分支管理中的[Remote]區塊標題上，右邊會出現一個綠色按鈕，按下去就可以選擇要加入的遠端repository

{% asset_img 03.png %}

# 遠端repository管理

在git專案中有了遠端repository資訊後，再來看看如何跟地端的專案一起工作吧！

## 切換遠端分支

在Remote區塊中，顯示了遠端repository上所有的分支，另外如果有pull request的話，也可以在左邊看得到，我們可以在任何一個名稱上點兩下，GitKraken就會自動幫你把這個分支下載下來並切換過去

{% asset_img 04.gif %}

## 將最新的內容pull下來

在團隊開發中，pull別人更新的程式碼是非常重要的事情，GitKraken在這上面也下了不少功夫，讓畫面一目了然，如下圖，GitKraken每分鐘會自動幫你檢查遠端的repository版本，當遠端的repository比本機的code base版本還新時，會顯示跟遠端相差多少次的commit；如果連線驗證資訊沒有記在電腦上的話，我們也可以點擊[Pull]按鈕旁的箭頭後選擇[Fetch All]，去更新遠端repository的資訊

{% asset_img 05.png %}

要pull最新的版本，只需要直接點擊[Pull]按鈕即可，預設是fast forward優先，失敗的話會產生新的分支合併；我們也可以選擇fast forward only，當fast forward失敗時就不會進行合併；或是選擇pull rebase的動作。

## push變更到遠端

當程式修改完成後，我們會將異動推到遠端repository，此時我們也能夠看到有多少個commit是等待要被推上去的

{% asset_img 06.png %}

### 直接使用push按鈕

這時候我們能夠直接按下push，來推送local的變更。

{% note info %}

如果推送遠端沒有的分支，會主動詢問要在遠端建立的分支名稱，預設就是local建立的分支名稱

{% endnote %}

### 使用拖曳push

還記得嗎？GitKraken最大的一個特色就是，很多行為都是可以拖曳的，例如之前提過的拖曳merge或是rebase；實際上拖曳行為也可以用在push上面，透過拖曳的方式，我們也可以將本地`分支A`的變更推送到`分支B`上去，非常方便；例如下圖，我們能將`master`分支，透過拖曳的方式，直接推送變更到`5.0.x`分支上

{% asset_img 07.gif %}

這種情境適合在遠端建立分支後，local端不必pull該分支，而是直接進行異動，異動完成後，就可以直接推送到遠端分支，省去local整理分支的麻煩。

### Force push

當遠端及local都有變更時，會成下以下狀態；一般來說，會選擇先pull，在進行push，但此時若略過pull，直接push程式的話，則會產生提示，問你要不要先pull

{% asset_img 08.png %}

這時候有三個按鈕可以選擇

-   第一個是Pull (fast-forward if possible)：也就是等於先幫你pull程式下來，在push變更上去
-   第二個是Force Push：代表強制以local的變更為基礎，覆蓋遠端的變更
-   第三個沒什麼，就是取消

正常情況下，我們都會選擇先pull，再push；當然有時候也有例外，最常見的情況是使用`git reabase -i`，大幅調整分枝狀況後，以目前local的變更為主，強制覆蓋遠端的分支。

這種情境通常是由一個管理者在管理分枝時才會發生，正常情況下都不應該做force push的動作，有些線上git服務甚至可以設定force push的權限，以避免濫用！

{% note info %}

很遺憾，GitKraken不支援`git rebase -i`指令，雖然它也不是常用的命令

{% endnote %}

# 本日小結

今天我們介紹了GitKraken與遠端repository整合操作的一些功能，也算是終於把GitKraken大部分的功能都全部帶過啦！

GitKraken確實是一套非常獨特的GUI工具，在眾多工具中算是很特別的存在，也確實能夠幫助我們節省不少下指令的時間，但值得注意的是，由於GitKraken雖然非常好用，但也需要建立在正確的git觀念上，否則在使用上反而容易造成不必要的混淆；這也是筆者在使用及推坑GitKraken的過程中遇到的一個挑戰，但只要導正git觀念後，大部分的朋友都能夠感受到GitKraken的方便以及強大！

在遇到比較複雜的狀況時，下指令或是搭配更複雜的git工具是在所難免的，但在80%只需要用到基本指令的情境下，GitKarken真的是非常棒的一個坑，歡迎大家一起跳下去吧XD
