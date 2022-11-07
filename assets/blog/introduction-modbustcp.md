---
title: "簡介 Modbus TCP"
date: 2022-11-07 18:01:16
category:
tags:
  - ModbusTCP
ogImage: 00.png
---

Modbus 是在工業領域中廣泛使用的訊息交換規範，而 Modbus TCP 則是 Modbus 的一種實現，它使用 TCP/IP 作為傳輸層協定，因此可以透過網路傳輸。

最近在著手開發一個跟工業相關的專案，需要透過 Modbus TCP 協定來取得設備上的資訊，這篇文章會紀錄一下 Modbus TCP 的基本概念及協定規格。

<!-- more -->

{% asset_img 00.png %}

# 關於 Modbus

Modbus 本身就是一種訊息交換的規範，而 Modbus TCP 則是透過 TCP/IP 來實現 Modbus 的一種方式，因此所有的訊息都是透過 TCP/IP 來傳輸。

Modbus 屬於 Client/Server 架構，在工業上會有一個 Server 來存放所有要被讀取的工業設備數據，如溫度、濕度、距離等資料；而 Client 則會傳送一定的訊息格式當做指令，來讀取設備資料（讀），或是叫設備去做些什麼事情（寫）。

無論是對 Modbus Server 發送讀或寫的指令，Server 都會回傳一個確認訊息，讓 Client 知道指令是否成功。整個 Modbus 的溝通就是建構在這個一來一回的訊息交換上。

{% asset_img 01.png %}

在傳輸過程中，Client 與 Server 的訊息最少會有「Function Code」與「Data」兩個部分：

- Function Code：代表要執行的動作代碼，如讀取或寫入。
- Data：代表執行動作代碼的相關參數，例如讀取某個位址上的資料，或是回傳某個位址上的資料作為結果。

Function Code 和 Data 是整個 Modbus 溝通最基本的單元，也稱為 Protocol Data Unit (PDU)。

除此之外，根據傳輸方式不同可能還會再頭尾加上一些附加資訊，附加後的整個訊息稱為 Application Data Unit (ADU)。

{% asset_img 02.png %}

Modbus 定義了許多的內建的 Function Code，每個 Function Code 伴隨著特定規則的 Data，在閱讀文件時，可以跟具我們要處理的 Function Code 找到對應的 Data 規則。

{% asset_img 03.png %}

# Modbus TCP 封包格式

簡單的理解 Modbus 傳輸的訊息格式後，接這看一下在 Modus TCP 中，訊息是如何被封裝成封包的。

## Port

Modbus TCP 規範預設的連接 port 號為 502。

## Header 格式

所有的 Modbus TCP 訊息都會一組固定 7 個 bytes 的 Header，它的規則如下：

{% asset_img 04.png %}

- Transaction Identifier (2 bytes): 用來識別這次送出的封包代碼，通常會是一個連續的數字，之後 Server 回傳時也會包含這個代碼。
- Protocol Identifier (2 bytes): 用來識別這個封包是使用哪個協定，Modbus TCP 的協定代碼是 0，所以固定就好，同時 Server 也會回傳一樣的內容。
- Length (2 bytes): 用來表示這個接下來資料的長度 (bytes)；Client 和 Server 回傳的內容通常不同，所以 header 中的 length 在 Client 和 Server 內容通常也不會相同。
- Unit Identifier (1 byte): 當設備後面有串連多個設備時，用來記錄這個封包是要傳送給哪個設備；Server 會回傳一樣的內容。

## Function Code

Function Code 用來告訴 Server 要執行什麼動作，只會站一個 byte。

## Data

Data 就是實際上要傳送的資料，長度會根據 Function Code 的規則而定。

## 實際資料範例

舉個例子，Function Code「03」代表的是「Read Holding Registers」，這個指令會讀取一張名為「Holding Registers」的表格，這個表格裡的資料是保留給 Server 更新裡面的資訊，以便讓 Client 可以讀取的。

這個 Holding Registers 表格是一連串 16 bits (2 bytes) 的資料，每個資料都有他的位置，我們可以簡單的想像成是一個陣列就好。

接著我們翻閱 Modbus 的文件可以 Function Code 03 的 Request 和 Response 規格

{% asset_img 05.png %}

在 Request 部分除了已知的 Function Code 固定之外，還有兩個參數：

- Starting Address: 代表要從 Holding Registers 表中的哪個位置開始讀取資料。
- Quantity of Registers: 代表要讀取幾個資料 (一個資料 2 bytes)。

這時候我們就需要去閱讀每個設備的文件，找到想要的資訊所在的位置及需要讀取的數量，假設有個「距離」的數據，文件中表示它的位置為「2002」，數量為「1」，代表我們會從這張表的 2002 這個位置讀取 1 個資料。也就是 Starting Address 要傳入 2002；且 Quantity 要傳入 1。

現在數據足夠了，我們就可以把這些資料都轉換成 bytes 傳送給 Modbus TCP Server 了，以上述資料來說，封包內容看起來大致會如下：

```
[
  0x00, 0x01, // Transaction Identifier、連續數字
  0x00, 0x00, // Protocol Identifier、固定 0
  0x00, 0x06, // Length、接下來有 6 bytes 的資料
  0x01,       // Unit Identifier
  0x03,       // Function Code
  0x07, 0xD2, // Starting Address (2002 轉成 2 bytes 的結果)
  0x00, 0x01, // Quantity of Registers (1 轉成 2 bytes 的結果)
]
```

比對一下 Wireshark 抄出來的 Request 封包

{% asset_img 06.png %}

Modbus TCP Server 收到這個封包後，會回傳一個封包給 Client，以我們舉的「距離」資料來說，假設儲存的內容為 100，則回傳內容大致會如下：

```
[
  0x00, 0x01, // Transaction Identifier、與 Request 相同
  0x00, 0x00, // Protocol Identifier、與 Request 相同
  0x00, 0x05, // Length、接下來有 5 bytes 的資料
  0x01,       // Unit Identifier、與 Request 相同
  0x03,       // Function Code、與 Request 相同
  0x02,       // Byte Count、接下來有多少個 bytes 的資料，基本上就是 2 * Quantity
  0x00, 0x64, // Data、實際上的資料 （100 轉成 2 bytes 的結果）
]
```

一樣比對一下 Wireshark 抄出來的 Response 封包

{% asset_img 07.png %}

# 參考資源

- [MODBUS Messaging on TCP/IP Implementation Guide V1.0b](https://www.modbus.org/docs/Modbus_Messaging_Implementation_Guide_V1_0b.pdf)
- [MODBUS APPLICATION PROTOCOL SPECIFICATION V1.1b3](https://www.modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf)
- [[Modbus] 如何看懂 Modbus TCP 通訊協定](https://dotblogs.com.tw/Leo_CodeSpace/2018/12/26/185411)
