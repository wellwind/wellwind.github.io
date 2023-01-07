---
title: "使用 C# 撰寫 ModbusTCP client"
date: 2022-11-12 16:51:29
category:
tags:
  - ModbusTCP
---

在之前的文章「簡介 Modbus TCP」我們簡單介紹了工業上常見且簡單的通訊方式，Modbus 以及 ModbusTCP，由於 ModbusTCP 本身非常簡單，因此就算不靠任何 library，只要懂得撰寫簡單的 TCP 程式就可以自己實作一個 ModbusTCP client，所以今天就以 C# 為例，實作一個簡單具有讀取功能的 ModbusTCP client。

<!-- more -->

## 建立 TCP 連線

這是任何 TCP client 的基本，在 C# 內建了 TcpClient 類別可以直接使用

```csharp
// TcpClient 類別的來源
using System.Net.Sockets;

// 建立 TcpClient 並進行連線
var tcpClient = new TcpClient();
await _tcpClient.ConnectAsync('127.0.0.1', 502);
```

## 發送請求封包

我們根據 ModbusTCP 的規範來決定要送出的封包內容，以 Function Code 03 讀取 holding registers 為例：

```csharp
var request = new byte[]
{
  0x00, 0x01, // Transaction Identifier、連續數字或隨機數字都可以
  0x00, 0x00, // Protocol Identifier、固定 0
  0x00, 0x06, // Length、接下來有 6 bytes 的資料
  0x01,       // Unit Identifier
  0x03,       // Function Code
  0x07, 0xD2, // Starting Address (2002 轉成 2 bytes 的結果)
  0x00, 0x01, // Quantity of Registers (1 轉成 2 bytes 的結果)
};
```

有些東西是固定的，但有些會需要依照我們的需求來調整，例如 Starting Address 和 Quality of Registers，都會依照設備和需要讀取的資料不同而異，所以我們可以把它們當作參數傳入，我們可以透過 `BitConverter.GetBytes` 來將數字轉成 byte 陣列的結果

```csharp
var address = 2022;
var quantity = 1;
var startingAddress = BitConverter.GetBytes(address);
var quantityOfRegisters = BitConverter.GetBytes(quantity);
```

不過需要特別注意的是，在這個轉換過程不同作業系統可能可能會因為作業系統而轉換成 Big Endian 或 Little Endian，兩種 bytes 陣列的排序方式剛好對調，基本上 TCP 傳送都是以 Big Endian 的方式，所以我們需要確保轉換出來的排序是 Big Endian，我們可以透過 `BitConverterer.IsLittleEndian` 來判斷目前的排序方式，並進行需要的轉換：

```csharp
if(BitConverter.IsLittleEndian)
{
  startingAddress = startingAddress.Reverse().ToArray();
  quantityOfRegisters = quantityOfRegisters.Reverse().ToArray();
}
```

整理好封包的 bytes 後，就可以把資料送出囉

```csharp
var request = new byte[]
{
  0x00, 0x01, // Transaction Identifier、連續數字或隨機數字都可以
  0x00, 0x00, // Protocol Identifier、固定 0
  0x00, 0x06, // Length、接下來有 6 bytes 的資料
  0x01,       // Unit Identifier
  0x03,       // Function Code
  startingAddress[0], startingAddress[1],
  quantityOfRegisters[0], quantityOfRegisters[1] // Quantity of Registers (1 轉成 2 bytes 的結果)
};

tcpClient.GetStream();
await stream.WriteAsync(request, 0, request.Length);
```

## 接收回應封包

最後就是接收回應的封包內容啦

```csharp
var response = new byte[1024];
var readCount = await stream.ReadAsync(response, 0, response.Length);
// 比較完整的寫法是把 Transaction Identifier、Function Code 等都抓出來檢查
// 尤其是 Function Code，因為當有 error 時就不會是 0x03，而是 0x83 了
// 不過這邊就先省略，以抓到我們的目標資料為主，那麼就是最後的 quantity * 2 個 bytes
var result = response.Take(readCount).TakeLast(quantity * 2).ToArray();
```

由於 ModbusTCP 本身很單純，因此沒有太複雜需求的情況下，自己快速寫一個 client 真的會比找一個很完整的套件還要快速簡單多了！
