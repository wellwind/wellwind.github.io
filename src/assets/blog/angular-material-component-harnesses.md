---
title: "[Angular Material 完全攻略] 使用 Component Harness 寫出健全的測試程式"
date: 2020-02-08 19:18:32
category: "Angular Material完全攻略"
tags:
  - Angular
  - Angular Material
  - Angular CDK
  - ComponentHarnesses
---

Angular CDK 9 推出了新的 Component Harness 功能，方便我們更容易寫出強健、好閱讀的整合測試或 E2E 測試程式碼，而幾乎所有 Angular Material 元件也都有實作對應的 ComponentHarness，大幅節省開發人員在撰寫測試程式來測試元件所需要花費的力氣！到底 Component Harness 是什麼？又要如何幫助我們寫著更強健的測試呢？今天就來一窺究竟！

<!-- more -->

# 過去的整合測試與 E2E 測試

在前端開發時，E2E 測試通常都會實際模擬一些畫面上的互動，並測試互動後畫面的結果是否正常，也應此會大量使用到如 `document.querySelector` 這類的 API 來抓取畫面上的資訊。

而隨著現代化前端技術的發展，不管是 Angular、React 還是 Vue，開發人員都會開始將 HTML 輸出整合到 JavaScript 裡面，也就是畫面的 HTML 輸出也是程式的一部份，這麼做的一大好處就是連整合測試都可以更加容易測試到畫面結果(因為把 HTML 也視為程式的一部份)。

然而隨著畫面互動越來越複雜，以及對第三方 UI 元件的不熟悉，要找出畫面元件就變成一個艱鉅的任務！

以下面例子來說，畫面上的 `<mat-select>` 是 Angular Material 提供的 select 元件，如果要測試它的互動行為，我們得先想辦法找出畫面上對應 HTML 的位置，包含真正滑鼠按下時到底按到什麼元素，產出的下拉選單的元素結構等等，都要花費一段時間尋找出來，才能寫出正確的整合測試或 E2E 測試。

{% asset_img 01.jpg %}

在 Angular 中要測試這個 select 的相關行為，大概會寫出這樣的程式碼：

```typescript
it('should set selectedValue when select changed', async () => {
  const selectTrigger = fixture.debugElement
  	.query(By.css('.mat-select-trigger'));

  selectTrigger.triggerEventHandler('click', {});
  fixture.detectChanges();
  await fixture.whenStable();

  const options = document
  	.querySelectorAll('.mat-select-panel mat-option');
  options[1].dispatchEvent(new Event('click'));
  fixture.detectChanges();
  await fixture.whenStable();

  const expectResult = options[1].textContent.trim();
  
  expect(document.querySelector('.mat-select-value-text').textContent)
    .toContain(expectResult);
  expect(component.selectedAction)
    .toContain(expectResult);
});
```

實際上是花了不少時間釐清元件到底產出的 HTML 位置及結構，才能撰寫出正確的 DOM 操作；更麻煩的是，隨著 Angular Material 未來改版，這樣的結構有可能會改變，導致套件一更新測試就壞掉的窘境。

有鑑於此，Angular CDK 推出了 Component Harness 來簡化這個問題，同時目前幾乎所有的 Angular Material 元件也都有對應的實作！

# 簡介 Component Harness

Component Harness 的觀念基本上跟我們開發整合測試或 E2E 測試時常用的 PageObject 觀念基本上一樣，由於畫面邏輯非常容易隨著需求變更而改變，導致運行測試時產生許多不必要的麻煩，因此將一些預期可能會改變，或太過細節的部分封裝起來，以便測試程式呼叫時可以忽略這些細節，當畫面因應改變時，只需要修改封裝起來的程式碼部分就好了，其他測試程式完全不需要更動。

以上述例子來說，我們可以將選擇某個選項的邏輯封裝成類似如下的程式碼：

```typescript
const clickSelectOption = (index: number) => {
  const options = document.querySelectorAll('.mat-select-panel mat-option');
  options[index].dispatchEvent(new Event('click'));
};
```

要測試時只需要呼叫 `clickSelectOption()` 方法就好，不需要在意畫面細節，未來畫面需要更動時，也只需要調整這個方法就好。

而 Component Harness 就是基於這樣的概念，把所有常見的基本行為 (如 click 等等) 都先設計好，且每個元件會再針對元件本身功能可能的行為都預先設計好相關的 API 提供呼叫，如此一來想要針對第三方元件互動行為撰寫測試時，就可以省去不必要的元素操作，只需要專注在真正的行為即可！大幅節省測試程式撰寫時間，測試程式碼的**可讀性**也會更高！

