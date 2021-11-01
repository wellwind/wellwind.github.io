---
title: "[Angular 大師之路] 更加理解 Angular CLI 之 Monorepo 應用"
date: 2018-10-17 11:26:20
tags:
  - Angular
  - Angular CLI
  - Angular CLI 6
  - Monorepo
---

Angular CLI 基本上已經成為開發 Angular 應用程式的標準配備了，我們會透過 Angular CLI 建立專案、檔案骨架，或是用來執行以及打包應用程式，以及運行測試等等。透過 Angular CLI 可以減少許多開發時期以及執行程式的前置準備時間成本，讓生活變得更加美好！

而到了 Angular CLI 第 6 版後，多了非常多和過去不同的設定，雖然在常用的功能體驗上完全沒有不同，但卻有了更多可以調整的地方，今天就來更加深入理解 Angular CLI 的相關指令、設定與應用吧。

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：4 顆星

在 Angular CLI 中，我們應該已經非常熟悉使用 `ng new`、`ng generate` 或 `ng serv` 等指令了，因此我們就不多做說明，只針對 Angular CLI 6 之後的指令說明囉。

# ng-add 與 ng-update

`ng add` 與 `ng update` 是 Angular CLI 升到第 6 版後，多了兩個非常有用的指令，只要某個 Angular 相關的套件，實作了特定的程式([@angular-devkit/schematics](https://www.npmjs.com/package/@angular-devkit/schematics))，就能用 `ng add 套件名稱` 的指令，快速將套件裝到專案中，同時完成許多的前置設定。

舉例來說，根據熱門套件 [Angular Material 的安裝說明](https://material.angular.io/guide/getting-started)，需要 6 個步驟才算安裝完成；但由於 Angular Material 的套件實做了 schematics ，因此能輕易地使用 `ng add @angular/material` 指令，輕鬆搞定所有麻煩的安裝步驟！

除此之外，支援 schematics 的程式，也可以把每次升級要異動的腳本寫好，之後就能使用 `ng update 套件名稱` 的指令，一次將套件更新時需要手動調整的部分一口氣完成！可以說是非常的方便！！

一樣以 Angular Material 的例子來看，在第 5 版準備升級到第 6 版時，為了讓所有的 API 更加有一致性，根據官方的 [CHANGELOG](https://github.com/angular/material2/blob/master/CHANGELOG.md#600-beta5-2018-03-23) 出現了將近 70 條的 breaking changes，就算不是每條在專案中都會用到，要逐一比對也是一件極大的工程！而有了 `ng update` 指令，我們只需要使用 `ng update @angular/material` 即可一鍵升級，完成整個更新度動作，並且自動把 breaking chages 的部分自動修正，真的是非常強大。

多虧了這樣的架構，未來我們在使用 Angular 或相關套件時，都能更加快速無痛的升級，關於這一切背後的技術－Schematics，之後有機會再來說明囉。

# 認識 angular.json 結構

在 Angular CLI 1.x 版時建立出來的專案，所有的相關設定都在 `.angular-cli.json` 之中；而使用 Angular CLI 6 建立的專案，則是改到了 `angular.json` 之中。

一個使用 Angular CLI 6+ 建立好的 Angular 專案中的 angular.json 內容大致如下(省略部分內容)：

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "demo": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {
        ...
      }
    },
    ...
  },
  "defaultProject": "demo"
}
```

關於這些設定中的重點說明如下：

## $schema

`$schema` 主要用來放置 `angular.json` 可以使用的相關設定說明檔案位置，這是一個 [JSON Schema](https://json-schema.org/) 檔案，由於使用 json 檔當作設定已經漸漸變成主流，但這些設定檔往往沒有一個準則可以遵循，於是出現了 JSON Schema 的規範，JSON Schema 檔也是一個 JSON 檔案，但它是用來描述另一個 JSON 檔內可以使用的欄位、型別、可用資料等等，因此也可以想像成是 JSON 檔的 metadata，假設編輯器或 IDE 有支援 JSON Schema 的話，再使用時就能夠跳出對應的自動完成選項，如下圖使用 Visual Studio Code 編輯 `angular.json` 時的畫面：

{% asset_img 01.jpg %}

## projects

`projects: {}` 中放置所有可以被管理的專案，由於 Angular CLI 6 後加入了 monorepo 的觀念，因此在建立專案時，不在像過去一樣只有一個專案目錄以及測試案例；我們可以透過 `ng generate application` 或 `ng generate library` 指令來建立更多不同類型的專案。

{% note info %}

傳統的專案管理方式多為所謂的Singlerepo，也就是一個 git repository 管理一個專案(或 package)的觀念，好處是每個 git repository 比較單純；而在專案中有許多共用程式時，使用 Monorepo 則可能是一個比較理想的管理方式，一個 git repository 裡會有多個專案(或 package)，在有程式共用需求時，比較能快速找到相關的原始碼。

{% endnote %}

在 `projects` 物件裡面的每個屬性，都是一個專案名稱，而這個專案名稱裡面可能會有以下設定

- `root`：代表整個專案所在的位置，通常此目錄會在包含額外的設定檔

- `sourceRoot`：代表這個專案真正程式碼所在目錄

- `projectType`：專案的類型，目前有 `application` 與 `library` 兩種

- `prefix`：建立檔案時的 CSS selector 前綴，例如當我們下 `ng g c demo` 時，產生的 demo.component.ts 檔中，會有個 selector 設定為 `selector: 'app-demo'`，這裡的 `app-` 前綴即可在 `prefix` 中設定

- `schematics`：Angular CLI 建立程式骨架的來源是使用 `@angular-devkit/schematics` 套件，而 `schematics: {}` 中可以設定相關指令預設的選項，例如我們希望建立出來的元件都使用 scss

- ```json
  "@schematics/angular:component": {
    "styleext": "scss"
  }
  ```

  `@schematics/angular` 是 Angular 真正用來產生相關程式碼所使用的套件，後面接的 `component` 代表是要建立的程式類型，在裡面則可以設定這個類型允許使用的參數內容。

- `architect`：可以使用的指令名稱，每個名稱內會有各自要執行的程式設定，例如一段名為 `serve` 的指令設定如下

- ```json
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
       "browserTarget": "demo:build"
    },
    "configurations": {
      "production": {
        "browserTarget": "demo:build:production"
      }
    }
  }
  ```

  - `builder`：代表實際上要運行的程式，從這樣的架構我們也不難看出來 `builder` 是可以依照自己的需要擴充的。

  -  `options`：代表預設的參數
  - `configurations`：代表在不同的模式要替換的參數，以上述設定的例子來說，就是在 production 模式下，原來 `browserTarget` 設定為 `demo:build`，要改為使用 `demo:build:production`

## newProjectRoot

使用 `ng generate application` 或 `ng generate library` 建立新專案時的專案位置。

## defaultProject 

由於 Angular CLI 6+ 架構加入了 monorepo 的觀念，因此一個目錄內可能會有數個 Angular 專案，這麼一來當使用 `ng serve` 等指令時，就無法得知要處理哪個專案才對，因此 defaultProject 就是當沒有指定要用哪個專案時，預設使用的專案名稱。

# Monorepo 應用

在一般情境下，我們都只需要使用 `angular.json` 內建的設定就好，之後要使用 `ng serve 或` `ng build` 指令都沒什麼問題，但在 Angular CLI 6+ 加入 monorepo 支援後，若要使用 monorepo 的話，就需要額外知道一些技巧：

{% note info %}

當然，若沒有 monorepo 需求的話，就不需要特別注意這部分

{% endnote %}

## 建立多個應用程式

我們可以使用 `ng generate application [project-name]`指令來建立多個專案，建立的專案會放在 `angular.json` 所設定的 `newProjectRoot` 目錄中，並且在 `angular.json` 的 `projects: {}` 中加入這個專案的相關設定。

## 建立共用元件庫

當專案有共同程式，或整個專案本身建立的目標就是打造公用的程式時，可以使用 `ng generate library [lib-name]` 來建立共用的程式庫，此時 Angular CLI 會幫我們建立一個程式庫專案，在這個專案裡面我們一樣可以建立元件、服務等等程式，但最終目的則是共用這裡面的程式碼。

同時 Angular CLI 將可以幫著我們把此專案建立(build)成一般 Angular 應用程式看得懂的模組，只需要再使用 `npm publish` 指令，就能夠輕鬆將整個套件上傳到 npm 中，提供給他人使用，要與他人共享程式再也不是一件難事啦！

## Monorepo 應用情境

什麼時候會有 monorepo 的需求呢，大致上有兩種情況適合：

### 多應用程式

例如當有一個專案需求是建立一個官方網站，以及一個對應的後台時，除了有兩個站台的需求以外，甚至可能會有兩個站台需要使用同樣程式碼的需求，就能夠使用以下指令，同時建立兩個專案，以及共用的元件庫：

```shell
ng generate application frontdesk
ng generate application dashboard
ng generate library share-libs
```

### 共用元件庫

當我們的目的是建立共用元件庫時，可以先使用 `ng generate library` 建立元件庫的核心，再使用 `ng generate application` 建立不同應用的示範網站，如果有依照此核心延伸的元件庫，則可以在建立更多的 library。

```shell
ng generate library core
ng generate library extend
ng generate application demo
```

## ng run 指令

當有多個應用程式或元件庫時，如果要使用 `ng build`，該怎麼知道是要處理哪個專案呢？我們已經知道可以在 `angular.json` 中設定 `defaultProject` 來決定預設的專案，但是難道要處理別的專案時都要手動去改嗎？當然不是囉，這時候我們可以使用 `ng run` 指令，來決定使用哪個專案即哪個執行方式，`ng run` 的基本使用方式如下：

```shell
ng run <project>:<architect>[:configuration] [...options]
```

`<project>` 指得就是在 `angular.json` 中 `projects: {}` 中指定的名稱，而 `<architect>` 則是從專案中設定的 `architect: {}` 中選擇，假設有一個專案在 `angular.json` 中設定如下

```json
"projects": {
  "dashboard": {
    "architect": {
       "build": { ... },
       "serve": { ... }
    }
  }
}
```

這時候就可以使用 `ng run dashboard:build` 或 `ng run dashboard:serve` 來執行這裡面的程式；若有設定 `configurations: {}` 時，則可以針對設定的模式使用不同的選項參數，另外也可以再額外指定不同的執行選項 (options)，例如：

```shell
ng run demo:serve:production --port=4201
```

以上指令會執行 demo 專案中的 serve 程式，並使用其 `configurations` 中的 `production` 設定來取代原有的選項，同時額外設定使用 `--port` 選項，指定內容為 4201。

了解 `ng run` 指令後，就能夠隨心所欲決定要執行哪些專案以及參數啦！

# 本日小結

今天我們介紹了 Angular CLI 6+ 以上的新架構，以及學會了 monorepo 的操作技巧，有了這些知識，就能夠更加細緻的去設定 Angular CLI 的各種選項，又能夠彈性的用不同的組合執行程式，搭配出無限的組合，讓設定更加輕鬆寫意！

# 相關資源

- [Angular CLI Wiki](https://github.com/angular/angular-cli/wiki)
- [Monorepo - All You Ever Wanted to Know About Monorepos but Were Afraid to Ask](https://gomonorepo.org/)
  - 關於 Monorepo 相關的名詞解釋
- [Customizing Angular CLI 6 build — an alternative to ng eject](https://codeburst.io/customizing-angular-cli-6-build-an-alternative-to-ng-eject-a48304cd3b21)
  - 若有需要自行擴充 builder 可以參考此篇文章
- [What's new in Angular CLI 6.0?](https://blog.ninja-squad.com/2018/05/04/angular-cli-6.0/)

- [Schematics - An Introduction](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2)
