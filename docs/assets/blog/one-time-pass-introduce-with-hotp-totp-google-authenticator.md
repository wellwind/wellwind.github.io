---
title: "[OneTimePassword] 一次性密碼演算法：簡介HOTP、TOTP和Google Authenticator"
date: 2017-09-07 23:36:41
tags:
  - One Time Password
  - OTP
  - HOTP
  - TOTP
  - JavaScript
  - otplib
---

One Time Password(OTP、一次性密碼)主要用於實現雙因素認證（two-factor authentication）的功能，在使用者一般透過帳號密碼登入後，再透過輸入一組只能使用一次的密碼，完成相對比較安全的登入機制；或是在需要執行特定某些功能時，再次要求使用者輸入一次性的密碼，保護使用者資料不會被他人直接使用，這樣的情境在很多網路銀行線上交易都可以看到。今天就來簡單介紹兩個常見的OTP演算法－HOTP和TOTP

<!-- more -->

# HOTP演算法

HOTP是**HMAC-based One-time Password**的縮寫，演算法定義在[RFC4226](https://tools.ietf.org/html/rfc4226)中，在Wiki中可以看到簡單的定義如下：

{% asset_img hotp-01.png %}

忽略一大串的密碼學和數學的話，我們只需要知道三個資訊

-   K：secret key
-   C：隨機的任意數值，用來確保每次雜湊結果都不同
-   雜湊演算法：以上圖的例子使用的是SHA1

接著我們只需要把金鑰和隨機資訊一起放入雜湊演算法進行運算，再從中取的N個數字，N取決於我們需要的OTP密碼長度。取出來的Ｎ個數字就是OTP密碼啦！

# TOTP演算法

TOTP是HOTP演算法的進階版，演算法定義在[RFC6238](https://tools.ietf.org/html/rfc6238)中，主要的不同是，透過**時間**因素，來產生不一樣的一次性密碼，因為密碼會著時間異動而不同，所以就不用特地擔心密碼的保存時限問題，因為時間到了之前的密碼就會自動到期了，可以省去一些不必要的伺服器和資料庫浪費。

根據Wiki描述的演算法內容如下：

{% asset_img totp-01.png %}

不難看到其實看HOTP非常類似，只是C值會給予一個時間的參數，這個數值隨著設定的時間到期後就會自動遞增，所以一樣的HOTP演算法，只是將C的參數隨著時間自動化變更，進而產生另一組不一樣的密碼。

## Facebook應用

透過這樣自動到期的特性，我們可以很容易為使用者自動產生需要的OTP密碼，例如Facebook中的設定雙重驗證機制的代碼產生器功能（如下圖）

{% asset_img totp-facebook-setting.png %}

我們就可以透過手機下載Facebook，來取得一個每30秒自動重新產生一次的密碼，當Facebook判斷你需要使用雙重驗證時，就會要求你打開手機輸入這組一次性密碼，來完成驗證工作。

{% asset_img totp-fb-app.png %}

{% note info %} 第一次接觸到Facebook的代碼產生器功能時，感到非常不可思議，不管是否使用中都會在伺服器端重新產生密碼的話，不會很消耗資源嗎？但了解TOTP演算法後，就能發現只需要再App中持續產生就好了，完全不需要消耗伺服器端的資源啦！{% endnote %}

## Google Authenticator

Google也提供了[Google Authenticator](https://github.com/google/google-authenticator)，只需要把secret key以符合格式的方式傳給Google Authenticator的App，就能夠輕鬆輕鬆完成雙重驗證功能，使用者使需要下載App掃描QRCode或輸入secret key，即可自動產生TOTP密碼，我們只需要做好驗證的功能即可囉。

{% asset_img totp-google-authenticator.png %}

# 使用第三方套件產生OTP密碼

關於HOTP和TOTP演算法，在網路上很容易可以找到各種語言的實作，為了方便介紹，今天要使用[otplib](https://www.npmjs.com/package/otplib)這個JavaScript套件，使用這個套件主要是因為他的文件很清楚，而且都在client和server端都可以執行，相對用於demo也比較方便。

以下是使用otplib做的一個簡單DEMO

[DEMO網址](http://wellwind.idv.tw/OneTimePasswordDemo/) | [GitHub](https://github.com/wellwind/OneTimePasswordDemo)

{% asset_img otplib-demo.png %}

可以自行試著調整各種資料，看看產生出來的密碼，和驗證是否通過；也可以下載Google Authenticator App掃描QRCode，看看產生出來的密碼是否和畫面上一樣。

## 安裝otplib

otplib可以很簡單的透過npm進行安裝，適合在server端產生和驗證密碼的情境

```shell	
npm install otplib --save
```

要直接在瀏覽器產生和驗證的話，已可以直接從CND加入

```html
<script src="https://unpkg.com/otplib@^6.0.0/otplib-browser.js"></script>
```

## 產生Secret

我們可以自己產生隨機字串當作secret key，也可以透過otplib產生隨機的secret key，畢竟要為每個使用者產生secret key的話，用人家寫好的程式比起自己寫程式產生方便多了！

```javascript
var secret = otplib.authenticator.generateSecret();
```

## 使用HOTP

要產生HOTP很簡單，使用`otplib.hotp.generate`並且把secret key和任意數值*C*傳進去即可

```javascript
var token = otplib.hotp.generate(secret, counter);
```

要驗證則是使用`otplib.hotp.verify`

```javascript
otplib.hotp.verify({
  token: token,
  secret: secret,
  counter: counter
});
```

## 使用TOTP

我們可以使用`otplib.totp`來產生TOTP密碼，不過參數不能調整，所以可以直接使用`otplib.authenticator`來設定一些近些的參數，例如一般預設30秒重新產生密碼，但我希望把時間延長

```javascript
otplib.authenticator.options = {
  step: 90 // 90秒換一次密碼
};
```

產生密碼方式跟HOTP也很像，只是給secret key就好，不需要再給*C*了

```javascript
var token = otplib.authenticator.generate(secret);
```

驗證也是一樣沒有難度

```javascript
otplib.authenticator.verify({
  secret: secret,
  token: token
});
```

## Google Authenticator

otplib也提供產生符合Google Authenticator規則的字串，格式可以參考[Key Uri Format文件](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)，不過裡面有些參數目前Google Authentiactor的App也不支援就是了...

要產生對應的uri，至少需要提供secret key和一個label作為辨識不同服務和使用者用，另外也建議加上Issuer，來辨識提供帳號雙重驗證的服務名稱。

```javascript
var authParam = otplib.authenticator.keyuri(user, service, secret);
```

另外要注意的是user和service不可包含空白等字元，若要包含則需使用encodeURIComponent編碼過。

產生出來的內容大致看起來如下

```
otpauth://totp/Awesome%20OTP:USER?secret=G53TAMLYJFDGO42NPA2WS4C2G5GWQUCO&issuer=AwesomeOTP
```

只要把這段字串轉成QRCode，再用Google Authenticator App掃描看看就可以囉！

web上也可以透過[Google Chart Api](https://developers.google.com/chart/infographics/docs/qr_codes)來產生QRCode，不用自己在找library或寫程式，方便多啦！

# 參考資料

-   https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm
-   https://tools.ietf.org/html/rfc6238
-   https://en.wikipedia.org/wiki/HMAC-based_One-time_Password_Algorithm#Definition
-   https://tools.ietf.org/html/rfc4226
-   https://en.wikipedia.org/wiki/Google_Authenticator
-   https://github.com/google/google-authenticator
-   https://www.npmjs.com/package/otplib
-   https://developers.google.com/chart/infographics/docs/qr_codes
