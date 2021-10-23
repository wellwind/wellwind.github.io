---
title: "透過 CLI Builder API 加強 Angular CLI 功能"
date: 2021-10-23 12:12:56
category: "Angular 大師之路"
tags:
  - "Angular"
  - "Angular CLI"
  - "Angular CLI Builders"
  - "CLI Builder API"
---

Angular CLI 可以幫助我們透過 `ng` 指令完成許多繁雜的工作，像是啟動開發用的伺服器 (`ng serve`)、將 Angular 專案見製成純前端網站 (`ng build`) 、或是進行單元測試 (`ng test`) 等等，這些指令其實背後都是一段又一段的程式，再搭配 Angular 的 CLI Builder API 整合起來的，而透過 CLI Builder API 也可以幫助我們將一些專案內經常運行的程式也整合到 Angular CLI 內，甚至可以藉此擴充原本內建的 Angular CLI 指令，今天就來看一下如何使用 CLI Builder API 吧！

<!-- more -->

- 範例程式：https://github.com/wellwind/ngx-cli-builders-demo

# 事前準備

先來簡單看一個專案內容，以下是一個 Angular 專案，在 `assets` 目錄內有三個 markdown 檔案，未來可能越來越多：

{% asset_img 01.png %}

我們的目標是在畫面上能列出這些檔案，由於 Angular 是純前端架構，因此我們不可能在執行過程中知道目前 `asset` 內有多少 markdown 檔案，所以希望能透過一個 `posts.json` 檔記錄目前有哪些檔案，當未來新增 markdown 檔時，只要更新 `posts.json` 就可以在前端抓取這個 JSON 檔得知有多少 markdown 在目錄內。

`posts.json` 內容大致如下：

```json
{
  "articles": [
    "post-01.md",
    "post-02.md",
    "post-03.md"
  ]
}
```

這並不是什麼難事，除了自己手動維護外，我們也可以透過 node.js 來寫一些程式幫助我們自動產生；同時，我們也可以將這些程式透過 Angular CLI Builder API 整合到 Angular 專案內，之後只要執行類似 `ng run build-posts-json` 這樣的指令，就可以自動達到我們的要求，讓整體流程更加貼近 Angular 的習慣！

聽起來不錯吧，那就繼續往下看看囉。

# 使用 Angular CLI Builder API

要使用 Angular CLI Builder API，我們需要自行先建立一個 node.js 的套件，並將程式依照一定的規則寫好，未來只要在 Angular 專案內安裝這些套件，就能跟 Angular CLI 完美整合。

## 基本專案架構

先來看一下整個專案需要那些檔案，如果是在原來專案內使用，可以先建一個目錄，當作 node.js 專案，大致包含這些檔案：

{% asset_img 02.png %}

`src` 目錄當然是存放所有程式碼的位置，另外相關檔案說明如下：

### package.json

這個沒什麼問題，就是用來說明整個套件的資訊，基本的內容為：

```json
{
  "name": "cli-builders",
  "version": "1.0.0",
  "builders": "builders.json",
  "scripts":{
    "build": "npx tsc"
  },
  "dependencies": {
    "@angular-devkit/architect": "~0.1200.0",
    "@angular-devkit/core": "^12.0.0",
    "@angular-devkit/build-angular": "~12.0.0"
  },
  "devDependencies": {
    "typescript": "^4.4.4"
  }
}
```

幾個重點說明：

* `name`：套件名稱，如果沒有要發佈到 npm 上，名稱就無所謂，未來可以單純用 `npm link` 的方式直接裝到目前的 Angular 專案內，如果要上傳到 npm，名稱不要衝突就好。
* `builders`：告訴 Angular 專案這個套件是個 CLI Builder 套件，且說明相關的 builder 資訊放在哪裡，稍後我們會看到這個 `builders.json` 的檔案內容。
* `scripts:build`：用來建置目前的 `*.ts` 檔案。
* 至少要安裝 `@angular-devkit/architect` 和 `@angular-devkit/core` 兩個套件，因為跟 Builder CLI 相關的程式都在這裡了。
* 如果想擴充現有的 Angular CLI 指令，則還需要安裝 `@angular-devkit/build-angular`，我們常用的 Angular CLI 指令的相關程式都在這裡面；這個套件本身也是一個 CLI Builder 套件。
* 由於會使用 TypeScript 來撰寫程式，因此也安裝了 `typescript`，方便未來將程式轉成 `*.js` 檔。

