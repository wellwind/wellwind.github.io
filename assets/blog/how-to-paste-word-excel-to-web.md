---
title: "如何將 Word/Excel 等檔案內容貼到網頁上"
date: 2022-02-14 22:36:33
category:
  - "前端錦囊"
---

源自前陣子我們家業務問的問題：「客戶原來的系統能將 Excel 儲存格內容貼到網頁上，我們辦得到嗎？」。

實際上當然是肯定的，但還真的沒有特別嘗試過該如何做到，花了點時間研究發現也沒那麼困難，也把一些種點整理一下，以免以後自己忘記。

<!-- more -->

# 監聽 Paste 事件

首先當然是要監聽「貼上」的事件，這非常簡單，在能夠接受貼上內容的元素上監聽 `paste` 事件即可。

```typescript
document.addEventListener('paste', event => {
  console.log(event);
})
```

接著讓我們來分析一下貼上的事件資訊。

# 分析 ClipboardEvent 資訊

監聽 paste 事件後，我們會收到一個型別為 [ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) 的事件物件，其中的 [clipboardData](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData) 屬性包含了我們需要的所有資訊。

## 透過 types 取得貼上的類型

隨著貼上的內容不同，在 `clipboardData.types` 可能呈現不同的類型，我們可以根據各種類型來決定要如何處理貼上的內容。

```typescript
console.log(event.clipboardData.types);
```

當複製一份網頁資料後貼上時，結果為：

```json
["text/plain", "text/html"]
```

當複製一份 Excel 的儲存格內容後貼上時，結果為：

```json
["text/plain", "text/html", "text/rtf", "Files"]
```

當複製一份 Word 的內容後貼上時，結果為：

```json
["text/plain", "text/html", "text/rtf", "Files"]
```

如果是直接複製一個檔案貼上，結果為：

```json
["Files"]
```

## 透過 getDate 取得貼上的內容

透過 `getData`，可以根據某個貼上的資料類型來取得貼上內容。

以 Excel 為例，如果希望將貼上的表格內容顯示在畫面上，只要取得其中的 HTML 內容(text/html)，並解析出其中的 table 標籤即可

```typescript
const data = event.clipboardData.getData('text/html');
const element = document.createElement('foo');
element.innerHTML = data;
const tableElm = element.querySelector('table');
```

## 取得檔案

如果貼上的是檔案，可以從 `items` 取得檔案內容，例如：

```typescript
const file = event.clipboardData.items[0].getAsFile();
```

取得的物件為一個 [File](https://developer.mozilla.org/en-US/docs/Web/API/File)，接著就看要讀取檔案內容，還是用來上傳都沒問題！

# 相關資源

- [Element: paste event](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event)
- [ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
- [ClipboardData](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)
- [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
