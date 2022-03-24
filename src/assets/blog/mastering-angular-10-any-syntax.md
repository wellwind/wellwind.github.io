---
title: "[Angular 大師之路] 樣板語法中的冷知識 - $any"
date: 2018-10-25 21:58:56
category: "Angular 大師之路"
tags:
  - Angular
  - $any
---

Angular 提供針對 HTML 樣板的處理，提供了很多不同的語法，今天要講一個很少看到有人使用的語法 - `$any`

<!-- more -->

**類型**：技巧

**難度**：3 顆星

**實用度**：3 顆星

先來看看問題，假設有一個元件如下：

```typescript
@Component({
  selector: 'app-root',
  template: `{{ data.value }}`
})
export class AppComponent {
  data = {};
}
```

這時候可以很容易的想像 `data.value` 一定是 undefined，畫面上是一片空白，這是很合理的事情，程式是可以正常運作的，只是沒有資料顯示罷了。

但當我們使用 production build 時，就會看到以下錯誤了：

{% asset_img 01.jpg %}

為什麼會有這樣的錯誤呢？這是因為當使用 production build 時，預設會開啟 aot build，而 aot build 則會將樣板預先打包成 JavaScript，這時候由於我們使用的還是 TypeScript，因此在做型別檢查時就會發生錯誤訊息。

既然是 TypeScript，當然最簡單的方式就是加上型別定義：

```typescript
data: {value?: number} = {};
```

又或者是宣告成 `any`：

```typescript
data: any = {};
```

都沒有問題，但是當程式越來越複雜，型別也越來越複雜時，有可能不這麼好做，由其實宣告明確型別的方式，有時候可能會覺得有點煩；如果想要偷懶一下的話，Angular 提供了在樣版將變數轉型成 `any` 的方法 - `$any`，我們可以透過 `$any(data)` 的方式在樣板上將變數轉成 any 型別！我們就不需要修改任何的 ts 檔，只要調整一下樣板就好了：

```typescript
@Component({
  selector: 'app-root',
  template: `{{ $any(data).value }}`
})
```

另外如果程式內沒有宣告變數，卻在樣板上使用某個變數時，aot build 也不會過，這時候可以改成將 `this` 轉成 any 型別：

```typescript
@Component({
  selector: 'app-root',
  template: `{{ $any(this).data }}`
})
```

透過這種方式，就不怕 production build 失敗啦。

不過最後還是要提醒一下，這只應該算是冷知識分享，在實務上不應該常用，最好還是應該把型別定義明確，才是最好的方法喔！
