---
title: "[ASP.NET WebApi2]統一回傳訊息格式比較完整的處理方法 (5) 找不到正確API時的錯誤處理"
date: 2016-02-25 19:31:40
category: Asp.Net WebApi
tags:
    - WebApi
    - C#
    - Asp.Net
---

在之前的文章中，我們已經可以在一般呼叫API的情況下將回傳的JSON格式統一，且在Exception發生時也能夠將Exception已我們想要的格式回傳，但由於Asp.Net WebApi已經先幫我們做好了找不到正確的Controller和Action時的處理，導致當呼叫不存在的API時，還是無法依照想要的JSON格式回傳，這篇文章就來解決這個問題。

<!-- more -->

呼叫不存在的API分成兩種狀況，第一種是呼叫了不存在的Controller，會出現類似以下的錯誤訊息

```json
{
  "Message": "找不到與要求 URI 'http://localhost:48358/Api/Fake' 相符的 HTTP 資源。",
  "MessageDetail": "找不到與名稱為 'Fake' 的控制器相符的類型。"
}
```

另外一種狀況是呼叫未實作的Http method，在ASP.NET WebApi中，也可以想像成呼叫了不存在的Action(例如ValuesController中只有Get這個Action，當我們用POST方法呼叫時，就會找不到)

```json
{
  "Message": "要求的資源不支援 http 方法 'POST'。"
}
```

針對這兩種狀況，我們可以分別繼承原來的DefaultHttpControllerSelector`與`ApiControllerActionSelector`兩個類別，並且根據錯誤情況進行處理，將找不到Api的錯誤發生時導向自己設定的Error404Controller中來統一處理，也可以在這兩個Selector類別中處理各種不同的StatusCode。

首先我們先寫一個`HttpNotFoundAwareDefaultHttpControllerSelector`類別，繼承自`DefaultHttpControllerSelector`來處理找不到Controller時的狀況：

```csharp
    /// <summary>
    /// HttpNotFound使用自訂Controller的ControllerSelector
    /// </summary>
    public class HttpNotFoundAwareDefaultHttpControllerSelector : DefaultHttpControllerSelector
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="HttpNotFoundAwareDefaultHttpControllerSelector"/> class.
        /// </summary>
        /// <param name="configuration">設定。</param>
        public HttpNotFoundAwareDefaultHttpControllerSelector(HttpConfiguration configuration)
            : base(configuration)
        {
        }

        /// <summary>
        /// 為指定的 <see cref="T:System.Net.Http.HttpRequestMessage" /> 選取 <see cref="T:System.Web.Http.Controllers.HttpControllerDescriptor" />。
        /// </summary>
        /// <param name="request">HTTP 要求的訊息。</param>
        /// <returns>
        /// 指定之 <see cref="T:System.Net.Http.HttpRequestMessage" /> 適用的 <see cref="T:System.Web.Http.Controllers.HttpControllerDescriptor" /> 執行個體。
        /// </returns>
        public override HttpControllerDescriptor SelectController(HttpRequestMessage request)
        {
            HttpControllerDescriptor decriptor = null;
            try
            {
                decriptor = base.SelectController(request);
            }
            catch (HttpResponseException ex)
            {
                setErrorController(request, ex);

                decriptor = base.SelectController(request);
            }
            return decriptor;
        }

        private static void setErrorController(HttpRequestMessage request, HttpResponseException ex)
        {
            var code = ex.Response.StatusCode;
            var routeValues = request.GetRouteData().Values;
            routeValues["controller"] = "Error";
            if (code == HttpStatusCode.NotFound)
            {
                routeValues["controller"] = "Error404";
            }
            else
            {
                routeValues["controller"] = "ErrorOthers";
                routeValues["id"] = code;
            }
            routeValues["action"] = "Get";
            request.Method = HttpMethod.Get;
        }
    }
```

接著建立HttpNotFoundAwareControllerActionSelector類別，繼承自ApiControllerActionSelector來處理找不到Action(或HttpMethod錯誤)時的狀況：

```csharp
    /// <summary>
    /// HttpNotFound使用自訂Controller的ApiActionSelector
    /// </summary>
    public class HttpNotFoundAwareControllerActionSelector : ApiControllerActionSelector
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="HttpNotFoundAwareControllerActionSelector"/> class.
        /// </summary>
        public HttpNotFoundAwareControllerActionSelector()
        {
        }

        /// <summary>
        /// 為 <see cref="T:System.Web.Http.Controllers.ApiControllerActionSelector" /> 選取動作。
        /// </summary>
        /// <param name="controllerContext">控制器內容。</param>
        /// <returns>
        /// 選取的動作。
        /// </returns>
        public override HttpActionDescriptor SelectAction(HttpControllerContext controllerContext)
        {
            HttpActionDescriptor decriptor = null;
            try
            {
                decriptor = base.SelectAction(controllerContext);
            }
            catch (HttpResponseException ex)
            {
                setErrorController(controllerContext, ex);
                decriptor = base.SelectAction(controllerContext);
            }
            return decriptor;
        }

        private static void setErrorController(HttpControllerContext controllerContext, HttpResponseException ex)
        {
            var controllerName = "Error404";
            var code = ex.Response.StatusCode;
            var routeValues = controllerContext.RouteData.Values;
            if (code != HttpStatusCode.NotFound && code != HttpStatusCode.MethodNotAllowed)
            {
                controllerName = "ErrorOthers";
                routeValues["id"] = code;
            }
            routeValues["action"] = "Get";
            controllerContext.Request.Method = HttpMethod.Get;

            IHttpController httpController = new Error404Controller();
            controllerContext.Controller = httpController;
            controllerContext.ControllerDescriptor = new HttpControllerDescriptor(controllerContext.Configuration,
                controllerName, httpController.GetType());
        }
    }
```

接下來我們要設計處理錯誤的Error404Controller和ErrorOthersController。內容都很簡單

- Error404Controller.cs

```csharp
    public class Error404Controller : ApiController
    {
        public object Get()
        {
            throw new Exception("找不到此API");
        }
    }
```

- ErrorOthersController.cs

```csharp
    public class ErrorOthersController : ApiController
    {
        public object Get(int id)
        {
            return new HttpStatusCodeResult(id);
        }
    }
```

最後記得到`WebApiConfig.cs`中把處理Controller跟Action的Selector換成我們自訂的類別，就大功告成啦！

```csharp
config.Services.Replace(typeof(IHttpControllerSelector), new HttpNotFoundAwareDefaultHttpControllerSelector(config));
config.Services.Replace(typeof(IHttpActionSelector), new HttpNotFoundAwareControllerActionSelector());
```

當呼叫的Api不存在時(Api不存在或Method有誤等等)，就會回傳我們預期格式的JSON內容

```json
{
  "StatusCode": 400,
  "Result": null,
  "Error": {
    "ErrorId": "",
    "Message": "找不到此API"
  }
}
```

整個針對WebApi回傳資料格式一致的處理方法差不多到這邊就完成了，整個專案的source code可以到我的GitHub下載。

https://github.com/wellwind/WebApiCustomResponseDemo

如果只想看程式碼片段我也整理到gist上了。

https://gist.github.com/wellwind/11a22b1a4f6fdad13f9e

之後若是有發現其他預期外的狀況，再來更新文章囉。