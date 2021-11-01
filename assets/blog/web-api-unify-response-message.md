---
title: "[ASP.NET WebApi2]統一回傳訊息格式比較完整的處理方法 (1)回傳訊息統一"
date: 2015-10-20 19:14:12
category: Asp.Net WebApi
tags:
    - WebApi
    - C#
    - Asp.Net
---

由於目前有一個實作Api Server的需求，是會開放給很多第三方使用的，因此需要不管任何情況(包含各種Exception)都將回傳的內容格式完全統一，以方便其他使用Api的人容易解讀內容'，研究了一整天，終於有點結論了。

<!-- more -->

先整理一下目前的狀況

1. 當正常的Api呼叫時，回傳格式範例如下

```json
{
  "StatusCode": 200,
  "Result": {
    "Name": "Wellwind",
    "Age": 30
  },
  "Error": null
}
```

2. 當任何情況下有錯誤時，回傳格式範例如下

```json
{
  "StatusCode": 404,
  "Result": null,
  "Error": {
    "ErrorId": "api_doesnt_exist",
    "Message": "此Api不存在"
  }
}
```

第1種情況比較好處理，第2種情況就麻煩多了，需要自己在幾個不同的地方處理錯誤才能統一。

先來看第1種情況，解決方法很簡單，加入一個讓回傳格式統一的`action filter`，並在config中註冊它就可以了。

首先先自訂一個統一回傳格式的類別

```csharp
    public class ApiResponse
    {
        public HttpStatusCode StatusCode { get; set; }

        public object Result { get; set; }

        public object Error { get; set; }
    }
```

為了能夠比較完整的處理錯誤，另外定義一個`ApiException`，可以根據例外的狀況決定不同的回傳代碼，之後只要是與Api相關的錯誤(例如參數錯誤、未授權、Api不存在等等)，都可繼承這個Exception後回傳

```csharp
public class ApiException : Exception
{
    public string ErrorId { get; set; }

    public HttpStatusCode StatusCode { get; set; }

    public ApiException()
        : this("API呼叫錯誤")
    {
    }

    public ApiException(string errorMessage)
        : base(errorMessage)
    {
        ErrorId = "unknown_api_error";
        StatusCode = HttpStatusCode.BadRequest;
    }
}
```

接著在一個繼承`ApiException`的範例

```csharp
    public class ApiDoesntExistException : ApiException
    {
        public ApiDoesntExistException()
            : base("此Api不存在")
        {
            ErrorId = "api_doesnt_exist";
            StatusCode = HttpStatusCode.NotFound;
        }
    }
```

接下來就是重頭戲啦！加入一個自訂回傳訊息的Filter

```csharp
    public class ApiResponseAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);

            if (actionExecutedContext.Exception != null)
            {
                return;
            }

            var result = new ApiResponse
            {
                StatusCode = actionExecutedContext.ActionContext.Response.StatusCode,
                Result = actionExecutedContext.ActionContext.Response.Content.ReadAsAsync().Result }; 
                // 重新封裝回傳格式
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(result.StatusCode, result); 
            }
        }
    }
```

之後到WebApiConfig.cs的Register方法中加入

```csharp
config.Filters.Add(new ApiResponseAttribute());
```

基本統一回傳格式就算大功告成囉！

統一格式前：(回傳類別就直接serialize成JSON)

```json
[
  "value1",
  "value2"
]
```

統一格式後：(依自訂格式包裝成JSON)

```json
{
  "StatusCode": 200,
  "Result": [
    "value1",
    "value2"
  ],
  "Error": null
}
```

推薦使用[postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=zh-TW)這個chrome extension來查看結果。

參考資料：

- http://kirkchen.logdown.com/posts/147859-using-aspnet-mvc-to-build-web-api-16-unified-input-output-formats-and-the-exception-handling-strategy

- http://www.asp.net/web-api/overview/error-handling/web-api-global-error-handling

- https://msdn.microsoft.com/zh-tw/library/system.web.httpapplication(v=vs.110).aspx

- https://dzone.com/articles/handling-http-404-error-aspnet

- https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop