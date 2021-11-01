---
title: "[React速成班]有錢沒錢，選個編輯器好過年(3)-用Sublime Text 3開發React支援Highlight"
date: 2016-03-11 16:26:56
category: "React速成班"
tags:
    - React
    - Sublime Text
---

單純以程式碼Highlight來說的話，Sublimt Text 3算是個人感覺看起來最舒服的(雖然我還是偏好使用Visual Studio Code)，所以這篇就來快速說明一下如何設定讓Sublime Text 3可以支援JSX檔的Highlight吧！

<!-- more -->

# 安裝Package Control

[Package Control](https://packagecontrol.io/)是Sublime Text 3(之後都簡稱Sublime)的擴充套件來源，相當於NPM、NuGet這類的角色，不過Sublime本身下載後並沒有附帶Package Control，所以要額外安裝，首先打開Sublime後按下ctrl+`，接著輸入以下代碼：

```
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

就會開始安裝Package Control了。

{% asset_img ide3-001.png %}

# 安裝babel-sublime

安裝好Package Control之後，就可以透過Sublime安裝相關的套件了，在這邊我們需要安裝babel-sublime這款套件：

1. 打開Sublime後輸入`Control+Shift+P`

2. 輸入package install後，選擇`Package Control: Install Package`，按下Enter
    {% asset_img ide3-002.png %}

3. 輸入Babel，選擇第一個，按下`Enter`即可進行安裝
    {% asset_img ide3-003.png %}

4. 安裝完成後只要偵測到.jsx檔就會自動支援JSX的語法高亮，若要連.js檔也支援，可以隨意點選一個.js檔後點選上方的**View->Syntax->Babel->JavaScript(Babel)**，即可設定讓.js檔也用Babel處理器來解析
    {% asset_img ide3-004.png %}

個人覺得Sublime的highlight看起來是最舒服的

{% asset_img ide3-005.png %}