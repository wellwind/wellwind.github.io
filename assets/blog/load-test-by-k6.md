---
title: "使用 k6 進行壓力測試"
date: 2022-09-17 19:35:10
category:
tags:
  - k6
  - "load testing"
---

當系統預期有很多人同時上線時，可能會需要進行壓力測試。比起工具 Apache Jmeter 的高學習難度，k6 是一套很好的壓力測試工具，對於開發人員來說非常友善。

本文將簡單介紹如何使用 k6 進行壓力測試。

<!-- more -->

## 安裝 k6

k6 是使用 GO 語言撰寫的，且支援各種平台，包括 Windows、Linux 和 Mac。

安裝 k6 的方式非常簡單。如果你使用 Windows 並已安裝 Chocolatey，只要執行下列指令即可安裝 k6：

```bash
choco install k6
```

此外，k6 官方也提供 docker image。只要拉取 docker image，即可使用包含 k6 的環境，而不用擔心會污染現有的環境。

```bash
docker pull grafana/k6
```

我們也可以前往 k6 的 [GitHub Release](https://github.com/grafana/k6/releases) 頁面，直接下載 binary 執行檔來使用。

其他平台的使用方式可以參考官方文件：

https://k6.io/docs/get-started/installation/

## 開始撰寫 k6 腳本

k6 的核心雖然是用 GO 語言寫的，但它的腳本語法使用的是 JavaScript，以下是個簡單的 k6 壓測腳本：

```javascript
// script.js
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}
```

程式碼應該是非常好理解的，我們使用 `k6/http` 的 http 物件，透過其 `get` 方法，去呼叫 `https://test.k6.io` 這個網址，並且在呼叫完後，使用 `k6` 的 `sleep` 方法，讓程式暫停 1 秒，這樣就完成了一個簡單的壓力測試。

接著我們就可以執行以下指令來執行這個腳本：

```bash
k6 run script.js
```

就完成一次對目標網址的測試啦！接著就可以看以下的執行結果：

{% asset_img 01.png %}

從圖中可以看到 k6 呼叫的狀況，包含了每秒呼叫的次數、每次呼叫的時間、每次呼叫的狀態碼等等，這些資訊都可以幫助我們了解目標網站的回應能力的狀況。

### 壓力測試

如果只是呼叫一次網址，那其實沒什麼壓力，如果希望能測試伺服器對大量情求的處理能力，可以透過 k6 增加更多虛擬的使用者來進行測試，最簡單的方式是執行 `k6` 時加上 `--vus` 參數，指定要模擬多少使用者

```bash
k6 run --vus 10 scripts.js
```

如果想要這些使用者持續不斷的呼叫網址，可以加上 `--duration` 參數，指定要持續多久，例如：

```bash
k6 run --vus 10 --duration 30s scripts.js
```

這麼一來就可以模擬同時 10 個使用者，在 30 秒內持續呼叫得到的結果，如果都能在合理的時間內回應，那就代表伺服器的處理能力是足夠的。

瞬間大量使用者是一種情境，另外還有一種可能是使用者在一段時間內持續增加，這時候我們可以在程式內設定增加的方式，例如：

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ]
};

export default function () {
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

只要些個 `export const options = {}`，這個物件就會告訴 k6 要以什麼樣的方式進行模擬，以上面的例子來說，我們分成了三個階段，剛開始會再 30 秒內，增加到 20 個使用者同時上線；接著 1 分 30 秒內，維持 10 個使用者；最後 20 秒內，再將使用者降為 0。

### 測試回應結果

除了一般呼叫網站看結果之外，我們也可以透過 k6 來測試回應的內容，例如：

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const loginBody = JSON.stringify({
    username: 'mike',
    password: '123456'
  });

  const loginResponse = http.post(
    `http://someapi/login`,
    loginBody,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  check(loginResponse, {
    "登入: is status 200": (r) => r.status === 200,
    "登入: has access token": (r) => !!r.json().accessToken,
  });
}
```

首先我們先用 `http.post` 去呼叫 API 並取得回傳結果，接著用 `check` 來檢查回傳的結果，這邊我們檢查了回傳的狀態碼是否為 200，以及回傳的內容是否有 accessToken，如果都符合的話，就會回傳 true，反之則是 false。

透過 `check` 來檢查，在執行測試後會出現如下的結果：

{% asset_img 02.png %}

### 測試門檻

我們也可以為回傳結果的成功率、回應時間等等，設定門檻，如果超過門檻的話，就會將測試結果標示為失敗，例如：

```javascript
export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    // 期望在整個測試執行過程中，錯誤率必須低於 5%
    http_req_failed: ["rate<0.05"],
    // 平均請求必須在 300ms 內完成，90% 的請求必須在 200ms 內完成
    http_req_duration: ["avg < 300", "p(90) < 100"],
  }
};
```

在 `thresholds: {}` 中，我可以指定評量項目的門檻值，在測試完成後會再這些項目上標記成功或失敗：

{% asset_img 03.png %}

`http_req_failed` 的比率小於設定的 `0.05`，達到我們設定的門檻內，因此標記為成功；
`http_req_duration` 的 `p(90)` 時間為 135.66ms，未達我們設定的門檻，因此標記為失敗。

## 本日小結

k6 可以說是對工程式最友好的一套負載測試工具，沒有複雜的 UI 操作，使用的都是我們熟悉的程式碼，而且透過程式碼更容易控制測試的情境，更精準的測試出目標網站的狀況。

在 k6 的文件內還有更多的情境，可以在文件上慢慢挖寶！

https://k6.io/docs/
