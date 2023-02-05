---
title: "QuestPDF - 支援中文、免費好用的 C# PDF 產生器"
date: 2023-02-05 13:15:31
category:
tags:
  - "QuestPDF"
ogImage: 03.png
---

產生 PDF 的套件並不難找，有趣的是，.NET 的 PDF 套件免卻不多，最近找到一套 [QuestPDF](https://www.questpdf.com/)，他的 API 設計非常漂亮，支援中文，並且免費開源，雖然不一定是最強大的套件，但對於一般產生 PDF 的工作，已經非常好用了。

<!-- more -->

## 關於 QuestPDF

QuestPDF 對於我來說有幾個很重要的好處

* **MIT 授權**：MIT 授權的 PDF 相關套件在 .NET 生態圈非常稀少 (也可能是我見識淺薄)
* **支援自訂字體**：這已經幾乎是現在 PDF 套件的標配了，支援自訂字體同時意味著它可以支援中文
* **Fluent API**: 極具可讀性的 API 設計，讓我們在產生 PDF 文件時，可以更專注在如何顯示，而不是在設定上

## 開始使用 Quest PDF

### 安裝套件

安裝 QuestPDF 套件應該不是什麼難事，也不太需要什麼額外的設定，以下是文件提供的安裝範例

```sh
// Package Manager
Install-Package QuestPDF

// .NET CLI
dotnet add package QuestPDF

// Package reference in .csproj file
<PackageReference Include="QuestPDF" Version="2022.12.1" />
```

另外如果是使用 Linux 或是 Blazor WASM 的話，會有一些需要注意的事項，可以參考文件「[Platform specific dependencies](https://www.questpdf.com/going-production/platform-specific-dependencies)」。

### QuestPDF 基本架構

以下範例程式來自 [Getting started](https://www.questpdf.com/getting-started) 文件，根據解說需要進行一些調整，以及加上一些補充解說及個人想法。

QuestPDF 採用 Fluent API 設計，所以在產生 PDF 的過程，我們可以使用非常具有可讀性的 API 來決定要產出的內容，除此之外，QuestPDF 對於產生一個 PDF 文件的概念分成了以下三個部分：

1. 文件模型 (Document models): 簡單來說就是這份 PDF 文件所需資料的模型，通常就是個 POCO 物件而已，主要用來描述文件上所需要的資料欄位。
2. 資料來源 (Data source): 實際上的資料來源，最終會透過這些資料來源對應到文件模型的欄位。
3. 樣版 (Template): 決定資料實際上如何呈現，也就是實際上肉眼可以看到的排版。

前兩項都是我們自己定義的，而樣版則是由 QuestPDF 提供的，我們只需要使用 QuestPDF 提供的 API 來描述我們想要的樣版即可。

以下我們就針對這三個部分來看看 QuestPDF 是如何運作的。

#### 文件模型

著重在描述文件上所需要的資料欄位，以下是個簡單的範例

```cs
public class InvoiceModel
{
    public int InvoiceNumber { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }

    public Address SellerAddress { get; set; }
    public Address CustomerAddress { get; set; }

    public List<OrderItem> Items { get; set; }
    public string Comments { get; set; }
}

public class OrderItem
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class Address
{
    public string CompanyName { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public object Email { get; set; }
    public string Phone { get; set; }
}
```

可以看到就是一堆 POCO 的定義而已，這些定義的重點是讓我們可以明確知道整個文件上所需要的資料欄位。

#### 資料來源

資料來源具有非常多可能性，可能來自資料庫、某個 WebAPI、使用者輸入等等，這邊我們就以一個簡單的範例來說明。

```cs
using QuestPDF.Helpers;

public static class InvoiceDocumentDataSource
{
    private static Random Random = new Random();

    public static InvoiceModel GetInvoiceDetails()
    {
        var items = Enumerable
            .Range(1, 8)
            .Select(i => GenerateRandomOrderItem())
            .ToList();

        return new InvoiceModel
        {
            InvoiceNumber = Random.Next(1_000, 10_000),
            IssueDate = DateTime.Now,
            DueDate = DateTime.Now + TimeSpan.FromDays(14),

            SellerAddress = GenerateRandomAddress(),
            CustomerAddress = GenerateRandomAddress(),

            Items = items,
            Comments = Placeholders.Paragraph()
        };
    }

    private static OrderItem GenerateRandomOrderItem()
    {
        return new OrderItem
        {
            Name = Placeholders.Label(),
            Price = (decimal) Math.Round(Random.NextDouble() * 100, 2),
            Quantity = Random.Next(1, 10)
        };
    }

    private static Address GenerateRandomAddress()
    {
        return new Address
        {
            CompanyName = Placeholders.Name(),
            Street = Placeholders.Label(),
            City = Placeholders.Label(),
            State = Placeholders.Label(),
            Email = Placeholders.Email(),
            Phone = Placeholders.PhoneNumber()
        };
    }
}
```

從程式中可以看到主要就是定義文件模型實際上的資料，現實情況就則是會從某些來源如資料庫等轉換成文件模型的資料。

除此之外，上述程式用了 QuestPDF.Helpers 的 Placeholders 這個輔助類別，透過這個類別可以快速產生一些假資料，方便我們在開發階段測試。

#### 樣版

樣版就是 QuestPDF 強大的地方了，QuestPDF 提供了 FluentAPI 讓我們能很容易的描述出想像中的樣是什麼樣子，在描述樣版之前，我們必須實作一個 `IDocument` 介面，這個介面長得像這樣：

```cs
public interface IDocument
{
    DocumentMetadata GetMetadata();
    void Compose(IDocumentContainer container);
}
```

`GeetMetadata()` 用來取得文件的基本描述資訊，也就是一般我們在文件上滑鼠點擊右鍵後可以看到的一些相關資訊如標題、文件描述和作者等資料。

`Compose()` 這個方法就是用來描述文件的樣版，這個方法會傳入一個實作 `IDocumentContainer` 的物件，透過這個物件提供的 FluentAPI 我們就可以描述文件實際上的呈現模樣。

我們來看一下實際上實作 IDocument 的程式碼：

```cs
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class InvoiceDocument : IDocument
{
    public InvoiceModel Model { get; }

    public InvoiceDocument(InvoiceModel model)
    {
        Model = model;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(50);
            
                page.Header().Height(100).Background(Colors.Grey.Lighten1);
                page.Content().Background(Colors.Grey.Lighten3);
                page.Footer().Height(50).Background(Colors.Grey.Lighten1);
            });
    }
}
```

在建構式中我們傳入 `InvoiceModel` 物件，這也就是我們實際上的資料模型。

而實作的 `GetMetadata()` 則是直接回傳 `DocumentMetadata.Default` ，使用預設的資料，當然我們也可以自行定義，這部分可以參考文件「[Document metadata](https://www.questpdf.com/concepts/document-metadata)」。

最後是 `Compose()`，目前我們做了以下幾件事情

* 使用 `container.Page` 來建立頁面
* 在頁面的 callback 方法內，使用 page 物件來描述這個頁面的樣式，例如
  * `page.Margin(50)`: 頁面的邊界
  * `page.Header().Height(100).Background(Colors.Grey.Lighten1)`: 頁面的頁首高度以及背景顏色
  * `page.Content().Background(Colors.Grey.Lighten3)`: 頁面的內容區域背景顏色
  * `page.Footer().Height(50).Background(Colors.Grey.Lighten1)`: 頁面的頁尾高度以及背景顏色

可以看到透過 FluentAPI 的設計，整個描述畫面的方式非常的具有可讀性，而且也非常的簡潔！

這時候就可以透過這個 `InvoiceDocument` 來產生 PDF 啦！

```cs
using QuestPDF.Fluent;

var data = InvoiceDocumentDataSource.GetInvoiceDetails();
var document = new InvoiceDocument(data);
document.GeneratePdf("invoice.pdf");
```

執行後文件看起來應該會如下：

{% asset_img 01.png (width=360) %}

接著我們來持續把內容填入，以下程式透過 `.Element()` 的方式，將複雜的邏輯抽出來

```cs
public class InvoiceDocument : IDocument
{
    /* code omitted */

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(50);
            
                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);

                    
                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
    }

    void ComposeHeader(IContainer container)
    {
        var titleStyle = TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
    
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text($"Invoice #{Model.InvoiceNumber}").Style(titleStyle);

                column.Item().Text(text =>
                {
                    text.Span("Issue date: ").SemiBold();
                    text.Span($"{Model.IssueDate:d}");
                });
                
                column.Item().Text(text =>
                {
                    text.Span("Due date: ").SemiBold();
                    text.Span($"{Model.DueDate:d}");
                });
            });

            row.ConstantItem(100).Height(50).Placeholder();
        });
    }

    void ComposeContent(IContainer container)
    {
        container
            .PaddingVertical(40)
            .Height(250)
            .Background(Colors.Grey.Lighten3)
            .AlignCenter()
            .AlignMiddle()
            .Text("Content").FontSize(16);
    }
}
```

我們可以透過 `.Element()` 的方式，組合自定義的方法來產生內容，如此一來就可以把比較複雜的內容抽出成更具有意義的名稱的方法

```cs
page.Header().Element(ComposeHeader);
page.Content().Element(ComposeContent);
```

除此之外，程式中我們也開始將來原資料顯示在頁面上了，如：

```cs
column.Item().Text($"Invoice #{Model.InvoiceNumber}").Style(titleStyle);
```

其中的 `Model.InvoiceNumber` 就是一開始傳進來的模型資料。

{% asset_img 02.png (width=360) %}

最後我們來看一下如何產生表格資料，直接上程式

```cs
public class InvoiceDocument : IDocument
{
    /* code omitted */

    void ComposeContent(IContainer container)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(5);

            column.Item().Element(ComposeTable);
        });
    }

    void ComposeTable(IContainer container)
    {
        container.Table(table =>
        {
            // step 1
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(25);
                columns.RelativeColumn(3);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });
            
            // step 2
            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Product");
                header.Cell().Element(CellStyle).AlignRight().Text("Unit price");
                header.Cell().Element(CellStyle).AlignRight().Text("Quantity");
                header.Cell().Element(CellStyle).AlignRight().Text("Total");
                
                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                }
            });
            
            // step 3
            foreach (var item in Model.Items)
            {
                table.Cell().Element(CellStyle).Text(Model.Items.IndexOf(item) + 1);
                table.Cell().Element(CellStyle).Text(item.Name);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Price}$");
                table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.Price * item.Quantity}$");
                
                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            }
        });
    }

    /* code omitted */
}
```

在 `ComposeTable` 方法中，我們先透過 `table.ColumnsDefinition` 來定義表格的欄位數量與寬度，接著透過 `table.Header` 來定義表頭，最後透過 `foreach` 來產生表格內容。

文件中還有許多功能，如[自訂 Component](https://www.questpdf.com/concepts/components)，讓我們可以抽出更具共用性的元件，這邊就不一一介紹了，有興趣的話可以再深入研究文件。

### 自訂字體以支援中文

許多產生 PDF 的套件最常遇到的問題就是對非英文的支援，當然隨著時間的推移，多數的套件也都解決了這個問題，而要讓 PDF 支援中文最常見的處理方式就是自定義字型，然後選個中文字體即可！

#### 下載可用字體

只要支援中文的字體都可以，在這邊我直接去 Google Fonts 下載了 [Noto Sans Tranditional Chinese](https://fonts.google.com/noto/specimen/Noto+Sans+TC?subset=chinese-traditional&noto.script=Hant) 字體。

之後將字體放到專案目錄內。

#### 設定 PDF 使用字體

QuestPDF 提供了 `Font management` 的功能，讓我們可以自定義字體，我們可以給予一個自訂名稱，並告知字體位置。

```cs
using QuestPDF.Drawing;

FontManager.RegisterFont(File.OpenRead("NotoSansTC-Regular.otf"));
```

接著可以直接在頁面定義預設使用的文字樣式

```cs
page.DefaultTextStyle(x => x.FontFamily("Noto Sans TC"));
```

之後就可以順利產生中文字啦！

另外我們也可以自己定義字體名稱：

```cs
using QuestPDF.Drawing;

FontManager.RegisterFontWithCustomName("ChineseFont", File.OpenRead("./NotoSansTC-Regular.otf"));
```

之後就可以直接指定自己定義的字體名稱：

```cs
page.DefaultTextStyle(x => x.FontFamily("ChineseFont"));
```

我們也可以針對特定的文字使用指定的字體，例如要產生條碼，首先先註冊條碼字體：

```cs
FontManager.RegisterFont(File.OpenRead("LibreBarcode39-Regular.ttf"));
```

之後針對產出的文字就可以直接指定字體：

```cs
container
    .Background(Colors.White)
    .AlignCenter()
    .AlignMiddle()
    .Text("*QuestPDF*")
    .FontFamily("Libre Barcode 39")
    .FontSize(64);
```

### 使用 Previewer

QuestPDF 提供了一套非常棒的工具，可以讓我們在開發階段即時預覽產出的 PDF，這樣一來就不用每次都去找檔案來開了，非常方便。

首先我們要先安裝 QuestPDF.Previewer 這個 DotNet Tool

```sh
dotnet tool install QuestPDF.Previewer --global
```

之後執行以下指令開啟 QuestPDF Previewer，預設會監聽 Port 12500

```sh
questpdf-previewer
```

你也可以指定要監聽的 Port 號，例如 Port 12345

```sh
questpdf-previewer 12345
```

此時會開啟一個視窗，讓我們可以隨時欲預覽的 PDF 檔案。

接著在程式中，使用 `ShowInPreviewer` 擴充方法來顯示 PDF 內容。

```cs
using QuestPDF.Previewer;

var data = InvoiceDocumentDataSource.GetInvoiceDetails();
var document = new InvoiceDocument(data);

// 在 Previewer 中顯示產生的 PDF 內容
document.ShowInPreviewer();

// 指定 Port 號
// document.ShowInPreviewer(12345);
```

{% asset_img 03.png (width=360) %}

當然，在跑程式的時候可以使用 `dotnet watch run`，如此一來每次改完檔案，就會重新跑一次程式，並將產出的 PDF 顯示在 Previewer 中囉。

[Document previewer 文件](https://www.questpdf.com/document-previewer)影片支援：

<video width="100%" controls autoplay loop><source src="https://www.questpdf.com/previewer/video.mp4" type="video/mp4"></video>

## 本日小結

一直以來在 .NET 中要產生 PDF 檔案，很難找到開源且支援中文的套件，就算有也不一定好用，當然也有不少功能強大的套件但幾乎都要付費，真的是蠻可惜的；這次找到 QuestPDF 後，立刻一躍成為我心目中使用 .NET 產生 PDF 文件的第一名！

如果你覺得有其他不錯的 PDF 處理套件 (尤其是 .NET 的)，歡迎告訴我，我很樂意再研究研究 😎。
