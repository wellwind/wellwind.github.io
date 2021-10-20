---
title: "[ASP.NET WebApi2]統一回傳訊息格式比較完整的處理方法 (2) Action中Exception處理"
date: 2015-10-32 19:27:01
category: Asp.Net WebApi
tags:
    - WebApi
    - C#
    - Asp.Net
---

在上一篇文章「統一回傳訊息格式比較完整的處理方法 (1)回傳訊息統一」中，我們利用自訂ActionFilter的方法成功把所有WebApi回傳的結果包裝成一個統一的格式，接下來我們會面臨到出現錯誤時，也要依照我們自己定義的格式回傳JSON。

<!-- more -->

預期的出現錯誤時的回傳格式範例如下：

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

首先這篇文章先來講在Action中出錯時該如何回傳一致的錯誤訊息；在上一篇文章我們自訂了一個ActionFilter來統一回傳結果，而當Exception產生時我們也可以自訂ExceptionFilter來處理Action中的例外

```csharp

    public class ApiExceptionResponseAttribute : ExceptionFilterAttribute
    {
        public override void OnException(System.Web.Http.Filters.HttpActionExecutedContext actionExecutedContext)
        {
            base.OnException(actionExecutedContext);

            // 將錯誤訊息轉成要回傳的ApiResponseResult
            var errorApiResponseResult = exceptionToApiResponse(actionExecutedContext.Exception);

            // 重新打包回傳的訊息
            actionExecutedContext.Response =
                actionExecutedContext.Request.CreateResponse(errorApiResponseResult.StatusCode, errorApiResponseResult);
        }

        private static ApiResponse exceptionToApiResponse(Exception exception)
        {
            var errorApiResponseResult = new ApiResponse();

            if (exception is ApiException)
            {
                var apiException = exception as ApiException;
                errorApiResponseResult.StatusCode = apiException.StatusCode;
                errorApiResponseResult.Error = new
                {
                    ErrorId = apiException.ErrorId,
                    Message = apiException.Message
                };
            }
            else
            {
                errorApiResponseResult.StatusCode = HttpStatusCode.BadRequest;
                errorApiResponseResult.Error = new
                {
                    ErrorId = "",
                    Message = exception.Message
                };
            }
            return errorApiResponseResult;
        }
    }
```

然後到WebApiConfig.cs中加入這個ExceptionFilter

```csharp
config.Filters.Add(new ApiExceptionResponseAttribute());
```

以上就大功告成啦！接著我們可以直接寫一個測試用的Controller，在裡面的Action拋出Exception或我們前面自訂的ApiException，來測試看看回傳結果是否統一了。

測試用Controller程式碼：

```csharp
    public class ExceptionTestController : ApiController
    {
        public object Get()
        {
            throw new Exception("Test Exception Message...");
        }

        public object Post()
        {
            throw new ApiException("Test Api Exception Message...");
        }
    }
```

一樣使用postman來觀察結果，當使用GET方法時產生Exception回傳的JSON結果

```json
{
  "StatusCode": 400,
  "Result": null,
  "Error": {
    "ErrorId": "",
    "Message": "Test Exception Message..."
  }
}
```

當使用POST方法時會回傳ApiException，此時的回傳結果

```json
{
  "StatusCode": 400,
  "Result": null,
  "Error": {
    "ErrorId": "unknown_api_error",
    "Message": "Test Api Exception Message..."
  }
}
```

就完成在Action中的Exception錯誤處裡囉！

不過在Action以外產生的錯誤還是無法處理，下一篇再來介紹Action外處理錯誤的方法。