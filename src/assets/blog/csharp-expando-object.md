---
title: "[C#]簡介ExpandoObject"
date: 2017-09-10 17:04:47
tags:
  - C#
  - ExpandoObject
  - IDictionary
---

ExpandoObject是.Net Framework 4之後出現的一個類別，可以幫助我們為物件動態的加入或移除屬性成員，今天就來聊聊ExpandoObject的特性及用法。

<!-- more --> 

會注意到ExpandoObject其實只是同事間討論時聊到，得知類似dynamic，不一樣的是dynamic只是編譯時期不做物件是否具有屬性的檢查，改在執行時期才處理，但卻不能動態增加屬性(**因為接收的還是固定的那個物件**)；而ExpandoObject則可以動態的替物件增加或移除屬性，使用上彈性比較大。

原本覺得可以用HashTable做就好了，反正在寫程式碼時無論如何都不會在編譯時期檢查屬性(或是key)的存在，實際看過[MSDN上的ExpandoObject定義](https://msdn.microsoft.com/zh-tw/library/system.dynamic.expandoobject.aspx)後，才發現雖不中亦不遠矣！MSDN上對ExpandoObject的語法定義如下：

```csharp
public sealed class ExpandoObject : IDynamicMetaObjectProvider, 
	IDictionary<string, object>, ICollection<KeyValuePair<string, object>>, 
	IEnumerable<KeyValuePair<string, object>>, IEnumerable, INotifyPropertyChanged
```

可以看到ExpandoObject其實就是實作了`IDictionary<string, object>`，但在使用上會比`Dictionary<string, object>`簡單，另外也實作了INotifyPropertyChanged，在屬性變更時可以更明確地掌握狀態！

不過要注意的是ExpandoObject雖然方便強大，但還是需要配合dynamic語法，才能發揮出它的威力！還有就是使用dynamic會變成"類似弱型別"的寫法，不小心就會造成執行時期的錯誤，不得不防！

# 使用Dictionary&lt;string, object&gt;

先看看使用`Dictionary<string, object>`看起來是什麼樣子？

```csharp
var data = new Dictionary<string, object>();
data.Add("Name", "Wellwind");
data.Add("Age", 30);
data["Sex"] = Sex.Male;

Console.WriteLine("-- Dictionary --");
Console.WriteLine(String.Format("Name={0}", data["Name"]));
Console.WriteLine(String.Format("Age={0}", data["Age"]));
Console.WriteLine(String.Format("Sex={0}", data["Sex"]));
```

執行結果如下：

{% asset_img dictionary-demo.png %}

基本上沒有什麼問題，就是看到一堆key字串比較不舒服而已，ExpandoObject正好可以幫我們解決這個問題！

# 使用ExpandoObject

## 基本用法

透過ExpandoObject，我們可以不必把字串當作key值，而是直接當物件屬性來使用

```csharp	
dynamic data = new ExpandoObject();
data.Name = "Welwid";
data.Age = 30;
data.Sex = Sex.Male;

Console.WriteLine("-- ExpandoObject --");
Console.WriteLine(String.Format("Name={0}", data.Name));
Console.WriteLine(String.Format("Age={0}", data.Age));
Console.WriteLine(String.Format("Sex={0}", data.Sex));
```

執行結果如下：

{% asset_img expando-object-demo.png %}

看到差異了嗎？不知道ExpandoObject的人乍看之下還會以為這段程式碼的ExpandoObject是一個定義好3個屬性的類別，但其實ExpandoObject只是幫我們節省Dicrionary做的事情而已，讓程式碼看起來更舒服！

## 轉換成IDictionary

由於ExpandoObject本身就實作了`IDictionary<string, object>`，因此若是有必要我們也可以直接把它轉型成`IDictionary<string, object>`來操作

```csharp
dynamic data = new ExpandoObject();
data.Name = "Welwid";
data.Age = 30;
// 轉型為IDictionary<string, object>進行操作
(data as IDictionary<string, object>)["Sex"] = Sex.Male;

Console.WriteLine("-- ExpandoObject --");
Console.WriteLine(String.Format("Name={0}", data.Name));
Console.WriteLine(String.Format("Age={0}", data.Age));
Console.WriteLine(String.Format("Sex={0}", data.Sex));
```



## PropertyChanged事件

ExpandoObject也實作了`INotifyPropertyChanged.PropertyChanged`事件，因此我們可以定義PropertyChanhed事件，來監聽屬性(其實就是IDictionary)的變化：

```csharp
dynamic data = new ExpandoObject();

(data as INotifyPropertyChanged).PropertyChanged += (sender, e) =>
{
    Console.WriteLine(String.Format("Property {0} has changed.", e.PropertyName));
};

data.Name = "Welwid";
...
```

執行結果如下：

{% asset_img property-changed-demo.png %}

# 回顧

ExpandoObject幫助我們簡化了部分情境需要使用Dictionary的麻煩，也提供了比較多的擴充，讓我們在使用時更加方便，寫出來的程式碼也比較好理解；在一些物件資料傳遞時，使用ExpandoObject也可以減少我們建立DTO物件的麻煩，但畢竟不是強型別的資料，在使用上還是需要謹慎對待！

程式碼範例：https://github.com/wellwind/ExpandoObjectDemo

# 參考資料

-   https://msdn.microsoft.com/zh-tw/library/system.dynamic.expandoobject(v=vs.110).aspx
-   http://blog.darkthread.net/post-2011-06-10-expandoobject.aspx
