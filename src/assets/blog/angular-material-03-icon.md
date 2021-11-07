---
title: "[Angular Material 完全攻略]MatIcon (及顏色配置介紹)"
date: 2017-12-21 21:35:13
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - Material Icon
  - MatIcon
---

今天是第一天正式介紹Angular Material的相關元件，就讓我們先從比較簡單輕鬆的[Icon](https://material.angular.io/components/icon/overview)來開始，雖然說是比較簡單輕鬆，但其實裡面也是有不少學問的，透過今天的介紹，你會發現其實Angular Material提供的Icon元件也是非常強大的！

<!-- more -->

## 關於Material Design 的 Icon

在Material Design這套設計語言裡面，將Icon分成兩類－**產品Icon(Product Icon)和系統Icon(System Icon)**，Product Icon象徵著產品或服務的最主要門面，而System Icon則是系統或服務裡面的操作行為的識別。

### 產品Icon(Product Icon)

關於Icon的設計，其實是有非常多學問在裡面的，畢竟這會影響著一隻程式的識別度，好的Icon可以讓人輕鬆把你的產品跟Icon連結在一起，不好的Icon只會讓人遺忘掉產品的存在，而Material Design在產品Icon的設計上面，給了非常多的建議，不過我們畢竟不是視覺設計師，而是前端開發人員，而且產品Icon也不是Angular Material的重點，就不多作介紹，有興趣的朋友可以去看看[Ｍaterial Design對於產品Icon的設計哲學跟建議](https://material.io/guidelines/style/icons.html)，對於要設計產品Icon的朋友應該會很有幫助。

### 系統Icon(System Icon)

身為前端開發人員，我們可能沒有辦法過度的深入產品Icon的設計，但在前端操作上我們則有著很大的生殺大權（？），尤其在不是以設計美感為主的後台程式或是新的產品需要一個快速的概念驗證時，前端人員對於畫面的掌控性就相對大很多，而畫面上的各種操作，有時候只需要一個簡單的Icon就可以說明一切，例如我們只需要看到如下磁片的圖示，就知道這代表著"存檔"的意思

{% asset_img 00-save-icon.png %}

這種系統Icon對於前端的UI來說就至關重要，有時候一個好的系統Icon可以完整的說明系統的行為或狀態，而不好的Icon加上沒有適當的說明，就會讓操作變得更不流暢；只要有了適當的Icon，平凡的網頁就立刻有的不凡的生命力，可以說是現代化網頁設計非常重要的一個環節啊！而關於系統Icon，在Google官方也推出了一系列超過900個系統Icons，提供給大家使用，也就是[Material Icons](https://material.io/icons/)。

#### 輕鬆一下

分享一個網路上看到的有趣圖片，說明了磁片時代的眼淚，過去的存放資料的重要媒介，如今也只不過是個最常見的存檔Icon而已了，雖然一樣都很重要，但認知上已有了極大的落差。

{% asset_img 01-save-icon-joke.jpg %}

圖片來源：https://twitter.com/mymemory/status/766244541628284929

## 關於Material Icons

Google本身已經提供了超過900個系統Icons，而且完全Open Source，要用這些Icon本身很簡單，如果在前一天安裝Angular Material時有做最後一步驟加入Material Icons的CDN，就已經具備了使用Material Icons的條件，我們可以在Material Icons官網上方的Search搜尋框中輸入想要使用的icon， 就可以找到使用這個icon所需要的使用的語法

{% asset_img 02-material-icons-site.png %}

例如我想要尋找跟人有關的icon，可以在搜尋框中輸入`person`，即可看到跟person有關的icons

{% asset_img 03-material-icons-search.png %}

接著點擊想要放到網頁上的icon，下方就會顯示可以加入網頁的方法，例如下載SVG或PNG檔，或是使用我們接下來要介紹的Icon Font的方式：

{% asset_img 03-material-icons-usage.png %}

如果看到想要加入一個人的圖像，可以使用以下語法

```html
<i class="material-icons">person</i>
```

我們只需要直接在程式中加入這段語法，就能夠輕易的將icon加到畫面上啦！

{% asset_img 04-first-material-icon.png %}

有了基本的Material Icon概念和了解系統Icon的使用方法，接下來我們就來看看Angular Material中對於使用Icon還能有些什麼靈活的變化吧！！

## 關於Angular Material的MatIcon

使用`<i class="material-icons">person</i>`的方式來顯示Material Icon本身已經是一件很容易的事情，但對於像Angular這種以元件的方式來開發的情境上，這種HTML Tag就略顯得不夠語意化，因此Angular Material在顯示Icon上另外提供了一個元件，也就是MatIcon。

### 在MatIcon中使用Material Icons

要使用MatIcon，首先必須加入MatIconModule到你的目前使用的Module裡面：

```typescript
import { MatIconModule } from '@angular/material';

@NgModule({
  ...
  imports: [
    ...,
    MatIconModule],
  ...
})
export class AppModule {}
```

而MatIcon的基本語法很簡單：

```html
<mat-icon>person</mat-icon>
```

中間的`person`一樣是Material Icons裡面可以選的icon名稱，不同的是外面由`<mat-icon>`這個元件標籤包起來；雖然效果是完全一樣的，但比起原來必須看到`class="material-icons"`才知道使用的是Material Icon，現在只要看到`<mat-icon>`就知道了，同時以Angular Material為基礎設計出來的元件，也能夠有比較多的Material Design相關變化。

例如預設的MatIcon會是我們加入的theme的文字顏色(currentColor)，但我們可以很容易的透過`color`屬性，來切換icon的顏色類型。

{% note info %}

未來我們加入Angular Material相關的Module，除非特別說明否則都會在 `@angular/material` 中。

{% endnote %}

#### 關於Angular Material的顏色簡介

在[Material Design的System Color指南](https://material.io/guidelines/style/color.html#color-color-system)中，建議配色的選擇為兩種**主要顏色(primary color)**跟**次要顏色(secondary color)**，用來區分主要的功能顏色及強調可以選擇的畫面，另外在表單相關的元件上還加上了**錯誤訊息(error message)的顏色**，而在Angular Material的樣式中將這三種顏色名稱分別訂為`primary`、`accent`和`warn`。

在大部分的Angular Material提供的元件中，我們都可以透過color來切換這三種顏色，以MatIcon為例

```html
<div>
  這是一般的ICON顏色
  <mat-icon>person</mat-icon>
</div>

<div>
  這是加上primary顏色的ICON
  <mat-icon color="primary">thumb_up</mat-icon>
</div>

<div>
  這是加上accent顏色的ICON
  <mat-icon color="accent">info</mat-icon>
</div>

<div>
  這是加上warn顏色的ICON
  <mat-icon color="warn">warning</mat-icon>
</div>
```

結果如下圖：

{% asset_img 05-material-icon-colors.png %}

當然我們還是可以透過設定css來切換成不同的顏色，不過在設計上這種事情則需要盡量避免，在Material Design的建議中，除了文字顏色和背景顏色以外，主要就這三種顏色了，適當的搭配使用這三種顏色，可以讓畫面不至發生於顏色大爆炸，也能保持簡單大方的設計樣式，讓使用者在操作時也不容易被顏色搞混，可以說是很重要的觀念！

### 使用MatIconRegistry擴充

ＭatIcon除了能夠直接使用Material Icon以外，我們還能夠過**MatIconRegistry**來擴充能夠使用的Icons；MatIconRegistry具有兩個功能，**一個是直接在MatIcon中加入SVG圖檔，另外一個則是支援使用其他的Icon Font**，這在我們所需要的Icon超出Material Icon提供的範圍時非常實用，同時又能保持使用一致的MatIconm元件來顯示畫面。

#### 在MatIcon中使用SVG

在這邊我們使用顏色單純的SVG圖片作為範例，圖片來源來[自Angular官方網站的Press Kit](https://angular.io/presskit)：

<img src="https://angular.io/assets/images/logos/angular/angular_solidBlack.svg">

先將這張圖片下載到我們專案目錄的src/asset/imges資料夾中

{% asset_img 07-angular-icon-path.png %}

接著注入`MatIconRegistery`及`DomSanitizer`，由於SVG icon是在程式中透過路徑載入，為了避免XSS的問題，必須透過Angular提供的DomSanitizer service來信任這個路徑，如果你的圖片放在網路上的其他來源，同時還需要注意cors的問題，不過這已經超出這次介紹的範圍，就不多做說明。

```typescript
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  ngOnInit() {}
}
```

另外為了能夠在程式中下載這張圖片擴充為我們的icon，還需要再加入`HttpClientModule`，加入方法也已經是基本知識，就不多說明囉。

接著我們就可以透過`MatRegistery`來擴充SVG icon啦！

```typescript
this.matIconRegistry.addSvgIconInNamespace(
  'custom-svg',
  'angular',
  this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/angular_solidBlack.svg'));
```

**MatIconRegistery.addSvgIconInNamespace**有三個參數：

-   **namespace：icon**的namespace，方便用來分類不同的icons，也能夠避免名稱衝突
-   **iconName**：給予這個icon一個名稱
-   **url**：一個安全的圖片來源

加入這個設定後，我們就可以直接在畫面中使用這個icon啦！更棒的是，只要svg icon裡面沒有特別設定任何顏色的話，我們還能夠過`color`屬性來直接調整我們的svg icon的顏色！

加入svg icon可以透過MatIcon的`svgIcon`屬性來設定，必須依照`[namespace]:[iconName]`的方式來指定：

```Html
<h2>自行註冊SVG icon</h2>

<div>
    <mat-icon svgIcon="custom-svg:angular"></mat-icon>
    <mat-icon svgIcon="custom-svg:angular" color="primary"></mat-icon>
    <mat-icon svgIcon="custom-svg:angular" color="accent"></mat-icon>
    <mat-icon svgIcon="custom-svg:angular" color="warn"></mat-icon>
</div>
```

結果如下：

{% asset_img 08-custom-svg-icon.png %}

#### 在MatIcon中使用其他Icon Font

除了自訂svg icon以外，網路上也有許多現成的icon font可以使用，例如知名的[FontAwesome](http://fontawesome.io/)、[IonIcons](http://ionicons.com/)等等，使用方式基本上大同小異，而我們也能夠很輕易的將這些icon font納入MatIcon之中，讓畫面上的程式碼更加一致！

以FontAwesome為例，我們可以先在index.html中加入FontAwesome的CDN：

```html
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
```

{% note info %}  

在寫這系列文章前沒多久FontAwesome其實剛升上第5版，但使用上會稍有不同，為了教學方便，還是使用第4版做範例，不過納入MatIcon的方式是完全一樣的。

{% endnote %}

接著一樣可以透過`MatIconRegistery`的方式加入

```typescript
this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
```

**MatIconRegistery.registerFontClassAlias**有兩個參數：

-   **alias**：原來icon font class的別名，例如FontAwesome都會在class裡面加上`fa`之後才加上`fa-*`，這裡要設定的就是`fa`的別名。
-   **className**：原來icon font的主要class，以FontAwesome來說也就是`fa`

接著我們就可以使用MatIcon來顯示FontAwesome，同時享受MatIcon的功能啦！

使用Icon Font需要設定兩個屬性，分別是`fontSet`代表剛才註冊的alias，以及`fontIcon`代表真正要使用的icon class。

```html
<h2>在MatIcon中使用FontAwesome</h2>

<div>
  <!-- 就是<i class="fa fa-thumbs-up">的概念 -->
  <mat-icon fontSet="fontawesome" fontIcon="fa-thumbs-up"></mat-icon>
  <mat-icon fontSet="fontawesome" fontIcon="fa-thumbs-up" color="primary"></mat-icon>
  <mat-icon fontSet="fontawesome" fontIcon="fa-thumbs-up" color="accent"></mat-icon>
  <mat-icon fontSet="fontawesome" fontIcon="fa-thumbs-up" color="warn"></mat-icon>
</div>
```

成果如下：

{% asset_img 09-fontawesome-in-mat-icon.png %}

{% note info %}  

**小提示1**：FontAwesome提供了許多除了顯示icon以外的class，例如讓icon旋轉的`fa-spin`等等，我們一樣可以透過`class="fa-spin"`的方式加入。

**小提示2**：使用這種方式雖然具有一致性的效果，不過對於開發來說則未必是好事，尤是我們常常仰賴工具的code snippets時，這種語法反而會阻礙了我們原來的習慣，至於該如何選擇就看個人喜好囉。

{% endnote %}

## 本日小結

今天我們認識了Material Design中的Icon設計哲學，以及身為前端開發人員最常使用的系統Icon使用方式，學到了Material Icon的使用方式。

而在Angular Material中我們能夠透過MatIcon來幫助我們**統一管理這些icons**，讓view上的語法呈現更加一致明確。

同時我們也簡單認識了**Material Desing基本的配色概念**，以及了解到Angular Material中使用這些顏色的方式。

MatIcon本身的能力也超過了Material Icon的範圍，除了用來產生現有的Material Icons以外，我們也能自行加入SVG圖檔來當作icon顯示，更方便的是我們還能把其他網路上知名的Icon Font樣式一併套進來，通通使用MatIcon的方式進行管理，非常的方便及強大。

適度地替系統加上Icon能達到畫面更簡潔，但操作卻更清楚的效果，把這些使用方式都學會，就能輕易的在畫面上加入各種的icons啦！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-03-mat-icon 
分支：day-03-mat-icon

## 相關資源

- [Angular Material Icon](https://material.angular.io/components/icon/overview)
- [Material Design Style Icons](https://material.io/guidelines/style/icons.html#icons-system-icons)
- [Material Icons](https://material.io/icons/)
