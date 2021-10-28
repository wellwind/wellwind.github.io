---
title:  "[Angular Material完全攻略]環境設定 & 安裝 ＆ Hello World"
date: 2017-12-20 20:33:28
category: "Angular Material完全攻略"
tags:
  - Angular
  - Angular Material
  - Angular CLI
  - Material Design

---

今天我們將開始正式邁入Angular Material的世界，要學習使用Angular Material打造高品質及高質感的網頁，當然要從安裝Angular Material套件開始，本篇文章就來介紹基本的Angular Material安裝步驟，並簡單加入一個元件來體驗一下**有質感**是怎樣的一個感覺！

<!-- more-->

## 基本環境

本篇文章需要在電腦上安裝[node.js](https://nodejs.org/en/)，並透過[npm](https://www.npmjs.com/)安裝相關的套件(或是你想用[yarn](https://yarnpkg.com)也沒有問題)，同時，你也必須安裝[Angular CLI](https://github.com/angular/angular-cli)。

雖然本系列文章假設讀者已經有基本的Angular知識及會使用Angular CLI，但還是簡單說明一下安裝Angular CLI的方式(畢竟不是每個開發人員都會去使用Angular CLI來建立程式，只是使用Angular CLI比較方便而已)，透過npm安裝Angular CLI很簡單，只要簡單一行指令就可以了

```shell
npm install -g @angular/cli
```

再寫這篇文章時，筆者的電腦中使用的Angular CLI版本為1.6.0。

## 建立新的專案

使用Angular CLI來建立新的專案也是簡單到不行，使用`ng new`指令一行搞定：

```shell
ng new it-ironman-demo-angular-material --routing
```

由於之後還要開發其他的頁面，所以加上了`--routing`，這會在專案中增加一個`app-routing.module.ts`的檔案，方便未來增加模組以及頁面連結時作設定。

接下來我們就要正式把Angular Material相關的套件裝進來並且進行設定啦！

## 步驟1. 安裝@angular/material和@angular/cdk

首先第一步我們先把套件裝進來再說，進入專案目錄(以上面的例子來說專案目錄是`it-ironman-demo-angular-material`)

```shell
npm install --save @angular/material @angular/cdk
```

如果你喜歡嚐鮮，也可以安裝最新非穩定的版本，Angular Material也提供了一個snapshot build，當然這不建議在真正的production環境上使用。

```shell
npm install --save angular/material2-builds angular/cdk-builds
```

## 步驟2. 安裝@angular/animations

Angular Material運用了不少動畫特效來讓元件顯示更加生動，這都多虧了@angular/animations這個套件，如果希望能在頁面上看到這些動畫效果，需要安裝@angular/animations：

```shell
npm install --save @angular/animations
```

接著在我們的AppModule中的imports裡面加入BrowserAnimationsModule

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [
    ...
    BrowserAnimationsModule
  ],
  ...
})
export class AppModule { }
```

雖然動畫效果會讓畫面更加豐富，但也有可能會有效能問題，且不是每個人都喜歡那麼多的特效，想要取消特效的話，可以改加入`NoopAnimationsModule`

```typescript
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [
    ...
    NoopAnimationsModule
  ],
  ...
})
export class AppModule { }
```

### 關於@angular/animations的支援度

@angular/animations使用了[WebAnimation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)，但不是所有瀏覽器都有支援，如果你希望盡可能讓所有瀏覽器都支援，可以安裝`web-animations.js`套件。

```shell
npm install --save web-animations-js
```

接著打開`src/pollyills.ts`檔案，找到`import 'web-animations-js'`這一行，並且把它取消註解掉，如果找不到這一行，也可以直接手動加入就好。

## 步驟3. 匯入想要顯示的元件模組

Angular Material將所有的主要元件都都方入對應的模組之中(`MatXXXModule`)，讓我們只有需要使用到某一群元件時，匯入相關模組就好，避免匯入過多不必要的元件。

### 在要使用的Module中匯入MatXXXModule

假如我們要使用Angular Material的button特性，可以匯入MatButtonModule

```typescript
import { MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [
    ...
    BrowserAnimationsModule, 
    MatButtonModule
  ],
  ...
})
export class AppModule {}
```

### 利用SharedModule先整理出常用的MatXXXModule

另外一種方式是**，建立一個SharedModule，將常用的MatXXXModule先import，再export出來**，在其他Module中就只要import這個SharedModule就好，這在較複雜的SPA程式中會非常實用。當然這個SharedModule只是個概念，實際上我們可**以用這個概念分類出不同的Modules**，例如專門放常用的Angular Material Components的Module我們就取名叫做**SharedMaterialModule**吧！

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule], // 先import
  exports: [MatButtonModule] // 在export
})
export class SharedMaterialModule {}
```

如果Module裡面沒有其他需要使用到Angular Material的元件，也可以直接export就好

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

@NgModule({
  exports: [MatButtonModule] // 直接export
})
export class SharedMaterialModule {}
```

然後在使用到的Module中匯入即可，唯一要注意的是，這個SharedMaterialModule一定要放在BrowserModule之後！

```typescript
import { SharedMaterialModule } from './shared-material/shared-material.module';

