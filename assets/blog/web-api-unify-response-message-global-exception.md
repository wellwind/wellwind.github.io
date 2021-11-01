---
title: "[ASP.NET WebApi2]統一回傳訊息格式比較完整的處理方法 (3) 全域的Exception處理"
date: 2015-11-13 19:31:40
category: Asp.Net WebApi
tags:
    - WebApi
    - C#
    - Asp.Net
---

在上一篇文章「統一回傳訊息格式比較完整的處理方法 (2) Action中Exception處理」中，我們增加了一個繼承自ExceptionFilterAttribute的類別讓在Action中的方法產生例外時可以用統一的格式回傳。

<!-- more -->

不過[根據這篇文章](http://www.asp.net/web-api/overview/error-handling/web-api-global-error-handling)的說明，當Exception發生在以下情況出現Exception時是不會被ExceptionFilterAttribute處理的：

1. Controll constructors
2. Message handlers
3. Routing
4. Response content serialization

為了讓這些情況的Exception都可以正常被處理，我們需要在新增一個繼承自ExceptionHandler的類別，不過此時可以發現，之前曾經寫過的ExceptionFilterAttribute中已經有一段將Exception和自訂的ApiException轉成ApiResponse的程式，在這裡也會需要用到，因此將這段程式碼拉出來成為一個工具類別方便不同來源使用

```csharp
    public class ExceptionUtils
    {
        public static ApiResponse ToApiResponse(Exception exception)
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

然後將之前的ApiExceptionResponseAttribute裡面的這一行

```csharp
// 將錯誤訊息轉成要回傳的ApiResponseResult
var errorApiResponseResult = exceptionToApiResponse(actionExecutedContext.Exception);
```

修改成

```csharp
// 將錯誤訊息轉成要回傳的ApiResponseResult
var errorApiResponseResult = ExceptionUtils.ConvertToApiResponse(actionExecutedContext.Exception);
```

接著就來加入自訂的ExceptionHandler囉

```csharp
    public class GlobalApiExceptionHandler : ExceptionHandler
    {
        internal class GlobalExceptionResponseActoinResult : IHttpActionResult
        {
            public HttpRequestMessage Request { get; set; }

            public Exception Exception { get; set; }

            public Task ExecuteAsync(CancellationToken cancellationToken)
            {
                var apiResponseResult = ExceptionUtils.ConvertToApiResponse(Exception);
                var response = new HttpResponseMessage(apiResponseResult.StatusCode)
                {
                    Content = new ObjectContent(apiResponseResult.GetType(), apiResponseResult, new JsonMediaTypeFormatter()),
                    RequestMessage = Request,
                };
                return Task.FromResult(response);
            }
        }

        /// 

        /// 在衍生類別中覆寫時，同步處理例外狀況。
        /// 

        ///例外狀況處理常式內容。
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new GlobalExceptionResponseActoinResult
            {
                Request = context.ExceptionContext.Request,
                Exception = context.Exception
            };
        }
    }
```

接下來記得一樣要在WebApiConfig.cs中加入

```csharp
config.Services.Replace(typeof(IExceptionHandler), new GlobalApiExceptionHandler());
```

就算是大功告成啦！