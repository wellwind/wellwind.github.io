---
title: "[Angular Material 完全攻略]收件夾頁面(1) - Expansion Panels"
date: 2018-01-08 12:54:09
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
---

今天開始我們又要進入一個新的頁面－「收件夾」囉！先從比較輕鬆的Expansion Panel開始，我們會使用這個元件在畫面左邊建立一個類似收件夾大綱/分類的清單；透過Expansion Panel我們可以展開/收合不同類型的資料，在瀏覽及管理上都非常方便，就讓我們繼續看下去吧！

<!-- more -->

## 關於Material Design中的Expansion panels

在[Material Design的Expansion panels設計指南](https://material.io/guidelines/components/expansion-panels.html)中，Expansion panels可以用來**將一系列的動作或資訊分門別類放在不同的panels中，可以透過展開與收合某個panel來顯示/隱藏資訊**，收合時我們可以看到這panel的基本資料，展開後則可以看到或編輯詳細的資訊。這樣的概念有點像之前介紹過的Steppers，但又沒有那麼重的“步驟”的概念。

{% asset_img 01-expansion-panels.png %}

## 開始使用Angular Material的Expansion panels

Expansion panels的相關功能都放在`MatExpansionModule`之中，加入後我們就可以開始使用`<mat-expansion-panel>`來建立一個基本的expansion panel。

### 使用mat-expansion-panel

`<mat-expansion-panel>`使用上非常簡單，唯一要注意的是在`<mat-expansion-panel>`中一定要加上`<mat-expansion-panel-header>`，代表整個panel的標題，否則會無法呈現資料哩！

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    收件夾
  </mat-expansion-panel-header>
  <!-- 收件夾內容 -->
  ...
</mat-expansion-panel>
<mat-expansion-panel>
  <mat-expansion-panel-header>
    聯絡人列表   
  </mat-expansion-panel-header>
  <!-- 聯絡人列表內容 -->
  ...
</mat-expansion-panel>
```

結果如下：

{% asset_img 02-mat-expansion-panel-basic.gif %}

很簡單吧！只要點一下panel的標題，就可以立即展開/收起每個panel囉。

### 使用mat-panel-title與mat-panel-description為header顯示更多資訊

在標題`<mat-expansion-panel-header>`裡面，我們也可以用`<mat-panel-title>`和`<mat-panel-description>`分別顯示標題的主文字與補充描述，`<mat-panel-description>`會在標題旁邊加上灰色的文字補充說明；例如：

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>
      <mat-icon>inbox</mat-icon>
          收件夾
    </mat-panel-title>
    <mat-panel-description>
      3 封未讀
    </mat-panel-description>
  </mat-expansion-panel-header>
  <!-- 收件夾內容 -->
  ...
</mat-expansion-panel>

<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>
      <mat-icon>person</mat-icon>
      聯絡人列表
    </mat-panel-title>
    <mat-panel-description>
      2 人在線上
    </mat-panel-description>
  </mat-expansion-panel-header>
  <!-- 聯絡人列表內容 -->
  ...
</mat-expansion-panel>
```

成果如下：

{% asset_img 03-panel-with-description.gif %}

### 使用mat-action-row管理更多動作按鈕

我們也能夠在`<mat-expansion-panel>`中加上`<mat-action-row>`，這會在panel下方隔出一塊空間，方便我們在這裡加上一些管理按鈕：

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    ...
  </mat-expansion-panel-header>
  <mat-action-row>
    <button mat-button color="primary">管理我的聯絡人</button>
  </mat-action-row>      
</mat-expansion-panel>
```

成果如下：

{% asset_img 04-panel-with-action-row.gif %}

### 隱藏panel header的展開/收起按鈕

每個panel的header部分，右方都會有一個展開/收合的按鈕，如下：

{% asset_img 05-hide-toggle-before.png %}

我們可以透過設定hideToggle屬性，把這個按鈕藏起來，畢竟我們其實點擊標題就可以執行展開/收合的動作了。

```html
<mat-expansion-panel hideToggle="true">
  ...
</mat-expansion-panel>
```

成果如下：

{% asset_img 06-hide-toggle-after.png %}

### 使用expanded屬性讓panel預設展開

在使用`<mat-expansion-panel>`時，預設是把內容都收起來的，我們可以透過`expanded`屬性，動態的決定`<mat-expansion-panel>`是否要展開(`true`)，還是收合(`false`)

```html
<mat-expansion-panel expanded="true">
  ...
</mat-expansion-panel>
```

### 設定disabled屬性

我們也可以為`<mat-expansion-panel>`設定`disabled`屬性，若設定`disabled="true"`，則會維持原來的狀態，無法點擊：

```html
<mat-expansion-panel hideToggle="true" expanded="true" disabled="true">
  ...
</mat-expansion-panel>>
```

成果如下：

{% asset_img 07-disabled-panel.gif %}

### 手風琴效果

目前我們的`<mat-expansion-panel>`每個都是獨立的，我們可以把多個`<mat-expansion-panel>`包裝近一個`<mat-accordion>`中，變成一個手風琴效果，這個`<mat-according>`有一個`multi`屬性，預設為`false`，代表一次只會顯示一個panel，當某個panel被打開時，其他panel就會自動被收起。

```html
<!-- mat-accotdion的multi預設及為false -->
<mat-accordion multi="false">
  <mat-expansion-panel>
    Panel1
  </mat-expansion-panel> 
  <mat-expansion-panel>
    Panel2
  </mat-expansion-panel> 
</mat-accordion>
```

成果如下：

{% asset_img 08-accordion.gif %}

一個手風琴效果就完成啦！

### 在手風琴效果中去除panel之間的空隙

使用手風琴效果時，panel之間會產生一個空隙，方便我們分辨每塊的panel，如下圖：

{% asset_img 09-accordion-default-display-mode.png %}

這個空隙可以透過設定`displayMode="flat"`拿掉(預設值為`displayMode="default"`)：

```html
<mat-accordion multi="false" displayMode="flat">
  ...
</mat-accordion>
```

成果如下：

{% asset_img 10-accordion-flat-display-mode.png %}

## 本日小結

今天我們學習了Expansion Panel這個特效滿滿的元件，來分類管理不同的資訊，方便我們隨時展開或收合特定的資料群組，避免空間混亂。同時我們也學會了使用手風琴效果，將多個expansion panels當作一個群組來管理。

遇到特定的情境，expansion panel這種配置方式還蠻實用的哩！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-21-expansion-panel-tab

分支：day-21-expansion-panel-tab

## 相關資源

-   [Material Design - Expansion panels](https://material.io/guidelines/components/expansion-panels.html)
-   [Angular Material - Expansion panels](https://material.angular.io/components/expansion/overview)
