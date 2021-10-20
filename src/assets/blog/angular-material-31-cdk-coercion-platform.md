---
title: "[Angular Material完全攻略]Angular CDK(7) - Coercion、Platform"
date: 2018-01-18 19:56:25
category: "Angular Material完全攻略"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

今天我們來講兩個Angular CDK文件上沒有介紹，但很有機會使用到的~~隱藏版~~功能，分別是**型別轉換(coercion)、平台偵測(platform**)。

<!-- more -->

## 關於Angular CDK的Coercion

在之前那麼多天介紹Angular Material的元件時，不知道你有沒有發現一件有趣的事情，以曾經介紹過的`<mat-chip>`為例，當我要設定`selected`屬性時，當時是這麼寫的：

```html
<mat-chip selected="true">JavaScript</mat-chip>
```

我們都知道要處理屬性綁定(property binding)時，如果資料是`number`、`boolean`或變數名稱之類的話，應該要用中括號`[]`把屬性包起來，如：`[selected]="true"`，否則傳進去的直指會被當作是`string`，如果是單純的字串，則`[property]="'string'"`或`property="string"`都是可以的。

因此假設我們以`selected="false"`撰寫的時候，程式中若這樣判斷

```typescript
if(selected) {
    // do something
}
```

這樣的條件還是會進入的，因為字串`'false'`，在if檢查時是會過的，要真正的boolean值`false`，才不會進入。

偏偏上面提到的`selected`很有趣，寫成`selected="true"`會被選取沒有問題，而寫成`selected="false"`也完全沒問題不會被選取，因為Angular Material都幫我們處理好這種小細節了！

這時候我們可以想看看這個用來處理`true`或`false`的屬性`selected`，它明明是一個`<mat-chip>`的`@Input`，但偏偏它又可以不用中括號設定非字串資料，那他宣告的型別到底要是`string`還是`boolean`呢？如果是`string`，後續又該如何處理？

其實我們不用想太多，因為這種貼心小細節在Angular Material中被使用的機會太高了！因此也被拉到Angular CDK中，也就是型別轉換功能－**coercion**。

至於該怎麼使用呢？我們繼續往下看。

## 開始使用Angular CDK的Coercion

Coercion只有三個現成的方法，方便我們做型別轉換，不需要加入任何module，直接使用就可以了！

### 使用coerceBooleanProperty

`coerceBooleanProperty`是用來把輸入內容轉成boolean的一個方法，它的邏輯很簡單，輸入的參數若是`null`或字串的`'false'`，就會被當作boolean的`false`。

因此我們可以為我們的元件加入一個可以接受字串`'false'`當作boolean的屬性，例如：

```typescript
// 記得import這個方法
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({ ... })
export class CoercionDemoBoxComponent implements OnInit {
  private _display: boolean;

  @Input()
  get display(): boolean {
    return this._display;
  }

  // value: boolean，代表預期的參數型別是boolean
  // 但我們都知道，javascript其實是弱型別語言
  set display(value: boolean) {
    // 就算傳進來是string，也會被轉成boolean
    this._display = coerceBooleanProperty(value);
  }

  someMethod() {
      if(display) {
          // do something
      }
  }
}
```

這時候我們就可以使用

```html
<!-- display會被當作boolean的true -->
<app-coercion-demo-box display="true"></app-coercion-demo-box>
```

或是

```html
<!-- display會被當作boolean的false -->
<app-coercion-demo-box display="false"></app-coercion-demo-box>
```

就不用再多花力氣加上中括弧`[display]="false"`，看起來也更加清爽！

#### 使用coerceNumberProperty

跟剛剛介紹的`coerceBooleanProperty`一樣的意思，`coerceNumberProperty`是用來幫助我們把傳入的資料強制轉為number的工具方法，例如`'100.5' + 10`的結果是`'100.510'`，這只要有一定JavaScript經驗的開發人員都知道，而透過`coerceNumberProperty('100.5') + 10`就能夠得到`110.5`的結果啦！

另外我們`coerceNumberProperty`的第二個參數，也能幫助我們設定當轉成number失敗時，預設的值是多少(沒填的話預設為0)，例如`coerceNumberProperty('xxx')`就會得到結果為`0`。

以下面程式碼為例：

```typescript
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({ })
export class CoercionDemoBoxComponent implements OnInit {
  private _height: number;

  @Input()
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = coerceNumberProperty(value);
  }
}
```

component的內容為：

```html
<p>
  我的高度是 {{ height }}，再加上10會變成 {{ height + 10 }}
</p>
```

這時候使用上就可以在設定`height`屬性時不用加上中誇號啦！

```html
<app-coercion-demo-box display="true" height="10"></app-coercion-demo-box>
```

#### 使用coerceArray

有前面兩個方法的經驗，應該不難猜出來`coerceArray`的用途就是把資料轉為陣列，當使用`coerceArray<number>(1)`的時候，就會得到結果`[1]`，如此一來我們就能讓我們的屬性接受單一值或陣列值，反正到component時我們都用程式轉為陣列啦！

{% note info %}

跟前面的`coerceXxxxxProperty`不一樣，這個方法名字為`coerceArray`，沒有`Property`後綴，要特別注意。

