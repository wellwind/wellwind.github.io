---
title: "搶先體驗 Angular 16 對 jest 的支援"
date: 2023-06-17 15:58:41
category: "Angular 大師之路"
tags:
  - Angular
  - Angular 16
  - Jest
---

Angular 16 時加入了[實驗性質的對 jest 的支援](https://blog.angular.io/angular-v16-is-here-4d7a28ec680d#1048)，以面對未來 Karma 棄用時的測試選項。而 jest 也已經逐漸變成前端測試的主流，因此這次就來看看 Angular 官方對 jest 目前的支援如何吧！

<!-- more -->

## 啟用 jest 測試

要改用 jest 測試很簡單，只要修改 `angular.json` 中 `test` 的 `builder` 即可：

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:jest",
          "options": {
            "tsConfig": "tsconfig.spec.json",
            "polyfills": ["zone.js", "zone.js/testing"]
          }
        }
      }
    }
  }
}
```

目前的選項還沒有那麼多，原來的 `assets`、`styles` 和 `scripts` 都要拿掉，這部分就看看以後 Angular 要如何處理這些選項了。

## 執行測試

按照 Angular blog 的說法，還需要安裝 `jest`，非常合理

```bash
npm i -D jest
```

不過實際執行測試會出現以下錯誤：

```txt
`jest-environment-jsdom` is not installed. Install it with `npm install jest-environment-jsdom --save-dev`.
```

其實也是合理的，要用 jest 進行前端測試，怎麼可以沒有 `jsdom` 環境支援。只可惜 Angular blog 沒有些清楚而已。裝起來就好了

```bash
npm i -D jest-environment-jsdom
```

之後執行測試

```bash
npm run test
```

一切順利，就可以看到類似如下的畫面啦：

{% asset_img 01.png %}

有在用 jest 測試的話對這些應該都不陌生！

同時也可以注意到，在執行測試後會產生一個 `dist/test-out` 目錄，來存放建置好的程式已進行測試，以 Angular 一貫的作風，未來很有幾會直接看不到這個目錄，節省認知負擔。

## 使用 jest 的 API

目前 Angular 官方做的 jest 支援，只針對 test runner 支援，不過測試程式撰寫上依然是使用 jasmine，如果喜歡使用 jest 可以依照以下步驟換掉：

1. 安裝 jest 型別定義

  ```bash
  npm i -D @types/jest
  ```

2. 修改 `tsconfig.spec.json` 的 `compilerOptions.types`，移除 `jasmine` 改用 `jest`

  ```json
  {
    "compilerOptions": {
      "types": ["jest"]
    }
  }
  ```

之後就可以使用 jest 的 API 來寫測試程式啦。由於 jest 和 jasmine 與的 API 幾乎都差不多，因此也不太需要做什麼修改。

另外，為了讓工具更好支援，也可以考慮把 karma 和 jasmine 相關套件都移除，以免開發工具以為你還在用 jasmine 而造成編輯器使用上的誤判。

## snapshot testing

jest 有一個非常好用的 snapshot testing 功能，可以直接把某個物件進行快照，之後測試只要再次比對即可，非常方便，這功能目前在看起來也是可以正常運作的

```typescript
expect(fixture.nativeElement).toMatchSnapshot();
```

產生的 snapshot 看起來大致長這樣

```typescript
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`CounterComponent should create 1`] = `
<div
  id="root0"
  ng-version="16.2.8"
>
  <p>
     0 
    <button>
      +
    </button>
  </p>
</div>
`;
```

根據之前 [jest-angular-preset](https://www.npmjs.com/package/jest-preset-angular) 套件的經驗，像是 `ng-xxx` 相關的標籤其實移除會比較穩定。

另外 `id="root0"` 這個會一直增加的流水號，也會造成測試的不穩定，不過這個問題連 jest-angular-preset 目前也沒處理。

不過當程式更新，snapshot 變動時，目前並沒有個比較適合的方法更新 snapshot，只能手動刪除 `dist/test-out` 下的 `__snapshots__` 目錄，讓 jest 重新產生 snapshot。

jest cli 有提供 `-u` 指令幫助我們更新，但是使用 `npx jest` 時還需要指定 preset 檔，這部分就不深入研究了，交給 Angular 團隊繼續努力吧！

## 本日小結

雖然目前 Angular 官方對 jest 的支援還是實驗性質，不過目前初步玩下來的感受已經是堪用了！不過如果想要做 snapshot testing 還是先等等。

現階段想要用 jest 測試 Angular 應用程式，搭配 jest-angular-preset 還是最好的選擇。不過未來 Angular 的官方支援依然非常令人期待，畢竟這種東西有官方支援還是比較令人安心啊。
