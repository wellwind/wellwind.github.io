---
title: "[Schematics 實戰] 從範本快速產生檔案"
date: 2019-12-15 21:14:50
tags:
  - Schematics
---

在學會[撰寫第一個 Schematics](https://wellwind.idv.tw/blog/2019/12/01/schematics-workshop-02-getting-started-cli/) 後，我們已經了解該如何使用 `tree` 來產生檔案，但有時候難免會遇到一些狀況，需要一次產生較多有關連的檔案，例如 Angular 的 component，預設就會產生 4 個相關連的檔案，雖然我們也能將這些檔案逐一用 `tree` 產生，但若能有個預設的範本，產生時只要置換裡面的一些變數就好，維護起來將會更加容易！今天就來看看如何在 Schematics 內使用某個來源範本產生檔案吧！

<!-- more -->

# 建立範本

第一步驟當然是先建立一個 Schematics，這部分可以使用 [Schematics Snippets](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets) 的 Visual Studio Code 套件快速產生，之前的文章也已經提過，這裡就不多說明。

## 建立範本目錄

首先我們先建立一個 `files` 目錄，用來放置要產生的範本檔案來源，另外裡面再建立一個目錄，名稱為 `__name@dasherize__`，程式會將這樣的格式進行名稱的轉換，這裡的格式是：

1. 首尾用兩個底線 `__`，當範本轉換時，會自動辨識裡面的內容，並且做替換
2. 兩個底線內，放入要取代的變數名稱，如 `__name__`，當我們傳入一個 demo 作為 `name` 變數時，就會自動產生對應的檔案或目錄
3. 我們也可以讓這個變數傳入某個方法內，格式是 `名稱@方法`，如 `dasherize` 是一個方法，此時 `name@dasherize`可以想像成一般程式內執行了 `dasherize(name)`。

至於這個 `name` 變數和 `dasherize` 方法內容從哪裡來，稍後會介紹。

## 建立範本檔案

接著我們先建立一個檔案，命名為 `__name@dasherize__.component.ts.template`，用來存放要產生的範本。

接著我們就可以簡單建立一個範本內容，舉個例子，如果我想要產生一個簡單的 Angular Component 元件，大概看起來會像這樣：

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  template: '<h1>Hello {{ title }}'
})
export class DemoComponent implements OnInit {
  title = 'demo';

  constructor() { }

  ngOnInit() { }
}
```

在這裡面，元件的名稱是應該要能夠被替換的，我們可以使用 `<%= 變數 %>` 這樣的語法，來設定範本內的資訊，變成如下：

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>',
  template: '<h1>Hello {{ title }}'
})
export class <%= classify(name) %>Component implements OnInit {
  title = '<%= name %>';

  constructor() { }

  ngOnInit() { }
}
```

這裡我們可以看到，使用了 `<%= %>` 的方式，印出了一些變數，同時也在不同地方分別呼叫了 `dasherize()` 和 `classify()`，這些函數是 Schematics 內建的一些工具，用來轉換文字的類型，例如：

- `dasherize`：將名稱全部轉為小寫，並以 dash 隔開，例如 `ClassName` 變成 `class-name`
- `classify`：將名稱變成常用類別的名稱定義，例如 `class-name` 變成 `ClassName`

## 檔案結構回顧

完成以上步驟後，目前目錄結構看起來如下：

{% asset_img 01.jpg %}

## 範本語法參考

- `<%= expression %>`：將變數印在範本內，因為是顯示用，因此不該在這裡面使用 `for` 或 `if` 等程式
- `<%- expression %>`：行為非常類似，但插入的內容若為 HTML 會進行 escape 動作
- `<% inline code %>`：通常是用來處理結構用的， `for` 和 `if` 等程式行為都會放在這裡面，e.g: 

```html
<% if(name === 'Mike') { %>
  <%= 'Mike' %>
<% } else { %>
  <%= 'Others' %>
<% } %>
```

- `<%# text %>`：僅作為註解用，不會產生任何內容

# 在 Schematics 內使用範本並套用相關變數

接著我們就要實際將來源範本的內容變更，並合併到我們的檔案系統內啦！

## import 用到的工具程式

