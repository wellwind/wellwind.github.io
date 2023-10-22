---
title: "[Kubernetes] CKAD/CKA 證照考試心得"
date: 2023-07-29 11:37:18
category:
  - Kubernetes
tags:
  - Kubernetes
  - CKAD
  - CKA
ogImage: ckad.png
---

為了即將到來的工作需求，最近開始準備 Kubernetes 的考試，花了一個月的時間學習，總算取得 CKAD 和 CKA 證照，在這邊分享一下我這一個月的學習心得。

<!-- more -->

先附上人權，點擊圖片可以連到 Credly 證明

CKAD

<a href="https://www.credly.com/badges/9946c95c-975b-4aff-82d5-c8ea43facca9/public_url" target="_blank"><img src="https://images.credly.com/size/680x680/images/f88d800c-5261-45c6-9515-0458e31c3e16/ckad_from_cncfsite.png" width="256"></a>

CKA

<a href="https://www.credly.com/badges/c6c6bc13-312a-4c30-9225-e60cdefa91b8/public_url" target="_blank"><img src="https://images.credly.com/size/680x680/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png" width="256"></a>

# CKAD/CKA 考試簡介

CKAD 和 CKA 都是 CNCF (Cloud Native Computing Foundation) 推出的認證考試，用來證明考生對於 Kubenetes 操作具有一定的理解，特別的是考試都是採取上機考的模式，需要在指定的環境與時間內完成題目要求的資源部署，因為要額外分配考試環境，同時也有許多人工審查的部分，因此考試費用相對也不便宜，不過往好處想這兩張證照的識別度也相對較高。

兩張證照的考試時間都是兩小時，及格分數是 66 分。

## CKAD 考試簡介

CKAD 主要目標為讓開發人員理解如何透過 Kubernetes 建立一個**可持續運作的可靠服務**，大致包含如何將一個開發好的服務部署到 Kubernetes，並確保服務的可靠性；當系統需要升級時如何在使用者幾乎感覺不到中斷的情況下升級；如何保證服務可以使用的最低資源，以及限制服務可用資源；服務之前如何進行溝通等等。

雖然是面向開發人員的考試內容，但並不著重在任何程式語言，考試假定你已經對容器架構有基本理解，所有的服務都是包在容器內執行的，因此對於容器的基本概念也需要有一定程度的理解和經驗。

在撰寫這篇文章的時間點，考試內容範圍包含以下，詳細內容可以到 [CKAD 考試網站](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/) 查看。

* Application Design and Build - 20%
* Application Deployment - 20%
* Application Observability and Maintenance - 15%
* Application Environment, Configuration and Security - 25%
* Services and Networking - 20%

## CKA 考試簡介

CKA 的考試對象偏重於 Kubernetes 的管理者，因此除了對於 Kubernetes 基本的資源要理解之外，會更加著重在如何面對 Kubernetes **叢集的操作和管理**，確保整個叢集可以持續運作，因此考試內容包含各種叢集問題的排除、網路管理、和備份升級等議題。

身為伺服器的管理者，基本網路知識是需要的，同時對於在主機上執行各種指令這種行為要更加熟悉。

在撰寫這篇文章的時間點，考試內容範圍包含以下，詳細內容可以到 [CKA 考試網站](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/) 查看。

* Storage - 10%
* Troubleshooting - 30%
* Workloads & Scheduling - 15%
* Cluster Architecture, Installation & Configuration - 25%
* Services & Networking - 20%

# 準備考試前的必備技能

在準備整個考試之前，如果具有以下基礎知識，在學習和準備會更加上手，如果沒有也不用擔心，後面附上的學習資源也包含需要用到的內容，可以幫助你更快上手。

* **Linux 基本指令**: 由於考試都是在 Linux 環境下操作，如果工作上都是使用 IDE 輔助的話，這部分就會稍微不習慣；不用對各種 Linux 指令都滾瓜爛熟，但至少要能在指令介面下切換到各個目錄，查看檔案和建立檔案
* **VIM**: 考試環境應該可以用 nano，但我不習慣就沒有確認這件事情；考試過程中會有很多機會編輯 YAML 檔，加上環境中沒有 IDE 的輔助，因此至少要能夠在 VIM 下編輯檔案，一樣的不用對 VIM 非常熟悉，但熟悉越多操作方式，越能加快編輯的速度，更快完成考試的題目需求
* **Container 容器架構**: 普遍大家還是會直接用 Docker 這個名詞統稱容器架構，但考試過程 (尤其是 CKAD) 可能會要你用其他方式建立容器，加上整個 Kubernetes 都是靠容器架構運作的，因此有基本理解會很有幫助

