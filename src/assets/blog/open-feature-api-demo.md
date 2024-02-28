---
title: "[OpenFeature] 實際使用 OpenFeature"
date: 2024-02-21 16:37:16
category: "OpenFeature"
tags:
  - "OpenFeature"
  - "InMemoryProvider"
  - "Evaluation API"
---

這篇文章將介紹如何使用 OpenFeature 的 Evaluation API，並以 TypeScript 程式語言為例，示範如何在前端專案中使用 Feature Flag 來管理 Todo List 功能的開關。

<!-- more -->

## 環境設定

在開始之前，我們需要先進行環境設定。首先，要確保您的專案已經安裝了 Node.js 和 OpenFeature 的套件。

```bash
npm install --save @openfeature/server-sdk
```

如果是前端專案，則需要安裝 `@openfeature/web-sdk` 套件。

```bash
npm install --save @openfeature/web-sdk
```

兩個套件的 SDK 使用方式基本上是完全一樣的，唯一的差別在於實作的方式，`@openfeature/server-sdk` 是用於後端專案，裡面使用的 API 可以在 Node.js 環境執行，而 `@openfeature/web-sdk` 是用於前端專案，裡面使用的 API 是在瀏覽器上執行。

接著，我們將建立一個新的 TypeScript 檔案，並引入 OpenFeature 的相關套件。

```typescript
import { OpenFeature, InMemoryProvider } from '@openfeature/server-sdk';
```

當然，如果你是使用前端專案，則是引入 `@openfeature/web-sdk`。

```typescript
import { OpenFeature, InMemoryProvider } from '@openfeature/web-sdk';
```

{% note info %}

除了 TypeScript 外，OpenFeature 也持續發展各個語言的 SDK，詳細可以到文件的[Ecosystem 頁面](https://openfeature.dev/ecosystem)中挖寶。

{% endnote %}

## 設定 Feature Flag Provider

在 OpenFeature 中，我們需要先設定一個 Provider，來決定如何評估 Feature Flag 的值。在這個範例中，我們使用 `InMemoryProvider` 作為 Provider。

{% note info %}

根據 OpenFeature 的規範，所有語言在實作 SDK 時，都需要時做一個 InMemoryProvider，以便我們進行開發環境的測試，在沒有伺服器輔助的情況下，也可以直接使。

{% endnote %}

```typescript
  const FLAG_CONFIGURATION = {
    'todo-list': {
      variants: {
        enabled: true, // 開啟 Todo List 功能
        disabled: false, // 關閉 Todo List 功能
      },
      disabled: false,
      defaultVariant: 'enabled',
    },
  };

  const featureFlagProvider = new InMemoryProvider(FLAG_CONFIGURATION);

  OpenFeature.setProvider(featureFlagProvider);
```

以上程式碼中，我們以 `todo-list` 為 Flag Key 作為 Feature Flag 設定，並指定了 `enabled` 和 `disabled` 兩種 **variants**。

透過 `defaultVariant` 指定為 `enabled`，代表以目前的設定 `todo-list` 功能是打開的。

## 利用 Feature Flag 控制 Todo List 功能

現在我們可以透過 Evaluation API 來根據 Feature Flag 的值來控制 Todo List 功能的開關。

直接看範例：

```typescript
const client = OpenFeature.getClient();

const withTodoList = await client.getBooleanValue('todo-list', false);
if (withTodoList) {
  // 顯示 Todo List
  console.log('Todo List is enabled!');
} else {
  // 隱藏 Todo List
  console.log('Todo List is disabled!');
}
```

以上程式碼中，我們使用 `OpenFeature.getClient()` 來取得一個預設的 client，接著透過 `client.getBooleanValue` 來取得 `todo-list` 的 Feature Flag 值。

OpenFeature 再定義 API 規範時，也有規定在使用 Evaluation API 時，除了指定 Flag Key 外，也要給一個預設值，以便在無法評估 Flag 值 (例如 Flag Key 不存在)，可以有一個預設值，避免程式直接出錯。

除了 `getBooleanValue` 之外，OpenFeature 還提供了幾種不同資料類型的評估方法，包含:

* `getBooleanValue`
* `getStringValue`
* `getNumberValue`
* `getObjectValue`

以便面對不同種類的 Feature Flag 值，從名稱來看就很清楚了，當然，也要記得在設定 Flag Key 時使用對應的資料類型。

除此之外，對應 `getXxxxValue` 方法，也可以使用 `getXxxxDetail` 方法，此時會拿到一個物件，除了評估後的 Flag 值外，也包含其他評估資訊可以利用，包函：

* `flagKey`：也就使我們實際要評估的 Flag Key
* `value`：實際上評估得到的值
* `reason`：得到上述值的原因
* `variant`：與評估 Flag Key 相關聯的 variant
* `errorCode`：錯誤代碼，可以參考 [OpenFeature 文件定義的錯誤代碼](https://openfeature.dev/specification/types#error-code)
* `errorMessage`：錯誤訊息

除了 `flagKey` 和 `value` 是必定會有的，其他都不一定會有回傳值，而是隨著 SDK 實作與評估結果而異。

已前面的程式碼為例，我們可以透過 `getBooleanDetail` 方法來取得評估的詳細資訊，此時回傳結果：

```json
{
  "value": true,
  "variant": "enabled",
  "reason": "STATIC",
  "flagKey": "todo-list"
}
```

假設無法正確評估時，則可能會看到以下訊息：

```json
{
  "errorCode" : "FLAG_NOT_FOUND",
  "errorMessage": "no flag found with key xxxx",
  "flagKey": "xxxx",
  "reason": "ERROR",
  "value": false
}
```

## 結論

透過 OpenFeature 的 Evaluation API 以及針對各個常見程式語言寫好的 SDK，我們可以輕鬆地根據 Feature Flag 的值來控制應用程式的功能開關。今天我們以 TypeScript 程式語言為例，示範了如何使用 OpenFeature 的 Evaluation API 來管理 Todo List 的開關。透過 Feature Flag，開發者可以更靈活地控制應用程式的功能，並根據使用者的需求做出即時的調整。

希望這篇文章對於初學者來說能夠提供一個良好的起點，讓我們可以用更加統一的語言來管理各種程式中的大小開關！
