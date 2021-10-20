---
title: C# 7新語法預覽
date: 2016-04-05 20:44:27
tags:
    - C#
    - Build 2016
---

[Build 2016](https://build.microsoft.com/)過後微軟投出了很多讓開發人員感到驚豔的震撼彈，像是Win10未來可以run原生的使用linux指令，Xamrian免費等等。趁著連假也惡補了幾段內容，其中「[The Future of C#](https://channel9.msdn.com/Events/Build/2016/B889)」談到了一些未來C# 7的新語法，讓人感到滿興奮的，因此在這邊做個簡單的紀錄。

<!-- more -->

有興趣的話可以看看[The Future of C#的demo影片](https://channel9.msdn.com/Events/Build/2016/B889)，非常精采！

{% asset_img the-future-of-csharp.png %}



{% note info %}

本篇所撰寫的C#7語法皆沒有實際貼到Visual Studio裡面編譯過，只是提出用法說明而已。

{% endnote %}

# Binary literals

C# 7可以使用2進位的方式來表示數值內容，如同使用0xXX來表示16進位，現在也可以使用0bXX的方式來表示2進位數字。

例如過去我們宣告int number = 8;現在則可以改成int number = 0b1000;的方式來表達。

```csharp
int num1 = 8;
int num2 = 0b1000;
Console.WriteLine($"Num1 = {num1}");
Console.WriteLine($"num2 = {num2}");
// 結果為
// Num1 = 8
// Num2 = 8
```

# Digit separators

當宣告一個很多位數的數字時，我們可以使用底線(\_)分隔數字來增加一定程度的可讀性，應用上則可以把它當作千分號來看待，如同比起閱讀1000000000，加上千份號的1,000,000,000比較容好讀。在宣告時可以變成宣告`int num = 1_000_000_000;`；這樣多少可以增加一點可讀性。

當然這個數字分隔符號不一定要當作千分號使用，你可以用任意的方式分隔數字，也不限制分隔符號只能使用一次，因此以下宣告結果都是一樣的：

```csharp
// 傳統宣告方式
int num1 = 1000000;
// 當千份號使用
int num2 = 1_000_000;
// 隨便使用
int num3 = 1_00_00_00;
int num4 = 1__000___000;
```

當然啦如果隨意使用的話，可能反而會大幅降低可讀性就是了XD

# Tuples

過去如果一個function想要有多個回傳值的話，有兩種方法，一種是把要接受回傳的資料當作參數丟到function裡面，並加上out代表參數用來作為回傳值：

```csharp
        void GetHeightAndWeight(out int height, out int weight)
        {
            height = 172;
            weight = 80;
        }

        void OutputBody()
        {
            int height, weight;
            getHeightAndWeight(out height, out weight);
            Console.WriteLine($"Height = {height}");
            Console.WriteLine($"Weight = {weight}");
            // Height = 172
            // Weight = 80
        }
```

另一種方法是使用[Tuple類別](https://msdn.microsoft.com/zh-tw/library/system.tuple(v=vs.110).aspx)：

```csharp
        Tuple<int, int> GetHeightAndWeight()
        {
            var returnVal = new Tuple<int, int>(172, 80);
            return returnVal;
        }

        void OutputBody()
        {
            var body = GetHeightAndWeight();
            Console.WriteLine($"Height = {body.Item1}");
            Console.WriteLine($"Weight = {body.Item2}");
            // Height = 172
            // Weight = 80
        }
```

而針對Tuple類別，C# 7又額外提供了更容易撰寫的語法糖來使用，可以寫成這樣：

```csharp
// 用括弧的方式直接代表Tuples
(int, int) GetHeightAndWeight(){
    var returnVal = (172, 80)
    return returnVal;
}

void OutputBody(){
    var body = GetHeightAndWeight();
    WriteLine("Height = {body.Item1}");
    WriteLine("Weight = {body.Item2}");
    // Height = 172
    // Weight = 80
}
```

不過Tuple其實最大的問題是Item1, Item2這樣的內容可讀性很差，因此C# 7也可以在宣告Tuples時，自訂一個名稱變數，之後就可以直接取用這個自訂的變數名稱了！

```csharp
void OutputBody(){
    // 用自訂名稱來取代Tuple的Item1, Item2
    var body = (Height: 172, Weight: 80);
    WriteLine("Height = {body.Height}");
    WriteLine("Weight = {body.Weight}");
    // Height = 172
    // Weight = 80
}
```

# Patten matching

Pattern matching主要是用來減少型別檢查時所需撰寫的程式碼，例如我們有一個object陣列，想要加總陣列裡面的整數部分時，過去我們程式碼會寫成這樣：

```csharp
        static void Main(string[] args)
        {
            object[] numbers = { "a", 1, 2, "b", new object[] { 3, 4, 5 }};
            Console.WriteLine(sum(numbers));
        }

        static int sum(IEnumerable<object> list)
        {
            var result = 0;
            foreach(var val in list)
            {
                if (val is int)
                {
                    var num = (int)val;
                    result += num;
                }
            }
            return result;
        }
```

在sum函數裡的foreach迴圈中我們又要檢查型別又要進行轉型，其實是有點麻煩的，而在C# 7則可以用更簡易的寫法：

```csharp
if (val is int num)
{
    result += num;
}
```

如此即可把型別檢查和轉型寫成一行，除此之外pattern matching也可以寫在switch裡面，另外在型別檢查時，還可以使用`when`限定條件：

```csharp
        static int sum(IEnumerable<object> list)
        {
            var result = 0;
            foreach(var val in list)
            {
                switch(val)
                {
                    case int num:
                        result += num
                    break;
                    case IEnumerable<object> l when l.Any(): // 使用when做額外的條件限定
                        result += sum(l);
                    break;
                }
            }
            return result;
        }
```

# Local functions

在C# 7裡面我們可在function裡面再包含一個local function，這個local function的可見範圍就只有目前function而已。

```csharp
void func1()
{
    // local function
    int func2()
    {
        return 0;
    }
    var result = func2();
    Console.WriteLine($"Call func2() = {result}");
    // Call func2() = 0
}

void func3()
{
   var result = func2(); // 編譯錯誤
}
```

# Ref returns and locals

過去我們可以把變數參考當作function的參數傳入，寫法如下：

```csharp
void FuncRef(ref int data)
{
    // do something
}
```

在C# 7我們也可以直接把變數參考回傳回去了

```csharp
        static void Main(string[] args)
        {
            int[] numbers = { 1, 2, 4 };
            // 回傳的是參考，不是值
            var firstRef = FirtRef(numbers);
        }

        static ref int FirstRef(ref int[] data)
        {
            // 回傳第一筆資料的參考
            return ref data[0];
        }
```

以上就是這次Build 2016所提到的C# 7的新語法，其中Tuples和Pattern matching個人感覺非常的實用，可以省下不少無謂的程式碼；其他語法可能是寫的code不夠多所以感覺不太出來應用方面XD。如果有時間建議直接看[The Future of C#](https://channel9.msdn.com/Events/Build/2016/B889)的影片，約一小時，demo的部分真的非常精彩，值得推薦啊！