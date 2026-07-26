---
title: "[WebMCP] 基本概念：讓網站把功能直接變成 AI Agent 的工具"
date: 2026-07-15 11:10:53
category: "前端軍火庫"
tags:
  - WebMCP
  - MCP
  - AI Agent
  - Web API
---

現在的 AI Agent 已經可以看懂網頁、找到按鈕、填寫表單，甚至幫我們完成一連串操作。不過，要讓 Agent 模擬人類操作網頁，都還是已讀懂 DOM 元素為主，有點像請一位很聰明的新同事，盯著畫面猜每個按鈕到底能不能按，或按下去的效果如何，不一定能真正理解一個網頁本身設計的意圖。

而 WebMCP 提供了另一條路：網站直接把「搜尋商品」、「加入購物車」、「預約餐廳」等功能宣告成結構化工具，讓瀏覽器中的 AI Agent 可以發現並呼叫。

今天這篇文章我們先從 WebMCP 的基本概念開始，看看它解決什麼問題、和 MCP 有什麼不同，以及官方提供的 Imperative API 與 Declarative API 如何運作。

<!-- more -->

{% note warning %}

WebMCP 目前仍是發展中的 Web 標準提案，API 可能持續調整。本文是依據 2026 年 7 月的 [W3C Community Group Draft](https://webmachinelearning.github.io/webmcp/) 與 [Chrome 官方文件](https://developer.chrome.com/docs/ai/webmcp) 整理的筆記，目前還不建議實際上線使用，但先學起來也是沒有壞處的。

{% endnote %}

## WebMCP 想解決什麼問題？

現在許多 AI Agent 都可以操作瀏覽器、讀取網頁，甚至瀏覽器都開始有內建 Agent 了，想下一下，今天我們對瀏覽器裡的 Agent 說：

> 幫我訂明天晚上七點、兩個人的位子，想坐戶外。

如果網站沒有提供 Agent 專用的介面，Agent 的做法基本上就是：

1. 從畫面或 DOM **~~判斷~~猜**出哪一個欄位是日期。
2. 操作 Date Picker 選擇日期。
3. 找到時間、人數與座位區域欄位。
4. 填完資料，再判斷哪顆按鈕是送出。
5. 從畫面變化猜測預約是否成功。

這種方式稱為 **actuation**，也就是 Agent 模擬人類點擊、輸入與操作介面。它的優點是不需要網站特別配合，但缺點也很明顯：步驟多、容易誤判，而且網站只要改版，原本可行的操作路徑就可能突然迷路。

而 WebMCP 則是讓網站主動宣告，讓 Agent 知道我們有一個訂位工具，例如：

```text
工具名稱：book_table
用途：建立餐廳訂位
參數：date、time、guests、seating
```

這樣 Agent 就不需要從 DOM 中去猜測 UI 長什麼樣子，而是透過呼叫具有明確名稱、說明與輸入格式的工具。工具仍然在目前開啟的網頁中執行，也能同步更新畫面，因此我們看得到 Agent 做了什麼。

簡化後的流程如下：

```text
使用者
  ↓ 自然語言需求
瀏覽器中的 AI Agent
  ↓ 發現並呼叫工具
document.modelContext
  ↓ 執行網站註冊的功能
既有應用程式邏輯
  ↓ 更新
畫面狀態與工具結果
```

透過 WebMCP，我們做的事情從「讓 AI 可以偷偷繞過 UI」，變成了「Agent 和使用者在同一個網頁、同一份狀態下協作」。

這樣的行為可以大幅提升 AI 幫我們執行工作的準確率，同時也可以節省 token 消耗，畢竟 Agent 看那堆 DOM 要找出我們的目標並且準確執行行為，肯定比我們直接宣告叫 AI 去哪裡還要麻煩得多。

## WebMCP 和 MCP 一樣嗎？

名稱都叫 MCP，很容易讓人以為 WebMCP 是「瀏覽器版 MCP Server」。概念上確實很像，但兩者解決的是不同層次的問題。

| 比較項目 | MCP | WebMCP |
| --- | --- | --- |
| 功能通常存在的位置 | 後端服務、桌面程式或遠端系統 | 使用者目前開啟的網頁 |
| 生命週期 | Server 存在時持續可用 | 分頁開啟時才存在 |
| 使用情境 | 背景查詢、資料來源、跨平台工作流程 | 操作即時 UI 與目前登入狀態 |
| 是否需要瀏覽器畫面 | 不一定 | 需要瀏覽情境 |
| 工具註冊方式 | MCP Server 提供 tools、resources 等能力 | JavaScript 或 HTML 表單標註 |

[Chrome 官方的說法](https://developer.chrome.com/docs/ai/webmcp/compare-mcp)是：WebMCP 不是 MCP 的擴充，也不是要取代 MCP，而是一組受 MCP 啟發、專門為瀏覽器設計的 API。

MCP 適合把核心資料與背景工作提供給各種 Agent；WebMCP 則適合讓瀏覽器 Agent 操作使用者眼前的網站。實務上當然兩者都可以一起使用：後端由 MCP 處理跨平台能力，前端再用 WebMCP 暴露和當前頁面狀態有關的操作。

{% note info %}

雖然名稱叫做 WebMCP，目前的 WebMCP 規格並沒有規定瀏覽器一定要使用 MCP 傳輸格式與 Agent 溝通。瀏覽器可以轉換成 MCP、Function Calling 或其他內部格式。而對網站開發者來說，真正需要面對的是 Web MCP 相關的 API，不用煩惱要自己在前端實作一套 JSON-RPC Server。

{% endnote %}

## 兩種建立工具的方式

WebMCP 提供兩種主要方式：

* **Imperative API**：使用 JavaScript 呼叫 `document.modelContext.registerTool()`，適合操作應用程式狀態、呼叫 API、導航或執行比較複雜的流程，也需要自己定義互動流程。
* **Declarative API**：在既有 HTML `<form>` 加上描述屬性，由瀏覽器根據表單欄位自動建立工具。

它們不是競爭關係。可以用標準表單完成的功能，優先考慮 Declarative API；需要 JavaScript 邏輯與動態狀態時，再使用 Imperative API。

## Imperative API：使用 JavaScript 註冊工具

[GoogleChromeLabs 官方 pizza-maker 範例](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/pizza-maker)是一個很直覺的示範。網站原本就有 `addTopping()` 函式負責更新披薩畫面，接著再把這個既有功能包裝成 Agent 可呼叫的 `add_topping` 工具。

以下是依照官方範例簡化的版本：

```javascript
if (document.modelContext) {
  await document.modelContext.registerTool({
    name: 'add_topping',
    description: 'Add one or more toppings to the pizza.',
    inputSchema: {
      type: 'object',
      properties: {
        topping: {
          type: 'string',
          enum: ['🍄', '🌿', '🍍', '🥓', '🧅'],
          description: 'The topping to add.',
        },
        count: {
          type: 'integer',
          minimum: 1,
          description: 'The number of toppings to add.',
        },
      },
      required: ['topping'],
      additionalProperties: false,
    },
    execute: async ({ topping, count = 5 }) => {
      if (!Number.isInteger(count) || count < 1) {
        throw new Error('count must be a positive integer.');
      }

      addTopping(topping, count);
      return `Added ${count} ${topping} topping(s).`;
    },
  });
}
```

一個 Imperative Tool 主要包含四個部分：

* `name`：Agent 用來識別工具的唯一名稱。
* `description`：說明工具做什麼，以及什麼情境適合使用。
* `inputSchema`：使用 JSON Schema 描述輸入參數。
* `execute`：Agent 呼叫工具時真正執行的 JavaScript 函式。

`inputSchema` 可以降低 Agent 傳錯參數的機率，但它不應該取代真正的程式驗證。官方最佳實務特別強調：**Schema 可以保持友善，程式碼驗證必須嚴格**。Agent 終究是外部輸入來源，該檢查的型別、範圍、權限與商業規則，一項都不能少。

### 工具不是註冊越多越好

工具會占用 Agent 的 context，也會增加選錯工具的機率。與其把每顆按鈕都變成 Tool，不如從使用者真正想完成的工作出發。

例如：

```text
set_date_picker_value
click_guest_dropdown
select_outdoor_option
click_submit_button
```

上面這組工具只是把 UI Automation 換一層皮，Agent 還是得自己拼流程。更清楚的設計可能是：

```text
book_table
```

工具應該具有單一、清楚且不重疊的目的。名稱最好使用能表達結果的動詞，例如 `create_event` 代表立即建立事件，而 `start_event_creation` 則表示只會帶使用者進入建立流程。

## Declarative API：把既有表單變成工具

如果網站功能本來就是一張標準 HTML 表單，不一定要再寫一份 JSON Schema 與 `execute`。Declarative API 可以從表單結構產生工具。

[官方 Le Petit Bistro 範例](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/french-bistro)只需要在訂位表單加上幾個屬性：

```html
<form
  toolname="book_table"
  tooldescription="Initiates a dining reservation request."
  action="/reservations"
>
  <label for="date">Date</label>
  <input
    id="date"
    name="date"
    type="date"
    required
    toolparamdescription="Reservation date. Must be today or later."
  />

  <label for="guests">Guests</label>
  <select
    id="guests"
    name="guests"
    required
    toolparamdescription="The number of people dining."
  >
    <option value="1">1 Person</option>
    <option value="2">2 People</option>
    <option value="3">3 People</option>
  </select>

  <button type="submit">Request Reservation</button>
</form>
```

其中：

* `toolname`：定義工具名稱。
* `tooldescription`：說明工具的目的。
* `toolparamdescription`：補充欄位在工具參數中的語意。

瀏覽器會根據 `input`、`select`、`required`、`name`、`label` 等既有 HTML 語意，自動合成 Agent 可理解的 JSON Schema。

這也解釋了為什麼語意化 HTML 仍然很重要。WebMCP 不是「有了 AI，以前的表單與無障礙規則就可以丟掉」；剛好相反，正確的 `label`、`name`、輸入型別與驗證限制，會同時幫助使用者、輔助科技與 Agent。

預設情況下，Agent 可以協助填寫欄位，但會讓使用者在真正送出前檢查內容。規格也提供 `toolautosubmit`，允許 Agent 自動送出表單，不過這不應該隨手套在付款、刪除、發布或其他高風險操作上。自動化很方便，但「AI 幫你買了 87 張不能退的機票」通常不是大家期待的驚喜。

## Tool 的生命週期和頁面狀態

WebMCP Tool 是 **tab-bound** 的。只有當頁面存在、JavaScript 已執行，而且工具仍處於註冊狀態時，Agent 才能使用它。

這個特性非常適合 SPA 應用程式：

* 商品列表頁註冊 `search_products`。
* 商品詳細頁改為註冊 `add_to_cart`。
* 結帳頁才提供 `apply_coupon` 與 `submit_order`。

工具不再適用時，應該取消註冊。Imperative API 可以在註冊時傳入 `AbortSignal`：

```javascript
const controller = new AbortController();

await document.modelContext.registerTool(
  {
    name: 'read_cart',
    description: 'Returns the items currently in the shopping cart.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
    },
    execute: () => JSON.stringify(getCartItems()),
  },
  { signal: controller.signal },
);

// Unregister when the tool no longer matches the current page state.
controller.abort();
```

這比永遠註冊所有工具更安全，也能降低 Agent 在錯誤頁面呼叫過期功能的機率。

## 安全性議題

WebMCP 讓 Agent 能直接進入網站功能，因此安全邊界必須比「多寫一段 description」更扎實。

至少需要注意以下幾點：

### 1. 對輸入做真正的驗證

不要假設傳入內容一定符合 `inputSchema`。在 `execute` 中再次檢查型別、範圍、權限與目前狀態，並回傳能讓 Agent 修正的明確錯誤。

### 2. 區分唯讀與會修改狀態的工具

唯讀工具可以使用 `readOnlyHint`；若工具回傳使用者產生內容或外部資料，可以加上 `untrustedContentHint`，提醒 Agent 不要把回傳文字當成可信賴的指令。

### 3. 敏感操作保留使用者確認

付款、刪除資料、公開發布、變更權限等操作，不應該因為是 Agent 呼叫就跳過確認。WebMCP 的價值是減少猜測，不是取消授權。

### 4. 小心跨來源暴露

WebMCP 預設受 `tools` Permissions Policy 保護，只允許 top-level 與 same-origin 情境。跨來源 iframe 需要由外層明確加入：

```html
<iframe src="https://trusted.example" allow="tools"></iframe>
```

Imperative Tool 還能透過 `exposedTo` 指定允許存取的安全來源。除非真的需要，維持預設的 same-origin 範圍通常比較簡單，也比較不容易製造一扇忘記關的側門。

## 如何在本機體驗？

依照目前的 [Chrome WebMCP 文件](https://developer.chrome.com/docs/ai/webmcp)，可以使用以下方式測試：

1. 使用支援測試功能的 Chrome。
2. 開啟 `chrome://flags/#enable-webmcp-testing`。
3. 將 WebMCP testing flag 設為 Enabled。
4. 重新啟動瀏覽器。
5. 使用官方建議的 Model Context Tool Inspector 檢查頁面註冊的工具。

Chrome 149 起也提供 Origin Trial，讓網站可以在不要求使用者手動打開 flag 的情況下測試。由於 Origin Trial、Chrome 版本與 API 名稱都可能變動，上線前一定要重新確認官方文件。

{% note warning %}

早期 WebMCP 文件與 Polyfill 常使用 `navigator.modelContext`。Chrome 已在 150 版將它標示為 deprecated，目前官方範例使用的是 `document.modelContext`。

{% endnote %}

官方也提供兩個適合入門的 Live Demo：

* [WebMCP zaMaker（Imperative API）](https://googlechromelabs.github.io/webmcp-tools/demos/pizza-maker/)
* [Le Petit Bistro（Declarative API）](https://googlechromelabs.github.io/webmcp-tools/demos/french-bistro/)

## 本日小結

WebMCP 的核心概念其實很單純：**不要再讓 Agent 猜網站能做什麼，由網站直接提供結構化工具。**

它帶來幾個重要改變：

* Agent 從模擬點擊，轉為呼叫明確的功能。
* 工具沿用目前分頁的 UI、登入狀態與應用程式邏輯。
* 使用者仍留在原本的網站，並看得到操作結果。
* 開發者可以用 JavaScript 註冊複雜工具，也能直接把語意化表單轉成工具。
* 工具的輸入、安全、生命週期與測試，仍然是網站開發者的責任。

WebMCP 還很早期，支援範圍與 API 都可能改變；但它揭示了一個值得注意的方向：未來的前端介面不只要讓人看得懂，也要能清楚告訴 Agent「我能做什麼、需要什麼參數、做完會發生什麼事」。

## 相關資源

* [Chrome for Developers：WebMCP](https://developer.chrome.com/docs/ai/webmcp)
* [Chrome for Developers：Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
* [Chrome for Developers：Declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
* [Chrome for Developers：When to use WebMCP and MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp)
* [Chrome for Developers：WebMCP best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices)
* [Chrome for Developers：WebMCP tool security](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
* [WebMCP Draft Community Group Report](https://webmachinelearning.github.io/webmcp/)
* [WebMCP specification repository](https://github.com/webmachinelearning/webmcp)
* [GoogleChromeLabs WebMCP official demos](https://github.com/GoogleChromeLabs/webmcp-tools)