不僅如此，Angular Material 每個元件的 Component Harness 程式碼也有自己的測試程式在保護，也就是說當未來套件升級時若有元件的畫面行為改變，第一個壞掉的一定是這些 Component Harness 對應的測試程式碼，Angular Material 開發團隊也會同時更新 Component Harness 程式，我們一般開發人員只要使用一致的 API 就好，不用擔心未來套件升級畫面結構改變帶來的後遺症，代表我們自行撰寫測試程式碼的**強健性**也更高了！

# 開始使用 Component Harness



講了這麼多，就讓我們來看看透過 Angular Material 元件的 Component Harness 到底該怎麼使用吧

範例程式碼：https://github.com/wellwind/angular-material-harness-demo

## 加入測試環境

首先在我們的 `*.spec.ts` 內，先加入 Component Harness 的測試環境

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
```

這是在使用 Karma 以及 Angular 的 [TestBed](https://angular.io/api/core/testing/TestBed) 進行測試時，所需要加入的程式，若要使用 Protractor 進行 E2E 測試，則改為：

```typescript
import {  ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
```

## 拿到 Component Harness 載入器

接下來我們要針對環境取得載入 Component Harness 的工具，以 Karma 的測試來說，在元件測試程式碼內 `beforeEach()` 時的程式會多一行取得載入器的程式：

```typescript
// import { HarnessLoader } from '@angular/cdk/testing';
let loader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(ButtonsAreaComponent);
  component = fixture.componentInstance;
  // 取得 Component Harness 載入器
  loader = TestbedHarnessEnvironment.loader(fixture); 
  fixture.detectChanges();
});
```

若是使用 Protractor，因為目標都是整個網頁，就相對簡單多了：

```typescript
const loader = ProtractorHarnessEnvironment.loader();
```

之後就能透過此 loader 拿到相關 Angular Material 元件的 Component Harness 了，拿到的 Component Harness 不管在 TestBed 或 Protractor 都會分享一樣的 API。

## 取得 Component Harness 並開始測試

接下來就是真正要拿到 Component Harness 啦！以之前說到的 `<mat-select>` 來說，Angular Material 有一個對應的 `MatSelectHarness`，當我們要拿到畫面上的 `MatSelect` 元件時，可以使用 `getAllHarnesses` 或 `getHarness`：

```typescript
it('should set selectedValue when select changed (harness)', async () => {
  // 取得所有的 MatSelectHarness
  const selectList = await loader.getAllHarnesses(MatSelectHarness);
  // 取得第一個 MatSelectHarness
  const select = await loader.getHarness(MatSelectHarness);
});
```

比起用 `document.querySelector('.mat-select')` 這種方式，真的是更好閱讀，也更加放心啊！！

另外要注意的是 Component Harness 所有的 API 回傳的都是 Promise，根據 Angular 團隊的建議，建議都使用 async / await 的方式來處理 Promise。

接下來我們就可以透過 `MatSelectHarness` 來跟 select 互動囉，以前面的測試例子來說，我們打開下拉選單，點擊第二個選項(index 為 1)，並確認該選項有被選起來：

```typescript
it('should set selectedValue when select changed (harness)', async () => {
  const select = await loader.getHarness(MatSelectHarness);
	
  // 打開下拉選單
  await select.open();

  // 點擊第二個選項
  const options = await select.getOptions();
  await options[1].click();

  // 使用 isSelected() 測試是否有被選中
  expect(await options[1].isSelected()).toBeTrue();
  // 確認是否正確繫結元件屬性
  expect(component.selectedAction)
    .toContain((await options[1].getText()).trim());
});
```

從上面程式可以看到，使用 `select.open()` 打開後，再使用 `select.getOptions()` 取得所有選項，這些選項其實也是 Component Harness (`MatOptionHarness`)，之後的 `click()` 、`isSelected()` 或 `getText()` 等 API，都是每個 Component Harness 自行定義好的，名稱也非常好理解；另外也可以發現原本變更偵測的 `fixture.detectChanges()` 與等待畫面完成的 ` await fixture.whenStable()` 程式不在了，這是因為 Componet Harness 幫我們做好這些步驟，因此我們再也不需要自己處理這些雜事，更加專注在商業邏輯，整個測試程式碼的可讀性可以說是大幅的提升啊！

# 進階 Component Harness 技巧

剛剛示範了基本的 Component Harness 使用方式，接下來來說明一些其他需要注意的技巧

## 使用 with 取得指定的 Component Harness

在上面測試程式中，使用 `getHarness` 只會拿到第一個，使用 `getAllHarness` 會拿到全部，在比較複雜的情境就會不容易使用，這時候可以使用像是 `MatSelectHarness.with()` 的方式，參數為一個 key-value 的物件，例如：

```typescript
const select = await loader.getHarness(
  MatSelectHarness.with({selector: '#action'}));
