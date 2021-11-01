---
title: "[C#]Observer Pattern到Delegate和Event"
date: 2016-05-22 22:02:43
tags:
    - C#
    - Design Pattern
    - Observer Pattern
    - Delegate
    - Event
---

關於C#的delegate和event，我個人一直覺得是比較不好理解的部分，雖然直接使用別人設計好的功能時覺得很方便，但要自己使用delegate或event時總是不太順手；雖然過去曾經因為必須使用delegate奮鬥了一段時間，但幾年沒有用到後就又不太熟了XD。所以這篇文章就來從觀念開始紀錄一下delegate和event這兩個神奇的玩意。

<!-- more -->

會忽然想到好久不見的delegate和event其實是因為昨天去上了Skiltree的[物件導向實作課程(使用C#)](https://skilltree.my/events/ecba)，雖然目前只上了第一天，而第一天的課程內容主要都偏向C#語言的使用注意事項及技巧，對於好歹也用了好幾年C#的話我來說大部分的內容都不算太新，但也多學到了一些更深入的原理和講師的經驗，而當天課堂最後的主題就是delegate和event，瞬間讓我回憶起過去使用這個東西時的痛苦學習歷程XD

不過經過練習後也算是重新熟悉並再次理解到了delegate和event的特色，所以就趁著記憶猶新時來紀錄一下。

言歸正傳，讓我們先來假設一個模擬的情境：

{% note info %}

假設你的公司開發了一個溫度監測的機器，可以連接到各種裝置上；公司希望其他外部開發人員也可以利用這個溫度監測器來撰寫自己的應用程式；而你的工作就是開發一組.Net的SDK，當偵測到溫度變化時，能立即讓所有使用SDK的程式收到即時的溫度通知。

{% endnote %}

# 使用Observer Pattern(觀察者模式)

在這種情境下，通常我們可能會考慮到使用Observer Pattern來解決問題，關於Observer Pattern網路上其實可以找到很多的資料，所以這邊就簡單節錄一下[Wiki上對Observer Pattern的解釋](https://zh.wikipedia.org/wiki/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)：

{% cq %}

觀察者模式是軟體設計模式的一種。在此種模式中，一個目標物件管理所有相依於它的觀察者物件，並且在它本身的狀態改變時主動發出通知。這通常透過呼叫各觀察者所提供的方法來實現。此種模式通常被用來實時事件處理系統

{% endcq %}

白話的說就是，我是個很親民的**超級巨星(目標物件)**，所以針對所有在**追蹤我的粉絲(觀察者物件)**，我都會很開心的**主動通知**這些粉絲我最新的動態啦！

至於要如何實現Observer Pattern，就直接來看看程式碼吧，首先我們先定義兩個interface來描述對於溫度監測器的監測和通知的行為

```csharp
    // ITempatureMonitorSubject.cs
    public interface ITempatureMonitorSubject
    {
        void RegisterObserver(ITempatureMonitorObserver observer);

        void UnregisterObserver(ITempatureMonitorObserver observer);

        void NotifyTempature();
    }

    // ITempatureMonitorObserver.cs
    public interface ITempatureMonitorObserver
    {
        void OnTempatureChanged(double tempature);
    }
```

第一個`ITempatureMonitorSubject`介面就是我們的目標物件行為的描述，他主要提供三個行為，分別為

-   RegisterObserver(ITempatureMonitorObserver observer)：提供給觀察者讓目標物件知道要通知自己的方法
-   UnregisterObserver(ITempatureMonitorObserver observer)：當觀察者不再需要從目標物件收到通知時，可以利用此方法取消
-   NotifyTempature()：當目標物件有更新需要通知所有觀察者時，需透過此方法進行通知

而`ITempatureMonitorObserver`介面則描述觀察者的用來接受通知的行為，也就是當目標物件發出通知時，會主動去呼叫每個實作ITempatureMonitorObserver的物件的OnTempatureChanged方法，而隨著每個觀察者實作方式的不同，就會有各自不同的行為反應囉。

接下來我們就來看看溫度監測器實作ItempatureMonitorSubject的樣貌

```csharp
    public class TempatureMonitorSubject : ITempatureMonitorSubject
    {
        private double tempature;

        public double Tempature
        {
            get { return tempature; }
            set
            {
                var oldTempature = tempature;
                if (oldTempature != value)
                {
                    tempature = value;
                    NotifyTempature();
                }
            }
        }

        private List<ITempatureMonitorObserver> observers;

        public TempatureMonitorSubject()
        {
            observers = new List<ITempatureMonitorObserver>();
            Console.WriteLine("開始偵測溫度");
        }

        public void RegisterObserver(ITempatureMonitorObserver observer)
        {
            observers.Add(observer);
        }

        public void UnregisterObserver(ITempatureMonitorObserver observer)
        {
            observers.Remove(observer);
        }

        public void NotifyTempature()
        {
            foreach (var observer in observers)
            {
                observer.OnTempatureChanged(tempature);
            }
        }
    }
```

在這段程式碼裡面我們定義了一個`List<ITempatureMonitorObserver> observers`來存放所有要觀察自己的觀察者物件，而這些物件都必須實作ITempatureMonitorObserver裡面的行為，然後`RegisterObserver`和`RegisterObserver`負責**將觀察者加入或移除觀察者清單**，`NotifyTempature`則負責**列舉所有的觀察者並呼叫(通知)他們的`OnTempatureChanged`告知溫度變化**。當溫度Tempature變化時，就會**呼叫NotifyTempature方法進行通知**。

藉由以上的程式碼我們應該不難看出，只要任何一個物件實做了ITempatureMonitorObserver介面，經由TempatureMonitorSubject註冊後，當TempatureMonitorSubject溫度變化時就可以收到通知，接下來我們就寫兩個實作ITempatureMonitorObserver的觀察者範例來模擬兩個可以收到溫度變化的裝置上的應用程式：

```csharp
    // DesktopApp.cs
    public class DesktopApp : ITempatureMonitorObserver
    {
        public void OnTempatureChanged(double tempature)
        {
            Console.WriteLine($"Desktop App被通知溫度變化了: {tempature}");
        }
    }

    // MobileApp.cs
    public class MobileApp : ITempatureMonitorObserver
    {
        public void OnTempatureChanged(double tempature)
        {
            Console.WriteLine($"Mobile App被通知溫度變化了: {tempature}");
        }
    }
```

以上程式碼我們寫了兩個類別實作ITempatureMonitorObserver介面的行為，並各自有不同的實作內容，當目標物件發出通知時，收到通知的觀察者就會執行自己的實作結果囉。

接著就寫隻小程式來測試看看：

```csharp
// 使用一般Observer pattern
Console.WriteLine("Observer Pattern Demo");
var tempatureMonitor = new TempatureMonitorSubject();

var desktopApp = new DesktopApp();
var mobileApp = new MobileApp();

tempatureMonitor.RegisterObserver(desktopApp);
tempatureMonitor.RegisterObserver(mobileApp);

Console.WriteLine("溫度變化了，現在是30.5度");
tempatureMonitor.Tempature = 30.5;

Console.WriteLine("溫度沒變化，現在依然是30.5度");
tempatureMonitor.Tempature = 30.5;

Console.WriteLine("溫度變化了，現在是28.6度");
tempatureMonitor.Tempature = 28.6;

Console.WriteLine("mobileApp不再想觀察了");
tempatureMonitor.UnregisterObserver(mobileApp);

Console.WriteLine("溫度變化了，現在是27.6度");
tempatureMonitor.Tempature = 27.6;
Console.WriteLine();
```

這個範例程式我們建立了兩個不同的觀察者實作的實體(desktopApp和mobileApp)，並註冊給tempatureMonitor，然後模擬溫度變化的情況，來看看觀察者是否會收到通知並且執行他們各自的實作，程式執行的結果如下：

{% asset_img observer-result.png %}

有了對Observer Pattern的理解後，接下來我們再來看看重頭戲：delegate和event

# 使用Delegate

delegate是**委派**的意思，至於到底要委派什麼？在C#中，我們必須**先用delegate宣告一個方法的簽章(及回傳值和參數)作為要委派的類別**，這個方法物件就類似一個_觀察者模式的目標物件_，不過不太一樣的是，前面我們的觀察者註冊都是直接傳遞物件，而_delegate傳遞的則是**方法**(也就是要委派的方法)_，同時delegate還override了幾個運算子，讓我們在註冊和取消註冊時更加容易，我們可以**直接透過=、+=和-=來設定、增加和移除要委派的方法(觀察者)**，當目標物件變動時，則**使用Invoke()方法來通知執行所有加入的委派方法**。

用文字形容感覺有點難懂，讓我們直接看程式碼，下面程式碼類似我們的觀察者目標物件的實作，但我們使用delegate來作為我們的目標物件：

```csharp
    public partial class TempatureMonitorUsingDelegate
    {
        public delegate void TempatureChangedHandler(double tempature);

        public TempatureChangedHandler OnTempatureChanged;

        private double tempature;

        public double Tempature
        {
            get { return tempature; }
            set
            {
                var oldTempature = tempature;
                if (oldTempature != value)
                {
                    tempature = value;
                    OnTempatureChanged.Invoke(value);
                }
            }
        }

        public TempatureMonitorUsingDelegate()
        {
            // 使用delegate必須給定一個初始的委派方法
            OnTempatureChanged = tempatureChanged;
        }

        private void tempatureChanged(double tempature)
        {
            Console.WriteLine($"溫度發生變化了...{tempature}");
        }
    }
```

首先我們宣告`delegate void TempatureChangedHandler(double tempature)`說明要委派的方法簽章，然後依這個TempatureChangedHandler作為類別宣告`TempatureChangedHandler OnTempatureChanged`的委派方法，然後在建構子中給予他初始的委派方法(這是delegate規定一定要的)，在Tempature變動時，直接使用`OnTempatureChanged.Invoke(value)`來執行所有委派進來的方法，在這裡我們就沒有實作觀察者模式中註冊和移除的方法，因為delegate已經幫我們先做好了。

直接來看使用delegate委派的方式

```csharp
// 使用Delegate完成Observer pattern
Console.WriteLine("Delegate Demo");
var tempatureMonitorDelegate = new TempatureMonitorUsingDelegate();

tempatureMonitorDelegate.OnTempatureChanged += desktopApp.OnTempatureChanged;
tempatureMonitorDelegate.OnTempatureChanged += mobileApp.OnTempatureChanged;

Console.WriteLine("溫度變化了，現在是30.5度");
tempatureMonitorDelegate.Tempature = 30.5;

Console.WriteLine("溫度沒變化，現在依然是30.5度");
tempatureMonitorDelegate.Tempature = 30.5;

Console.WriteLine("溫度變化了，現在是28.6度");
tempatureMonitorDelegate.Tempature = 28.6;

Console.WriteLine("mobileApp不再想觀察了");
tempatureMonitorDelegate.OnTempatureChanged -= mobileApp.OnTempatureChanged;

Console.WriteLine("溫度變化了，現在是27.6度");
tempatureMonitorDelegate.Tempature = 27.6;
Console.WriteLine();
```

在這裡大致上與前面的做法相同，只是把觀察者註冊給目標物件的方法換成了針對目標物件提供的委派物件，把要委派的方法加給它，程式碼執行如下

{% asset_image delegate-result.png %}

delegate是event的基礎，也因此在實際寫程式時，我們其實會使用event多於delegate，Visual Studio的IDE對event也有比較多的神奇支援，所以最後壓軸我們就來看看event吧！

# 使用Event

如果開發過WinForm或傳統ASP.NET程式的話，應該對event一點都不陌生，當我們拉出一個button然後去選擇實作它的OnClick方法時，其實就是在實作一個OnClick事件的委派方法；要使用事件時，必須先宣告一個委派，然後再宣告事件，最後再把要委派的事件方法加入事件之中。以剛剛delegate範例的程式碼來說，原本的宣告`public TempatureChangedHandler OnTempatureChanged`可以直接加個event改成`public event TempatureChangedHandler OnTempatureChanged`，即可享受到Visual Studio對event額外支援的好處，什麼樣的額外支援呢？當我們輸入程式碼時輸入到`tempatureMonitorDelegate.OnTempatureChanged +=`時，原本要給一個實作的方法，但我們**可以直接按TAB來自動產生一個事件委派方法**，例如以下畫面

{% asset_image event-001.png %}

當按下TAB時，就會自動幫我們產生基本的程式碼：

{% asset_image event-002.png %}

這在一些簡單的情境下非常的方便好用！

最後我們來看看使用Event來完成我們的溫度偵測器的SDK，使用delegate在使用event來宣告其實有點麻煩，好在.net framework幫我們先做了一個`delegate void EventHandler<TEventArgs>`來直接使用，它的宣告簽章如下：

```csharp
public delegate void EventHandler<TEventArgs>(object sender, TEventArgs e);
```

所以我們使用事件版本的溫度監視器程式碼如下：

```csharp
    public class TempatureMonitorUsingEvent
    {
        // 使用EventHandler<T>來省去自訂delegate的麻煩
        public event EventHandler<double> OnTempatureChanged;

        private double tempature;

        public double Tempature
        {
            get { return tempature; }
            set
            {
                var oldTempature = tempature;
                if (oldTempature != value)
                {
                    tempature = value;
                    if (OnTempatureChanged != null)
                    {
                        OnTempatureChanged(this, value);
                    }
                }
            }
        }
    }
```

可以看到原本兩行要先宣告delegate再用delegate的類別宣告委派物件，變成了只有一行，且**和delegate不同的是，event不需要一個初始的委派方法(或者說event幫你把這部分處理掉了)**，因此我們不用再多寫一個委派方法在建構式時指派給事件，整個程式碼就清爽多了，當溫度變化時，我們**直接呼叫OnTempatureChanged(this, value)來通知所有的事件委派方法(觀察者)來執行對應的方法**。

{% note info %}

由於event不用給予初始的委派方法，因此在事件通知時，我們必須先檢查定義的事件物件是否為null，以免沒人觀察時出錯了。

{% endnote %}

為了維持我們前面的設計思維，我們另外建立了一個自訂事件方法的行為介面

```csharp
    public interface ITempatureMonitorEvent
    {
        void OnTempatureChangedEvent(object sender, double e);
    }
```

然後原本的DesktopApp與MobileApp都再實作這個介面：

```csharp
    // DesktopApp.cs
    public class DesktopApp : ITempatureMonitorObserver, ITempatureMonitorEvent
    {
        public void OnTempatureChanged(double tempature)
        {
            Console.WriteLine($"Desktop App被通知溫度變化了: {tempature}");
        }

        public void OnTempatureChangedEvent(object sender, double tempature)
        {
            Console.WriteLine($"Desktop App使用事件委派方法得知溫度變化了: {tempature}");
        }
    }

    // MobileApp.cs
    public class MobileApp : ITempatureMonitorObserver, ITempatureMonitorEvent
    {
        public void OnTempatureChanged(double tempature)
        {
            Console.WriteLine($"Mobile App被通知溫度變化了: {tempature}");
        }

        public void OnTempatureChangedEvent(object sender, double tempature)
        {
            Console.WriteLine($"Mobile App使用事件委派方法得知溫度變化了: {tempature}");
        }
    }
```

接著看看實際測試的程式碼：

```csharp
private static void eventDemo()
{
    // 使用Event事件委派
    Console.WriteLine("Event Demo");
    var tempatureMonitorEvent = new TempatureMonitorUsingEvent();

    tempatureMonitorEvent.OnTempatureChanged += desktopApp.OnTempatureChangedEvent;
    tempatureMonitorEvent.OnTempatureChanged += mobileApp.OnTempatureChangedEvent;
    // 額外自訂事件委派方法, 由於是宣告成事件委派, 輸入到+=時可以直接用TAB產生基本的程式碼
    tempatureMonitorEvent.OnTempatureChanged += TempatureMonitorEvent_OnTempatureChanged;

    Console.WriteLine("溫度變化了，現在是30.5度");
    tempatureMonitorEvent.Tempature = 30.5;

    Console.WriteLine("溫度沒變化，現在依然是30.5度");
    tempatureMonitorEvent.Tempature = 30.5;

    Console.WriteLine("溫度變化了，現在是28.6度");
    tempatureMonitorEvent.Tempature = 28.6;

    Console.WriteLine("mobileApp不再想觀察了");
    tempatureMonitorEvent.OnTempatureChanged -= mobileApp.OnTempatureChangedEvent;

    Console.WriteLine("溫度變化了，現在是27.6度");
    tempatureMonitorEvent.Tempature = 27.6;
    Console.WriteLine();
}

private static void TempatureMonitorEvent_OnTempatureChanged(object sender, double e)
{
    Console.WriteLine($"自訂的委派方法得知溫度變化了: {e}");
}
```

在這裡除了使用事件委派方法以外，我們也額外再加入了一個自訂的委派方法，在Visual Studio中實際上當我輸入到**+=**的時候，就可以用TAB來直接產生委派方法的雛形，非常的方便。

執行結果如下：

{% asset_img event-result.png %}

本篇文章的範例程式碼都已經放上GitHub，感興趣的朋友可以上去[下載](https://github.com/wellwind/CSharpEventDemo)。

https://github.com/wellwind/CSharpEventDemo

# 回顧一下

-   當我們需要設計一個當物件狀態改變時能夠主動通知相依的物件的程式時，可以使用觀察者模式。
-   delegate幫我們簡化了觀察者模式的程式碼，但delegate委派的目標必須是方法，因此若通知的條件單純時，可以使用delegate來簡化程式碼；delegate必須要有預設的委派方法。
-   event算是delegate的延生，它的設計再次簡化了一些delegate的宣告不便，讓程式碼更容易閱讀(個人覺得event也比delegate好讀多了)，也更簡化；同時還能享受到IDE帶來額外支援的好處！(event不需要給予預設的委派方法)