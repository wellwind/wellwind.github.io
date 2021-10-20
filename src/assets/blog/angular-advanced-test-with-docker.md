---
title: "[Angular進階議題]使用Docker測試Angular專案(包含Unit Test與E2E Test)"
date: 2018-03-06 21:09:32
tags:
  - Angular
  - Unit Test
  - E2E Test
  - Docker
---

透過Docker來執行或測試Angular專案是一種值得考慮的做法，我們可以將整個專案可能需要的環境等等包裝成一個Docker image，來使用一致環境去執行與測試，也能避免污染到本機上的環境。

要使用Docker執行Angular專案其實並不難，使用包含node及npm的乾淨image即可，但在進行測試上則需要調整一些細節，今天就來看看該如何在Docker上測試Angular的專案吧！

<!-- more -->

## 建立基本的Docker image

首先我們先來建立一個包含node及相依套件：

```dockerfile
FROM node:8.9-alpine

RUN apk update \
  && apk add --update alpine-sdk \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd
```

在這裡同時我們還能將一些實際相依的環境一起打包進來，例如固定的測試案例程式碼，用來作e2e test用的json server等等。

### 建立Docker image

接著使用`docker build`指令，例如以下指令我們建立了一個名為**docker-support-angular-test**的Docker image：

```shell
docker build . -t docker-support-angular-test
```

稍微等待一下後，我們自己的Docker image就完成啦！

{% note warning %}

雖然這裡命名為**docker-support-angular-test**，但實際上還無法正確支援測試，稍後會再說明。

{% endnote %}

### 使用自訂的image來build現有專案

接著我們模擬一下CI上的情境，將一個angular專案抓下來後，使用自訂的image來執行`npm run build`指令，以及一些前置作業：

```shell
docker run -it \
  -v /path/to/local/project:/var/sandbox \
  docker-support-angular-test \
  /bin/sh -c  "cd /var/sandbox/; rm -rf node_modules; npm install; npm run build"
```

以上指令除了建立container外，也包含幾個動作：

1.  使用`-v`參數，將目前開發中的Angular專案對應到container中的`/var/sandbox`目錄
2.  進入container中對應的目錄，刪除node_modules
3.  執行`npm install`，重新安裝所有套件
4.  執行`npm build`編譯專案

執行結果大致如下圖：

{% asset_img 01.png %}

我們現在有一個乾淨的環境，來幫助我們build專案啦！

## 使用自訂的image來測試專案

上述步驟我們已經可以建立一個乾淨的環境來build Angular的專案，但能不能執行unit test或是e2e test呢？我們來試試看：

使用`npm run test`執行unit test

{% asset_img 02.png %}

看起來是失敗了，提示訊息告訴你因為乾淨的環境下沒有Google Chrome...

再來看看使用`npm run e2e`執行e2e test

{% asset_img 03.png %}

落落長的訊息，其實是一樣的意思，沒有Google Chrome可以使用！

等等，container下沒有視窗環境，可以安裝並執行瀏覽器嗎？

答案當然是不行啦！

這時候我們也可以直接選擇把測試環境改成不依賴瀏覽器的狀態，例如[使用Jest來測試](https://wellwind.idv.tw/blog/2017/08/13/angular-advanced-testing-with-jest/)，或是改為使用[chromium](https://www.chromium.org/)並且設定headless模式，讓執行測試時，不直接開啟視窗，具體該如何做呢？我們可以直接改Dockerfile，把`chromium`及`chromium-chromedriver`裝起來。完整Dockerfile如下：

```dockerfile
FROM node:8.9-alpine

RUN apk update \
  && apk add --update alpine-sdk \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

RUN apk add --update --no-cache \
  chromium-chromedriver \
  chromium
```

安裝完測試需要的套件後，我們再來調整測試的設定

### 調整Unit Test的測試設定

接著我們要調整測試環境的設定檔，首先是unit test的設定，在檔案`karma.conf.js`中加入自訂的啟動程式，選擇使用Chromium並開啟headless等模式

```js
customLaunchers: {
  ChromiumTest: {
    base: 'Chromium',
    flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
  }
}
```

接著再執行測試時設定`--browsers=Chromium_CI`來使用這個啟動程式

```shell
npm run test -- --browsers=Chromium_CI --single-run
```

{% note info %}

要在CI環境下使用時，可以再加上`--single-run`，只執行一次測試，不然會因為karma在等待檔案變更，而造成測試不會停止。

{% endnote %}

再來執行看看結果，unit test就一切正常啦！

{% asset_img 04.png %}

### 調整E2E Test的測試設定

接下來我們來調整e2e test的設定檔，在`protractor.conf.js`中，加入以下設定

```Javascript
chromeDriver: '/usr/bin/chromedriver',
capabilities: {
  browserName: 'chrome', 
  chromeOptions: {
    args: ['no-sandbox', 'headless', 'disable-gpu']
  }
}
```

不用做任何其他變更，直接執行e2e test：

{% asset_img 05.png %}

e2e test也正常了！這麼一來我們除了有乾淨的環境編譯Angular專案，也能同時使用這個環境來進行測試囉！

## 本日小節

今天我們透過使用Docker來編譯及測試Angular專案，使用Docker編譯Angular專案不是件困難的事情，但測試則因為使用到Chrome瀏覽器的關係，而無法成功，在調整Dockerfile及測試設定檔後，我們終於能在Docker下測試Angular專案了！

學會使用Docker來跑Angular專案後，在比較特殊的情境下，能夠讓我們使用更符合特定條件的情境下執行及測試Angular專案，也不用擔心原來的開發機會受到污染；放到CI上，也能統一所有的編譯及測試流程；就能夠適應更多的變化啦！

相關的Dockerfile及Angular設定可以參考以下repo：

https://github.com/wellwind/angula-docker-support-testing

參考資源：

-   https://github.com/johnpapa/docker-angular-cli/blob/master/Dockerfile
-   https://gitlab.com/dasch8/angular-ci/