這裡我們要先匯入 Schematics 提供的一些工具

```typescript
import { apply, url, applyTemplates, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-import-apply-merge-templates` 快速產生相關程式碼

{% endnote %}

## 套用來源範本

接著在預設的 rule 內使用以下程式，處理檔案：

```typescript
const templateSource = apply(url('./files'), [
  applyTemplates({
    classify: strings.classify,
    dasherize: strings.dasherize,
    name: _options.name
  }),
  move(normalize(_options.path as string))
]);
return chain[mergeWith(templateSource)];
```

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-apply-merge-templates` 快速產生相關程式碼

{% endnote %}

稍後我們會解釋裡面的內容，我們先試著建制程式看看，會出現以下訊息：

{% asset_img 02.jpg %}

由於 Schematics 預設建立的 TypeScript 專案會檢查變數是否未被使用，目前我們的程式內都沒有用到 `tree` 物件，因此會報錯，修改方式很簡單，把變數前面加個底線變成 `_tree` 就可以了。

{% note info %}

當然之後如果有用到 `tree`，就可以大方的改回來了

{% endnote %}

接著我們就可以試著用指令從範本建立檔案啦！例如使用以下指令：

```shell
schematics .:exercise-3 --name=Mike --path=folder --dry-run=false
```

成果如下圖

{% asset_img 03.jpg %}

我們如願的產生了相關的檔案！雖然看起來步驟有點多，但其實一點都不難對吧！

## 程式碼說明

接著我們來說明一下程式吧，這段產生檔案用的程式碼可以大致分成幾個部分：

1. 使用 `apply` 將指定的的來源 (source)，套用指定的 rules 陣列；source 的概念跟 tree 很像，只是它不代表目前的檔案系統，可以想像成另外獨立的檔案系統來源
2. 使用 `url('./files')` 將指定目錄作為來源
3. 使用 `applyTemplates` 這個 rule，將來源內容進行變更，這個 rule 會傳入一個物件參數，這個參數的每個 key 都會被當作範本內的變數名稱使用，以上述程式為例子：
    - `classify`：使用 `@angular-devkit/core` 內的 `strings` 工具類別內的 `classify` 方法
    - `dasherize`：同上，只是換成 `dasherize` 方法
    - `name`：指令參數 (options) 的 `name` 屬性
4. 完成 `applyTemplate` 的 rule 套用後，再使用 `move` 這個 rule
5. 最後使用 `mergeWith` 這個 rule，將完整的來源 (source) 合併到檔案系統內

程式內還有個 `chain` ，其實可以不使用，主要是通常在撰寫 Schematics 時，隨著情境複雜，不會只有套用檔案範本而已，還會套用其他多個內建或自行開發的 rule，而使用 `chain` 則可以將這些 rule 都組合起來，例如：

```typescript
function deleteFile(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (tree.exists('fakefile')) {
      tree.delete('fakefile');
    }
    return tree;
  };
}

function generateFiles(_options: any): Rule {
  const templateSource = apply(url('./files'), [
    applyTemplates({
      classify: strings.classify,
      dasherize: strings.dasherize,
      name: _options.name
    }),
    move(normalize(_options.path as string))
  ]);
  return mergeWith(templateSource);
}

export function exercise3(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      deleteFile(), 
      generateFiles(_options)
    ]);
  };
}

```

上面程式中，我們建立個一個名為 `deleteFile` 的 rule，同時將從範本產生檔案的程式抽出成 `generateFiles` rule，最後再使用 `chain` 方法將兩個 rule 結合起來，依照帶入的順序執行，如此一來主程式將會變得更將容易閱讀！

{% note info %}

有安裝 Schematics Snippets 套件的話，可以使用 `sch-rule` 快速產生 rule 相關程式碼

{% endnote %}

# 本日小結

很多時候我們會需要產生一系列的相關檔案，透過 `@angular-devkit/core` 及 `@angular-devkit/schematics` 提供的相關工具及 rule，要產生相關檔案變得容易許多。雖然我們可以直接使用 code snippet 的方式快速產生程式碼骨架，但理解每個 rule 和工具方法後，要變化就會變得容易許多了！快去嘗試產生自己專案內部用的範本吧！！
