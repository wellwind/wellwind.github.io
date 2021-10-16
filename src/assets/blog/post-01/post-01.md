---
title: "[Angular Material完全攻略]Angular CDK(5) - Portal"
date: 2018-01-16 15:39:19
category:
  - "Angular Material完全攻略"
  - "Angular"
tags:
  - Material Design
  - Angular Material
  - Angular CDK
---

就讓我們繼續往下看吧！！

<!-- more -->

## 開始使用Angualr CDK的Portal

```typescript;highlightLines=2:18:2:22;
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  exports: [
    PortalModule
  ]
})
export class SharedMaterialModule {}
```

<!-- more -->

### 基本知識

在使用Portal相關功能之前，有兩個簡單名詞要先介紹：

-   **Portal**：真正要被切換的內容，這些內容會用Portal包起來，如果要切換的內容是一個template reference，則會使用`TemplatePortal`；如果是元件(component)，則使用`ComponentPortal`。
-   **PortalOutlet**：實際放置內容的地方，**如果Portal是插頭，那麼PortalOutlet就可以想像成是插座**。

接著我們來實作一個簡單的Tab功能，說明Portal如何動態切換內容！

一般的`<ng-template>`不要加上`cdkPortal`可以嗎？當然可以，只是需要再加工一下，我們先擺上來：

```html
<ng-template #template>
  功能3：我放在ng-template內，但不是TemplatePortal，要用我要記得先包裝一下
</ng-template>
```


{% asset_img 01-template-portal-basic.gif %}

一個簡單的tab功能就這樣完成啦！

### 在cdkPortalOutlet中放置元件(component)

{% note info %}

**溫馨提醒**：老樣子，動態產生的元件記得加入entryComponents。

{% endnote %}

成果如下：

{% asset_img 02-component-portal-basic.gif %}

{% note warning %}

你可能會問為什麼不直接用`{{ name }}`就好了，實際上這樣是最快的方法沒錯，但有時候要傳入的可能是整理後比較複雜的資料，不一定有一個現成的變數放在那邊可以接，就會有需要囉。

{% endnote %}

## 相關資源

-   [NgTemplateOutlet](https://angular.io/api/common/NgTemplateOutlet)
-   [NgComponentOutlet](https://angular.io/api/common/NgComponentOutlet)
-   [Angular Material - CDK - Portal](https://material.angular.io/cdk/portal/overview)