{% endnote %}

## 開始使用Angular CDK的Platform

在Angular CDK中，把瀏覽器支援度相關的功能放在Platform分類中，我們需要先加入`PlatformModule`：

```typescript
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  exports: [
    OverlayModule
  ]
})
export class PlatformModule {}
```

如此便可使用`Platform` service來得知目前使用的瀏覽器。例外Pltform中還提供一個`getSupportedInputTypes`工具方法，來取得目前瀏覽器針對`<input>`所支援的types，單獨使用這個方法的話，不需要加入`PlatformModule`。

### 使用Platform service

透過`Platform`，我們可以用來偵測目前使用者使用的瀏覽器，雖然前端技術與瀏覽器都越來越純熟，針對標準的支援度也越來越好，但畢竟還是有些差異，更不用說若使用版本過舊，差異就更大了！真的遇到這種狀況時，就能夠使用`Platform`這個service，先針對使用者的瀏覽器檢查一下了！

`Platform` service包含幾個判斷屬性：

| 屬性        | 說明                                     |
| --------- | -------------------------------------- |
| isBrowser | 是否為使用瀏覽器(要知道Angular可以使用的範圍可是跨出瀏覽器的)    |
| EDGE      | 瀏覽器是否為 EDGE                            |
| TRIDENT   | 瀏覽器的render engine是否為 Microsoft Trident |
| BLINK     | 瀏覽器的render engine是否為 Blink             |
| WEBKIT    | 瀏覽器的render engine是否為 WebKit            |
| IOS       | 作業系統是否為iOS                             |
| ANDROID   | 作業系統是否為Android                         |
| FIREFOX   | 瀏覽器是否為firefox                          |
| SAFARI    | 瀏覽器是否為safari                           |

我們可以先在程式中注入`Platform` service，再來檢查這些屬性：

```typescript
import { Platform } from '@angular/cdk/platform';

@Component({ })
export class MainComponent {
  constructor(public platform: Platform) {}
}
```

HTML如下：

```html
<div>
  <p>Is Browser: {{ platform.isBrowser }}</p>
  <p>Is Android: {{ platform.ANDROID }}</p>
  <p>Is iOS: {{ platform.IOS }}</p>
  <p>Is Firefox: {{ platform.FIREFOX }}</p>
  <p>Is Blink: {{ platform.BLINK }}</p>
  <p>Is Webkit: {{ platform.WEBKIT }}</p>
  <p>Is Trident: {{ platform.TRIDENT }}</p>
  <p>Is Edge: {{ platform.EDGE }}</p>
</div>
```

以筆者使用Macbook+Chrome的結果如下：

{% asset_img 01-platform.png %}

### 使用getSupportedInputTypes

`getSupportedInputTypes()`是一個工具方法，用來取得目前瀏覽器所支援`<input>`的type清單，回傳結果為`Set<string>`，直接看程式比較簡單：

```typescript
import { getSupportedInputTypes } from '@angular/cdk/platform';

@Component({ })
export class MainComponent {
  supportInputTypes = getSupportedInputTypes();
}
```

HTML如下：

```html
<h2>目前瀏覽器支援的input types</h2>
<ul>
    <li *ngFor="let type of supportInputTypes">{{ type }}</li>
</ul>
```

以筆者使用Macbook+Chrome的結果如下：

{% asset_img 02-getSupportedInputTypes.png %}

## 本日小結

今天我們補充了兩個Angular CDK目前文件沒介紹的功能：

-   Coercion：用來幫助我們在設計元件時，打造更好的開發人員使用經驗，節省許多時候property binding的無謂程式，也讓HTML畫面更加一致好懂，這樣的元件設計思維非常直得讓人學習，不愧是以高品質為目標的Angular Material，**不僅使用者體驗一流，連開發人員也能得到一流的體驗**！
-   Platform：與瀏覽器平台相關的功能，目前可以判斷使用者的瀏覽器，也能得知input支援的types，雖然使用的機會可能不多，但真的遇到需要針對不同平台做細微調整時，我們也知道了有個現成的工具可以用哩。

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-31-cdk-coerce-platform

分支：day-30-cdk-overlay

到這邊我們終於把所有Angular CDK中用來打造一流元件的功能都介紹了一遍，當然還有幾個屬於元件的分類是我們之前使用Angular Material元件時就有感覺的，因此沒有多加介紹，但有過使用Angular Material元件的經驗，要閱讀文件也會很容易上手！

透過Angular CDK，真的能幫助我們節省很多程式碼，筆者目前工作上也已經開始在專案中加入Angular CDK相關的功能，來打造一些Angular Material目前無法提供的功能，體驗到了其強大的威力，真的非常適合推薦給所有使用Angular的開發人員，**既然要使用輪子，當然要使用最高級的輪子啦**！！XD

接下來我們會再花幾天時間介紹一些關於使用Angular Material和Angular CDK的相關小技巧，明天見！

## 相關資源

-   [GitHub的Coercion相關原始碼](https://github.com/angular/material2/tree/5.0.x/src/cdk/coercion)
-   [GitHub的Platform相關原始碼](https://github.com/angular/material2/tree/master/src/cdk/platform)
