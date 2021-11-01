---
title: "[ASP.NET WebApi]使用JWT進行web api驗證"
date: 2016-11-28 11:11:11
category: ""
tags:
    - WebApi
    - JWT
---
在開發web api的時候，由於連線通常都是stateless的，因此驗證跟授權是一個比較艱鉅的挑戰，也因此出現了不少規範來解決這個問題如OAuth等等，而JWT則是一個相對簡單但又安全方式，今天就來介紹一下如何使用JWT來處理Asp.Net WebApi的驗證。

<!-- more -->

# 什麼是JWT

JWT是Json Web Token的縮寫，詳細規範在[RFC7519](https://tools.ietf.org/html/rfc7519)中，目的是用來傳遞JSON物件並且透過雜湊簽章來確保資料沒有被變更過。因此我們可以把它當作驗證的token來用，也可以用來在兩個client之間傳遞資料。

JWT包含了三個部分，header、payload和signature，並使用"點"(` . `)將三個部分連結起來成為一個字串進行傳遞，因此一個完整的JWT字串看起來會像這樣

{% note default %}  
xxxxx.yyyyy.zzzzz  
{% endnote %}  

## Header

JWT的header部分包含了兩個主要資訊：使用的加密演算法和token的類型(基本上就是JWT)，例如以下JSON物件代表了使用HS256演算法來產生JWT token

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

這個物件之後會以base64Url的方式轉換成字串

## Payload

payload包含了聲明的資料，在這裡可以存放一些基本的驗證資訊，在RFC7519中也包含了基本內建的幾個資訊如iss(issuer)、sub(subject)等等(非必要)，當然我們也可以加入自己要的資訊，一個payload看起來會像這樣

```json
{
  "sub": "wellwind",
  "age": 30
}
```

上面的sub就是RFC7519中定義的基本資訊，age則是我們自己加上去的。payload物件一樣會以base64Url的方式進行轉換

## Signature

最後的signature部分則是用來確保資料完整性的一個雜湊簽章，我們可以選用任何雜湊演算法來進行處理，假設我們要使用HMAC SHA256演算法的話，可能會看到類似以下的程式

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

最後我們再把這三個部分組合起來，就可以看到類似以下的token啦！

{% asset_img 0.png %}

圖片來源: [https://jwt.io/introduction/](https://jwt.io/introduction/)

# 使用JWT token進行驗證

接下來我們來看看如何使用JWT token來進行驗證，驗證的流程大致如下圖{% asset_img 1.png %}

圖片來源: [https://jwt.io/introduction/](https://jwt.io/introduction/)

1. client端發送登入的請求，這時可能會附上帳號密碼等驗證資訊
2. server端驗證登入資訊後，搭配一個密鑰(secret key)來產生JWT token
3. 將token回傳給client端
4. client端請求資料時，在request header的Authoriaztion中加上這個token
5. server端驗證token的簽章是否正確，並從payload中得知user的資訊
6. 驗證無誤的話，回傳client端請求的資料

# 在Asp.Net WebApi加入JWT驗證

接下來我們要在Asp.Net WebApi專案中加入JWT驗證，[微軟官方有JWT的加密函式庫](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt/)，功能強大但也因此API不太容易使用，因此我們這邊改用另外一款[jose-jwt](https://www.nuget.org/packages/jose-jwt/)來產生和檢查JWT token。

1. 安裝jose-jwt

    ```powershell
    Install-Package jose-jwt
    ```

2. 建立一個TokenController，繼承自ApiController，程式內容如下

    ```csharp
        public class TokenController : ApiController
        {
            // POST api/values
            public object Post(LoginData loginData)
            {
                // TODO: key應該移至config
                var secret = "wellwindJtwDemo";

                // TODO: 真實世界檢查帳號密碼
                if (loginData.Username == "wellwind" && loginData.Password == "1234")
                {
                    var payload = new JwtAuthObject()
                    {
                        Id = "wellwind"
                    };

                    return new
                    {
                        Result = true,
                        token = Jose.JWT.Encode(payload, Encoding.UTF8.GetBytes(secret), JwsAlgorithm.HS256)
                    };
                }
                else
                {
                    throw new UnauthorizedAccessException("帳號密碼錯誤");
                }
            }
        }
    ```

    上面程式我們會先檢查帳號密碼是否正確，接著使用**Jose.JWT.Encode**來產生JWT token，我們可以先使用postman來看看產生的結果

    {% asset_img 2.png %}
    
    如果我們POST給Token api的帳號密碼是正確的，就會回傳一個token

3. 加入一個JwtAuthActionFilter.cs，內容如下

    ```csharp
        public class JwtAuthActionFilter : ActionFilterAttribute
        {
            public override void OnActionExecuting(HttpActionContext actionContext)
            {
                // TODO: key應該移至config
                var secret = "wellwindJtwDemo";

                if (actionContext.Request.Headers.Authorization == null || actionContext.Request.Headers.Authorization.Scheme != "Bearer")
                {
                    setErrorResponse(actionContext, "驗證錯誤");
                }
                else
                {
                    try
                    {
                        var jwtObject = Jose.JWT.Decode<jwtauthobject>(
                            actionContext.Request.Headers.Authorization.Parameter,
                            Encoding.UTF8.GetBytes(secret),
                            JwsAlgorithm.HS256);
                    }
                    catch (Exception ex)
                    {
                        setErrorResponse(actionContext, ex.Message);
                    }
                }

                base.OnActionExecuting(actionContext);
            }

            private static void setErrorResponse(HttpActionContext actionContext, string message)
            {
                var response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, message);
                actionContext.Response = response;
            }
        }
    ```

    以上程式能讓我們在WebApi的action開始前用**Jose.JWT.Decode**檢查送來的request是否包含JWT token資訊，如果沒有或者token簽章有誤的話，就回傳未授權的錯誤

4. 在需要token授權的api前面加上[JwtAuthActionFilter]

    ```csharp
        [JwtAuthActionFilter]
        public class ValuesController : ApiController
        {
            // GET api/values
            public IEnumerable <string>Get()
            {
                return new string[] { "value1", "value2" };
            }
        }
    ```

接著我們再回到postman把剛剛拿到的token加入header的Authorization中使用的schema為**Bearer**

{% asset_img 3.png %}

如此一來就完成server端的JWT token授權檢查啦！

# Client端使用JWT

Client的工作比較簡單，就是將登入資訊送到server端後，取得JWT token，接著就可以把這個token放在每次的http request中來向server要資料。

以下使用jquery做一個簡單的範例

```javascript
$(document).ready(function () {
    var apiServer = 'http://localhost:40939/api/';

    $('#getToken').click(function () {
        $.post(apiServer + 'Token', {
                Username: $('#username').val(),
                Password: $('#password').val()
            })
            .done(function (data) {
                if (data.Result !== undefined && data.Result) {
                    $('#token').val(data.token);
                } else {
                    $('#token').val('error');
                }
            })
            .fail(function (err) {
                $('#token').val('error');
            });
    });

    $('#getData').click(function(){
        $.ajax({
            url: apiServer + 'Values',
            type: 'GET',
            headers: {
                Authorization: 'Bearer ' + $('#token').val()
            },
            dataType: 'json',
            success: function(data){
                $('#result').val(JSON.stringify(data));
            },
            error: function(data){
                $('#result').val('error');
            }
        })
    })
});
```

結果如下:

{% asset_img 4.png %}

# 單元回顧

本篇文章我們簡單的介紹了一下JWT的基本原理，以及client/server端的簡單實作，實際上JWT token可以有更多的變化例如加上token的到期時間等等，讓整個驗證流程更加完整。

關於本篇文章的程式碼也都放在GitHub上：[https://github.com/wellwind/JwtAuthDemo](https://github.com/wellwind/JwtAuthDemo)

如果需要其他語言的JWT程式庫，可以參考[jwt.io](https://jwt.io/)上的libraries查看。