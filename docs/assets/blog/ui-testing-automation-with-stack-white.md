---
title: "使用TestStack.White進行Windows UI的自動化測試 (1) 基礎篇"
date: 2015-12-22 20:26:07
tags:
    - UI Testing
    - Windows UI Testing
    - 自動化測試
---

本文章將簡單介紹TestStack.White這個Windows UI自動化測試的套件，並對一個簡單的加法器Windows Form程式進行Windows UI的自動化測試。

<!-- more -->

# 前言

前幾個月報名了SkillTree的「[自動測試與 TDD 實務開發](https://skilltree.my/events/mbh)」課程，受到91哥3天的課程洗禮，總算是對Unit Test/TDD/BDD有了比較完整的理解，也終於能夠在實務上使用了，雖然很多部分都還在摸索學習中，但也已經從測試先行這個重要觀念中得到了很多收穫，除了從過去重構時總是綁手綁腳的窘境中解脫之外，開發速度及功能的品質都有所提升。

課堂上91哥對Web的UI Testing介紹花了不少心力，但由於目前工作環境還是有不少系統使用是Windows Form開發，在課程練習中我也詢問了是否有類似Selenium的Windows UI Testing的套件，可惜91哥主要研究的是Web的自動測試因此沒有得到解答，在自己摸索後發現了[TestStack.White](https://github.com/TestStack/White)的個Windows UI的自動化測試套件，雖然不像Selenium可以輕鬆錄製操作腳本並轉成C#測試程式，但對於熟悉Windows Form相關元件的基礎上直接用程式操作Windows Form上的元件也不是太困難。除此之外White也有一個名為Screen Objects的類似Web Testing的Page Object Pattern套件可以將UI操作的邏輯再拉出一層抽象層，降低測試邏輯與操作邏輯的耦合性，之後有時間再研究看看後分享上來。

# 關於TestStack.White

TestStack.White(之後都簡稱為White)是一款將Windows本身具有的UI自動化測試框架「UIAutomation」包裝後的套件，讓Windows UI的測試程式撰寫上更加方便的一個套件，接下來就來簡單介紹一下White的使用方法

# 開始使用TestStack.White

## 要被測試的程式

首先我先建立了一個加法器的專案，並將程式輸出路徑設為C:\temp\，程式名稱為AddCalculator.exe，在之後的測試專案中，我們會在測試程式中自動打開這隻加法器程式，輸入數字並按下計算按鈕，然後驗證產生的結果是否正確。

### 加法器畫面

{% asset_img test-target.png 加法器畫面 %}

"相加"按鈕的程式碼

```csharp
    private void btnAdd_Click(object sender, EventArgs e)
    {
        var result = Convert.ToInt32(txtNum1.Text) + Convert.ToInt32(txtNum2.Text);
        lblResult.Text = result.ToString();
    }
```

從程式畫面與程式碼中可以看出測試專案中如果要驗證結果正確，大概會有幾個步驟

1. 要先把程式執行起來
2. 找到兩個數字的控制項元件，並輸入要測試的數值
3. 找到"相加"按鈕，並讓它觸發Click事件
4. 找到結果的label，檢查內容是否正確

## 完成測試專案

有了基本的程式實作後，接下來我們就可以直接建立一個測試專案，並透過NuGet套件管理加入TestStack.White套件。

```powershell
install-package TestStack.White
```

然後新增一個測試類別，並加入以下程式碼

```csharp
    [TestClass]
    public class CalculatorFormUITest
    {
        private Application application { get; set; }
        private Window window { get; set; }

        [TestInitialize]
        public void TestInitialize()
        {
            var applicationPath = "C:\\temp\\AddCalculator.exe";
            application = Application.Launch(applicationPath);
            window = application.GetWindow("加法器", InitializeOption.NoCache);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            application.Close();
        }
    }
```

application與window的宣告是用來存放開啟的應用程式與視窗資料，這兩個變數會在TestInitialize時取得，在TestInitialize中，首先會先使用`Application.Launch()`來開啟我們的執行檔，接著利用`application.GetWindow()`來取得我們要測試的視窗內容。`application.GetWindow()`的第一個參數是**視窗的標題**。

TestCleanup做的事情很簡單，就是把視窗關掉而已。

TestInitialize與TestCleanup的內容可以讓我們在每次測試開始時先把要測試的視窗打開，測試結束後將視窗關掉；接下來就新增一個測試方法，來**模擬UI的操作與驗證結果**：

```csharp
    [TestMethod]
    public void TestMedthod_Num1_Is_3_And_Num1_Is_5_Then_Result_Is_8()
    {
        // Arrange
        var txtNum1 = window.Get<TextBox>("txtNum1");
        txtNum1.Text = "3";

        var txtNum2 = window.Get<TextBox>("txtNum2");
        txtNum2.Text = "5";

        var expected = "8";

        // Act
        var button = window.Get<Button>("btnAdd");
        button.Click();

        // Assert
        var lblResult = window.Get<Label>("lblResult");
        var actual = lblResult.Text;

        Assert.AreEqual(expected, actual);
    }
```

再Arrange中，我們使用`window.Get<控制項類別>("元件名稱")`來取得要被設定數值的元件及內容，之後在Act時透過一樣使用window.Get方法取得要被按下去的按鈕，只是Type改為Button以及正確的元件名稱，最後再Assert則抓取顯示結果的Lable，然後檢查結果是否和預期相同。

之後再執行這個測試方法，就可以看到像下圖的結果

{% asset_img ui-testing-result.gif 測試結果 %}

測試程式會自動執行已經開發好的Windows Form，找到對應控制項模擬行為，然後驗證結果！

相關程式碼可以到這裡下載: https://github.com/wellwind/WhiteUiTestingSamples/tree/master/Sample01

# 結語

本篇文章簡單介紹了使用TestStack.White來對Windows From進行自動化測試的部分，透過直接尋找UI名稱的方式找到對應的元件並自動操作元件的行為，然後測試行為發生後的結果是否正確。

利用一個簡單的加法器程式來表示我們實際要測試的複雜UI，然後在測試專案中找到對應的控制項，並針對實際操作的行為做模擬，最後檢查操作結果的正確性。

White具有許多搜尋UI元件的功能，可以讓我們在針對Windows Form做自動化測試時更加容易，關於這部分的細節之後再介紹。

除了White以外TestStack也有推出一些有用的測試套件，例如有再使用BDD開發系統的可以研究看看TestStack.BDDfy；針對ASP.NET MVC程式撰寫測試程式時，也可以使用TestStack.FluentMVCTesting，讓測試程式更加口語化。有興趣的話可以到[TestStack的GitHub](https://github.com/TestStack)上看看囉。