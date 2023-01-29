---
title: "[OpenID] 使用 RS256 與 JWKS 驗證 JWT token 有效性"
date: 2023-01-28 15:15:21
category:
  - "OpenID"
tags:
  - "OpenID"
  - "JWT"
  - "JWK"
  - "JWKs"
ogImage: 01.png
---

使用 JWT token 來進行身份認證已經是現在開發上的顯學了，常見的服務如 Microsoft 等透過 OAuth 2.0 登入後，有會拿到一組 JWT 格式的 access token，我們可以透過這個 token 去呼叫相關的 API 來取得想要得資料，但除了把 access token 丟給 API 外，我們有沒有其他方是可以驗證這個 token 是否有效呢？

如果服務使用 RS256 對 token 簽章，且有跟著 OpenID 的規範走的話，是有一套完整在 client 端就可以自行驗證的流程的，這篇文章就來說明一下所有相關的技術，同時實際拿個 token 來驗證看看！

<!-- more -->

## JWT 非對稱簽章

JWT 算是非常基礎應該不用多說，不過今天的重點在如何進行簽章；一個 JWT token 包含三個部分，裡面各有今天主題需要的內容：

1. **header**：包含簽章使用的演算法，一般常見最簡單的是 **HS256**，也就是只有一組金鑰做雜湊來產生簽章，要驗證簽章就一定要這組金鑰；另外一種常見的也是今天主題的重點：**RS256**，RS256 採用非對稱加密的方式，也就是分別會有公私鑰兩組金鑰，通常會在 server 端使用私鑰來簽章，而 client 端則使用公鑰來驗證簽章是否正確。
2. **payload**：裡面包含整個 token 的主要資訊，其中會有 `iss`，也就是核發 token 的人，如果有照著 OpenID 規範來走，那從 `iss` 就可以延伸得知許多資訊，例如 `jwks_uri`，也就是公鑰的下載位置，省去我們查找每家驗證提供者文件的麻煩。
3. **signature**：不用多說，就是簽章啦！每個 JWT token 之所以不容易被竄改，都是靠這個簽章運作的，簽章是針對 header 和 payload 所產生的唯一資訊，因此只要有一個地方被竄改，簽章就會不一樣，我們就會視為這是個不合法的 JWT token。

而除了這些基本的 JWT 知識以外，我們還需要知道一些其他的知識。

## 簡介 JWK

