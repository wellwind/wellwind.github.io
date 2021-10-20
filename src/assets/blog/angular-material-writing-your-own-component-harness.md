---
title: "[Angular Material 完全攻略] 替我們的元件設計 Component Harness"
date: 2020-03-08 15:02:16
category: "Angular Material完全攻略"
tags:
  - Angular
  - Angular CDK
  - Component Harness
---

在前一篇文章中我們介紹「[如何透過 Angular Material Component Harness](https://wellwind.idv.tw/blog/2020/02/08/angular-material-component-harnesses/)」來測試 Angular Material 的相關元件，省去許多自己使用 `querySelector` 的方式找到元件的麻煩，也可以避免未來元件改版破壞結構的麻煩，今天我們來看看如何替我們自己寫好的元件也設計對應的 Component Harnss，讓未來使用元件的人也能寫出更強健的測試程式碼！

<!-- more -->

# 實作一個 Component Harness

我們可以針對寫好的公共元件建立一個對應的 Component Harness，來幫助團隊成員撰寫測試程式碼時不需要理解元件的 HTML，就能執行對應的行為。

## 第一步：建立基本的 Component Harness

要替元件建立一個 Component Harness 的第一步，只需要撰寫一個繼承自 `ComponentHarness` 的類別，並簡易的加上一個 `hostSelector` 屬性即可：

```typescript
// ./buttons-area/testing/buttons-area-harness.ts
import { ComponentHarness } from '@angular/cdk/testing';

export class ButtonsAreaHarness extends ComponentHarness {
  // 通常就是元件本身的 selector 設定
  static hostSelector = 'app-buttons-area';
}

```

接下來在使用到這個 `ButtonsAreaComponent` 的元件中，就可以透過上面設定的 `ButtonsAreaComponentHarness` 來找到我們自行設計的元件啦！

```typescript
// ./app.component.spec.ts
it('should have a buttons-area component', async () => {
  const buttonsArea = await loader.getAllHarnesses(ButtonsAreaHarness);
  expect(buttonsArea.length).toBe(1);
});
```

## 第二步：針對元件的行為撰寫相關程式

我們可以針對元件相關的行為，在 Component Harness 撰寫特定的程式，例如：

```typescript
// ./buttons-area/testing/buttons-area-harness.ts
import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class ButtonsAreaHarness extends ComponentHarness {
  static hostSelector = 'app-buttons-area';

  getSelect = this.locatorFor(MatSelectHarness);
  getButton = this.locatorFor(MatButtonHarness.with({ text: 'GO' }));

  async selectActionAndClickButton(action: string) {
    const select = await this.getSelect();
    const button = await this.getButton();

    await select.clickOptions({ text: action });
    await button.click();
  }
}
```

在上面程式碼中，我們使用 `this.locatorFor()` 的方式，取得元件內其他的 Component Harness，除了直接指定某個 Component Harness 外，我們也可以直接指定 selector，如：

```typescript
const getSelect = this.locatorFor('mat-select');
```

當然此時拿到的就不是 Component Harness 了，而是一個 [TestElement](https://material.angular.io/cdk/test-harnesses/api#TestElement)。

另外要注意的是，使用 `locatorFor()` 時並不會立刻取得畫面上的元素或是 Component Harness，而是先回傳一個 function，當我們呼叫這個 function 後，才會真正去取得畫面上的資訊，這麼一來就可以不用擔心因畫面改變而過時。

```typescript
// 此時的 getSelect 是一個 function
const getSelect = this.locatorFor(MatSelectHarness);
// 無論畫面改變，都不會影響 getSelect
// 當真正呼叫時，才會得到畫面上的資訊
const select = getSelect();
```

要撰寫測試時程式碼就簡單多啦！

```typescript
// ./app.component.spec.ts
it('should call #getAction of component', async () => {
  spyOn(component, 'getAction');
  const buttonsArea = await loader.getHarness(ButtonsAreaHarness);
  await buttonsArea.selectActionAndClickButton('Save');
  expect(component.getAction).toHaveBeenCalledWith('Save');
});
```

## 第三步：替 Component Harness 撰寫測試

這步驟雖然不是必要，但畢竟 Component Harness 依然是程式碼，所以撰寫對應的測試案例也是非常合理的事情，這麼一來也可以提早發現修改程式過程產生的錯誤！

在撰寫測試 Component Harness 的程式碼時，應該以實際上可能怎麼去使用為思考，通常會先寫一個假的元件來使用寫好的共用元件，然後透過 `TestbedHarnessEnvironment.loader(fixture)` 的方式取得 loader 並再得到寫好的 Component Harness，並執行相關行為，測試行為是否符合預期。

這種方式在 Angular 的測試文件中也有說明：[參考文件](https://angular.io/guide/testing#component-inside-a-test-host)

以這邊的例子來說，AppComponent 的測試案例其實就是 Component Harness 的測試案例，就不多做說明了。在實務上，負責撰寫共用元件的人在開發時期不一定有真正用到此元件，因此應該是將 `app.component.spec.ts` 的程式碼，移動到 `buttons-area-harness.spec.ts` 內進行測試。當未來其他團隊成員使用這些元件時，再使用寫好的 Component Harness 撰寫自己的測試程式碼。

# Component Harness 其他功能

接下來我們來介紹一些其他重要的功能，讓我們能撰寫出更靈活的 ComponentHarness 程式

## ComponetHarness 相關 API

- `host`：取得 ComponentHarness 本身，型別為 [TestElement](https://material.angular.io/cdk/test-harnesses/api#TestElement)。
- `locatorFor`：如同前面說明，可以依照 ComponentHarness 或 selector 取得指定的「第一個」目標，回傳為一個 function，在真正呼叫此 function 時才會進行尋找的動作；由於是 promise，當找不到時會 reject 掉，同時測試會直接失敗。
- `locatorForOptionl`：與 `locatorFor` 功能一樣，唯一的他別再找不到時會得到 `null`，不會直接失敗。
- `locatorAll`：一樣回傳一個 function，但會依照指定的 ComponentHarness 或 select 找到「所有符合」的目標。

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#finding-elements-in-the-component-39-s-dom)

## TestElement 相關 API

TestElement 是所有取得畫面元素的底層，包含了許多基礎的 API，來進行基本的 DOM 元素操作，例如當我們直接觸發元素的 click 事件時，程式碼看起來如下：

```typescript
await this.host().click();
```

由於相關 API 不少，名稱也很直覺，可以直接上文件去看看。

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#working-with-code-testelement-code-instances)

## HarnessPredicate 功能

為了讓 Component Harness 更好用，更容易找到對應的內容，通常會在撰寫一個靜態的 `with` 方法，例如：

```typescript
const select = await loader.getHarness(
  MatSelectHarness.with({ selector: '.specified-select'})
);
```

之後在取得 Component Harness 時，可以透過這個方法更進一步篩選要取得的目標，要達成這個目標，就需要搭配 `HarnessPredicate` 功能。

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#filtering-harness-instances-with-code-harnesspredicate-code-)

### 繼承 BaseHarnessPredicate

```typescript
import { BaseHarnessFilters } from '@angular/cdk/testing';

interface ＭySelectHarnessFilters extends BaseHarnessFilters {
  /* 撰寫過濾規則相關的屬性 */
  withOptions: string[];
  ...
}
```

### 設計 with 方法

```typescript
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

class MySelectHarness extends ComponentHarness {
  static hostSelector = 'my-select';

  static with(
    options: ＭySelectHarnessFilters
  ): HarnessPredicate<MySelectHarness> {
    return new HarnessPredicate(MySelectHarness, options).addOption(
      'with options',
      // 指定 withOptions 這個過濾選項屬性
      options.withOptions,
      (harness, filterOptions) => {
        // ...
        // harness 代表單純使用 hostSelector 找到的內容
        // filterOptions 代表要過濾的設定值
        // 回傳一個 Promise<boolean> 
        return Promise.resolve(true);
      }
    )
    // 有其他過濾選項時，再逐個加入
    .addOption(...);
  }
}
```

## HarnessLoader

當使用 `<ng-content>` 時來允許使用者加入更多內容時，可以使用 `harnessLoaderFor` 來透過 selector 取得裡面內容，使用起來與 `locatorFor` 非常類似，只是只能傳入 selector。

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#creating-a-code-harnessloader-code-for-an-element)

## 找出 ComponentHarness 外的元素

當使用 CdkOverlay 這類功能時，會在 ComponentHarness 範圍外產生內容，此時可以使用 `documentRootLocatorFactory()` 來找到外部的內容：

```typescript
 const rootLocator = this.documentRootLocatorFactory();
 const popupContent = rootLocator.harnessLoaderFor('my-popup-content');
```

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#accessing-elements-outside-of-the-component-39-s-host-element)

## 非同步處理

呼叫 `TestElement` 相關的 API 時，都會強制幫我們觸發變更偵測，不過當使用 Angular Animations 時，會有額外的非同步行為發生，可能會導致畫面不正確，此時可以使用 `forceStabilize()`，等待 `NgZone` 真正穩定。

有些時候為了效能考量，會使用 `NgZone` 的 `runOutsideAngular` 來讓直行程式碼不被 `NgZone` 處理，此時可以使用

 `waitForTasksOutsideAngular`，來等待 `runOutsideAngular` 內的程式完成後才繼續。

[參考文件](https://material.angular.io/cdk/test-harnesses/overview#waiting-for-asynchronous-tasks)

# 本日小結

ComponentHarness 真的是個非常強大的功能，我們可以替開發出來的共用元件撰寫出對應的 ComponentHarness，讓未來其他人要使用元件時，也能更加容易地寫出測試程式，而且同一份程式碼，在 Karma 和 Protractor 都可以使用，實在是太方便啦！

# 相關資源

- [範例程式碼](https://github.com/wellwind/angular-material-harness-demo)
- [官方 API 文件 - Componet Test Harness](https://material.angular.io/cdk/test-harnesses/overview)
