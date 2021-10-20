---
title: "[Ansible]搭配rsync在Windows Server上建置Continuous Delivery部署流程"
date: 2017-01-08 11:11:11
category: ""
tags:
    - Continuous Delivery
    - Ansible
    - rsync
---
最近因為工作需要建立一套部署機制，來改善過去人工部署的麻煩，盡可能讓事情都自動化；稍微survey了幾個工具後，決定使用Ansible作為部署的主要機制。今天就來分享一下如何利用Ansible與rsync將程式部署到Windows Server上面！

<!-- more -->

先說明一下使用自動部署前架構的簡單圖示：

{% asset_img 0.png %}

目前只有少數程式可以搭配使用CI Server，其他程式由於過去架構問題目前還無法順利在CI Server上運行，因此都是在本機編譯程式後，**手動**發佈到Windows Server A~C，由外部進行load balance，因此每次部屬都要部三份，麻煩且容易出錯<del>有夠沒人性</del>；由於目前也沒有自動部署的架構，因此CI Server也只能當作確保code base品質的手段，也沒有使用自動部署，因此希望將架構調整如下：

{% asset_img 1.png %}

我們**只需要將程式部屬到Deploy Server上**，就能透過Ansible將Deploy Server上的程式與Server A~C同步；如此一來原本在CI Server上的程式只需要加一段發佈設定，就能夠把CI/CD的流程都自動化了！而手動部屬的程式也只需要人工傳送到Deploy Server上即可，花費時間只剩下原本的1/3，也不用擔心不小心哪一台忘記部署上去；**Developers看到的Server越少，出錯的機率就越低！**

# 前置步驟-安裝Ansible與設定Windows Server

剛開始當然需要一台Linux Server並安裝Ansible作為Control Machine，以及在Windows Server上加入對Ansible的支援，不過這不是我們要介紹的重點，因此只列出需要的主要步驟，細節請自行參考文件

1. 安裝Ansible：[http://docs.ansible.com/ansible/intro_installation.html](http://docs.ansible.com/ansible/intro_installation.html)
2. 設定讓Windows Server可做為Ansible的managed node：[http://docs.ansible.com/ansible/intro_windows.html](http://docs.ansible.com/ansible/intro_windows.html)
3. 把要部屬來源以及要部屬的Windows Servers加入/etc/hosts

如果對於Ansible不理解的話可以參考以下slide(中文)

- [現代 IT 人一定要知道的 Ansible 自動化組態技巧](http://www.slideshare.net/freezejonny/it-ansible)
- [現代 IT 人一定要知道的 Ansible 自動化組態技巧 Ⅱ - Roles & Windows](http://www.slideshare.net/freezejonny/it-ansible-64079747)

# 開始打造部署機器

接下來就是我最愛的部分，寫程式啦！雖然Ansible可以幫助我們**管理多台電腦的組態以及部屬程式**，但是沒有一個可用腳本搭配，要自動化也是說說而已，而Ansible的playbook可以使用yml語法撰寫，聽起來好像又是新的程式語言，但實際上寫起來簡單易懂，搭配Ansible有大量的modules可以使用，就算Windows Module比較起來相對少很多，但也很夠一般維運使用了，就算不夠還可以直接呼叫PowerShell，管理多台server絕對沒問題啦！

# Deploy Server設定

由於rsync是使用ssh進行檔案傳輸，為了能夠自動化，我們可以選擇使用產生金鑰的方式或是Deploy Server啟用rsync server，並額外設定帳號密碼；當然使用金鑰是比較安全的做法，雖然我們在Windows Server上也可以使用ssh-keygen產生，但使用chocolatey安裝的OpenSSH的ssh-keygen有問題，為了讓一切更簡單(儘管這樣做是有問題的)，我們選擇在Deploy Server上產生，然後把public key加到Deploy Server後，所有要同步的機器(也就是前面提到的Server A~C都保留private key)。因此這邊寫了一個yml腳本：

```yml
---
- name: set rsync cert
  hosts: DeployServer
  tasks:
    - name: create user
      user:
        name: syncuser
    - name: add login cert to syncuser
      authorized_key:
        user: syncuser
        state: present
        key: "{{ lookup('file', '/var/rsync_cert/rsync_rsa.pub') }}"
```

這裡我們**建立一個給外部使用的帳號syncuser，然後使用authorized_key將產生好的public key加進去**，之後只要拿到private key的node都可以使用syncuser進行連線(再次聲明，人人有一樣的private key是不太正確的，真正環境建議應該要反過來做)，且不用再輸入密碼了！

只要執行這個腳本，就完成deploy server的設定囉

# Server A~C設定

接下來我們要讓Server A~C可以定期透過rsync去同步deploy server上的程式，由於Server A~C是Windows Server，要在Windows Server上使用rsync可以使用cwRsync，雖然cwRsync也有提供ssh.exe，但在遠端執行rsync時會找不到，因此也要在Windows Server上安裝Open SSH，我們可以先寫一個bat檔，讓Server A~C可以執行rsync動作

```
rsync.exe -av --partial --progress -e="ssh -i C:/rsync_rsa -o StrictHostKeyChecking=no " --iconv=utf-8,big5 --delete syncuser@deployserver:/var/deploy /cygdrive/d/deploy
```

以上的指令可以在不需要輸入任何其他文字的情況下，使用rsync同步deploy server的檔案，我們可以直接在Windows Server加入排程去跑這對程式不過這樣就不好玩了，我們可以改用Ansible Playbook把剛剛提到的步驟一次完成

```yml
---
- name: set rsync env
  hosts: apserver
  tasks:
    - name: install rsync
      win_chocolatey:
        name: rsync
    - name: install OpenSSH
      win_chocolatey:
        name: openssh
    - name: transfer private rsa key
      win_copy:
        src: rsync_cert/rsync_rsa
        dest: c:/rsync_rsa
    - name: copy rsync_deploy.bat
      win_copy:
        src: deploy_bat/rsync_deploy.bat
        dest: C:/rsync_deploy.bat

```

以上的腳本讓我們可以直接在所有要部屬的機器上(也就是Server A~C)進行

1. 安裝rsync
2. 安裝OpenSSH
3. 將private key憑證傳到node上
4. 將同步用的bat檔傳到node上

想想看以上**只是4個簡單步驟，但要在3台電腦上設定就等於需要12個步驟，假設未來流量越來越大，load balance擴張到50台時，光設定就瘋掉了吧**！而透過Ansible，只需要把這些server加到hosts裡面，然後執行一次腳本，就可以收工啦！Ansible好棒棒阿！！

最後我們讓排程的工作也在Ansible上執行，讓Ansible可以一次呼叫所有的機器去同步程式

```yml
---
- name: do the deploy
  hosts: apserver
  tasks:
    - name: do sync
      win_command: C:/rsync_deploy.bat
```

把執行這個yml檔的指令加到cron job中，就打完收工啦！

透過Ansible，infrasture as code變得超簡單，管理server不再頭痛，早點下班不是夢囉！