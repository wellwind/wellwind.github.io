---
title: "[Angular Material 完全攻略]打造基本後台(1) - SideNav"
date: 2017-12-23 12:33:12
category: "Angular Material 完全攻略"
tags:
  - Angular Material
  - Material Design
  - MatSideNav
---

我們終於要正式開始時做一個後台(dashboard)畫面啦，今天我們會先使用Angular Material的SideNav元件，把邊欄的空間先切出來，這個空間通常是用來放置主選單的空間，我們就來看看該如何開始吧！

<!-- more -->

## 關於Material Design的基本系統架構

在[Material Design的架構指南](https://material.io/guidelines/layout/structure.html)中，一個應用程式不管是行動裝置、平板還是桌機，在畫面基本上都可以分為3個區塊，toolbar、sidenav和content

{% asset_img 01-dashboard-basic.png %}

圖片來源：https://material.io/guidelines/layout/structure.html#structure-ui-regions

-   Toolbar：通常用來放置基本的品牌logo、簡單的搜尋、常用的功能和切換左右sidenav的按鈕等等。
-   SideNav：放置使用者資訊，或是主要的功能選單等等、可以選擇常駐在左邊或右邊，也可以選擇平常隱藏起來，需要的時候可以動態的打開來。
-   Content：當然就是主要的功能畫面啦。

## 開始使用Angular Material的SideNav

在使用SideNav前，我們一樣要將`MatSidenavModule`加入，這個步驟之前已經做過很多次了，就只說明不介紹步驟；另外由於我們之後會再持續設計部落格頁面、問卷頁面等等，因此已將程式切割到不同的Module中並設定好routing，由於這是屬於Angular基本知識，這裡也不再多做說明，程式碼都在GitHub上，可以直接參考。

加入`MatSidenavModule`後，我們就可以直接開始使用，基本上SideNav分為3個區塊

-   `<mat-sidenav-container>`：代表整個包含邊欄導覽的容器
-   `<mat-sidenav>`：實際上邊欄導覽的內容
-   `<mat-sidenav-content>`：導覽以外的實際內容

因此我們的畫面程式碼可以簡單寫成如下：

```html
<mat-sidenav-container>
  <mat-sidenav #sideNav>
    我是左邊選單
  </mat-sidenav>

  <mat-sidenav-content>
      <button mat-button (click)="sideNav.toggle()">切換左邊選單狀態</button>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```

一個包含導覽功能的選單就已經出現啦！不過這時候我們的畫面上還不會將選單顯示出來，這是因為Angular Material預設的`<mat-sidenav>`是隱藏的，不過我們可以透過程式把選單叫出來，所以畫面上我們先建立了一個按鈕，透過這個按鈕呼叫sideNav的`toggle()`方法，來切換左邊導覽列的顯示狀態。

結果如下：

{% asset_img 02-toggle-sidenav.gif %}

### 控制SideNav的顯示狀態

我們可以透過`open()`、`close()`和`toggle()`來控制SideNav的顯示狀態，這些方法都會回傳一個`Promise<MatDrawerToggleResult>`來告訴你SideNav的顯示狀態。

```typescript
  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      console.log(result);
      console.log(`選單狀態：${result.type}`);
    });
  }
```

結果如下：

{% asset_img 03-toggle-sidenav-result.gif %}

除此之外SideNav還有`opened`和`closed`，兩個output，當SideNav被打開或關時，就會觸發。

```html
<mat-sidenav #sideNav (opened)="opened()" (closed)="closed()">
```

### SideNav的常用Input屬性

#### mode

`<mat-side-nav>`有一個mode屬性，可以用來決定SideNav的呈現方式，目前有3個值可以設定

-   **over**：預設值，SideNav會浮動在畫面之上，背後會出現一個灰底的backdrop，點擊SideNav以外的地方(或按下<kbd>ESC</kbd>)會隱藏起來。

-   **push**：跟over類似，但顯示的時候會把畫面往另外一個方向推，同時也會有一個灰底的backdrop，在螢幕較大的裝置時可以同時瀏覽SideNav和選單，但在行動裝置等小螢幕上則比較沒有感覺。

    {% asset_img 04-sidenav-push-mode.gif %}

-   **side**：效果類似push，但不會出現灰底的backdrop，因此可以同時操作主要的content畫面以及SideNav的內容。

    {% asset_img 05-sidenav-side-mode.gif %}

#### opened

透過`opened`屬性，我們可以不需要使用元件的`open()`或`toggle()`方法來打開，只需要設定這個屬性即可變更顯示狀態，true代表顯示，false代表隱藏。因此當我們需要一個固定在旁邊的導覽選單時，可以同時**將mode設為side，並將opened設為true**，即可讓導覽選單常駐在旁邊，只要不在程式中切換這些狀態，就不會被隱藏。

```html
<mat-sidenav opened="true" mode="side"></mat-sidenav>
```

#### position

SideNav支援顯示在畫面的起始(`start`，預設值，通常是左邊)或結束(`end`，通常是右邊)，我們可以透過設定`position`決定SideNav要放在哪邊，同時我們也能左右各提供一個導覽選單。

```html
  <mat-sidenav opened="true" mode="side">
    <div>我是左邊選單</div>
  </mat-sidenav>

  <mat-sidenav opened="true" mode="side" position="end">
    <div>我是右邊選單</div>
  </mat-sidenav>
```

結果如下：

{% asset_img 06-sidenav-position.png %}

不過需要注意的是，左右都只能有1個SideNav，所以以下寫法都是不正確的

```html
  <mat-sidenav opened="true" mode="side">
    <div>我是左邊選單</div>
  </mat-sidenav>

  <mat-sidenav opened="true" mode="side" position="start">
    <div>我是左邊選單2號</div>
  </mat-sidenav>
```

```html
  <mat-sidenav opened="true" mode="side" position="end">
    <div>我是右邊選單</div>
  </mat-sidenav>

  <mat-sidenav opened="true" mode="side" position="end">
    <div>我是右邊選單2號</div>
  </mat-sidenav>
```

當這樣的狀況出現時，會看到以下的錯誤訊息

{% asset_img 07-wring-sidenav.png %}

#### disableClose

在mode設為`over`或`push`時，預設會出現一個backdrop，當點選backdrop或按下esc時則會自動隱藏SideNav，如果希望不要自動隱藏，則可以設定`disableClose`，有了這個屬性就必須另外在可點選的範圍內加上程式設定隱藏SideNav。

```html
  <mat-sidenav #sideNav mode="over" disableClose>
    <div>我是左邊選單</div>
    <div>
      <button mat-raised-button color="warn" (click)="toggleSideNav(sideNav)">切換選單狀態</button>
    </div>
  </mat-sidenav>
```

#### fixedInViewport / fixedTopGap / fixedBottomGap

當我們有一個toolbar在上層時，預設SideNav現時不會擋住toolbar

```html
<mat-toolbar>我是Toolbar</mat-toolbar>
<mat-sidenav-container>
  <mat-sidenav #sideNav mode="over">
    <div>我是左邊選單</div>
    <div>
      <button mat-raised-button color="warn" (click)="toggleSideNav(sideNav)">切換選單狀態</button>
    </div>
  </mat-sidenav>
  ...
</mat-sidenav-container>
```

如下圖：

{% asset_img 08-with-toolbar-the-problem.gif %}

這時候我們可以設定`fixedInViewport="true"`，讓SideNav能夠顯示在Toolbar之上。另外也能設定`fixedTopGap`和`fixedBottomGap`，保留一定程度的上下空間。

```html
<mat-sidenav #sideNav mode="over"  fixedInViewport="true" fixedTopGap="20" fixedBottomGap="20"></mat-sidenav>
```

結果如下：

{% asset_img 09-fixedInViewport.gif %}

{% note info %}

關於Toolbar的使用方式會在明天詳細說明。

{% endnote %}

## 關於MatDrawer

除了SideNav之外，Angular Material還提供了一個類似的component－drawer。比起SideNav是設計給整個畫面使用，Drawer則是提供給放在content裡面小範圍區塊使用。除了不支援`fixedInViewport`(畢竟沒有需要遮擋的toolbar了)以外，這個drawer component使用上基本和sidenav完全相同，

```html
<mat-drawer-container style="height:100px;border: 1px solid black">
  <mat-drawer mode="side" opened="true">Drawer Side</mat-drawer>
  <mat-drawer-content>Content</mat-drawer-content>
</mat-drawer-container>
```

結果如下：

{% asset_img 10-drawer.png %}

## 本日小結

今天我們介紹了SideNav相關的元件，這是Material Design設計中對於一個基本的APP很重要的環節，因次SideNav也提供來了很多微調顯示效果，讓我們在設計時更能夠應付不同的情境。

明天我們將介紹畫面結構的另一個重要component－Toolbar

本日的程式碼GitHub：https://github.com/wellwind/it-ironman-demo-angular-material/tree/day-05-sidenav

分支：day-05-sidenav

## 相關資源

-   [Material Design - Structure](https://material.io/guidelines/layout/structure.html)
-   [Angular Material - SiddeNav](https://material.angular.io/components/sidenav/overview)