這些只是基本，你也可以依照自己需求做調整，例如另外再安裝 `webpack` 來打包寫好的程式，或是另外安裝其他套件來輔助 builder 開發。

{% note warning %}

當然，記得要使用 `npm i` 安裝套件。

{% endnote %}

### tsconfig.json

使用 TypeScript 開發必備的設定檔，簡單的內容如下：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist"
  }
}
```

由於接下來會使用到 node.js 的一些檔案操作 API，因此 `"module": "commonjs"`，另外設定 `"outDir": "./dist"` 來存放建置好 `*.js` 檔位置。

### src\generate-posts-json\index.ts

實際上 builder 程式碼的存放位置，稍後會在這裡撰寫相關的程式。

### src\generate-posts-json\schema.json

用來設定 builder 需要的參數，未來在執行 builder 時，可以預先檢查必要的參數有哪些，預設值為何等等。

### builders.json

用來設定這個套件下有哪些 builders 可用，執行程式的位置以及參數設定檔的位置，以下是個簡單的範例：

```json
{
  "builders": {
    "generate-posts-json": {
      "implementation": "./dist/generate-posts-json/index.js",
      "schema": "./src/generate-posts-json/schema.json",
      "description": "Generate posts json file."
    }
  }
}
```

## 撰寫第一個 builder

### builder 基本程式架構

有了專案目錄架構的基本概念後，就來撰寫第一個 builder 吧，我們已經建立了一個 `src/generate-posts-json/index.ts` ，接著在裡面填入基本的 builder 架構：

```typescript
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject { }

export default createBuilder(generatePostsJson);

function generatePostsJson(options: Options, context: BuilderContext): BuilderOutput {
  return { success: true };
}
```

* 第 4 行：用來設定相關參數的 interface。
* 第 6 行：呼叫 `createBuilder` 來建立一個 builder，裡面的參數為一個 function，在執行 builder ，實際上就是去呼叫這個 function。
* 第 8~10 行：實際上 builder 會執行的 function。
  * 這個 function 內包含兩個參數：
    * `options: Options`：傳入 builder function 的設定值。
    * `context: BuilderContext`：提供一些 builder 的資訊及工具，例如我們可以使用 `context.logger.info()` 來輸出訊息到 console 上。
  * 以及 `BuilderOutput` 回傳值，可以回傳 `BuilderOutput`、`Promise<BuilderOutput>` 以及 `Observable<BuilderOutput`

### 完成 builder 內容

接著我們就只需要設定 `Options` 以及將實際程式邏輯填入 builder function 即可，以我們前面提到的需求來說，程式碼如下：

```typescript
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import * as fs from 'fs/promise';

interface Options extends JsonObject {
  markdownPostsPath: string;
  targetJsonPath: string;
}

export default createBuilder(generatePostsJson);

