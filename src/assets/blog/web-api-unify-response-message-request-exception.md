---
title: "[ASP.NET WebApi2]統一回傳訊息格式比較完整的處理方法 (4) Request時的Exception處理"
date: 2016-02-24 19:31:40
category: Asp.Net WebApi
tags:
    - WebApi
    - C#
    - Asp.Net
---

在設計ASP.NET相關程式的時候，有時候我們必須在Global.asax中加入一些自訂的程式，例如希望每次Request時只會進行一次資料庫連線的建立，則可以在Application_BeginRequest中建立資料庫連線，然後在Application_EndRequest中將連線dispose掉。而在這個階段的處理若有exception時，之前的系列文章介紹的方法將無法正確處理傳回統一的JSON格式；如果有在Global.asax中做其他的處理，也希望在這裡有exception時可以用統一的方式回傳JSON結果，那們我們必須另外在Global.asax中處理這個錯誤。

<!-- more -->

先假設我們在Global.asax.cs中加入了Application_BeginRequest方法來在Request初期處理一些事情，然後發生Exception的情況：

```csharp
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_BeginRequest()
        {
            throw new Exception("thrown by Application_BeginRequest");
        }
    }
```

這時候測試API就會出現像以下這樣的畫面

{% asset_img webapi3-beginrequest-exception.png %}

如果要在Global.asax中也可以將exception以我們預期的JSON格式回傳，可以加上Application_Error：

```csharp
    protected void Application_Error()
    {
        var exception = Server.GetLastError();
        if (exception == null)
        {
            return;
        }

        object exceptionToSerialize = exception.InnerException ?? exception;
        Response.ContentType = "text/json";
        Response.Write(
            JsonConvert.SerializeObject(
                ExceptionUtils.ConvertToApiResponse((Exception)exceptionToSerialize)));
        Response.End();
    }
```

JsonConvert來自[Json.NET](http://www.newtonsoft.com/json)套件，ExceptionUtils.ConvertToApiResponse是之前的文章提到的將Exception轉為統一的回傳物件的方法。

如此一來就能將錯誤直接透過Response.Write寫回給瀏覽器。再次使用postman來測試時就能夠看到在Global.asax中發生錯誤時回傳我們預期的JSON內容了

```json
{
  "StatusCode": 400,
  "Result": null,
  "Error": {
    "ErrorId": "",
    "Message": "thrown by Application_BeginRequest"
  }
}
```