---
title: "[C#] Rx.NET 筆記 (不定時更新)"
date: 2021-04-17 09:47:02
tags:
  - ReactiveX
  - Rx.NET
---

最近在專案中開始使用 Rx.NET 了，剛開始有些不太適應，不過大致熟悉後，寫起來還是很過癮，不輸給使用 RxJS，以下做一些簡單的筆記，讓對 Rx.NET 有興趣的朋友能快速上手。

因為之前都是寫 RxJS 居多，也會有一些跟 RxJS 的比較，不過主軸還是以 Rx.NET 為主。

<!-- more -->

# 安裝 Rx.NET

v3.0 之後的套件名稱為 `System.Reactive.*`，從 NuGet 安裝只要搜尋 `System.Reactive` 即可，目前最新版本為 5.0.0。

- 使用 .NET CLI

```shell
dotnet add package System.Reactive
```

- 使用 Package Manager

```powershell
Install-Package System.Reactive
```

# Chain 非 Pipe

在 RxJS 中我們會用 `pipe()` 來串接多個 operators，對於前端來說這樣最大的好處是便於 tree shaking，而 Rx.NET 基本上沒 tree shaking 的困擾，同時也為了符合 LINQ 操作的感覺，所以都是用 chain 的方式，一個一個用 `.` 去接下一個 operator。

```csharp
var subscription = source
    .Where(user => user.Age >= 18)
    .Select(data => data.Name)
    .Subscribe(data => { Console.WriteLine(data.Name) });
```

每一個 operator 都是 `IObservable` 的 extension method。

# 觀察者 Observer

呼叫 `Subscribe` 訂閱後，一樣是提供 3 個 callback function，依次是 `OnNext`、`OnError` 和 `OnCpmplete`；必須照順序撰寫，只有 OnNext 的時候其他可以省略不寫。

```csharp
var subscription = source
    .Subscribe(
        data => { Console.WriteLine(data.Name); }, // OnNext callback
        error => { Console.WriteLine("Error"); }, // OnError callback
        () => { Console.WriteLine("Complete"); }
    );
```

# 取消訂閱

在 RxJS 我們會用 `.unsibscribe()` 來取消訂閱一個 Subscription，而在 Rx.NET 內名稱為 `Dispose()`，算是對齊 .NET 處理物件的習慣。

```csharp
var subscription = source.Subscribe(Console.WriteLine);
subscription.Dispose();
```

# 建立 Observable

## Observable.Return

對應到 RxJS 的 `of`

```csharp
Observable
    .Return(1)
    .Subscribe(Console.WriteLine);
```

## Observable.FromEventPattern

當需要整合別人寫的 Library 使用 event 時很有機會用到

```csharp
private event EventHandler<int> MyEvent;

public void MyFunc()
{
    var source = Observable.FromEventPattern<int>(
        addHandler => MyEvent += addHandler,
        removeHandler => MyEvent -= removeHandler);

    var subscription = source
        .Select(data => data.EventArgs)
        .Filter(result => result > 0)
        .Subscribe(Console.WriteLine);

    subscription.Dispose();
}
```

## Observable.Timer / Observable.Interval

名稱都跟 RxJS 使用一樣，但傳入的時間可以用 .NET 內建的 TimeSpan，可讀性好多了

```csharp
Observable
    .Timer(TimeSpan.FromSeconds(1.5), TimeSpan.FromSeconds(0.5))
    .Take(5)
    .Subscribe(Console.WriteLine);
```

在 Rx.NET 內所有 Operators 只要設定時間參數都可以使用 .NET 內建的 TimeSpan

```csharp
Observable
    .Return("Mike")
    .Delay(TimeSpan.FromSeconds(1))
    .Subscribe(Console.WriteLine);
```

## Hot Observable - Subject 系列

這部分使用上基本跟 RxJS 習慣一樣

```csharp
var subject = new Subject<int>();
var behaviorSubject = new BehaviorSubject<int>("test");
var replaySubject = new ReplaySubject<int>(1);
```

有一個很大的重點是一定要指定型別，因為 C# 是強型別語言，直接 `new Subject()` 不指定型別的話編譯是不會過的。

當有新的事件要送出時，使用 `OnNext`、`OnError` 和 `OnCompleted`。

```csharp
var subject = new Subject<int>();
subject.OnNext(1);
subject.OnNext(2);
subject.OnNext(3);

subject.OnError(new Exception("Error"));

subject.OnCompleted();
```

## Cold Observable

使用 `Observable.create` 建立新的 cold observable

```csharp
Observable
    .Create<int>(observer =>
    {
        observer.OnNext(1);
        observer.OnNext(2);
        observer.OnCompleted();
        return Disposable.Empty;
    });
```

最後要回傳一個「訂閱取消時的處理方法」，這裡回傳 `Disposable.Empty` 代表的是不處理 (說穿了，就是一個實作 `Dispose()` 方法但裡面什麼事情都沒做的物件)。

在 RxJS 內沒有強制規定要回傳這個處理方法，但 C# 是強型別語言，因此有設定回傳型別的方法就一定要回傳。

