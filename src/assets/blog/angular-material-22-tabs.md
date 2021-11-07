---
title: "[Angular Material 完全攻略]收件夾頁面(2) - Tabs"
date: 2018-01-09 18:28:12
category: "Angular Material 完全攻略"
tags:
  - Material Design
  - Angular Material
---

昨天我們介紹了Expansaion Panels，替收件夾的左邊加上了基本的分類資訊，今天讓我們來使用Angular Material的Tab元件，來把右邊也填入些東西！

Tab元件可以說是許許多多UI都會用到的功能，使用上雖然簡單，但也有許多不同的呈現模式，**可以說是最簡單也最複雜的元件之一**，接下來就立刻來看看有些什麼變化吧！

<!-- more -->

## 關於Material Design中的Tabs

在[Material Design的Tabs設計指南](https://material.io/guidelines/components/tabs.html#)中，Tab提供了一個簡易的方式來切換不同的畫面；Tab使用頁籤的方式管理不同的畫面，並且一次只會顯示一個畫面。

{% asset_img 01-components-tabs.png %}

## 開始使用Angular Material的Tabs

要使用Tabs元件，需要加入`MatTabsModule`，之後我們可以使用`<mat-tab-group>`與`<mat-tab>`來建立tabs。

### 使用mat-tab-group與mat-tab

跟許多群組型的元件都差不多，我們可以使用`<mat-tab-group>`作為一個最外層的tab容器，並在裡面放置數個`<mat-tab>`：

```html
<mat-tab-group>
  <mat-tab label="郵件列表">
    郵件列表清單
  </mat-tab>
  <mat-tab label="系統設定">
    系統設定表單
  </mat-tab>
</mat-tab-group>
```

成果如下：

{% asset_img 02-tab-basic.gif %}

### 使用selectedIndex改變選取的tab

我們可以透過`selectedIndex`，來設定要選取第幾個tab，這個`selectedIndex`是two way binding的，所以我們也能在手動切換tab時，得知目前的被選取的tab index：

```html
<button mat-button (click)="tabIndex = tabIndex - 1">上一頁</button>
<button mat-button (click)="tabIndex = tabIndex + 1">下一頁</button>
<p>目前的selectedIndex: {{ tabIndex }}</p>
<mat-tab-group [(selectedIndex)]="tabIndex">
  <mat-tab label="郵件列表">
    郵件列表清單
  </mat-tab>
  <mat-tab label="系統設定">
    系統設定表單
  </mat-tab>
  <mat-tab label="其他">
    其他畫面
  </mat-tab>
</mat-tab-group>
```

成果如下：

{% asset_img 03-change-tab-selectedIndex.gif %}

### mat-tab-group的相關事件

Angular Material的tabs是可以透過鍵盤切換的，我們可以使用`左右方向鍵`focus到不同的tab，再使用`SPACE`或`ENTER`確認切換動作，這時候我們可以使用`focusChange`事件來得知focus狀態的變更，另外也有`selectedIndexChange`及`selectedTabChange`事件：

```html
<mat-tab-group [(selectedIndex)]="tabIndex" 
               (focusChange)="tabFocusChange($event)"
               (selectedIndexChange)="tabSelectedIndexChange($event)"
               (selectedTabChange)="tabSelectedTabChange($event)">
  ...
</mat-tab-group>
```

TypeScript程式如下：

```typescript
@Component({})
export class InboxComponent {
  tabFocusChange($event: MatTabChangeEvent) {
    console.log(`focus變更，indx：${$event.index}`);
  }

  tabSelectedIndexChange($event: number) {
    console.log(`selectedIndex變更，index：${$event}`);
  }

  tabSelectedTabChange($event: MatTabChangeEvent) {
    console.log(`selectedTab變更，index：${$event.index}`);
  }
}
```

成果如下：

{% asset_img 04-mat-tab-group-events.gif %}

### 複雜的tab label顯示

剛才我們tab顯示的label都是使用`<mat-tab label="xxx">`的方式，這樣只能設定純文字，如果希望更複雜的設定，可以使用`<ng-template mat-tab-label>`的方式，來設定tab的label：

```html
<mat-tab-group>
  <mat-tab>
    <ng-template mat-tab-label>
      <mat-icon>inbox</mat-icon>
      郵件列表
    </ng-template>
    郵件列表清單
  </mat-tab>
  <mat-tab>
    <ng-template mat-tab-label>
      <mat-icon>settings</mat-icon>
      系統設定
    </ng-template>
    系統設定表單
  </mat-tab>
</mat-tab-group>
```

成果如下：

{% asset_img 05-mat-tab-label.png %}

### mta-tab-group固定寬度時，設定stretch模式

當我們為`<mat-tab-group>`設定一個固定寬度時，可以加上`mat-stretch-tabs`這個directive，此時所有tab頁籤就會平均分配寬度，例`<mat-tab-group>`寬度設為300時，每個`<mat-tab>`的label就會佔據100(300/3)的寬度：

```html
<mat-tab-group mat-stretch-tabs>
  <mat-tab label="tab1"></mat-tab>
  <mat-tab label="tab2"></mat-tab>
  <mat-tab label="tab3"></mat-tab>
</mat-tab-group>
```

成果如下：

{% asset_img 06-stretch.png %}

### mta-tab-group固定寬度時，tab很多的顯示模式

當tab很多，但`<mat-tab-group>`寬度不夠時該怎麼辦呢？我們不用做任何設定，Angular Material都幫我們設計好了，tab標籤不會因為過多而換行，破壞版面，而是會顯示一個可以左右移動的按鈕，方便我們切換tab：

{% asset_img 07-many-tabs-display.gif %}

### 設定mat-tab-group的顏色

`mat-tab-goup`的顏色也是可以設定的，我們可以使用`backgroundColor`來設定背景顏色，使用`color`來設定focus的tab底部顏色，例如：

```html
<mat-tab-group backgroundColor="primary" color="accent" ...>
  ...
</mat-tab-group>
```

成果如下：

{% asset_img 08-color-tab.gif %}

### 使用headerPosition改變tab的位置

預設的tabs都是顯示在上方，但我們也能夠設定`headerPosition="below"`，讓tab呈現在畫面下方：

```html
<mat-tab-group headerPosition="below" ...>
  ...
</mat-tab-group>
```

成果如下：

{% asset_img 09-above-tabs.gif %}

### 設定disabled狀態

當舞們不希望某個`<mat-tab>`能夠被選取時，可以為它加上`disabled`，變成不可選取的狀態：

```html
<mat-tab-group>
  <mat-tab>
    ...
  </mat-tab>
  <mat-tab disabled="true">
    ...
  </mat-tab>
</mat-tab-group>
```

成果如下：

{% asset_img 10-disabled-tab.gif %}

設定disabled的tab就會變成灰色的字，而且連focus都無法做到啦！

## 本日小結

今天我們介紹了Tab元件，Tab在許許多多的UI呈現上都佔據了很重要的角色，使用的頻率非常非常的高，儘管在Angular Material中，要建立一個基本的tab並不困難，但tab本身卻有非常多的變化，來滿足各種不同的tab呈現需求，如顏色、方向等等，都是很常見需要調整的情境，好好的把tab學起來，就不怕面臨各種不同的需求囉！

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-22-tabs

分支：day-22-tabs

目前我們已經把收件夾的基本畫面都組好了，看起來如下：

{% asset_img 11-inbox-preview.png %}

明天我們將使用table元件，來把郵件清單給補起來，同時學習table多采多姿的組合技，敬請期待！

## 相關資源

-   [Material Design - Tabs](https://material.io/guidelines/components/tabs.html#)
-   [Angular Material - Tabs](https://material.angular.io/components/tabs/overview)