@NgModule({
  ...
  imports: [
    BrowserModule,
    ...
    SharedMaterialModule
  ],
  ...
})
export class AppModule {}
```

關於SharedModule的概念，可以參考[官方文件的介紹](https://angular.io/guide/ngmodule#shared-modules)。

## 步驟4. 加入theme設定

Material Design是極具質感的設計樣式，因此Angular Material自然也少不了基本的CSS樣式，目前(5.0.0-rc)Angular Material包含了4種內建的樣式，在`@angular/material/prebuilt-themes/`，可以找到這4個css檔。

{% asset_img prebulit-themes.png %}

另外這4個佈景的樣式也可以再Angular Material官方文件首頁的上半部作切換

{% asset_img switch-theme.png %}

以下是這4個樣式在官方首頁的樣式，提供參考

-   **indigo-pink.css**

{% asset_img theme-preview-indigo-pink.png %}

-   **deeppurple-amber.css**

{% asset_img theme-preview-deeppurple-amber.png %}

-   **pink-bluegrey.css**

{% asset_img theme-preview-pink-bluegrey.png %}

-   **purple-green.css**

{% asset_img theme-preview-purple-green.png %}

未來Angular Material也會持續增加不同的配色；當然，我們也可以自己設計自己想要的樣式，在Angular Material要產生客製化的樣式非常簡單，只需要簡單設定要搭配的顏色即可，在後續的文章會介紹如何自訂自己的Angular Material Theme。在這裡我們只要先選擇內建的theme就好，我們可以把這個theme的css加到styles.css中。

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```

之後用到的Angular Material元件就會自動套上這樣的樣式囉。

## 步驟5. 手勢支援

在某些元件中，會依照瀏覽的裝置不同而有不同的互動，例如tooltip在一般PC上只要滑鼠游標移過去就會顯示，但在行動裝置中，則需要長按才會出現，這部分Angular Material搭配了[HammerJS](http://hammerjs.github.io/)，為UI加上行動裝置的手勢支援，如果開發的網頁需要在行動裝置上也能達到最好的體驗，就必須在程式中載入HammerJS。

有萬能的npm，這些套件都只是一行指令的問題而已

```shell
npm install --save hammerjs
```

安裝完HammerJS後，還需要在程式中載入，我們可以直接在程式的進入點src/main.ts中加入

```typescript
import 'hammerjs';
```

## 步驟6. 加入Material Icons

Material Icons是搭配Material Design出來的一系列icon set，在Angular Material中，我們也可以透過MatIcon來統一顯示icon的邏輯，以現代化網頁設計來說，想要使用Material Icons最簡單的方式，就是直接在index.html中加入相關Icon Font的CDN：

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## 實際寫點東西來看看吧！

上述的步驟已經把所有Angular Material相關的套件及設定都完成了，同時我們也練習載入了MatButtonModule，既然都已經載入了，我們就直接來寫一個Button來看看吧！

在app.component.html中先寫一個簡單到不行的button

```html
<button>Hello World！</button>
```

這時候的按鈕隨著作業系統、瀏覽器的不同會有不同的顯示方式。接著我們來讓它變成一個充滿Material Design樣式的按鈕吧！

在Angular Material中使用了原生的按鈕，但是加上了directive讓按鈕有了Material Design的樣式，最簡單的directive就是`mat-button`

```html
<button mat-button>Hello World！</button>
```

來看看結果：

{% asset_img mat-button-demo1.gif %}

可以看到整個按鈕的樣式變得不一樣了，同時點選下去也有清楚的wave特效，這讓我們的按鈕從此活了起來！畫面更加豐富！！

在之後的文章我們會在對MatButton有更熟悉的理解，不過在這裡我們還是手癢稍微修改一下按鈕的樣式，讓按鈕能有不一樣的呈現方式

```html
<button mat-raised-button color="primary">Hello World！</button>
```

我們改用了mat-raised-button，讓按鈕變成有有層次的陰影，同時加上`color="primary"`，為按鈕加上了主題色的主要顏色，看看結果：

{% asset_img mat-button-demo2.gif %}

可以發現按鈕變成了藍色的背景，而且也有了些陰影，這可以讓畫面更佳的有立體感，顏色也更加鮮明；在所有的Angular Material的元件都有類似的立體效果及配色，讓整個畫面呈現能夠更加的層次分明，是不是對於Material Design的設計有了更多的期待啦！

### 關於安裝Angular Material的小補充

如果有使用SystemJS的方式載入模組，官方文件也有說明該如何使用，可以參考看看

https://material.angular.io/guide/getting-started#appendix-configuring-systemjs

## 關於Angular Material文件的補充

如果你已經迫不及待要去Angular Material的文件上看看有什麼好玩的元件可以用了，在這邊做一點小提醒，由於文件目前還沒有完全更新，有些程式碼可能會是錯的，最主要的部分是當看到`mdXxxx`或`md-xxxx`時，都是舊版的寫法，Angular Material 5之後統一都改成`matXxxx`或`mat-xxxx`的寫法，因此當你複製程式時，別忘了看一下是不是舊版的寫法，可能會導致跑不出結果喔！

## 本日小結

今天我們介紹了將Angular Material加入Angular專案的方法，雖然不算複雜，但也有些細節需要注意，並且也理解到Angular Material需要相依一些套件，才能發揮出全部的威力，盡管沒有這些相依套件，也不會影響到主要的操作，但如果可以的話，還是建議把這些套件都加進來，讓前端畫面能夠更加豐富！

安裝完Angular Material後，我們也實際用按鈕當作案例，建立了一個充滿Material Design風格的按鈕元件，讓按鈕不再是死板板的按鈕，還要擔心作業系統和瀏覽器不同而有不同的顯示方式，讓呈現更加一致，也更加的生動。

明天即將開始進入正戲，介紹Angular Material的元件啦！

本日的程式碼GitHub：<https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-02-prepare-installation> (分枝：day-02-prepare-installation)

## 相關資源：

-   [Getting Started - Angular Material](https://material.angular.io/guide/getting-started)