# 推薦學習資源

## Udemy 課程

Udemy 上有許多 Kubernetes 的課程價格不貴且會這平台有活動特價，最低三百多塊台幣就可以入手，我自己買了以下課程，上完也非常推薦：

* [Kubernetes for the Absolute Beginners - Hands-on](https://www.udemy.com/course/learn-kubernetes/)
* [Kubernetes Certified Application Developer (CKAD) with Tests](https://www.udemy.com/course/certified-kubernetes-application-developer/)
* [Kubernetes Certified Administrator (CKA) with Practice Tests](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/)

三堂課程主要講師都是 [Mumshad Mannambeth](https://www.udemy.com/user/mumshad-mannambeth/)，課程內容很詳細，而且講師有提供他們自家的平台 [KodeKloud](https://kodekloud.com/) 可以練習，省去我們在地端準備環境的麻煩，只要購買課程就能免費使用平台提供的練習環境，加上會先幫我們把情境都準備好，我們只要專注在練習就好！

## KillerKoda 練習平台

另外 [KillerKoda](https://killercoda.com/) 平台有提供免費的模擬環境，以及練習題目：

* [Killer Shell CKAD](https://killercoda.com/killer-shell-ckad)
* [Killer Shell CKA](https://killercoda.com/killer-shell-cka)

## 模擬考試

報名 CKAD & CKA 考試後，會附送 [killer.sh](https://killer.sh/) 平台的模擬考試，模擬考試環境非常接近實際考試，可以用來熟悉整體的考試環境，這個平台的考試題目「號稱」比實際考試難、需要在考試時間完成的題目也比較多，如果能在這平台拿到不錯的成績，正式考試基本上就穩了；不過我自己準備和考試的經驗來說，與實際考試的難度感覺並沒差多少，但題目數量確實比較少，因此建議可以把目標放在**時間內完成所有題目**，但不用期待正式考試時會比較簡單。

# 考前準備與考試心得

## 考前準備

如果對於 Kubernetes 基礎知識不夠熟悉，推薦可以入手「Kubernetes for the Absolute Beginners - Hands-on」，這堂課會從基本的架構開始講起，一步一步帶你了解 Kubernetes 的運作方式，並且會有很多練習的機會，讓你可以更加熟悉 Kubernetes 的各種資源，之後再去看 CKAD 和 CKA 的課程內容。

觀看課程我是用 1.5 倍速搭配中文字幕學習，中文字幕是機器翻譯的，其實並不是很精準，但講師的英文還算清楚，所以覺得中文字幕怪怪時只要留意一下英文口說的部分，還是可以掌握整體內容，又可以加快學習速度。

CKA 和 CKAD 有不少內容是重複的，所以考完 CKAD 後，我在準備 CKA 時很多課程就直接跳過了，只看有差異的部分，也可以省下不少時間。

課程中所有的 labs 都建議練習過一次，CKAD 和 CKA 課程還有提供 Mock Exams，建立都可以多練習幾次，對這些題目越熟悉，考試就越輕鬆。

準備考試最難的就是持續力，我自己是每天下班晚上看一點，假日多看一點，如果有額外活動當天就直接果斷決定不看，在課程準備時如果遇到我本來就熟悉的知識，也就盡快跳過；課程看完後就直接報名下週考試，讓自己意識到一定要準備了！接下來一週就是每天做模擬考試、驗證結果、修正錯誤，然後就可以放心去考試了

我自己的時間安排大致如下:

* 第一週：把「Kubernetes for the Absolute Beginners - Hands-on」看完，所有 lab 都做過一次
* 第二週：把 CKAD 課程看完，所有 lab 都做過，報名考試
* 第三週：練習 CKAD 課程的 Mock Exam，都做過兩次以上，killer.sh 也練習兩次以上
* 第四週：把 CKA 課程看完，所有 lab 都做過，報名考試
* 第五週：練習 CKA 課程的 Mock Exam，都做過兩次以上，killer.sh 也練習兩次以上

基本上這樣準備強度，我自己覺得算是蠻操的，不過就是把自己逼緊一點、以免怠惰，實際上還是需要看每個人對基礎的理解和時間的安排。

在做 killer.sh 模擬考試時，會提供你一個 36 小時可用的遠端環境，你可以隨時重新設定考試，環境就會完全重置，並給你兩個小時的考試時間，考完會針對每個題目的要求評分，同時環境依然還在，所以可以直接修正錯誤，過一段時間評分就會更新，一直修正到全部正確為止，就算是完成一次完整的模擬考試加檢討了。

36 小時後就無法參加模擬考試，不過報名正式考試送的是「兩次模擬考試」(題目完全一樣)，基本上一定有充足的練習時間。

## 考試心得

網路上蠻多考試報名方式和心得的，大家可以自己搜尋，我就講講自己的狀況就好。

因為考試對環境要求蠻多的，最主要需要隱蔽的空間、牆壁儘量乾淨、桌上桌下只能放考試需要的東西等等，蠻麻煩的，所以報名考試時我同時有在[小樹屋](https://thehapp.com/)找空間，不過過去在小樹屋借用空間的心得是：「小樹屋的空間都蠻舒服的，但隔音基本上都不太好」，因此我是選擇六日早上九點考試，賭一下那時間沒人辦活動。

考試時間是兩小時，可以提早半小時登入考試環境，所以我借用的時間是 8:00~11:30。提早一小時到場是為了讓自己有充分的時間放鬆與準備，另外多借半小時讓自己考試完畢後可以留點時間收拾環境，不用趕著離開。

8:00 到現場後先休息一下，並且確認網路連線沒問題，開個冷氣，讓自己放鬆，接著等 8:30 登入考試環境，會被要求下載安裝一個 PSI Browser 程式，會先檢查電腦環境，同時會需要關掉一些 PSI Browser 要求關閉的程式，只要按個按鈕就會自動關閉了，蠻簡單的；之後會拍大頭照以及證件照片，以供後續考官核對，接著就是排隊等**真人考官**檢查環境，排到你後，就依照考官要求用鏡頭拍攝環境，第一次考試時考官問我後面是不是有監控攝影機，我回答「是」後，有被要求換一個背後沒有監控攝影機的位置，等到所有檢查沒問題，就進入實際考試。

理論上在所有考試時間都會在 PSI Browser 上操作，不會離開這個程式，我們的目標就是把每道題目的要求盡可能在考試的環境內達到，考試題目也包含文件的連結，方便我們快速查找，不過有些連結裡面不一定會有實際上可以解決問題的參考，所以事前準備還是很重要，至少要能知道大多數的問題要從文件的哪裡找答案。

第一次考試前，我有主動把所有常駐程式都先關掉，剩下的就讓 PSI Browser 判斷要關掉哪些程式；第二次考試時，我選擇直接讓 PSI Browser 判斷要關掉哪些程式，結果不知道是哪個常駐程式的問題，在考試過程一直害我的 PSI Browser 失去焦點，打字打到一半失去焦點就會跳出系統音效，一直跳出系統音效的結果就是被考官關心，之後我趕快解釋後嘗試關掉所有看得到的常駐程式，接下來就一切順利了，建議大家進入考試前還是先把常駐程式都關掉比較保險。

另外第一次考試時，有遇到斷線的狀況，當下真的超緊張，趕快重新登入環境，結果還要排隊等真人考官，周遭環境也要全部重新檢查一次，浪費不少時間，如果能確保考試的網路穩定，還是儘量確保一下。

第一次考試全部題目做完剩下大約 20 分鐘，簡單做個檢查就交卷了，成績 78 分，只有一題確定不會所以沒做，我原本以為應該有 85 以上，但不知道錯在哪，自己猜測應該是粗心打錯字之類的原因。

第二次考試因為有前一次的經驗，加上很多指令都非常熟悉，考完剩下大約 40 分鐘，有非常充足的時間檢查，我確實有檢查到打錯字的狀況，另外原本有一題因為不確定所以沒有做完，但因為有足夠的檢查時間，在認真地仔細查過文件後，還是有解決；整體考完覺得好像每題都會，但又不確定是不是真的有達到考試的要求，覺得有點虛；結果考出來成績是 91 分，證明應該是自己嚇自己居多。

考試過程全程是使用英文，包含跟真人考官的溝通，如果真的擔心有語言障礙，也可以選擇中文考試，但聽說中文考試題目翻譯品質不太好，不過還是可以看到英文題目，而特別的好處是考官可以用中文溝通。不過我是從一開始就選擇英文，所以對於選擇中文考試的實際狀況就不太清楚，看看有沒有選擇中文考試經驗的人可以補充。

# 總結

準備考試真的是一件不容易的事情，在準備的過程中也讓我對 Kubernetes 有更加深入的理解，雖然整個 Kubernetes 的坑還是很大，但至少也算是具有入門能力了！也希望這篇文章能幫助大家在準備 CKAD/CKA 考試時順利，也歡迎跟我分享你的經驗與心得 💪
