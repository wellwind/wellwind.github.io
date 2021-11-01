---
title: "[Unity DI]使用Unity針對相同介面但有多個不同實作的注入方法"
date: 2016-02-26 20:38:27
tags:
    - C#
    - Unity
    - DI
---

使用Unity進行相依注入的時候，比較常見都是一個Interface對一個實作的Class，但是需求變得複雜，經過幾次重構後，很可能會拉出一個Interface出來，再由不同的Class去實作它，這時候要進行DI時code改怎麼寫？

<!-- more -->

假設原本有一個校務系統，在登入時必須先檢查是否具有正確的登入身分，之後才可以操作其他相關功能，UML大概會像這樣

{% asset_img uml-sample.png %}

這時候要用DI注入時非常簡單

```csharp
container.RegisterType<IRoleFunctionService, RoleFunctionService>();
```

不過開發到後期，發現系統**需要分成不同的使用身分如「教師、系主任、院長、管理者」**，都需要類似的操作，但又各自不同，於是設計就變成了這樣：

{% asset_img uml-sample-the-problem.png %}

這時候要用Unity做相依注入時問題就發生了

```csharp
// 針對IRoleFunctionService有不同實作時, 該如何決定注入哪個Class?
container.RegisterType<IRoleFunctionService, ?????>();
```

針對這種情況，可以在RegisterType後面指定一個name，來區分不同的實作

```csharp
// TeacherFunctionService, DepartmentFunctionService, CollegeFunctionService, AdminFunctionService
// 由於實作同一個interface, 因此用另外給予name的方法註冊
container.RegisterType<IRoleFunctionService, TeacherFunctionService>("TeacherFunctionService");
container.RegisterType<IRoleFunctionService, DepartmentFunctionService>("DepartmentFunctionService");
container.RegisterType<IRoleFunctionService, CollegeFunctionService>("CollegeFunctionService");
container.RegisterType<IRoleFunctionService, AdminFunctionService>("AdminFunctionService");
```

當遇到需要注入同一個interface但不同實作時，再藉由**Resolve**指定名稱來決定要注入哪一個實作

```csharp
// 藉由指定name的方式取得對應的實作
var service = container.Resolve<IRoleFunctionService>("TeacherFunctionService");
return service.LoadData();
```

如果需要透過建構子注入到別的物件時，可以**在container註冊型別時，使用InjectionConstructor與ResolvedParameter合作注入**

```csharp
// AuthService建構子需要注入4個同樣名稱但不同實作的Interface, 因此用ResolvedParameter加上name的方式解析
container.RegisterType<IAuthService, AuthService>(new InjectionConstructor(
    new ResolvedParameter<IRoleFunctionService>("TeacherFunctionService"),
    new ResolvedParameter<IRoleFunctionService>("DepartmentFunctionService"),
    new ResolvedParameter<IRoleFunctionService>("CollegeFunctionService"),
    new ResolvedParameter<IRoleFunctionService>("AdminFunctionService")));
```

以上，做個紀錄以免以後遇到相同問題又忘記