async function generatePostsJson(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownFiles = (await fs.readdir(options.markdownPostsPath, { withFileTypes: true }))
    .filter(value => value.isFile() && value.name.endsWith('.md'))
    .map(value => value.name);

  if (markdownFiles.length === 0) {
    return { success: false, error: "No markdown files" };
  }

  const contentJson = {
    articles: markdownFiles
  }

  await fs.writeFile(options.targetJsonPath, JSON.stringify(contentJson));

  context.logger.info('Done');

  return { success: true };
}
```

## 設定需要參數

接著我們可以設定需要的參數，以便未來在執行 `ng` 指令時可以直接傳入參數，或從 `angular.json` 內設定；修改 `schema.json`

```json
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "required": ["markdownPostsPath", "targetJsonPath"],
  "properties": {
    "markdownPostsPath": {
      "type": "string"
    },
    "targetJsonPath": {
      "type": "string"
    }
  }
}
```

## 將 builder 加入 Angular 專案內

builder 與參數設定都完成後，最後一步是把 ts 檔傳成 js 檔，只要在 `builders` 目錄內執行 `npx tsc` 即可，最後確認一下 `builders.json` 內是否有設定可以使用的 builder，以及程式的位置是否正確，builder 這部分就算大功告成啦！

接著我們就要實際上在 Angular 專案內使用這個 builder，由於目前是單純的測試，因此在 Angular 專案內執行 `npm link ./builders` 即可將 builder 套件安裝進來。

{% note info %}

如果是發到 npm 上，當然就是使用 `npm i {套件名稱}` 來安裝。

{% endnote %}

安裝完後，打開 `angular.json`，並在正確的地方設定這個 builder，通常位置是在 `projects.{專案名稱}.architect` 下新增一個物件：

```json
"generate-posts-json": {
  "builder": "cli-builders:generate-posts-json",
   "options": {
     "markdownPostsPath": "src/assets",
     "targetJsonPath": "src/assets/posts.json"
   }
}
```

{% asset_img 03.png %}

如此一來就將 builder 整合到 Angular CLI 內啦，只要用 `ng run [專案名稱]:generate-posts-json` 指令就可以執行這個 builder。

相關的參數除了可以定義在 `angular.json` 外，也可以在執行時直接用 `--參數名稱 設定值` 來指定，如：

```shell
ng run [專案名稱]:generate-posts-json --target-json-path src/assets/demo.json
```

{% asset_img 04.png %}

# 持續運作的 builder

當 builder function 回傳為 `BuilderOutput` 或是 `Promise<BuilderOutput>` 時，只會執行一次就結束，但 builder function 也可以回傳一個 `Observable<BuilderOutput>`，此時會等到這個 Observable 物件「完成 (`complete`)」或「錯誤 (`error`)」才會終止，我們可以透過這種方式來建立一個持訊運作的開發伺服器，或是加入 watch mode，當觀察的目標有變動時，就重新執行一次相關邏輯。

以下範例將原來的 builder function 加入 watch mode，每當指定目錄內有 `*.md` 變更時，就會重新產生 json 檔。

```typescript
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import * as fs from 'fs/promises';
import { watch } from 'chokidar';
import { defer, Observable } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

interface Options extends JsonObject {
  markdownPostsPath: string;
  targetJsonPath: string;
  watch: boolean;
}

export default createBuilder(generatePostsJson);

function generatePostsJson(options: Options, context: BuilderContext): Observable<BuilderOutput> {
  const generateFile = async () => {
    const markdownFiles = (await fs.readdir(options.markdownPostsPath, { withFileTypes: true }))
      .filter(value => value.isFile() && value.name.endsWith('.md'))
      .map(value => value.name);

    const contentJson = {
      articles: markdownFiles
    }

    await fs.writeFile(options.targetJsonPath, JSON.stringify(contentJson));
  };

  const generateFile$ = defer(() => generateFile()).pipe(
    map(() => ({ success: true }))
  )

  const folderContentChange$ = new Observable(subscriber => {
    watch(options.markdownPostsPath).on('all', (_, path) => {
      if (path.endsWith('.md')) {
        subscriber.next(path);
      }
    });
  })

  if (options.watch) {
    // watch mode，當內容有變更時會重新產生檔案
    // 由於這個 observable 不會 complete，因此會持續執行
    return folderContentChange$.pipe(
      debounceTime(700),
      tap(() => context.logger.info('產生 json 中...')),
      switchMap(() => generateFile$),
      tap(() => context.logger.info('完成'))
    );
  } else {
    // 不是 watch mode，直接產生檔案並回傳結果
    // 由於這個 observable 會 complete，因此執行完就結束
    context.logger.info('產生 json 中...');
    return generateFile$.pipe(
      tap(() => context.logger.info('完成'))
    );
  }
}
```

{% note info %}

RxJS 好棒棒！

{% endnote %}

# 本日小結

在專案會來越複雜時，通常難以避免要自行撰寫一些程式來處理各種狀況，而透過 Angular CLI Builder API，可以幫助我們無縫整合到 Angular 專案內，與 `ng` 指令密切結合，同時省去許多不必要的設定如參數檢查(由 `schema.json` 協助)等等，讓開發體驗更上一層樓！

# 相關資源

- [Angular CLI Builders](https://angular.io/guide/cli-builder)