```

即可依照指定的 `selector` 條件尋找對應的 Component Harness。

基本上所有的 Component Harness 都支援三種

- `selector`：依照 CSS selector 條件找到元件的 Component Harness
- `ancestor`：依照 CSS selector 條件往父元件去找
- `text`： 依照文字尋找，可使用 regular expression

這些條件也可複合使用，如：

```typescript
const okButton = await loader.getHarness(
  MatButtonHarness.with({selector: '.confirm', text: /^(Ok|Okay)$/})
```



## 翻閱每個元件的 Component Harness API

要找出每個 Angular Material 元件的 Component Harness API，最好的方式當然是找文件啦！

再進入 Angular Material 文件後，找到指定的元件文件，在 API 頁籤就可以看到相關的 API 了(通常都在下方)

{% asset_img 02.jpg %}

但畢竟 Componet Harness 目前還很新，可能不是所有的 Component Harness 文件都上了，例如上面範例的 `MatSelectHarness` 在撰寫這篇文章時 (2020/02/08) 文件內還找不到，不過也不用擔心，通常都是元件類別如 `MatSelect`，後面加上 `Harness`，另外程式來源也是原始元件來源加上 `testing` 目錄，所以可以使用如下的規則加入 Component Harness 程式：

```typescript
import { [元件名稱]Harness } from '@angular/material/[元件]/testing';
```

加上 TypeScript 強型別的輔助，以及 Angular Material 每個 API 都有基本的文件註解，以及 API 名稱基本上都很好理解，要使用基本上都不會有問題

{% asset_img 03.jpg %}

## TestBed 下取得元件範圍外的 Componet Harness

在使用 TestBed 進行測試時，由於是針對一個元件下的畫面測試，而有些元件會產生會超過元件本身範圍的內容，單純使用 `loader(fixture)` 可能會無法正確取得外面的 Componet Harness，針對這部份，`TestbedHarnessEnvironment` 環境有提供其他的 API，來幫我們解決這個問題：

- `documentRootLoader(fixture: ComponentFixture<unknown>): HarnessLoader`
    - 從整個 fixture 所在的 HTML document 取得 HarnessLoader
- `harnessForFixture<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, harnessType: ComponentHarnessConstructor<T>): Promise<T>`
    - 跟 documentRootLoader 很像，但同時幫我們取得指定的 Component Harness，在一些動態的元件產生情境時使用

當然大部分的情境，使用預設的 `loader()` 就可以囉。

## 撰寫自己的 Component Harness

Component Harness 是一個非常好的概念，而且 Angular CDK 也提供了基本的 API 實作，若是專門撰寫通用元件的開發人員，強烈建議為所有的元件撰寫對應的 Component Harness，只需要繼承 [ComponentHarness](https://material.angular.io/cdk/test-harnesses/api#ComponentHarness)，並實做一些方法，就可以開始使用。可以參考[文件說明](https://material.angular.io/cdk/test-harnesses/overview#api-for-component-harness-authors)，也可以參考文章「[替我們的元件設計 Component Harness](https://wellwind.idv.tw/blog/2020/03/08/angular-material-writing-your-own-component-harness/)」。

## 根據不同平台撰寫 Component Harness 環境

Angular CDK 針對 Karma 與 Protractor 兩個測試框架內見了對應的 Component Harness 環境，這也是 Angular CLI 專案預設的測試架構，若有習慣使用其他的測試框架，也能自行撰寫 Component Harness 環境，可以參考[文件說明](https://material.angular.io/cdk/test-harnesses/overview#api-for-harness-environment-authors)，之後也會撰寫文章來介紹。

# 本日小結

使用第三方元件時撰寫整合測試或 E2E 測試一直以來都有 DOM 元素抓取的問題，往往耗去不少程式撰寫時間，而在這個版本 Angular CDK 加入 Component Harness 功能，讓每個元件都能封裝自己提供給測試程式碼的行為，確實大幅節省了測試程式的撰寫時間，也讓整體的測試程式碼更穩固也更好閱讀。Angular Material 的元件也都主動提供了 Component Harness，方便我們撰寫測試程式。相信未來幾個主流且相依 Angular CDK 的第三方元件庫也會開始跟進撰寫元件的 Component Harness，能使用 Angular 真的是太幸福啦！

# 相關資源

- [範例程式碼](https://github.com/wellwind/angular-material-harness-demo)
- [官方 API 文件 - Componet Test Harness](https://material.angular.io/cdk/test-harnesses/overview)
- [官方 Tutorial - Using Angular Material's component harnesses in your tests](https://material.angular.io/guide/using-component-harnesses)
