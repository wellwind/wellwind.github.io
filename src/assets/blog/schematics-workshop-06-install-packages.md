---
title: "[Schematics 實戰] 使用 Schematics 幫我們安裝指定套件"
date: 2019-12-22 21:03:35
tags:
  - Schematics
---

在開發專案時，通常不會全部都靠自己處理，有些功能會使用現成的套件，以免重複打造輪子的問題；若我們使用 Schematics 建立的程式有相依某些套件，則必須多一個安裝的步驟，手動確認處理的話實在是太辛苦了！其實，我們也可以透過 Schematics 來幫我們進行安裝套件的動作。今天我們來看看如何透過 Schematics 安裝指定的第三方套件到專案內！

<!-- more -->

要透過 Schematics 來安裝套件，可以分成兩個階段，分別是設定 `package.json` 和執行 `npm install` 的動作。

# 將指定套件加入 package.json 內

要將指定套件加入 `package.json` 內其實非常容易，基本上就是讀檔案寫檔而已。

## 讀取檔案

可以使用 `tree.read()` 的方式讀取 `package.json` 檔案，讀取出來的是 stream，如果沒有特殊需要，可以直接使用 `toString()` 方式將整個檔案讀成文字內容，再使用 `JSON.parse()` 方式轉換成物件。

```typescript
const packageJson = JSON.parse(tree.read('package.json').toString('UTF-8'));
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-read-json-file` 快速產生相關程式碼。

{% endnote %}

得到這個物件後，只需要更新 `dependencies: {}` 或 `devDependencies: {}` 之類的設定即可。

以下例子設定安裝 `@angular/material` 的 `8.2.3` 版本：

```typescript
packageJson.dependencies['@angular/material'] = '~8.2.3';
```

{% note info %}

一般來說我們都會指定安裝的套件版本，如果想要像 `npm install` 一樣裝 registry 的最新版，可以透過 npmjs.org 的 API 取得指定套件的版本，使用以下網址格式可以得到指定套件的相關資訊：

[http://registry.npmjs.com/-/v1/search?text=[套件名稱]&size=1](http://registry.npmjs.com/-/v1/search?text=[套件名稱]&size=1)

{% endnote %}

最後我們在進行存檔動作，就算大功告成啦！先使用 `JSON.stringify()` 將物件轉成字串，再使用 `tree.overwrite()` 將檔案內容寫回 `package.json`：

```typescript
tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
```

這麼一來就算是把安裝套件設定寫入 `package.json` 內囉。接下來的問題是，如何在 Schematics 內進行套件安裝動作！

# 在 Schematics 內安裝套件

在 Schematics 的設計內，除了檔案系統的變更外，還有一個 task 的設計，這些 task 會在檔案系統變更完成後執行，因此我們可以自行撰寫一個 task 來執行安裝動作，不過更好的是，Schematics 內建就有這樣的 task 啦！

一開始先 import 這個 task

```typescript
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-import-install-package-task` 快速產生程式碼。

{% endnote %}

接下來我們會使用到 rule 的第二個參數(第一個是 tree 我們已經使用很多了)，也就是 `SchematicContext`，在這個物件內，可以透過 `addTask()` 來加入指定的 task：

```typescript
_context.addTask(new NodePackageInstallTask());
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-install-package` 快速產生程式碼。

{% endnote %}

兩行程式就完成了，透過 Schematics 真的是太方便啦！

{% note info %}

1. 對於撰寫 task 的範例，可以參考 [NodePackageInstallTask 的程式碼](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics/tasks/node-package)
2. 若要測試程式效果，在 dry run 模式預設會不執行這些 task，所以記得設定 `--dry-run=false`

{% endnote %}

# 本日小結

今天我們學習了如何使用 Schematics 替專案安裝套件，大致只有兩個步驟：

1. 更新 `package.json`
2. 執行安裝套件動作

第一個步驟就是檔案處理而已，而執行安裝套件動作這部分 Schematics 也有內建對應的行為，真的是非常方便！！