這個「訂閱取消時的處理方法」如果實際要處理，範例如下：

```csharp
var source = Observable
    .Create<int>(observer =>
    {
        observer.OnNext(1);
        observer.OnNext(2);
        return () => { Console.WriteLine("Unsubscribe"); };
    });
    
var subscription = source
    .Subscribe(result => Console.WriteLine(result));

subscription.Dispose();

// 1
// 2
// Unsubscribe
```

# 幾個常用的 Operators

## Select

就是 RxJS 的 `map`，在 Rx.NET 用 Select 是為了對應到 LINQ 的習慣。

```csharp
source.Select(num => num + 1);
```

## Where

RxJS 的 filter，一樣是對應到 LINQ 的習慣

```csharp
source.Where(user => user.Age >= 18);
```

## Do

RxJS 過去也叫做 `do` ，後來改名叫做 `tap`，而在 Rx.NET 內依然叫做 `Do`

```csharp
source
    .Do(value => Console.WriteLine($"Current: {value}")
    .Subscribe();
```

跟 side effect 的操作都盡可能在 `Do` 裡面處理。

## Select + Switch / Merge / Concat

Rx.NET 沒有內建 `switchMap`、`mergeMap`和 `concatMap`，必須先用 `Select` 轉換成目標 Observable，再使用 `Switch`、`Merge`或`Concat`。

```csharp
Observable
    .Range(1, 3)
    // 先用 Select 換成另一個 Observable
    .Select(value => 
        Observable
            .Return(value)
            .Delay(TimeSpan.FromSeconds(value)))
    // 在用 Switch / Merge / Concat 等組合這些 Observable
    .Concat()
    .Subscribe(Console.WriteLine);
```

Rx.NET 沒有實作 `exhaustMap`，必須要自己寫 ([參考寫法](https://stackoverflow.com/questions/64353907/how-can-i-implement-an-exhaustmap-handler-in-rx-net))。

## First / FirstAsync

這個 Operator 本身沒有什麼特別的，但在撰寫 ASP.NET WebAPI 專案時卻有極大的幫助，由於 Observable 都是在 Subscribe 處理，而撰寫 ASP.NET WebAPI 時候是回傳 `IActionResult` 或是直接回傳結果，因此回傳一個 `Observable<T>` 是沒有用的。由於 Observable 本身有 stream 的概念，看起來似乎和 WebAPI 這種一次性回應不搭，但只要用 `First` 就可以轉成非 stream 的結果了。

```csharp
public Student GetStudent(int id)
{
    return studentService
        .GetStudent(id) // 假設 GetStudent 回傳的是一個 Observable
        .First();
}
```

或是使用 `IActionResult`

```csharp
public IActionResult GetStudent(int id)
{
    return StudentService
        .GetStudent(id)
        .Select(student => Ok(student))
        .First();
}
```

會使用到 Observable，通常都是用在非同步的處理上，因此通常使用 `FirstAsyn` 然後搭配 async/await 應該會是比較合理的

```csharp
public async Task<IActionResult> GetStudentAsync(int id)
{
    return await StudentService
        .GetStudent(id)
        .Select(student => Ok(student))
        .FirstAsync();
}
```

使用 `First` 或 `FirstAsync` 只是個範例，重點在把一個 stream 轉為非 stream 的物件，所以依照情境不同，使用 `ToListAsync` 或其他處理方式也是有可能的！

另外，如果規則夠明確，也可以乾脆寫個 Middleware 來處理，那麼就真的只要回傳 Observable 就可以囉！

# 自訂 Operator

Rx.NET 內所有的 Operator 都是擴充方法，擴充 `IObservable` 所以我們也只需要替 `IObservable` 撰寫擴充方法，並回傳一個新的 `IObservable` 即可。

```csharp
public static IObservable<Student> FilterStudnetScore(this IObservable<Student> source, int passScore)
{
    return source.Where(student => student.Score >= passScore)
}
```

# 其他功能

## ToObservable

所有 `IEnumerable` 型別的物件都可以使用 `ToObservable` 擴充方法，幫助我們直接把集合轉換成 Observable，類似 RxJS 的 `from` 但 `from` 可以接受更多來源。

```csharp
(new List<int>() { 1, 3, 5 })
  .ToObservable()
  .Select(value => value + 1)
  .Subscribe(Console.WriteLine);
```

## ToEnumerable

跟 `ToObservable` 剛好相反，把一個 Observable 轉換成 `IEnumerable` 集合，類似 RxJS 的 `toArray`

```csharp
Observable
    .Interval
    .ToEnumerable();
```

## ToEvent / ToEventPattern

一樣跟其他 libraries 整合時有機會用到，將 Observable 轉換成 event。

# 幾個 Resources

* [Rx.NET GitHub](https://github.com/dotnet/reactive)
* [Introduction to Rx](http://introtorx.com/) → 對於快速上手蠻值得閱讀的
* [Rx應用](https://gihomn.blogspot.com/2017/04/rxing.html)https://gihomn.blogspot.com/2017/04/rxing.html)