[JWK](https://www.rfc-editor.org/rfc/rfc7517) 屬於 RFC 7515 的規範，全名為 **JSON Web Key**，從名稱來看很容易得知 JWK 就是用 JSON 的格式去裝載各種加解密金鑰資訊，另外我們也可以將很多金鑰放到一個 JSON 陣列內，就會被稱為 JWKs (JSON Web Key Set)。

JWK 和 JWKs 被設計來解決金鑰管理和交換的問題。它們提供了一種統一的格式來表示金鑰，並使得金鑰能夠在不同系統之間進行交換和共用，簡化我們管理金鑰的麻煩。

一個 JWK 物件會包含許多屬性來描述一個金鑰，包含一個必要的屬性：

- `kty`：(key type) 金鑰類型，例如 RSA 或 Elliptic Curve。

以及一些常見但非必要的屬性：

- `kid`：(Key ID) 識別金鑰的唯一值。
- `use`：(Public Key Use) 公開金鑰的用途，例如簽名 (`sig`) 或加密 (`enc`)。
- `alg`：(Algorithm) 金鑰實際使用的演算法。

其他屬性就會根據金鑰的屬性而有所不同，例如使用 RSA 的金鑰，通常還會需要 `n`、`e`、`d` 等屬性來描述實際上的金鑰內容。

以下是微軟 Azure AD 驗證金鑰時的其中一組 key

```json
{
  "kty": "RSA",
  "use": "sig",
  "kid": "nOo3ZDrODXEK1jKWhXslHR_KXEg",
  "x5t": "nOo3ZDrODXEK1jKWhXslHR_KXEg",
  "n": "oaLLT9hkcSj2tGfZ...",
  "e": "AQAB",
  "x5c": ["MIIDBTCCAe2gAwIB..."]
}
```

當然實際上以 JWKs 的方式提供的，所以會有多組，JSON 內容大致如下：

```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "nOo3ZDrODXEK1jKWhXslHR_KXEg",
      "x5t": "nOo3ZDrODXEK1jKWhXslHR_KXEg",
      "n": "oaLLT9hkcSj2tGfZ...",
      "e": "AQAB",
      "x5c": ["MIIDBTCCAe2gAwIB..."]
    },
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "l3sQ-50cCH4xBVZLHTGwnSR7680",
      "x5t": "l3sQ-50cCH4xBVZLHTGwnSR7680",
      "n": "sfsXMXWuO-dniLaI...",
      "e": "AQAB",
      "x5c": ["MIIDBTCCAe2gAwIB..."]
    },
    ...
  ]
}
```

當我們使用非對稱式演算法如 RS256 來產生 JWT token 簽章時，通常會使用私鑰產生簽章，同時我們可以將公鑰以 JWK 的格式發佈到網路上，其他人只需要使用公鑰就可以驗證我們的簽章是否正確了，這麼一來就可以在送到伺服器前提早驗證 JWT token 的合法性。

## OpenID 的 well-known 文件

為了讓所有人都可以用統一的方式來完成認證作業，OpenID 規範了一份 well-known 文件，讓我們可以從這份文件中取得這個認證提供者所有的公開資訊，其中包含了 `jwks_uri` 這個屬性，可以讓我們取得這個認證提供者所公開的金鑰資訊。

這份文件的名稱的路徑也有明確規範，一定會是 `/.well-known/openid-configuration`，因此只要知道提供登入服務的位置，就很容易可以找到這份文件，同時如果服務提供者只要有正確實作，就可以輕易找到 JWK 的位置。

至於這份文件會在哪裡呢？當我們得到 access token 時，一定會在 payload 中找到 issuer (`iss`)，這個 issuer 就是認證提供者的網址，因此 well-known 文件一定會在 `{issuer}/.well-known/openid-configuration`。

詳細規格可以參考 [OpenID 的完整規格](https://openid.net/specs/openid-connect-discovery-1_0.html)。

## 實際驗證 JWT token

有了這些知識後，我們實際上來看看如何自行驗證一個 token 是否正確。以下是我先在 Azure AD 建立一個假帳號後登入某個服務取得的 JWT token。

```txt
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZWE3NDIyN2MtNDBlZi00NDAyLWJiY2UtNTY0NDg1OTk0YmVjLyIsImlhdCI6MTY3NDkwNzQwMywibmJmIjoxNjc0OTA3NDAzLCJleHAiOjE2NzQ5MTE1NjUsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUFmSWtzOHJzb1dYNndMZm5sN3FsaTA4ZUZiYXVHVVUwbmpjN3VkcFI5T1dIVmFuekhYTFlMeXV6U2lYelBVYXZXIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6ImUzNGM2Mzc1LTExNWUtNDQ3Zi04Mzk0LWQ0YmU5OWFiMThkOSIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQmFyIiwiZ2l2ZW5fbmFtZSI6IkZvbyIsImlwYWRkciI6IjM2LjIyOC4yMjcuMTkiLCJuYW1lIjoiRmFrZSBVc2VyIiwib2lkIjoiMzNkMzA0MjAtNmJmMS00MTc1LThmNmMtM2UwNDdjNmNhMDFhIiwicHVpZCI6IjEwMDMyMDAyNkQ4NUFEMDAiLCJyaCI6IjAuQVhJQWZDSjA2dTlBQWtTN3psWkVoWmxMN0VaSWYza0F1dGRQdWtQYXdmajJNQk55QU1ZLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjBrQXBZSE15WnNETGtad0JYZVNqRnZiRktqdGl5bGVsSGNZa3RvYzd1NXciLCJ0aWQiOiJlYTc0MjI3Yy00MGVmLTQ0MDItYmJjZS01NjQ0ODU5OTRiZWMiLCJ1bmlxdWVfbmFtZSI6ImZha2UtdXNlckB3ZWxsd2luZG1haWwyMDAwY29tLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImZha2UtdXNlckB3ZWxsd2luZG1haWwyMDAwY29tLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjB1cXZsMXNXWFVXMXJFQTBxa2RPQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfdGNkdCI6MTQ1NTYwOTQ0Nn0.WATkGhSIgsGwjYo8G0Ka0ikr4NGgyDiL_X0ZuOVTzAlAr50QmLFMKIpLDWOS2sCXfY6G0QLFBSVp3oGUheP6LtvjdZeK8ng7SWYJP92YKy5XZpAqOPaeO9LYCG6Y-TwQH3N9aDLf2RmB-FW8cpgNw2WsyDALjRquyJQH2FA1u-nvKe2fivbZX95PNlL9AbaOEhvSy-kQaFYIO8zfmafswbbDRpKmxyZnl6zoXbi_UkeNiqzcmHEqaRh8fRpDIswCrJcJorGXm_5R64OM235h6Zw28cREOb4PHhUHHKcxyarp6KKzDkEQhsMHkVmzu9ygP-NU5TFCjYZvxmNvXg1g_w
```

先把這串 token 貼到 [jwt.io](https://jwt.io) 看看

{% asset_img 01.png %}

從圖片最下面可以看到，我什麼資訊都沒提供，但在右下角 VERIFY SIGNATURE 自動帶出了驗證簽章的 public key，同時左下角也提示了 Signature Verified。

jwt.io 是怎麼幫我們找到 public key 來驗證的呢？

從 header 中可以看到這組 jwt token 是使用 RS256 簽章的，而且有一個 `kid` 的值，這個值就是用來找到對應的 public key 的。

接著我們可以看到 `iss` 內容為：`https://sts.windows.net/ea74227c-40ef-4402-bbce-564485994bec/`

因此我們可以判斷 well-known 文件位置為：[https://sts.windows.net/ea74227c-40ef-4402-bbce-564485994bec/.well-known/openid-configuration](https://sts.windows.net/ea74227c-40ef-4402-bbce-564485994bec/.well-known/openid-configuration)

在這份文件中，我們又可以找到 `jwks_uri` 屬性，內容為：[https://login.windows.net/common/discovery/keys](https://login.windows.net/common/discovery/keys)

{% asset_img 02.png %}

{% note info %}

這種 key 通常異動頻率極低，因此如果要整合的提供者不多，也可以考慮把這些公鑰存下來，當做 `jwks_uri` 掛掉時的備援。

{% endnote %}

接著透過 JWT token header 記錄的 `kid`，就可以找到對應的公鑰資訊啦。

{% asset_img 03.png %}

之後我們只要找任何一個支援 RS256 簽章的 JWT library，就可以驗證這組 token 囉。

## 本日小結

JWT token 已經被廣泛運用在各種認證情境了，而 OpenID 進一步延伸規範了很多細節，讓我們可以更加容易的整合各家認證服務提供商，也能實作自己的認證服務。

而透過非對稱的方式進行簽章處理，可以讓 client 端自行驗證簽章的有效性，同時節省認證伺服器的資源。

身份認證的水真的很深阿！

## 相關資源

- [OpenID 的完整規格](https://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 7515 - JWK](https://www.rfc-editor.org/rfc/rfc7517)
- [OpenID Connect on the Microsoft identity platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc?WT.mc_id=DOP-MVP-5003734#fetch-the-openid-configuration-document)
- [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
